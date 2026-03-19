import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NaturalGasFinancing(){

   return(
      <View className="flex-1 justify-center">
         <Stack.Screen 
            options={{
               title: "Natural Gas Water Heater Financing Available", // Set the header title for this screen
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