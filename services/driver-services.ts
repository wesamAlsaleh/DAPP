import axios from "axios";

// import the use auth to get the user token
import { getToken } from "./token-service";

// get the API base URL from the environment variables
const API_BASE_URL = process.env.EXPO_PUBLIC_URL;

// get the drivers from the API
export const getDrivers = async () => {
  const response = await axios.get(`${API_BASE_URL}/drivers`);
  return response.data;
};

// TODO: Get the available/busy drivers only to use them on the map (send them through the home component)
export const getOnlineDrivers = async () => {
  const response = await axios.get(`${API_BASE_URL}/online-drivers`);
  return response.data;
};

// update the driver location
export const updateDriverLocation = async ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) => {
  try {
    // Get the user token
    const userToken = await getToken();

    // If there is no user token, log an error and return
    if (!userToken) {
      console.error("No user token found. Cannot update location.");
      return;
    }

    // Make the API call to update the driver's location
    const { data } = await axios.post(
      `${API_BASE_URL}/user/location`,
      {
        latitude,
        longitude,
      },
      {
        headers: {
          "Content-Type": "application/json", // set the content type to JSON API
          Authorization: `Bearer ${userToken}`, // pass the user token in the Authorization header
        },
      }
    );

    // Log the response for debugging purposes
    console.log("Location update response:", data.message);
  } catch (error) {
    console.error("Error updating driver location (driver-service)", {
      error,
      latitude,
      longitude,
    });
  }
};
