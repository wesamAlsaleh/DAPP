import AuthContext from "@/contexts/AuthContext";
import { loadUser } from "@/services/auth-services";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// create an interface for the user data
interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export default function AppLayout() {
  // Authenticated user state
  const [user, setUser] = useState<User | null>(null); // this will be globally available
  const [loading, setLoading] = useState<boolean>(true);

  // Load the user to pass it to the app layout context (AuthContext)
  useEffect(() => {
    async function fetchUser() {
      try {
        // Load the user
        const authenticatedUser = await loadUser();

        // Set the user in the state
        setUser(authenticatedUser);
      } catch (error) {
        console.error("Failed to load user from AppLayout:", error);
        setUser(null); // Ensure user is null on failure
      } finally {
        setLoading(false); // Set loading to false
      }
    }

    // Fetch the user
    fetchUser();
  }, []);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "Jakarta-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "Jakarta-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
    "Jakarta-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "Jakarta-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "Jakarta-Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Jakarta-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });

  // Splash screen auto-hides when loaded is true.
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* Define the route groups */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(root)" options={{ headerShown: false }} />
      </Stack>
    </AuthContext.Provider>
  );
}
