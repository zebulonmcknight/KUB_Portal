import { Stack } from "expo-router";

export default function AuthLayout() {
   return (
      <Stack initialRouteName="login/index">
         <Stack.Screen name="createLogin" options={{ headerShown: false }} />
      </Stack>
   )
}

