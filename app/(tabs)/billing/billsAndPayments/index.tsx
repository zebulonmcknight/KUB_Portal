import { icons } from "@/constants/icons";
import { billingData } from "@/constants/mockBillingData";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { format, parseISO } from "date-fns";
import * as FileSystem from "expo-file-system/legacy";
import { Stack, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from "react-native";

export default function BillsAndPayments() {
   const router = useRouter();
   const tabBarHeight = useBottomTabBarHeight();

   const [loadingId, setLoadingId] = useState<string | null>(null);

   const openPDF = async (url:string, id: string) => {
      try{
         setLoadingId(id);
         if( !FileSystem.cacheDirectory ) return;
         const localUri = FileSystem.cacheDirectory + "invoice.pdf";
         await FileSystem.downloadAsync(url, localUri);
         await Sharing.shareAsync(localUri);
      } catch (error:any){
         Alert.alert("Error", error.message);
      }
      finally{
         setLoadingId(null);
      }
   }

   return (
    <View className="flex-1 justify-center">
      <Stack.Screen 
         options={{
            title: "Bills & Payments", // Set the header title for this screen
            headerStyle: {
               backgroundColor: '#3377F4', // Match the header background to active theme
            },
            headerShadowVisible: false, // Remove the shadow underneath header for seamless integration with background
         }}
      />
      <FlatList
         className="flex-1"
         showsVerticalScrollIndicator={false}
         contentContainerStyle={{paddingBottom: tabBarHeight}}
         data={billingData}
         keyExtractor={item => item.id}
         renderItem={({item}) => {
            if( item.type === "payment" ){
               return(
                  <TouchableOpacity onPress={() => router.push(`/(tabs)/billing/billsAndPayments/${item.id}`)} className="border-b border-section p-3 flex-row mx-4 items-center gap-4">
                     <Image source={icons.paid_bill} style={{width: 14, height: 14}}/>
                     <View className="flex-col">
                        <Text className="text-text_main bg-primary font-sans text-xl tracking-wide">
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
