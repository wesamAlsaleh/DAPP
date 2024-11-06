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
// const LOCATION_TASK_NAME = "background-location-task";

/**
 * Define the task if the task is not already defined for TaskManager
 *  to run in the background.
 */
// if (!TaskManager.isTaskDefined(LOCATION_TASK_NAME)) {
//   // Define the background location task
//   TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
//     // Handle any errors that occur during the background task
//     if (error) {
//       console.error("* Background location task error:", error);
//       return;
//     }

//     // Check if data was received in the background task
//     if (!data) {
//       console.error("* No data received in background task");
//       return;
//     }

//     try {
//       // Get the location data from the task data
//       const { locations } = data as { locations: LocationObject[] };

//       // Check if location data was received
//       if (locations && locations.length > 0) {
//         // Get the first location object from the array
//         const location = locations[0];

//         // Get the latitude and longitude from the location object
//         const { latitude, longitude } = location.coords;

//         // Send the updated location to the database
//         await updateDriverLocation({ latitude, longitude });

//         console.log("Background location updated:", { latitude, longitude });
//       }
//     } catch (error) {
//       console.error("* Error processing background location:", error);
//     }
//   });
// }

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

  // Tracking state
  const [isTracking, setIsTracking] = useState(false);

  // Function to start location tracking
  // const startLocationTracking = async () => {
  //   try {
  //     // Request location permissions
  //     const { status: foregroundStatus } =
  //       await Location.requestForegroundPermissionsAsync();

  //     // if the permission is not granted, show an error message
  //     if (foregroundStatus !== "granted") {
  //       setErrorMsg("Location permission denied");
  //       return false;
  //     }

  //     // Request background permissions
  //     const { status: backgroundStatus } =
  //       await Location.requestBackgroundPermissionsAsync();

  //     // if the permission is not granted, show an error message
  //     if (backgroundStatus !== "granted") {
  //       setErrorMsg("Background location permission denied");
  //       return false;
  //     }

  //     /**
  //      * Check if tracking is already active for the location task.
  //      * A promise which fulfills with boolean value indicating
  //      *  whether the location task is started or not.
  //      */
  //     const hasStarted = await Location.hasStartedLocationUpdatesAsync(
  //       LOCATION_TASK_NAME
  //     ).catch(() => false);

  //     // Start location tracking if not already active
  //     if (!hasStarted) {
  //       // Configure background location tracking settings
  //       await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
  //         accuracy: Location.Accuracy.Balanced, // Balance between accuracy and battery life
  //         distanceInterval: 10, // Minimum distance in meters before updates (10 meters)
  //         deferredUpdatesInterval: 5000, // Minimum time in ms between updates (5 seconds)
  //         // Foreground service notification for Android
  //         foregroundService: {
  //           notificationTitle: "Location Tracking Active",
  //           notificationBody: "Tracking your location for delivery updates",
  //           notificationColor: "#001a72",
  //         },
  //         // Activity recognition configuration
  //         activityType: Location.ActivityType.AutomotiveNavigation, // Activity type for location updates
  //         showsBackgroundLocationIndicator: true, // Show location indicator in status bar
  //         // Battery saving settings
  //         pausesUpdatesAutomatically: true, // Pause updates when the app is in the background
  //       });

  //       setIsTracking(true); // Set tracking state to true
  //       console.log("Location tracking started");
  //     }

  //     // Start foreground location updates for immediate feedback (foreground means the app is open)
  //     Location.watchPositionAsync(
  //       {
  //         accuracy: Location.Accuracy.Balanced, // Balance between accuracy and battery life
  //         distanceInterval: 10, // Minimum distance in meters before updates (10 meters)
  //         timeInterval: 5000, // Minimum time in ms between updates (5 seconds)
  //       },
  //       (location) => {
  //         // Update the user location state with the new location
  //         setUserLocation({
  //           latitude: location.coords.latitude,
  //           longitude: location.coords.longitude,
  //         });
  //       }
  //     );

  //     return true;
  //   } catch (error) {
  //     console.error("* Error starting location tracking:", error);
  //     setErrorMsg("Failed to start location tracking"); // Show error message if tracking fails
  //     return false;
  //   }
  // };

  // Function to stop location tracking
  // const stopLocationTracking = async () => {
  //   try {
  //     // Check if tracking is already active for the location task
  //     const hasStarted = await Location.hasStartedLocationUpdatesAsync(
  //       LOCATION_TASK_NAME
  //     ).catch(() => false);

  //     // Stop location tracking if already active
  //     if (hasStarted) {
  //       await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  //       setIsTracking(false);
  //       console.log("Location tracking stopped");
  //     }
  //   } catch (error) {
  //     console.error("Error stopping location tracking:", error);
  //   }
  // };

  // Fetch drivers effect
  useEffect(() => {
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

    // if the user is an admin, fetch the drivers
    if (user?.role === "admin") {
      fetchDrivers();
    }

    // if the user is a driver, start location tracking
    // if (user?.role === "driver") {
    //   startLocationTracking();
    // }

    // return a cleanup function
    // return () => {
    //   isMounted = false;

    //   // if the user is a driver, stop location tracking
    //   if (user?.role === "driver") {
    //     stopLocationTracking();
    //   }
    // };
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
                  {/* Admin widget */}
                  <DriversCountWidget driversCount={drivers.length} />

                  {/* Map Section */}
                  <Map drivers={drivers} />
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
        <View></View>
      </ScrollView>
    </SafeAreaView>
  );
}
