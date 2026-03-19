import CustomAlert from "@/components/customAlert";
import FloatingInput from "@/components/floatingInput";
import { useRegistration } from "@/components/registrationContext";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Linking, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CreateLogin() {

  const router = useRouter(); // Allows us to send user to other pages.

  const [showHeaderAlert, setShowHeaderAlert] = useState(false); // State to control the visibility of the custom alert at the header
  const [showAccountAlert, setShowAccountAlert] = useState(false); // State to control the visibility of the alert inside the account number text box
  const [showError, setShowError] = useState(false); // State to control the visibility of the alert when info entered doesn't match an account on record.
  
  // This is used to track what the user is typing
  const { accountNumber, setAccountNumber } = useRegistration();
  const { zipCode, setZipCode } = useRegistration();
  const { ssn, setSSN } = useRegistration();

  // useRef so that we can wire the keyboard to show 'Next' instead of 'Done' when on account number and zipcode text boxes
  // Need references to zip and ssn as those are the boxes we move to
  // Tell it type is of <TextInput> so that typescript doesnt complain about it not having a type
  const zipCodeRef = useRef<TextInput>(null);
  const ssnRef = useRef<TextInput>(null);

  // Use REGEX to verify that the user only entered digits and that they meet the length requirements
  const validAccount = /^\d{10}$/.test(accountNumber);
  const ValidZip = /^\d{5}$/.test(zipCode);
  const ValidSSN = /^\d{4}$/.test(ssn);

  // boolean to determine whether all forms are properly filled. Either keeps next button disabled if not correct or allows user to proceed.
  const isReady = validAccount && ValidZip && ValidSSN;

  // Function to send the information the user entered to the backend to verify that they are an existing customer
  const checkInfo = async () => {
    try{
      router.push("/(auth)/createLogin/contactEmail"); // Send the user to the next page
    }
    catch(error: any) {
      setShowError(true);
    }
  };

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
              <TouchableOpacity onPress={() => setShowHeaderAlert(true)}> 
                <MaterialIcons name="info" size={24} color="white"/>
              </TouchableOpacity>
            )
         }}
      />

      <View className="flex-1 justify-start px-6 pt-4">
        <Text className="text-text_main font-sans text-2xl tracking-wide pt-4 pb-4 w-full">
          Register your account to view and pay your bill, monitor usage, and more.
        </Text>

        {/* Use input component to make input boxes for the information we need from the user */}
        <FloatingInput
          label="Account Number"
          value={accountNumber}
          onChangeText={setAccountNumber}
          keyboard="number-pad"
          maxLength={10}
          keyType="next"
          onSubmitEditing={() => zipCodeRef.current?.focus()}
          alertIcon={
            <TouchableOpacity onPress={() => setShowAccountAlert(true)} className="p-4">
              <MaterialIcons name="info" size={24} color="white"/>
            </TouchableOpacity>
          }
        />
        <CustomAlert
          message={
            <Text>
              Your account number appears in the upper right corner of your paper bill, or on the Summary and History and Manage Account screens when you log into the KUB website. It is 10 digits long.
              If your account number is not recognized, please call customer service at{' '}
              <Text onPress={ () => Linking.openURL(`tel:${8655242911}`)} className="underline">
                (865) 524-2911
              </Text>
              .
            </Text>
          }
          visible={showAccountAlert}
          onClose={() => setShowAccountAlert(false)}
        />

        <FloatingInput
          label="Billing Zip Code"
          value={zipCode}
          onChangeText={setZipCode}
          keyboard="number-pad"
          maxLength={5}
          keyType="next"
          inputRef={zipCodeRef}
          onSubmitEditing={() => ssnRef.current?.focus()}
        />

        <Text className="text-text_main font-sans text-base tracking-wide pt-6 w-full">
          Please confirm the last 4 digits of your Social Security (or Tax ID) Number.
        </Text>

        <FloatingInput
          label="Social Security (or Tax ID) Number"
          value={ssn}
          onChangeText={setSSN}
          keyboard="number-pad"
          maxLength={4}
          inputRef={ssnRef}
          keyType="done"
        />

        <TouchableOpacity
          disabled={!isReady}
          className={`mt-6 rounded-xl items-center ${
            isReady ? 'bg-[#3377F4]' : 'bg-[#3377F4]/50'
          }`}
          onPress={checkInfo}
        >

          {/* NEED TO CONNECT THIS TO AUTH0!!!!! */}
          {/* Have to make sure they are a customer before allowing them to continue further. */}
          <Text className="text-text_main font-bold tracking-widest w-full text-center text-lg p-3">
            NEXT
          </Text>
        </TouchableOpacity>
      </View>

      {/* Alert shows based on whether its activated based on the button being pressed */}
      <CustomAlert
        message={
          <Text>
            You must already have an active account with Knoxville Utilities Board before signing up to use our online services. If you are not yet a KUB customer, please visit{' '}
            <Text onPress={ () => Linking.openURL("https://www.kub.org/start-stop-service")} className="underline">
              www.kub.org/start-stop-service
            </Text>
            {' '}to get started.
          </Text>
        }
        visible={showHeaderAlert}
        onClose={() => setShowHeaderAlert(false)}
      />

      <CustomAlert
        message={
          <Text>
            There was a problem registering your account. Please try again later, or call 865-524-2911 for assistance if the problem persists.
          </Text>
        }
        visible={showError}
        onClose={() => setShowError(false)}
      />
    </View>
  );
}
