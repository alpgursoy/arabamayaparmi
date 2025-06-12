import { Weather, Season, RiskAssessment } from "../types/types";

// Bird activity factors based on season
const SEASON_FACTORS = {
  spring: {
    multiplier: 1.3,
    reason: "Spring migration and nesting season increases bird activity"
  },
  summer: {
    multiplier: 1.1,
    reason: "High feeding activity and juvenile birds present"
  },
  fall: {
    multiplier: 1.2,
    reason: "Fall migration patterns increase bird movement"
  },
  winter: {
    multiplier: 0.7,
    reason: "Reduced bird activity in colder temperatures"
  }
};

// Weather impact on bird activity
const WEATHER_IMPACTS = {
  sunny: {
    multiplier: 1.2,
    reason: "Increased bird activity in clear weather"
  },
  cloudy: {
    multiplier: 1.0,
    reason: "Normal bird activity levels"
  },
  rainy: {
    multiplier: 0.6,
    reason: "Reduced flight activity during precipitation"
  },
  windy: {
    multiplier: 0.8,
    reason: "Wind makes precise targeting more difficult for birds"
  }
};

// Base risk by latitude (simplified model - in a real app, this would be more sophisticated)
const calculateBaseRiskByLocation = (latitude: number, longitude: number): number => {
  // Coastal areas (simplified check)
  const isCoastalLongitude = (longitude > -10 && longitude < 10) || 
                             (longitude > 170 || longitude < -170) ||
                             (longitude > 80 && longitude < 100) ||
                             (longitude > -120 && longitude < -70);
  
  // Urban vs rural (simplified heuristic - in reality would use map data)
  const isLikelyUrban = Math.abs(latitude) % 5 < 2.5; // Just a dummy pattern
  
  // Northern vs southern hemisphere
  const isNorthernHemisphere = latitude > 0;
  
  // Approximate bird density factor
  let baseRisk = 5.0; // Start with medium risk
  
  // Coastal areas typically have more birds
  if (isCoastalLongitude) {
    baseRisk += 1.5;
  }
  
  // Urban areas have different bird species (pigeons etc.)
  if (isLikelyUrban) {
    baseRisk += 1.0;
  }
  
  // Different risks based on hemisphere and general latitude
  if (isNorthernHemisphere) {
    // Higher risk in temperate zones
    if (latitude > 30 && latitude < 60) {
      baseRisk += 0.5;
    }
  } else {
    // Southern hemisphere analogous zones
    if (latitude < -30 && latitude > -60) {
      baseRisk += 0.5;
    }
  }
  
  // Add some semi-random variation based on coordinates
  const locationVariation = (Math.sin(latitude * 3) + Math.cos(longitude * 2)) * 0.5;
  baseRisk += locationVariation;
  
  // Ensure within bounds
  return Math.max(1, Math.min(9, baseRisk));
};

// Temperature impact on bird activity
const getTemperatureImpact = (temperature: number): { multiplier: number; reason: string } => {
  if (temperature < 32) {
    return { multiplier: 0.6, reason: "Very cold temperatures reduce bird activity" };
  } else if (temperature < 45) {
    return { multiplier: 0.8, reason: "Cold temperatures somewhat reduce bird activity" };
  } else if (temperature > 90) {
    return { multiplier: 0.9, reason: "Very hot temperatures slightly reduce bird activity" };
  } else if (temperature > 65 && temperature <= 85) {
    return { multiplier: 1.2, reason: "Ideal temperatures increase bird activity" };
  } else {
    return { multiplier: 1.0, reason: "Moderate temperatures have normal bird activity" };
  }
};

// Wind speed impact
const getWindImpact = (windSpeed: number): { multiplier: number; reason: string } => {
  if (windSpeed > 20) {
    return { multiplier: 0.5, reason: "Strong winds significantly reduce precision of bird droppings" };
  } else if (windSpeed > 10) {
    return { multiplier: 0.8, reason: "Moderate winds reduce precision of bird droppings" };
  } else {
    return { multiplier: 1.0, reason: "Light winds have minimal impact on bird droppings" };
  }
};

// Precipitation impact
const getPrecipitationImpact = (precipitation: number): { multiplier: number; reason: string } => {
  if (precipitation > 0.5) {
    return { multiplier: 0.4, reason: "Heavy precipitation keeps most birds sheltered" };
  } else if (precipitation > 0) {
    return { multiplier: 0.7, reason: "Light precipitation reduces bird activity" };
  } else {
    return { multiplier: 1.0, reason: "No precipitation impact on bird activity" };
  }
};

// Main risk assessment function
export const calculateRisk = (
  latitude: number,
  longitude: number,
  weather: Weather,
  season: Season
): RiskAssessment => {
  // Start with base risk by location
  let baseRisk = calculateBaseRiskByLocation(latitude, longitude);
  
  // Initialize factors array for explanation
  const factors: string[] = [];
  
  // Add location-based reason
  if (baseRisk > 6) {
    factors.push("Your location has above-average bird activity");
  } else if (baseRisk < 4) {
    factors.push("Your location has below-average bird activity");
  } else {
    factors.push("Your location has average bird activity");
  }
  
  // Apply season multiplier
  const seasonFactor = SEASON_FACTORS[season];
  baseRisk *= seasonFactor.multiplier;
  factors.push(seasonFactor.reason);
  
  // Apply weather condition multiplier
  const weatherFactor = WEATHER_IMPACTS[weather.conditions as keyof typeof WEATHER_IMPACTS];
  baseRisk *= weatherFactor.multiplier;
  factors.push(weatherFactor.reason);
  
  // Apply temperature impact
  const tempImpact = getTemperatureImpact(weather.temperature);
  baseRisk *= tempImpact.multiplier;
  factors.push(tempImpact.reason);
  
  // Apply wind impact
  const windImpact = getWindImpact(weather.windSpeed);
  baseRisk *= windImpact.multiplier;
  factors.push(windImpact.reason);
  
  // Apply precipitation impact
  const precipImpact = getPrecipitationImpact(weather.precipitation);
  baseRisk *= precipImpact.multiplier;
  factors.push(precipImpact.reason);
  
  // Normalize score to 1-10 scale
  let finalScore = Math.max(1, Math.min(10, baseRisk));
  
  // Determine risk level based on score
  let riskLevel: "very low" | "low" | "moderate" | "high" | "very high";
  if (finalScore < 3) riskLevel = "very low";
  else if (finalScore < 4.5) riskLevel = "low";
  else if (finalScore < 6.5) riskLevel = "moderate";
  else if (finalScore < 8) riskLevel = "high";
  else riskLevel = "very high";
  
  return {
    score: finalScore,
    level: riskLevel,
    factors: factors
  };
};
