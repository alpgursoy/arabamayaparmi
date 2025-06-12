import React from "react";
import { Accordion, AccordionItem, Link } from "@heroui/react";
import { Icon } from "@iconify/react";

export const InfoSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium flex items-center gap-2">
        <Icon icon="lucide:info" className="text-primary" />
        How It Works
      </h2>
      
      <Accordion variant="splitted">
        <AccordionItem
          key="1"
          aria-label="About the assessment"
          title="About the Bird Droppings Risk Assessment"
          startContent={<Icon icon="lucide:activity" className="text-primary" />}
        >
          <div className="space-y-2 px-1 pb-2 text-foreground-600">
            <p>
              The Bird Droppings Risk Assessment tool uses multiple factors to estimate the likelihood 
              of bird droppings landing on your vehicle in a specific location. Our proprietary algorithm
              considers bird migration patterns, local species population data, seasonal variations,
              and current weather conditions.
            </p>
            <p>
              While no prediction can be 100% accurate, our assessment provides a useful estimate 
              based on the best available data.
            </p>
          </div>
        </AccordionItem>
        
        <AccordionItem
          key="2"
          aria-label="Factors considered"
          title="Factors That Affect Risk"
          startContent={<Icon icon="lucide:list-checks" className="text-primary" />}
        >
          <div className="space-y-3 px-1 pb-2 text-foreground-600">
            <h3 className="font-medium">Location</h3>
            <p className="mb-2">
              Some areas have naturally higher bird populations due to:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Proximity to water bodies (lakes, rivers, oceans)</li>
              <li>Urban density and building types</li>
              <li>Availability of food sources</li>
              <li>Presence of trees and roosting spots</li>
            </ul>
            
            <h3 className="font-medium">Season</h3>
            <p className="mb-2">
              Bird activity varies significantly by season due to:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Migration patterns</li>
              <li>Breeding seasons</li>
              <li>Temperature effects on behavior</li>
              <li>Food availability</li>
            </ul>
            
            <h3 className="font-medium">Weather</h3>
            <p className="mb-2">
              Current weather conditions affect bird behavior:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Rain reduces flight and activity</li>
              <li>Wind affects flight patterns</li>
              <li>Temperature influences feeding behavior</li>
              <li>Barometric pressure changes can trigger migration</li>
            </ul>
          </div>
        </AccordionItem>
        
        <AccordionItem
          key="3"
          aria-label="Protection tips"
          title="How to Protect Your Vehicle"
          startContent={<Icon icon="lucide:shield" className="text-primary" />}
        >
          <div className="space-y-2 px-1 pb-2 text-foreground-600">
            <p>
              If you're in a high-risk area, consider these protective measures:
            </p>
            
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Car Covers:</strong> A quality car cover provides excellent protection when parked.
              </li>
              <li>
                <strong>Parking Location:</strong> Avoid parking under trees, power lines, or building ledges where birds perch.
              </li>
              <li>
                <strong>Wax Protection:</strong> Regular waxing creates a protective barrier that makes droppings easier to remove.
              </li>
              <li>
                <strong>Quick Cleaning:</strong> If your vehicle is hit, clean droppings promptly as they can damage paint when dried.
              </li>
              <li>
                <strong>Bird Deterrents:</strong> Consider visual deterrents like reflective objects for areas where you regularly park.
              </li>
            </ul>
          </div>
        </AccordionItem>
        
        <AccordionItem
          key="4"
          aria-label="Data sources"
          title="Our Data Sources"
          startContent={<Icon icon="lucide:database" className="text-primary" />}
        >
          <div className="space-y-2 px-1 pb-2 text-foreground-600">
            <p>
              Our risk assessment algorithm integrates data from multiple sources:
            </p>
            
            <ul className="list-disc pl-5 space-y-2">
              <li>Regional bird population surveys from ornithological organizations</li>
              <li>Historical weather pattern analysis</li>
              <li>Urban wildlife management reports</li>
              <li>Seasonal migration tracking systems</li>
              <li>User-reported incident data</li>
            </ul>
            
            <p className="mt-2">
              Our platform continuously improves as we gather more data and refine our prediction model.
            </p>
          </div>
        </AccordionItem>
      </Accordion>
      
      <div className="mt-6 pt-4 border-t border-default-200 text-center text-sm text-foreground-500">
        <p>
          This tool is for informational purposes only. Results are based on historical data and predictive modeling.
        </p>
        <p className="mt-2">
          Have questions or suggestions? <Link href="#" color="primary">Contact us</Link>
        </p>
      </div>
    </div>
  );
};