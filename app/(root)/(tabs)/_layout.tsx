import { Tabs } from "expo-router";

// custom components
import TabIcon from "@/components/TabIcon";

// icons|images
import { icons } from "@/constants";

/// NOTE: this is the bottom navigation bar
export default function layout() {
  return (
    // Bottom navigation bar
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: "white", // active tab color
        tabBarInactiveTintColor: "white", // inactive tab color
        tabBarShowLabel: false, // hide tab bar label
        tabBarHideOnKeyboard: true, // hide tab bar when keyboard is open
        tabBarStyle: {
          backgroundColor: "#333333",
          borderRadius: 50,
          paddingBottom: 0,
          overflow: "hidden", // hide tab bar overflow "overflow is the content that is outside the tab bar"
          marginHorizontal: 20,
          marginBottom: 20,
          height: 78,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          position: "absolute", // keep the tab bar above the content
        },
      }}
    >
      {/* home */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} src={icons.home} />
          ),
        }}
      />

      {/* drivers */}
      <Tabs.Screen
        name="drivers"
        options={{
          title: "Drivers",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} src={icons.list} />
          ),
        }}
      />

      {/* profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} src={icons.profile} />
          ),
        }}
      />
    </Tabs>
  );
}
