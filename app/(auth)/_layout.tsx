import { Stack } from "expo-router";

export default function AuthLayout() {
   return (
      <Stack
         initialRouteName="login/index"
         screenOptions={{
            headerStyle: {
               backgroundColor: '#091C3C', // Match the header background to the app's theme
            },
            headerShadowVisible: false, // Remove the shadow underneath header for seamless integration with background
            headerShown: true, // Hide the header
         }}
      >
      </Stack>
   )
}

