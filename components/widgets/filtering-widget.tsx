import { Text, View } from "react-native";

// Import the driver services (API calls)
import {
  getAvailableDrivers,
  getAvailableDriversCount,
  getBusyDrivers,
  getBusyDriversCount,
  getDrivers,
  getOfflineDrivers,
  getOnlineDrivers,
} from "@/services/driver-services";
import React, { useEffect, useState } from "react";

// Import the loading spinner component
import LoadingSpinner from "../LoadingSpinner";

export default function filteringWidget() {
  const [drivers, setDrivers] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the drivers data from the server
  const fetchAllDrivers = async () => {
    try {
      // get the drivers from the API
      const driversFromDB = await getDrivers();

      // set the drivers state
      setDrivers(driversFromDB);

      // clear the error
      setError(null);
    } catch (error) {
      setError("Error fetching drivers");
      console.error("* Error fetching drivers", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch the available drivers for filtering
  const fetchAvailableDrivers = async () => {
    try {
      // get the drivers from the API
      const driversFromDB = await getAvailableDrivers();

      // set the drivers state
      setDrivers(driversFromDB);

      // clear the error
      setError(null);
    } catch (error) {
      setError("Error fetching available drivers");
      console.error("* Error fetching available drivers", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch the busy drivers for filtering
  const fetchBusyDrivers = async () => {
    try {
      // get the drivers from the API
      const driversFromDB = await getBusyDrivers();

      // set the drivers state
      setDrivers(driversFromDB);

      // clear the error
      setError(null);
    } catch (error) {
      setError("Error fetching busy drivers");
      console.error("* Error fetching busy drivers", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch the offline drivers for filtering
  const fetchOfflineDrivers = async () => {
    try {
      // get the drivers from the API
      const driversFromDB = await getOfflineDrivers();

      // set the drivers state
      setDrivers(driversFromDB);

      // clear the error
      setError(null);
    } catch (error) {
      setError("Error fetching offline drivers");
      console.error("* Error fetching offline drivers", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all the drivers from the server as the default
  useEffect(() => {
    fetchAllDrivers();
  }, []);

  // Show the loading state
  if (isLoading) {
    return (
      <View className="flex items-center justify-center mt-4">
        <LoadingSpinner indicatorMessage="Loading drivers counter..." />
      </View>
    );
  }

  if (error) {
    return (
      <View className="mt-4 p-4 bg-red-100 rounded-lg">
        <Text className="text-red-500 font-bold text-sm">* {error}</Text>
      </View>
    );
  }

  return (
    <View className="mt-4">
      <Text>Here</Text>
    </View>
  );
}
