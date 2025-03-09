
// Define CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client using fetch directly
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

// Initialize Apify API key
const APIFY_API_TOKEN = Deno.env.get('APIFY_API_TOKEN') ?? '';

// Define the handler for the edge function
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

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
    const profileResponse = await fetch(`${supabaseUrl}/rest/v1/instagram_profiles?username=eq.${username}&select=*`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    const profiles = await profileResponse.json();
    const existingProfile = profiles.length > 0 ? profiles[0] : null;
    
    if (existingProfile) {
      // Get posts for this profile
      const postsResponse = await fetch(`${supabaseUrl}/rest/v1/instagram_posts?profile_id=eq.${existingProfile.id}&select=*&order=created_at.desc`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      const posts = await postsResponse.json();
      
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
      // Update existing profile
      const updateResponse = await fetch(`${supabaseUrl}/rest/v1/instagram_profiles?id=eq.${existingProfile.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(profileToInsert),
      });
      
      if (!updateResponse.ok) {
        console.error('Error updating profile:', await updateResponse.text());
        return new Response(JSON.stringify({ error: 'Failed to update profile data' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      profileId = existingProfile.id;
    } else {
      // Insert new profile
      const insertResponse = await fetch(`${supabaseUrl}/rest/v1/instagram_profiles`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(profileToInsert),
      });
      
      if (!insertResponse.ok) {
        console.error('Error inserting profile:', await insertResponse.text());
        return new Response(JSON.stringify({ error: 'Failed to store profile data' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      const insertedProfiles = await insertResponse.json();
      profileId = insertedProfiles[0].id;
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
      await fetch(`${supabaseUrl}/rest/v1/instagram_posts?profile_id=eq.${profileId}`, {
        method: 'DELETE',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      });
      
      // Insert new posts
      const postsInsertResponse = await fetch(`${supabaseUrl}/rest/v1/instagram_posts`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postsToInsert),
      });
      
      if (!postsInsertResponse.ok) {
        console.error('Error inserting posts:', await postsInsertResponse.text());
      }
    }
    
    // Record the scraping in history
    await fetch(`${supabaseUrl}/rest/v1/instagram_scrape_history`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profile_id: profileId,
        username: username,
        status: 'success',
      }),
    });
    
    // Get the updated profile and posts
    const updatedProfileResponse = await fetch(`${supabaseUrl}/rest/v1/instagram_profiles?id=eq.${profileId}&select=*`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    const updatedProfiles = await updatedProfileResponse.json();
    const updatedProfile = updatedProfiles.length > 0 ? updatedProfiles[0] : null;
    
    const updatedPostsResponse = await fetch(`${supabaseUrl}/rest/v1/instagram_posts?profile_id=eq.${profileId}&select=*&order=timestamp.desc`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    const updatedPosts = await updatedPostsResponse.json();
    
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
