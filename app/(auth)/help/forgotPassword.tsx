import CustomAlert from "@/components/customAlert";
import FloatingInput from "@/components/floatingInput";
import ScreenHeader from "@/components/headerStyle";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

// Similarly to the forgotUsername page where we check the email the user has entered

export default function ForgotPassword() {
  // This is used to track what the user is typing
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // REGEX to check whether the user typed something we consider valid email format
  // Checks: "1 or more characters" @ "1 or more characters" . "1 or more characters"
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const resetPassword = async () => {
    try {
      setLoading(true);
      // Make a call to our signup api sending the information from our registration context
      const response = await fetch("http://localhost:3000/api/auth/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong. Please try again.");
      }

      // if successful reset the values so that context can get cleared
      setEmail("");

      // Lets our alert render when its a success.
      setShowSuccess(true);
    } catch (error: any) {
      // catch errors not explicitly handled
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center">
      <ScreenHeader title="Forgot Password" />
      <View className="flex-1 justify-start px-6 pt-4">
        <Text allowFontScaling={false} className="text-text_main font-sans text-2xl tracking-wide pt-4 pb-4 w-full">
          Please enter your information:
        </Text>

        <FloatingInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboard="email-address"
        />

        {/* The button will be disabled until the user enters a valid email address */}
        <TouchableOpacity
          disabled={!validEmail || loading}
          className={`mt-6 rounded-xl items-center ${
            validEmail && !loading ? "bg-[#3377F4]" : "bg-[#3377F4]/50"
          }`}
          onPress={resetPassword}
        >
          <Text allowFontScaling={false} className="text-text_main font-bold tracking-widest w-full text-center text-lg p-3">
            {loading ? "Processing..." : "NEXT"}
          </Text>
        </TouchableOpacity>
      </View>
      {/* This will only render if the auth creation was successfull. When they hit ok, it will redirect them to login page. */}
      <CustomAlert
        message={
          <Text>
            If an account exists for that email, a reset link has been sent.
          </Text>
        }
        visible={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          router.replace("/(auth)/login");
        }}
      />
    </View>
  );
}
