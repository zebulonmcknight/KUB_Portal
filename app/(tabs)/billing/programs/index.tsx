import ScreenHeader from "@/components/headerStyle";
import { useStripe } from "@stripe/stripe-react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Linking, Text, TouchableOpacity, View } from "react-native";

// Interface for the card
interface ProgramCardProps {
  title: string;
  description: string;
  buttonText: string;
  onPress: () => void;
}

// Since we have 6 cards and they all have the same style, we can make a function to minimize repeating code, giving it the interface we defined above.
function ProgramCard({
  title,
  description,
  buttonText,
  onPress,
}: ProgramCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      className="bg-section rounded-lg overflow-hidden"
    >
      <Text className="p-4 font-sans text-text_main text-2xl tracking-wide">
        {title}
      </Text>
      <Text className="px-4 pb-4 font-sans text-text_main text-lg tracking-wide">
        {description}
      </Text>
      <TouchableOpacity
        onPress={onPress}
        className="border-t items-center py-5"
      >
        <Text className="font-bold text-text_main tracking-widest">
          {buttonText}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function Programs() {
  // paymentSheet used for card processing/payment confirmation
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  // to prevent the user from clicking the button again why the request is still processing
  const [loading, setLoading] = useState(false);
  const [billAmount, setBillAmount] = useState(200.0);
  const router = useRouter();

  // invoke the backend API to handle the subscription payment request
  const handleSubscription = async () => {
    try {
      // button has been clicked so lock it from being clicked again
      setLoading(true);

      // pass the email of the user to the backend for customer creation/subscription invocation
      const response = await fetch(
        // HAS TO BE YOUR OWN LOCAL IP FOR MOBILE TESTING
        "http://192.168.1.198:3000/api/billing/newCustomerSubscription",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "testuser@gmail.com" }),
        },
      );

      // obtain the clientSecret from successful subscription creation
      const { clientSecret } = await response.json();

      // output error message and return if clientSecret is not obtained
      if (!clientSecret) {
        Alert.alert("Error", "No client secret returned from server");
        return;
      }

      // initialize the payment screen tied to the current customer requesting payment services
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "KUB",
        paymentIntentClientSecret: clientSecret,
      });

      // if the payment screen cannot be initialized for any reason, output error message and return
      if (initError) {
        Alert.alert("Error", initError.message);
        return;
      }

      // actually present the initialized payment screen to the user
      const { error: paymentError } = await presentPaymentSheet();

      // if an error returns during the payment process, output Payment failed along with the error message
      // if there are no errors returned, the payment was successful and the subscription is officially active
      if (paymentError) {
        Alert.alert("Payment failed", paymentError.message);
      } else {
        Alert.alert("Payment Successful", "Thank you for your payment.");
        setBillAmount(0);
      }
      // catch any other errors not handled explicity
    } catch (error: any) {
      Alert.alert("Error", error.message);
      // regardless of if errors are caught or not, reset the button so it can be clicked once more
    } finally {
      setLoading(false);
    }
  };

  // Use this state to determine which page we are rendering (payment, billing, giving)
  // Can also use this variable as our 'focused' variable to highlight the current button that is selected
  const [tab, setTab] = useState("payment");

  let tabContent = null;
  if (tab === "payment") {
    tabContent = (
      <View className="gap-4">
        <ProgramCard
          title="AutoPay"
          description="Automatically draft monthly payments from your bank account on or near your due date."
          buttonText="Learn more and enroll"
          onPress={() => router.push("/(tabs)/billing/programs/autoPay")}
        />
        {/* Add strip functionality here as it opens the same page on billing/index. Not using the Program card as it has unique properties */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleSubscription}
          className="bg-section rounded-lg overflow-hidden"
        >
          <Text className="p-4 font-sans text-text_main text-2xl tracking-wide">
            One Time Payment
          </Text>
          <Text className="px-4 pb-4 font-sans text-text_main text-lg tracking-wide">
            Securely save your banking information to conveniently make
            payments.
          </Text>
          <TouchableOpacity
            onPress={handleSubscription}
            className="border-t items-center py-5"
          >
            <Text className="font-bold text-text_main tracking-widest">
              Pay Now
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  } else if (tab === "billing") {
    tabContent = (
      <View className="gap-4">
        <ProgramCard
          title="Levelized Billing"
          description="Levelized Billing helps residential customers keep bills level, despite extreme temperatures."
          buttonText="Learn more and enroll"
          onPress={() =>
            router.push("/(tabs)/billing/programs/levelizedBilling")
          }
        />
        <ProgramCard
          title="Paperless Billing"
          description="Eliminate paper bills and receive electronic bill alerts. It's easy, safe, and good for the environment."
          buttonText="Learn more and enroll"
          onPress={() =>
            router.push("/(tabs)/billing/programs/paperlessBilling")
          }
        />
      </View>
    );
  } else if (tab === "giving") {
    tabContent = (
      <View className="gap-4">
        <ProgramCard
          title="Round It Up"
          description="Help your neighbors imporve their home's energy efficiency by automatically rounding your monthly bill up to the next dollar"
          buttonText="Learn more and enroll"
          onPress={() => router.push("/(tabs)/billing/programs/roundUp")}
        />
        <ProgramCard
          title="Project Help"
          description="Help families in our community stay safe and warm by contributing to Project Help"
          buttonText="Learn more"
          onPress={() =>
            Linking.openURL(
              "https://www.kub.org/about/community/project-help/project-help-donations/",
            )
          }
        />
      </View>
    );
  }

  // Not wrapping the return in an if-else because everything stays the same except for the info under the buttons
  return (
    <View className="flex-1">
      <ScreenHeader title="Bill & Payment Programs" />

      <View className="flex-1 p-4 gap-4">
        <Text className="font-sans text-text_main tracking-wide text-2xl">
          KUB offers several ways to manage your billing and payments.{"\n"}Take
          advantage of the KUB program(s) that are right for you.
        </Text>

        {/* The three buttons */}
        <View className="flex-row justify-center mt-4 mb-4">
          {/* Left button - rounded left only */}
          <TouchableOpacity
            className={`flex-1 justify-center items-center border border-b border-text_main rounded-l-sm py- ${
              tab === "payment" ? "bg-text_main" : "bg-transparent"
            }`}
            onPress={() => setTab("payment")}
          >
            <Text
              className={`font-bold tracking-wide text-lg ${
                tab === "payment" ? "text-active_icon" : "text-text_main"
              }`}
            >
              PAYMENT
            </Text>
          </TouchableOpacity>

          {/* Middle button - no left border to avoid doubling, no rounding */}
          <TouchableOpacity
            className={`flex-1 justify-center items-center border-t border-b border-text_main py-2 ${
              tab === "billing" ? "bg-text_main" : "bg-transparent"
            }`}
            onPress={() => setTab("billing")}
          >
            <Text
              className={`font-bold tracking-wide text-lg ${
                tab === "billing" ? "text-active_icon" : "text-text_main"
              }`}
            >
              BILLING
            </Text>
          </TouchableOpacity>

          {/* Right button - rounded right only */}
          <TouchableOpacity
            className={`flex-1 justify-center items-center border border-b border-text_main rounded-r-sm py-2 ${
              tab === "giving" ? "bg-text_main" : "bg-transparent"
            }`}
            onPress={() => setTab("giving")}
          >
            <Text
              className={`font-bold tracking-wide text-lg ${
                tab === "giving" ? "text-active_icon" : "text-text_main"
              }`}
            >
              GIVING
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conditional rendering */}
        {tabContent}
      </View>
    </View>
  );
}
