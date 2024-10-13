import { ActivityIndicator, View, StyleSheet } from "react-native";
import { Redirect } from "expo-router";

import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  // get the user data from the AuthContext
  const { user, loading } = useAuth();

  // I got the null user from the AuthContext
  console.log("User from the index:", user);

  // If still loading, return null or a loading indicator
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Check if the user is authenticated to redirect accordingly
  return user ? (
    <Redirect href="/(root)/home" />
  ) : (
    <Redirect href="/(auth)/sign-in" />
  );
}
