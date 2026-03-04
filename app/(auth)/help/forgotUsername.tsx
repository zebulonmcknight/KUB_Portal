import FloatingInput from "@/components/floatingInput";
import { Stack } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function ForgotUsername() {

  // This is used to track what the user is typing
  const [email, setEmail] = useState("");

  // REGEX to check whether the user typed something we consider valid email format
  // Checks: "1 or more characters" @ "1 or more characters" . "1 or more characters"
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
      <View className="flex-1 justify-start px-6 pt-4">
        <Text className="text-text_main font-sans text-2xl tracking-wide pt-4 pb-4 w-full">
          Please enter your information:
        </Text>
        
        <FloatingInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboard="email-address"
        />

        <TouchableOpacity
          disabled={!validEmail}
          className={`mt-6 rounded-xl items-center ${
            validEmail ? 'bg-[#3377F4]' : 'bg-[#3377F4]/50'
          }`}
          onPress={() => console.log("Email entered send username")}
        >
          <Text className="text-text_main font-bold tracking-widest w-full text-center text-lg p-3">
            NEXT
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
