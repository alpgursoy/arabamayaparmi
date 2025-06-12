import React from "react";
import { Tabs, Tab, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { RiskResult } from "../types/types";
import { formatDate } from "../utils/format-utils";

interface RiskHistoryProps {
  history: RiskResult[];
}

export const RiskHistory: React.FC<RiskHistoryProps> = ({ history }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-medium">Recent Assessments</h2>
        <Chip size="sm" variant="flat" color="primary">{history.length}</Chip>
      </div>
      
      <Tabs aria-label="Risk history" color="primary" variant="underlined" className="w-full">
        <Tab
          key="table"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:list" />
              <span>List View</span>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-full divide-y divide-default-200 mt-2">
              <thead>
                <tr className="text-left text-foreground-500">
                  <th className="py-2 px-3 text-sm">Date</th>
                  <th className="py-2 px-3 text-sm">Location</th>
                  <th className="py-2 px-3 text-sm">Weather</th>
                  <th className="py-2 px-3 text-sm">Risk Level</th>
                  <th className="py-2 px-3 text-sm">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-default-100">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-default-50">
                    <td className="py-2 px-3 text-sm">{formatDate(item.date)}</td>
                    <td className="py-2 px-3 text-sm">{item.location.name}</td>
                    <td className="py-2 px-3 text-sm">
                      <div className="flex items-center gap-1">
                        {item.weather.conditions === "sunny" && <Icon icon="lucide:sun" className="text-warning" />}
                        {item.weather.conditions === "cloudy" && <Icon icon="lucide:cloud" className="text-default-400" />}
                        {item.weather.conditions === "rainy" && <Icon icon="lucide:cloud-rain" className="text-primary" />}
                        {item.weather.conditions === "windy" && <Icon icon="lucide:wind" className="text-default-400" />}
                        <span className="capitalize">{item.weather.conditions}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-sm">
                      <Chip 
                        size="sm"
                        color={
                          item.riskLevel === "very low" || item.riskLevel === "low" ? "success" :
                          item.riskLevel === "moderate" ? "warning" : "danger"
                        }
                        variant="flat"
                        className="capitalize"
                      >
                        {item.riskLevel}
                      </Chip>
                    </td>
                    <td className="py-2 px-3 text-sm font-semibold">{item.riskScore.toFixed(1)}/10</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tab>
        
        <Tab
          key="cards"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:layout-grid" />
              <span>Card View</span>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {history.map((item) => (
              <div 
                key={item.id} 
                className="p-4 rounded-lg border border-default-200 bg-content1"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{item.location.name}</h3>
                  <Chip 
                    size="sm"
                    color={
                      item.riskLevel === "very low" || item.riskLevel === "low" ? "success" :
                      item.riskLevel === "moderate" ? "warning" : "danger"
                    }
                    variant="flat"
                    className="capitalize"
                  >
                    {item.riskLevel}
                  </Chip>
                </div>
                <p className="text-sm text-foreground-500">
                  {formatDate(item.date)}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <Chip 
                    size="sm" 
                    variant="flat" 
                    className="capitalize"
                    startContent={
                      item.weather.conditions === "sunny" ? <Icon icon="lucide:sun" /> :
                      item.weather.conditions === "cloudy" ? <Icon icon="lucide:cloud" /> :
                      item.weather.conditions === "rainy" ? <Icon icon="lucide:cloud-rain" /> :
                      <Icon icon="lucide:wind" />
                    }
                  >
                    {item.weather.conditions}
                  </Chip>
                  <Chip 
                    size="sm" 
                    variant="flat"
                    startContent={
                      item.season === "spring" ? <Icon icon="lucide:flower" /> :
                      item.season === "summer" ? <Icon icon="lucide:sun" /> :
                      item.season === "fall" ? <Icon icon="lucide:leaf" /> :
                      <Icon icon="lucide:snowflake" />
                    }
                  >
                    {item.season.charAt(0).toUpperCase() + item.season.slice(1)}
                  </Chip>
                </div>
                <div className="mt-3 text-right">
                  <span className="font-semibold text-lg">{item.riskScore.toFixed(1)}/10</span>
                </div>
              </div>
            ))}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};