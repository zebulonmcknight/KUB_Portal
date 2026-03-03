import { Stack } from "expo-router";
import { Linking, Pressable, Text, TouchableOpacity, View } from "react-native";

export default function StartService() {
  return (
    <View className="flex-1 justify-center items-center">
      <Stack.Screen 
         options={{
            title: "Start Service", // Set the header title for this screen
            headerStyle: {
               backgroundColor: '#3377F4', // Match the header background to active theme
            },
            headerShadowVisible: false, // Remove the shadow underneath header for seamless integration with background
         }}
      />
      <View className="justify-start pt-4">
        <Text className="text-text_main font-sans text-2xl tracking-wide px-6 pt-4 pb-6">
          Start service easily and quickly.
        </Text>

         {/* a n/ contact n/ */}
        <Text className="text-text_main font-sans text-xl tracking-tighter px-6 pb-4"> 
          In-app registration coming soon. To register a new account, continue to KUB.org or contact customer support.
        </Text>
      </View>

      <View className="flex-1 w-full pt-10">
        {/* Redirects user to website so they can create their account. */}
        <TouchableOpacity onPress={() => Linking.openURL("https://www.kub.org/start-stop-service")} className="bg-active_icon rounded-xl justify-center items-center py-3.5 mx-6">
          <Text className="text-text_main font-bold text-lg tracking-wider px-1">
            OPEN KUB.ORG
          </Text>
        </TouchableOpacity>

         {/* Button to open the phone dialer pre-filled with KUB number */}
        <Pressable onPress={() => Linking.openURL(`tel:${8655242911}`)} className= "rounded-xl justify-center items-center py-3.5 mx-6 my-2">
          <Text className="text-active_icon font-bold text-lg tracking-wider px-1">
            CALL 865-524-2911
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
