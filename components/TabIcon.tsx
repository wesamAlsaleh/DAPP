import { View, Image, ImageSourcePropType } from "react-native";

/**
 * TabIcon component displays an icon for a tab in a navigation bar.
 *
 * @param {Object} props - The component props
 * @param {boolean} props.focused - Indicates if the tab is currently focused
 * @param {ImageSourcePropType} props.src - The source of the icon image
 * @returns {JSX.Element} A view containing the tab icon
 *
 * @example
 * <TabIcon focused={true} src={require('../assets/icons/home.png')} />
 */
const TabIcon = ({
  focused,
  src,
}: {
  focused: boolean;
  src: ImageSourcePropType;
}): JSX.Element => {
  return (
    //Name and icon container
    <View
      className={`flex flex-row items-center justify-center ${
        focused ? "bg-general-300" : ""
      }`}
    >
      {/* icon container "inner view" */}
      <View
        className={`rounded-full w-12 h-12 items-center justify-center ${
          focused ? "bg-general-400" : ""
        }`}
      >
        {/* icon it self */}
        <Image
          source={src}
          tintColor={"white"}
          resizeMode="contain"
          className="w-7 h-7"
        />
      </View>
    </View>
  );
};

export default TabIcon;
