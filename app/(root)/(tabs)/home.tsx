import React, { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// import the AuthContext through useAuth hook
import { useAuth } from "@/contexts/AuthContext";

// import the ProtectedRoute component to protect the route from unauthorized access
import ProtectedRoute from "@/components/ProtectedRoute";

// import the logout function from the auth-services
import { logout } from "@/services/auth-services";
import { router } from "expo-router";

export default function home() {
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
      <View>
        <Text className="text-2xl">Welcome home {user?.name}</Text>
        <Text className="text-base">Home Screen is ....</Text>
      </View>

      <TouchableOpacity onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </ProtectedRoute>
  );
}
