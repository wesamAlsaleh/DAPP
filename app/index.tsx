import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// import android safe area view custom style
import GlobalStyles from "@/scripts/GlobalStyles";

export default function Home() {
  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <Text>Open up App.js to start working on your app!</Text>
    </SafeAreaView>
  );
}
