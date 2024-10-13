import { createContext, Dispatch, SetStateAction, useContext } from "react";

// import the User interface type from the types folder
import { User } from "@/types/user";

// create an interface for the AuthContext
interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

// create a context to store the user data and the setUser function
const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  setLoading: () => {},
});

// export a custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
