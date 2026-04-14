import ScreenHeader from '@/components/headerStyle';
import { format, parseISO } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

// Shape of payment data passed as a route param from billsAndPayments/index
type PaymentItem = {
   id: string;
   paymentDate: string;
   paymentAmount: number;
   paymentType: string;
   paymentStatus: string;
   invoiceId: string;
};

export default function PaidInvoice() {

   const { payment: paymentParam } = useLocalSearchParams();

   // Payment data was passed as a JSON string param to avoid a second fetch on this screen
   const payment: PaymentItem | null = paymentParam
      ? JSON.parse(paymentParam as string)
      : null;

   // Error check to make sure app doesn't crash if there is no matching payment.
   if (!payment) {
      return (
         <View className="flex-1 justify-center items-center">
            <ScreenHeader title="Payment Detail" />
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