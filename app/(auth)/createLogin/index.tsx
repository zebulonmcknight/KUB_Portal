import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function CreateLogin() {
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
         }}
      />
      <Text className="text-text_main">Edit (auth)/createLogin/index.tsx to edit this screen.</Text>
    </View>
  );
}
