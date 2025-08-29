import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import RegistrationForm from "./RegistrationForm";
import FightInterface from "./FightInterface";
import TrainingInterface from "./TrainingInterface";
import CalloutInterface from "./CalloutInterface";
import ScheduleInterface from "./ScheduleInterface";
import MediaInterface from "./MediaInterface";
import SettingsInterface from "./SettingsInterface";
import StatsInterface from "./StatsInterface";
import LoadingScreen from "./LoadingScreen";
import RankingInterface from "./RankingInterface";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sword, Dumbbell, Users, MessageSquare, Trophy, Calendar, Settings, Star, Briefcase, Newspaper, TrendingUp, Shield, SkipForward, Battery } from "lucide-react";

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
  injuries: string[];
  facialDamage: number;
  money: number;
  energy: number;
  weeksSinceLastFight: number;
  socialMedia: {
    followers: number;
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
  };
  technique: number;
  mental: number;
  unrankedWins: number;
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
  const [gameState, setGameState] = useState<"registration" | "loading" | "menu" | "career" | "fight" | "training" | "callout" | "schedule" | "media" | "contracts" | "settings" | "stats" | "rankings">("registration");
  const [fighter, setFighter] = useState<Fighter | null>(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [incomingCallouts, setIncomingCallouts] = useState<Fighter[]>([]);
  const [isAdvancingWeek, setIsAdvancingWeek] = useState(false);

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
    playerInjuries: string[];
    opponentInjuries: string[];
    playerFacialDamage: number;
    opponentFacialDamage: number;
  } | null>(null);

  const divisions = ["Lightweight", "Welterweight", "Middleweight", "Light Heavyweight", "Heavyweight"];

  const handleCreateFighter = (newFighter: Fighter) => {
    setFighter({
      ...newFighter,
      // Set all physical stats to 50
      power: 50,
      speed: 50,
      defense: 50,
      stamina: 50,
      technique: 50,
      mental: 50,
      injuries: [],
      facialDamage: 0,
      money: 25000,
      energy: 100,
      weeksSinceLastFight: 0,
      unrankedWins: 0,
      socialMedia: {
        followers: 100,
        totalPosts: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0
      }
    });
    setGameState("loading");
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
      technique: 40 + Math.random() * 30,
      mental: 40 + Math.random() * 30,
      experience: Math.floor(Math.random() * 50),
      injuries: [],
      facialDamage: 0,
      money: 10000,
      energy: 100,
      weeksSinceLastFight: 0,
      unrankedWins: Math.floor(Math.random() * 3),
      socialMedia: {
        followers: Math.floor(Math.random() * 1000),
        totalPosts: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0
      }
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
      crowdMood: "excited",
      playerInjuries: [],
      opponentInjuries: [],
      playerFacialDamage: 0,
      opponentFacialDamage: 0
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

  const generateEndFightCommentary = (won: boolean, opponent: Fighter): string => {
    if (won) {
      const winCommentary = [
        `What a performance! ${fighter.name} dominated tonight with a masterful display of boxing! This young fighter is going places!`,
        `Spectacular victory for ${fighter.name}! The way he controlled the distance and timing was poetry in motion! Star quality on display!`,
        `${fighter.name} has announced himself to the division tonight! That was a statement win that will have everyone talking!`,
        `Incredible heart and skill from ${fighter.name}! He weathered the storm and came back to win convincingly! Championship material!`,
        `What we witnessed tonight was special! ${fighter.name} showed the complete package - skill, power, and ring IQ! The future is bright!`
      ];
      return winCommentary[Math.floor(Math.random() * winCommentary.length)];
    } else {
      const lossCommentary = [
        `Tough night for ${fighter.name}, but this is all part of the learning process. He showed heart and will be back stronger!`,
        `${fighter.name} came up short tonight, but he never stopped trying! That's the mark of a true fighter - you learn more from losses than wins!`,
        `Not the result ${fighter.name} wanted, but he gained valuable experience tonight! This setback will only make him hungrier!`,
        `${fighter.name} fought valiantly but ${opponent.name} was just too much tonight! Sometimes you have to take a step back to move forward!`,
        `Credit to ${fighter.name} for taking this tough fight! He may have lost tonight, but his stock didn't drop in my eyes!`
      ];
      return lossCommentary[Math.floor(Math.random() * lossCommentary.length)];
    }
  };

  const updateSocialMediaAfterFight = (won: boolean, opponent: Fighter) => {
    if (!fighter) return;
    
    const baseFollowerGain = won ? Math.floor(50 + Math.random() * 100) : Math.floor(10 + Math.random() * 30);
    const popularityMultiplier = fighter.popularity / 100;
    const opponentQualityMultiplier = (opponent.wins + opponent.popularity) / 100;
    
    const followerGain = Math.floor(baseFollowerGain * popularityMultiplier * opponentQualityMultiplier);
    const likesGain = Math.floor(followerGain * (2 + Math.random() * 3));
    const commentsGain = Math.floor(followerGain * (0.1 + Math.random() * 0.2));
    const sharesGain = Math.floor(followerGain * (0.05 + Math.random() * 0.1));
    
    setFighter(prev => prev ? ({
      ...prev,
      socialMedia: {
        followers: prev.socialMedia.followers + followerGain,
        totalPosts: prev.socialMedia.totalPosts + 1,
        totalLikes: prev.socialMedia.totalLikes + likesGain,
        totalComments: prev.socialMedia.totalComments + commentsGain,
        totalShares: prev.socialMedia.totalShares + sharesGain
      }
    }) : null);
  };

  const endFight = (won: boolean) => {
    if (!fighter || !currentFight) return;
    
    const endCommentary = generateEndFightCommentary(won, currentFight.opponent);
    
    if (won) {
      const experienceGain = Math.max(5, 10 - Math.floor(fighter.wins / 5)); // Diminishing experience
      const popularityGain = Math.max(2, 8 - Math.floor(fighter.popularity / 20));
      
      // Check if this is an unranked opponent
      const isUnrankedOpponent = currentFight.opponent.wins < 5;
      
      setFighter(prev => prev ? ({
        ...prev,
        wins: prev.wins + 1,
        unrankedWins: isUnrankedOpponent ? prev.unrankedWins + 1 : prev.unrankedWins,
        experience: prev.experience + experienceGain,
        popularity: Math.min(100, prev.popularity + popularityGain),
        stamina: 100,
        weeksSinceLastFight: 0
      }) : null);
      
      // Update social media based on fight result
      updateSocialMediaAfterFight(true, currentFight.opponent);
      
      toast({
        title: "VICTORY!",
        description: endCommentary,
      });
    } else {
      setFighter(prev => prev ? ({
        ...prev,
        losses: prev.losses + 1,
        experience: prev.experience + 2, // Less experience from losses
        stamina: 100,
        weeksSinceLastFight: 0
      }) : null);
      
      // Update social media based on fight result
      updateSocialMediaAfterFight(false, currentFight.opponent);
      
      toast({
        title: "DEFEAT",
        description: endCommentary,
        variant: "destructive"
      });
    }
    setCurrentFight(null);
    setGameState("career");
  };

  const trainStat = (stat: string) => {
    if (!fighter) return;
    
    if (fighter.energy < 20) {
      toast({
        title: "Too Exhausted!",
        description: "You need to rest before training again!",
        variant: "destructive"
      });
      return;
    }
    
    // Much slower progression - 0.5-1.5 points with heavy diminishing returns
    const baseImprovement = 0.5 + Math.random();
    const currentStat = stat === "power" ? fighter.power : 
                       stat === "speed" ? fighter.speed :
                       stat === "defense" ? fighter.defense :
                       stat === "stamina" ? fighter.stamina :
                       stat === "technique" ? fighter.technique :
                       stat === "mental" ? fighter.mental : 50;
    
    // Heavy diminishing returns - much harder to improve when stats are high
    const difficultyModifier = currentStat > 90 ? 0.1 : 
                              currentStat > 80 ? 0.3 : 
                              currentStat > 70 ? 0.5 : 
                              currentStat > 60 ? 0.7 : 1;
    const improvement = Math.max(0.1, baseImprovement * difficultyModifier);
    
    setFighter(prev => {
      if (!prev) return null;
      
      const updates: Partial<Fighter> = { 
        experience: prev.experience + 3,
        energy: Math.max(0, prev.energy - 15) // Training costs energy
      };
      
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
          updates.technique = Math.min(100, prev.technique + improvement);
          break;
        case "mental":
          updates.mental = Math.min(100, prev.mental + improvement);
          break;
      }
      
      return { ...prev, ...updates };
    });
    
    toast({
      title: "Training Complete",
      description: `${stat.charAt(0).toUpperCase() + stat.slice(1)} improved by ${improvement.toFixed(1)} points! Energy decreased.`,
    });
  };

  const advanceWeek = () => {
    if (!fighter) return;
    
    setIsAdvancingWeek(true);
    
    setTimeout(() => {
      // Generate callouts if fighter is popular enough
      const shouldReceiveCallout = fighter.popularity > 50 && Math.random() < 0.3;
      let newCallouts: Fighter[] = [];
      
      if (shouldReceiveCallout) {
        const calloutFighter = generateOpponent();
        calloutFighter.name = "Jake Thompson"; // Example challenger
        newCallouts = [calloutFighter];
      }
      
      setFighter(prev => prev ? ({
        ...prev,
        energy: Math.min(100, prev.energy + 25), // Recover energy each week
        weeksSinceLastFight: prev.weeksSinceLastFight + 1
      }) : null);
      
      setCurrentWeek(prev => prev + 1);
      setIncomingCallouts(newCallouts);
      setIsAdvancingWeek(false);
      
      if (newCallouts.length > 0) {
        toast({
          title: "Challenge Received!",
          description: `${newCallouts[0].name} has called you out for a fight!`,
        });
      }
    }, 3000);
  };

  const startFightCheck = () => {
    if (!fighter) return;
    
    if (fighter.energy < 70) {
      toast({
        title: "Not Ready to Fight",
        description: "You need at least 70% energy to compete! Rest or wait for next week.",
        variant: "destructive"
      });
      return;
    }
    
    if (fighter.weeksSinceLastFight < 2) {
      toast({
        title: "Too Soon to Fight",
        description: "You need more recovery time between fights!",
        variant: "destructive"
      });
      return;
    }
    
    startFight();
  };

  if (gameState === "registration") {
    return <RegistrationForm onCreateFighter={handleCreateFighter} />;
  }

  if (gameState === "loading") {
    return <LoadingScreen onLoadingComplete={() => setGameState("menu")} />;
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

  if (gameState === "callout") {
    return (
      <CalloutInterface
        fighter={fighter}
        onBack={() => setGameState("career")}
        onStartFight={(opponent) => {
          setCurrentFight({
            opponent,
            round: 1,
            playerScore: 0,
            opponentScore: 0,
            commentary: [`Ladies and gentlemen, this is a huge fight! ${fighter.name} has called out ${opponent.name} and the challenge has been accepted!`],
            crowdMood: "electric",
            playerInjuries: [],
            opponentInjuries: [],
            playerFacialDamage: 0,
            opponentFacialDamage: 0
          });
          setGameState("fight");
        }}
      />
    );
  }

  if (gameState === "schedule") {
    return (
      <ScheduleInterface
        fighter={fighter}
        onBack={() => setGameState("career")}
        onStartFight={(opponent, purse) => {
          setCurrentFight({
            opponent,
            round: 1,
            playerScore: 0,
            opponentScore: 0,
            commentary: [`Ladies and gentlemen, this is a scheduled bout! ${fighter.name} faces ${opponent.name} for a purse of $${purse.toLocaleString()}!`],
            crowdMood: "excited",
            playerInjuries: [],
            opponentInjuries: [],
            playerFacialDamage: 0,
            opponentFacialDamage: 0
          });
          setGameState("fight");
        }}
      />
    );
  }

  if (gameState === "media") {
    return (
      <MediaInterface
        fighter={fighter}
        onBack={() => setGameState("career")}
        onUpdateSocialMedia={(socialData) => {
          setFighter(prev => prev ? ({
            ...prev,
            socialMedia: socialData
          }) : null);
        }}
      />
    );
  }

  if (gameState === "settings") {
    return (
      <SettingsInterface
        fighter={fighter}
        onBack={() => setGameState("career")}
        onNextWeek={() => {
          advanceWeek();
          setGameState("career");
        }}
        onReset={() => {
          setFighter(null);
          setGameState("registration");
        }}
      />
    );
  }

  if (gameState === "stats") {
    return (
      <StatsInterface
        fighter={fighter}
        currentWeek={currentWeek}
        onBack={() => setGameState("career")}
      />
    );
  }

  if (gameState === "rankings") {
    return (
      <RankingInterface
        fighter={fighter}
        onBack={() => setGameState("career")}
        onChallengeFighter={(opponent) => {
          setCurrentFight({
            opponent,
            round: 1,
            playerScore: 0,
            opponentScore: 0,
            commentary: [`This is a huge ranking fight! ${fighter.name} challenges ${opponent.name} for a chance to climb the rankings!`],
            crowdMood: "electric",
            playerInjuries: [],
            opponentInjuries: [],
            playerFacialDamage: 0,
            opponentFacialDamage: 0
          });
          setGameState("fight");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-ring relative">
      {/* Next Week Button - Top of Dashboard */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={advanceWeek}
          disabled={isAdvancingWeek}
          className="bg-gradient-champion text-boxing-dark font-bold"
          size="lg"
        >
          <SkipForward className="h-5 w-5 mr-2" />
          Week {currentWeek} → Next Week
        </Button>
      </div>

      {/* Loading Animation */}
      {isAdvancingWeek && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-8 bg-card border-boxing-red">
            <div className="text-center space-y-4">
              <div className="text-2xl font-bold text-boxing-gold">Advancing to Week {currentWeek + 1}</div>
              <div className="flex justify-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-boxing-red animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-8 h-8 rounded-full bg-boxing-gold animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-8 h-8 rounded-full bg-boxing-red animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <div className="text-sm text-muted-foreground">Training, resting, and planning your next moves...</div>
            </div>
          </Card>
        </div>
      )}

      {/* Scrollable Main Content */}
      <div className="pb-20 p-4 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6 pt-16">
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
                <div className="flex items-center justify-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-boxing-gold" />
                    <span className="font-semibold">Popularity: {fighter.popularity}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Battery className={`h-5 w-5 ${fighter.energy > 70 ? 'text-green-500' : fighter.energy > 30 ? 'text-yellow-500' : 'text-red-500'}`} />
                    <span className="font-semibold">Energy: {fighter.energy}%</span>
                  </div>
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
                { name: "Technique", value: fighter.technique, color: "text-green-500" },
                { name: "Mental", value: fighter.mental, color: "text-purple-500" },
                { name: "Experience", value: fighter.experience, color: "text-orange-500" }
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

          {/* Fighter Money & Status */}
          <Card className="p-4 bg-card border-boxing-red">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-boxing-gold">${fighter.money.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Career Earnings</p>
                </div>
                {fighter.injuries.length > 0 && (
                  <div className="text-center">
                    <Badge variant="destructive" className="mb-1">
                      {fighter.injuries.length} Injuries
                    </Badge>
                    <p className="text-xs text-muted-foreground">{fighter.injuries[0]}</p>
                  </div>
                )}
                {fighter.facialDamage > 0 && (
                  <div className="text-center">
                    <Badge variant="secondary" className="mb-1">
                      Facial Damage
                    </Badge>
                    <Progress value={fighter.facialDamage} className="h-2 w-16" />
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Fixed Floating Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-boxing-red p-2 z-40">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-5 gap-1">
            <Button 
              onClick={startFightCheck}
              className="h-16 bg-gradient-danger hover:scale-105 transition-transform flex items-center justify-center"
              title="Quick Fight"
            >
              <Sword className="h-6 w-6" />
            </Button>
            
            <Button 
              onClick={() => setGameState("schedule")}
              className="h-16 bg-gradient-champion text-boxing-dark hover:scale-105 transition-transform flex items-center justify-center"
              title="Schedule"
            >
              <Calendar className="h-6 w-6" />
            </Button>
            
            <Button 
              onClick={() => setGameState("training")}
              className="h-16 bg-secondary hover:scale-105 transition-transform flex items-center justify-center"
              title="Training"
            >
              <Dumbbell className="h-6 w-6" />
            </Button>
            
            <Button 
              onClick={() => setGameState("callout")}
              className="h-16 bg-accent text-accent-foreground hover:scale-105 transition-transform flex items-center justify-center"
              title="Call Out"
            >
              <MessageSquare className="h-6 w-6" />
            </Button>

            <Button 
              onClick={() => setGameState("media")}
              className="h-16 bg-muted hover:scale-105 transition-transform flex items-center justify-center"
              title="Media"
            >
              <Newspaper className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="grid grid-cols-5 gap-1 mt-1">
            <Button 
              onClick={() => setGameState("contracts")}
              className="h-16 bg-muted hover:scale-105 transition-transform flex items-center justify-center"
              title="Contracts"
            >
              <Briefcase className="h-6 w-6" />
            </Button>
            
            <Button 
              className="h-16 bg-muted hover:scale-105 transition-transform flex items-center justify-center"
              title="Team"
            >
              <Users className="h-6 w-6" />
            </Button>
            
            <Button 
              onClick={() => setGameState("rankings")}
              className="h-16 bg-muted hover:scale-105 transition-transform flex items-center justify-center"
              title="Rankings"
            >
              <Trophy className="h-6 w-6" />
            </Button>
            
            <Button 
              onClick={() => setGameState("stats")}
              className="h-16 bg-muted hover:scale-105 transition-transform flex items-center justify-center"
              title="Stats"
            >
              <TrendingUp className="h-6 w-6" />
            </Button>
            
            <Button 
              onClick={() => setGameState("settings")}
              className="h-16 bg-muted hover:scale-105 transition-transform flex items-center justify-center"
              title="Settings"
            >
              <Settings className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxingGame;