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
import AllDriversCountWidget from "@/components/widgets/filtering-widget";
import LoadingSpinner from "@/components/LoadingSpinner";

// import location stuff
import * as Location from "expo-location"; // For accessing location services

// import driver functions
import {
  getOnlineDrivers,
  updateDriverLocation,
} from "@/services/driver-services";

// import User interface
import { User } from "@/types/user";

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
   * Function to get the user's location
   * @returns Promise<LocationObject | null>
   * @example {"_h": 0, "_i": 0, "_j": null, "_k": null}
   */
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

      // console.log("User location:", { latitude, longitude });

      // Set the user location
      setUserLocation({ latitude, longitude });

      // Send the location to the database
      await updateDriverLocation({ latitude, longitude });
    } catch (error) {}
  };

  // Fetch drivers effect
  useEffect(() => {
    const fetchMapDrivers = async () => {
      try {
        const driversFromDB = await getOnlineDrivers();

        setDrivers(driversFromDB);
      } catch (error) {
        console.error("Error fetching drivers", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch the drivers if the user is an admin
    if (user?.role === "admin") fetchMapDrivers();

    const startTracking = async () => {
      // check if the user has the permission
      const hasPermission = await requestLocationPermission();

      // if true fetch the user
      if (hasPermission) {
        // Fetch location initially
        fetchAndSendDriverLocation();

        // Fetch location every 1 minute
        const locationInterval = setInterval(() => {
          fetchAndSendDriverLocation();
        }, 60000); // 60,000 milliseconds = 1 minute

        // Cleanup interval on component unmount
        return () => clearInterval(locationInterval);
      }
    };

    // Start tracking if the user is a driver
    if (user?.role === "driver") startTracking();
  }, [user]);

  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea} className="bg-general-500">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* header section */}
        <View className=" items-start justify-center">
          <Text className="text-black font-bold text-2xl">
            Welcome home, <Text className="text-primary-600">{user?.name}</Text>
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

                      {/* Drivers widget */}
                      {/* <AllDriversCountWidget /> */}
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
