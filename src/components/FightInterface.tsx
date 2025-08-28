import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Fighter, FightChoice } from "./BoxingGame";

interface FightInterfaceProps {
  fighter: Fighter;
  currentFight: {
    opponent: Fighter;
    round: number;
    playerScore: number;
    opponentScore: number;
    commentary: string[];
    crowdMood: "excited" | "bored" | "hostile" | "electric";
  };
  onFightChoice: (choice: FightChoice, result: string) => void;
  onEndFight: (won: boolean) => void;
}

const FightInterface = ({ fighter, currentFight, onFightChoice, onEndFight }: FightInterfaceProps) => {
  const [currentChoices, setCurrentChoices] = useState<FightChoice[]>([]);
  const [lastResult, setLastResult] = useState<string>("");
  const [showResult, setShowResult] = useState(false);

  const generateDynamicChoices = (): FightChoice[] => {
    const baseChoices = [
      {
        id: "A",
        text: "Throw a powerful uppercut",
        type: "aggressive" as const,
        staminaCost: 18,
        successChance: 0.55
      },
      {
        id: "B", 
        text: "Circle and jab",
        type: "tactical" as const,
        staminaCost: 10,
        successChance: 0.7
      },
      {
        id: "C",
        text: "Bob and weave defensively",
        type: "defensive" as const, 
        staminaCost: 7,
        successChance: 0.75
      },
      {
        id: "D",
        text: "Go for a knockout combo",
        type: "risky" as const,
        staminaCost: 25,
        successChance: 0.35
      }
    ];

    const alternativeChoices = [
      {
        id: "A",
        text: "Body shot combination",
        type: "aggressive" as const,
        staminaCost: 16,
        successChance: 0.6
      },
      {
        id: "B",
        text: "Feint and cross",
        type: "tactical" as const,
        staminaCost: 12,
        successChance: 0.65
      },
      {
        id: "C",
        text: "Clinch and rest",
        type: "defensive" as const,
        staminaCost: 5,
        successChance: 0.8
      },
      {
        id: "D",
        text: "All-out blitz attack",
        type: "risky" as const,
        staminaCost: 22,
        successChance: 0.4
      }
    ];

    const lowStaminaChoices = [
      {
        id: "A",
        text: "Conserve energy, light jabs",
        type: "tactical" as const,
        staminaCost: 8,
        successChance: 0.6
      },
      {
        id: "B",
        text: "Try to tie up opponent",
        type: "defensive" as const,
        staminaCost: 5,
        successChance: 0.75
      },
      {
        id: "C",
        text: "Desperate haymaker",
        type: "risky" as const,
        staminaCost: 15,
        successChance: 0.3
      },
      {
        id: "D",
        text: "Focus on footwork",
        type: "defensive" as const,
        staminaCost: 6,
        successChance: 0.7
      }
    ];

    if (fighter.stamina < 30) {
      return lowStaminaChoices;
    }
    
    return Math.random() > 0.5 ? baseChoices : alternativeChoices;
  };

  useEffect(() => {
    setCurrentChoices(generateDynamicChoices());
  }, [currentFight.round, fighter.stamina]);

  const generateFightResult = (choice: FightChoice): string => {
    const success = Math.random() < choice.successChance;
    const opponentActions = [
      "throws a counter left hook",
      "tries to clinch you",
      "backs away and circles",
      "goes for a body shot",
      "attempts an uppercut",
      "feints and moves laterally"
    ];
    
    const opponentAction = opponentActions[Math.floor(Math.random() * opponentActions.length)];
    
    if (success) {
      const successResults = {
        aggressive: [
          `You land a devastating shot! Your opponent staggers back as ${opponentAction}. The crowd erupts!`,
          `Perfect timing! You connect cleanly while your opponent ${opponentAction} but misses!`,
          `Boom! Your power shot finds its mark as your opponent ${opponentAction} too late!`
        ],
        tactical: [
          `Smart boxing! You execute perfectly while your opponent ${opponentAction}. Clean technique!`,
          `Textbook move! Your opponent ${opponentAction} but you're already out of range!`,
          `Beautiful setup! As your opponent ${opponentAction}, you capitalize with precision!`
        ],
        defensive: [
          `Great defense! Your opponent ${opponentAction} but you slip it beautifully and counter!`,
          `Perfect timing! You avoid the attack as your opponent ${opponentAction} and land your own!`,
          `Excellent defense! Your opponent ${opponentAction} but hits nothing but air!`
        ],
        risky: [
          `INCREDIBLE! Your high-risk move pays off huge as your opponent ${opponentAction} right into it!`,
          `What a gamble! Your opponent ${opponentAction} but you connect with a spectacular shot!`,
          `Unbelievable! Your opponent ${opponentAction} but your risky attack lands perfectly!`
        ]
      };
      return successResults[choice.type][Math.floor(Math.random() * successResults[choice.type].length)];
    } else {
      const failureResults = {
        aggressive: [
          `You swing hard but miss! Your opponent ${opponentAction} and connects! You're off balance!`,
          `Too aggressive! Your opponent ${opponentAction} and catches you coming in!`,
          `Your power shot misses the mark! Your opponent ${opponentAction} and punishes your mistake!`
        ],
        tactical: [
          `Your opponent reads your move! As you set up, they ${opponentAction} and disrupt your plan!`,
          `Good idea but poor execution! Your opponent ${opponentAction} and beats you to the punch!`,
          `Your opponent anticipated that! They ${opponentAction} and counter your technique!`
        ],
        defensive: [
          `Too passive! Your opponent ${opponentAction} and finds an opening! You need more offense!`,
          `Your defense breaks down! Your opponent ${opponentAction} and gets through your guard!`,
          `Playing it safe backfires! Your opponent ${opponentAction} and takes control!`
        ],
        risky: [
          `Costly mistake! Your opponent ${opponentAction} and makes you pay for the wild attempt!`,
          `High risk, no reward! Your opponent ${opponentAction} and capitalizes on your opening!`,
          `The gamble fails! Your opponent ${opponentAction} and punishes your recklessness!`
        ]
      };
      return failureResults[choice.type][Math.floor(Math.random() * failureResults[choice.type].length)];
    }
  };

  const handleChoice = (choice: FightChoice) => {
    const result = generateFightResult(choice);
    setLastResult(result);
    setShowResult(true);
    
    setTimeout(() => {
      setShowResult(false);
      setCurrentChoices(generateDynamicChoices());
      onFightChoice(choice, result);
    }, 3000);
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-ring p-4 flex items-center justify-center">
        <Card className="max-w-4xl p-8 bg-card border-boxing-red">
          <div className="text-center space-y-6">
            <Badge className="bg-boxing-red text-white text-lg px-4 py-2">
              ROUND {currentFight.round} - ACTION!
            </Badge>
            <div className="text-xl font-semibold text-boxing-gold min-h-[100px] flex items-center justify-center">
              {lastResult}
            </div>
            <div className="text-muted-foreground">
              Preparing for next exchange...
            </div>
          </div>
        </Card>
      </div>
    );
  }

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
          {currentChoices.map((choice) => (
            <Button
              key={choice.id}
              onClick={() => handleChoice(choice)}
              className="h-24 flex-col bg-gradient-danger hover:scale-105 transition-transform text-center p-4"
              disabled={fighter.stamina < choice.staminaCost}
            >
              <div className="font-bold text-lg">{choice.id}</div>
              <div className="text-sm">{choice.text}</div>
              <div className="text-xs opacity-75 mt-1">
                Stamina: -{choice.staminaCost} | Success: {Math.round(choice.successChance * 100)}%
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FightInterface;