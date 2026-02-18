import { Stack } from "expo-router";

export default function OutagesLayout() {
   return (
      <Stack>
         <Stack.Screen
            name="index"
            options={{
               headerTitle: "Outages",
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

