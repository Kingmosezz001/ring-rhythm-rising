import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Fighter } from "./BoxingGame";

interface RegistrationFormProps {
  onCreateFighter: (fighter: Fighter) => void;
}

const RegistrationForm = ({ onCreateFighter }: RegistrationFormProps) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState(18);
  const [division, setDivision] = useState("Lightweight");
  const [fightingStyle, setFightingStyle] = useState("balanced");

  const divisions = ["Lightweight", "Welterweight", "Middleweight", "Light Heavyweight", "Heavyweight"];

  const getStatsForStyle = (style: string) => {
    switch (style) {
      case "brawler":
        return { power: 75, speed: 60, defense: 55 };
      case "boxer":
        return { power: 60, speed: 75, defense: 65 };
      case "slugger":
        return { power: 80, speed: 50, defense: 60 };
      case "counterpuncher":
        return { power: 65, speed: 70, defense: 75 };
      default: // balanced
        return { power: 65, speed: 70, defense: 60 };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const stats = getStatsForStyle(fightingStyle);
    const fighter: Fighter = {
      name: name.trim(),
      age,
      division,
      wins: 0,
      losses: 0,
      ko: 0,
      popularity: 10,
      stamina: 100,
      ...stats,
      experience: 0,
      injuries: [],
      facialDamage: 0,
      money: 25000,
      energy: 100,
      weeksSinceLastFight: 0,
      socialMedia: {
        followers: 100,
        totalPosts: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0
      }
    };

    onCreateFighter(fighter);
  };

  return (
    <div className="min-h-screen bg-gradient-ring flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 bg-card border-boxing-red shadow-champion">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold bg-gradient-champion bg-clip-text text-transparent">
            CREATE YOUR FIGHTER
          </h1>
          <p className="text-lg text-muted-foreground">
            Begin your journey to become a boxing legend
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="space-y-2">
              <Label htmlFor="name">Fighter Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your fighter's name"
                className="border-boxing-red/20 focus:border-boxing-red"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="18"
                  max="25"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="border-boxing-red/20 focus:border-boxing-red"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="division">Division</Label>
                <Select value={division} onValueChange={setDivision}>
                  <SelectTrigger className="border-boxing-red/20 focus:border-boxing-red">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions.map((div) => (
                      <SelectItem key={div} value={div}>{div}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="style">Fighting Style</Label>
              <Select value={fightingStyle} onValueChange={setFightingStyle}>
                <SelectTrigger className="border-boxing-red/20 focus:border-boxing-red">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Balanced Fighter</SelectItem>
                  <SelectItem value="brawler">Brawler (High Power)</SelectItem>
                  <SelectItem value="boxer">Boxer (High Speed)</SelectItem>
                  <SelectItem value="slugger">Slugger (Heavy Hitter)</SelectItem>
                  <SelectItem value="counterpuncher">Counter Puncher (High Defense)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Starting Stats:</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>Power: {getStatsForStyle(fightingStyle).power}</div>
                <div>Speed: {getStatsForStyle(fightingStyle).speed}</div>
                <div>Defense: {getStatsForStyle(fightingStyle).defense}</div>
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full bg-gradient-champion text-boxing-dark font-bold text-lg py-6 hover:scale-105 transition-transform"
            >
              ENTER THE RING
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default RegistrationForm;