import React from "react";
import { Text, View } from "react-native";

// import linear design
import { LinearGradient } from "expo-linear-gradient";

export default function AdminWidget() {
  return (
    // Widget container
    <View className="mt-6 rounded-lg overflow-hidden bg-white shadow-md">
      <LinearGradient
        colors={["#1b5e20", "#2e7d32"]} // Gradient colors
        start={{ x: 0, y: 0 }} // Gradient start point
        end={{ x: 1, y: 0 }} // Gradient end point
        style={{
          padding: 24,
          borderBottomWidth: 1,
          borderBottomColor: "#1b5e20",
        }} // Add padding and border bottom color to the gradient container (green)
      >
        {/* Icon and title container */}
        <View className="flex-row items-center justify-center">
          {/* Add your icon here if needed */}
          {/* ... */}

          <Text className="text-2xl font-semibold text-white ml-2">
            Admin Access Granted
          </Text>
        </View>

        <Text className="text-center text-base text-gray-200 mt-2">
          You have special permissions to manage the system.
        </Text>
      </LinearGradient>
    </View>
  );
}
