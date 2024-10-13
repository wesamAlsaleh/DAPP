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
  const [user, setUser] = useState<User | null>(null); // This will be globally available
  const [loading, setLoading] = useState<boolean>(true);

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

  // Load the user to pass it to the app layout context (AuthContext)
  useEffect(() => {
    async function fetchUser() {
      try {
        // Load the user
        const authenticatedUser = await loadUser();

        // Log the authenticated user
        // console.log("Authenticated user:", authenticatedUser);

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

  // Splash screen auto-hides when loaded is true.
  useEffect(() => {
    // if the fonts are loaded and the loading state is false hide the splash screen
    if (loaded && !loading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, loading]);

  // Return null while the fonts are loading and the user is not loaded
  if (!loaded || loading) {
    return null; // Or a loading indicator
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* Define the route groups */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(root)" options={{ headerShown: false }} />
      </Stack>
    </AuthContext.Provider>
  );
}
