import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function LoadingSpinner({
  indicatorMessage,
}: {
  indicatorMessage: string;
}) {
  return (
    // indicator Wrapper
    <View className="flex-1 justify-center items-center">
      {/* indicator */}
      <ActivityIndicator size="large" color="#0000ff" />

      {/* indicator Text */}
      <Text className="text-lg mt-12">{indicatorMessage}</Text>
    </View>
  );
}
