import ScreenHeader from "@/components/headerStyle";
import { Linking, Pressable, Text, TouchableOpacity, View } from "react-native";

export default function DeleteAccount() {
return (
    <View className="flex-1 justify-center items-center">
      <ScreenHeader title="Account Deletion" />
      <View className="justify-start pt-4">
        <Text className="text-text_main font-sans text-2xl tracking-wide px-6 pt-4 pb-6">
          Request online account deletion.
        </Text>

         {/* a n/ contact n/ */}
        <Text className="text-text_main font-sans text-xl tracking-tighter px-6 pb-4"> 
          If you have an online KUB account and would like to delete it, call 865-524-2911 to speak with a customer service representative.
        </Text>
      </View>

      <View className="flex-1 w-full pt-10">
        {/* Redirects user to website so they can create their account. */}
        <TouchableOpacity onPress={() => Linking.openURL("https://www.kub.org/mobile-application-privacy-policy-and-details")} className="bg-active_icon rounded-xl justify-center items-center py-3.5 mx-6">
          <Text className="text-text_main font-bold text-lg tracking-wider px-1">
            OPEN KUB.ORG
          </Text>
        </TouchableOpacity>

         {/* Button to open the phone dialer pre-filled with KUB number */}
        <Pressable onPress={() => Linking.openURL(`tel:${8655242911}`)} className= "rounded-xl justify-center items-center py-3.5 mx-6 my-2">
          <Text className="text-active_icon font-bold text-lg tracking-wider px-1">
            CALL 865-524-2911
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
