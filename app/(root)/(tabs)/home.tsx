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

// import the Custom components
import CustomButton from "@/components/CustomButton";
import Map from "@/components/Map";

// import the Dimensions API to get the window dimensions
const { width, height } = Dimensions.get("window");

export default function home() {
  // get the user data from the AuthContext
  const { user } = useAuth();

  return (
    // <ProtectedRoute>
    <SafeAreaView style={GlobalStyles.droidSafeArea} className="bg-general-500">
      {/* page container */}
      <View className="px-4 py-6">
        {/* -------------------- header section -------------------- */}
        <View className=" items-start justify-center">
          <Text className="text-black font-bold text-2xl">
            Welcome back, <Text className="text-primary-500">{user?.name}</Text>
          </Text>
        </View>

        {/* -------------------- main section -------------------- */}
        {/* Admin feature container */}
        <View>
          {user?.role === "admin" ? (
            <View className="bg-green-200 rounded-lg shadow-md mt-4">
              <Text className="text-xl text-center">This is Admin user</Text>
            </View>
          ) : null}
        </View>

        {/* map + text container */}
        <View>
          <Text className="mb-3 mt-5 text-xl font-semibold">
            Your Current Location
          </Text>

          {/* map alone container */}
          <View className="flex flex-row items-center bg-transparent h-[300]">
            <Map />
          </View>
        </View>

        {/* end of page container  */}
      </View>
    </SafeAreaView>
    // </ProtectedRoute>
  );
}
