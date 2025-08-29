import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Dumbbell, Zap, Shield, Target, Heart, Brain } from "lucide-react";
import { Fighter } from "./BoxingGame";

interface TrainingInterfaceProps {
  fighter: Fighter;
  onTrainStat: (stat: string) => void;
  onBack: () => void;
}

const TrainingInterface = ({ fighter, onTrainStat, onBack }: TrainingInterfaceProps) => {
  const trainingOptions = [
    {
      id: "power",
      name: "Power Training",
      description: "Heavy bag work and strength training",
      icon: Dumbbell,
      currentValue: fighter.power,
      color: "text-red-500"
    },
    {
      id: "speed",
      name: "Speed Training", 
      description: "Agility drills and reaction training",
      icon: Zap,
      currentValue: fighter.speed,
      color: "text-yellow-500"
    },
    {
      id: "defense",
      name: "Defense Training",
      description: "Defensive positioning and blocking",
      icon: Shield,
      currentValue: fighter.defense,
      color: "text-blue-500"
    },
    {
      id: "stamina",
      name: "Cardio Training",
      description: "Endurance and cardiovascular fitness",
      icon: Heart,
      currentValue: fighter.stamina,
      color: "text-green-500"
    },
    {
      id: "technique",
      name: "Technique Training",
      description: "Boxing fundamentals and form",
      icon: Target,
      currentValue: fighter.experience,
      color: "text-purple-500"
    },
    {
      id: "mental",
      name: "Mental Training",
      description: "Focus, strategy and ring IQ",
      icon: Brain,
      currentValue: Math.floor(fighter.experience / 2),
      color: "text-indigo-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-ring p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-boxing-red text-boxing-red hover:bg-boxing-red/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-boxing-gold">Training Facility</h1>
          
          {/* Training Equipment and Facilities */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 bg-muted border-boxing-gold">
              <h3 className="text-sm font-bold text-boxing-gold mb-2">Equipment Available</h3>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>🥊 Heavy Bags - Power Training</p>
                <p>⚡ Speed Bags - Hand-Eye Coordination</p>
                <p>🛡️ Defensive Mitts - Blocking & Slipping</p>
                <p>❤️ Cardio Equipment - Endurance</p>
                <p>🎯 Precision Pads - Technique</p>
                <p>🧠 Mental Coaching - Ring IQ</p>
              </div>
            </Card>
            
            <Card className="p-4 bg-muted border-boxing-gold">
              <h3 className="text-sm font-bold text-boxing-gold mb-2">Training Schedule</h3>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>📅 Monday-Friday: Main Training</p>
                <p>⚡ Saturday: Light Technical Work</p>
                <p>💤 Sunday: Rest & Recovery</p>
                <p>⚠️ Training costs energy - manage wisely</p>
                <p>🎯 Focus on weak areas for best results</p>
              </div>
            </Card>
          </div>
        </div>

        <Card className="p-6 bg-card border-boxing-red">
          <h2 className="text-xl font-bold text-boxing-gold mb-4">Choose Your Training Focus</h2>
          <p className="text-muted-foreground mb-6">
            Select an area to improve. Each training session will boost your skills and experience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trainingOptions.map((option) => {
              const Icon = option.icon;
              const isMaxed = option.currentValue >= 100;

              return (
                <Card
                  key={option.id}
                  className="p-4 hover:shadow-boxer transition-all cursor-pointer border-muted hover:border-boxing-red/50"
                  onClick={() => !isMaxed && onTrainStat(option.id)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className={`h-6 w-6 ${option.color}`} />
                    <h3 className="font-bold text-boxing-gold">{option.name}</h3>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {option.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Level</span>
                      <span>{option.currentValue}</span>
                    </div>
                    <Progress value={option.currentValue} className="h-2" />
                    
                    {isMaxed ? (
                      <Badge variant="secondary" className="w-full justify-center">
                        MAXED OUT
                      </Badge>
                    ) : (
                      <Button
                        className="w-full bg-gradient-champion text-boxing-dark hover:scale-105 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTrainStat(option.id);
                        }}
                      >
                        Train (+1-3 points)
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TrainingInterface;