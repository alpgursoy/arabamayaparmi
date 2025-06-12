export type Weather = {
  temperature: number; // in Fahrenheit
  conditions: string; // sunny, cloudy, rainy, windy
  windSpeed: number; // in mph
  precipitation: number; // in inches
};

export type Season = "spring" | "summer" | "fall" | "winter";

export type RiskAssessment = {
  score: number; // 1-10 risk score
  level: "very low" | "low" | "moderate" | "high" | "very high";
  factors: string[]; // explanation of factors affecting risk
};

export type Location = {
  latitude: number;
  longitude: number;
  name: string;
};

export type RiskResult = {
  id: number;
  location: Location;
  date: string;
  weather: Weather;
  season: Season;
  riskScore: number;
  riskLevel: "very low" | "low" | "moderate" | "high" | "very high";
  factors: string[];
};
