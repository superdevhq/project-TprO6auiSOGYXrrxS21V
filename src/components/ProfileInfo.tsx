
import { InstagramProfile } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

interface ProfileInfoProps {
  profile: InstagramProfile;
}

const ProfileInfo = ({ profile }: ProfileInfoProps) => {
  // Format numbers with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* Profile Picture */}
          <div className="relative">
            <img
              src={profile.profilePicture}
              alt={`${profile.username}'s profile`}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-gray-200"
            />
            {profile.isVerified && (
              <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold">{profile.username}</h1>
              {profile.isVerified && (
                <Badge variant="outline" className="bg-blue-50 text-blue-500 border-blue-200">
                  <CheckCircle className="h-3 w-3 mr-1" /> Verified
                </Badge>
              )}
            </div>
            <h2 className="text-lg font-medium text-gray-700 mb-2">{profile.fullName}</h2>
            
            <div className="flex justify-center md:justify-start gap-6 mb-4">
              <div className="text-center">
                <p className="font-bold">{formatNumber(profile.postsCount)}</p>
                <p className="text-sm text-gray-500">Posts</p>
              </div>
              <div className="text-center">
                <p className="font-bold">{formatNumber(profile.followersCount)}</p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold">{formatNumber(profile.followingCount)}</p>
                <p className="text-sm text-gray-500">Following</p>
              </div>
            </div>
            
            <p className="text-gray-700 whitespace-pre-line">{profile.bio}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileInfo;
