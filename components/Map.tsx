import React from "react";
import { Text, View } from "react-native";

// import the map staff
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";

export default function Map() {
  const googleApiUrl = process.env.EXPO_PUBLIC_GOOGLE_KEY;

  return (
    <MapView
      provider={PROVIDER_DEFAULT} // Use Google Maps "default"
      showsCompass={true} // Show the compass
      className="w-full h-full"
    />
  );
}
