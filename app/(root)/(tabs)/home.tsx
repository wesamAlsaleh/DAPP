import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// import the GlobalStyles script to use the global styles
import GlobalStyles from "@/scripts/GlobalStyles";

// import the AuthContext through useAuth hook
import { useAuth } from "@/contexts/AuthContext";

// import the Custom components
import Map from "@/components/Map";
import UserMap from "@/components/UserMap";
import StatusWidget from "@/components/widgets/status-widget";
import DriversCountWidget from "@/components/widgets/drivers-count-widget";
import LoadingSpinner from "@/components/LoadingSpinner";

// import location stuff
import * as Location from "expo-location"; // For accessing location services

import { LocationObject } from "expo-location";

// import TaskManager from expo to manage background tasks
import * as TaskManager from "expo-task-manager"; // For managing background tasks

// import driver functions
import { getDrivers, updateDriverLocation } from "@/services/driver-services";

// import User interface
import { User } from "@/types/user";

// Define the name of the background location task for TaskManager
const LOCATION_TASK_NAME = "background-location-task";

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

  // Define the background location task for TaskManager to execute
  TaskManager.defineTask(
    LOCATION_TASK_NAME,
    async ({
      data,
      error,
    }: TaskManager.TaskManagerTaskBody<{ locations: LocationObject[] }>) => {
      // Log the error if there is one
      if (error) {
        console.error("Background location task error:", error);
        return;
      }

      // Extract user locations from data
      const { locations } = data;

      // Process the locations array
      locations.forEach(async (location) => {
        // Extract the user latitude and longitude from the location object
        const { latitude, longitude } = location.coords;

        // Update the user location state with the retrieved latitude and longitude
        setUserLocation({ latitude, longitude });

        // Send the updated location to the database
        await updateDriverLocation({ latitude, longitude });
      });
    }
  );

  // useEffect hook to fetch drivers from the database and start location tracking
  useEffect(() => {
    /**
     * Fetches drivers from the database and updates the drivers state.
     *
     * @async
     * @function fetchDrivers
     * @returns {Promise<void>} A promise that resolves when the drivers have been fetched and the state has been updated.
     * @throws Will log an error message if there is an issue fetching the drivers.
     */
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
     * Starts tracking the user's location in the background using the TaskManager.
     *
     * This function first checks for location permissions. If the permission is granted,
     * it starts location tracking with high accuracy, updating the location every second
     * and every meter moved.
     *
     * @returns {Promise<void>} A promise that resolves when the location tracking has started.
     */
    const startTracking = async () => {
      /**
       * Clear any previous error messages
       * Each time you attempt to start tracking the user's location,
       * any previous error message is cleared first.
       */
      setErrorMsg("");

      // checks for location permissions
      const hasPermission = await requestLocationPermission();

      // if he have the permission get the driver location
      if (hasPermission) {
        // Request background location permissions
        const { status: backgroundStatus } =
          await Location.requestBackgroundPermissionsAsync();

        // Check if background location permissions were granted
        if (backgroundStatus === "granted") {
          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            // Start location updates in the background with high accuracy
            accuracy: Location.Accuracy.High, // Use high accuracy for location updates (GPS)
            distanceInterval: 1, // Update location every meter
            deferredUpdatesInterval: 1000, // Update location every second
          });
        } else {
          setErrorMsg("Background location permission was denied");
          return;
        }
      }
    };

    // If the user is logged in, fetch drivers
    if (user?.role === "admin") {
      fetchDrivers(); // Fetch Drivers
    }

    // Check if user is logged in and start tracking
    if (user) {
      startTracking(); // Start tracking
    }
  }, [user]); // Run this effect when the user changes (login/logout)

  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea} className="bg-general-500">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* header section */}
        <View className=" items-start justify-center">
          <Text className="text-black font-bold text-2xl">
            Welcome back, <Text className="text-primary-600">{user?.name}</Text>
          </Text>

          {/* if there is an error show it  */}
          {errorMsg === "" ? null : (
            <Text className="text-red-500 text-sm mt-2 font-bold">
              {errorMsg}
            </Text>
          )}
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
                // TODO: Only add the available/busy drivers to the map
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
