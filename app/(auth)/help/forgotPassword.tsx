import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function ForgotPassword() {
  return (
    <View className="flex-1 justify-center items-center">
      <Stack.Screen 
         options={{
            title: "Forgot Password", // Set the header title for this screen
            headerStyle: {
               backgroundColor: '#3377F4', // Match the header background to active theme
            },
            headerShadowVisible: false, // Remove the shadow underneath header for seamless integration with background
         }}
      />
      <Text className="text-text_main">Edit (auth)/help/forgotPassword.tsx to edit this screen.</Text>
    </View>
  );
}
