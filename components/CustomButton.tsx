import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
}

/**
 * Get the background style based on the button variant.
 * @param {ButtonProps["bgVariant"]} variant - The button variant.
 * @returns {string} The CSS class for the background style.
 */
const getBgVariantStyle = (variant: ButtonProps["bgVariant"]) => {
  switch (variant) {
    case "secondary":
      return "bg-grey-500";
    case "danger":
      return "bg-red-500";
    case "success":
      return "bg-green-500";
    case "outline":
      return "bg-transparent border border-neutral-300 border-[0.5px]";
    default:
      return "bg-DolphinGray";
  }
};

/**
 * Get the text style based on the button variant.
 * @param {ButtonProps["textVariant"]} variant - The text variant.
 * @returns {string} The CSS class for the text style.
 */
const getTextVariantStyle = (variant: ButtonProps["textVariant"]) => {
  switch (variant) {
    case "primary":
      return "text-black";
    case "secondary":
      return "text-grey-100";
    case "danger":
      return "text-red-100";
    case "success":
      return "text-green-100";
    default:
      return "text-white";
  }
};

/**
 * CustomButton component for creating customizable buttons.
 *
 * @param {ButtonProps} props - The properties for the CustomButton component.
 * @param {Function} props.onPress - The function to be called when the button is pressed.
 * @param {string} props.title - The text to be displayed on the button.
 * @param {ButtonProps["bgVariant"]} [props.bgVariant="primary"] - The background variant of the button.
 * @param {ButtonProps["textVariant"]} [props.textVariant="default"] - The text color variant of the button.
 * @param {React.ComponentType<any>} [props.IconLeft] - The icon component to be displayed on the left side of the button text.
 * @param {React.ComponentType<any>} [props.IconRight] - The icon component to be displayed on the right side of the button text.
 * @param {string} [props.className] - Additional CSS classes to be applied to the button.
 * @returns {JSX.Element} A customized button component.
 */
export default function CustomButton({
  onPress,
  title,
  bgVariant = "primary",
  textVariant = "default",
  IconLeft,
  IconRight,
  className,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={` rounded-lg p-3 flex flex-row justify-center items-center shadow-md bg-primary-500 ${getBgVariantStyle(
        bgVariant
      )} ${className}`}
      {...props}
    >
      {/* icon left */}
      {IconLeft && <IconLeft />}

      {/* button text */}
      <Text
        className={`text-white text-lg font-bold ${getTextVariantStyle(
          textVariant
        )}`}
      >
        {title}
      </Text>

      {/* icon right */}
      {IconRight && <IconRight />}
    </TouchableOpacity>
  );
}
