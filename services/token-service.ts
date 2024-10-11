/**
 * @file token-service.ts is responsible for managing the user token.
 * @readonly: To store the token in the user session, I will use the expo-secure-store library.
 * This library provides a secure way to store sensitive information such as tokens, passwords,
 *  and other data.
 */

// import the SecureStore module from expo-secure-store
import * as SecureStore from "expo-secure-store";

// Initialize the token variable to store the token
let token: string | Promise<string | null> | null = null;

/**
 * Sets the token and stores it securely on the user's device.
 *
 * @param newToken - The new token to be set. If the token is not null, it will be stored securely.
 *                   If the token is null, it will be removed from the secure storage.
 * @returns A promise that resolves when the token has been set or removed from the secure storage.
 */
export async function setToken(newToken: string) {
  // Set the token in the token variable to be used globally
  token = newToken;

  if (token !== null) {
    // Store the token in the SecureStore (user device) as key-value pair
    await SecureStore.setItemAsync("token", token);
  } else {
    // Remove the token from the SecureStore (user device)
    await SecureStore.deleteItemAsync("token");
  }
}

/**
 * Retrieves the token from the SecureStore if it is not already set.
 *
 * @returns {Promise<string | null>} The token if it exists, otherwise null.
 */
export async function getToken(): Promise<string | null> {
  // Check if the token is already set
  if (token != null) {
    return token;
  }

  // Get the token from the SecureStore (user device)
  token = await SecureStore.getItemAsync("token");

  return token;
}
