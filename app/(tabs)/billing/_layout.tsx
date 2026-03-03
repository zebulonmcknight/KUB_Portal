import { Stack } from "expo-router";

export default function BillingLayout() {
   return (
      <Stack>
         <Stack.Screen
            name="index"
            options={{
               headerTitle: "Billing",
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

