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

export default function home() {
  // get the user data from the AuthContext
  const { user } = useAuth();

  // Drivers state
  const [drivers, setDrivers] = useState<User[]>([]);

  // Map state
  const [showMap, setShowMap] = useState(false);

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
    } catch (error) {}
  };

  // Fetch drivers from the API
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

    // Do the following only when the user is logged in
    if (user != null) {
      fetchDrivers();
      startTracking();
    }
  }, []); // Add an empty dependency array to run it once when the component mounts

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
            <DriversCountWidget driversCount={drivers.length} />

            {/* Map Section */}
            <View>
              {/* route to map page */}
              <CustomButton
                onPress={() => setShowMap(!showMap)}
                title={showMap ? "Hide Map" : "Show drivers on map"}
                bgVariant="secondary"
                className="mt-4"
              />

              {showMap ? (
                loading ? (
                  // Display loading spinner if still loading
                  <LoadingSpinner indicatorMessage="Loading drivers..." />
                ) : (
                  // Display the Map when loading is complete
                  <Map userLocation={userLocation} drivers={drivers} />
                )
              ) : null}
            </View>
          </>
        ) : null}

        {/* Admin & driver main section */}
        <View>
          {/* Status Bar widget */}
          <StatusWidget />
        </View>

        {/* footer section */}
        <View></View>
      </ScrollView>
    </SafeAreaView>
  );
}
