import ScreenHeader from "@/components/headerStyle";
import { Text, View } from "react-native";

export default function UtilityUsage(){

   return(
      <View className="flex-1 justify-center">
         <ScreenHeader title="Track Your Utility Usage" />
         <Text allowFontScaling={false} className="flex-1 font-sans text-text_main tracking-wide text-lg p-4">
            KUB customers can track utility usage down to the hour by clicking "usage details" on the mobile app home screen or by logging in at kub.org.
         </Text>
      </View>
   );
}