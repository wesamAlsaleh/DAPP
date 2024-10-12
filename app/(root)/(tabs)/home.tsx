import React, { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// import the ProtectedRoute component to protect the route from unauthorized access
import ProtectedRoute from "@/components/ProtectedRoute";

// import the GlobalStyles script to use the global styles
import GlobalStyles from "@/scripts/GlobalStyles";

// import the AuthContext through useAuth hook
import { useAuth } from "@/contexts/AuthContext";

export default function home() {
  // get the user data from the AuthContext
  const { user } = useAuth();
  return (
    <ProtectedRoute>
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <View>
          <Text className="text-2xl ">Welcome home {user?.name}</Text>
        </View>
      </SafeAreaView>
    </ProtectedRoute>
  );
}
