import ScreenHeader from "@/components/headerStyle";
import { icons } from "@/constants/icons";
import { billingData } from "@/constants/mockBillingData";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { format, parseISO } from "date-fns";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, Image, Linking, Text, TouchableOpacity, View } from "react-native";

export default function BillsAndPayments() {
   const router = useRouter();
   const tabBarHeight = useBottomTabBarHeight();

   const [loadingId, setLoadingId] = useState<string | null>(null);

   const openPDF = async (url:string, id: string) => {
      try{
         setLoadingId(id); // Set only that specific ID to a loading state so it doesnt affect others
         await Linking.openURL(url);
      } catch (error:any){
         Alert.alert("Error", error.message);
      }
      finally{
         setLoadingId(null); // Afterwards set the id to null to revert state
      }
   }

   return (
    <View className="flex-1 justify-center">
      <ScreenHeader title="Bills & Payments" />
      <FlatList
         className="flex-1"
         showsVerticalScrollIndicator={false}
         contentContainerStyle={{paddingBottom: tabBarHeight}}
         data={billingData}
         keyExtractor={item => item.id}
         renderItem={({item}) => {
            if( item.type === "payment" ){
               return(
                  // If the user wants to view their payment send them to the dynamic routing with the id of said payment attached
                  <TouchableOpacity onPress={() => router.push(`/(tabs)/billing/billsAndPayments/${item.id}`)} className="border-b border-section p-3 flex-row mx-4 items-center gap-4">
                     <Image source={icons.paid_bill} style={{width: 14, height: 14}}/>
                     <View className="flex-col">
                        <Text className="text-text_main bg-primary font-sans text-xl tracking-wide">
                           {/* Dates are saved in ISO format so have to parse it first before being able to print */}
                           {format(parseISO(item.paymentDate), "MMM dd, yyyy")} 
                        </Text>
                        <Text className="text-inactive_text font-sans text-sm tracking-wide">
                           ${item.paymentAmount.toFixed(2)}
                        </Text>
                     </View>
                  </TouchableOpacity>
               );
            }
            return(
               // Other option is viewing the invoice. As of now we download a publicly available pdf to cache and then open sharing for the user.
               // In production build will use react-native-viewer to view the pdf instead of sharing it.
               <TouchableOpacity onPress={() => openPDF(item.pdfUrl, item.id)} className="border-b border-section p-3 flex-row mx-4 items-center gap-4">
                  <Image source={icons.invoice} style={{width: 14, height: 14}}/>
                  <View className="flex-col">
                     <Text className="text-text_main bg-primary font-sans text-xl tracking-wide">
                        {loadingId === item.id ? "Loading..." : format(parseISO(item.invoiceDate), "MMM dd, yyyy")}
                     </Text>
                     <Text className="text-inactive_text font-sans text-sm tracking-wide">
                        ${item.amountDue.toFixed(2)}
                     </Text>
                  </View>
               </TouchableOpacity>
            );
         }}
      />
    </View>
  );
}
