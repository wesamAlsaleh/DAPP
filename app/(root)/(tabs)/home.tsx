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

  //TODO: Error state
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

  /**
   * Requests permission to access the device's location.
   *
   * @returns {Promise<boolean>} A promise that resolves to `true` if the permission was granted,
   *                             or `false` if there was an error or the permission was denied.
   *
   * @throws {Error} If there is an error requesting location permission.
   */
  const requestLocationPermission = async () => {
    try {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();

      // Check if permission was granted or not
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      return true;
    } catch (error) {
      console.error("* Error requesting location permission", error);
      return false;
    }
  };

  /**
   * Fetches the current location of the driver and sends it to the database.
   *
   * This function performs the following steps:
   * 1. Retrieves the current position of the device using `Location.getCurrentPositionAsync`.
   * 2. Extracts the latitude and longitude from the retrieved location.
   * 3. Updates the user location state with the retrieved latitude and longitude.
   * 4. Sends the updated location to the database using `updateDriverLocation`.
   *
   * If an error occurs during any of these steps, it logs an error message to the console.
   *
   * @returns {Promise<void>} A promise that resolves when the location has been successfully fetched and sent.
   */
  const fetchAndSendDriverLocation = async () => {
    try {
      // Get the current position of the device
      const location = await Location.getCurrentPositionAsync({});

      // Extract the latitude and longitude from the location
      const { latitude, longitude } = location.coords;

      // Update the user location state with the retrieved latitude and longitude
      setUserLocation({ latitude, longitude });

      // Send the updated location to the database
      await updateDriverLocation({ latitude, longitude });
    } catch (error) {
      console.error(
        "* Out of service, cant fetch and send driver location!",
        error
      );
    }
  };

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        // Fetch drivers from the database
        const driversFromDB = await getDrivers();

        // Update the drivers state with the fetched drivers
        setDrivers(driversFromDB);
      } catch (error) {
        console.error("* Error fetching drivers", error);
      } finally {
        setLoading(false); // Set loading to false after fetching drivers
      }
    };

    /**
     * Starts tracking the driver's location.
     *
     * This function checks for location permissions and, if granted, fetches and sends the driver's location
     * to the server immediately. It continues to send the driver's location at 1-minute intervals.
     *
     * @returns {Promise<() => void>} A cleanup function to clear the interval on component unmount.
     */
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

    // Check if user is logged in and start tracking
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
                // Display the Map when loading is done
                // TODO: update the drivers with the MapDriversAPI!
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
