import React from "react";
import { Text, View } from "react-native";

export default function Map() {
  const googleApiUrl = process.env.EXPO_PUBLIC_GOOGLE_KEY;

  return (
    <View>
      <Text className="bg-emerald-600 text-base text-black rounded-md text-center">
        MAP
      </Text>
    </View>
  );
}
