import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

// import the driver store and the location store from the store folder
import { useDriverStore, useLocationStore } from "@/store";

// import the map view from react native maps
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

// import the MarkerData & MapProps type from the types/type.ts file
import { MapProps, MarkerData } from "@/types/types";

// import the calculateRegion and generateMarkersFromData functions from the map.ts file
import { calculateRegion, generateMarkersFromData } from "@/lib/map";
import { icons } from "@/constants";

export default function Map({ drivers }: MapProps) {
  // Access Google API key from environment variables
  const googleApiUrl = process.env.EXPO_PUBLIC_GOOGLE_KEY;

  // Get the user's current location from the zustand store
  const { userLatitude, userLongitude } = useLocationStore();

  // Get the drivers functions from the store
  const { setDrivers, selectedDriver, setSelectedDriver } = useDriverStore();

  // Calculate the region based on the user's current location and the destination
  const region = calculateRegion({ userLongitude, userLatitude });

  // Markers state "array of marker data type"
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  // Set the Available driver in the store "from the home page"
  useEffect(() => {
    // if we have the drivers
    if (Array.isArray(drivers)) {
      // check the user location
      if (!userLatitude || !userLongitude) return;

      // Create the markers on the map (which is in our case the drivers as markers)
      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });

      // Set the new markers
      setMarkers(newMarkers);
    }
  }, [drivers]);

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
    >
      {markers.map((marker) => {
        return (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.name}
            image={
              selectedDriver === marker.id ? icons.selectedMarker : icons.marker
            }
          />
        );
      })}
    </MapView>
  );
}
