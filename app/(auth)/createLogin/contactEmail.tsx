import FloatingInput from "@/components/floatingInput";
import ScreenHeader from "@/components/headerStyle";
import { useRegistration } from "@/components/registrationContext";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

// Check the email the user has entered

export default function ContactEmail() {

  const router = useRouter();

  // This is used to track what the user is typing
  const { email, setEmail } = useRegistration();

  // REGEX to check whether the user typed something we consider valid email format
  // Checks: "1 or more characters" @ "1 or more characters" . "1 or more characters"
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <View className="flex-1 justify-center">
      <ScreenHeader title="Create Login" />
      <View className="flex-1 justify-start px-6 pt-4">
        <Text className="text-text_main font-sans text-2xl tracking-wide pt-4 pb-4 w-full">
          Thank you! Next, please enter your email address:
        </Text>

        <FloatingInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboard="email-address"
        />

        {/* The button will be disabled until the user enters a valid email address */}
        <TouchableOpacity
          disabled={!validEmail}
          className={`mt-6 rounded-xl items-center ${
            validEmail ? 'bg-[#3377F4]' : 'bg-[#3377F4]/50'
          }`}
          onPress={() => router.push("/(auth)/createLogin/createPassword")}
        >
          <Text className="text-text_main font-bold tracking-widest w-full text-center text-lg p-3">
            NEXT
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
