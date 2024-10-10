// import { useRef, useState } from "react";
// import { Text, TouchableOpacity, View, Image } from "react-native";
// import { router } from "expo-router";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Swiper from "react-native-swiper";

// // Global styles for android and ios about the safe area "paddingTop"
// import GlobalStyles from "../../scripts/GlobalStyles";

// // import the onboarding data from the constants folder
// import { OnboardingData } from "@/constants";

// // import the CustomButton component
// import CustomButton from "@/components/CustomButton";

// const Onboarding = () => {
//   // swiper data,
//   // useRef is a hook that allows you to access the DOM element directly
//   const swiperRef = useRef<Swiper>(null);

//   const [activeIndex, setActiveIndex] = useState(0);

//   // return true if its the last slide
//   const isLastSlide = activeIndex === OnboardingData.length - 1;

//   return (
//     <SafeAreaView
//       style={GlobalStyles.droidSafeArea}
//       className="flex h-full items-center justify-between"
//     >
//       {/* Skip button */}
//       <TouchableOpacity
//         className="w-full flex justify-end items-end p-5"
//         onPress={() => {
//           router.replace("/(auth)/sign-up");
//         }}
//       >
//         <Text className="text-black text-base font-bold">Skip</Text>
//       </TouchableOpacity>

//       {/* Swiper 'Onboarding' screens */}
//       <Swiper
//         ref={swiperRef}
//         loop={false}
//         dot={<View className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0]" />}
//         activeDot={
//           <View className="w-[32px] h-[4px] mx-1 bg-[#0286ff] rounded-full" />
//         }
//         onIndexChanged={(index) => setActiveIndex(index)}
//       >
//         {OnboardingData.map((item) => {
//           return (
//             // Onboarding screen container
//             <View
//               key={item.id}
//               className="flex items-center justify-center p-5"
//             >
//               <Image
//                 source={item.image}
//                 className="w-full h-[300px]"
//                 resizeMode="contain"
//               />

//               {/* Title container */}
//               <View className="flex flex-row items-center justify-center w-full mt-10">
//                 <Text className="text-black text-3xl font-bold mx-10 text-center">
//                   {item.title}
//                 </Text>
//               </View>

//               {/* Description container */}
//               <Text className="text-[#858585] text-lg font-JakartaSemiBold text-center mx-10 mt-3">
//                 {item.description}
//               </Text>
//             </View>
//           );
//         })}
//       </Swiper>

//       {/* Next button */}
//       <CustomButton
//         title={isLastSlide ? "Get Started" : "Next"}
//         onPress={() => {
//           if (isLastSlide) {
//             router.replace("/(auth)/sign-up");
//           } else {
//             swiperRef.current?.scrollBy(1);
//           }
//         }}
//         className={"w-11/12 mt-10 mb-3"}
//       />
//     </SafeAreaView>
//   );
// };

// export default Onboarding;
