import ScreenHeader from "@/components/headerStyle";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Linking, ScrollView, Text, View } from "react-native";
import YoutubeIFrame from "react-native-youtube-iframe";

export default function NaturalGasFinancing(){

   const tabBarHeight = useBottomTabBarHeight();

   return(
      <View className="flex-1 justify-center">
         <ScreenHeader title="Natural Gas Water Heater Financing Available" />
         <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: tabBarHeight + 16, gap: 16, padding: 16}}
         >
            <Text className="font-sans text-text_main tracking-wide text-base">
               If a person lives near an existing KUB natural gas line, the EasyConnect program can make the transition to natural gas services a breeze.
            </Text>

            {/* Embed video */}
            <YoutubeIFrame
               videoId="4XfXxPEhDwo"
               height={220}
            />

            <Text className="font-bold text-text_main tracking-wide text-xl">
               Sign Up for KUB Natural Gas with EasyConnect
            </Text>
            <Text className="font-sans text-text_main tracking-wide text-base">
               With EasyConnect, 0% interest on-bill financing for the natural gas water heater and installation costs is available. EasyConnect participants must
               live within close proximity to an existing natural gas line and are required to pay upfront for the service line cost.
            </Text>

            <View className="border-b border-inactive_icon" />

            <Text className="font-bold text-text_main tracking-wide text-xl">
               Already a KUB Natural Gas Customer?
            </Text>

            <Text className="font-sans text-text_main tracking-wide text-base">
               KUB can install a new natural gas water heater to replace an existing electric or natural gas water heater. As with EasyConnect, 0% interest on-bill
               financing for the natural gas water heater and installation costs is available.
            </Text>
            <Text className="font-sans text-text_main tracking-wide text-base">
               In addition to selling and installing natural gas water heaters, KUB can assist with new customer-purchased natural gas appliances. KUB can
               also add or extend fuel lines to serve natural gas appliances. Whether it's upgrading to a new natural gas appliance or installing one for the
               first time, KUB is here to guide customers through the process.
            </Text>

            <Text className="font-sans text-text_main tracking-wide text-base">
               Contact KUB now to inquire about our range of services:
            </Text>

            <View>
               <View className="flex-row gap-2 ml-8">
                  <Text className="text-text_main text-2xl">{'\u2022'}</Text>
                  <Text className="flex-1 font-sans text-text_main tracking-wide text-base mt-1">
                     Call 865-558-2555
                  </Text>
               </View>
               <View className="flex-row gap-2 ml-8">
                  <Text className="text-text_main text-2xl">{'\u2022'}</Text>
                  <View className="flex-row">
                     <Text className="font-sans text-text_main tracking-wide text-base mt-1">
                        Email{' '}
                     </Text>
                     <Text
                        className="font-sans text-active_icon tracking-wide text-base mt-1"
                        onPress={() => Linking.openURL("mailto:ConnectToComfort@kub.org")}
                     >
                        ConnectToComfort@kub.org
                     </Text>
                  </View>
               </View>
            </View>

            <Text
               className="font-sans text-active_icon tracking-wide text-base"
               onPress={() => Linking.openURL("https://www.kub.org/easyconnect-interest-form")}
            >
               Appliance Services Interest Form
            </Text>
         </ScrollView>
      </View>
   );
}