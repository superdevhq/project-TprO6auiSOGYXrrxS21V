
import { Follower } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FollowersListProps {
  followers: Follower[];
}

const FollowersList = ({ followers }: FollowersListProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-500" />
          <CardTitle className="text-xl">Followers</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {followers.map((follower) => (
              <div key={follower.id} className="flex items-center gap-3">
                <img
                  src={follower.profilePicture}
                  alt={follower.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-medium truncate">{follower.username}</p>
                    {follower.isVerified && (
                      <CheckCircle className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{follower.fullName}</p>
                </div>
                <button className="text-xs font-medium text-blue-500 hover:text-blue-700">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FollowersList;
