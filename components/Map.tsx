import React from "react";
import { Text, View } from "react-native";

// import the map staff
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";

/**
 * Define and export the Map component
 * @returns MapView component with various properties and customizations
 */
export default function Map() {
  // Access Google API key from environment variables
  const googleApiUrl = process.env.EXPO_PUBLIC_GOOGLE_KEY;

  // Placeholder for user location
  const region = {};

  return (
    <MapView
      provider={PROVIDER_DEFAULT} // Use the default map provider (e.g., Google Maps if set up properly)
      showsCompass={true} // Display a compass on the map
      className="w-full h-full"
      tintColor="black" // Customize the tint color of map elements
      mapType="mutedStandard" // Set the map type to "mutedStandard", which is a standard view with muted colors
      showsPointsOfInterest={false} // Disable points of interest (like restaurants, landmarks)
      // initialRegion={region} // Uncomment and set this when you have the initial location region object
      showsUserLocation={true} // Enable the display of the user's current location on the map
      showsMyLocationButton={true} // Show a button to recenter the map to the user's location
      userInterfaceStyle="light" // Set the UI style of the map to a light theme
    />
  );
}
