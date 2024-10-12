// TODO: add layout here for navigate through tabs (home, profile, etc)

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
          position: "absolute", // this will make the tab bar always above the content
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

/**
 * NOTEs: This layout sets up the bottom tab navigation for your app
 *  - Creates a tab navigator
 *  - Sets the initial route to "index"
 *  - Configures the tab bar appearance
 *  - The root layout (app/_layout.tsx) wraps everything and handles authentication.
 *  - Inside that, you have separate layouts for authentication ((auth)) and the main app content ((root)).
 *  - Within the main app content, you have a tabs layout that creates the bottom tab navigation.
 */
