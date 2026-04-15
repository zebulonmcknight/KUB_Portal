import ScreenHeader from "@/components/headerStyle";
import { Linking, Text, TouchableOpacity, View } from "react-native";

export default function ManageYourService() {
  const stopServiceButton = () => {
    Linking.openURL("https://www.kub.org/start-stop-service");
  };

  const transferServiceButton = () => {
    Linking.openURL("https://www.kub.org/start-stop-service");
  };

  const startServiceButton = () => {
    Linking.openURL("https://www.kub.org/start-stop-service/new-service/");
  };

  return (
    <View className="flex-1 px-6 pt-6">
      <ScreenHeader title="Manage Service" />

      {/* Hero text */}
      <Text className="text-text_main text-3xl mt-5 mb-5">
        Start, Stop, or Transfer service easily and quickly.
      </Text>
      <Text className="text-text_main text-xl mb-10">
        We'll take you through the steps needed to start new service or stop
        service on your existing account.
      </Text>

      {/* Stop Service Button*/}
      <TouchableOpacity
        className="bg-red-600 rounded-xl py-5 items-center mb-3"
        activeOpacity={0.8}
        onPress={stopServiceButton}
      >
        <Text className="text-white font-bold text-sm tracking-widest">
          STOP SERVICE
        </Text>
      </TouchableOpacity>

      {/* Transfer Service Button*/}
      <TouchableOpacity
        className="bg-blue-500 rounded-xl py-5 items-center mb-3"
        activeOpacity={0.8}
        onPress={transferServiceButton}
      >
        <Text className="text-white font-bold text-sm tracking-widest">
          TRANSFER SERVICE
        </Text>
      </TouchableOpacity>

      {/* Start Service Text/Button */}
      <TouchableOpacity
        className="py-5 items-center"
        activeOpacity={0.8}
        onPress={startServiceButton}
      >
        <Text className="text-blue-500 font-bold text-sm tracking-widest">
          START SERVICE
        </Text>
      </TouchableOpacity>
    </View>
  );
}
