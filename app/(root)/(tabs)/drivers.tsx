import CustomButton from "@/components/CustomButton";
import ProtectedRoute from "@/components/ProtectedRoute";
import GlobalStyles from "@/scripts/GlobalStyles";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function drivers() {
  return (
    <ProtectedRoute>
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <View>
          <Text className="text-2xl ">Drivers list</Text>
        </View>
      </SafeAreaView>
    </ProtectedRoute>
  );
}
