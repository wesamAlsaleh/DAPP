import React, { useContext, useEffect, useState } from "react";
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

  const [showMap, setShowMap] = useState(false);

  return (
    // <ProtectedRoute>
    <SafeAreaView style={GlobalStyles.droidSafeArea} className="bg-general-500">
      {/* page container */}
      <View className="px-4 py-6">
        {/* header section */}
        <View className=" items-start justify-center">
          <Text className="text-black font-bold text-2xl">
            Welcome back, <Text className="text-primary-500">{user?.name}</Text>
          </Text>
        </View>

        {/* main section  */}
        <View>
          {/* Admin feater */}
          {user?.role === "admin" ? (
            <>
              <View className="bg-green-200 rounded-lg shadow-md mt-4">
                <Text className="text-xl text-center">This is Admin user</Text>
              </View>
            </>
          ) : null}

          {/* route to map page */}
          <CustomButton
            onPress={() => setShowMap(!showMap)}
            title={showMap ? "Hide Map" : "Show drivers on map"}
            bgVariant="secondary"
            className="mt-2"
          />

          {/* Map Section */}
          {showMap && <Map />}

          {/* Testing container  */}
          <View className="mt-4 ">
            <View className="flex items-center justify-center bg-yellow-400 rounded-lg h-[100px]">
              <Text className="text-center  text-lg  ">After the map</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
    // </ProtectedRoute>
  );
}
