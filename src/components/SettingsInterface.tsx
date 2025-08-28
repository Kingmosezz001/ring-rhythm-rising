import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Fighter } from "./BoxingGame";
import { ArrowLeft, SkipForward, RotateCcw, Calendar, RefreshCw } from "lucide-react";

interface SettingsInterfaceProps {
  fighter: Fighter;
  onBack: () => void;
  onNextWeek: () => void;
  onReset: () => void;
}

const SettingsInterface = ({ fighter, onBack, onNextWeek, onReset }: SettingsInterfaceProps) => {
  const { toast } = useToast();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleNextWeek = () => {
    onNextWeek();
    toast({
      title: "Time Advanced",
      description: "One week has passed. New opportunities may be available!",
    });
  };

  const handleReset = () => {
    if (!showResetConfirm) {
      setShowResetConfirm(true);
      return;
    }
    
    onReset();
    toast({
      title: "Game Reset",
      description: "Your career has been reset. Time to start fresh!",
    });
  };

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
              <h1 className="text-3xl font-bold text-boxing-gold">SETTINGS</h1>
              <p className="text-muted-foreground">Manage your career and game settings</p>
            </div>
            <div className="w-24"></div>
          </div>
        </Card>

        {/* Career Management */}
        <Card className="p-6 bg-card border-boxing-red">
          <h3 className="text-xl font-bold text-boxing-gold mb-6">Career Management</h3>
          
          <div className="grid gap-4">
            {/* Next Week Button */}
            <div className="bg-muted p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold mb-2">Advance Time</h4>
                  <p className="text-muted-foreground">
                    Skip to next week to see new training opportunities, fight offers, and career developments.
                  </p>
                </div>
                <Button
                  onClick={handleNextWeek}
                  className="bg-gradient-champion text-boxing-dark font-bold"
                >
                  <SkipForward className="h-4 w-4 mr-2" />
                  Next Week
                </Button>
              </div>
            </div>

            {/* Reset Game Button */}
            <div className="bg-muted p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold mb-2 text-red-500">Reset Career</h4>
                  <p className="text-muted-foreground">
                    Start over with a new fighter. This will permanently delete your current progress.
                  </p>
                </div>
                <div className="flex gap-2">
                  {showResetConfirm && (
                    <Button
                      onClick={() => setShowResetConfirm(false)}
                      variant="outline"
                      className="border-boxing-red text-boxing-red"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    onClick={handleReset}
                    variant={showResetConfirm ? "destructive" : "outline"}
                    className={showResetConfirm ? "" : "border-red-500 text-red-500 hover:bg-red-500/10"}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {showResetConfirm ? "Confirm Reset" : "Reset Game"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Career Stats */}
        <Card className="p-6 bg-card border-boxing-red">
          <h3 className="text-xl font-bold text-boxing-gold mb-6">Career Statistics</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-boxing-gold">{fighter.wins}</div>
              <div className="text-sm text-muted-foreground">Wins</div>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-500">{fighter.losses}</div>
              <div className="text-sm text-muted-foreground">Losses</div>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-boxing-gold">{fighter.ko}</div>
              <div className="text-sm text-muted-foreground">Knockouts</div>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-500">${fighter.money.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Earnings</div>
            </div>
          </div>
        </Card>

        {/* Fighter Status */}
        <Card className="p-6 bg-card border-boxing-red">
          <h3 className="text-xl font-bold text-boxing-gold mb-6">Fighter Status</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Popularity</span>
              <span className="text-boxing-gold">{fighter.popularity}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Division</span>
              <span className="text-boxing-gold">{fighter.division}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Age</span>
              <span className="text-boxing-gold">{fighter.age} years old</span>
            </div>
            {fighter.injuries.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="font-semibold text-red-500">Injuries</span>
                <span className="text-red-500">{fighter.injuries.length} active</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsInterface;