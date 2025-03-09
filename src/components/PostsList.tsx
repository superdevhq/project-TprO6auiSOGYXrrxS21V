
import { Post } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MessageCircle, Image, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

interface PostsListProps {
  posts: Post[];
}

const PostsList = ({ posts }: PostsListProps) => {
  // Format numbers with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Image className="h-5 w-5 text-gray-500" />
          <CardTitle className="text-xl">Recent Posts</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden border-gray-200 hover:shadow-md transition-shadow">
              <div className="relative pb-[100%]">
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-sm">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>{formatNumber(post.likesCount)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.timestamp)}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 line-clamp-2 mb-2">{post.caption}</p>
                
                <Tabs defaultValue="comments">
                  <TabsList className="w-full">
                    <TabsTrigger value="comments" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-1" /> Comments
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="comments" className="mt-2">
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {post.comments.slice(0, 5).map((comment) => (
                        <div key={comment.id} className="flex gap-2">
                          <img
                            src={comment.profilePicture}
                            alt={comment.username}
                            className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="text-xs">
                            <span className="font-medium">{comment.username}</span>{" "}
                            <span className="text-gray-700">{comment.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostsList;
