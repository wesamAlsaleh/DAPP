// This file is used to make the types available to the app

import { TextInputProps, TouchableOpacityProps } from "react-native";

// import User interface
import { User } from "./user";

/*
User data
{
  "id": 2,
  "name": "Terry Ali",
  "email": "hwunsch@example.org",
  "email_verified_at": "2024-10-23T19:26:05.000000Z",
  "role": "driver",
  "status": "busy",
  "latitude": "48.6478110",
  "longitude": "-8.9138260",
  "created_at": "2024-10-23T19:26:05.000000Z",
  "updated_at": "2024-10-23T19:26:05.000000Z"
}
*/

declare interface MapProps {
  drivers: User[]; // Define the prop type
}

declare interface MarkerData extends User {
  latitude: number;
  longitude: number;
  id: number;
  name: string;
  email: string;
  role: string;
  status: "available" | "offline" | "busy";
  created_at?: string;
  updated_at?: string;
}

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
