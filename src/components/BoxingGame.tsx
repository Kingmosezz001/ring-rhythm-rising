import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import RegistrationForm from "./RegistrationForm";
import FightInterface from "./FightInterface";
import TrainingInterface from "./TrainingInterface";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sword, Dumbbell, Users, MessageSquare, Trophy, Calendar, Settings, Star } from "lucide-react";

export interface Fighter {
  name: string;
  age: number;
  division: string;
  wins: number;
  losses: number;
  ko: number;
  popularity: number;
  stamina: number;
  power: number;
  speed: number;
  defense: number;
  experience: number;
}

export interface Manager {
  name: string;
  reputation: number;
  advice: string[];
}

export interface FightChoice {
  id: string;
  text: string;
  type: "aggressive" | "defensive" | "tactical" | "risky";
  staminaCost: number;
  successChance: number;
}

const BoxingGame = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<"registration" | "menu" | "career" | "fight" | "training">("registration");
  const [fighter, setFighter] = useState<Fighter | null>(null);

  const [manager] = useState<Manager>({
    name: "Tony Martinez",
    reputation: 75,
    advice: [
      "Focus on building your fundamentals first, kid.",
      "Don't rush into big fights too early.",
      "Train hard, but don't overtrain."
    ]
  });

  const [currentFight, setCurrentFight] = useState<{
    opponent: Fighter;
    round: number;
    playerScore: number;
    opponentScore: number;
    commentary: string[];
    crowdMood: "excited" | "bored" | "hostile" | "electric";
  } | null>(null);

  const divisions = ["Lightweight", "Welterweight", "Middleweight", "Light Heavyweight", "Heavyweight"];

  const handleCreateFighter = (newFighter: Fighter) => {
    setFighter(newFighter);
    setGameState("menu");
  };

  const generateOpponent = (): Fighter => {
    if (!fighter) return {} as Fighter;
    
    const names = ["Mike Johnson", "Carlos Ramirez", "Tommy Wilson", "Angelo Bruno", "Vladimir Petrov"];
    const selectedName = names[Math.floor(Math.random() * names.length)];
    
    const baseStats = {
      power: 60 + Math.random() * 20,
      speed: 60 + Math.random() * 20,
      defense: 60 + Math.random() * 20
    };

    return {
      name: selectedName,
      age: 20 + Math.floor(Math.random() * 15),
      division: fighter.division,
      wins: Math.floor(Math.random() * 10),
      losses: Math.floor(Math.random() * 3),
      ko: Math.floor(Math.random() * 5),
      popularity: 20 + Math.random() * 60,
      stamina: 100,
      ...baseStats,
      experience: Math.floor(Math.random() * 50)
    };
  };

  const fightChoices: FightChoice[] = [
    {
      id: "A",
      text: "Throw a powerful right hook",
      type: "aggressive",
      staminaCost: 15,
      successChance: 0.6
    },
    {
      id: "B", 
      text: "Use quick jabs and footwork",
      type: "tactical",
      staminaCost: 8,
      successChance: 0.75
    },
    {
      id: "C",
      text: "Focus on defense and counter",
      type: "defensive", 
      staminaCost: 5,
      successChance: 0.8
    },
    {
      id: "D",
      text: "Go for a risky combination",
      type: "risky",
      staminaCost: 20,
      successChance: 0.4
    }
  ];

  const generateCommentary = (choice: FightChoice, success: boolean, round: number) => {
    const aggressive = success 
      ? ["WHAT A SHOT! That rocked his opponent!", "Beautiful power punch connects!", "The crowd is on their feet!"]
      : ["He swung for the fences but missed!", "That wild swing left him exposed!", "Too aggressive, not enough setup!"];
    
    const tactical = success
      ? ["Smart boxing here, picking his shots!", "Textbook technique on display!", "Working behind that jab beautifully!"]
      : ["Good plan but the execution wasn't there!", "His opponent read that coming!", "Needs to mix it up more!"];
    
    const defensive = success 
      ? ["Excellent defense! He's hard to hit!", "Making his opponent miss and pay!", "Boxing IQ on full display!"]
      : ["Playing it too safe here!", "Not enough offense to win rounds!", "The crowd wants more action!"];
    
    const risky = success
      ? ["INCREDIBLE COMBINATION! What a sequence!", "High risk, high reward! It paid off!", "That's the kind of shot that ends fights!"]
      : ["He went for broke and it backfired!", "Reckless abandon but no results!", "Left himself wide open there!"];

    const commentaries = { aggressive, tactical, defensive, risky };
    const options = commentaries[choice.type];
    return options[Math.floor(Math.random() * options.length)];
  };

  const startFight = () => {
    const opponent = generateOpponent();
    setCurrentFight({
      opponent,
      round: 1,
      playerScore: 0,
      opponentScore: 0,
      commentary: [`Ladies and gentlemen, welcome to tonight's main event! In the red corner, we have ${fighter.name}!`],
      crowdMood: "excited"
    });
    setGameState("fight");
  };

  const makeFightChoice = (choice: FightChoice, result: string) => {
    if (!currentFight || !fighter) return;

    const newStamina = Math.max(0, fighter.stamina - choice.staminaCost);
    const success = Math.random() < choice.successChance;
    const points = success ? (choice.type === "risky" ? 3 : choice.type === "aggressive" ? 2 : 1) : 0;
    
    // Opponent logic (simplified)
    const opponentPoints = Math.random() < 0.5 ? 1 : 0;
    
    setFighter(prev => prev ? ({ ...prev, stamina: newStamina }) : null);
    
    setCurrentFight(prev => {
      if (!prev) return null;
      
      const newPlayerScore = prev.playerScore + points;
      const newOpponentScore = prev.opponentScore + opponentPoints;
      const newCommentary = [...prev.commentary, result];
      
      // Check if fight should end
      if (prev.round >= 10 || newStamina <= 20) {
        const won = newPlayerScore > newOpponentScore;
        endFight(won);
        return null;
      }
      
      return {
        ...prev,
        playerScore: newPlayerScore,
        opponentScore: newOpponentScore,
        commentary: newCommentary,
        round: prev.round < 10 ? prev.round + 1 : prev.round
      };
    });
  };

  const endFight = (won: boolean) => {
    if (!fighter) return;
    
    if (won) {
      setFighter(prev => prev ? ({
        ...prev,
        wins: prev.wins + 1,
        experience: prev.experience + 10,
        popularity: Math.min(100, prev.popularity + 5),
        stamina: 100
      }) : null);
      toast({
        title: "Victory!",
        description: "You won the fight! Your reputation grows.",
      });
    } else {
      setFighter(prev => prev ? ({
        ...prev,
        losses: prev.losses + 1,
        experience: prev.experience + 3,
        stamina: 100
      }) : null);
      toast({
        title: "Defeat",
        description: "You lost this one, but you learned from it.",
        variant: "destructive"
      });
    }
    setCurrentFight(null);
    setGameState("career");
  };

  const trainStat = (stat: string) => {
    if (!fighter) return;
    
    const improvement = 2 + Math.floor(Math.random() * 4); // 2-5 points
    
    setFighter(prev => {
      if (!prev) return null;
      
      const updates: Partial<Fighter> = { experience: prev.experience + 3 };
      
      switch (stat) {
        case "power":
          updates.power = Math.min(100, prev.power + improvement);
          break;
        case "speed":
          updates.speed = Math.min(100, prev.speed + improvement);
          break;
        case "defense":
          updates.defense = Math.min(100, prev.defense + improvement);
          break;
        case "stamina":
          updates.stamina = Math.min(100, prev.stamina + improvement);
          break;
        case "technique":
        case "mental":
          updates.experience = prev.experience + improvement;
          break;
      }
      
      return { ...prev, ...updates };
    });
    
    toast({
      title: "Training Complete",
      description: `${stat.charAt(0).toUpperCase() + stat.slice(1)} improved by ${improvement} points!`,
    });
  };

  if (gameState === "registration") {
    return <RegistrationForm onCreateFighter={handleCreateFighter} />;
  }

  if (!fighter) {
    return <div>Loading...</div>;
  }

  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-gradient-ring flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 bg-card border-boxing-red shadow-champion">
          <div className="text-center space-y-6">
            <h1 className="text-6xl font-bold bg-gradient-champion bg-clip-text text-transparent">
              RING LEGENDS
            </h1>
            <p className="text-xl text-muted-foreground">
              Rise from unknown fighter to boxing champion
            </p>
            <div className="space-y-4">
              <Button 
                onClick={() => setGameState("career")}
                className="w-full bg-gradient-champion text-boxing-dark font-bold text-lg py-6 hover:scale-105 transition-transform"
              >
                START CAREER
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-boxing-red text-boxing-red hover:bg-boxing-red/10"
              >
                LOAD SAVE
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (gameState === "fight" && currentFight) {
    return (
      <FightInterface 
        fighter={fighter}
        currentFight={currentFight}
        onFightChoice={makeFightChoice}
        onEndFight={endFight}
      />
    );
  }

  if (gameState === "training") {
    return (
      <TrainingInterface
        fighter={fighter}
        onTrainStat={trainStat}
        onBack={() => setGameState("career")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-ring p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Boxer Avatar & Profile Header */}
        <Card className="p-8 bg-card border-boxing-red shadow-champion">
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar className="h-32 w-32 border-4 border-boxing-gold shadow-boxer">
              <AvatarImage src="/placeholder.svg" alt={fighter.name} />
              <AvatarFallback className="bg-gradient-champion text-boxing-dark text-2xl font-bold">
                {fighter.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className="text-4xl font-bold text-boxing-gold mb-2">{fighter.name}</h1>
              <div className="flex items-center gap-4 text-lg">
                <span className="font-semibold">{fighter.age} years old</span>
                <span className="font-semibold">{fighter.division}</span>
                <div className="flex items-center gap-1">
                  <Trophy className="h-5 w-5 text-boxing-gold" />
                  <span className="font-bold">{fighter.wins}-{fighter.losses} ({fighter.ko} KO)</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Star className="h-5 w-5 text-boxing-gold" />
                <span className="font-semibold">Popularity: {fighter.popularity}%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Overview */}
        <Card className="p-6 bg-card border-boxing-red">
          <h3 className="text-xl font-bold text-boxing-gold mb-4">Fighter Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Power", value: fighter.power, color: "text-red-500" },
              { name: "Speed", value: fighter.speed, color: "text-yellow-500" },
              { name: "Defense", value: fighter.defense, color: "text-blue-500" },
              { name: "Experience", value: fighter.experience, color: "text-purple-500" }
            ].map((stat) => (
              <div key={stat.name} className="text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.name}</p>
                <Progress value={stat.value} className="h-2 mt-1" />
              </div>
            ))}
          </div>
        </Card>

        {/* Manager Advice */}
        <Card className="p-6 bg-card border-boxing-red">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg" alt={manager.name} />
              <AvatarFallback className="bg-muted">
                {manager.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-bold text-boxing-gold">{manager.name}</h3>
              <p className="text-sm text-muted-foreground">Your Manager</p>
            </div>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <p className="italic">"{manager.advice[Math.floor(Math.random() * manager.advice.length)]}"</p>
          </div>
        </Card>

        {/* Action Buttons */}
        <Card className="p-6 bg-card border-boxing-red">
          <h3 className="text-xl font-bold text-boxing-gold mb-6">Career Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <Button 
              onClick={startFight}
              className="h-20 bg-gradient-danger hover:scale-105 transition-transform flex flex-col gap-1"
            >
              <Sword className="h-6 w-6" />
              <span className="text-sm font-bold">FIND FIGHT</span>
            </Button>
            
            <Button 
              onClick={() => setGameState("training")}
              className="h-20 bg-gradient-champion text-boxing-dark hover:scale-105 transition-transform flex flex-col gap-1"
            >
              <Dumbbell className="h-6 w-6" />
              <span className="text-sm font-bold">TRAINING</span>
            </Button>
            
            <Button 
              variant="outline"
              className="h-20 border-boxing-red text-boxing-red hover:bg-boxing-red/10 flex flex-col gap-1"
            >
              <Users className="h-6 w-6" />
              <span className="text-sm font-bold">CALL OUT</span>
            </Button>
            
            <Button 
              variant="outline"
              className="h-20 border-boxing-red text-boxing-red hover:bg-boxing-red/10 flex flex-col gap-1"
            >
              <MessageSquare className="h-6 w-6" />
              <span className="text-sm font-bold">MANAGER</span>
            </Button>
            
            <Button 
              variant="outline"
              className="h-20 border-boxing-red text-boxing-red hover:bg-boxing-red/10 flex flex-col gap-1"
            >
              <Calendar className="h-6 w-6" />
              <span className="text-sm font-bold">SCHEDULE</span>
            </Button>
            
            <Button 
              variant="outline"
              className="h-20 border-boxing-red text-boxing-red hover:bg-boxing-red/10 flex flex-col gap-1"
            >
              <Settings className="h-6 w-6" />
              <span className="text-sm font-bold">SETTINGS</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BoxingGame;