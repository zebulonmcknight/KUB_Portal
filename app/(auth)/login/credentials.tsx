import { useAuth } from "@/components/authContext";
import FloatingInput from "@/components/floatingInput";
import ScreenHeader from "@/components/headerStyle";
import Entypo from "@expo/vector-icons/Entypo";
import { Checkbox } from "expo-checkbox";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Credentials() {
  const router = useRouter();
  const { setAccessToken } = useAuth();

  // This is used to track what the user is typing
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  // REGEX to check whether the user typed something we consider valid email format
  // Checks: "1 or more
  // characters" @ "1 or more characters" . "1 or more characters"
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validPassword = password.length >= 4;

  const handleLogin = async () => {
    try {
      setLoading(true); // button has been clicked so lock it from being clicked again

      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      // Check the response before trying to parse
      if (!response.ok) {
        Alert.alert("Error", "Incorrect Username/Password. Please try again.");
        return;
      }

      const { access_token, expires_in } = await response.json();

      if (!access_token) {
        Alert.alert("Error", "Incorrect Username/Password. Please try again.");
        return;
      }

      if (!expires_in) {
        Alert.alert("Error", "Invalid expiry returned from server");
        return;
      }

      // Securely store the tokens so that they can be referenced later
      if (stayLoggedIn) {
        await SecureStore.setItemAsync("access_token", access_token);
        await SecureStore.setItemAsync(
          "token_expiry",
          (Date.now() + expires_in * 1000).toString(),
        ); // convert to milliseconds
      } else {
        setAccessToken(access_token);
      }

      router.replace("/(tabs)/billing");
    } catch (error) {
      console.error("There was an error:", error);
      Alert.alert("Network Error", "Could not connect to the server.");
    } finally {
      setLoading(false); // regardless of if errors are caught or not, reset the button so it can be clicked once more
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center">
      <ScreenHeader title="Enter Your Credentials" />
      <View className="flex-1 justify-start px-6">
        <Text className="text-text_main font-sans text-2xl tracking-wide pb-4 w-full">
          Please enter your information:
        </Text>

        <FloatingInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboard="email-address"
        />

        <FloatingInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          keyboard="default"
          isPassword={!isVisible} // If its not visible then that means it is a password. The opposite is true basically
          alertIcon={
            <TouchableOpacity
              onPress={() => setIsVisible(!isVisible)}
              className="p-4"
            >
              <Entypo
                name={isVisible ? "eye-with-line" : "eye"}
                size={24}
                color="white"
              />
            </TouchableOpacity>
          }
        />

        <View className="flex-row justify-between items-center w-full mt-3">
          <Text
            className="text-active_icon font-sans text-base underline"
            onPress={() => router.navigate("/(auth)/help/forgotPassword")}
          >
            Forgot your password?
          </Text>

          <View className="flex-row items-center gap-2">
            <Checkbox
              value={stayLoggedIn}
              onValueChange={setStayLoggedIn}
              color={stayLoggedIn ? "#3377F4" : undefined}
            />
            <Text className="text-text_main font-sans text-base">
              Keep me signed in
            </Text>
          </View>
        </View>

        <TouchableOpacity
          disabled={!(validEmail && validPassword) || loading}
          className={`mt-6 rounded-xl items-center ${
            validEmail && validPassword ? "bg-[#3377F4]" : "bg-[#3377F4]/50"
          }`}
          onPress={handleLogin}
        >
          <Text className="text-text_main font-bold tracking-widest w-full text-center text-lg p-3">
            {loading ? "Processing..." : "LOGIN"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
