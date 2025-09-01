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
        successChance: 0.5
      },
      {
        id: "B", 
        text: "Circle and jab",
        type: "tactical" as const,
        staminaCost: 10,
        successChance: 0.5
      },
      {
        id: "C",
        text: "Bob and weave defensively",
        type: "defensive" as const, 
        staminaCost: 7,
        successChance: 0.5
      },
      {
        id: "D",
        text: "Go for a knockout combo",
        type: "risky" as const,
        staminaCost: 25,
        successChance: 0.5
      }
    ];

    const alternativeChoices = [
      {
        id: "A",
        text: "Body shot combination",
        type: "aggressive" as const,
        staminaCost: 16,
        successChance: 0.5
      },
      {
        id: "B",
        text: "Feint and cross",
        type: "tactical" as const,
        staminaCost: 12,
        successChance: 0.5
      },
      {
        id: "C",
        text: "Clinch and rest",
        type: "defensive" as const,
        staminaCost: 5,
        successChance: 0.5
      },
      {
        id: "D",
        text: "All-out blitz attack",
        type: "risky" as const,
        staminaCost: 22,
        successChance: 0.5
      }
    ];

    const lowStaminaChoices = [
      {
        id: "A",
        text: "Conserve energy, light jabs",
        type: "tactical" as const,
        staminaCost: 8,
        successChance: 0.5
      },
      {
        id: "B",
        text: "Try to tie up opponent",
        type: "defensive" as const,
        staminaCost: 5,
        successChance: 0.5
      },
      {
        id: "C",
        text: "Desperate haymaker",
        type: "risky" as const,
        staminaCost: 15,
        successChance: 0.5
      },
      {
        id: "D",
        text: "Focus on footwork",
        type: "defensive" as const,
        staminaCost: 6,
        successChance: 0.5
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

  const generateCrowdReaction = (success: boolean, intensity: string, choiceType: string): string => {
    const crowdReactions = {
      success: {
        extreme: [
          "🔥 THE CROWD EXPLODES! 'OHHHHHHH!' echoes through the arena as 30,000 fans LOSE THEIR MINDS!",
          "⚡ ARENA ROOF NEARLY BLOWN OFF! The deafening roar could wake the dead! 'FINISH HIM! FINISH HIM!'",
          "💀 BLOODTHIRSTY CROWD GOES BERSERK! 'KILL! KILL! KILL!' reverberates through the stadium!",
          "🌪️ TSUNAMI OF NOISE! Fans throwing beer, standing on chairs, absolute PANDEMONIUM!"
        ],
        high: [
          "🔥 The crowd ERUPTS! 'WOOOOO!' 15,000 voices screaming in unison!",
          "⚡ Stadium shaking! 'YES! YES! YES!' chanted by thousands!",
          "💪 Fans on their feet! 'THAT'S HOW YOU DO IT!' someone screams!",
          "🎯 'BEAUTIFUL! BEAUTIFUL!' the crowd roars in appreciation!"
        ],
        medium: [
          "👏 Solid approval from the crowd! Applause mixed with excited chatter!",
          "🙌 'Nice shot!' can be heard from ringside!",
          "📣 Appreciative murmur ripples through the audience!",
          "✨ 'Good boxing!' someone shouts from the balcony!"
        ]
      },
      failure: {
        extreme: [
          "😱 CROWD GASPS IN HORROR! Pin-drop silence before explosive 'OHHHH NO!'",
          "💔 30,000 hearts sink at once! 'GET UP! GET UP!' desperately screamed!",
          "🚨 COLLECTIVE INTAKE OF BREATH! The arena falls deadly silent!",
          "⚰️ Crowd holds its breath! 'NOOOOO!' echoes from every corner!"
        ],
        high: [
          "😬 Crowd winces collectively! 'Ohhhhh!' ripples through the stands!",
          "🤦‍♂️ 'Come on!' frustrated voices shout from all directions!",
          "😤 'You got this!' supportive but concerned voices call out!",
          "💥 'WAKE UP!' someone screams desperately!"
        ],
        medium: [
          "😐 Mixed reactions from the crowd, some groaning softly",
          "🤷‍♂️ 'Shake it off!' a loyal fan encourages",
          "📢 Scattered 'Let's go!' chants trying to rally support",
          "🙏 'Come on, focus!' ringside advice being shouted"
        ]
      }
    };

    const reactionType = success ? "success" : "failure";
    const intensityLevel = intensity as keyof typeof crowdReactions.success;
    const reactions = crowdReactions[reactionType][intensityLevel] || crowdReactions[reactionType].medium;
    
    return reactions[Math.floor(Math.random() * reactions.length)];
  };

  const generateFightResult = (choice: FightChoice): string => {
    // Calculate success based on fighter stats and choice type
    let baseSuccessChance = 0.5;
    
    switch (choice.type) {
      case "aggressive":
        baseSuccessChance = (fighter.power + fighter.speed) / 200 + 0.1;
        break;
      case "tactical":
        baseSuccessChance = (fighter.technique + fighter.experience) / 200 + 0.2;
        break;
      case "defensive":
        baseSuccessChance = (fighter.defense + fighter.experience) / 200 + 0.3;
        break;
      case "risky":
        baseSuccessChance = fighter.power / 200 + 0.1;
        break;
    }
    
    // Factor in stamina
    const staminaFactor = fighter.stamina / 100;
    const finalSuccessChance = Math.min(0.9, baseSuccessChance * staminaFactor);
    
    const success = Math.random() < finalSuccessChance;
    
    // Dynamic intensity based on round and action type
    const roundIntensity = currentFight.round > 8 ? "extreme" : 
                          currentFight.round > 6 ? "high" : 
                          currentFight.round > 3 ? "medium" : "low";
    setFightIntensity(roundIntensity);
    
    const opponentActions = [
      "EXPLODES with a bone-crushing counter left hook that could decapitate a horse",
      "MAULS you in the clinch, throwing vicious elbows and grinding his forearm into your throat", 
      "retreats like a wounded predator, eyes blazing with murderous intent",
      "DEMOLISHES your ribs with a body shot that feels like a sledgehammer",
      "LAUNCHES a catastrophic uppercut that could launch you into orbit",
      "stalks you like death itself, setting deadly traps with surgical precision",
      "UNLEASHES HELL with a combination that sounds like machine gun fire",
      "DETONATES a right cross that shakes the entire arena",
      "BRUTALIZES your body with shots that feel like sledgehammers to concrete",
      "suffocates you in the clinch, using his weight like a python crushing its prey",
      "pivots and BOMBS you with a left hook from the gates of hell",
      "advances like a rabid animal with blood in his eyes and murder on his mind"
    ];
    
    const opponentAction = opponentActions[Math.floor(Math.random() * opponentActions.length)];
    
    // Generate crowd reaction
    const crowdReaction = generateCrowdReaction(success, roundIntensity, choice.type);
    
    // Generate facial expressions and injuries
    const playerExpression = generateFacialExpression(success, choice.type, fighter.stamina);
    const opponentExpression = generateFacialExpression(!success, "defensive", 100 - currentFight.round * 8);
    const injuryResult = generateInjury(choice, success, roundIntensity);
    
    if (success) {
      const successResults = {
        aggressive: [
          `💥 NUCLEAR BOMB! Your fist DETONATES against his skull like a wrecking ball through glass! ${playerExpression} Blood and spit spray everywhere as your opponent ${opponentAction} - but he's SHATTERED! ${opponentExpression} ${crowdReaction} His legs turn to jelly! ${injuryResult}`,
          `⚡ LIGHTNING STRIKE! Your shot EXPLODES with the fury of Thor's hammer! ${playerExpression} Your opponent's eyes roll back as he ${opponentAction} but he's BROKEN! ${opponentExpression} ${crowdReaction} His soul left his body! ${injuryResult}`,
          `🔥 APOCALYPTIC IMPACT! You connect with the force of a freight train hitting a brick wall! ${playerExpression} Your opponent ${opponentAction} like a dying animal, but it's TOO LATE! ${opponentExpression} ${crowdReaction} The damage is CATASTROPHIC! ${injuryResult}`,
          `💀 DEATH BLOW! Your fist finds its mark with surgical brutality! Mouthpiece flies into the crowd as he ${opponentAction} desperately! ${playerExpression} ${opponentExpression} ${crowdReaction} THIS COULD BE MURDER! ${injuryResult}`
        ],
        tactical: [
          `🎯 SURGICAL PERFECTION! You dissect him like a master butcher! ${playerExpression} Your opponent ${opponentAction} but you've already executed your plan to PERFECTION! ${opponentExpression} ${crowdReaction} Pure boxing POETRY written in blood! ${injuryResult}`,
          `🧠 CHESS GRANDMASTER! You're playing 4D chess while he's playing checkers! ${playerExpression} He ${opponentAction} but you saw this coming three moves ago! ${opponentExpression} ${crowdReaction} Intellectual DOMINATION! ${injuryResult}`,
          `🎨 VIOLENT ART! Your technique is Michelangelo painting with blood! ${playerExpression} Your opponent ${opponentAction} but you counter with GENIUS precision! ${opponentExpression} ${crowdReaction} This is BOXING POETRY! ${injuryResult}`,
          `⚡ CALCULATED DESTRUCTION! Every movement planned, every punch measured! ${playerExpression} Your opponent ${opponentAction} but walks into your TRAP! ${opponentExpression} ${crowdReaction} Scientific BRUTALITY! ${injuryResult}`
        ],
        defensive: [
          `👻 PHANTOM MODE! You slip like smoke through his desperate attempts! Your opponent ${opponentAction} but hits NOTHING but air! ${crowdReaction} He's swinging at ghosts! You counter with VENGEANCE!`,
          `🌪️ MATRIX DEFENSE! Time slows as you see everything in slow motion! Your opponent ${opponentAction} with murderous intent but you're GONE! ${crowdReaction} Untouchable and DEADLY!`,
          `💨 SMOKE AND MIRRORS! Your opponent ${opponentAction} desperately but you've vanished like a magician! ${crowdReaction} He's fighting his own shadow while you PUNISH him!`,
          `🛡️ FORTRESS OF STEEL! Your opponent ${opponentAction} with everything he's got but NOTHING gets through! ${crowdReaction} Impenetrable defense meets DEVASTATING counter!`
        ],
        risky: [
          `🎰 JACKPOT! Your desperate gamble pays off like hitting the lottery in HELL! ${crowdReaction} Your opponent ${opponentAction} right into your DOOMSDAY weapon! The arena has become a MADHOUSE!`,
          `🚀 ROCKET LAUNCH! Your all-or-nothing attack EXPLODES like a nuclear warhead! Your opponent ${opponentAction} but walks into ARMAGEDDON! ${crowdReaction} This place is INSANE!`,
          `⚡ LIGHTNING IN A BOTTLE! Your wild swing finds the sweet spot like destiny itself! Your opponent ${opponentAction} but fate had other plans! ${crowdReaction} Sometimes the gods smile upon the BOLD!`,
          `🌪️ TORNADO OF DESTRUCTION! Your opponent ${opponentAction} but your hurricane punch OBLITERATES everything! ${crowdReaction} When you risk it all, the universe DELIVERS!`
        ]
      };
      return successResults[choice.type][Math.floor(Math.random() * successResults[choice.type].length)];
    } else {
      const failureResults = {
        aggressive: [
          `💔 CATASTROPHIC WHIFF! Your haymaker cuts through empty air like a sword through mist! Your opponent sees it coming from Mars and ${opponentAction} with DEVASTATING precision! ${crowdReaction} You're in the DANGER ZONE now!`,
          `⚰️ FATAL ERROR! Your wild aggression leaves you naked and exposed! Your opponent ${opponentAction} like a predator sensing blood! ${crowdReaction} Your recklessness will be your DOWNFALL!`,
          `🚨 CODE RED! Your power shot finds nothing but atmosphere! Your opponent ${opponentAction} making you pay the ULTIMATE price! ${crowdReaction} He's taking COMPLETE control!`,
          `💀 DEATH SENTENCE! You throw everything behind that shot and hit NOTHING! Your opponent ${opponentAction} and you're now dancing with DEATH! ${crowdReaction} One mistake could END everything!`
        ],
        tactical: [
          `🧠 OUTSMARTED! Your opponent reads your mind like an open book and ${opponentAction} shutting down your entire EXISTENCE! ${crowdReaction} He's ten steps ahead in this deadly dance!`,
          `💥 COUNTERED TO HELL! Your technical approach gets DEMOLISHED as your opponent ${opponentAction} beating you at your own game! ${crowdReaction} He saw that coming from yesterday!`,
          `🎯 NEUTRALIZED! Your opponent has cracked your code and ${opponentAction} turning your strength into WEAKNESS! ${crowdReaction} Time to abandon the game plan!`,
          `😈 PREDICTED! Your opponent anticipated that move perfectly and ${opponentAction} making you look like an AMATEUR! ${crowdReaction} He's living in your HEAD rent-free!`
        ],
        defensive: [
          `💀 FORTRESS BREACHED! Your shell defense CRUMBLES like paper in a hurricane! Your opponent ${opponentAction} finding every gap! ${crowdReaction} Passive boxing won't save you from this STORM!`,
          `🚨 BREAKTHROUGH! Your defense finally BREAKS and your opponent ${opponentAction} getting through with AUTHORITY! ${crowdReaction} The tide has turned into a TSUNAMI!`,
          `⚰️ NOT ENOUGH! Your safety-first approach backfires SPECTACULARLY as your opponent ${opponentAction} taking complete OWNERSHIP! ${crowdReaction} Time to take DEADLY risks!`,
          `🌪️ OVERWHELMED! Your opponent ${opponentAction} with relentless pressure that would break steel! ${crowdReaction} He's breaking you down piece by PIECE!`
        ],
        risky: [
          `💀 APOCALYPTIC DISASTER! Your wild gamble backfires like a nuclear meltdown! Your opponent ${opponentAction} making you pay the ULTIMATE price! ${crowdReaction} This could be your FUNERAL!`,
          `⚰️ CATASTROPHIC FAILURE! Your desperation move fails more spectacularly than the Titanic! Your opponent ${opponentAction} capitalizing on your FATAL mistake! ${crowdReaction} You're fighting for your LIFE!`,
          `🚨 TOTAL MELTDOWN! Your all-or-nothing attempt goes wrong in EVERY possible way! Your opponent ${opponentAction} putting you in mortal DANGER! ${crowdReaction} This is a NIGHTMARE!`,
          `💀 PUNISHED BY THE GODS! Your reckless abandon costs you EVERYTHING as your opponent ${opponentAction} and you're now in SURVIVAL mode! ${crowdReaction} The ring has become your potential GRAVE!`
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
              <h3 className="font-bold text-sm">{fighter.name}</h3>
              <p className="text-xs text-muted-foreground">{fighter.wins}-{fighter.losses}</p>
            </div>
            <div className="text-center">
              <Badge className="bg-boxing-red text-white text-sm px-2 py-1">
                ROUND {currentFight.round}
              </Badge>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-sm">{currentFight.opponent.name}</h3>
              <p className="text-xs text-muted-foreground">{currentFight.opponent.wins}-{currentFight.opponent.losses}</p>
            </div>
          </div>
          
          {/* Score */}
          <div className="flex justify-center space-x-8 mb-2">
            <div className="text-center">
              <div className="text-lg font-bold text-boxing-gold">{currentFight.playerScore}</div>
              <div className="text-xs">YOU</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-boxing-gold">{currentFight.opponentScore}</div>
              <div className="text-xs">OPPONENT</div>
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
                Stamina: -{choice.staminaCost}
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FightInterface;