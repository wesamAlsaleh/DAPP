import React, { useEffect, useState } from "react";
import { View } from "react-native";

// import map stuff
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

// import the constants
import { icons } from "@/constants";
import { User } from "@/types/user";

interface MapProps {
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
  drivers: User[]; // Accept drivers as a prop
}

export default function UserMap({ userLocation, drivers }: MapProps) {
  // initial region on Bahrain
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

  // console.log(drivers);

  return (
    <View className="mt-4 rounded-xl overflow-hidden shadow-lg">
      <MapView
        provider={PROVIDER_DEFAULT} // Use the default map provider (e.g., Google Maps if set up properly)
        showsCompass={true} // Display a compass on the map
        className="w-full h-[300px]" // map style
        showsPointsOfInterest={false} // Disable points of interest (like restaurants, landmarks)
        initialRegion={initialRegion}
        showsUserLocation={true} // Enable the display of the user's current location on the map
        showsMyLocationButton={true} // Show a button to recenter the map to the user's location
      >
        {drivers.map((driver) => {
          // Convert latitude and longitude to numbers
          const latitude = Number(driver.latitude);
          const longitude = Number(driver.longitude);

          // Validate that they are numbers
          const isValidCoordinates = !isNaN(latitude) && !isNaN(longitude);

          // Only render the marker if the coordinates are valid
          if (!isValidCoordinates) {
            console.warn(`Invalid coordinates for driver ${driver.id}`);
            return null;
          }
        })}
      </MapView>
    </View>
  );
}
