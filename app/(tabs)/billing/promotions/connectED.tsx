import ScreenHeader from "@/components/headerStyle";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Linking, ScrollView, Text, View } from "react-native";

export default function ConnectED() {

   const tabBarHeight = useBottomTabBarHeight();

   return (
      <View className="flex-1">
         <ScreenHeader title="Free KUB Fiber for K-12 Students" />

         <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: tabBarHeight + 16 }}
            showsVerticalScrollIndicator={false}
         >
            <Text className="font-sans text-text_main tracking-wide text-base">
               KUB is committed to providing high-speed KUB Fiber internet services to its customers. As part of this commitment, KUB's ConnectED program provides financial assistance to student households in need, with funding from the City of Knoxville and Knox County.
            </Text>

            <Text className="font-sans text-text_main tracking-wide text-base">
               ConnectED provides $80 monthly for free KUB Fiber one Gigabit symmetrical internet service, managed router services including in-home Wi-Fi router, and enhanced services for eligible families.
            </Text>

            <Text className="font-sans text-text_main tracking-wide text-base">
               Eligible households must:
            </Text>

            <View>
               <View className="flex-row ml-8">
                  <Text className="text-text_main font-sans text-base" style={{width: 15}}>1.</Text>
                  <Text className="flex-1 font-sans text-text_main tracking-wide text-base">
                     Live in KUB's electric service territory, within the City of Knoxville or Knox County.
                  </Text>
               </View>
               <View className="flex-row ml-8">
                  <Text className="text-text_main font-sans text-base" style={{width: 15}}>2.</Text>
                  <Text className="flex-1 font-sans text-text_main tracking-wide text-base">
                     Have KUB Fiber internet service available at their address. Check to see if your address is currently serviceable by KUB Fiber using the{' '}
                     <Text className="text-active_icon" onPress={() => Linking.openURL("https://www.kub.org/fiber-availability/")}>
                        KUB Fiber availability tool
                     </Text>
                     .
                  </Text>
               </View>
               <View className="flex-row ml-8">
                  <Text className="text-text_main font-sans text-base" style={{width: 15}}>3.</Text>
                  <Text className="flex-1 font-sans text-text_main tracking-wide text-base">
                     Meet program income requirements and be enrolled in a program that qualifies.{'\n'}a. Income requirements are currently at or below 200% of{' '}
                     <Text className="text-active_icon" onPress={() => Linking.openURL("https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines")}>
                        federal poverty guidelines
                     </Text>
                  </Text>
               </View>
               <View className="flex-row ml-8">
                  <Text className="text-text_main font-sans text-base" style={{width: 15}}>4.</Text>
                  <Text className="flex-1 font-sans text-text_main tracking-wide text-base">
                     Have a child enrolled in grades K - 12 in a public Knox County School.
                  </Text>
               </View>
            </View>

            <Text className="font-sans text-text_main tracking-wide text-base">
               Applicants will be asked to share the following as part of their application:
            </Text>

            <View>
               <View className="flex-row gap-2 ml-8">
                  <Text className="text-text_main text-2xl">{'\u2022'}</Text>
                  <Text className="flex-1 font-sans text-text_main tracking-wide text-base mt-1">
                     Contact information (phone number and/or email address)
                  </Text>
               </View>
               <View className="flex-row gap-2 ml-8">
                  <Text className="text-text_main text-2xl">{'\u2022'}</Text>
                  <Text className="flex-1 font-sans text-text_main tracking-wide text-base mt-1">
                     KUB service address
                  </Text>
               </View>
               <View className="flex-row gap-2 ml-8">
                  <Text className="text-text_main text-2xl">{'\u2022'}</Text>
                  <Text className="flex-1 font-sans text-text_main tracking-wide text-base mt-1">
                     Proof of school enrollment
                  </Text>
               </View>
               <View className="flex-row gap-2 ml-16">
                  <Text className="text-text_main text-2xl">{'\u25E6'}</Text>
                  <Text className="flex-1 font-sans text-text_main tracking-wide text-base mt-1">
                     Aspen portal, current student grade report, current student transcript, or letter on official school letterhead
                  </Text>
               </View>
               <View className="flex-row gap-2 ml-16">
                  <Text className="text-text_main text-2xl">{'\u25E6'}</Text>
                  <Text className="flex-1 font-sans text-text_main tracking-wide text-base mt-1">
                     Document must include student name and address where student resides and must match address where internet service will be
                  </Text>
               </View>
               <View className="flex-row gap-2 ml-8">
                  <Text className="text-text_main text-2xl">{'\u2022'}</Text>
                  <Text className="flex-1 font-sans text-text_main tracking-wide text-base mt-1">
                     Proof of income eligibility
                  </Text>
               </View>
               <View className="flex-row gap-2 ml-16">
                  <Text className="text-text_main text-2xl">{'\u25E6'}</Text>
                  <Text className="flex-1 font-sans text-text_main tracking-wide text-base mt-1">
                     Provide approval for SNAP, Medicaid, SSI, WIC, Federal Housing Assistance, LIHEAP, etc.
                  </Text>
               </View>
               <View className="flex-row gap-2 ml-16">
                  <Text className="text-text_main text-2xl">{'\u25E6'}</Text>
                  <Text className="flex-1 font-sans text-text_main tracking-wide text-base mt-1">
                     Document must include applicant name and address where internet service will be provided
                  </Text>
               </View>
            </View>

            <Text className="font-sans text-text_main tracking-wide text-base">
               Eligible families must recertify annually and provide proof of school enrollment and continued eligibility must be confirmed.  A new application is not required if household changes have not occurred (i.e. additional students in the home, change on address, etc.)
            </Text>

            <View>
               <Text className="font-bold text-text_main tracking-wide text-base">
                  Digital application:
               </Text>
               <Text className="font-sans text-text_main tracking-wide text-base">
                  Apply for KUB ConnectED online today by completing the form below.
               </Text>
            </View>

            <View>
               <Text className="font-bold text-text_main tracking-wide text-base">
                  Print application:
               </Text>
               <Text className="font-sans text-text_main tracking-wide text-base">
                  Apply for KUB ConnectED by returning this completed application and the materials listed above to:
               </Text>
            </View>

            <View>
               <View className="flex-row ml-8">
                  <Text className="text-text_main font-sans text-base" style={{width: 15}}>1.</Text>
                  <Text className="flex-1 font-sans text-text_main tracking-wide text-base">
                     Any KUB Customer Service Center or
                  </Text>
               </View>
               <View className="flex-row ml-8">
                  <Text className="text-text_main font-sans text-base" style={{width: 15}}>2.</Text>
                  <Text className="flex-1 font-sans text-text_main tracking-wide text-base">
                     Attn: Customer Counselors, P.O. Box 59017; Knoxville, TN 37950-9017
                  </Text>
               </View>
            </View>

         </ScrollView>
      </View>
   );
}