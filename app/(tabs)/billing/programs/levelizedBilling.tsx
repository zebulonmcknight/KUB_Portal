import ScreenHeader from "@/components/headerStyle";
import { Text, View } from "react-native";

export default function LevelizedBilling(){

   return(
      <View className="flex-1 justify-center">
         <ScreenHeader title="Levelized Billing" />
         <View className="flex-1 mx-4 mt-4 gap-4">
            <View className="border-b border-inactive_icon"/>
            <Text className="text-text_main tracking-wide text-xl font-bold">
               Hello
            </Text>
         </View>
      </View>
   );
}