import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {

  const router = useRouter();

  return (

    // Parent view container to contain background mountain image as well as all of the buttons for the login screen
    <SafeAreaView className="flex-1 bg-primary">

      {/* Get the image to take up 60% of screen and use absolute so that it doesnt affect other components. Doing 60% to blend image into background */}
      <Image 
        source={require("@/assets/images/mountains.png")}
        resizeMode="cover" // Will zoom in the image until it fits that specified size (60% in our case).
        className="absolute top-0 w-full h-[60%]"
        style={{
          transform: [{ translateY: -110 }] // Basically cropping the image to get rid of some of the sky here.
        }}
      />

      {/* Add a gradient to same area that image takes up. This helps blend the image to the primary background. */}
      <LinearGradient
        colors={ ["rgba(73, 130, 228, 0.3)", "#091C3C"] }
        end={[0.7, 0.7]}
        className="absolute top-0 w-full h-[60%]"
      />

      {/* This view is in charge of the KUB logo as well as setting up the button/version text */}
      <View className="flex-1 justify-center">
        <Stack.Screen 
          options={{
              headerShown: false, // Hide the header on the login screen for a cleaner look
              headerShadowVisible: false, // Remove the shadow underneath header for seamless integration with background
          }}
        />

        {/* Make it absolute so that it doesnt affect the other components */}
        <View className="absolute top-40 self-center">
          <Image 
            source={require("@/assets/images/kub-transparent-bg.png")} 
            style={{ 
              width: 200, 
              height: 140, 
              tintColor: '#FFFFFF'
            }}
            resizeMode="contain"
          />
      </View>

        <TouchableOpacity onPress={() => router.push("/(auth)/login/credentials")}
          className="bg-active_icon rounded-xl justify-center items-center py-3.5 mx-6"
        >
          <Text className="text-text_main text-lg font-semibold tracking-wide w-full text-center">LOGIN</Text>
        </TouchableOpacity>
        
        {/* For the links under the login button */}
        {/* Using router.push here so it adds to stack and back button appears */}
        <View className="flex-row mt-8 justify-between px-16">
          <TouchableOpacity onPress={() => router.push("/(auth)/help")}>
            <Text className="text-active_icon text-lg font-semibold tracking-wide w-full text-center">NEED HELP?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/(auth)/createLogin")}>
            <Text className="text-active_icon text-lg font-semibold tracking-wide w-full text-center">CREATE LOGIN</Text>
          </TouchableOpacity>
        </View>
        <View className="absolute bottom-10 items-center w-full">
          <Text className="text-text_main font-semibold tracking-wide w-full text-center">
            v1.0.0
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
