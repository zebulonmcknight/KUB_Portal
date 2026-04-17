import ScreenHeader from "@/components/headerStyle";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Linking, ScrollView, Text, View } from "react-native";

export default function EnergySaving() {

   const tabBarHeight = useBottomTabBarHeight();

   return (
      <View className="flex-1">
         <ScreenHeader title="Energy-Saving Home Upgrade Funding Available" />

         <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: tabBarHeight + 16 }}
            showsVerticalScrollIndicator={false}
         >
            <Text allowFontScaling={false} className="font-bold text-text_main tracking-wide text-3xl">
               Energy Efficiency & Clean Energy Funding Available
            </Text>

            <Text allowFontScaling={false} className="font-sans text-text_main tracking-wide text-base">
               KUB is committed to helping customers save energy and money. The Inflation Reduction Act (IRA), signed into law on August 16, 2022, aims to help American households save money on energy bills; upgrade to clean energy equipment and improve energy efficiency; and reduce indoor and outdoor air pollution.
            </Text>

            <Text allowFontScaling={false} className="font-sans text-text_main tracking-wide text-base">
               There are several funding opportunities available for KUB customers that make qualifying energy improvements to their homes.
            </Text>

            <View className="border-b border-inactive_icon" />
            <Text allowFontScaling={false} className="font-bold text-text_main tracking-wide text-lg">Tax Credits</Text>

            <Text allowFontScaling={false} className="font-sans text-text_main tracking-wide text-base">
               Approximately $43 billion in IRA tax credits aim to lower emissions by making electric vehicles, energy-efficient appliances, rooftop solar panels, geothermal heating, and home batteries more affordable. If you make energy improvements to your home, tax credits are available for a portion of qualifying expenses. The credit amounts and types of qualifying expenses were expanded by the Inflation Reduction Act of 2022.
            </Text>

            <View>
               <View className="ml-8">
                  <View className="flex-row">
                     <Text allowFontScaling={false} className="text-text_main font-sans text-base" style={{width: 15}}>1.</Text>
                     <Text allowFontScaling={false} className="font-bold text-text_main tracking-wide text-base">
                        Energy Efficient Home Improvement Credit:
                     </Text>
                  </View>
                  <Text allowFontScaling={false} className="font-sans text-text_main tracking-wide text-base">
                     Provides 30% of costs up to $3,200 per year in tax credit for qualified energy-efficient improvements installed after Jan. 1, 2023.
                  </Text>
               </View>
               <View className="ml-8">
                  <View className="flex-row">
                     <Text allowFontScaling={false} className="text-text_main font-sans text-base" style={{width: 15}}>2.</Text>
                     <Text allowFontScaling={false} className="font-bold text-text_main tracking-wide text-base">
                        Residential Clean Energy Credit:
                     </Text>
                  </View>
                     <Text allowFontScaling={false} className="font-sans text-text_main tracking-wide text-base">
                        Provides 30% of costs with no annual limit in tax credit for new, qualified clean energy property for your home installed
                        anytime from 2022 through 2033.
                     </Text>
               </View>
            </View>

            <Text allowFontScaling={false} className="font-bold text-active_icon tracking-wide text-lg" onPress={() => Linking.openURL("https://www.energystar.gov/about/federal_tax_credits")}>
               Learn More About IRA Home Energy Tax Credits Here
            </Text>

            <View className="border-b border-inactive_icon" />
            <Text allowFontScaling={false} className="font-bold text-text_main tracking-wide text-lg">Home Energy Rebates (Coming Soon)</Text>

            <Text allowFontScaling={false} className="font-sans text-text_main tracking-wide text-base">
               In addition to the IRA Tax Credits, two IRA provisions authorize $8.8 billion in rebates for home energy efficiency and electrification projects. The Home Energy Rebate programs, which are to be administered by State Energy Offices, will provide varying funding amounts depending on income qualifications for two categories of rebates:
            </Text>

            <View>
               <View className="ml-8">
                  <View className="flex-row">
                     <Text allowFontScaling={false} className="text-text_main font-sans text-base" style={{width: 15}}>1.</Text>
                     <Text allowFontScaling={false} className="font-bold text-text_main tracking-wide text-base">
                        Section 50121:
                     </Text>
                  </View>
                  <Text allowFontScaling={false} className="font-sans text-text_main tracking-wide text-base">
                     Home Energy Performance-Base, Whole House Rebate Program (Home Efficiency Program)
                  </Text>
               </View>
               <View className="ml-8">
                  <View className="flex-row">
                     <Text allowFontScaling={false} className="text-text_main font-sans text-base" style={{width: 15}}>2.</Text>
                     <Text allowFontScaling={false} className="font-bold text-text_main tracking-wide text-base">
                        Section 50122:
                     </Text>
                  </View>
                     <Text allowFontScaling={false} className="font-sans text-text_main tracking-wide text-base">
                        High-Efficiency Electric Home Rebate Program (Home Electrification Program)
                     </Text>
               </View>
            </View>

            <Text allowFontScaling={false} className="font-sans text-text_main tracking-wide text-base">
               Home Energy Rebate Program funds are not yet available.
            </Text>

            <Text allowFontScaling={false} className="font-bold text-active_icon tracking-wide text-lg" onPress={() => Linking.openURL("https://eeadminprd.kub.org")}>
               Learn More About IRA Home Energy Rebates Here
            </Text>

         </ScrollView>
      </View>
   );
}