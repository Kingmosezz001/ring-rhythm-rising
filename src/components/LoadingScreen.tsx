import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Dumbbell, Users, Star } from "lucide-react";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("Entering the boxing world...");

  const loadingMessages = [
    "Entering the boxing world...",
    "Setting up your training facility...",
    "Preparing your corner team...",
    "Generating opponents database...",
    "Ready to rumble!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        
        // Update message based on progress
        if (newProgress >= 80) {
          setCurrentMessage(loadingMessages[4]);
        } else if (newProgress >= 60) {
          setCurrentMessage(loadingMessages[3]);
        } else if (newProgress >= 40) {
          setCurrentMessage(loadingMessages[2]);
        } else if (newProgress >= 20) {
          setCurrentMessage(loadingMessages[1]);
        }
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(onLoadingComplete, 500);
          return 100;
        }
        
        return newProgress;
      });
    }, 80); // 4 seconds total

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="min-h-screen bg-gradient-ring flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 bg-card border-boxing-red shadow-champion">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-gradient-champion bg-clip-text text-transparent">
              RING LEGENDS
            </h1>
            <p className="text-xl text-muted-foreground">
              Rise from unknown fighter to boxing champion
            </p>
          </div>
          
          <div className="space-y-6">
            {/* Animated boxing icons */}
            <div className="flex justify-center space-x-8">
              <div className="animate-bounce" style={{ animationDelay: '0ms' }}>
                <Trophy className="h-12 w-12 text-boxing-gold" />
              </div>
              <div className="animate-bounce" style={{ animationDelay: '200ms' }}>
                <Dumbbell className="h-12 w-12 text-boxing-red" />
              </div>
              <div className="animate-bounce" style={{ animationDelay: '400ms' }}>
                <Users className="h-12 w-12 text-boxing-gold" />
              </div>
              <div className="animate-bounce" style={{ animationDelay: '600ms' }}>
                <Star className="h-12 w-12 text-boxing-red" />
              </div>
            </div>
            
            {/* Loading progress */}
            <div className="space-y-4">
              <Progress value={progress} className="h-4 bg-secondary" />
              <p className="text-lg font-semibold text-boxing-gold">{currentMessage}</p>
              <Badge variant="outline" className="text-sm px-4 py-2 border-boxing-red text-boxing-red">
                {progress}% Complete
              </Badge>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Preparing your journey to become a boxing legend...
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoadingScreen;