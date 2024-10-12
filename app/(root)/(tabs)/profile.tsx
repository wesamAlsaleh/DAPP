import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

// import custom components
import CustomButton from "@/components/CustomButton";

// import the ProtectedRoute component to protect the route from unauthorized access
import ProtectedRoute from "@/components/ProtectedRoute";

// import the GlobalStyles script to use the global styles
import GlobalStyles from "@/scripts/GlobalStyles";

// import the AuthContext through useAuth hook
import { useAuth } from "@/contexts/AuthContext";

// import the logout function from the auth-services
import { logout } from "@/services/auth-services";

export default function profile() {
  // get the user data from the AuthContext
  const { user, setUser } = useAuth();

  // handle the logout action
  const handleLogout = async () => {
    try {
      // call the logout function to log out the user
      await logout();

      // set the user to null to clear the user data
      setUser(null);

      // navigate to the login screen
      router.push("/(auth)/sign-in");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };
  return (
    <ProtectedRoute>
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <View>
          <Text className="text-2xl font-bold">{user?.name}'s profile</Text>
        </View>

        {/* Logout button */}
        <CustomButton
          title="Logout"
          onPress={handleLogout}
          bgVariant={"danger"}
          className="mt-4 mx-2"
        />
      </SafeAreaView>
    </ProtectedRoute>
  );
}
