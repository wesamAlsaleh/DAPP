import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

// import the driver count functions
import {
  getAvailableDriversCount,
  getBusyDriversCount,
  getOfflineDriversCount,
} from "@/services/driver-services";

// import the LoadingSpinner component
import LoadingSpinner from "../LoadingSpinner";

// import custom components
import DriverCard from "@/components/DriverCard";

export default function allDriversCountWidget() {
  // Drivers count state
  const [availableDriversCount, setAvailableDriversCount] = useState(0);
  const [busyDriversCount, setBusyDriversCount] = useState(0);
  const [offlineDriversCount, setOfflineDriversCount] = useState(0);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Fetch the drivers count data from the server
  const fetchData = async () => {
    try {
      // set the loading state to true
      setIsLoading(true);

      // get the drivers data
      const [availableDrivers, busyDrivers, offlineDrivers] = await Promise.all(
        [
          getAvailableDriversCount(),
          getBusyDriversCount(),
          getOfflineDriversCount(),
        ]
      );

      // set the drivers data
      setAvailableDriversCount(availableDrivers);
      setBusyDriversCount(busyDrivers);
      setOfflineDriversCount(offlineDrivers);
    } catch (error) {
      setError("Failed to fetch driver data");
      console.error("* ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalDrivers =
    availableDriversCount + busyDriversCount + offlineDriversCount;

  // Fetch the data on component mount
  useEffect(() => {
    fetchData();
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
    // Drivers count cards container
    <View className="mt-4 flex-row flex-wrap justify-between ">
      {/* total card  */}
      <DriverCard
        title="Total Drivers"
        count={totalDrivers}
        status="total"
        subTitle="Total Drivers in the system"
      />

      {/* available drivers card */}
      <DriverCard
        title="Available Drivers"
        count={availableDriversCount}
        status="available"
        subTitle="Drivers available for trips"
      />

      {/* busy drivers card */}
      <DriverCard
        title="Busy Drivers"
        count={busyDriversCount}
        status="busy"
        subTitle="Drivers currently on trips"
      />

      {/* offline drivers card */}
      <DriverCard
        title="Offline Drivers"
        count={offlineDriversCount}
        status="offline"
        subTitle="Drivers currently offline"
      />
    </View>
  );
}
