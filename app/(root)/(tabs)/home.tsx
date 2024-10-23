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
import Map from "@/components/Map";

// import location store
import { useLocationStore } from "@/store";

// import location stuff
import * as Location from "expo-location";

// import the Dimensions API to get the window dimensions
const { width, height } = Dimensions.get("window");

// import get drivers function
import { getDrivers } from "@/services/driver-services";
import { User } from "@/types/user";

export default function home() {
  // get the user data from the AuthContext
  const { user } = useAuth();

  // get the location store setter functions
  const { setUserLocation } = useLocationStore();

  // state to check if the user has granted permission to access their location
  const [hasPermission, setHasPermission] = useState(false);

  // Drivers state
  const [drivers, setDrivers] = useState<User[]>([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // useEffect to grant the user permission to access their location
  useEffect(() => {
    // function to request location permission and get the user's current location
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      // if the user has not granted permission, set the hasPermission state to false
      if (status !== "granted") {
        setHasPermission(false);
        return;
      }

      // if the user has granted permission, set the hasPermission state to true
      setHasPermission(true);

      // get the user's current location
      let location = await Location.getCurrentPositionAsync();

      // Extract the latitude and longitude from the location object
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });

      // set the user's current location in the zustand store
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: `${address[0].name}, ${address[0].region}, ${address[0].country}`,
      });
    };

    // call the function to request location permission and get the user's current location
    requestLocationPermission();
  }, []);

  //  Fetch the drivers data from the backend
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
    // <ProtectedRoute>
    <SafeAreaView style={GlobalStyles.droidSafeArea} className="bg-general-500">
      {/* page container */}
      <View className="px-4 py-6">
        {/* -------------------- header section -------------------- */}
        <View className=" items-start justify-center">
          <Text className="text-black font-bold text-2xl">
            Welcome back, <Text className="text-primary-500">{user?.name}</Text>
          </Text>
        </View>

        {/* -------------------- main section -------------------- */}
        {/* Admin feature container */}
        <View>
          {user?.role === "admin" ? (
            <View className="bg-green-200 rounded-lg shadow-md mt-4">
              <Text className="text-xl text-center">This is Admin user</Text>
            </View>
          ) : null}
        </View>

        {/* map + text container */}
        <View>
          <Text className="mb-3 mt-5 text-xl font-semibold">
            Your Current Location
          </Text>

          {/* map alone container */}
          <View className="flex flex-row items-center bg-transparent h-[300]">
            <Map drivers={drivers} />
          </View>
        </View>

        {/* end of page container  */}
      </View>
    </SafeAreaView>
    // </ProtectedRoute>
  );
}
