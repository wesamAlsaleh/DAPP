import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  Platform,
  Keyboard,
  TextInputProps,
} from "react-native";

declare interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
}

export default function CustomInputField({
  label,
  placeholder,
  icon,
  value,
  onChangeText,
  secureTextEntry = false, // default value is false (true if password, etc)
  labelStyle, // additional styles for the label
  containerStyle, // additional styles for the input field container (contain the icon and the text input)
  inputStyle, // additional styles for the input field
  iconStyle, // additional styles for the icon image(icon is optional)
  className, // not used yet
  ...props
}: InputFieldProps) {
  return (
    <KeyboardAvoidingView
      // if the platform is ios, use padding, if not, use height
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* dismiss the keyboard when the user clicks outside the input field */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {/* form container */}
        <View className="my-2 w-full">
          {/* label */}
          <Text className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle}`}>
            {label}
          </Text>

          {/* input field container */}
          <View
            className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-lg border border-neutral-100 focus:border-DeepTaupe ${containerStyle}`}
          >
            {/* icon */}
            {icon && (
              <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />
            )}

            {/* text input field */}
            <TextInput
              className={`rounded-full p-4 font-JakartaSemiBold text-[15px] flex-1 text-left ${inputStyle}`}
              secureTextEntry={secureTextEntry}
              placeholder={placeholder}
              value={value}
              onChangeText={onChangeText}
              {...props} // pass down the props to the text input field "React best practice"
            ></TextInput>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
