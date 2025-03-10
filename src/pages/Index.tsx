
import { useState } from "react";
import InstagramUrlForm from "@/components/InstagramUrlForm";
import ProfileInfo from "@/components/ProfileInfo";
import FollowersList from "@/components/FollowersList";
import PostsList from "@/components/PostsList";
import { mockInstagramProfile, InstagramProfile } from "@/lib/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<InstagramProfile | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (url: string) => {
    setIsLoading(true);
    setError("");
    
    try {
      // Call our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('instagram-scraper', {
        body: { instagramUrl: url }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('No data returned from scraper');
      }

      // Transform the API response to match our InstagramProfile interface
      const transformedData: InstagramProfile = {
        username: data.profile.username,
        fullName: data.profile.full_name || data.profile.username,
        profilePicture: data.profile.profile_pic_url || '',
        bio: data.profile.biography || '',
        postsCount: data.profile.posts_count || 0,
        followersCount: data.profile.followers_count || 0,
        followingCount: data.profile.following_count || 0,
        isVerified: data.profile.is_verified || false,
        // Since we don't have followers data from the API, use empty array or mock data
        followers: mockInstagramProfile.followers,
        // Transform posts data
        posts: (data.posts || []).map((post: any) => ({
          id: post.post_id,
          imageUrl: post.media_url,
          caption: post.caption || '',
          likesCount: post.likes_count || 0,
          timestamp: post.timestamp || new Date().toISOString(),
          // Since we don't have comments data from the API, use empty array
          comments: []
        }))
      };

      setProfileData(transformedData);
      
      if (data.cached) {
        toast({
          title: "Using cached data",
          description: "This profile data was retrieved from our cache.",
        });
      }
    } catch (err) {
      console.error('Error scraping profile:', err);
      setError("Failed to scrape profile. Please try again or try a different profile.");
      
      // For development, use mock data as fallback
      toast({
        title: "Using mock data",
        description: "Error connecting to scraper API. Using mock data instead.",
        variant: "destructive"
      });
      setProfileData(mockInstagramProfile);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* URL Input Form */}
          {!profileData && (
            <InstagramUrlForm onSubmit={handleSubmit} isLoading={isLoading} />
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Profile Data */}
          {profileData && (
            <div className="space-y-6">
              {/* Back Button */}
              <button 
                onClick={() => setProfileData(null)}
                className="text-blue-500 hover:text-blue-700 flex items-center gap-1 mb-4"
              >
                ← Back to search
              </button>

              {/* Profile Info */}
              <ProfileInfo profile={profileData} />

              {/* Tabs for Followers and Posts */}
              <Tabs defaultValue="posts" className="w-full">
                <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
                  <TabsTrigger value="posts" className="flex items-center gap-1">
                    <Image className="h-4 w-4" /> Posts
                  </TabsTrigger>
                  <TabsTrigger value="followers" className="flex items-center gap-1">
                    <Users className="h-4 w-4" /> Followers
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="posts" className="mt-6">
                  <PostsList posts={profileData.posts} />
                </TabsContent>
                
                <TabsContent value="followers" className="mt-6">
                  <FollowersList followers={profileData.followers} />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
