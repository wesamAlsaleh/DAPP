import React, { useContext, useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// import the ProtectedRoute component to protect the route from unauthorized access
import ProtectedRoute from "@/components/ProtectedRoute";

// import the GlobalStyles script to use the global styles
import GlobalStyles from "@/scripts/GlobalStyles";

// import the AuthContext through useAuth hook
import { useAuth } from "@/contexts/AuthContext";

// import the Custom components
import CustomButton from "@/components/CustomButton";

// import map stuff
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { icons } from "@/constants";

// import the Dimensions API to get the window dimensions
const { width, height } = Dimensions.get("window");

// Mock driver data (replace this with actual API call in production)
const mockDrivers = [
  { id: 1, name: "Driver 1", latitude: 37.78825, longitude: -122.4324 },
  { id: 2, name: "Driver 2", latitude: 37.78925, longitude: -122.4344 },
  { id: 3, name: "Driver 3", latitude: 37.78725, longitude: -122.4304 },
];

export default function home() {
  // get the user data from the AuthContext
  const { user } = useAuth();

  const [showMap, setShowMap] = useState(false);
  const [drivers, setDrivers] = useState(mockDrivers);

  // In a real application, you would fetch drivers data here
  useEffect(() => {
    // Fetch drivers data from your API
    // setDrivers(fetchedDrivers);
  }, []);

  return (
    // <ProtectedRoute>
    <SafeAreaView style={GlobalStyles.droidSafeArea} className="bg-general-500">
      {/* page container */}
      <View className="px-4 py-6">
        {/* header section */}
        <View className=" items-start justify-center">
          <Text className="text-black font-bold text-2xl">
            Welcome back, <Text className="text-primary-500">{user?.name}</Text>
          </Text>
        </View>

        {/* main section  */}
        <View>
          {/* Admin feater */}
          {user?.role === "admin" ? (
            <>
              <View className="bg-green-200 rounded-lg shadow-md mt-4">
                <Text className="text-xl text-center">This is Admin user</Text>
              </View>
            </>
          ) : null}

          {/* route to map page */}
          <CustomButton
            onPress={() => setShowMap(!showMap)}
            title={showMap ? "Hide Map" : "Show drivers on map"}
            bgVariant="secondary"
            className="mt-2"
          />
          {showMap && (
            // Map container
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
          )}
        </View>
      </View>
    </SafeAreaView>
    // </ProtectedRoute>
  );
}
