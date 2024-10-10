import { useState } from "react";
import { View, Text, ScrollView, Image, Alert } from "react-native";
import { Link, router } from "expo-router";
import ReactNativeModal from "react-native-modal";

// import global styles to use the droidSafeArea style
import GlobalStyles from "@/scripts/GlobalStyles";

// import images/icons from constants
import { icons, images } from "@/constants";

// import custom components
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import OAuth from "@/components/OAuth";
import { fetchAPI } from "@/lib/fetch";

// import auth stuff
import { useSignUp } from "@clerk/clerk-expo";

const SignUp = () => {
  // auth stuff
  const { isLoaded, signUp, setActive } = useSignUp();

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
    // if the sign up is not loaded, exit the function
    if (!isLoaded) {
      return;
    }

    // try to create a new sign up with the values from the form
    try {
      await signUp.create({
        emailAddress: formValues.email,
        password: formValues.password,
      });

      // Send the email address verification code to the user's email address
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // set the pending verification state to 'pending' until the user verifies their email address
      setVerification({ ...Verification, state: "pending" });
    } catch (err: any) {
      // if there is an error, log it using Alert
      Alert.alert(err.errors[0].longMessage);
    }
  };

  // function to handle the email address verification
  const onPressVerify = async () => {
    // if the sign up is not loaded, exit the function
    if (!isLoaded) {
      return;
    }

    // try to verify the email address 'complete the SignUp'
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: Verification.code, // get the code from the verification state
      });

      // if the sign up is complete, set the active state to true and set the verification state to 'success'
      if (completeSignUp.status === "complete") {
        // add the user to our database (user+api.ts)
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: formValues.name,
            email: formValues.email,
            clerkId: completeSignUp.createdSessionId,
          }),
        });

        // set the active state to true
        await setActive({ session: completeSignUp.createdSessionId });

        // set the verification state to 'success'
        setVerification({ ...Verification, state: "success" });
      } else {
        // if there is an error, set the verification state to 'failed' and show the error message
        setVerification({
          ...Verification,
          state: "failed",
          error: "Verification failed, please try again.", // "client side error"
        });

        // console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      // if there is an error, set the verification state to 'failed' and show the error message
      setVerification({
        ...Verification,
        state: "failed",
        error: err.errors[0].longMessage, // "server side error (clerk error)"
      });
    }
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

          {/* OAuth container */}
          <OAuth />

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

      {/* modal for email verification (success) */}
      <ReactNativeModal isVisible={showSuccessModal}>
        {/* modal container */}
        <View className="bg-white px-8 py-9 rounded-lg min-h-[300px]">
          <Image
            source={images.check}
            className="w-[110px] h-[110px] mx-auto my-5"
          />
          <Text className="text-center text-3xl font-bold">Verified</Text>

          <Text className="text-base text-gray-400 font-JakartaSemiBold text-center mt-2">
            You have successfully verified your email address.
          </Text>

          <CustomButton
            title="Continue"
            className="mt-5"
            onPress={() => {
              setShowSuccessModal(false); // hide the success modal after the user clicks continue
              router.push("/(root)/(tabs)/home"); // redirect the user to the home screen
            }}
          />
        </View>
      </ReactNativeModal>

      {/* modal for email verification (pending) */}
      <ReactNativeModal
        isVisible={Verification.state === "pending"}
        onModalHide={() => {
          if (Verification.state === "success") {
            setShowSuccessModal(true); // show the success modal after the pending modal is dismissed
          }
        }}
      >
        {/* modal container */}
        <View className="bg-white px-7 py-9 rounded-lg min-h-[300px]">
          <Text className="text-2xl font-bold mb-2">Verification</Text>

          <Text className="text-base font-JakartaSemiBold mb-5">
            Verification code sent to {formValues.email}
          </Text>

          <InputField
            label="Code"
            placeholder="Enter the 6 digit code"
            icon={icons.lock}
            keyboardType="numeric"
            maxLength={6}
            value={Verification.code}
            onChangeText={(value) =>
              setVerification({ ...Verification, code: value })
            }
          />

          {/* if there is an error, show the error message */}
          {Verification.error && (
            <Text className="text-red-500 text-center mt-2">
              {Verification.error}
            </Text>
          )}

          <CustomButton
            title="Verify"
            className="mt-5 bg-success-500"
            onPress={onPressVerify}
          />
        </View>
      </ReactNativeModal>
    </ScrollView>
  );
};

export default SignUp;
