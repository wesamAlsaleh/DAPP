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

  // mock data for the region
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  return (
    <ProtectedRoute>
      <SafeAreaView
        style={GlobalStyles.droidSafeArea}
        className="bg-general-500"
      >
        <View className="bg-[#3498db] items-center justify-center p-6">
          <Text style={styles.headerTitle}>Driver Map</Text>
        </View>
      </SafeAreaView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  map: {
    width: width,
    height: height - 100,
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#3498db",
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});
