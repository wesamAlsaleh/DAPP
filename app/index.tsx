import { Redirect } from "expo-router";

import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  // get the user data from the AuthContext
  const { user, loading } = useAuth();

  // check if the user is authenticated and redirect to the home page if true
  return user ? (
    <Redirect href="/(root)/home" />
  ) : (
    <Redirect href="/(auth)/sign-in" />
  );
}
