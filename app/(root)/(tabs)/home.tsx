import React, { useContext } from "react";
import { Text, View } from "react-native";

import { useAuth } from "@/contexts/AuthContext";

export default function home() {
  // get the user data from the AuthContext
  const { user } = useAuth();

  return (
    <View>
      <Text className="text-2xl">Welcome home {user?.name}</Text>
      <Text className="text-base">Home Screen is ....</Text>
    </View>
  );
}
