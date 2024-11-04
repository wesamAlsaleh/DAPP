import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

/**
 * LoadingSpinner component displays a loading spinner with a message.
 *
 * @param {Object} props - The props object.
 * @param {string} props.indicatorMessage - The message to display below the spinner.
 *
 * @returns {JSX.Element} The LoadingSpinner component.
 */
export default function LoadingSpinner({
  indicatorMessage,
}: {
  indicatorMessage: string;
}): JSX.Element {
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
