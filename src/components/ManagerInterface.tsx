import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, MessageCircle, Briefcase, Target, TrendingUp } from "lucide-react";
import { Fighter } from "./BoxingGame";

interface ManagerInterfaceProps {
  fighter: Fighter;
  onBack: () => void;
  manager: {
    name: string;
    reputation: number;
    advice: string[];
  };
  offers: {type: string, message: string, id: string}[];
}

const ManagerInterface = ({ fighter, onBack, manager, offers }: ManagerInterfaceProps) => {
  const getCurrentAdvice = () => {
    if (fighter.wins < 3) {
      return "You need to focus on building your fundamentals. Fight more unranked opponents to gain experience before calling out ranked fighters.";
    }
    if (fighter.energy < 50) {
      return "You're looking tired, champ. Take some time to rest before your next fight. Energy management is crucial for peak performance.";
    }
    if (fighter.popularity < 30) {
      return "We need to work on your public image. Consider doing more media appearances and winning fights impressively to boost your popularity.";
    }
    return "You're on the right track! Keep training hard and taking smart fights. Your next opponent should be someone who can help build your reputation.";
  };

  return (
    <div className="min-h-screen bg-gradient-ring p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-boxing-red text-boxing-red hover:bg-boxing-red/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-boxing-gold">Manager Meeting</h1>
        </div>

        {/* Manager Info */}
        <Card className="p-4 bg-card border-boxing-red">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg" alt={manager.name} />
              <AvatarFallback className="bg-gradient-champion text-boxing-dark">
                {manager.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-boxing-gold">{manager.name}</h2>
              <p className="text-sm text-muted-foreground">Your Manager</p>
              <Badge className="bg-boxing-gold text-boxing-dark mt-1">
                Reputation: {manager.reputation}%
              </Badge>
            </div>
          </div>
        </Card>

        {/* Organized Advice Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Current Advice */}
          <Card className="p-3 bg-card border-boxing-gold">
            <div className="flex items-start gap-2">
              <MessageCircle className="h-3 w-3 text-boxing-gold mt-1 flex-shrink-0" />
               <div className="space-y-1">
                <h3 className="text-[8px] font-bold text-boxing-gold">Strategic Advice</h3>
                <p className="text-[6px] text-muted-foreground leading-tight">{getCurrentAdvice()}</p>
              </div>
            </div>
          </Card>

          {/* Fight Offers */}
          <Card className="p-3 bg-card border-boxing-red">
            <div className="flex items-start gap-2">
              <Briefcase className="h-3 w-3 text-boxing-red mt-1 flex-shrink-0" />
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-boxing-gold">Opportunities</h3>
                <div className="space-y-1">
                  <div className="p-2 bg-muted rounded border-l-2 border-green-500">
                    <p className="text-[9px] font-medium text-green-600">Tournament</p>
                    <p className="text-[8px] text-muted-foreground">Local event, $50K prize</p>
                  </div>
                  <div className="p-2 bg-muted rounded border-l-2 border-blue-500">
                    <p className="text-[9px] font-medium text-blue-600">Media</p>
                    <p className="text-[8px] text-muted-foreground">Boxing Weekly feature</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Performance Analysis */}
          <Card className="p-3 bg-card border-boxing-red">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-3 w-3 text-boxing-gold mt-1 flex-shrink-0" />
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-boxing-gold">Analysis</h3>
                <div className="space-y-1">
                  <div className="space-y-0.5">
                    <h4 className="text-[9px] font-medium text-green-600">Strengths</h4>
                    <div className="space-y-0.5">
                      {fighter.power > 70 && <p className="text-[8px] text-green-600">• Power</p>}
                      {fighter.speed > 70 && <p className="text-[8px] text-green-600">• Speed</p>}
                      {fighter.defense > 70 && <p className="text-[8px] text-green-600">• Defense</p>}
                      {fighter.technique > 70 && <p className="text-[8px] text-green-600">• Technique</p>}
                      {fighter.mental > 70 && <p className="text-[8px] text-green-600">• Mental</p>}
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-[9px] font-medium text-red-600">Improve</h4>
                    <div className="space-y-0.5">
                      {fighter.power < 60 && <p className="text-[8px] text-red-600">• Power</p>}
                      {fighter.speed < 60 && <p className="text-[8px] text-red-600">• Speed</p>}
                      {fighter.defense < 60 && <p className="text-[8px] text-red-600">• Defense</p>}
                      {fighter.technique < 60 && <p className="text-[8px] text-red-600">• Technique</p>}
                      {fighter.mental < 60 && <p className="text-[8px] text-red-600">• Mental</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManagerInterface;