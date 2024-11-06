import React, { useEffect, useState } from "react";
import { View } from "react-native";

// import map stuff
import MapView, { PROVIDER_DEFAULT, Region } from "react-native-maps";

interface MapProps {
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
}

export default function UserMap({ userLocation }: MapProps) {
  // Initial region for the map
  const [region, setRegion] = useState<Region | null>(
    userLocation
      ? {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }
      : {
          latitude: 26.0667, // Default latitude for Bahrain
          longitude: 50.5577, // Default longitude for Bahrain
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }
  );

  // Update the region when the user location changes
  useEffect(() => {
    if (userLocation) {
      setRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [userLocation]);

  return (
    <View className="mt-4 rounded-xl overflow-hidden shadow-lg">
      <MapView
        provider={PROVIDER_DEFAULT} // Use the default map provider (e.g., Google Maps if set up properly)
        region={region!} // Set the region of the map
        showsCompass={true} // Display a compass on the map
        className="w-full h-[300px]" // map style
        showsPointsOfInterest={false} // Disable points of interest (like restaurants, landmarks)
        showsUserLocation={true} // Enable the display of the user's current location on the map
        showsMyLocationButton={true} // Show a button to recenter the map to the user's location
      />
    </View>
  );
}
