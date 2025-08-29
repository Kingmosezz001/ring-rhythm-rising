import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Fighter, FightChoice } from "./BoxingGame";
import { generateFacialExpression, generateInjury, generateEndFightCommentary } from "./InjurySystem";

interface FightInterfaceProps {
  fighter: Fighter;
  currentFight: {
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
  };
  onFightChoice: (choice: FightChoice, result: string) => void;
  onEndFight: (won: boolean) => void;
}

const FightInterface = ({ fighter, currentFight, onFightChoice, onEndFight }: FightInterfaceProps) => {
  const [currentChoices, setCurrentChoices] = useState<FightChoice[]>([]);
  const [lastResult, setLastResult] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [fightIntensity, setFightIntensity] = useState<"low" | "medium" | "high" | "extreme">("medium");
  const [showPreFight, setShowPreFight] = useState(true);

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
    
    // Dynamic intensity based on round and action type
    const roundIntensity = currentFight.round > 8 ? "extreme" : 
                          currentFight.round > 6 ? "high" : 
                          currentFight.round > 3 ? "medium" : "low";
    setFightIntensity(roundIntensity);
    
    const opponentActions = [
      "throws a vicious counter left hook",
      "tries to clinch and rough you up inside", 
      "backs away and circles, looking for an opening",
      "digs a hard body shot to your ribs",
      "comes up with a crushing uppercut",
      "feints and moves laterally, setting traps",
      "unleashes a brutal combination",
      "steps in with a devastating right cross",
      "works the body with punishing shots",
      "ties you up and leans on you heavily",
      "pivots and throws a sneaky left hook",
      "pressures forward with bad intentions"
    ];
    
    const opponentAction = opponentActions[Math.floor(Math.random() * opponentActions.length)];
    
    // Generate facial expressions and injuries
    const playerExpression = generateFacialExpression(success, choice.type, fighter.stamina);
    const opponentExpression = generateFacialExpression(!success, "defensive", 100 - currentFight.round * 8);
    const injuryResult = generateInjury(choice, success, roundIntensity);
    
    if (success) {
      const successResults = {
        aggressive: [
          `BANG! You land a devastating shot that rocks your opponent to his core! ${playerExpression} Your opponent ${opponentAction} - too little, too late! ${opponentExpression} The crowd is going WILD! ${injuryResult}`,
          `What a BOMB! Your power shot finds the target perfectly! ${playerExpression} Your opponent ${opponentAction} but he's clearly hurt! ${opponentExpression} He's in survival mode now! ${injuryResult}`,
          `THUNDEROUS impact! You connect with authority and your opponent's legs wobble! ${playerExpression} He desperately ${opponentAction} but the damage is done! ${opponentExpression} ${injuryResult}`,
          `CRUSHING blow lands flush! Your opponent's mouthpiece flies out as he ${opponentAction} trying to recover! ${playerExpression} ${opponentExpression} This could be the beginning of the end! ${injuryResult}`
        ],
        tactical: [
          `Textbook boxing! You execute the perfect game plan while your opponent ${opponentAction}. ${playerExpression} Your technique is a thing of beauty! ${opponentExpression} ${injuryResult}`,
          `IQ boxing at its finest! You stay two steps ahead as your opponent ${opponentAction} but you've already moved to safety! ${playerExpression} ${opponentExpression} ${injuryResult}`,
          `Beautiful setup! The chess match continues as your opponent ${opponentAction}, but you capitalize with surgical precision! ${playerExpression} ${opponentExpression} ${injuryResult}`,
          `Pure boxing artistry! Your opponent ${opponentAction} but you're controlling distance and timing like a master craftsman! ${playerExpression} ${opponentExpression} ${injuryResult}`
        ],
        defensive: [
          `SUPERB defense! Your opponent ${opponentAction} but you make him miss completely and counter with authority! He's hitting nothing but air!`,
          `Defensive masterclass! Your opponent ${opponentAction} with bad intentions but you slip it like a ghost and land your own shot!`,
          `Elusive as smoke! Your opponent ${opponentAction} desperately but you're gone and back with interest! He can't touch you!`,
          `Matrix-like movement! Your opponent ${opponentAction} but you see it coming from a mile away and punish him for it!`
        ],
        risky: [
          `HOLY SMOKES! Your all-or-nothing gamble pays off HUGE! Your opponent ${opponentAction} right into your trap! The arena has ERUPTED!`,
          `UNBELIEVABLE! High risk, massive reward! Your opponent ${opponentAction} but walks straight into your haymaker! This place is going CRAZY!`,
          `WHAT A MOMENT! Your desperate attempt lands perfectly as your opponent ${opponentAction}! Sometimes you gotta risk it all!`,
          `SPECTACULAR! Your opponent ${opponentAction} but your wild swing finds the sweet spot! Fortune favors the bold!`
        ]
      };
      return successResults[choice.type][Math.floor(Math.random() * successResults[choice.type].length)];
    } else {
      const failureResults = {
        aggressive: [
          `WHIFF! Your haymaker finds nothing but air! Your opponent sees it coming and ${opponentAction} landing flush! You're in trouble now!`,
          `TOO WILD! Your aggressive attack leaves you wide open and your opponent ${opponentAction} punishing your recklessness! That's gonna cost you!`,
          `MISSED OPPORTUNITY! Your power shot goes nowhere and your opponent ${opponentAction} making you pay dearly! He's taking control!`,
          `OVERCOMMITTED! You throw everything behind that shot but miss completely! Your opponent ${opponentAction} and now you're on the back foot!`
        ],
        tactical: [
          `OUTSMARTED! Your opponent reads you like a book and ${opponentAction} disrupting your entire game plan! He's one step ahead!`,
          `COUNTERED! Your technical approach gets shut down as your opponent ${opponentAction} and beats you to the punch! He saw that coming!`,
          `NEUTRALIZED! Your opponent has your number and ${opponentAction} turning your own plan against you! You need to switch it up!`,
          `PREDICTED! Your opponent anticipated that perfectly and ${opponentAction} making your technique look amateur! He's in your head!`
        ],
        defensive: [
          `TOO PASSIVE! Your shell defense crumbles as your opponent ${opponentAction} finding the gaps! You can't win rounds like this!`,
          `BREAKTHROUGH! Your defense finally breaks down and your opponent ${opponentAction} getting through clean! The tide is turning!`,
          `NOT ENOUGH! Your safety-first approach backfires as your opponent ${opponentAction} taking over the fight! You need to take risks!`,
          `OVERWHELMED! Your opponent ${opponentAction} with relentless pressure and your defense can't hold! He's breaking you down!`
        ],
        risky: [
          `CATASTROPHIC! Your wild gamble leaves you completely exposed and your opponent ${opponentAction} making you pay the ultimate price!`,
          `DISASTER! Your desperation move fails spectacularly as your opponent ${opponentAction} capitalizing on your mistake! This could be over!`,
          `BACKFIRES! Your all-or-nothing attempt goes horribly wrong and your opponent ${opponentAction} putting you in serious danger!`,
          `PUNISHED! Your reckless abandon costs you dearly as your opponent ${opponentAction} and now you're fighting for survival!`
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

  if (showPreFight) {
    return (
      <div className="min-h-screen bg-gradient-ring p-4 flex items-center justify-center">
        <Card className="max-w-6xl p-8 bg-card border-boxing-red">
          <div className="text-center space-y-6">
            <Badge className="bg-boxing-red text-white text-2xl px-6 py-3">
              TALE OF THE TAPE
            </Badge>
            
            <div className="grid grid-cols-3 gap-8 mt-8">
              {/* Player Stats */}
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-boxing-gold">{fighter.name}</h2>
                  <p className="text-muted-foreground">Record: {fighter.wins}-{fighter.losses} ({fighter.ko} KO)</p>
                </div>
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span>Power:</span>
                    <span className="text-boxing-gold font-bold">{fighter.power}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Speed:</span>
                    <span className="text-boxing-gold font-bold">{fighter.speed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Defense:</span>
                    <span className="text-boxing-gold font-bold">{fighter.defense}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Experience:</span>
                    <span className="text-boxing-gold font-bold">{fighter.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Age:</span>
                    <span className="text-boxing-gold font-bold">{fighter.age}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Division:</span>
                    <span className="text-boxing-gold font-bold">{fighter.division}</span>
                  </div>
                </div>
              </div>

              {/* VS Section */}
              <div className="flex flex-col justify-center items-center">
                <div className="text-6xl font-bold text-boxing-red">VS</div>
                <Button 
                  onClick={() => setShowPreFight(false)}
                  className="mt-8 bg-gradient-champion text-boxing-dark font-bold text-xl px-8 py-4"
                >
                  LET'S GET READY TO RUMBLE!
                </Button>
              </div>

              {/* Opponent Stats */}
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-boxing-gold">{currentFight.opponent.name}</h2>
                  <p className="text-muted-foreground">Record: {currentFight.opponent.wins}-{currentFight.opponent.losses} ({currentFight.opponent.ko} KO)</p>
                </div>
                <div className="space-y-3 text-right">
                  <div className="flex justify-between">
                    <span className="text-boxing-gold font-bold">{currentFight.opponent.power}</span>
                    <span>:Power</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-boxing-gold font-bold">{currentFight.opponent.speed}</span>
                    <span>:Speed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-boxing-gold font-bold">{currentFight.opponent.defense}</span>
                    <span>:Defense</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-boxing-gold font-bold">{currentFight.opponent.experience}</span>
                    <span>:Experience</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-boxing-gold font-bold">{currentFight.opponent.age}</span>
                    <span>:Age</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-boxing-gold font-bold">{currentFight.opponent.division}</span>
                    <span>:Division</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

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