import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Fighter } from "./BoxingGame";
import { ArrowLeft, Heart, MessageCircle, Share, Send, Camera, Video, Hash, AtSign } from "lucide-react";

interface MediaInterfaceProps {
  fighter: Fighter;
  onBack: () => void;
}

interface SocialPost {
  id: string;
  platform: "tiktok" | "instagram";
  content: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: Date;
  hashtags: string[];
}

const MediaInterface = ({ fighter, onBack }: MediaInterfaceProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"tiktok" | "instagram">("tiktok");
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const [hashtags, setHashtags] = useState("");

  const realBoxers = [
    "Canelo Alvarez", "Tyson Fury", "Anthony Joshua", "Gervonta Davis", "Ryan Garcia",
    "Devin Haney", "Errol Spence Jr", "Terence Crawford", "Naoya Inoue", "Dmitry Bivol"
  ];

  const handlePost = () => {
    if (!newPost.trim()) {
      toast({
        title: "Empty Post",
        description: "Please write something before posting!",
        variant: "destructive"
      });
      return;
    }

    const post: SocialPost = {
      id: Date.now().toString(),
      platform: activeTab,
      content: newPost,
      likes: Math.floor(Math.random() * fighter.popularity * 10),
      comments: Math.floor(Math.random() * fighter.popularity * 2),
      shares: Math.floor(Math.random() * fighter.popularity),
      timestamp: new Date(),
      hashtags: hashtags.split(",").map(tag => tag.trim()).filter(tag => tag)
    };

    setPosts(prev => [post, ...prev]);
    setNewPost("");
    setHashtags("");

    toast({
      title: "Posted Successfully!",
      description: `Your ${activeTab} post is now live!`,
    });
  };

  const trashTalkTemplates = [
    `${realBoxers[Math.floor(Math.random() * realBoxers.length)]} wouldn't last 3 rounds with me! 🥊`,
    "I'm coming for all the champions in my division! Nobody can stop this momentum! 💪",
    "Training harder than ever. The hunger is real! Who wants the smoke? 🔥",
    `${realBoxers[Math.floor(Math.random() * realBoxers.length)]} talks too much for someone I'd knock out cold! 😤`,
    "Champions are made in the gym, not on social media. I'm ready to prove it! 👑"
  ];

  const addTrashTalk = () => {
    const template = trashTalkTemplates[Math.floor(Math.random() * trashTalkTemplates.length)];
    setNewPost(template);
  };

  return (
    <div className="min-h-screen bg-gradient-ring p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6 bg-card border-boxing-red">
          <div className="flex items-center justify-between">
            <Button
              onClick={onBack}
              variant="outline"
              className="border-boxing-red text-boxing-red hover:bg-boxing-red/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Career
            </Button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-boxing-gold">SOCIAL MEDIA</h1>
              <p className="text-muted-foreground">Build your fanbase and call out opponents</p>
            </div>
            <div className="w-24"></div>
          </div>
        </Card>

        {/* Platform Tabs */}
        <Card className="p-6 bg-card border-boxing-red">
          <div className="flex gap-4 mb-6">
            <Button
              onClick={() => setActiveTab("tiktok")}
              variant={activeTab === "tiktok" ? "default" : "outline"}
              className={activeTab === "tiktok" ? "bg-gradient-danger" : "border-boxing-red text-boxing-red"}
            >
              <Video className="h-4 w-4 mr-2" />
              TikTok
            </Button>
            <Button
              onClick={() => setActiveTab("instagram")}
              variant={activeTab === "instagram" ? "default" : "outline"}
              className={activeTab === "instagram" ? "bg-gradient-danger" : "border-boxing-red text-boxing-red"}
            >
              <Camera className="h-4 w-4 mr-2" />
              Instagram
            </Button>
          </div>

          {/* Post Creation */}
          <div className="bg-muted p-4 rounded-lg mb-6">
            <h3 className="text-lg font-bold text-boxing-gold mb-4">
              Create {activeTab === "tiktok" ? "TikTok Video" : "Instagram Post"}
            </h3>
            <Textarea
              placeholder={`What's on your mind, ${fighter.name}? Share your thoughts, call out opponents, or motivate your fans!`}
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="mb-3"
              rows={4}
            />
            <Input
              placeholder="Add hashtags (comma separated): boxing, champion, training..."
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="mb-3"
            />
            <div className="flex gap-2 mb-3">
              <Button
                onClick={addTrashTalk}
                variant="outline"
                size="sm"
                className="border-boxing-gold text-boxing-gold"
              >
                <Hash className="h-4 w-4 mr-1" />
                Trash Talk
              </Button>
              <Button
                onClick={() => setNewPost(newPost + ` @${realBoxers[Math.floor(Math.random() * realBoxers.length)].replace(" ", "").toLowerCase()}`)}
                variant="outline"
                size="sm"
                className="border-boxing-gold text-boxing-gold"
              >
                <AtSign className="h-4 w-4 mr-1" />
                Tag Boxer
              </Button>
            </div>
            <Button
              onClick={handlePost}
              className="bg-gradient-champion text-boxing-dark font-bold"
            >
              <Send className="h-4 w-4 mr-2" />
              Post to {activeTab === "tiktok" ? "TikTok" : "Instagram"}
            </Button>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-boxing-gold">Your Recent Posts</h3>
            {posts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No posts yet. Start building your social media presence!</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-background p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={post.platform === "tiktok" ? "destructive" : "secondary"}>
                      {post.platform === "tiktok" ? "TikTok" : "Instagram"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {post.timestamp.toLocaleDateString()} at {post.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="mb-3">{post.content}</p>
                  {post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.hashtags.map((tag, index) => (
                        <span key={index} className="text-sm text-boxing-gold">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share className="h-4 w-4" />
                      <span>{post.shares.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MediaInterface;