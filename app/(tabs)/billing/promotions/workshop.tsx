import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function Workshop(){

   return(
      <View className="flex-1 justify-center">
         <Stack.Screen 
            options={{
               title: "Savings Workshops for Customers of All Ages", // Set the header title for this screen
               headerStyle: {
                  backgroundColor: '#3377F4', // Match the header background to active theme
               },
               headerShadowVisible: false, // Remove the shadow underneath header for seamless integration with background
               headerTitleStyle: {
                  fontFamily: 'Inter_400Regular'
               },
            }}
         />
         <Text>
            Hello
         </Text>
      </View>
   );
}