import { useState, useCallback } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { Link, useRouter } from "expo-router";

// import global styles to use the droidSafeArea style
import GlobalStyles from "@/scripts/GlobalStyles";

// import images/icons from constants
import { icons, images } from "@/constants";

// import custom components
import InputField from "@/components/CustomInputField";
import CustomButton from "@/components/CustomButton";

const SignIn = () => {
  // form values
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  // router to navigate to other pages
  const router = useRouter();

  // function to handle sign up
  const onSignInPress = useCallback(async () => {
    console.log(formValues);
    try {
    } catch (err: any) {}
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

          {/* sign up button */}
          <CustomButton
            title="Sign In"
            onPress={onSignInPress}
            className="mt-6"
          />

          {/* TODO: sign up link if there is client purposes */}
          {/* <Link
            href="/sign-up"
            className="text-center text-lg font-JakartaSemiBold text-general-200 mt-10"
          >
            <Text>New to DAPP?</Text>
            <Text className="text-lg font-JakartaSemiBold text-primary-500">
              {" "}
              Sign Up
            </Text>
          </Link> */}
        </View>
      </View>

      {/* TODO:  modal after success  */}
    </ScrollView>
  );
};

export default SignIn;
