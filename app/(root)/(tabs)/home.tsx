import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, AppState } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GlobalStyles from "@/scripts/GlobalStyles";
import { useAuth } from "@/contexts/AuthContext";
import Map from "@/components/Map";
import UserMap from "@/components/UserMap";
import StatusWidget from "@/components/widgets/status-widget";
import DriversCountWidget from "@/components/widgets/drivers-count-widget";
import LoadingSpinner from "@/components/LoadingSpinner";
import * as Location from "expo-location";
import { LocationObject } from "expo-location";
import * as TaskManager from "expo-task-manager";
import { getDrivers, updateDriverLocation } from "@/services/driver-services";
import { User } from "@/types/user";

const LOCATION_TASK_NAME = "background-location-task";

export default function Home() {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState<User[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Check if the background task is already registered
  const isTaskRegistered = async () => {
    const tasks = await TaskManager.getRegisteredTasksAsync();
    return (
      tasks.find((task) => task.taskName === LOCATION_TASK_NAME) !== undefined
    );
  };

  // Define background task only if it hasn't been defined yet
  if (!TaskManager.isTaskDefined(LOCATION_TASK_NAME)) {
    TaskManager.defineTask(
      LOCATION_TASK_NAME,
      async ({
        data,
        error,
      }: TaskManager.TaskManagerTaskBody<{ locations: LocationObject[] }>) => {
        if (error) {
          console.error("Background location task error:", error);
          return;
        }

        try {
          const { locations } = data;
          if (locations && locations.length > 0) {
            const { latitude, longitude } = locations[0].coords;
            setUserLocation({ latitude, longitude });
            await updateDriverLocation({ latitude, longitude });
          }
        } catch (e) {
          console.error("Error processing location update:", e);
        }
      }
    );
  }

  const fetchDrivers = async () => {
    try {
      const driversFromDB = await getDrivers();
      setDrivers(driversFromDB);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      setErrorMsg("Failed to fetch drivers data");
    } finally {
      setLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (foregroundStatus !== "granted") {
        setErrorMsg("Location permission denied");
        return false;
      }

      const { status: backgroundStatus } =
        await Location.requestBackgroundPermissionsAsync();

      if (backgroundStatus !== "granted") {
        setErrorMsg("Background location permission denied");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error requesting permissions:", error);
      setErrorMsg("Failed to request location permissions");
      return false;
    }
  };

  const startTracking = async () => {
    try {
      const taskRegistered = await isTaskRegistered();
      if (taskRegistered) {
        console.log("Location task already registered");
        return;
      }

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 1,
        deferredUpdatesInterval: 1000,
        foregroundService: {
          notificationTitle: "Location Tracking",
          notificationBody: "Tracking your location for delivery services",
        },
      });
    } catch (error) {
      console.error("Error starting location tracking:", error);
      setErrorMsg("Failed to start location tracking");
    }
  };

  const stopTracking = async () => {
    try {
      const isRegistered = await isTaskRegistered();
      if (isRegistered) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      }
    } catch (error) {
      console.error("Error stopping location tracking:", error);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchDrivers();
    }

    if (user?.role === "driver") {
      startTracking();
    }

    // Clean up function
    return () => {
      if (user?.role === "driver") {
        stopTracking();
      }
    };
  }, [user]);

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active" && user?.role === "driver") {
        startTracking();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [user]);

  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea} className="bg-general-500">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <View className="items-start justify-center">
          <Text className="text-black font-bold text-2xl">
            Welcome back, <Text className="text-primary-600">{user?.name}</Text>
          </Text>

          {errorMsg ? (
            <Text className="text-red-500 text-sm mt-2 font-bold">
              {errorMsg}
            </Text>
          ) : null}
        </View>

        {user?.role === "admin" && (
          <>
            <DriversCountWidget driversCount={drivers.length} />
            <View>
              {loading ? (
                <LoadingSpinner indicatorMessage="Loading drivers..." />
              ) : (
                <Map userLocation={userLocation} drivers={drivers} />
              )}
            </View>
          </>
        )}

        {user?.role === "driver" && (
          <View>
            <StatusWidget />
            <Text className="mt-4 font-bold text-2xl">
              You're on the move! 🚗
            </Text>
            <Text className="text-lg text-gray-600 mt-2">
              Here's where you are right now:
            </Text>
            <UserMap drivers={drivers} userLocation={userLocation} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
