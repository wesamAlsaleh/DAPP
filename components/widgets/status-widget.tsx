import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

// import axios
import axios from "axios";

// import getToken to get the user token to send the request
import { getToken } from "@/services/token-service";

// import User interface
import { User } from "@/types/user";

// import the auth context
import { useAuth } from "@/contexts/AuthContext";

const appURL = process.env.EXPO_PUBLIC_URL;

export default function StatusWidget() {
  // get the user data from the AuthContext
  const { user } = useAuth();

  // Status state
  const [status, setStatus] = useState("available");

  // Loading state
  const [loading, setLoading] = useState(false);

  // Status options
  const statusOptions = [
    { label: "available", color: "bg-green-500" },
    { label: "busy", color: "bg-yellow-500" },
    { label: "offline", color: "bg-gray-500" },
  ];

  // Set initial status based on user context data
  useEffect(() => {
    if (user?.status) {
      setStatus(user.status);
    }
  }, [user?.status]);

  // Function to handle status change request
  const changeStatus = async (newStatus: any) => {
    setStatus(newStatus);
    setLoading(true); // set the loading state

    // get the user token from the secure store
    const userToken = await getToken();

    try {
      const response = await axios.post(
        `${appURL}/user/change-status`,
        {
          status: newStatus,
        },
        {
          headers: {
            "Content-Type": "application/vnd.api+json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
    } catch (error) {
      console.error("* Error updating status", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // widget container
    <View className="bg-white rounded-lg shadow-md mt-4 p-6">
      <Text className="text-lg font-bold mb-4">Set your status:</Text>

      {/* Status bar container */}
      <View className="flex-row items-center bg-gray-200 rounded-lg overflow-hidden">
        {statusOptions.map((option) => (
          <TouchableOpacity
            key={option.label}
            onPress={() => changeStatus(option.label)}
            className={`flex-1 p-3 items-center justify-center transition-colors duration-300 ${
              status === option.label
                ? `${option.color} text-white`
                : "text-gray-700"
            } `}
            style={{
              borderRadius: 10, // option button radius
              margin: 1, // option button margin
            }}
            disabled={loading}
          >
            {/* Display status label */}
            <Text
              className={`text-base font-medium ${
                status === option.label ? "text-white" : "text-gray-700"
              }`}
            >
              {option.label.charAt(0).toUpperCase() + option.label.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="mt-4 text-base">
        Current status:{" "}
        <Text className="font-bold">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
      </Text>
    </View>
  );
}
