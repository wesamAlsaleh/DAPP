import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function StatusWidget() {
  // Status state
  const [status, setStatus] = useState("available");

  // Status options
  const statusOptions = [
    { label: "available", color: "bg-green-500" },
    { label: "busy", color: "bg-yellow-500" },
    { label: "offline", color: "bg-gray-500" },
  ];

  return (
    // widget container
    <View className="bg-white rounded-lg shadow-md mt-4 p-6">
      <Text className="text-lg font-bold mb-4">Set your status:</Text>

      {/* Status bar container */}
      <View className="flex-row items-center bg-gray-200 rounded-full overflow-hidden">
        {statusOptions.map((option) => (
          <TouchableOpacity
            key={option.label}
            onPress={() => setStatus(option.label)}
            className={`flex-1 p-3 items-center justify-center  ${
              status === option.label
                ? `${option.color} text-white`
                : "text-gray-700"
            } transition-colors duration-300`}
            style={{
              borderRadius: 30, // Smooth border for each segment
              margin: 1, // Tiny margin to create a smooth segmented look
            }}
          >
            {/* Display status label */}
            <Text
              className={`text-base font-medium ${
                status === option.label ? "text-white" : "text-gray-700"
              }`}
            >
              {option.label.charAt(0).toUpperCase() + option.label.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="mt-4 text-base">
        Current status:{" "}
        <Text className="font-bold">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
      </Text>
    </View>
  );
}
