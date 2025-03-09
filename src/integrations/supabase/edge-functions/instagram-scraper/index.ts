
// Import Supabase client using the Deno-compatible approach
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { corsHeaders, handleCors } from '../_shared/cors.ts';

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Apify API key
const APIFY_API_TOKEN = Deno.env.get('APIFY_API_TOKEN') ?? '';

// Define the handler for the edge function
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Parse the request body
    const { instagramUrl } = await req.json();
    
    if (!instagramUrl) {
      return new Response(JSON.stringify({ error: 'Instagram URL is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract username from URL
    const usernameMatch = instagramUrl.match(/instagram\.com\/([^/?]+)/);
    if (!usernameMatch) {
      return new Response(JSON.stringify({ error: 'Invalid Instagram URL' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const username = usernameMatch[1];
    
    // Check if we have cached data for this profile
    const { data: existingProfile, error: profileError } = await supabase
      .from('instagram_profiles')
      .select('*')
      .eq('username', username)
      .single();
    
    if (existingProfile) {
      // Get posts for this profile
      const { data: posts, error: postsError } = await supabase
        .from('instagram_posts')
        .select('*')
        .eq('profile_id', existingProfile.id)
        .order('created_at', { ascending: false });
      
      // Check if the data is recent (less than 24 hours old)
      const lastUpdated = new Date(existingProfile.updated_at);
      const now = new Date();
      const hoursSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceUpdate < 24) {
        return new Response(JSON.stringify({ 
          profile: existingProfile,
          posts: posts || [],
          cached: true
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
    
    // If we don't have cached data or it's old, scrape the profile
    console.log(`Scraping Instagram profile for ${username}`);
    
    // Call Apify API to scrape Instagram profile
    const apifyUrl = `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`;
    const apifyResponse = await fetch(apifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        directUrls: [`https://www.instagram.com/${username}/`],
        resultsType: 'details',
        resultsLimit: 20,
      }),
    });
    
    if (!apifyResponse.ok) {
      const errorText = await apifyResponse.text();
      console.error('Apify API error:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to scrape Instagram profile' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const scrapedData = await apifyResponse.json();
    
    if (!scrapedData || scrapedData.length === 0) {
      return new Response(JSON.stringify({ error: 'No data found for this Instagram profile' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const profileData = scrapedData[0];
    
    // Transform and store the profile data
    const profileToInsert = {
      username: profileData.username,
      full_name: profileData.fullName,
      biography: profileData.biography,
      followers_count: profileData.followersCount,
      following_count: profileData.followingCount,
      is_verified: profileData.verified,
      profile_pic_url: profileData.profilePicUrl,
      external_url: profileData.externalUrl,
      posts_count: profileData.postsCount,
      is_private: profileData.private,
    };
    
    // Insert or update the profile
    let profileId;
    if (existingProfile) {
      const { data: updatedProfile, error: updateError } = await supabase
        .from('instagram_profiles')
        .update(profileToInsert)
        .eq('id', existingProfile.id)
        .select()
        .single();
      
      if (updateError) {
        console.error('Error updating profile:', updateError);
        return new Response(JSON.stringify({ error: 'Failed to update profile data' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      profileId = existingProfile.id;
    } else {
      const { data: insertedProfile, error: insertError } = await supabase
        .from('instagram_profiles')
        .insert(profileToInsert)
        .select()
        .single();
      
      if (insertError) {
        console.error('Error inserting profile:', insertError);
        return new Response(JSON.stringify({ error: 'Failed to store profile data' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      profileId = insertedProfile.id;
    }
    
    // Process and store posts
    const posts = profileData.latestPosts || [];
    const postsToInsert = posts.map(post => ({
      profile_id: profileId,
      post_id: post.id,
      caption: post.caption,
      url: post.url,
      likes_count: post.likesCount,
      comments_count: post.commentsCount,
      timestamp: post.timestamp,
      media_type: post.type,
      media_url: post.displayUrl,
    }));
    
    if (postsToInsert.length > 0) {
      // Delete existing posts for this profile
      await supabase
        .from('instagram_posts')
        .delete()
        .eq('profile_id', profileId);
      
      // Insert new posts
      const { error: postsInsertError } = await supabase
        .from('instagram_posts')
        .insert(postsToInsert);
      
      if (postsInsertError) {
        console.error('Error inserting posts:', postsInsertError);
      }
    }
    
    // Record the scraping in history
    await supabase
      .from('instagram_scrape_history')
      .insert({
        profile_id: profileId,
        username: username,
        status: 'success',
      });
    
    // Get the updated profile and posts
    const { data: updatedProfile } = await supabase
      .from('instagram_profiles')
      .select('*')
      .eq('id', profileId)
      .single();
    
    const { data: updatedPosts } = await supabase
      .from('instagram_posts')
      .select('*')
      .eq('profile_id', profileId)
      .order('timestamp', { ascending: false });
    
    return new Response(JSON.stringify({
      profile: updatedProfile,
      posts: updatedPosts || [],
      cached: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error scraping profile:', error);
    return new Response(JSON.stringify({ error: 'Error scraping profile' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
