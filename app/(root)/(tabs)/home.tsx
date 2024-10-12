import React, { useContext, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// import the ProtectedRoute component to protect the route from unauthorized access
import ProtectedRoute from "@/components/ProtectedRoute";

// import the GlobalStyles script to use the global styles
import GlobalStyles from "@/scripts/GlobalStyles";

// import the AuthContext through useAuth hook
import { useAuth } from "@/contexts/AuthContext";

// import the Dimensions API to get the window dimensions
const { width, height } = Dimensions.get("window");

// Mock data for drivers
const drivers = [
  { id: 1, name: "Driver 1", latitude: 37.78825, longitude: -122.4324 },
  { id: 2, name: "Driver 2", latitude: 37.78925, longitude: -122.4344 },
  { id: 3, name: "Driver 3", latitude: 37.78725, longitude: -122.4304 },
];

export default function home() {
  // get the user data from the AuthContext
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <SafeAreaView
        style={GlobalStyles.droidSafeArea}
        className="bg-general-500"
      >
        <View className="bg-general-500 items-start justify-center p-5">
          <Text className="text-black font-bold text-2xl">
            Welcome back <Text className="text-primary-500">{user?.name}</Text>{" "}
            👋
          </Text>
        </View>
      </SafeAreaView>
    </ProtectedRoute>
  );
}

// map styles
const styles = StyleSheet.create({
  map: {
    width: width,
    height: height - 100,
  },
});
