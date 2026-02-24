import { Stack, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Help() {
   const router = useRouter(); // Get the router object to enable navigation
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
            title: "Need Help?", // Set the header title for this screen
            headerStyle: {
               backgroundColor: '#3377F4', // Match the header background to active theme
            },
            headerShadowVisible: false, // Remove the shadow underneath header for seamless integration with background
         }}
      />
      <TouchableOpacity 
        onPress={() => router.replace("/(auth)/login")}
        className="bg-section p-4 rounded-xl w-full items-center mb-4"
      >
        <Text className="text-text_main font-bold">Go Back to Login</Text>
      </TouchableOpacity>
      <Text className="text-text_main">Edit (auth)/help/index.tsx to edit this screen!</Text>
    </View>
  );
}
