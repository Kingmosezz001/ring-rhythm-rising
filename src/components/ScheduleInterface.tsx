import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Fighter } from "./BoxingGame";
import { ArrowLeft, Calendar, DollarSign, Star, Trophy, Shield, Zap } from "lucide-react";

interface ScheduleInterfaceProps {
  fighter: Fighter;
  onBack: () => void;
  onStartFight: (opponent: Fighter, purse: number) => void;
}

interface FightOffer {
  opponent: Fighter;
  purse: number;
  odds: { player: number; opponent: number };
  status: "pending" | "accepted" | "rejected";
  negotiationRounds: number;
}

const ScheduleInterface = ({ fighter, onBack, onStartFight }: ScheduleInterfaceProps) => {
  const { toast } = useToast();
  const [fightOffers, setFightOffers] = useState<FightOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<FightOffer | null>(null);

  const generateFightOffer = (opponent: Fighter): FightOffer => {
    // Calculate purse based on popularity and skill
    const basePurse = 10000;
    const popularityMultiplier = (fighter.popularity + opponent.popularity) / 100;
    const skillMultiplier = (fighter.experience + opponent.experience) / 100;
    const purse = Math.floor(basePurse * popularityMultiplier * skillMultiplier * (0.8 + Math.random() * 0.4));

    // Calculate odds based on stats
    const playerStrength = (fighter.power + fighter.speed + fighter.defense + fighter.experience) / 4;
    const opponentStrength = (opponent.power + opponent.speed + opponent.defense + opponent.experience) / 4;
    
    const strengthDiff = playerStrength - opponentStrength;
    let playerOdds = 2.0;
    let opponentOdds = 2.0;

    if (strengthDiff > 10) {
      playerOdds = 1.5;
      opponentOdds = 2.8;
    } else if (strengthDiff > 5) {
      playerOdds = 1.7;
      opponentOdds = 2.4;
    } else if (strengthDiff < -10) {
      playerOdds = 3.2;
      opponentOdds = 1.3;
    } else if (strengthDiff < -5) {
      playerOdds = 2.6;
      opponentOdds = 1.6;
    }

    return {
      opponent,
      purse,
      odds: { player: playerOdds, opponent: opponentOdds },
      status: "pending",
      negotiationRounds: 0
    };
  };

  const availableOpponents: Fighter[] = [
    {
      name: "Miguel Rodriguez",
      age: 28,
      division: fighter.division,
      wins: 15,
      losses: 2,
      ko: 8,
      popularity: 65,
      stamina: 100,
      power: 78,
      speed: 72,
      defense: 85,
      experience: 70,
      injuries: [],
      facialDamage: 0,
      money: 80000
    },
    {
      name: "Tommy Iron Fist Sullivan",
      age: 32,
      division: fighter.division,
      wins: 22,
      losses: 4,
      ko: 18,
      popularity: 82,
      stamina: 100,
      power: 90,
      speed: 68,
      defense: 75,
      experience: 85,
      injuries: [],
      facialDamage: 0,
      money: 150000
    },
    {
      name: "Aleksandr The Siberian Volkov",
      age: 26,
      division: fighter.division,
      wins: 18,
      losses: 1,
      ko: 12,
      popularity: 75,
      stamina: 100,
      power: 85,
      speed: 80,
      defense: 82,
      experience: 78,
      injuries: [],
      facialDamage: 0,
      money: 120000
    },
    {
      name: "Carlos El Toro Mendez",
      age: 30,
      division: fighter.division,
      wins: 20,
      losses: 3,
      ko: 14,
      popularity: 70,
      stamina: 100,
      power: 82,
      speed: 75,
      defense: 78,
      experience: 80,
      injuries: [],
      facialDamage: 0,
      money: 100000
    }
  ];

  const makeOffer = (opponent: Fighter) => {
    const offer = generateFightOffer(opponent);
    setFightOffers(prev => [...prev, offer]);
    
    // Simulate opponent's decision making
    setTimeout(() => {
      const acceptanceChance = calculateAcceptanceChance(offer);
      const accepted = Math.random() < acceptanceChance;
      
      setFightOffers(prev => prev.map(f => 
        f.opponent.name === opponent.name 
          ? { ...f, status: accepted ? "accepted" : "rejected" }
          : f
      ));

      if (accepted) {
        toast({
          title: "Fight Accepted!",
          description: `${opponent.name} has accepted your challenge for $${offer.purse.toLocaleString()}!`,
        });
      } else {
        toast({
          title: "Fight Rejected",
          description: `${opponent.name} has declined your offer. Try negotiating or building your reputation.`,
          variant: "destructive"
        });
      }
    }, 2000 + Math.random() * 3000);

    toast({
      title: "Offer Sent",
      description: `Fight offer sent to ${opponent.name}. Waiting for response...`,
    });
  };

  const calculateAcceptanceChance = (offer: FightOffer): number => {
    let baseChance = 0.4;
    
    // Popularity factor
    const popularityDiff = fighter.popularity - offer.opponent.popularity;
    if (popularityDiff > 20) baseChance += 0.2;
    else if (popularityDiff < -20) baseChance -= 0.2;
    
    // Skill factor
    const playerSkill = (fighter.power + fighter.speed + fighter.defense + fighter.experience) / 4;
    const opponentSkill = (offer.opponent.power + offer.opponent.speed + offer.opponent.defense + offer.opponent.experience) / 4;
    const skillDiff = playerSkill - opponentSkill;
    
    if (skillDiff < -15) baseChance += 0.3; // Easy fight for opponent
    else if (skillDiff > 15) baseChance -= 0.3; // Hard fight for opponent
    
    // Purse factor
    if (offer.purse > 50000) baseChance += 0.2;
    else if (offer.purse < 20000) baseChance -= 0.1;
    
    return Math.max(0.1, Math.min(0.9, baseChance));
  };

  const negotiateOffer = (offer: FightOffer) => {
    if (offer.negotiationRounds >= 3) {
      toast({
        title: "Negotiation Failed",
        description: "Too many negotiation attempts. The offer has been withdrawn.",
        variant: "destructive"
      });
      setFightOffers(prev => prev.filter(f => f !== offer));
      return;
    }

    const newPurse = Math.floor(offer.purse * 1.15);
    const updatedOffer = { 
      ...offer, 
      purse: newPurse, 
      negotiationRounds: offer.negotiationRounds + 1,
      status: "pending" as const
    };

    setFightOffers(prev => prev.map(f => f === offer ? updatedOffer : f));

    setTimeout(() => {
      const acceptanceChance = calculateAcceptanceChance(updatedOffer) - (offer.negotiationRounds * 0.1);
      const accepted = Math.random() < acceptanceChance;
      
      setFightOffers(prev => prev.map(f => 
        f.opponent.name === offer.opponent.name 
          ? { ...f, status: accepted ? "accepted" : "rejected" }
          : f
      ));

      if (accepted) {
        toast({
          title: "Negotiation Successful!",
          description: `${offer.opponent.name} accepted the new offer of $${newPurse.toLocaleString()}!`,
        });
      } else {
        toast({
          title: "Negotiation Failed",
          description: `${offer.opponent.name} rejected the counter-offer.`,
          variant: "destructive"
        });
      }
    }, 1500 + Math.random() * 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-ring p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <Card className="p-4 bg-card border-boxing-red">
          <div className="flex items-center justify-between">
            <Button
              onClick={onBack}
              variant="outline"
              className="border-boxing-red text-boxing-red hover:bg-boxing-red/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Career
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-boxing-gold">SCHEDULE FIGHT</h1>
              <p className="text-sm text-muted-foreground">Negotiate and schedule your next bout</p>
            </div>
            <div className="w-24"></div>
          </div>
        </Card>

        {/* Active Offers */}
        {fightOffers.length > 0 && (
          <Card className="p-4 bg-card border-boxing-red">
            <h3 className="text-xl font-bold text-boxing-gold mb-4">Active Fight Offers</h3>
            <div className="space-y-4">
              {fightOffers.map((offer, index) => (
                <div key={index} className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-lg">{offer.opponent.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {offer.opponent.wins}-{offer.opponent.losses} ({offer.opponent.ko} KO)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-boxing-gold">
                        ${offer.purse.toLocaleString()}
                      </p>
                      <p className="text-sm">
                        Odds: {offer.odds.player.toFixed(1)}:1 vs {offer.odds.opponent.toFixed(1)}:1
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge 
                        variant={offer.status === "accepted" ? "default" : 
                                offer.status === "rejected" ? "destructive" : "secondary"}
                        className="mb-2"
                      >
                        {offer.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  {offer.status === "accepted" && (
                    <Button
                      onClick={() => onStartFight(offer.opponent, offer.purse)}
                      className="mt-2 bg-gradient-champion text-boxing-dark font-bold"
                    >
                      START FIGHT
                    </Button>
                  )}
                  
                  {offer.status === "rejected" && offer.negotiationRounds < 3 && (
                    <Button
                      onClick={() => negotiateOffer(offer)}
                      variant="outline"
                      className="mt-2 border-boxing-gold text-boxing-gold"
                    >
                      RENEGOTIATE (+15% purse)
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Available Opponents */}
        <Card className="p-4 bg-card border-boxing-red">
          <h3 className="text-xl font-bold text-boxing-gold mb-4">Available Opponents</h3>
          <div className="grid gap-4">
            {availableOpponents.map((opponent) => {
              const alreadyOffered = fightOffers.some(f => f.opponent.name === opponent.name);
              const estimatedPurse = generateFightOffer(opponent).purse;
              
              return (
                <div key={opponent.name} className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-boxing-gold">{opponent.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span>{opponent.age} years old</span>
                        <span>{opponent.division}</span>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          <span>{opponent.wins}-{opponent.losses} ({opponent.ko} KO)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-boxing-gold" />
                          <span>{opponent.popularity}% popularity</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 mt-3">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Zap className="h-4 w-4 text-red-500" />
                            <span className="text-xs font-semibold">POWER</span>
                          </div>
                          <Progress value={opponent.power} className="h-2" />
                          <span className="text-xs text-muted-foreground">{opponent.power}</span>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Zap className="h-4 w-4 text-yellow-500" />
                            <span className="text-xs font-semibold">SPEED</span>
                          </div>
                          <Progress value={opponent.speed} className="h-2" />
                          <span className="text-xs text-muted-foreground">{opponent.speed}</span>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Shield className="h-4 w-4 text-blue-500" />
                            <span className="text-xs font-semibold">DEFENSE</span>
                          </div>
                          <Progress value={opponent.defense} className="h-2" />
                          <span className="text-xs text-muted-foreground">{opponent.defense}</span>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Star className="h-4 w-4 text-purple-500" />
                            <span className="text-xs font-semibold">EXP</span>
                          </div>
                          <Progress value={opponent.experience} className="h-2" />
                          <span className="text-xs text-muted-foreground">{opponent.experience}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-2">
                        <DollarSign className="h-5 w-5 text-boxing-gold" />
                        <span className="text-lg font-bold text-boxing-gold">
                          ~${estimatedPurse.toLocaleString()}
                        </span>
                      </div>
                      <Button
                        onClick={() => makeOffer(opponent)}
                        disabled={alreadyOffered}
                        className="bg-gradient-danger hover:scale-105 transition-transform"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        {alreadyOffered ? "OFFER SENT" : "SEND OFFER"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ScheduleInterface;