import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { Image, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {

  const router = useRouter();
  const { height, width } = useWindowDimensions();

  const handleLogin = async () => {
    const token_expiry = await SecureStore.getItemAsync('token_expiry');
    const access_token = await SecureStore.getItemAsync('access_token');

    // If valid token exists dont prompt user to enter login information
    if( token_expiry && access_token  && (Date.now() < parseInt(token_expiry)) ){
      router.navigate("/(tabs)/billing");
      return;
    }
    router.navigate("/(auth)/login/credentials"); // Otherwise prompt
  }

  return (
    
    // Parent view container to contain background mountain image as well as all of the buttons for the login screen
    <SafeAreaView className="flex-1 bg-primary">
      <Stack.Screen 
        options={{ headerShown: false, title: "Login" }} // Hide the header on the login screen for a cleaner look
      />

      {/* Get the image to take up 60% of screen and use absolute so that it doesnt affect other components. Doing 60% to blend image into background */}
      <Image 
        source={require("@/assets/images/mountains.jpg")}
        resizeMode="cover" // Will zoom in the image until it fits that specified size (60% in our case).
        className="absolute top-0 w-full h-[60%]"
        style={{
          transform: [{ translateY: -height * .12 }]
        }}
      />

      {/* Add a gradient to same area that image takes up. This helps blend the image to the primary background. */}
      <LinearGradient
        colors={ ["rgba(73, 130, 228, 0.3)", "#091C3C"] }
        locations={[0, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: .8 }}
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '60%',
        }}
      />

      {/* This view is in charge of the KUB logo as well as setting up the button/version text */}
      <View className="flex-1 justify-center">

        {/* Make it absolute so that it doesnt affect the other components */}
        <View className="absolute self-center" style={{ top: height * 0.18 }}>
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

        <TouchableOpacity onPress={() => handleLogin()}
          className="bg-active_icon rounded-xl justify-center items-center py-3.5 mx-6"
        >
          <Text allowFontScaling={false} className="text-text_main text-lg font-semibold tracking-wide w-full text-center">LOGIN</Text>
        </TouchableOpacity>
        
        {/* For the links under the login button */}
        {/* Using router.navigate here so it adds to stack and back button appears */}
        <View className="flex-row mt-8 justify-between" style={{paddingHorizontal: width * .12}}>
          <TouchableOpacity onPress={() => router.navigate("/(auth)/help")}>
            <Text allowFontScaling={false} className="text-active_icon text-lg font-semibold tracking-wide w-full text-center">NEED HELP?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.navigate("/(auth)/createLogin")}>
            <Text allowFontScaling={false} className="text-active_icon text-lg font-semibold tracking-wide w-full text-center">CREATE LOGIN</Text>
          </TouchableOpacity>
        </View>
        <View className="absolute bottom-10 items-center w-full">
          <Text allowFontScaling={false} className="text-text_main font-semibold tracking-wide w-full text-center">
            v1.0.0
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
