import ScreenHeader from "@/components/headerStyle";
import { Text, View } from "react-native";

export default function OutageNotifications(){

   return(
      <View className="flex-1 justify-center">
         <ScreenHeader title="Outage Notifications" />
         <View className="flex-1 mx-4 mt-4 gap-4">
            <View className="border-b border-inactive_icon"/>
            <Text className="text-text_main tracking-wide text-xl font-bold">
               Sign Up for KUB Outage Notifications
            </Text>
            <Text className="font-sans text-text_main tracking-wide text-base">
               Sign up for KUB's outage notifications today to receive alerts about electrical outages. You'll receive updates about the outage status and estimated
               restoration times as soon as they are available.
            </Text>

            <Text className="font-sans text-text_main tracking-wide text-base">How to sign up:</Text>

            {/* Numbered list */}
            <Text className="font-sans text-text_main tracking-wide text-base">1. Tap Profile.</Text>
            <Text className="font-sans text-text_main tracking-wide text-base">2. Tap Push Notifications.</Text>
            <Text className="font-sans text-text_main tracking-wide text-base">3. Enable Outage Notifications.</Text>
         </View>
      </View>
   );
}