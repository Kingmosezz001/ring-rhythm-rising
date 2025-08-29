import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Star, Users, Target } from "lucide-react";
import { Fighter } from "./BoxingGame";
import { useToast } from "@/hooks/use-toast";

interface CalloutInterfaceProps {
  fighter: Fighter;
  onBack: () => void;
  onStartFight: (opponent: Fighter) => void;
}

const CalloutInterface = ({ fighter, onBack, onStartFight }: CalloutInterfaceProps) => {
  const { toast } = useToast();
  const [selectedDivision, setSelectedDivision] = useState(fighter.division);

  const realBoxers = {
    "Lightweight": [
      { name: "Gervonta Davis", wins: 28, losses: 0, ko: 26, popularity: 95, difficulty: "Champion" },
      { name: "Ryan Garcia", wins: 24, losses: 1, ko: 20, popularity: 92, difficulty: "Elite" },
      { name: "Devin Haney", wins: 31, losses: 0, ko: 15, popularity: 88, difficulty: "Champion" },
      { name: "Vasyl Lomachenko", wins: 17, losses: 3, ko: 11, popularity: 90, difficulty: "Legend" },
      { name: "Shakur Stevenson", wins: 21, losses: 0, ko: 10, popularity: 85, difficulty: "Elite" },
      { name: "Isaac Cruz", wins: 25, losses: 2, ko: 17, popularity: 75, difficulty: "Contender" },
      { name: "Rolando Romero", wins: 15, losses: 1, ko: 13, popularity: 70, difficulty: "Contender" },
      { name: "Frank Martin", wins: 18, losses: 0, ko: 12, popularity: 65, difficulty: "Rising" }
    ],
    "Welterweight": [
      { name: "Errol Spence Jr.", wins: 28, losses: 1, ko: 22, popularity: 92, difficulty: "Champion" },
      { name: "Terence Crawford", wins: 40, losses: 0, ko: 31, popularity: 95, difficulty: "P4P King" },
      { name: "Jaron Ennis", wins: 31, losses: 0, ko: 28, popularity: 85, difficulty: "Elite" },
      { name: "Virgil Ortiz Jr.", wins: 21, losses: 0, ko: 21, popularity: 80, difficulty: "Rising Star" },
      { name: "Keith Thurman", wins: 30, losses: 1, ko: 22, popularity: 75, difficulty: "Veteran" },
      { name: "Shawn Porter", wins: 31, losses: 4, ko: 17, popularity: 78, difficulty: "Veteran" },
      { name: "Yordenis Ugas", wins: 27, losses: 5, ko: 12, popularity: 70, difficulty: "Contender" },
      { name: "Danny Garcia", wins: 37, losses: 3, ko: 21, popularity: 73, difficulty: "Veteran" }
    ],
    "Middleweight": [
      { name: "Canelo Alvarez", wins: 60, losses: 2, ko: 39, popularity: 100, difficulty: "Superstar" },
      { name: "Gennady Golovkin", wins: 42, losses: 2, ko: 37, popularity: 88, difficulty: "Legend" },
      { name: "Jermall Charlo", wins: 32, losses: 0, ko: 22, popularity: 82, difficulty: "Champion" },
      { name: "Jaime Munguia", wins: 41, losses: 0, ko: 32, popularity: 78, difficulty: "Rising" },
      { name: "Demetrius Andrade", wins: 32, losses: 0, ko: 19, popularity: 75, difficulty: "Elite" },
      { name: "Chris Eubank Jr.", wins: 33, losses: 3, ko: 24, popularity: 72, difficulty: "Contender" },
      { name: "Erislandy Lara", wins: 29, losses: 3, ko: 17, popularity: 68, difficulty: "Veteran" },
      { name: "Austin Williams", wins: 14, losses: 0, ko: 10, popularity: 65, difficulty: "Prospect" }
    ],
    "Light Heavyweight": [
      { name: "Dmitry Bivol", wins: 22, losses: 0, ko: 11, popularity: 90, difficulty: "Champion" },
      { name: "Artur Beterbiev", wins: 20, losses: 0, ko: 20, popularity: 88, difficulty: "KO King" },
      { name: "Gilberto Ramirez", wins: 46, losses: 1, ko: 30, popularity: 75, difficulty: "Contender" },
      { name: "Joe Smith Jr.", wins: 28, losses: 4, ko: 22, popularity: 70, difficulty: "Veteran" },
      { name: "Joshua Buatsi", wins: 17, losses: 0, ko: 13, popularity: 72, difficulty: "Rising" },
      { name: "Anthony Yarde", wins: 23, losses: 3, ko: 22, popularity: 68, difficulty: "Contender" },
      { name: "Callum Johnson", wins: 20, losses: 2, ko: 14, popularity: 65, difficulty: "Contender" },
      { name: "Craig Richards", wins: 18, losses: 4, ko: 10, popularity: 62, difficulty: "Gatekeeper" }
    ],
    "Heavyweight": [
      { name: "Tyson Fury", wins: 34, losses: 0, ko: 24, popularity: 95, difficulty: "Lineal Champ" },
      { name: "Oleksandr Usyk", wins: 21, losses: 0, ko: 14, popularity: 92, difficulty: "Undisputed" },
      { name: "Anthony Joshua", wins: 28, losses: 3, ko: 25, popularity: 90, difficulty: "Former Champ" },
      { name: "Deontay Wilder", wins: 43, losses: 3, ko: 42, popularity: 88, difficulty: "Bronze Bomber" },
      { name: "Andy Ruiz Jr.", wins: 35, losses: 2, ko: 22, popularity: 75, difficulty: "Former Champ" },
      { name: "Dillian Whyte", wins: 30, losses: 3, ko: 20, popularity: 73, difficulty: "Contender" },
      { name: "Luis Ortiz", wins: 33, losses: 2, ko: 28, popularity: 70, difficulty: "Veteran" },
      { name: "Joseph Parker", wins: 33, losses: 3, ko: 23, popularity: 72, difficulty: "Former Champ" }
    ]
  };

  const divisions = ["Lightweight", "Welterweight", "Middleweight", "Light Heavyweight", "Heavyweight"];

  const generateOpponentFromReal = (boxerData: any): Fighter => {
    const statVariation = 10 + Math.random() * 20; // 10-30 point variation
    
    return {
      name: boxerData.name,
      age: 25 + Math.floor(Math.random() * 10),
      division: selectedDivision,
      wins: boxerData.wins,
      losses: boxerData.losses,
      ko: boxerData.ko,
      popularity: boxerData.popularity,
      stamina: 100,
      power: Math.min(100, 60 + statVariation + (boxerData.difficulty === "P4P King" || boxerData.difficulty === "Superstar" ? 20 : 0)),
      speed: Math.min(100, 60 + statVariation + (boxerData.difficulty === "Legend" ? 15 : 0)),
      defense: Math.min(100, 60 + statVariation + (boxerData.difficulty === "Champion" ? 15 : 0)),
      technique: Math.min(100, 55 + statVariation),
      mental: Math.min(100, 55 + statVariation),
      experience: Math.min(100, 50 + (boxerData.wins * 2)),
      injuries: [],
      facialDamage: 0,
      money: 50000,
      energy: 100,
      weeksSinceLastFight: 0,
      unrankedWins: 0,
      socialMedia: {
        followers: Math.floor(boxerData.popularity * 10000),
        totalPosts: Math.floor(Math.random() * 500) + 100,
        totalLikes: Math.floor(boxerData.popularity * 50000),
        totalComments: Math.floor(boxerData.popularity * 5000),
        totalShares: Math.floor(boxerData.popularity * 2500)
      }
    };
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Prospect": case "Rising": return "text-green-500";
      case "Contender": case "Gatekeeper": return "text-yellow-500";
      case "Elite": case "Veteran": return "text-orange-500";
      case "Champion": case "Former Champ": return "text-red-500";
      case "Legend": case "P4P King": case "Superstar": case "Undisputed": case "Lineal Champ": case "KO King": case "Bronze Bomber": return "text-purple-500";
      default: return "text-blue-500";
    }
  };

  const canCallOut = (boxer: any) => {
    const popularityGap = boxer.popularity - fighter.popularity;
    const experienceGap = boxer.wins - fighter.wins;
    
    // More realistic callout restrictions
    if (popularityGap > 40) return false;
    if (experienceGap > 15) return false;
    if (boxer.difficulty === "P4P King" && fighter.wins < 20) return false;
    if (boxer.difficulty === "Superstar" && fighter.wins < 25) return false;
    
    return true;
  };

  const handleCallout = (boxer: any) => {
    if (!canCallOut(boxer)) {
      toast({
        title: "Call-out Rejected",
        description: `${boxer.name} is out of your league right now. Build your reputation first!`,
        variant: "destructive"
      });
      return;
    }

    const acceptanceChance = Math.max(0.3, 1 - ((boxer.popularity - fighter.popularity) / 100));
    
    if (Math.random() < acceptanceChance) {
      const opponent = generateOpponentFromReal(boxer);
      toast({
        title: "Fight Accepted!",
        description: `${boxer.name} has accepted your challenge! Get ready for war!`,
      });
      onStartFight(opponent);
    } else {
      toast({
        title: "Call-out Ignored",
        description: `${boxer.name} isn't interested in fighting you yet. Keep building your name!`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-ring p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-boxing-red text-boxing-red hover:bg-boxing-red/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-boxing-gold">Call Out Fighters</h1>
          
          {/* Manager Advice */}
          <Card className="p-4 bg-muted border-boxing-gold mt-4">
            <h3 className="text-sm font-bold text-boxing-gold mb-2">Manager's Advice</h3>
            <p className="text-xs text-muted-foreground">
              "Look for fighters close to your level. Don't bite off more than you can chew, but don't waste time with easy fights either. 
              Build your reputation step by step and the big names will start taking notice."
            </p>
          </Card>

          {/* Current Callouts */}
          <Card className="p-4 bg-card border-boxing-red mt-4">
            <h3 className="text-sm font-bold text-boxing-gold mb-2">Fighters Calling You Out</h3>
            <div className="space-y-2">
              <div className="p-2 bg-muted rounded">
                <p className="text-xs font-semibold">Jake "The Snake" Williams</p>
                <p className="text-xs text-muted-foreground">"That bum thinks he's ready for real competition? I'll show him what a real fighter looks like!"</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Division Selector */}
        <Card className="p-6 bg-card border-boxing-red">
          <h2 className="text-xl font-bold text-boxing-gold mb-4">Select Division</h2>
          <div className="flex flex-wrap gap-2">
            {divisions.map((division) => (
              <Button
                key={division}
                variant={selectedDivision === division ? "default" : "outline"}
                onClick={() => setSelectedDivision(division)}
                className={selectedDivision === division 
                  ? "bg-gradient-champion text-boxing-dark" 
                  : "border-boxing-red text-boxing-red hover:bg-boxing-red/10"
                }
              >
                {division}
              </Button>
            ))}
          </div>
        </Card>

        {/* Fighter List */}
        <Card className="p-6 bg-card border-boxing-red">
          <h2 className="text-xl font-bold text-boxing-gold mb-4">Available Fighters - {selectedDivision}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {realBoxers[selectedDivision as keyof typeof realBoxers].map((boxer, index) => {
              const canCall = canCallOut(boxer);
              
              return (
                <Card
                  key={index}
                  className={`p-4 transition-all ${canCall 
                    ? "hover:shadow-boxer cursor-pointer border-muted hover:border-boxing-red/50" 
                    : "opacity-50 border-muted cursor-not-allowed"
                  }`}
                  onClick={() => canCall && handleCallout(boxer)}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-boxing-gold text-lg">{boxer.name}</h3>
                      <Badge className={`${getDifficultyColor(boxer.difficulty)} bg-transparent border`}>
                        {boxer.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-boxing-gold" />
                        <span>{boxer.wins}-{boxer.losses} ({boxer.ko} KO)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-boxing-gold" />
                        <span>{boxer.popularity}%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {canCall ? (
                        <Button
                          className="w-full bg-gradient-danger hover:scale-105 transition-transform"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCallout(boxer);
                          }}
                        >
                          <Target className="h-4 w-4 mr-2" />
                          Call Out
                        </Button>
                      ) : (
                        <Button disabled className="w-full">
                          <Users className="h-4 w-4 mr-2" />
                          Out of League
                        </Button>
                      )}
                    </div>
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

export default CalloutInterface;