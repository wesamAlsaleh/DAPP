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

// import driver functions
import { getDrivers, updateDriverLocation } from "@/services/driver-services";

// import User interface
import { User } from "@/types/user";

// import TaskManager from expo
import * as TaskManager from "expo-task-manager";

// Background Task Identifier
const LOCATION_TASK_NAME = "background-location-task";

// Define a type for location coordinates
interface Coordinates {
  latitude: number;
  longitude: number;
}

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

  /**
   * Requests both foreground and background location permissions from the user.
   *
   * @returns {Promise<boolean>} A promise that resolves to `true` if both permissions are granted,
   *                             otherwise `false`.
   *
   * @throws Will log an error to the console if there is an issue requesting the permissions.
   */
  const requestLocationPermission = async () => {
    try {
      // request the foreground permission to access the location
      let { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();

      // request the background permission to access the location
      let { status: backgroundStatus } =
        await Location.requestBackgroundPermissionsAsync();

      // if the location is not granted set a message
      if (foregroundStatus !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // if the background location is not granted set a message
      if (backgroundStatus !== "granted") {
        setErrorMsg(
          "Permission to access location in the background was denied"
        );
        return;
      }

      return true;
    } catch (error) {
      console.error("* Error requesting location permission", error);
      return false;
    }
  };

  // // Fetch the driver's current location and send to backend
  // const fetchAndSendDriverLocation = async () => {
  //   try {
  //     // get the granter location
  //     const location = await Location.getCurrentPositionAsync({});

  //     // Get the longitude & latitude from the granted location
  //     const { latitude, longitude } = location.coords;

  //     // Set the user location
  //     setUserLocation({ latitude, longitude });

  //     // Send the location to the database
  //     await updateDriverLocation({ latitude, longitude });
  //   } catch (error) {
  //     console.error("* Error fetching driver location: ", error);
  //   }
  // };

  // Function to fetch drivers from the database
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

  // Register background task to fetch and update driver location
  TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    // If there is an error, log it to the console
    if (error) {
      console.error("* Error in location task:", error);
      return;
    }

    // If there is data, update the driver location
    if (data) {
      // Parse the location data from the task
      const locations = data as Location.LocationObject[];

      // Get the latitude and longitude from the first location
      const { latitude, longitude } = locations[0].coords; // Get the first location data

      // Update location in database
      await updateDriverLocation({ latitude, longitude });
    }
  });

  /**
   * Starts tracking the driver's location, updating the backend periodically.
   */
  const startTracking = async (): Promise<void> => {
    // check if the user has the permission
    const hasPermission = await requestLocationPermission();

    // if the user has the permission start tracking the location and send it to the task manager "LOCATION_TASK_NAME"
    if (hasPermission) {
      try {
        // (task name, options) - Starts the background location task
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.High, // High accuracy
          distanceInterval: 200, // update every 200 meters
          deferredUpdatesInterval: 60000, // 1 minute
          showsBackgroundLocationIndicator: true, // show the location indicator in the status bar
        });
      } catch (error) {
        console.error("* Error starting location updates:", error);
      }
    }
  };

  /**
   * Stops tracking the driver's location.
   */
  const stopTracking = async (): Promise<void> => {
    try {
      // Stops the background location
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    } catch (error) {
      console.error("* Error stopping location updates:", error);
    }
  };

  // Fetch drivers effect
  useEffect(() => {
    // Fetch the drivers if the user is an admin
    if (user?.role === "admin") fetchDrivers();

    // Start tracking if the user is a driver
    if (user?.role === "driver") startTracking();
  }, [user]);

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
        {user?.role === "admin" && (
          <>
            <View>
              {loading ? (
                // Display loading spinner if still loading
                <LoadingSpinner indicatorMessage="Loading drivers..." />
              ) : (
                <>
                  {drivers.length === 0 ? (
                    <View className="mt-4 p-4 bg-red-100 rounded-lg">
                      <Text className="text-red-500 font-bold text-sm">
                        * No drivers available
                      </Text>
                    </View>
                  ) : (
                    <>
                      {/* Admin widget */}
                      <DriversCountWidget driversCount={drivers.length} />

                      {/* Map Section */}
                      <Map drivers={drivers} />
                    </>
                  )}
                </>
              )}
            </View>
          </>
        )}

        {/* Driver Dashboard */}
        {user?.role === "driver" && (
          <View>
            {/* Status Bar widget */}
            <StatusWidget />

            <Text className="mt-4 font-bold text-2xl">
              You're on the move! 🚗
            </Text>
            <Text className="text-lg text-gray-600 mt-2">
              Here's where you are right now:
            </Text>

            {/* Map Section */}
            {userLocation ? (
              <UserMap userLocation={userLocation} />
            ) : (
              <View className="mt-4 p-4 bg-red-100 rounded-lg">
                <Text className="text-red-500 font-bold text-sm">
                  * Location not available
                </Text>
              </View>
            )}
          </View>
        )}

        {/* footer section */}
        <>
          {user?.role === "driver" && userLocation && (
            <View className="mt-4 p-4 bg-green-100 rounded-lg">
              <Text className="text-green-500 font-bold text-sm">
                Your latitude: {userLocation.latitude}, your longitude:{" "}
                {userLocation.longitude}
              </Text>
            </View>
          )}

          <View className="mt-4 flex items-center">
            <Text className="text-center text-sm text-slate-400">
              @ Nov/2024 DAPP production
            </Text>
          </View>
        </>
      </ScrollView>
    </SafeAreaView>
  );
}
