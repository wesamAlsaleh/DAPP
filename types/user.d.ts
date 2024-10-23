// create an interface for the user data
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "available" | "offline" | "busy"; // New field for user status
  latitude: number | null; // New field for user's latitude
  longitude: number | null; // New field for user's longitude
  created_at: string;
  updated_at: string;
}

export { User };
