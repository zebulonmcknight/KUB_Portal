import FloatingInput from "@/components/floatingInput";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Credentials() {

   const router = useRouter();

   // This is used to track what the user is typing
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(false);

   // REGEX to check whether the user typed something we consider valid email format
   // Checks: "1 or more
   // characters" @ "1 or more characters" . "1 or more characters"
   const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
   const validPassword = password.length >= 4;

   const handleLogin = async () => {
      console.log("Logging in with:", email, password);

      try{
         setLoading(true); // button has been clicked so lock it from being clicked again

         const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               email: email,
               password: password,
            }),
         });

         const { access_token, expires_in } = await response.json();
         console.log("Here data:", access_token, expires_in);

         if( !access_token ){
            Alert.alert("Error", "Incorrect Username/Password. Please try again.");
            return;
         }

         if( !expires_in ){
            Alert.alert("Error", "Invalid expiry returned from server");
            return;
         }

         router.replace(("/(tabs)/billing"));

      } catch (error) {
         console.error("There was an error:", error);
      } finally {
         setLoading(false); // regardless of if errors are caught or not, reset the button so it can be clicked once more
      }
   };

   return (
      <SafeAreaView className="flex-1 justify-center">
         <Stack.Screen 
            options={{
               headerShown: false,
               headerStyle: {
                  backgroundColor: '#3377F4', // Match the header background to active theme
               },
               headerShadowVisible: false, // Remove the shadow underneath header for seamless integration with background
            }}
         />
         <View className="flex-1 justify-start px-6 pt-4">
         <Text className="text-text_main font-sans text-2xl tracking-wide pt-4 pb-4 w-full">
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
            // isPassword={true}
         />

         <TouchableOpacity
            disabled={!(validEmail && validPassword) || loading}
            className={`mt-6 rounded-xl items-center ${
               (validEmail && validPassword) ? 'bg-[#3377F4]' : 'bg-[#3377F4]/50'
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
