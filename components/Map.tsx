import React, { useEffect, useState } from "react";
import { View } from "react-native";

// import map stuff
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

// import the constants
import { icons } from "@/constants";
import { User } from "@/types/user";
import { getDrivers } from "@/services/driver-services";

interface MapProps {
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
  drivers: User[]; // Accept drivers as a prop
}

export default function Map({ userLocation, drivers }: MapProps) {
  // initial region
  const initialRegion = userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    : {
        latitude: 37.78825, // Default latitude
        longitude: -122.4324, // Default longitude
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

  return (
    <View className="my-4 ">
      <MapView
        provider={PROVIDER_DEFAULT} // Use the default map provider (e.g., Google Maps if set up properly)
        showsCompass={true} // Display a compass on the map
        className="w-full h-full rounded-2xl"
        // showsPointsOfInterest={false} // Disable points of interest (like restaurants, landmarks)
        initialRegion={initialRegion}
        showsUserLocation={true} // Enable the display of the user's current location on the map
        showsMyLocationButton={true} // Show a button to recenter the map to the user's location
      >
        {/* {drivers.map((driver) => (
          <Marker
            key={driver.id}
            coordinate={{
              latitude: driver.latitude!,
              longitude: driver.longitude!,
            }}
            image={icons.marker}
            title={driver.name}
          />
        ))} */}
      </MapView>
    </View>
  );
}
