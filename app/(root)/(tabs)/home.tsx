import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
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
import StatusWidget from "@/components/widgets/status-widget";
import DriversCountWidget from "@/components/widgets/drivers-count-widget";
import LoadingSpinner from "@/components/LoadingSpinner";

// import location stuff
import * as Location from "expo-location";

// import driver functions
import { getDrivers, updateDriverLocation } from "@/services/driver-services";

// import User interface
import { User } from "@/types/user";
import UserMap from "@/components/UserMap";

export default function home() {
  // get the user data from the AuthContext
  const { user } = useAuth();

  // Drivers state
  const [drivers, setDrivers] = useState<User[]>([]);

  // Error state
  const [errorMsg, setErrorMsg] = useState("");

  // Loading state
  const [loading, setLoading] = useState(true);

  // User location state
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Log the user location
  // console.log(userLocation);

  // Request permission to access location
  const requestLocationPermission = async () => {
    try {
      // request the location
      let { status } = await Location.requestForegroundPermissionsAsync();

      // if the location is not granted set a message
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      return true;
    } catch (error) {
      console.error("Error requesting location permission", error);
      return false;
    }
  };

  // Fetch the driver's current location and send to backend
  const fetchAndSendDriverLocation = async () => {
    try {
      // get the granter location
      const location = await Location.getCurrentPositionAsync({});

      // Get the longitude & latitude from the granted location
      const { latitude, longitude } = location.coords;

      // Set the user location
      setUserLocation({ latitude, longitude });

      // Send the location to the database
      await updateDriverLocation({ latitude, longitude });
    } catch (error) {
      console.error(
        "* Out of service, cant fetch and send driver location!",
        error
      );
    }
  };

  useEffect(() => {
    // Fetch Drivers Function
    const fetchDrivers = async () => {
      try {
        const driversFromDB = await getDrivers();
        setDrivers(driversFromDB);
      } catch (error) {
        console.error("Error fetching drivers", error);
      } finally {
        setLoading(false);
      }
    };

    // Tracking functions
    const startTracking = async () => {
      // checks for location permissions
      const hasPermission = await requestLocationPermission();

      // if he have the permission get the driver location
      if (hasPermission) {
        fetchAndSendDriverLocation();

        // Sends the driver’s location to the server immediately after permission is granted
        const locationInterval = setInterval(() => {
          fetchAndSendDriverLocation();
        }, 60000); // 1 minute interval

        return () => clearInterval(locationInterval); // Cleanup interval on component unmount
      }
    };

    // if there is user
    if (user) {
      fetchDrivers(); // Fetch Drivers
      startTracking(); // Start tracking
    }
  }, []);

  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea} className="bg-general-500">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* header section */}
        <View className=" items-start justify-center">
          <Text className="text-black font-bold text-2xl">
            Welcome back, <Text className="text-primary-600">{user?.name}</Text>
          </Text>
        </View>

        {/* Admin Dashboard */}
        {user?.role === "admin" ? (
          <>
            {/* Admin widget */}
            <DriversCountWidget driversCount={drivers.length} />

            {/* Map Section */}
            <View>
              {loading ? (
                // Display loading spinner if still loading
                <LoadingSpinner indicatorMessage="Loading drivers..." />
              ) : (
                // Display the Map when loading is complete
                <Map userLocation={userLocation} drivers={drivers} />
              )}
            </View>
          </>
        ) : null}

        {/* Driver Dashboard */}
        {user?.role === "driver" ? (
          <View>
            {/* Status Bar widget */}
            <StatusWidget />

            <Text className="mt-4 font-bold text-2xl">
              You're on the move! 🚗
            </Text>
            <Text className="text-lg text-gray-600 mt-2">
              Here's where you are right now:
            </Text>

            <UserMap drivers={drivers} userLocation={userLocation} />
          </View>
        ) : null}

        {/* footer section */}
        <View></View>
      </ScrollView>
    </SafeAreaView>
  );
}
