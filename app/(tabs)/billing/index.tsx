import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View, Alert } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { useState } from "react";


export default function Billing() {
  const router = useRouter();
  // paymentSheet used for card processing/payment confirmation
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  // to prevent the user from clicking the button again why the request is still processing
  const [loading, setLoading] = useState(false);

  // invoke the backend API to handle the subscription payment request
  const handleSubscription = async () => {
    try {
      // button has been clicked so lock it from being clicked again
      setLoading(true);

      // pass the email of the user to the backend for customer creation/subscription invocation
      const response = await fetch(
        // HAS TO BE YOUR OWN LOCAL IP FOR MOBILE TESTING
        "http://localhost:3000/api/billing/newCustomerSubscription",
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ email: "testuser4@example.com"}),
        }
      );

      // obtain the clientSecret from successful subscription creation
      const { clientSecret } = await response.json();

      // output error message and return if clientSecret is not obtained
      if( !clientSecret ){
        Alert.alert("Error", "No client secret returned from server");
        return;
      }

      // initialize the payment screen tied to the current customer requesting payment services
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "KUB",
        paymentIntentClientSecret: clientSecret,
      });

      // if the payment screen cannot be initialized for any reason, output error message and return
      if( initError ){
        Alert.alert("Error", initError.message);
        return;
      }

      // actually present the initialized payment screen to the user
      const { error: paymentError } = await presentPaymentSheet();

      // if an error returns during the payment process, output Payment failed along with the error message
      // if there are no errors returned, the payment was successful and the subscription is officially active
      if( paymentError ){
        Alert.alert("Payment failed", paymentError.message);
      }else{
        Alert.alert("Payment Successful", "Subscription Active");
      }
    // catch any other errors not handled explicity
    }catch( error: any) {
      Alert.alert("Error", error.message);
    // regardless of if errors are caught or not, reset the button so it can be clicked once more
    } finally {
      setLoading(false);
    }
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* create the Subscribe button */}
      <TouchableOpacity
        onPress={handleSubscription}
        disabled={loading} // disables the button while request is processing
        className="bg-section p-4 rounded-xl w-full items-center mb-4"
      >
      {/* if the request is current processing, output processing, otherwise output subscribe */}
      <Text className="text-text_main font-bold">
        {loading ? "Processing..." : "Subscribe"}
      </Text>
      </TouchableOpacity>
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
