import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

// import linear design
import { LinearGradient } from "expo-linear-gradient";
import { icons } from "@/constants";

export default function DriversCountWidget({
  driversCount,
}: {
  driversCount: number;
}) {
  return (
    // Widget container
    <View className="mt-6 rounded-2xl overflow-hidden bg-white shadow-md">
      <LinearGradient
        colors={["#1b5e20", "#2e7d32"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          padding: 24,
          borderBottomWidth: 1,
          borderBottomColor: "#1b5e20",
        }}
      >
        {/* ... container */}
        <View className="flex-row items-center justify-center">
          {/* Add your icon here if needed */}
          <Text className="text-2xl font-semibold text-white ml-2">
            Admin Access Granted
          </Text>
        </View>

        <Text className="text-center text-gray-200 mt-2">
          You have special permissions to manage the system.
        </Text>
      </LinearGradient>

      {/* Total users widget container */}
      <View className="p-6 bg-green-50">
        {/* Title, description and Icon container */}
        <View className="flex-row justify-between items-center">
          {/* Title & description container */}
          <View>
            <Text className="text-lg font-medium text-green-700">
              Total Online Drivers
            </Text>

            <Text className="text-2xl font-bold text-green-900">
              {driversCount}
            </Text>
          </View>

          {/* Available icon container */}
          <View className="h-12 w-12 rounded-full bg-green-100 flex justify-center items-center">
            <Image alt="" source={icons.available} className="w-12 h-12" />
          </View>
        </View>

        <Text className="text-sm text-green-800 mt-2">
          Active drivers in the system
        </Text>
      </View>
    </View>
  );
}
