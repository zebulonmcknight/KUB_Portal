import ScreenHeader from "@/components/headerStyle";
import { Linking, Text, View } from "react-native";

export default function Solar(){

   return(
      <View className="flex-1 justify-center">
         <ScreenHeader title="KUB Community Solar" />
         <View className="flex-1 gap-4 p-4">
            <Text allowFontScaling={false} className="font-sans text-text_main tracking-wide text-lg">
               KUB customers can now purchase a share of KUB Community Solar - Knoxville's first community solar array!
            </Text>
            <Text allowFontScaling={false} className="font-sans text-text_main tracking-wide text-lg">
               In partnership with TVA and the City of Knoxville, KUB launched its community solar program to prodivde its customers a simple way to
               support local solar generation.
            </Text>

            <Text allowFontScaling={false} className="font-sans text-active_icon tracking-wide text-lg" onPress={() => Linking.openURL("https://www.kub.org/solar-enrollment/")}>
               Subscribe Today
            </Text>
         </View>
      </View>
   );
}