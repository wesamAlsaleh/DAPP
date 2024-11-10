import React, { useEffect, useState } from "react";
import {
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
import CustomInputField from "@/components/CustomInputField";
import LoadingSpinner from "@/components/LoadingSpinner";

// import the ProtectedRoute component to protect the route from unauthorized access
import ProtectedRoute from "@/components/ProtectedRoute";

// import the icons and images from the constants script
import { icons } from "@/constants";

// import the User type from the user script
import { User } from "@/types/user";

// Import the driver services (API calls)
import {
  getAvailableDrivers,
  getAvailableDriversCount,
  getBusyDrivers,
  getBusyDriversCount,
  getDrivers,
  getOfflineDrivers,
  getOnlineDrivers,
} from "@/services/driver-services";

// import the AuthContext through useAuth hook
import { useAuth } from "@/contexts/AuthContext";

export default function drivers() {
  // get the user data from the AuthContext
  const { user } = useAuth();

  // loading state
  const [isLoading, setIsLoading] = useState(true);

  // drivers state
  const [drivers, setDrivers] = useState<User[]>([]);

  // error state
  const [error, setError] = useState<string | null>(null);

  // query state to store the search query value
  const [searchQuery, setSearchQuery] = useState("");

  // Refresh state
  const [refreshing, setRefreshing] = useState(false);

  // Active filter state
  const [activeFilterType, setActiveFilterType] = useState("all");

  const fetchDrivers = async (filterType: string) => {
    // set loading to true
    setIsLoading(true);

    try {
      // get the drivers from the API based on the filter type
      let driversFromDB;

      // switch the filter type based on the filter type passed to the fetchDrivers function
      switch (filterType) {
        case "available":
          driversFromDB = await getAvailableDrivers(); // get available drivers
          break;
        case "busy":
          driversFromDB = await getBusyDrivers(); // get busy drivers
          break;
        case "offline":
          driversFromDB = await getOfflineDrivers(); // get offline drivers
          break;
        default:
          driversFromDB = await getDrivers(); // get all drivers
      }

      // set the drivers state
      setDrivers(driversFromDB);

      // set the active filter type to the filter type passed to the function
      setActiveFilterType(filterType);

      // clear the error
      setError(null);
    } catch (error) {
      // set the error message
      setError(`Error fetching ${filterType} drivers`);

      // log the error
      console.error(`* Error fetching ${filterType} drivers`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all the drivers from the server as the default
  useEffect(() => {
    fetchDrivers("all");
  }, []);

  // Refresh function to be called on pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDrivers(activeFilterType);
    setRefreshing(false);
  };

  // filter the drivers based on the search query
  const filteredDrivers = drivers.filter(
    (driver) =>
      // check if the driver name or email includes the search query
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // render driver item to display the driver details on the flat list "driver card"
  const renderDriverItem = ({ item }: any) => {
    return (
      <TouchableOpacity className="bg-white rounded-xl shadow-sm p-5 mb-4 border border-gray-200">
        {/* Name Section */}
        <Text className="text-lg font-bold text-gray-800">
          {item.name === user?.name && "🌟"} {item.name}{" "}
          {item.name === user?.name && (
            <Text className="text-sm font-medium text-primary-600">(You)</Text>
          )}
        </Text>

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

  // Filter button component
  const FilterButton = ({
    buttonTitle,
    buttonFilterType,
  }: {
    buttonTitle: string;
    buttonFilterType: string;
  }) => (
    <TouchableOpacity
      onPress={() => {
        fetchDrivers(buttonFilterType);
      }}
      className={`px-4 py-2 rounded-lg mr-2 ${
        activeFilterType === buttonFilterType
          ? "bg-primary-600 border-primary-600"
          : "bg-white border-gray-300"
      } border`}
    >
      <Text
        className={`text-sm font-medium text-center ${
          activeFilterType === buttonFilterType ? "text-white" : "text-gray-700"
        }`}
      >
        {buttonTitle}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ProtectedRoute>
      <SafeAreaView style={GlobalStyles.droidSafeArea} className="bg-white">
        {/* page container */}
        <View className="px-4 py-6">
          {/* header section */}
          <Text className="text-2xl font-bold mb-4">Drivers List</Text>

          {/* error message */}
          {error && (
            <View className="mt-4 p-4 bg-red-100 rounded-lg">
              <Text className="text-red-500 font-bold text-sm">* {error}</Text>
            </View>
          )}

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

          {/* filter section */}
          <View className="flex-row mb-4">
            <FilterButton buttonTitle="All" buttonFilterType="all" />
            <FilterButton
              buttonTitle="Available"
              buttonFilterType="available"
            />
            <FilterButton buttonTitle="Busy" buttonFilterType="busy" />
            <FilterButton buttonTitle="Offline" buttonFilterType="offline" />
          </View>

          {/* list section */}
          {isLoading ? (
            <LoadingSpinner indicatorMessage="Loading drivers..." />
          ) : (
            <FlatList
              data={filteredDrivers}
              renderItem={renderDriverItem}
              keyExtractor={(item) => item.id.toString()}
              keyboardShouldPersistTaps="handled" // this will allow the keyboard to be dismissed when tapping outside the input field
              contentContainerStyle={{ paddingBottom: 110 }} // increase the padding to make space for the bottom bar
              ListEmptyComponent={
                <Text className="text-center text-xl font-bold text-gray-500 mt-4">
                  No drivers found
                </Text>
              }
              ListFooterComponent={<View style={{ height: 200 }} />} // add an explicit spacer to push the last item above the bottom bar (solution for the bottom bar covering the last item)
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
