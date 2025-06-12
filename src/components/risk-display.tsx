import React from "react";
import { Progress, Chip, Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { RiskResult } from "../types/types";
import { formatDate } from "../utils/format-utils";

interface RiskDisplayProps {
  risk: RiskResult;
}

export const RiskDisplay: React.FC<RiskDisplayProps> = ({ risk }) => {
  // Determine color based on risk level
  const getRiskColor = () => {
    switch (risk.riskLevel) {
      case "very low": return "success";
      case "low": return "success";
      case "moderate": return "warning";
      case "high": return "danger";
      case "very high": return "danger";
      default: return "primary";
    }
  };
  
  const getRiskIcon = () => {
    switch (risk.riskLevel) {
      case "very low": return "lucide:shield-check";
      case "low": return "lucide:shield";
      case "moderate": return "lucide:alert-circle";
      case "high": return "lucide:alert-triangle";
      case "very high": return "lucide:alert-octagon";
      default: return "lucide:help-circle";
    }
  };

  const weatherIcons = {
    sunny: "lucide:sun",
    cloudy: "lucide:cloud",
    rainy: "lucide:cloud-rain",
    windy: "lucide:wind"
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Risk Assessment Results</h2>
      
      <div className="p-4 rounded-lg bg-content2 border border-content3">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-medium">{risk.location.name}</h3>
            <p className="text-sm text-foreground-500">
              {risk.location.latitude.toFixed(4)}, {risk.location.longitude.toFixed(4)}
            </p>
            <p className="text-sm text-foreground-500">
              {formatDate(risk.date)}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Chip 
              startContent={<Icon icon={weatherIcons[risk.weather.conditions as keyof typeof weatherIcons]} />}
              variant="flat"
              radius="sm"
            >
              {risk.weather.conditions.charAt(0).toUpperCase() + risk.weather.conditions.slice(1)}
            </Chip>
            <Chip 
              startContent={<Icon icon="lucide:thermometer" />}
              variant="flat"
              radius="sm"
            >
              {risk.weather.temperature}°F
            </Chip>
            <Chip 
              startContent={<Icon icon="lucide:wind" />}
              variant="flat"
              radius="sm"
            >
              {risk.weather.windSpeed} mph
            </Chip>
            {risk.weather.precipitation > 0 && (
              <Chip 
                startContent={<Icon icon="lucide:cloud-drizzle" />}
                variant="flat"
                radius="sm"
              >
                {risk.weather.precipitation}" precip
              </Chip>
            )}
            <Chip 
              startContent={
                risk.season === "spring" ? <Icon icon="lucide:flower" /> :
                risk.season === "summer" ? <Icon icon="lucide:sun" /> :
                risk.season === "fall" ? <Icon icon="lucide:leaf" /> :
                <Icon icon="lucide:snowflake" />
              }
              variant="flat"
              radius="sm"
            >
              {risk.season.charAt(0).toUpperCase() + risk.season.slice(1)}
            </Chip>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Icon icon={getRiskIcon()} className={`text-${getRiskColor()}`} />
              <h3 className="font-medium">Risk Level: <span className="capitalize">{risk.riskLevel}</span></h3>
            </div>
            <span className="text-lg font-semibold">{risk.riskScore.toFixed(1)}/10</span>
          </div>
          
          <Progress 
            aria-label="Risk level" 
            size="lg"
            value={risk.riskScore * 10} 
            color={getRiskColor()}
            className="h-3"
            showValueLabel={false}
          />
        </motion.div>
        
        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Icon icon="lucide:list" />
            Risk Factors:
          </h3>
          <ul className="space-y-2 pl-2">
            {risk.factors.map((factor, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="flex items-start gap-2"
              >
                <Icon icon="lucide:chevron-right" className="mt-1 text-foreground-400 shrink-0" />
                <span>{factor}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-end">
        <Tooltip content="Tips to minimize risk">
          <Button 
            variant="flat"
            startContent={<Icon icon="lucide:lightbulb" />}
          >
            Get Protection Tips
          </Button>
        </Tooltip>
        
        <Tooltip content="Save this assessment">
          <Button
            variant="flat"
            color="primary"
            startContent={<Icon icon="lucide:bookmark" />}
          >
            Save Assessment
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};