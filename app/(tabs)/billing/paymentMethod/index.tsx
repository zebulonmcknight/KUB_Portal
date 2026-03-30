import ScreenHeader from "@/components/headerStyle";
import { mockPaymentMethods, PaymentMethodType } from "@/constants/mockPaymentMethods";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function PaymentMethod(){

   const tabBarHeight = useBottomTabBarHeight();
   const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

   const renderPaymentMethod = (item: PaymentMethodType) => {

      const isMenuOpen = menuOpenId === item.id;

      const paymentType = item.type === "card" ? "Credit / Debit Card" : "Bank Account";
      const last4 = `**** ${item.last4}`;

      const cardInfo = item.type === "card"
         ? `${item.brand.toUpperCase()}    EXP. ${String(item.expMonth).padStart(2, "0")}/${String(item.expYear).slice(-2)}`
         : `${item.bankName}    ${item.accountType.charAt(0).toUpperCase() + item.accountType.slice(1)}`;

      return (
         <TouchableOpacity
            key={item.id}
            onPress={() => console.log(item.id)}
            className="border-b border-section py-4 flex-row items-center justify-between"
         >
            <View className="gap-1">
               <Text className="text-text_main text-xl font-sans tracking-wide">
                  {paymentType}
               </Text>
               <Text className="text-inactive_text text-sm font-sans tracking-wide">
                  {last4}
               </Text>
               <Text className="text-inactive_text text-sm font-sans tracking-wide">
                  {cardInfo}
               </Text>
            </View>

            <View className="items-end">
               <TouchableOpacity
                  onPress={() => setMenuOpenId(isMenuOpen ? null : item.id)}
                  className="py-1"
               >
                  <Text className="text-blue-500 text-2xl p-4 leading-none">⋮</Text>
               </TouchableOpacity>

               {isMenuOpen && (
                  <TouchableOpacity
                     onPress={() => {
                        setMenuOpenId(null);
                        console.log("delete", item.id);
                     }}
                     className="bg-section mr-4 px-4 py-2 rounded-lg"
                  >
                     <Text className="text-red-500 text-base font-sans">Delete</Text>
                  </TouchableOpacity>
               )}
            </View>
         </TouchableOpacity>
      );
   };

   return(
      <View className="flex-1">
         <ScreenHeader title="Payment Method" />
         <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: tabBarHeight }}
         >
            <View className="ml-4 mt-12">

               <Text className="text-text_main tracking-wide text-xl font-bold">
                  Saved Payment Methods
               </Text>

               {mockPaymentMethods.map(renderPaymentMethod)}

               <TouchableOpacity
                  onPress={() => console.log("add payment method")}
                  className="border-b border-section flex-row items-center justify-between"
               >
                  <Text className="text-text_main text-xl font-sans tracking-wide">
                     Add Payment Method
                  </Text>
                  <Text className="text-blue-500 p-4 text-2xl">+</Text>
               </TouchableOpacity>

               <Text className="text-text_main tracking-wide text-xl font-bold mt-10">
                  Other Payment Methods
               </Text>

               <View className="gap-2 mt-4">
                  <TouchableOpacity
                     onPress={() => console.log("person")}
                     className="border-b border-section py-2"
                  >
                     <Text className="text-text_main tracking-wide text-xl font-sans">
                        Pay In Person
                     </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     onPress={() => console.log("phone")}
                     className="border-b border-section py-2"
                  >
                     <Text className="text-text_main tracking-wide text-xl font-sans">
                        Pay By Phone
                     </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     onPress={() => console.log("mail")}
                     className="border-b border-section py-2"
                  >
                     <Text className="text-text_main tracking-wide text-xl font-sans">
                        Pay By Mail
                     </Text>
                  </TouchableOpacity>
               </View>

            </View>
         </ScrollView>
      </View>
   );
}