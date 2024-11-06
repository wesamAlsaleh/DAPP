import React, { useEffect, useState } from "react";
import { View } from "react-native";

// import map stuff
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";

// import the constants
import { User } from "@/types/user";

interface MapProps {
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
}

export default function UserMap({ userLocation }: MapProps) {
  // Set the initial region of the map to the user's location if available or to Bahrain
  const initialRegion = userLocation
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
      };

  return (
    <View className="mt-4 rounded-xl overflow-hidden shadow-lg">
      <MapView
        provider={PROVIDER_DEFAULT} // Use the default map provider (e.g., Google Maps if set up properly)
        showsCompass={true} // Display a compass on the map
        className="w-full h-[300px]" // map style
        showsPointsOfInterest={false} // Disable points of interest (like restaurants, landmarks)
        initialRegion={initialRegion} // Set the initial region of the map
        showsUserLocation={true} // Enable the display of the user's current location on the map
        showsMyLocationButton={true} // Show a button to recenter the map to the user's location
      />
    </View>
  );
}
