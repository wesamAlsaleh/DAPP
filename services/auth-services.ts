// import axios to make api requests
import axios from "axios";

// import token service functions to store and retrieve the token from the secure store (user device)
import { getToken, setToken } from "./token-service";

// import the User interface type from the types folder
import { User } from "@/types/user";

const API_BASE_URL = process.env.EXPO_PUBLIC_URL;

/**
 *  Registers a new user with the provided name, email and password.
 */
export async function register(name: string, email: string, password: string) {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/register`,
      {
        name: name,
        email: email,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ); // get the token from the response!

    // if the response contains a token then store it
    if (data.token) {
      const token = data.token;
      await setToken(token);
    }
  } catch (error) {
    console.error("Registration failed:", error);

    // Optionally, you can throw the error to be handled elsewhere
    throw error;
  }
}

/**
 * Logs in a user with the provided email and password.
 * Sends a POST request to the login API endpoint and retrieves an authentication token.
 * The token is then stored securely.
 *
 * @param email - The email address of the user.
 * @param password - The password of the user.
 * @returns A promise that resolves when the token has been successfully stored.
 */
export async function login(email: string, password: string) {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/login`,
      {
        email: email,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ); // get the token from the response!

    // if the response contains a token then store it
    if (data.token) {
      const token = data.token;
      await setToken(token);
    }
  } catch (error) {
    console.error("Login service failed 🔴");

    // Optionally, you can throw the error to be handled elsewhere
    throw error;
  }
}

/**
 * Asynchronously loads the user data from the API.
 *
 * This function retrieves the user token from the secure store and uses it to
 * make an authenticated request to the API endpoint to fetch the user data.
 *
 * @returns {Promise<User>} A promise that resolves to the user data.
 *
 * @throws {Error} If the request fails or the token is invalid.
 */
export async function loadUser(): Promise<User> {
  try {
    // get the user token from the secure store
    const token = await getToken();

    if (!token) {
      throw new Error("No token available");
    }

    const { data: user } = await axios.get(`${API_BASE_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // log the user data to the console
    // console.log("User data:", user);
    /**
     * {
     * "created_at": "2024-10-13T16:30:08.000000Z",
     *  "email": "wesam@gmail.com",
     *  "email_verified_at": null,
     *  "id": 1,
     *  "name": "DevWesam",
     *  "role": "driver",
     *  "updated_at": "2024-10-13T16:30:08.000000Z"
     * }
     */

    // return the user data
    return user;
  } catch (error) {
    throw console.log("No token found to load user");
  }
}

/**
 * Logs out the current user by performing the following steps:
 * 1. Retrieves the user token from the secure store.
 * 2. Sends a POST request to the logout endpoint with the token in the Authorization header.
 * 3. Removes the token from the secure store.
 *
 * @async
 * @function
 * @returns {Promise<void>} A promise that resolves when the logout process is complete.
 */
export async function logout() {
  try {
    // get the user token from the secure store
    const token = await getToken();

    // send a POST request to the logout endpoint
    await axios.post(
      `${API_BASE_URL}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // remove the token from the secure store
    await setToken("NULL");
  } catch (error) {
    console.error("Logout failed:", error);
    // Even if logout fails, ensure the token is removed to prevent unauthorized access
    await setToken("NULL");
    throw error;
  }
}
