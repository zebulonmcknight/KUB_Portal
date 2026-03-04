import { Stack } from "expo-router";

export default function ChatbotLayout() {
   return (
      <Stack>
         <Stack.Screen
            name="index"
            options={{
               headerTitle: "Chatbot",
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

