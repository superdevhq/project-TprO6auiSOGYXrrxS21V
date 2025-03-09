
import { useState } from "react";
import InstagramUrlForm from "@/components/InstagramUrlForm";
import ProfileInfo from "@/components/ProfileInfo";
import FollowersList from "@/components/FollowersList";
import PostsList from "@/components/PostsList";
import { mockInstagramProfile } from "@/lib/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Image } from "lucide-react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = (url: string) => {
    setIsLoading(true);
    setError("");
    
    // Simulate API call with a timeout
    setTimeout(() => {
      try {
        // In a real app, this would be an API call to your backend
        // For now, we'll just use the mock data
        setProfileData(mockInstagramProfile);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch profile data. Please try again.");
        setIsLoading(false);
      }
    }, 1500);
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
