import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Fighter } from "./BoxingGame";
import { ArrowLeft, Trophy, TrendingUp, Star, DollarSign, Users, Target, Calendar, Zap } from "lucide-react";

interface StatsInterfaceProps {
  fighter: Fighter;
  currentWeek: number;
  onBack: () => void;
}

const StatsInterface = ({ fighter, currentWeek, onBack }: StatsInterfaceProps) => {
  const totalFights = fighter.wins + fighter.losses;
  const winRate = totalFights > 0 ? Math.round((fighter.wins / totalFights) * 100) : 0;
  const koRate = totalFights > 0 ? Math.round((fighter.ko / totalFights) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-ring p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6 bg-card border-boxing-red">
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
              <h1 className="text-3xl font-bold text-boxing-gold">FIGHTER STATISTICS</h1>
              <p className="text-muted-foreground">Complete career overview</p>
            </div>
            <div className="w-24"></div>
          </div>
        </Card>

        {/* Career Overview */}
        <Card className="p-6 bg-card border-boxing-red">
          <h3 className="text-xl font-bold text-boxing-gold mb-4 flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            Career Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-boxing-gold">{fighter.wins}</div>
              <div className="text-sm text-muted-foreground">Wins</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-boxing-red">{fighter.losses}</div>
              <div className="text-sm text-muted-foreground">Losses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-boxing-gold">{fighter.ko}</div>
              <div className="text-sm text-muted-foreground">Knockouts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-boxing-gold">{winRate}%</div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </div>
          </div>
        </Card>

        {/* Physical Stats */}
        <Card className="p-6 bg-card border-boxing-red">
          <h3 className="text-xl font-bold text-boxing-gold mb-4 flex items-center gap-2">
            <Target className="h-6 w-6" />
            Physical Attributes
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Power</span>
                <span>{fighter.power}/100</span>
              </div>
              <Progress value={fighter.power} className="h-3" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Speed</span>
                <span>{fighter.speed}/100</span>
              </div>
              <Progress value={fighter.speed} className="h-3" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Defense</span>
                <span>{fighter.defense}/100</span>
              </div>
              <Progress value={fighter.defense} className="h-3" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Stamina</span>
                <span>{fighter.stamina}/100</span>
              </div>
              <Progress value={fighter.stamina} className="h-3" />
            </div>
          </div>
        </Card>

        {/* Career Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-card border-boxing-red">
            <h3 className="text-xl font-bold text-boxing-gold mb-4 flex items-center gap-2">
              <Star className="h-6 w-6" />
              Fame & Fortune
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Popularity</span>
                <Badge variant="secondary">{fighter.popularity}%</Badge>
              </div>
              <div className="flex justify-between">
                <span>Experience</span>
                <Badge variant="secondary">{fighter.experience} XP</Badge>
              </div>
              <div className="flex justify-between">
                <span>Money</span>
                <Badge variant="secondary">${fighter.money.toLocaleString()}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Energy</span>
                <Badge variant={fighter.energy > 70 ? "default" : "destructive"}>{fighter.energy}%</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-boxing-red">
            <h3 className="text-xl font-bold text-boxing-gold mb-4 flex items-center gap-2">
              <Users className="h-6 w-6" />
              Social Media Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Followers</span>
                <Badge variant="secondary">{fighter.socialMedia.followers.toLocaleString()}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Total Posts</span>
                <Badge variant="secondary">{fighter.socialMedia.totalPosts}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Total Likes</span>
                <Badge variant="secondary">{fighter.socialMedia.totalLikes.toLocaleString()}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Total Comments</span>
                <Badge variant="secondary">{fighter.socialMedia.totalComments.toLocaleString()}</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Fighting Performance */}
        <Card className="p-6 bg-card border-boxing-red">
          <h3 className="text-xl font-bold text-boxing-gold mb-4 flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Fighting Performance
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-boxing-gold">{koRate}%</div>
              <div className="text-sm text-muted-foreground">KO Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-boxing-gold">{fighter.weeksSinceLastFight}</div>
              <div className="text-sm text-muted-foreground">Weeks Since Fight</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-boxing-gold">{currentWeek}</div>
              <div className="text-sm text-muted-foreground">Current Week</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-boxing-gold">{fighter.division}</div>
              <div className="text-sm text-muted-foreground">Division</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StatsInterface;