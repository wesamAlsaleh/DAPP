import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function LoadingSpinner({
  indicatorMessage,
}: {
  indicatorMessage: string;
}) {
  return (
    // indicator Wrapper
    <View className="justify-center items-center">
      {/* indicator */}
      <ActivityIndicator size="large" color="#101082A3" />

      {/* indicator Text */}
      <Text className="text-lg mt-12">{indicatorMessage}</Text>
    </View>
  );
}