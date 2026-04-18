import ScreenHeader from "@/components/headerStyle";
import { Linking, Text, View } from "react-native";

export default function Workshop(){

   return(
      <View className="flex-1 justify-center">
         <ScreenHeader title="Savings Workshops for Customers of All Ages" />
         <View className="flex-1 p-4 gap-4">
            <Text allowFontScaling={false} className="font-sans text-text_main tracking-wide text-lg" style={{lineHeight: 20}}>
               KUB, in partnership with TVA EnergyRight, offers its customers free workshops to learn simple ways to save energy and water at home,
               which also saves money on utility bills.
            </Text>
            <View className="border-b border-inactive_icon" />

            <Text allowFontScaling={false} className="font-bold text-text_main tracking-wide text-lg">Workshops for adults</Text>
            <Text allowFontScaling={false} className="font-sans text-text_main tracking-wide text-lg" style={{lineHeight: 20}}>
               Energy & Water Savings Workshops include an hour-long presentation led by KUB representatives using interactive displays to show how each tip
               makes a difference. Attendees receive conservation kits to get started.
            </Text>
            <Text
               className="font-sans text-active_icon tracking-wide text-lg"
               onPress={() => Linking.openURL("https://www.kub.org/save-money/energy-and-water-saving-workshops")}>
               Learn More
            </Text>
            <View className="border-b border-inactive_icon" />

            <Text allowFontScaling={false} className="font-bold text-text_main tracking-wide text-lg">Workshop For teens</Text>
            <Text allowFontScaling={false} className="font-sans text-text_main tracking-wide text-lg" style={{lineHeight: 20}}>
               The Energy Evolution Teen Workshop for middle and high school students empower attendees to play their role in energy conservation.
            </Text>
            <Text
               className="font-sans text-active_icon tracking-wide text-lg"
               onPress={() => Linking.openURL("https://www.kub.org/energy-evolution-teen-workshops")}>
               Learn More
            </Text>
            <View className="border-b border-inactive_icon" />

            <Text allowFontScaling={false} className="font-bold text-text_main tracking-wide text-lg">Workshops for kids</Text>
            <Text allowFontScaling={false} className="font-sans text-text_main tracking-wide text-lg" style={{lineHeight: 20}}>
               Eye Spy Energy Kids' Workshops introduce kids to the TVA EnergyRight Monsters, who make saving energy fun. Kids learn where energy comes from,
               how to save energy, and more.
            </Text>
            <Text
               className="font-sans text-active_icon tracking-wide text-lg"
               onPress={() => Linking.openURL("https://www.kub.org/kids-energyright-monsters-workshops")}>
               Learn More
            </Text>
         </View>
      </View>
   );
}