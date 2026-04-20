import { Stack } from "expo-router";

export default function BillingLayout() {
   return (
      <Stack screenOptions={{headerShown: false}}>
         <Stack.Screen
            name="index"
            options={{
               headerTitle: "Billing",
               headerShown: false,
               headerStyle: {
                  backgroundColor: "#091C3C",
               },
               headerShadowVisible: false,
            }}
         />
      </Stack>
   )
}

