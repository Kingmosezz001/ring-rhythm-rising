import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Medal, Star, ChevronLeft, Crown, Target } from "lucide-react";
import { Fighter } from "./BoxingGame";

interface RankingInterfaceProps {
  fighter: Fighter;
  onBack: () => void;
  onChallengeFighter: (opponent: Fighter) => void;
}

interface RankedFighter extends Fighter {
  rank: number;
  belt?: string;
  isChampion?: boolean;
}

const RankingInterface = ({ fighter, onBack, onChallengeFighter }: RankingInterfaceProps) => {
  // Generate division rankings
  const generateRankings = (): RankedFighter[] => {
    const rankings: RankedFighter[] = [];
    
    // Champion
    rankings.push({
      name: "Marcus Johnson",
      age: 28,
      division: fighter.division,
      wins: 25,
      losses: 0,
      ko: 20,
      popularity: 95,
      stamina: 100,
      power: 95,
      speed: 90,
      defense: 92,
      technique: 95,
      mental: 90,
      experience: 95,
      injuries: [],
      facialDamage: 0,
      money: 5000000,
      energy: 100,
      weeksSinceLastFight: 2,
      unrankedWins: 0,
      socialMedia: { followers: 2500000, totalPosts: 450, totalLikes: 1200000, totalComments: 85000, totalShares: 15000 },
      rank: 1,
      belt: `${fighter.division} World Champion`,
      isChampion: true
    });

    // Top contenders
    const topFighters = [
      { name: "Rico Martinez", wins: 22, losses: 1, ko: 18, popularity: 85 },
      { name: "Tommy Thompson", wins: 20, losses: 2, ko: 15, popularity: 80 },
      { name: "Viktor Petrov", wins: 18, losses: 0, ko: 14, popularity: 75 },
      { name: "Carlos Rodriguez", wins: 19, losses: 3, ko: 12, popularity: 70 }
    ];

    topFighters.forEach((f, index) => {
      rankings.push({
        ...f,
        age: 24 + Math.floor(Math.random() * 8),
        division: fighter.division,
        stamina: 90 + Math.floor(Math.random() * 10),
        power: 80 + Math.floor(Math.random() * 15),
        speed: 80 + Math.floor(Math.random() * 15),
        defense: 80 + Math.floor(Math.random() * 15),
        technique: 75 + Math.floor(Math.random() * 20),
        mental: 75 + Math.floor(Math.random() * 20),
        experience: 70 + Math.floor(Math.random() * 20),
        injuries: [],
        facialDamage: 0,
        money: 500000 + Math.floor(Math.random() * 1000000),
        energy: 100,
        weeksSinceLastFight: Math.floor(Math.random() * 4),
        unrankedWins: 0,
        socialMedia: {
          followers: 100000 + Math.floor(Math.random() * 500000),
          totalPosts: 100 + Math.floor(Math.random() * 200),
          totalLikes: 50000 + Math.floor(Math.random() * 200000),
          totalComments: 5000 + Math.floor(Math.random() * 20000),
          totalShares: 1000 + Math.floor(Math.random() * 5000)
        },
        rank: index + 2
      });
    });

    // Add player to rankings if qualified
    const playerRank = calculatePlayerRank(fighter);
    if (playerRank <= 15) {
      rankings.push({
        ...fighter,
        rank: playerRank
      });
    }

    return rankings.sort((a, b) => a.rank - b.rank).slice(0, 15);
  };

  const calculatePlayerRank = (fighter: Fighter): number => {
    // Player needs significant experience to be ranked
    if (fighter.wins < 5) return 999; // Unranked
    
    const baseRank = Math.max(6, 20 - Math.floor(fighter.wins / 2));
    const experienceBonus = Math.floor(fighter.experience / 10);
    const popularityBonus = Math.floor(fighter.popularity / 20);
    
    return Math.max(1, baseRank - experienceBonus - popularityBonus);
  };

  const rankings = generateRankings();
  const playerRank = calculatePlayerRank(fighter);
  const isPlayerRanked = playerRank <= 15;

  const canChallenge = (opponent: RankedFighter): boolean => {
    if (!isPlayerRanked) return false;
    
    // Can only challenge fighters within 3 ranks above or below
    const rankDifference = Math.abs(opponent.rank - playerRank);
    return rankDifference <= 3 && opponent.rank !== playerRank;
  };

  const getBeltColor = (rank: number, isChampion?: boolean) => {
    if (isChampion) return "text-yellow-400";
    if (rank <= 3) return "text-amber-500";
    if (rank <= 10) return "text-slate-400";
    return "text-orange-600";
  };

  return (
    <div className="min-h-screen bg-gradient-ring p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6 bg-card border-boxing-red">
          <div className="flex items-center justify-between">
            <Button 
              onClick={onBack}
              variant="outline" 
              className="border-boxing-red text-boxing-red hover:bg-boxing-red/10"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Career
            </Button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-boxing-gold">{fighter.division} Division Rankings</h1>
              <p className="text-muted-foreground">Official World Boxing Rankings</p>
            </div>
            <div className="w-32" /> {/* Spacer */}
          </div>
        </Card>

        {/* Player Status */}
        <Card className="p-4 bg-card border-boxing-red">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg" alt={fighter.name} />
                <AvatarFallback className="bg-gradient-champion text-boxing-dark">
                  {fighter.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-boxing-gold">{fighter.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {isPlayerRanked ? `Ranked #${playerRank}` : "Unranked - Need more wins to qualify"}
                </p>
              </div>
            </div>
            {isPlayerRanked && (
              <Badge className="bg-boxing-gold text-boxing-dark">
                <Target className="h-4 w-4 mr-1" />
                Ranked Fighter
              </Badge>
            )}
          </div>
        </Card>

        {/* Rankings Table */}
        <Card className="p-6 bg-card border-boxing-red">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-6 w-6 text-boxing-gold" />
            <h2 className="text-xl font-bold text-boxing-gold">Official Rankings</h2>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Fighter</TableHead>
                <TableHead>Record</TableHead>
                <TableHead>Popularity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankings.map((rankedFighter) => (
                <TableRow 
                  key={rankedFighter.name} 
                  className={rankedFighter.name === fighter.name ? "bg-boxing-gold/10" : ""}
                >
                  <TableCell className="font-bold">
                    <div className="flex items-center gap-2">
                      {rankedFighter.isChampion && <Crown className="h-4 w-4 text-yellow-400" />}
                      {rankedFighter.rank <= 3 && !rankedFighter.isChampion && <Medal className="h-4 w-4 text-amber-500" />}
                      #{rankedFighter.rank}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt={rankedFighter.name} />
                        <AvatarFallback className="text-xs">
                          {rankedFighter.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{rankedFighter.name}</p>
                          {rankedFighter.isChampion && <span className="text-yellow-400">🏆</span>}
                          {rankedFighter.belt && !rankedFighter.isChampion && <span className="text-amber-500">🥇</span>}
                        </div>
                        <p className="text-xs text-muted-foreground">Age {rankedFighter.age}</p>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <p className="font-semibold">{rankedFighter.wins}-{rankedFighter.losses}</p>
                      <p className="text-xs text-muted-foreground">{rankedFighter.ko} KOs</p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-boxing-gold" />
                      <span>{rankedFighter.popularity}%</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {rankedFighter.isChampion && (
                      <Badge className="bg-yellow-500 text-black">
                        <Crown className="h-3 w-3 mr-1" />
                        Champion
                      </Badge>
                    )}
                    {rankedFighter.belt && !rankedFighter.isChampion && (
                      <Badge variant="outline" className="border-boxing-gold text-boxing-gold">
                        {rankedFighter.belt}
                      </Badge>
                    )}
                    {rankedFighter.name === fighter.name && (
                      <Badge className="bg-boxing-red text-white">You</Badge>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {rankedFighter.name !== fighter.name && (
                      <Button
                        size="sm"
                        onClick={() => onChallengeFighter(rankedFighter)}
                        disabled={!canChallenge(rankedFighter)}
                        className={canChallenge(rankedFighter) 
                          ? "bg-boxing-red hover:bg-boxing-red/80" 
                          : "bg-muted cursor-not-allowed"
                        }
                      >
                        {canChallenge(rankedFighter) ? "Challenge" : "Can't Challenge"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* How to Get Ranked */}
        {!isPlayerRanked && (
          <Card className="p-4 bg-card border-boxing-red">
            <h3 className="font-bold text-boxing-gold mb-2">How to Get Ranked</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Win at least 5 professional fights</p>
              <p>• Build experience through training and fighting</p>
              <p>• Increase your popularity through media and wins</p>
              <p>• Fight unranked opponents first to build your record</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RankingInterface;