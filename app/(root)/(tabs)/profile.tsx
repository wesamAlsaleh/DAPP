import React from "react";
import { Image, Text, View } from "react-native";
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

// import the icons from the constants
import { icons } from "@/constants";

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
      <SafeAreaView
        style={GlobalStyles.droidSafeArea}
        className="bg-general-500"
      >
        {/* page container */}
        <View className="px-4 py-6">
          {/* header container */}
          <View className="items-center mb-6">
            {/* User avatar */}
            <View className="w-24 h-24 rounded-full bg-gray-300 items-center justify-center">
              <Text className="text-4xl font-bold text-white">
                {user?.name?.charAt(0)}
              </Text>
            </View>

            {/* User name */}
            <Text className="text-2xl font-bold mt-4">
              {user?.name}'s Profile
            </Text>
          </View>

          {/* User details */}
          <View className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* User name */}
            <View className="flex-row items-center mb-4">
              <Image source={icons.user2} className="w-6 h-6" />
              <Text className="text-lg font-semibold ml-3">{user?.name}</Text>
            </View>

            {/* User email */}
            <View className="flex-row items-center mb-4">
              <Image source={icons.email1} className="w-6 h-6" />
              <Text className="text-lg ml-3">{user?.email}</Text>
            </View>

            {/* User role */}
            <View className="flex-row items-center">
              <Image source={icons.settings} className="w-6 h-6" />
              <Text className="text-lg ml-3 capitalize">{user?.role}</Text>
            </View>
          </View>

          {/* Logout button */}
          <CustomButton
            title="Logout"
            onPress={handleLogout}
            bgVariant={"danger"}
          />
        </View>
      </SafeAreaView>
    </ProtectedRoute>
  );
}
