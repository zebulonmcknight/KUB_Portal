import ScreenHeader from "@/components/headerStyle";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Image, Linking, ScrollView, Text, View } from "react-native";

export default function ProjectHelp(){

   const tabBarHeight = useBottomTabBarHeight();

   return(
      <View className="flex-1">
         <ScreenHeader title="Project Help" />

         {/* Outer View for entire page */}
         <ScrollView
            className="flex-1"
            contentContainerStyle={{padding: 16, gap: 16, paddingBottom: tabBarHeight + 16}}
            showsVerticalScrollIndicator={false}
            >
            
            {/* View for the first block of text and the project help logo */}
            <View className="flex-row">
               <Text allowFontScaling={false} className="flex-1 font-sans text-text_main tracking-wide text-base">
                  Project Help provides emergency energy assistance with an emphasis on serving eligible applicants during the heating season.
                  This means Project Help will provide electricity, natural gas, propane, heating oil, wood, or coal for families across KUB's
                  service territory throughout the year.
               </Text>
               <Image source={require("@/assets/images/promotions/projecthelplogo_Converted.png")} style={{width: 150, height: 150}} className="mt-4 mx-4"/>
            </View>

            <Text allowFontScaling={false} className="font-sans text-text_main tracking-wide text-base">
               Project Help depends solely on contributions from the community and fundraisers. KUB collects Project Help donations and sends 100%
               of the funds to the Knoxville-Knox County Community Action Committee (CAC), which administers the program.
            </Text>

            <Text allowFontScaling={false} className="font-sans text-text_main tracking-wide text-base">
               CAC administers Project Help assistance to eligible community members including those who are elderly, experiencing job loss, injury, or disability.
            </Text>
            {/* Border separator */}
            <View className="border-b border-inactive_icon"/>
            <Text allowFontScaling={false} className="font-semibold text-text_main tracking-wide text-3xl py-4">How to Donate</Text>
            <View className="border-b border-inactive_icon"/>

            <Text allowFontScaling={false} className="font-sans text-text_main tracking-wide text-base">
               Donate to Project Help in the following ways.
            </Text>
            
            <View>
               {/* Add a view to each one for indentation and bullet points */}
               <View className="flex-row gap-2 ml-8">
                  <Text allowFontScaling={false} className="text-text_main text-2xl">{'\u2022'}</Text>
                  <Text allowFontScaling={false} className="flex-1 font-sans text-text_main tracking-wide text-base mt-1">
                     Make a one-time donation online{' '}
                     <Text allowFontScaling={false} className="text-active_icon" onPress={() => Linking.openURL("https://www.kub.org/customer/payments/guest/donation/donate")}>
                        here
                     </Text>
                     .   
                  </Text>
               </View>
               <View className="flex-row gap-2 ml-8">
                  <Text allowFontScaling={false} className="text-text_main text-2xl">{'\u2022'}</Text>
                  <Text allowFontScaling={false} className="flex-1 font-sans text-text_main text-base tracking-wide mt-1">
                     Visit Food City or Home Federal Bank Jan. 1 - Feb. 4.
                  </Text>
               </View>
               <View className="flex-row gap-2 ml-8">
                  <Text allowFontScaling={false} className="text-text_main text-2xl">{'\u2022'}</Text>
                  <Text allowFontScaling={false} className="flex-1 font-sans text-text_main tracking-wide text-base mt-1">
                     Make a one-time donation by mailing a check payable to Project Help to P.O Box 59017 Knoxville, TN 37950
                  </Text>
               </View>
               <View className="flex-row gap-2 ml-8">
                  <Text allowFontScaling={false} className="text-text_main text-2xl">{'\u2022'}</Text>
                  <Text allowFontScaling={false} className="flex-1 font-sans text-text_main tracking-wide text-base mt-1">
                     Set up a recurring monthly donation using the form{' '}
                     <Text allowFontScaling={false} className="text-active_icon" onPress={() => Linking.openURL("https://www.kub.org/about/community/project-help/project-help-donations/")}>
                        here
                     </Text>
                     .  
                  </Text>
               </View>
            </View>
            <Text allowFontScaling={false} className="font-sans text-text_main tracking-wide text-base">
               Project Help of East Tennessee, Inc. is a 501(c)(3) charitable organization, and donors receive an annual contribution letter for tax purposes.
            </Text>

            {/* Border separator */}
            <View className="border-b border-inactive_icon"/>
            <Text allowFontScaling={false} className="font-semibold text-text_main tracking-wide text-3xl py-4">How to Apply for Assistance</Text>
            <View className="border-b border-inactive_icon"/>
            
            <Text allowFontScaling={false} className="font-sans text-text_main tracking-wide text-base">
               Contact the CAC at 865-637-6700 to see if you qualify for emergency assistance through Project Help or the{' '}
               <Text allowFontScaling={false} className="text-active_icon" onPress={() => Linking.openURL("https://www.knoxcac.org/utility-assistance/")}>
                  Low Income Energy Assistance Program
               </Text>
               .
            </Text>
         </ScrollView>
      </View>
   );
}