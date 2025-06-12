import React from "react";
import { LocationForm } from "./components/location-form";
import { RiskDisplay } from "./components/risk-display";
import { InfoSection } from "./components/info-section";
import { Card, Divider } from "@heroui/react";
import { calculateRisk } from "./utils/risk-calculator";
import { Weather, Season, RiskResult } from "./types/types";
import { RiskHistory } from "./components/risk-history";

export default function App() {
  const [currentRisk, setCurrentRisk] = React.useState<RiskResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [riskHistory, setRiskHistory] = React.useState<RiskResult[]>([]);

  const handleLocationSubmit = async (
    latitude: number, 
    longitude: number, 
    locationName: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, we would fetch actual weather data from an API
      // For this demo, we're simulating an API call with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Get current date to determine season
      const today = new Date();
      const month = today.getMonth();
      
      let season: Season;
      // Northern hemisphere seasons (simplified)
      if (month >= 2 && month <= 4) season = "spring";
      else if (month >= 5 && month <= 7) season = "summer";
      else if (month >= 8 && month <= 10) season = "fall";
      else season = "winter";
      
      // Simulate weather conditions based on season and some randomness
      const weather: Weather = {
        temperature: Math.round(season === "summer" ? 75 + Math.random() * 15 : 
                               season === "winter" ? 35 + Math.random() * 20 :
                               55 + Math.random() * 20),
        conditions: ["sunny", "cloudy", "rainy", "windy"][Math.floor(Math.random() * 4)],
        windSpeed: Math.round(5 + Math.random() * 20),
        precipitation: Math.random() > 0.7 ? Math.round(Math.random() * 100) / 10 : 0
      };
      
      // Calculate risk based on location, weather, and season
      const risk = calculateRisk(latitude, longitude, weather, season);
      
      const result: RiskResult = {
        id: Date.now(),
        location: {
          latitude,
          longitude,
          name: locationName
        },
        date: today.toISOString(),
        weather,
        season,
        riskScore: risk.score,
        riskLevel: risk.level,
        factors: risk.factors
      };
      
      setCurrentRisk(result);
      setRiskHistory(prev => [result, ...prev].slice(0, 5)); // Keep only the 5 most recent
      
    } catch (err) {
      setError("Failed to assess risk. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <header className="text-center py-8">
          <h1 className="text-3xl font-semibold text-foreground">Bird Droppings Risk Assessment</h1>
          <p className="text-foreground-500 mt-2">
            Assess the likelihood of bird droppings landing on your vehicle
          </p>
        </header>
        
        <Card className="p-6">
          <LocationForm onSubmit={handleLocationSubmit} isLoading={isLoading} />
        </Card>
        
        {currentRisk && (
          <Card className="p-6">
            <RiskDisplay risk={currentRisk} />
          </Card>
        )}
        
        {riskHistory.length > 0 && (
          <Card className="p-6">
            <RiskHistory history={riskHistory} />
          </Card>
        )}
        
        <Divider className="my-8" />
        
        <Card className="p-6">
          <InfoSection />
        </Card>
      </div>
    </div>
  );
}