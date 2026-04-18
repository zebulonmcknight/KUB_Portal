import ScreenHeader from "@/components/headerStyle";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function RoundUp() {
   const tabBarHeight = useBottomTabBarHeight();

   return (
      <View className="flex-1">
         <ScreenHeader title="Round It Up" />
         <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: tabBarHeight + 16 }}
         >
            <Text allowFontScaling={false} className="text-text_main font-bold text-2xl tracking-wide leading-10">
               Round It Up puts your spare change to work for the Knoxville-area community.
            </Text>
            <Text allowFontScaling={false} className="font-sans text-text_main tracking-wide text-xl leading-8">
               Automatically round your bill up to the next dollar to weatherize homes for low income families in need of help with their energy bills.
            </Text>

            <Text allowFontScaling={false} className="font-sans text-text_main tracking-wide text-base leading-6">
               Through this program, your{" "}
               <Text allowFontScaling={false} className="font-bold">maximum contribution per year would be $11.88</Text>
               , and the average{" "}
               <Text allowFontScaling={false} className="font-bold">annual contribution is around $6</Text>
               . You can unenroll at any time.
            </Text>

            {/* Enrollment handled on KUB's website since it requires billing system integration */}
            <TouchableOpacity
               className="mt-2 rounded-xl items-center bg-[#3377F4]"
               onPress={() => Linking.openURL("https://www.kub.org/srounditup-1/")}
            >
               <Text allowFontScaling={false} className="text-text_main font-bold tracking-widest text-lg p-4">
                  ENROLL ONLINE
               </Text>
            </TouchableOpacity>

            <View className="bg-section rounded-xl p-6 gap-3">
               <Text allowFontScaling={false} className="font-sans text-text_main tracking-wide text-base text-center leading-6">
                  All of the change from rounding your bill to the next dollar is sent to the Knoxville-Knox County Community Action Committee (CAC) weatherization assistance program. This program weatherizes homes for income-limited families and individuals, helping break the cycle of high utility bills due to inefficient homes and the ongoing needs for bill payment assistance.
               </Text>
               <Text
                  className="text-active_icon font-bold tracking-widest text-base text-center"
                  onPress={() => Linking.openURL("https://www.kub.org/rounditup-1/round-it-up-frequently-asked-questions/")}
               >
                  LEARN MORE
               </Text>
            </View>
         </ScrollView>
      </View>
   );
}