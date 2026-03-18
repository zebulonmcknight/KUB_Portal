import CustomAlert from "@/components/customAlert";
import FloatingInput from "@/components/floatingInput";
import { useRegistration } from "@/components/registrationContext";
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CreateLogin() {

  const router = useRouter();

  const [showAlert, setShowAlert] = useState(false); // State to control the visibility of the custom alert at the header
  const [showSuccess, setShowSuccess] = useState(false); // State to control the visibility of the custom alert after successful account creation
  
  // This is used to track what the user is typing
  const { password, setPassword } = useRegistration();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [confirmationIsVisible, setConfirmationIsVisible] = useState(false);


  const authCreation = async () => {
    try{
      // Do some backend stuff

      // catch some errors

      // if successful reset stuff
      setPassword("");
      setConfirmPassword("");

      // Lets our alert render when its a success.
      setShowSuccess(true);
    }
    // catch errors not explicitly handled
    catch(error: any) {
      Alert.alert("Error", error.message);
    }
  }

  // useRef so that we can wire the keyboard to show 'Next' instead of 'Done' when on account number and zipcode text boxes
  // Need references to zip and ssn as those are the boxes we move to
  // Tell it type is of <TextInput> so that typescript doesnt complain about it not having a type
  const zipCodeRef = useRef<TextInput>(null);
  const ssnRef = useRef<TextInput>(null);

  // Use REGEX to verify that the user only entered digits and that they meet the length requirements
  const validPassword = (password:string) => {
    // Check the length of the password first
    if( password.length < 12 || password.length > 64 ) return false;

    // We set 3 minimum requirements, use this counter to see how many the user abides by.
    let abidedBy = 0;

    if (/[a-z]/.test(password)) abidedBy++; // Check for lowercase
    if (/[A-Z]/.test(password)) abidedBy++; // Check for uppercase
    if (/\d/.test(password)) abidedBy++;    // Check for number
    if (/[^a-zA-Z\d\s]/.test(password)) abidedBy++; // Check for symbol

    // Check if they hit at least 3, which 3 does not matter.
    return abidedBy >= 3;
  }

  // boolean to determine whether one - the password matches our criteria and two - both passwords entered match. Either keeps next button disabled if not correct or allows user to proceed.
  const isReady = ( validPassword(password) && password === confirmPassword );

  return (
    <View className="flex-1 justify-center">
      <Stack.Screen 
         options={{
            title: "Create Login", // Set the header title for this screen
            headerStyle: {
               backgroundColor: '#3377F4', // Match the header background to active theme
            },
            headerShadowVisible: false, // Remove the shadow underneath header for seamless integration with background
            headerRight: () => (
              // Have to use actual button here and not custom modal as react native can't process custom modal in header. Using this as an 'activator' of sorts
              <TouchableOpacity onPress={() => setShowAlert(true)}> 
                <MaterialIcons name="info" size={24} color="white"/>
              </TouchableOpacity>
            )
         }}
      />

      <View className="flex-1 justify-start px-6 pt-4">
        <Text className="text-text_main font-sans text-2xl tracking-wide pt-4 pb-4 w-full">
          Please create a password:
        </Text>

        <Text className="text-text_main font-sans text-xl tracking-wide pt-4 pb-4 w-full">
          Passwords must be 12-64 characters long and include at least 3 of the following character classes: an uppercase letter, a lowercase letter, a number, or a symbol.
        </Text>


        {/* Use input component to make input boxes for the information we need from the user */}
        <FloatingInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          keyboard="default"
          isPassword={!isVisible} // If its not visible then that means it is a password. The opposite is true basically
          alertIcon={
              <TouchableOpacity onPress={() => setIsVisible(!isVisible)} className="p-4">
                <Entypo name={ isVisible ? "eye-with-line": "eye"} size={24} color="white"/>
              </TouchableOpacity>
          }
        />

        <Text className="text-text_main font-sans text-xl tracking-wide pt-6 w-full">
          Please confirm your password
        </Text>

        <FloatingInput
          label=" Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          keyboard="default"
          isPassword={!confirmationIsVisible} // If its not visible then that means it is a password. The opposite is true basically
          alertIcon={
              <TouchableOpacity onPress={() => setConfirmationIsVisible(!confirmationIsVisible)} className="p-4">
                <Entypo name={ confirmationIsVisible ? "eye-with-line": "eye"} size={24} color="white"/>
              </TouchableOpacity>
          }
        />

        <TouchableOpacity
          disabled={!isReady}
          className={`mt-6 rounded-xl items-center ${
            isReady ? 'bg-[#3377F4]' : 'bg-[#3377F4]/50'
          }`}
          onPress={authCreation}
        >
          <Text className="text-text_main font-bold tracking-widest w-full text-center text-lg p-3">
            Create Login
          </Text>
        </TouchableOpacity>
      </View>

      {/* This will only render if the auth creation was successfull. When they hit ok, it will redirect them to login page. */}
      <CustomAlert
        message={
          <Text>
            Your authentication has been successfully created. You may now login.
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
            Passwords must be 12-64 characters long and include at least 3 of the following character classes: an uppercase letter, a lowercase letter, a number, or a symbol. Please note
            that passwords are case-sensitive.
          </Text>
        }
        visible={showAlert}
        onClose={() => setShowAlert(false)}
      />
    </View>
  );
}
