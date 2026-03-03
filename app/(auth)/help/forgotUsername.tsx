import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function ForgotUsername() {
  return (
    <View className="flex-1 justify-center">
      <Stack.Screen 
         options={{
            title: "Forgot Username", // Set the header title for this screen
            headerStyle: {
               backgroundColor: '#3377F4', // Match the header background to active theme
            },
            headerShadowVisible: false, // Remove the shadow underneath header for seamless integration with background
         }}
      />
      <View className="flex-1 justify-start left-4 pt-4">
        <Text className="text-text_main font-sans text-2xl tracking-wide p-4">
          Please enter your information:
        </Text>
        <View>
          
        </View>

        {/* Text box with 'Email Address' prefilled inactive color. When clicked the email address text becomes active and becomes part of the box */}
        {/* Under text box is inactive next button. Button becomes active when user types *@*.com [asterisk can be anything, works with just one letter] */}

      </View>
    </View>
  );
}
