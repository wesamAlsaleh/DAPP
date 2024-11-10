import React from "react";
import { Text, View } from "react-native";

export default function DriverCard({
  title,
  subTitle,
  count,
  status,
}: {
  title: string;
  subTitle?: string;
  count: number;
  status: "total" | "available" | "busy" | "offline";
}) {
  // Function to get the text color based on the status
  const getTextColor = (): string => {
    switch (status) {
      case "total":
        return "text-blue-700";
      case "available":
        return "text-green-700";
      case "busy":
        return "text-yellow-700";
      case "offline":
        return "text-red-700";
      default:
        return "text-gray-700";
    }
  };

  // Function to get the background color for the badge based on the status
  const getBadgeBackgroundColor = (): string => {
    switch (status) {
      case "total":
        return "bg-blue-200";
      case "available":
        return "bg-green-200";
      case "busy":
        return "bg-yellow-200";
      case "offline":
        return "bg-red-200";
      default:
        return "bg-gray-200";
    }
  };

  return (
    // card container
    <View className="bg-white rounded-lg p-5 shadow-lg border border-gray-200 w-[48%] mb-4 transform hover:scale-105 transition duration-150 ease-in-out">
      {/* Title and Badge */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-semibold text-gray-800">{title}</Text>
      </View>

      {/* Count Badge with Background */}
      <View
        className={`rounded-full px-5 py-2 ${getBadgeBackgroundColor()} border-2 border-gray-300 shadow-sm`}
      >
        <Text className={`text-3xl font-extrabold ${getTextColor()}`}>
          {count}
        </Text>
      </View>

      {/* Subtitle */}
      <Text className="text-sm text-gray-500 mt-3 tracking-widest uppercase">
        {subTitle}
      </Text>
    </View>
  );
}
