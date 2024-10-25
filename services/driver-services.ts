import axios from "axios";

// import the use auth to get the user
import { useAuth } from "@/contexts/AuthContext";
import { getToken } from "./token-service";

const API_BASE_URL = "http://dapp.bableto.site/api"; // Update this as needed

export const getDrivers = async () => {
  const response = await axios.get(`${API_BASE_URL}/drivers`);
  return response.data;
};

// TODO: Get the available/busy drivers only to use them on the map (send them through the home component)
export const getOnlineDrivers = async () => {
  const response = await axios.get(`${API_BASE_URL}/online-drivers`);
  return response.data;
};

//TODO: fix this Update driver's location API call
export const updateDriverLocation = async ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) => {
  try {
    // get the user token from the secure store
    const userToken = await getToken();

    await axios.post(
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
  } catch (error) {
    console.error(" * Error updating driver location", error);
  }
};
