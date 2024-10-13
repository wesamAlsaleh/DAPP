// components/ProtectedRoute.tsx
import React from "react";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

// Import the useAuth hook from the AuthContext
import { useAuth } from "@/contexts/AuthContext";

// Define the ProtectedRouteProps interface
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#0000ff" />
    </View>;
  }

  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
