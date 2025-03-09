
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Instagram } from "lucide-react";

interface InstagramUrlFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const InstagramUrlForm = ({ onSubmit, isLoading }: InstagramUrlFormProps) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!url.trim()) {
      setError("Please enter an Instagram profile URL");
      return;
    }
    
    // Simple URL validation
    if (!url.includes("instagram.com/")) {
      setError("Please enter a valid Instagram URL");
      return;
    }
    
    setError("");
    onSubmit(url);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Instagram className="h-6 w-6 text-pink-500" />
          <CardTitle>Instagram Profile Scraper</CardTitle>
        </div>
        <CardDescription>
          Enter an Instagram profile URL to view followers and recent posts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="https://www.instagram.com/username"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={error ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Scrape Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InstagramUrlForm;
