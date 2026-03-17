import CustomAlert from '@/components/customAlert';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, useRouter } from "expo-router";
import { useState } from 'react';
import { Linking, Text, TouchableOpacity, View } from "react-native";

export default function Help() {

  const router = useRouter(); // Get the router object to enable navigation

  const [showAlert, setShowAlert] = useState(false); // State to control the visibility of the custom alert
  
  return (
    <View className="flex-1 justify-center items-center">
      <Stack.Screen 
         options={{
            title: "Need Help?", // Set the header title for this screen
            headerStyle: {
               backgroundColor: '#3377F4', // Match the header background to active theme
            },
            headerShadowVisible: false, // Remove the shadow underneath header for seamless integration with background
         }}
      />
      {/* Buttons that lead to the nested pages */}
      <View className="flex-1 justify-start left-4 pt-4">
        <Text className="text-text_main font-sans text-2xl tracking-wide p-4">
          Which issue are you experiencing?
        </Text>
        <View className="w-full pt-8">
          <TouchableOpacity onPress={() => router.push("/(auth)/help/forgotPassword")} className="border-b border-section p-4">
            <Text className="text-text_main bg-primary font-sans text-xl tracking-wide">
              I can't remember my password.
            </Text>
          </TouchableOpacity>

          {/* Need a seperate view as these are separate buttons that appear on the same line */}
          <View className="flex-row justify-between border-b border-section">
            <TouchableOpacity onPress={() => router.push("/(auth)/createLogin")} className="flex-1 p-4">
              <Text className="text-text_main bg-primary font-sans text-xl tracking-wide">
                I need to create a login.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowAlert(true)} className="p-4 mx-6">
              <MaterialIcons name="info" size={24} color="white"/>
            </TouchableOpacity>

            <CustomAlert
              message={
                <Text>
                  You must already have an active account with Knoxville Utilities Board before signing up to use our online services. If you are not yet a KUB customer, please visit{' '}
                  <Text onPress={ () => Linking.openURL("https://www.kub.org/start-stop-service")} className="underline">
                    www.kub.org/start-stop-service
                  </Text>
                  {' '}to get started.
                </Text>
              }
                visible={showAlert}
              onClose={() => setShowAlert(false)}
            />
          </View>

          <TouchableOpacity onPress={() => router.push("/(auth)/help/startService")} className="border-b border-section p-4">
            <Text className="text-text_main bg-primary font-sans text-xl tracking-wide">
              I want to start a service, but I'm not an existing customer.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/(auth)/help/deleteAccount")} className="border-b border-section p-4">
            <Text className="text-text_main bg-primary font-sans text-xl tracking-wide">
              I want to delete my online KUB account.
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
