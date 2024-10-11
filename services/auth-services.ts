// import axios to make api requests
import axios from "axios";

// import token service functions to store and retrieve the token from the secure store (user device)
import { getToken, setToken } from "./token-service";

const API_BASE_URL = "http://127.0.0.1:8000/api"; // Update this as needed

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
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
  const { data } = await axios.post(
    `${API_BASE_URL}/login`,
    {
      email: email,
      password: password,
    },
    {
      headers: {
        "Content-Type": "application/vnd.api+json",
      },
    }
  ); // get the token from the response!

  // get the token from the response
  const token = data.token;

  // store the token in the secure store
  await setToken(token);
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
  // get the user token from the secure store
  const token = await getToken();

  const { data: user } = await axios.get(`${API_BASE_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // return the user data
  return user;
}