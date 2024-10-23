// This file is used to make the types available to the app

import { TextInputProps, TouchableOpacityProps } from "react-native";

// Drivers as a marker
declare interface MarkerData {
  latitude: number;
  longitude: number;
  id: number;
  name: string;
  email: string;
  role: string;
  //TODO: status
}

// declare interface MarkerData {
//   latitude: number;
//   longitude: number;
//   title: string;
//   id: number;
//   //   profile_image_url: string;
//   //   car_image_url: string;
//   //   car_seats: number;
//   //   rating: number; // Keep it as number for better consistency
//   first_name: string;
//   last_name: string;
//   time?: number; // Keep optional if some drivers may not have it
//   //   price?: number; // Assuming price is numerical
// }

declare interface LocationStore {
  userLatitude: number | null;
  userLongitude: number | null;
  userAddress: string | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  destinationAddress: string | null;
  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

declare interface DriverStore {
  drivers: MarkerData[];
  selectedDriver: number | null;
  setSelectedDriver: (driverId: number) => void;
  setDrivers: (drivers: MarkerData[]) => void;
  clearSelectedDriver: () => void;
}
