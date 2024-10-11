import React, { useContext } from "react";
import { Text, View } from "react-native";

// import the AuthContext through useAuth hook
import { useAuth } from "@/contexts/AuthContext";

// import the ProtectedRoute component to protect the route from unauthorized access
import ProtectedRoute from "@/components/ProtectedRoute";

export default function home() {
  // get the user data from the AuthContext
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <View>
        <Text className="text-2xl">Welcome home {user?.name}</Text>
        <Text className="text-base">Home Screen is ....</Text>
      </View>
    </ProtectedRoute>
  );
}
