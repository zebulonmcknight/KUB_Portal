import { Stack, useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Login() {

  const router = useRouter();
  
  const handleLogin = () => {
    // Basic login simlation
    router.replace("/(tabs)/billing"); // Redirect to billing screen after login
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Stack.Screen 
         options={{
            headerShown: false, // Hide the header on the login screen for a cleaner look
            headerShadowVisible: false, // Remove the shadow underneath header for seamless integration with background
         }}
      />

      <TouchableOpacity onPress={handleLogin}
        className="bg-active_icon rounded-xl justify-center items-center py-4 mx-6"
      >
        <Text className="text-text_main text-lg font-semibold tracking-wider">LOGIN</Text>
      </TouchableOpacity>
      
      {/* For the links under the login button */}
      {/* Using router.push here so it adds to stack and back button appears */}
      <View className="justify-center flex-row mt-8 px-2 gap-x-20">
        <TouchableOpacity onPress={() => router.push("/(auth)/help")}>
          <Text className="text-active_icon text-lg font-semibold tracking-wider">NEED HELP?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(auth)/createLogin")}>
          <Text className="text-active_icon text-lg font-semibold tracking-wider">CREATE LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
