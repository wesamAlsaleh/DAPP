import { Redirect } from "expo-router";

export default function Index() {
  // this will always redirect to the welcome page
  return <Redirect href={"/(auth)/sign-in"} />;
}
