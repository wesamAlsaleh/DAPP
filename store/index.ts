import { create } from "zustand";

// import the custom types from the types/type.ts file
import { DriverStore, LocationStore, MarkerData } from "@/types/types";

/**
 * Creates a Zustand store for managing location-related state.
 *
 * @returns {LocationStore} The location store with state and actions.
 */
export const useLocationStore = create<LocationStore>((set) => ({
  // State variables for user location
  userAddress: null,
  userLongitude: null,
  userLatitude: null,

  // State variables for destination location
  destinationLatitude: null,
  destinationLongitude: null,
  destinationAddress: null,

  /**
   * Sets the user's location in the store.
   *
   * @param {Object} location - The user's location details.
   * @param {number} location.latitude - The latitude of the user's location.
   * @param {number} location.longitude - The longitude of the user's location.
   * @param {string} location.address - The address of the user's location.
   */
  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
    }));
  },

  /**
   * Sets the destination location in the store.
   *
   * @param {Object} location - The destination location details.
   * @param {number} location.latitude - The latitude of the destination.
   * @param {number} location.longitude - The longitude of the destination.
   * @param {string} location.address - The address of the destination.
   */
  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      destinationLatitude: latitude,
      destinationLongitude: longitude,
      destinationAddress: address,
    }));
  },
}));

/**
 * Creates a Zustand store for managing driver-related state.
 *
 * @returns {DriverStore} The driver store with state and actions.
 */
export const useDriverStore = create<DriverStore>((set) => ({
  drivers: [] as MarkerData[], // State variable for drivers
  selectedDriver: null, // State variable for selected driver
  /**
   * Sets the list of drivers.
   *
   * @param {MarkerData[]} drivers - The array of driver data.
   */
  setDrivers: (drivers: MarkerData[]) => set(() => ({ drivers: drivers })),

  /**
   * Sets the selected driver by ID.
   *
   * @param {number} driveId - The ID of the driver to select.
   */
  setSelectedDriver: (driveId: number) =>
    set(() => ({ selectedDriver: driveId })),

  /**
   * Clears the selected driver.
   */
  clearSelectedDriver: () => set(() => ({ selectedDriver: null })),
}));
