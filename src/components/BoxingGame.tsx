import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

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
  const [gameState, setGameState] = useState<"menu" | "career" | "fight" | "training">("menu");
  const [fighter, setFighter] = useState<Fighter>({
    name: "Rookie Fighter",
    age: 18,
    division: "Lightweight",
    wins: 0,
    losses: 0,
    ko: 0,
    popularity: 10,
    stamina: 100,
    power: 65,
    speed: 70,
    defense: 60,
    experience: 0
  });

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

  const generateOpponent = (): Fighter => {
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

  const makeFightChoice = (choice: FightChoice) => {
    if (!currentFight) return;

    const newStamina = Math.max(0, fighter.stamina - choice.staminaCost);
    const success = Math.random() < choice.successChance;
    const points = success ? (choice.type === "risky" ? 3 : choice.type === "aggressive" ? 2 : 1) : 0;
    
    // Opponent logic (simplified)
    const opponentPoints = Math.random() < 0.5 ? 1 : 0;
    
    const commentary = generateCommentary(choice, success, currentFight.round);
    
    setFighter(prev => ({ ...prev, stamina: newStamina }));
    
    setCurrentFight(prev => {
      if (!prev) return null;
      
      const newPlayerScore = prev.playerScore + points;
      const newOpponentScore = prev.opponentScore + opponentPoints;
      const newCommentary = [...prev.commentary, commentary];
      
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
    if (won) {
      setFighter(prev => ({
        ...prev,
        wins: prev.wins + 1,
        experience: prev.experience + 10,
        popularity: Math.min(100, prev.popularity + 5),
        stamina: 100
      }));
      toast({
        title: "Victory!",
        description: "You won the fight! Your reputation grows.",
      });
    } else {
      setFighter(prev => ({
        ...prev,
        losses: prev.losses + 1,
        experience: prev.experience + 3,
        stamina: 100
      }));
      toast({
        title: "Defeat",
        description: "You lost this one, but you learned from it.",
        variant: "destructive"
      });
    }
    setCurrentFight(null);
    setGameState("career");
  };

  const trainFighter = () => {
    setFighter(prev => ({
      ...prev,
      power: Math.min(100, prev.power + 2),
      speed: Math.min(100, prev.speed + 2),
      defense: Math.min(100, prev.defense + 2),
      experience: prev.experience + 5
    }));
    toast({
      title: "Training Complete",
      description: "Your skills have improved!",
    });
  };

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
      <div className="min-h-screen bg-gradient-ring p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Fight Header */}
          <Card className="p-6 bg-card border-boxing-red">
            <div className="flex justify-between items-center mb-4">
              <div className="text-center">
                <h3 className="font-bold text-lg">{fighter.name}</h3>
                <p className="text-sm text-muted-foreground">{fighter.wins}-{fighter.losses}</p>
              </div>
              <div className="text-center">
                <Badge className="bg-boxing-red text-white text-lg px-4 py-2">
                  ROUND {currentFight.round}
                </Badge>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg">{currentFight.opponent.name}</h3>
                <p className="text-sm text-muted-foreground">{currentFight.opponent.wins}-{currentFight.opponent.losses}</p>
              </div>
            </div>
            
            {/* Score */}
            <div className="flex justify-center space-x-8 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-boxing-gold">{currentFight.playerScore}</div>
                <div className="text-sm">YOU</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-boxing-gold">{currentFight.opponentScore}</div>
                <div className="text-sm">OPPONENT</div>
              </div>
            </div>

            {/* Stamina */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Stamina</span>
                <span>{fighter.stamina}%</span>
              </div>
              <Progress value={fighter.stamina} className="h-3" />
            </div>
          </Card>

          {/* Commentary */}
          <Card className="p-4 bg-card border-boxing-red h-32 overflow-y-auto">
            <div className="space-y-2">
              {currentFight.commentary.slice(-3).map((comment, index) => (
                <p key={index} className="text-sm italic">{comment}</p>
              ))}
            </div>
          </Card>

          {/* Fight Choices */}
          <div className="grid grid-cols-2 gap-4">
            {fightChoices.map((choice) => (
              <Button
                key={choice.id}
                onClick={() => makeFightChoice(choice)}
                className="h-20 flex-col bg-gradient-danger hover:scale-105 transition-transform"
                disabled={fighter.stamina < choice.staminaCost}
              >
                <div className="font-bold">{choice.id}</div>
                <div className="text-sm text-center">{choice.text}</div>
                <div className="text-xs opacity-75">Stamina: -{choice.staminaCost}</div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-ring p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Fighter Profile */}
        <Card className="p-6 bg-card border-boxing-red shadow-boxer">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold text-boxing-gold mb-4">{fighter.name}</h2>
              <div className="space-y-2">
                <p><span className="font-semibold">Age:</span> {fighter.age}</p>
                <p><span className="font-semibold">Division:</span> {fighter.division}</p>
                <p><span className="font-semibold">Record:</span> {fighter.wins}-{fighter.losses} ({fighter.ko} KO)</p>
                <p><span className="font-semibold">Popularity:</span> {fighter.popularity}%</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Power</span>
                  <span>{fighter.power}</span>
                </div>
                <Progress value={fighter.power} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Speed</span>
                  <span>{fighter.speed}</span>
                </div>
                <Progress value={fighter.speed} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Defense</span>
                  <span>{fighter.defense}</span>
                </div>
                <Progress value={fighter.defense} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Experience</span>
                  <span>{fighter.experience}</span>
                </div>
                <Progress value={fighter.experience} className="h-2" />
              </div>
            </div>
          </div>
        </Card>

        {/* Manager Section */}
        <Card className="p-6 bg-card border-boxing-red">
          <h3 className="text-xl font-bold text-boxing-gold mb-4">Manager: {manager.name}</h3>
          <div className="bg-muted p-4 rounded-lg">
            <p className="italic">"{manager.advice[Math.floor(Math.random() * manager.advice.length)]}"</p>
          </div>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={startFight}
            className="h-16 bg-gradient-danger hover:scale-105 transition-transform font-bold text-lg"
          >
            FIND FIGHT
          </Button>
          <Button 
            onClick={trainFighter}
            className="h-16 bg-gradient-champion text-boxing-dark hover:scale-105 transition-transform font-bold text-lg"
          >
            TRAIN
          </Button>
          <Button 
            variant="outline"
            className="h-16 border-boxing-red text-boxing-red hover:bg-boxing-red/10"
          >
            CALL OUT RIVAL
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BoxingGame;