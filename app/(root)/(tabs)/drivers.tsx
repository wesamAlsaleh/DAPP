import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
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

  // query state to store the search query value
  const [searchQuery, setSearchQuery] = useState("");

  // drivers state
  const [drivers, setDrivers] = useState<User[]>([]);

  // Refresh state
  const [refreshing, setRefreshing] = useState(false);

  // fetch drivers from the API
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

  // Fetch the drivers when the component mounted
  useEffect(() => {
    fetchDrivers();
  }, []);

  // Refresh function to be called on pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDrivers(); // re-fetch drivers
    setRefreshing(false);
  };

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
      <TouchableOpacity className="bg-white rounded-xl shadow-sm p-5 mb-4 border border-gray-200">
        {/* Name Section */}
        <Text className="text-lg font-bold text-gray-800">{item.name}</Text>

        {/* Email Container */}
        <View className="flex-row items-center mt-3">
          <Image
            source={icons.computer_email}
            alt="email icon"
            className="w-6 h-6 opacity-70"
          />
          <Text className="text-gray-700 ml-3 text-sm font-medium">
            {item.email}
          </Text>
        </View>

        {/* Created At Container */}
        <View className="flex-row items-center mt-3">
          <Image
            source={icons.computer_calendar}
            alt="calendar icon"
            className="w-6 h-6 opacity-70"
          />
          <Text className="text-gray-700 ml-3 text-sm font-medium">
            Joined: {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>

        {/* Status Container */}
        <View className="flex-row items-center mt-3 p-3 rounded-md bg-gray-50">
          <Image
            source={icons.status}
            alt="status icon"
            className="w-5 h-5 opacity-80"
          />

          {item.status === "busy" && (
            <Text className="text-red-500 ml-3 text-sm font-medium">Busy</Text>
          )}

          {item.status === "available" && (
            <Text className="text-green-500 ml-3 text-sm font-medium">
              Available
            </Text>
          )}

          {item.status === "offline" && (
            <Text className="text-gray-500 ml-3 text-sm font-medium">
              Offline
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ProtectedRoute>
      <SafeAreaView style={GlobalStyles.droidSafeArea} className="bg-white">
        {/* page container */}
        <View className="px-4 py-6">
          {/* header section */}
          <Text className="text-2xl font-bold mb-4">Drivers List</Text>

          {/* search bar */}
          <CustomInputField
            label="Search about driver"
            labelStyle="text-gray-600"
            icon={icons.search}
            value={searchQuery}
            placeholder="Search drivers by name or email"
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
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          )}
        </View>
      </SafeAreaView>
    </ProtectedRoute>
  );
}
