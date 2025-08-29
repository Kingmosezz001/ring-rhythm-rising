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
  onUpdateSocialMedia: (socialData: Fighter['socialMedia']) => void;
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
  replies?: BoxerReply[];
}

interface BoxerReply {
  boxer: string;
  message: string;
  type: "ignore" | "reply" | "shun" | "follower_defend";
  timestamp: Date;
}

const MediaInterface = ({ fighter, onBack, onUpdateSocialMedia }: MediaInterfaceProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"tiktok" | "instagram">("tiktok");
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const [hashtags, setHashtags] = useState("");

  const realBoxers = [
    "Canelo Alvarez", "Tyson Fury", "Anthony Joshua", "Gervonta Davis", "Ryan Garcia",
    "Devin Haney", "Errol Spence Jr", "Terence Crawford", "Naoya Inoue", "Dmitry Bivol",
    "Shakur Stevenson", "Tank Davis", "Jermell Charlo", "Keith Thurman", "Danny Garcia",
    "Mikey Garcia", "Leo Santa Cruz", "Gary Russell Jr", "Vasiliy Lomachenko", "Teofimo Lopez",
    "Josh Taylor", "Jose Ramirez", "Regis Prograis", "Julius Indongo", "Ivan Baranchyk"
  ];

  const generateBoxerReply = (taggedBoxer: string, postContent: string): BoxerReply | null => {
    const boxerPopularity = Math.random() * 100;
    const myPopularity = fighter.popularity;
    
    // Higher chance of reply if fighter is popular or if the boxer is less popular
    const shouldReply = Math.random() < (myPopularity / 100) * 0.4;
    
    if (!shouldReply) return null;

    const replyTypes = ["reply", "shun", "follower_defend"];
    const replyType = replyTypes[Math.floor(Math.random() * replyTypes.length)];
    
    const replies = {
      reply: [
        `You need to prove yourself first, ${fighter.name}. Talk is cheap! 🥊`,
        `Respect the game, young fighter. You're not ready for this level yet! 💯`,
        `I like the confidence, but let's see you in the ring first! 👑`,
        `Keep training and maybe one day you'll earn a shot! 🔥`
      ],
      shun: [
        `Who is this ${fighter.name}? Never heard of you! 😂`,
        `You're not even on my radar. Come back when you're relevant! 👻`,
        `My team doesn't even know who you are! 🤷‍♂️`,
        `Blocked. Don't @ me until you're somebody! 🚫`
      ],
      follower_defend: [
        `@${fighter.name} needs to stay in their lane! ${taggedBoxer} is the real champion! 👑`,
        `This ${fighter.name} is just looking for clout! ${taggedBoxer} would destroy them! 💪`,
        `${taggedBoxer} fans don't play! @${fighter.name} better watch their mouth! 🔥`,
        `${fighter.name} couldn't last one round with the champ ${taggedBoxer}! 😤`
      ]
    };

    return {
      boxer: replyType === "follower_defend" ? `${taggedBoxer} Fan` : taggedBoxer,
      message: replies[replyType as keyof typeof replies][Math.floor(Math.random() * replies[replyType as keyof typeof replies].length)],
      type: replyType as "reply" | "shun" | "follower_defend",
      timestamp: new Date()
    };
  };

  const handlePost = () => {
    if (!newPost.trim()) {
      toast({
        title: "Empty Post",
        description: "Please write something before posting!",
        variant: "destructive"
      });
      return;
    }

    const baseEngagement = Math.floor(fighter.popularity * 10);
    const likes = baseEngagement + Math.floor(Math.random() * baseEngagement);
    const comments = Math.floor(likes * 0.1) + Math.floor(Math.random() * 50);
    const shares = Math.floor(likes * 0.05) + Math.floor(Math.random() * 20);

    // Check for tagged boxers and generate replies
    const taggedBoxers = realBoxers.filter(boxer => 
      newPost.toLowerCase().includes(`@${boxer.replace(" ", "").toLowerCase()}`)
    );

    const replies: BoxerReply[] = [];
    taggedBoxers.forEach(boxer => {
      const reply = generateBoxerReply(boxer, newPost);
      if (reply) replies.push(reply);
    });

    const post: SocialPost = {
      id: Date.now().toString(),
      platform: activeTab,
      content: newPost,
      likes,
      comments,
      shares,
      timestamp: new Date(),
      hashtags: hashtags.split(",").map(tag => tag.trim()).filter(tag => tag),
      replies
    };

    setPosts(prev => [post, ...prev]);
    setNewPost("");
    setHashtags("");

    // Update social media stats
    const newSocialData = {
      followers: fighter.socialMedia.followers + Math.floor(likes * 0.01),
      totalPosts: fighter.socialMedia.totalPosts + 1,
      totalLikes: fighter.socialMedia.totalLikes + likes,
      totalComments: fighter.socialMedia.totalComments + comments,
      totalShares: fighter.socialMedia.totalShares + shares
    };

    onUpdateSocialMedia(newSocialData);

    toast({
      title: "Posted Successfully!",
      description: `Your ${activeTab} post is now live! ${replies.length > 0 ? `${replies.length} boxer(s) responded!` : ''}`,
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

        {/* Social Media Stats */}
        <Card className="p-6 bg-card border-boxing-red">
          <h3 className="text-lg font-bold text-boxing-gold mb-4">Your Social Media Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-boxing-gold">{fighter.socialMedia.followers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-boxing-gold">{fighter.socialMedia.totalPosts}</div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-boxing-gold">{fighter.socialMedia.totalLikes.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Likes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-boxing-gold">{fighter.socialMedia.totalComments.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Comments</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-boxing-gold">{fighter.socialMedia.totalShares.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Shares</div>
            </div>
          </div>
        </Card>

        {/* Platform Selection */}
        <div className="grid grid-cols-2 gap-6">
          <Card 
            className={`p-6 cursor-pointer transition-all border-2 ${
              activeTab === "tiktok" 
                ? "border-pink-500 bg-gradient-to-b from-pink-500/20 to-purple-600/20" 
                : "border-boxing-red bg-card hover:border-pink-400"
            }`}
            onClick={() => setActiveTab("tiktok")}
          >
            <div className="text-center space-y-3">
              <Video className="h-12 w-12 mx-auto text-pink-500" />
              <h3 className="text-xl font-bold text-pink-500">TikTok</h3>
              <p className="text-sm text-muted-foreground">Short video content platform</p>
              <div className="bg-black rounded-lg p-3 text-white text-xs">
                <div className="flex justify-between items-center mb-2">
                  <span>@{fighter.name.toLowerCase().replace(' ', '')}</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="h-1 bg-pink-500 rounded w-3/4"></div>
                  <div className="h-1 bg-gray-600 rounded w-1/2"></div>
                  <div className="h-1 bg-gray-600 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </Card>

          <Card 
            className={`p-6 cursor-pointer transition-all border-2 ${
              activeTab === "instagram" 
                ? "border-purple-500 bg-gradient-to-b from-purple-500/20 to-pink-500/20" 
                : "border-boxing-red bg-card hover:border-purple-400"
            }`}
            onClick={() => setActiveTab("instagram")}
          >
            <div className="text-center space-y-3">
              <Camera className="h-12 w-12 mx-auto text-purple-500" />
              <h3 className="text-xl font-bold text-purple-500">Instagram</h3>
              <p className="text-sm text-muted-foreground">Photo & story sharing platform</p>
              <div className="bg-white border rounded-lg p-3 text-black text-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    <span className="font-semibold">@{fighter.name.toLowerCase().replace(' ', '')}</span>
                  </div>
                  <div className="text-gray-500">•••</div>
                </div>
                <div className="space-y-1">
                  <div className="h-1 bg-purple-500 rounded w-full"></div>
                  <div className="h-1 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Platform Interface */}
        <Card className="p-6 bg-card border-boxing-red">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">
              <span className={activeTab === "tiktok" ? "text-pink-500" : "text-purple-500"}>
                {activeTab === "tiktok" ? "TikTok" : "Instagram"}
              </span>
              <span className="text-boxing-gold"> Dashboard</span>
            </h3>
            <p className="text-muted-foreground">
              {activeTab === "tiktok" 
                ? "Create viral boxing content and call out opponents" 
                : "Share your training photos and behind-the-scenes content"
              }
            </p>
          </div>

          {/* Post Creation */}
          <div className={`${
            activeTab === "tiktok" 
              ? "bg-gradient-to-r from-pink-500/10 to-purple-600/10 border border-pink-500/30" 
              : "bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30"
          } p-4 rounded-lg mb-6`}>
            <h3 className="text-lg font-bold mb-4">
              <span className={activeTab === "tiktok" ? "text-pink-500" : "text-purple-500"}>
                Create {activeTab === "tiktok" ? "TikTok Video" : "Instagram Post"}
              </span>
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
              className={`font-bold ${
                activeTab === "tiktok" 
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white" 
                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              }`}
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
                    <Badge 
                      className={
                        post.platform === "tiktok" 
                          ? "bg-pink-500 text-white" 
                          : "bg-purple-500 text-white"
                      }
                    >
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
                  
                  {/* Boxer Replies */}
                  {post.replies && post.replies.length > 0 && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">Responses:</h4>
                      {post.replies.map((reply, index) => (
                        <div key={index} className="mb-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={reply.type === "shun" ? "destructive" : reply.type === "follower_defend" ? "secondary" : "default"}
                              className="text-xs"
                            >
                              {reply.boxer}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {reply.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="mt-1">{reply.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
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