import React from "react";
import { Text, View } from "react-native";

// import the driver store and the location store from the store folder
import { useDriverStore, useLocationStore } from "@/store";

// import the map view from react native maps
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

// import the MarkerData & MapProps type from the types/type.ts file
import { MapProps, MarkerData } from "@/types/types";
import { User } from "@/types/user";

// import the calculateRegion and generateMarkersFromData functions from the map.ts file
import { calculateRegion } from "@/lib/map";

/**
 * Define and export the Map component
 * @returns MapView component with various properties and customizations
 */
export default function Map({ drivers }: MapProps) {
  // Access Google API key from environment variables
  const googleApiUrl = process.env.EXPO_PUBLIC_GOOGLE_KEY;

  // Get the user's current location from the zustand store
  const { userLatitude, userLongitude } = useLocationStore();

  // Calculate the region based on the user's current location and the destination
  const region = calculateRegion({ userLongitude, userLatitude });

  return (
    <MapView
      provider={PROVIDER_DEFAULT} // Use the default map provider (e.g., Google Maps if set up properly)
      showsCompass={true} // Display a compass on the map
      className="w-full h-full"
      tintColor="black" // Customize the tint color of map elements
      mapType="mutedStandard" // Set the map type to "mutedStandard", which is a standard view with muted colors
      showsPointsOfInterest={false} // Disable points of interest (like restaurants, landmarks)
      // initialRegion={region} // this is the initial region of the map
      showsUserLocation={true} // Enable the display of the user's current location on the map
      showsMyLocationButton={true} // Show a button to recenter the map to the user's location
      userInterfaceStyle="light" // Set the UI style of the map to a light theme
    />
  );
}
