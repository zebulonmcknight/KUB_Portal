import CustomAlert from "@/components/customAlert";
import FloatingInput from "@/components/floatingInput";
import ScreenHeader from "@/components/headerStyle";
import { useRegistration } from "@/components/registrationContext";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CreatePassword() {
  const router = useRouter();

  const [showAlert, setShowAlert] = useState(false); // State to control the visibility of the custom alert at the header
  const [showSuccess, setShowSuccess] = useState(false); // State to control the visibility of the custom alert after successful account creation
  const [loading, setLoading] = useState(false);
  // Since we are at the end of signup route, import all values so we can set them to be empty
  const {
    password,
    setPassword,
    email,
    setEmail,
    accountNumber,
    setAccountNumber,
    zipCode,
    setZipCode,
    ssn,
    setSSN,
  } = useRegistration();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [confirmationIsVisible, setConfirmationIsVisible] = useState(false);

  const authCreation = async () => {
    try {
      setLoading(true);
      // Make a call to our signup api sending the information from our registration context
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
          account_number: accountNumber,
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      // pull them to check values, no need to store them here
      const { access_token, expires_in } = await response.json();

      // Make sure our values are valid
      if (!access_token || !expires_in) {
        throw new Error("Something went wrong. Please try again.");
      }

      // if successful reset the values so that context can get cleared
      setPassword("");
      setEmail("");
      setAccountNumber("");
      setZipCode("");
      setSSN("");

      // Lets our alert render when its a success.
      setShowSuccess(true);
    } catch (error: any) {
      // catch errors not explicitly handled
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // useRef so that we can wire the keyboard to show 'Next' instead of 'Done' when on account number and zipcode text boxes
  // Need references to zip and ssn as those are the boxes we move to
  // Tell it type is of <TextInput> so that typescript doesnt complain about it not having a type
  const zipCodeRef = useRef<TextInput>(null);
  const ssnRef = useRef<TextInput>(null);

  // Use REGEX to verify that the user only entered digits and that they meet the length requirements
  const validPassword = (password: string) => {
    // Check the length of the password first
    if (password.length < 12 || password.length > 64) return false;

    // We set 3 minimum requirements, use this counter to see how many the user abides by.
    let abidedBy = 0;

    if (/[a-z]/.test(password)) abidedBy++; // Check for lowercase
    if (/[A-Z]/.test(password)) abidedBy++; // Check for uppercase
    if (/\d/.test(password)) abidedBy++; // Check for number
    if (/[^a-zA-Z\d\s]/.test(password)) abidedBy++; // Check for symbol

    // Check if they hit at least 3, which 3 does not matter.
    return abidedBy >= 3;
  };

  // boolean to determine whether one - the password matches our criteria and two - both passwords entered match. Either keeps next button disabled if not correct or allows user to proceed.
  const isReady = validPassword(password) && password === confirmPassword;

  return (
    <View className="flex-1 justify-center">
      <ScreenHeader title="Create Login" onPress={() => setShowAlert(true)} />
      <View className="flex-1 justify-start px-6 pt-4">
        <Text allowFontScaling={false} className="text-text_main font-sans text-2xl tracking-wide pt-4 pb-4 w-full">
          Please create a password:
        </Text>

        <Text allowFontScaling={false} className="text-text_main font-sans text-xl tracking-wide pt-4 pb-4 w-full">
          Passwords must be 12-64 characters long and include at least 3 of the
          following character classes: an uppercase letter, a lowercase letter,
          a number, or a symbol.
        </Text>

        {/* Use input component to make input boxes for the information we need from the user */}
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

        <Text allowFontScaling={false} className="text-text_main font-sans text-xl tracking-wide pt-6 w-full">
          Please confirm your password
        </Text>

        <FloatingInput
          label=" Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          keyboard="default"
          isPassword={!confirmationIsVisible} // If its not visible then that means it is a password. The opposite is true basically
          alertIcon={
            <TouchableOpacity
              onPress={() => setConfirmationIsVisible(!confirmationIsVisible)}
              className="p-4"
            >
              <Entypo
                name={confirmationIsVisible ? "eye-with-line" : "eye"}
                size={24}
                color="white"
              />
            </TouchableOpacity>
          }
        />

        <TouchableOpacity
          disabled={!isReady || loading}
          className={`mt-6 rounded-xl items-center ${
            isReady && !loading ? "bg-[#3377F4]" : "bg-[#3377F4]/50"
          }`}
          onPress={authCreation}
        >
          <Text allowFontScaling={false} className="text-text_main font-bold tracking-widest w-full text-center text-lg p-3">
            {loading ? "Creating..." : "Create Login"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* This will only render if the auth creation was successfull. When they hit ok, it will redirect them to login page. */}
      <CustomAlert
        message={
          <Text>
            Your authentication has been successfully created. You may now
            login.
          </Text>
        }
        visible={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          router.replace("/(auth)/login");
        }}
      />

      {/* Alert shows based on whether its activated based on the button being pressed */}
      <CustomAlert
        message={
          <Text>
            Passwords must be 12-64 characters long and include at least 3 of
            the following character classes: an uppercase letter, a lowercase
            letter, a number, or a symbol. Please note that passwords are
            case-sensitive.
          </Text>
        }
        visible={showAlert}
        onClose={() => setShowAlert(false)}
      />
    </View>
  );
}
