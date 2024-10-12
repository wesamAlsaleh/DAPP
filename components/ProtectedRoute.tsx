// components/ProtectedRoute.tsx
import React from "react";
import { Redirect } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

// Define the ProtectedRouteProps interface
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();

  // if (loading) {
  //   // Optionally, render a loading indicator
  //   return null;
  // }

  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
