import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// import the GlobalStyles script to use the global styles
import GlobalStyles from "@/scripts/GlobalStyles";

// import custom components
import CustomButton from "@/components/CustomButton";
import CustomInputField from "@/components/CustomInputField";

// import the ProtectedRoute component to protect the route from unauthorized access
import ProtectedRoute from "@/components/ProtectedRoute";

// import the icons and images from the constants script
import { icons, images } from "@/constants";

// import the User type from the user script
import { User } from "@/types/user";

// import the getDrivers function from the driver-services script
import { getDrivers } from "@/services/driver-services";

export default function drivers() {
  // loading state
  const [loading, setLoading] = useState(true);

  // fetch drivers from the API
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const driversFromDB = await getDrivers();

        setDrivers(await driversFromDB);
      } catch (error) {
        console.error("Error fetching drivers", error);
      } finally {
        setLoading(false); // This runs regardless of success or error
      }
    };

    fetchDrivers();
  }, []);

  // query state to store the search query value
  const [searchQuery, setSearchQuery] = useState("");

  // drivers state
  const [drivers, setDrivers] = useState<User[]>([]);

  // filter drivers based on the search query state value
  const filteredDrivers = drivers.filter(
    (driver) =>
      // check if the driver name or email includes the search query
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // render driver item to display the driver details on the flat list
  const renderDriverItem = ({ item }: any) => {
    return (
      <TouchableOpacity className="bg-white rounded-lg shadow-md p-4 mb-4">
        <Text className="text-lg font-semibold">{item.name}</Text>

        {/* email container */}
        <View className="flex-row items-center mt-2">
          <Image source={icons.email} alt="email icon" className="w-9 h-9" />
          <Text className="text-gray-600 ml-2 first-line:text-base">
            {item.email}
          </Text>
        </View>

        {/* created at container */}
        <View className="flex-row items-center mt-2">
          <Image source={icons.person} alt="email icon" className="w-9 h-9" />
          <Text className="text-gray-600 ml-2 text-base">
            Joined: {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ProtectedRoute>
      <SafeAreaView style={GlobalStyles.droidSafeArea} className="bg-white">
        {/* header section */}
        <View className="px-4 py-6">
          <Text className="text-2xl font-bold mb-4">Drivers List</Text>

          {/* search bar */}
          <CustomInputField
            label="Search drivers"
            icon={icons.search}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            containerStyle="bg-primary-100"
          />

          {/* main section */}
          {/* if loading show spinner otherwise show the FlatList */}
          {loading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="flex items-center justify-center"
              />
              <Text className="mt-2 text-gray-600">Loading drivers...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredDrivers}
              renderItem={renderDriverItem}
              keyExtractor={(item) => item.id.toString()}
              keyboardShouldPersistTaps="handled" // this will allow the keyboard to be dismissed when tapping outside the input field
              contentContainerStyle={{ paddingBottom: 100 }} // increase the padding to make space for the bottom bar
              ListEmptyComponent={
                <Text className="text-center text-xl font-bold text-gray-500 mt-4">
                  No drivers found
                </Text>
              }
              ListFooterComponent={<View style={{ height: 120 }} />} // add an explicit spacer to push the last item above the bottom bar (solution for the bottom bar covering the last item)
            />
          )}
        </View>
      </SafeAreaView>
    </ProtectedRoute>
  );
}
