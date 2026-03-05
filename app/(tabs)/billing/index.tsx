import { useStripe } from "@stripe/stripe-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Billing() {
  const router = useRouter();
  // paymentSheet used for card processing/payment confirmation
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  // to prevent the user from clicking the button again why the request is still processing
  const [loading, setLoading] = useState(false);

  const [billAmount, setBillAmount] = useState(200.00);

  // Grab the screen height so we can display the picture in the background to take up 50% of screen
  const screenHeight = Dimensions.get('window').height;

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
          body: JSON.stringify({ email: "testuser@gmail.com"}),
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
        Alert.alert("Payment Successful", "Thank you for your payment.");
        setBillAmount(0);
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
    <SafeAreaView className="flex-1 bg-primary">
      <Stack.Screen 
        options={{
            headerShown: false,
            headerStyle: {
              backgroundColor: '#3377F4', // Match the header background to active theme
            },
            headerShadowVisible: false, // Remove the shadow underneath header for seamless integration with background
        }}
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 150}}
      >
        <View className="w-full justify-between" style={{height: screenHeight * .55}}>
          {/* Get the image to take up 60% of screen and use absolute so that it doesnt affect other components. Doing 60% to blend image into background */}
          <Image 
            source={require("@/assets/images/mountains.png")}
            resizeMode="cover" // Will zoom in the image until it fits that specified size (60% in our case).
            className="top-0 w-full absolute h-full"
            style={{
              transform: [{ translateY: -60 }] // Basically cropping the image to get rid of some of the sky here.
            }}
          />

          {/* Add a gradient to same area that image takes up. This helps blend the image to the primary background. */}
          <LinearGradient
            colors={ ["rgba(5, 139, 235, 1)", "rgba(5, 139, 235, .6)", "rgba(22, 44, 83, 1)"] }
            locations={[0, 0.2, 1]}
            start={{ x: 0, y: 0 }}
            end={{x: 0, y: .8}}

            className="absolute top-0 w-full h-full"
          />

          <View>
            <Text className="text-text_main font-bold text-3xl text-left w-full p-6 mt-4">Welcome</Text>
              <View className="flex-row justify-between w-full mt-4 px-20">
                <Text className="text-text_main font-sans text-md">Payment Due</Text>
                <Text className="text-text_main font-bold text-md">FEB 2, 2026</Text>
              </View>
          </View>

          <View className="w-full items-center">
            <Text className="text-text_main font-bold text-7xl">
              ${billAmount.toFixed(2)}
            </Text>

            <View className="items-center px-6 py-3 rounded-xl mt-6">
              {/* I added a slight dark background here like the blurred part in your image! */}
              <Text className="text-text_main text-lg">200 W Hill Ave</Text>
              <Text className="text-inactive_text text-lg">Account 8764872181</Text>
            </View>
          </View>

          <View className="w-full px-8">
            {/* create the Subscribe button */}
            <TouchableOpacity
              onPress={handleSubscription}
              disabled={loading} // disables the button while request is processing
              className="bg-active_icon p-4 rounded-xl w-full items-center mb-2"
            >
              {/* if the request is current processing, output processing, otherwise output subscribe */}
              <Text className="text-text_main font-semibold text-xl">
                {loading ? "Processing..." : "PAY NOW"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="p-4 rounded-xl w-full items-center mb-8">
              {/* if the request is current processing, output processing, otherwise output subscribe */}
              <Text className="text-text_main font-semibold text-xl">
                VIEW BILL
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="w-full">
          <TouchableOpacity onPress={() => console.log("Bills & Payments")} className="border-b border-section p-4">
            <Text className="text-text_main bg-primary font-sans text-xl tracking-wide">
              Bills & Payments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => console.log("Payment Method")} className="border-b border-section p-4">
            <Text className="text-text_main bg-primary font-sans text-xl tracking-wide">
              Payment Method
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => console.log("Bill & Payment Programs")} className="border-b border-section p-4">
            <Text className="text-text_main bg-primary font-sans text-xl tracking-wide">
              Bill & Payment Programs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => console.log("Fiber")} className="border-b border-section p-4">
            <Text className="text-text_main bg-primary font-sans text-xl tracking-wide">
              Fiber
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => console.log("Offers & Promotions")} className="border-b border-section p-4">
            <Text className="text-text_main bg-primary font-sans text-xl tracking-wide">
              Offers & Promotions
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
