import ScreenHeader from '@/components/headerStyle';
import { mockPayments } from '@/constants/mockBillingData';
import { format, parseISO } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function PaidInvoice() {

   const { paymentId } = useLocalSearchParams(); // Grab the ID that is attached to the page URL in billsAndPayments/index. Each payment has its own unique ID.
   const payment = mockPayments.find(p => p.id === paymentId); // Once we obtain the ID we serach the file for it to retrieve all of its information.

   // Error check to make sure app doesn't crash if there is no matching payment.
   if( !payment ){
      return (
         <View className="flex-1 justify-center items-center">
            <Text className="text-text_main font-bold text-lg">Payment not found.</Text>
         </View>
      );
   }

   return (
      <View className='flex-1'>
         <ScreenHeader title={format(parseISO(payment.paymentDate), "MMM dd, yyyy")} />
         {/* number, amount, type, date, status */}
         <View className="w-full mx-4">
            <View className="border-b border-section p-4">
               <Text className="text-text_main font-sans text-xl tracking-wide">
                  Payment Number
               </Text>
               <Text className="text-inactive_text font-sans text-sm tracking-wide">
                  {payment.id}
               </Text>
            </View>
            <View className="border-b border-section p-4">
               <Text className="text-text_main font-sans text-xl tracking-wide">
                  Payment Amount
               </Text>
               <Text className="text-inactive_text font-sans text-sm tracking-wide">
                  ${payment.paymentAmount.toFixed(2)}
               </Text>
            </View>
            <View className="border-b border-section p-4">
               <Text className="text-text_main font-sans text-xl tracking-wide">
                  Payment Type
               </Text>
               <Text className="text-inactive_text font-sans text-sm tracking-wide">
                  {payment.paymentType}
               </Text>
            </View>
            <View className="border-b border-section p-4">
               <Text className="text-text_main font-sans text-xl tracking-wide">
                  Payment Date
               </Text>
               <Text className="text-inactive_text font-sans text-sm tracking-wide">
                  {format(parseISO(payment.paymentDate), "MMM dd, yyyy")}
               </Text>
            </View>
            <View className="border-b border-section p-4">
               <Text className="text-text_main font-sans text-xl tracking-wide">
                  Payment Status
               </Text>
               <Text className="text-inactive_text font-sans text-sm tracking-wide">
                  {payment.paymentStatus}
               </Text>
            </View>
         </View>
      </View>
  );
}
