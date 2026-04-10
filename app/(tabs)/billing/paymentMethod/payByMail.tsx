/*
Mail your check or money order

Be sure to include your account number on your check. Make payable to:

Knoxville Utilities Board
P.O Box 59029
Knoxville, TN 37950-9017
*/

import ScreenHeader from "@/components/headerStyle";
import { Text, View } from "react-native";

export default function PayByMail() {
  return (
    <View className="flex-1 justify-center items-center">
      <ScreenHeader title="Pay By Mail" />
      <View className="justify-start pt-4 flex-1 gap-6">
        <Text className="text-text_main font-sans text-2xl tracking-wide px-6 pt-4">
          Mail your check or money order
        </Text>

        <Text className="text-text_main font-sans text-xl tracking-wide px-6"> 
          Be sure to include your account number on your check. Make payable to:
        </Text>

        <Text className="text-text_main font-bold text-xl tracking-wide px-6">
            Knoxville Utilities Board{'\n'}
            P. O. Box 59029{'\n'}
            Knoxville, TN 37950-9017{'\n'}
        </Text>
      </View>
    </View>
  );
}
