import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// import the GlobalStyles script to use the global styles
import GlobalStyles from "@/scripts/GlobalStyles";

// import custom components
import CustomButton from "@/components/CustomButton";

// import the ProtectedRoute component to protect the route from unauthorized access
import ProtectedRoute from "@/components/ProtectedRoute";

// import the AuthContext through useAuth hook
import { useAuth } from "@/contexts/AuthContext";

export default function drivers() {
  // get the user data from the AuthContext
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <View>
          <Text className="text-2xl ">Drivers list</Text>

          <Text className="text-lg">
            Welcome {user?.name}, {user?.email}
          </Text>

          <CustomButton
            title="Add new driver"
            onPress={() => console.log("Add new driver")}
          />
        </View>
      </SafeAreaView>
    </ProtectedRoute>
  );
}
