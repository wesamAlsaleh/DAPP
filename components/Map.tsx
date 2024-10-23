import React, { useEffect, useState } from "react";
import { View } from "react-native";

// import map stuff
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

// import the constants
import { icons } from "@/constants";
import { User } from "@/types/user";

export default function Map() {
  const [drivers, setDrivers] = useState<User[]>([]);

  // In a real application, you would fetch drivers data here
  useEffect(() => {
    // Fetch drivers data from your API
    // setDrivers(fetchedDrivers);
  }, []);

  return (
    <View>
      <MapView
        provider={PROVIDER_DEFAULT} // Use the default map provider (e.g., Google Maps if set up properly)
        showsCompass={true} // Display a compass on the map
        className="w-full h-full"
        showsPointsOfInterest={false} // Disable points of interest (like restaurants, landmarks)
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true} // Enable the display of the user's current location on the map
        showsMyLocationButton={true} // Show a button to recenter the map to the user's location
      >
        {drivers.map((driver) => (
          <Marker
            key={driver.id}
            coordinate={{
              latitude: driver.latitude,
              longitude: driver.longitude,
            }}
            image={icons.marker}
            title={driver.name}
          />
        ))}
      </MapView>
    </View>
  );
}
