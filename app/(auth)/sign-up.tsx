import { useState } from "react";
import { View, Text, ScrollView, Image, Alert } from "react-native";
import { Link, router } from "expo-router";
// import ReactNativeModal from "react-native-modal";

// import global styles to use the droidSafeArea style
import GlobalStyles from "@/scripts/GlobalStyles";

// import images/icons from constants
import { icons, images } from "@/constants";

// import custom components
import InputField from "@/components/CustomInputField";
import CustomButton from "@/components/CustomButton";

const SignUp = () => {
  // form values
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  // verification state for email address verification
  const [Verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  // show success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // function to handle sign up
  const onSignUpPress = async () => {
    console.log(formValues);

    try {
    } catch (err: any) {
      // if there is an error, log it using Alert
      Alert.alert(err.errors[0].longMessage);
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
