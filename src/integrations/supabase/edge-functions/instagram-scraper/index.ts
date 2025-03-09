
// Define CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    
    // Scrape the profile
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
    
    // Transform the profile data
    const profile = {
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
    
    // Process posts
    const posts = (profileData.latestPosts || []).map(post => ({
      post_id: post.id,
      caption: post.caption,
      url: post.url,
      likes_count: post.likesCount,
      comments_count: post.commentsCount,
      timestamp: post.timestamp,
      media_type: post.type,
      media_url: post.displayUrl,
    }));
    
    // Return the scraped data
    return new Response(JSON.stringify({
      profile,
      posts,
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
