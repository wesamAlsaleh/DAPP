import { useState, useCallback, useContext } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { Link, useRouter } from "expo-router";

// import global styles to use the droidSafeArea style
import GlobalStyles from "@/scripts/GlobalStyles";

// import images/icons from constants
import { icons, images } from "@/constants";

// import custom components
import InputField from "@/components/CustomInputField";
import CustomButton from "@/components/CustomButton";

// import auth services from services folder
import { login, loadUser } from "@/services/auth-services";
import AuthContext from "@/contexts/AuthContext";

const SignIn = () => {
  // form values
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  // TODO: Error state
  const [error, setError] = useState({ message: "" });

  // router to navigate to other pages
  const router = useRouter();

  // update the context with the user data
  const { setUser } = useContext(AuthContext);

  // function to handle sign up
  const onSignInPress = useCallback(async () => {
    // console.log(formValues);

    try {
      // Login the user using the email and password
      await login(formValues.email, formValues.password); // this function will put the user token in the secure store

      // Load the user data
      const user = await loadUser();

      // Set the user in the context
      setUser(user);

      // After the user is logged in, route to the home page
      router.push("/(root)/(tabs)/home");
    } catch (error) {
      setError({
        message:
          "* An unexpected error occurred. Please check your email and password.",
      });
    }
  }, [formValues.email, formValues.password]);

  return (
    <ScrollView className="flex-1 bg-white">
      {/* page container */}
      <View className="flex-1 bg-white">
        {/* car image container */}
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />

          <Text className="absolute bottom-10 left-5 text-2xl font-JakartaSemiBold text-black ">
            DAPP Sign In
          </Text>
        </View>

        {/* form container */}
        <View className="p-5 flex justify-center">
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

          {/* error message */}
          <Text className="text-red-500 text-sm mt-2 text-start font-bold">
            {error.message}
          </Text>

          {/* sign up button */}
          <CustomButton
            title="Sign In"
            onPress={onSignInPress}
            className="mt-6"
            bgVariant="primary2"
          />

          {/* sign up link */}
          <Link
            href="/sign-up"
            className="text-center text-lg font-JakartaSemiBold text-general-200 mt-10"
          >
            <Text>New to DAPP?</Text>
            <Text className="text-lg font-JakartaSemiBold text-primary-600">
              {" "}
              Sign Up
            </Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
