// import axios to make api requests
import axios from "axios";

/**
 * Logs in a user with the provided email and password.
 *
 * This function sends a POST request to the login API endpoint with the user's
 * email and password. Upon successful login, it retrieves the authentication token
 * from the response. It then uses this token to make a GET request to fetch the
 * user's details.
 *
 * @param email - The email address of the user.
 * @param password - The password of the user.
 * @returns A promise that resolves to the user data.
 * @throws Will throw an error if the login or user data retrieval fails.
 */
export async function login(email: string, password: string) {
  const { data } = await axios.post(
    `http://127.0.0.1:8000/api/login`,
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

  // return the user data to the component
  return data;
}

export async function loadUser(token: string) {}
