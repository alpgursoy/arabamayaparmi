import React from "react";
import { Input, Button, Card, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface LocationFormProps {
  onSubmit: (latitude: number, longitude: number, locationName: string) => void;
  isLoading: boolean;
}

export const LocationForm: React.FC<LocationFormProps> = ({ onSubmit, isLoading }) => {
  const [manualInput, setManualInput] = React.useState(false);
  const [latitude, setLatitude] = React.useState("");
  const [longitude, setLongitude] = React.useState("");
  const [locationName, setLocationName] = React.useState("");
  const [geoError, setGeoError] = React.useState<string | null>(null);
  const [gettingLocation, setGettingLocation] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      setManualInput(true);
      return;
    }

    setGettingLocation(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setGettingLocation(false);
        
        // Attempt to get location name using reverse geocoding
        // In a real app, you'd use a geocoding service
        // Here we'll set a placeholder
        setLocationName("Current Location");
      },
      (error) => {
        setGettingLocation(false);
        setGeoError("Failed to get your location. Please enter it manually.");
        setManualInput(true);
        console.error("Geolocation error:", error);
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0 
      }
    );
  };

  const validateForm = (): boolean => {
    setFormError(null);

    if (!latitude || !longitude) {
      setFormError("Please provide both latitude and longitude.");
      return false;
    }
    
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lon)) {
      setFormError("Latitude and longitude must be valid numbers.");
      return false;
    }
    
    if (lat < -90 || lat > 90) {
      setFormError("Latitude must be between -90 and 90 degrees.");
      return false;
    }
    
    if (lon < -180 || lon > 180) {
      setFormError("Longitude must be between -180 and 180 degrees.");
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const name = locationName.trim() || "Unknown Location";
    onSubmit(parseFloat(latitude), parseFloat(longitude), name);
  };

  React.useEffect(() => {
    // Try to get location on initial load
    handleUseCurrentLocation();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Your Location</h2>
      
      <div className="space-y-4">
        {!manualInput ? (
          <div className="flex flex-col items-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <Card 
                className="p-4 w-full flex flex-col items-center gap-2 bg-content2 border border-content3"
                isHoverable
                radius="md"
              >
                {gettingLocation ? (
                  <div className="p-6 flex flex-col items-center gap-2">
                    <Spinner color="primary" size="lg" />
                    <p>Getting your location...</p>
                  </div>
                ) : (
                  <>
                    <Icon icon="lucide:map-pin" className="text-3xl text-primary mb-2" />
                    <h3 className="font-medium">Using Your Current Location</h3>
                    {latitude && longitude ? (
                      <p className="text-sm text-foreground-500">
                        {latitude}, {longitude}
                      </p>
                    ) : (
                      <p className="text-sm text-foreground-500 italic">
                        Waiting for coordinates...
                      </p>
                    )}
                  </>
                )}
              </Card>
            </motion.div>
            
            <div className="flex gap-2">
              {geoError && (
                <p className="text-danger text-sm mb-2">{geoError}</p>
              )}
              <Button 
                variant="light" 
                color="primary"
                onPress={() => setManualInput(true)}
                startContent={<Icon icon="lucide:edit" />}
              >
                Enter Manually
              </Button>
              {!gettingLocation && (
                <Button
                  variant="light"
                  onPress={handleUseCurrentLocation}
                  startContent={<Icon icon="lucide:refresh-cw" />}
                >
                  Refresh Location
                </Button>
              )}
            </div>
          </div>
        ) : (
          <motion.form 
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-4 md:flex-row">
              <Input
                label="Latitude"
                placeholder="-90 to 90"
                value={latitude}
                onValueChange={setLatitude}
                startContent={<Icon icon="lucide:north-star" className="text-default-400" />}
                type="text"
                className="w-full"
              />
              <Input
                label="Longitude"
                placeholder="-180 to 180"
                value={longitude}
                onValueChange={setLongitude}
                startContent={<Icon icon="lucide:east-star" className="text-default-400" />}
                type="text"
                className="w-full"
              />
            </div>
            <Input
              label="Location Name (Optional)"
              placeholder="E.g., Downtown Chicago"
              value={locationName}
              onValueChange={setLocationName}
              startContent={<Icon icon="lucide:map" className="text-default-400" />}
            />
            
            {formError && (
              <p className="text-danger text-sm">{formError}</p>
            )}
            
            <div className="flex gap-2 pt-2">
              <Button 
                variant="light" 
                onPress={() => {
                  setManualInput(false);
                  handleUseCurrentLocation();
                }}
                startContent={<Icon icon="lucide:locate" />}
              >
                Use Current Location
              </Button>
              <Button 
                color="primary" 
                type="submit"
                isLoading={isLoading}
                startContent={!isLoading && <Icon icon="lucide:search" />}
              >
                {isLoading ? "Calculating Risk" : "Check Risk"}
              </Button>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  );
};