import ScreenHeader from "@/components/headerStyle";
import { Text, View } from "react-native";

export default function OutageNotifications(){

   return(
      <View className="flex-1 justify-center">
         <ScreenHeader title="Outage Notifications" />
         <Text>
            Hello
         </Text>
      </View>
   );
}