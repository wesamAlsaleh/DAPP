// import types
import { MarkerData } from "@/types/types";
import { User } from "@/types/user";

// TODO: Update this if needed!
const directionsAPI = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

/**
 * Generates marker data for drivers based on user location.
 *
 * @param {Object} params - The parameters for generating markers.
 * @param {Driver[]} params.data - Array of driver data.
 * @param {number} params.userLatitude - The user's latitude.
 * @param {number} params.userLongitude - The user's longitude.
 * @returns {MarkerData[]} An array of MarkerData objects for each driver.
 */
export const generateMarkersFromData = ({
  data,
  userLatitude,
  userLongitude,
}: {
  data: User[];
  userLatitude: number;
  userLongitude: number;
}): MarkerData[] => {
  return data.map((driver) => {
    const latOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005 'mock'
    const lngOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005 'mock'

    return {
      id: driver.id, // 'id' is coming from Driver's 'driver_id'
      latitude: userLatitude + latOffset,
      longitude: userLongitude + lngOffset,
      name: driver.name, // Map 'driver_name' to 'name'
      email: driver.email, // Map 'driver_email' to 'email'
      role: "driver", // Assuming 'role' is static as "driver"
      status: driver.status, // Map 'status' directly from Driver
    };
  });
};

/**
 * Calculates the map region based on user and destination coordinates.
 *
 * @param {Object} params - The parameters for the calculation.
 * @param {number|null} params.userLatitude - The user's latitude.
 * @param {number|null} params.userLongitude - The user's longitude.
 * @param {number|null} [params.destinationLatitude] - The destination latitude.
 * @param {number|null} [params.destinationLongitude] - The destination longitude.
 * @returns {Object} An object containing the calculated region properties.
 */
export const calculateRegion = ({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
}): object => {
  if (!userLatitude || !userLongitude) {
    return {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  if (!destinationLatitude || !destinationLongitude) {
    return {
      latitude: userLatitude,
      longitude: userLongitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  const minLat = Math.min(userLatitude, destinationLatitude);
  const maxLat = Math.max(userLatitude, destinationLatitude);
  const minLng = Math.min(userLongitude, destinationLongitude);
  const maxLng = Math.max(userLongitude, destinationLongitude);

  const latitudeDelta = (maxLat - minLat) * 1.3; // Adding some padding
  const longitudeDelta = (maxLng - minLng) * 1.3; // Adding some padding

  const latitude = (userLatitude + destinationLatitude) / 2;
  const longitude = (userLongitude + destinationLongitude) / 2;

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
};

/**
 * Calculates the estimated time and price for each driver to reach the user and destination.
 *
 * @param {Object} params - The parameters for the calculation.
 * @param {MarkerData[]} params.markers - Array of driver markers.
 * @param {number|null} params.userLatitude - The user's latitude.
 * @param {number|null} params.userLongitude - The user's longitude.
 * @param {number|null} params.destinationLatitude - The destination latitude.
 * @param {number|null} params.destinationLongitude - The destination longitude.
 * @returns {Promise<Array<MarkerData & {time: number, price: string}> | undefined>} A promise that resolves to an array of driver data with calculated time and price, or undefined if coordinates are missing.
 */
export const calculateDriverTimes = async ({
  markers,
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  markers: MarkerData[];
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
}): Promise<
  Array<MarkerData & { time: number; price: string }> | undefined
> => {
  if (
    !userLatitude ||
    !userLongitude ||
    !destinationLatitude ||
    !destinationLongitude
  )
    return;

  try {
    const timesPromises = markers.map(async (marker) => {
      const responseToUser = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${marker.latitude},${marker.longitude}&destination=${userLatitude},${userLongitude}&key=${directionsAPI}`
      );
      const dataToUser = await responseToUser.json();
      const timeToUser = dataToUser.routes[0].legs[0].duration.value; // Time in seconds

      const responseToDestination = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${userLatitude},${userLongitude}&destination=${destinationLatitude},${destinationLongitude}&key=${directionsAPI}`
      );
      const dataToDestination = await responseToDestination.json();
      const timeToDestination =
        dataToDestination.routes[0].legs[0].duration.value; // Time in seconds

      const totalTime = (timeToUser + timeToDestination) / 60; // Total time in minutes
      const price = (totalTime * 0.5).toFixed(2); // Calculate price based on time

      return { ...marker, time: totalTime, price };
    });

    return await Promise.all(timesPromises);
  } catch (error) {
    console.error("Error calculating driver times:", error);
  }
};
