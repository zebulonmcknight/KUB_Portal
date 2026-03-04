import { Stack } from "expo-router";

export default function ProfileLayout() {
   return (
      <Stack>
         <Stack.Screen
            name="index"
            options={{
               headerTitle: "Profile",
               headerShown: true,
               headerStyle:{
                  backgroundColor: '#091C3C',
               },
               headerShadowVisible: false,
            }}
         />
      </Stack>
   )
}

