import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// import android safe area view custom style
import GlobalStyles from "@/scripts/GlobalStyles";

export default function Index() {
  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <Text className="text-primary-500">
        Open up App.js to start working on your app!
      </Text>
    </SafeAreaView>
  );
}
