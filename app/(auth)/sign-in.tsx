import { useState, useCallback } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { Link, useRouter } from "expo-router";

// import global styles to use the droidSafeArea style
import GlobalStyles from "@/scripts/GlobalStyles";

// import images/icons from constants
import { icons, images } from "@/constants";

// import custom components
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
// import OAuth from "@/components/OAuth";

// import clerk functions
// import { useSignIn } from "@clerk/clerk-expo";

const SignIn = () => {
  // form values
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  // clerk functions
  // const { signIn, setActive, isLoaded } = useSignIn();

  // router to navigate to other pages
  const router = useRouter();

  // function to handle sign up
  const onSignInPress = useCallback(async () => {
    // if the clerk is not loaded, return
    if (!isLoaded) {
      return;
    }

    try {
      // create a sign in attempt with the email and password from the form values
      const signInAttempt = await signIn.create({
        identifier: formValues.email,
        password: formValues.password,
      });

      // if the sign in attempt is complete, set the active session and ...
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/(tabs)/home"); // redirect to the home page
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2)); // client side error
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2)); // server side error (clerk error)
    }
  }, [isLoaded, formValues.email, formValues.password]);

  return (
    <ScrollView className="flex-1 bg-white">
      {/* page container */}
      <View className="flex-1 bg-white">
        {/* car image container */}
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />

          <Text className="absolute bottom-10 left-5 text-2xl font-JakartaSemiBold text-black ">
            Welcome back 👋
          </Text>
        </View>

        {/* form container */}
        <View className="p-5">
          {/* email input field */}
          <InputField
            label="Email Address"
            placeholder="Enter your email address"
            icon={icons.email}
            value={formValues.email}
            onChangeText={
              (value) => setFormValues({ ...formValues, email: value }) // get the value of the input field then set it to the new formValues object
            }
          />

          {/* password input field */}
          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            value={formValues.password}
            onChangeText={
              (value) => setFormValues({ ...formValues, password: value }) // get the value of the input field then set it to the new formValues object
            }
            secureTextEntry={true}
          />

          {/* sign up button */}
          <CustomButton
            title="Sign In"
            onPress={onSignInPress}
            className="mt-6"
          />

          {/* OAuth container */}
          <OAuth />

          {/* sign up link */}
          <Link
            href="/sign-up"
            className="text-center text-lg font-JakartaSemiBold text-general-200 mt-10"
          >
            <Text>New to CarHub?</Text>
            <Text className="text-lg font-JakartaSemiBold text-primary-500">
              {" "}
              Sign Up
            </Text>
          </Link>
        </View>
      </View>

      {/* TODO:  modal  */}
    </ScrollView>
  );
};

export default SignIn;
