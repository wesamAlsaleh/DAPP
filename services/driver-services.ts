import axios from "axios";

// import the use auth to get the user
import { useAuth } from "@/contexts/AuthContext";
import { getToken } from "./token-service";

const API_BASE_URL = "http://dapp.bableto.site/api"; // Update this as needed

export const getDrivers = async () => {
  const response = await axios.get(`${API_BASE_URL}/drivers`);
  return response.data;
};

// Update driver's location API call
export const updateDriverLocation = async ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) => {
  // get the user
  const { user } = useAuth();

  try {
    const userToken = getToken();

    console.log(userToken);

    const response = await axios.post(
      `${API_BASE_URL}/user/location`,
      {
        latitude,
        longitude,
      },
      {
        headers: {
          "Content-Type": "application/vnd.api+json",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating driver location", error);
    throw error;
  }
};
