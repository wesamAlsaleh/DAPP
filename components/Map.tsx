import React, { useEffect, useState } from "react";
import { View } from "react-native";

// import map stuff
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

// import the constants
import { icons } from "@/constants";
import { User } from "@/types/user";
import { getDrivers } from "@/services/driver-services";

export default function Map() {
  // Drivers state
  const [drivers, setDrivers] = useState<User[]>([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // fetch drivers from the API
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const driversFromDB = await getDrivers();

        setDrivers(await driversFromDB);
      } catch (error) {
        console.error("Error fetching drivers", error);
      } finally {
        setLoading(false); // This runs regardless of success or error
      }
    };

    fetchDrivers();
  }, []);

  return (
    <View className="my-4 ">
      <MapView
        provider={PROVIDER_DEFAULT} // Use the default map provider (e.g., Google Maps if set up properly)
        showsCompass={true} // Display a compass on the map
        className="w-full h-full rounded-2xl"
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
