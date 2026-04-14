import ScreenHeader from "@/components/headerStyle";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { Linking, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LevelizedBilling() {
   const tabBarHeight = useBottomTabBarHeight();
   const [termsVisible, setTermsVisible] = useState(false);

   return (
      <View className="flex-1">
         <ScreenHeader title="Levelized Billing" />
         <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: tabBarHeight + 16 }}
         >
            <Text className="text-text_main font-bold text-2xl tracking-wide">
               Levelized Billing is an easy way to stay on budget.
            </Text>
            <Text className="font-sans text-text_main tracking-wide text-xl leading-8">
               Levelized Billing helps keep your bills more consistent by averaging your energy usage across the year.
            </Text>

            <Text className="font-sans text-text_main tracking-wide text-base leading-6">
               By enrolling in Levelized Billing, you accept KUB's{" "}
               {/* Opens the T&C modal instead of linking out */}
               <Text
                  className="text-active_icon"
                  onPress={() => setTermsVisible(true)}
               >
                  Levelized Billing Terms and Conditions.
               </Text>
            </Text>

            {/* Enrollment handled on KUB's website since it requires billing history calculations */}
            <TouchableOpacity
               className="mt-2 rounded-xl items-center bg-[#3377F4]"
               onPress={() => Linking.openURL("https://www.kub.org/bills-payments/billing-options/levelized-bill-plan/")}
            >
               <Text className="text-text_main font-bold tracking-widest text-lg p-4">
                  ENROLL ONLINE
               </Text>
            </TouchableOpacity>

            <View className="bg-section rounded-xl p-6 gap-4 mt-4">
               <Text className="font-sans text-text_main tracking-wide text-lg text-center leading-6">
                  KUB recalculates your payment each month based on a rolling average of your latest 12 months of history. Your payment amount will vary some each month to reflect a true average of your latest 12 months of usage.
               </Text>
               <Text
                  className="text-active_icon font-semibold tracking-widest text-base text-center mt-4"
                  onPress={() => Linking.openURL("https://www.kub.org/bills-payments/billing-options/levelized-bill-plan/")}
               >
                  LEARN MORE
               </Text>
            </View>
         </ScrollView>

         {/* Levelized Billing Terms and Conditions modal */}
         <Modal
            visible={termsVisible}
            transparent={false}
            animationType="slide"
            onRequestClose={() => setTermsVisible(false)}
         >
            <SafeAreaView className="flex-1 bg-primary">
               {/* Header */}
               <View className="flex-row items-center px-4 py-3">
                  <TouchableOpacity onPress={() => setTermsVisible(false)} className="p-2">
                     <Text className="text-text_main text-2xl">✕</Text>
                  </TouchableOpacity>
                  <Text className="text-text_main font-bold text-xl ml-4">
                     Terms and Conditions
                  </Text>
               </View>

               <ScrollView className="flex-1 p-6" contentContainerStyle={{ gap: 12 }}>
                  <Text className="text-text_main font-semibold text-2xl tracking-wide">
                     Levelized Billing Terms and Conditions
                  </Text>
                  <Text className="text-text_main font-bold text-xl tracking-wide">
                     Levelized Billing
                  </Text>
                  <Text className="font-sans text-text_main tracking-wide text-xl">
                     The Levelized Billing Plan is a budgeting option available to residential customers in which an average amount is calculated over a rolling 12 months. LBP is recalculated monthly, which keeps the average in line with consumption. On LBP, your average amount will fluctuate with each new bill, but the changes should be within 5 to 10% of the previous month's LBP average. Note: A customer with less than a 12-month history at their address will see a larger fluctuation than 5 to 10% until an accurate average is established.
                  </Text>
                  <Text className="font-sans text-text_main tracking-wide text-base">
                     By enrolling in the Levelized Billing Plan (LBP), you authorize KUB to bill your account in monthly amounts equal to the average utility consumption on your account. This will be effective with your next billing statement. Please pay your LBP amount due in full and on time each month. If you pay less than the amount due and/or pay after your due date, your account may be automatically removed from LBP.
                  </Text>
                  <Text className="font-sans text-text_main tracking-wide text-base">
                     If you choose to be removed from LBP, or discontinue your service with KUB, the overpaid/underpaid balance will be applied to your next bill.
                  </Text>
               </ScrollView>
            </SafeAreaView>
         </Modal>
      </View>
   );
}