import CustomAlert from "@/components/customAlert";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack } from "expo-router";
import { useState } from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";

export default function CreateLogin() {

  const [showAlert, setShowAlert] = useState(false); // State to control the visibility of the custom alert

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack.Screen 
         options={{
            title: "Create Login", // Set the header title for this screen
            headerStyle: {
               backgroundColor: '#3377F4', // Match the header background to active theme
            },
            headerShadowVisible: false, // Remove the shadow underneath header for seamless integration with background
            headerRight: () => (
              // Have to use actual button here and not custom modal as react native can't process custom modal in header. Using this as an 'activator' of sorts
              <TouchableOpacity onPress={() => setShowAlert(true)}> 
                <MaterialIcons name="info" size={24} color="white"/>
              </TouchableOpacity>
            )
         }}
      />
      <Text className="text-text_main">Edit (auth)/createLogin/index.tsx to edit this screen.</Text>

      {/* Alert shows based on whether its activated based on the button being pressed */}
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
  );
}
