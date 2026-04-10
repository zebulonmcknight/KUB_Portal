// KUB accepts credit and debit cards in partnership with Paymentus
// To pay your bill by phone
// button with CALL 865-524-2911

import ScreenHeader from "@/components/headerStyle";
import { Linking, Text, TouchableOpacity, View } from "react-native";

export default function PayByPhone() {
  return (
    <View className="flex-1 justify-center items-center">
      <ScreenHeader title="Pay By Phone" />
      <View className="justify-start pt-4 gap-6 flex-1">
        <Text className="text-text_main font-sans text-2xl tracking-widest px-6 pt-4">
          KUB accepts credit and debit cards in partnership with Paymentus
        </Text>

         {/* a n/ contact n/ */}
        <Text className="text-text_main font-sans text-xl tracking-wide px-6 pb-4"> 
          To pay your bill by phone
        </Text>

        {/* Redirects user to website so they can create their account. */}
        <TouchableOpacity onPress={() => Linking.openURL(`tel:${8655242911}`)} className="bg-active_icon rounded-xl justify-center items-center py-3.5 mx-6">
          <Text className="text-text_main font-bold text-lg tracking-wider px-1">
            CALL 865-524-2911
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
