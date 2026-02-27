import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const router = useRouter();

export default function Billing() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >

      <TouchableOpacity 
        onPress={() => router.replace("/(auth)/login")}
        className="bg-section p-4 rounded-xl w-full items-center mb-4"
      >
        <Text className="text-text_main font-bold">Go Back to Login</Text>
      </TouchableOpacity>
      <Text className="text-text_main">Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
