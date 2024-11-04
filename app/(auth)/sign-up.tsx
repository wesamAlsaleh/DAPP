import { useState } from "react";
import { View, Text, ScrollView, Image, Alert } from "react-native";
import { Link, router } from "expo-router";

// import images/icons from constants
import { icons, images } from "@/constants";

// import custom components
import InputField from "@/components/CustomInputField";
import CustomButton from "@/components/CustomButton";

// import auth services from services folder
import { loadUser, register } from "@/services/auth-services";

// import auth context
import { useAuth } from "@/contexts/AuthContext";

const SignUp = () => {
  // form values
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  // TODO: show success modal state
  const [showMessage, setShowMessage] = useState(false);

  const { setUser } = useAuth();

  // function to handle sign up
  const onSignUpPress = async () => {
    try {
      // Login the user using the email and password
      await register(formValues.name, formValues.email, formValues.password); // this function will put the user token in the secure store

      // Load the user data
      const user = await loadUser();

      // Set the user in the context
      setUser(user);

      // After the user is logged in, route to the home page
      router.push("/(root)/(tabs)/home");
    } catch (error) {
      console.error("Failed to sign in:", error);
    }
  };

  // TODO: if there is time a function to handle the email address verification
  const onPressVerify = async () => {
    try {
    } catch (err: any) {}
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* page container */}
      <View className="flex-1 bg-white">
        {/* car image container */}
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />

          <Text className="absolute bottom-10 left-5 text-2xl font-JakartaSemiBold text-black ">
            Create your account
          </Text>
        </View>

        {/* form container */}
        <View className="p-5">
          {/* name input field */}
          <InputField
            label="Name"
            // labelStyle="text-base"
            placeholder="Enter your name"
            icon={icons.person}
            value={formValues.name}
            onChangeText={
              (value) => setFormValues({ ...formValues, name: value }) // get the value of the input field then set it to the new formValues object
            }
          />

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
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-6"
          />

          {/* Have an account? Sign in */}
          <Link
            href="/sign-in"
            className="text-center text-lg font-JakartaSemiBold text-general-200 mt-10"
          >
            <Text>Have an account?</Text>
            <Text className="text-lg font-JakartaSemiBold text-primary-500">
              {" "}
              Sign in
            </Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;
