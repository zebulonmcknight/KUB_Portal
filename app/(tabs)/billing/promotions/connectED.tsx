import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function ConnectED(){

   return(
      <View className="flex-1 justify-center">
         <Stack.Screen 
            options={{
               title: "Free KUB Fiber for K-12 Students", // Set the header title for this screen
               headerStyle: {
                  backgroundColor: '#3377F4', // Match the header background to active theme
               },
               headerShadowVisible: false, // Remove the shadow underneath header for seamless integration with background
            }}
         />
         <Text>
            Hello
         </Text>
      </View>
   );
}