import { Redirect } from "expo-router";

export default function Index() {
  // this will always redirect to the welcome page
  return <Redirect href={"/(auth)/sign-in"} />;
}

// TODO: if the user is already logged in, redirect them to the home page else redirect them to the sign-in page
