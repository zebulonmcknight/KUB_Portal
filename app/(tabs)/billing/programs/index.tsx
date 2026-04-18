import { useAuth } from "@/components/authContext";
import ScreenHeader from "@/components/headerStyle";
import PayNowModal from "@/components/payNowModal";
import { PaymentMethod } from "@/components/paymentPicker";
import { useBillData } from "@/hooks/useBillData";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useStripe } from "@stripe/stripe-react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";

// Shape of a payment method returned from our backend
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
      <Text allowFontScaling={false} className="p-4 font-sans text-text_main text-2xl tracking-wide">
        {title}
      </Text>
      <Text allowFontScaling={false} className="px-4 pb-4 font-sans text-text_main text-lg tracking-wide">
        {description}
      </Text>
      <TouchableOpacity
        onPress={onPress}
        className="border-t items-center py-5"
      >
        <Text allowFontScaling={false} className="font-bold text-text_main tracking-widest">
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
  const router = useRouter();
  const { getToken } = useAuth();
  const { billData, billLoading, fetchBillData } = useBillData();
  const tabBarHeight = useBottomTabBarHeight();

  // Payment method selection state for Pay Now modal
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [methodsLoading, setMethodsLoading] = useState(false);
  const [payModalVisible, setPayModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchBillData();
    }, []),
  );

  // Fetches saved payment methods, pre-selects the default card, and returns the list
  // Returns the array directly so callers can use it immediately without waiting for state to update
  const fetchMethods = async (): Promise<PaymentMethod[]> => {
    setMethodsLoading(true);
    try {
      const access_token = await getToken();
      if (!access_token) {
        Alert.alert("Session Expired", "Please log in again");
        return [];
      }

      const response = await fetch("https://kubportal-production.up.railway.app/api/billing/paymentMethods", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) {
        Alert.alert("Error", "Failed to fetch payment methods");
        return [];
      }

      const { methods: fetched } = await response.json();

      // Stripe returns newest first so reverse for oldest to newest display order
      const sorted = [...fetched].reverse();
      setMethods(sorted);

      // Pre-select the default card, fall back to first card if no default set
      const defaultCard = sorted.find((m: PaymentMethod) => m.isDefault);
      setSelectedId(defaultCard?.id ?? sorted[0]?.id ?? null);

      return sorted;
    } catch (error: any) {
      Alert.alert("Error", error.message);
      return [];
    } finally {
      setMethodsLoading(false);
    }
  };

  // Called when Pay Now is tapped — fetches methods first then decides which flow to use
  const handlePayment = async () => {
    try {
      // button has been clicked so lock it from being clicked again
      setLoading(true);

      const access_token = await getToken();
      if (!access_token) {
        Alert.alert("Session Expired", "Please log in again");
        return;
      }

      // Use returned array directly to avoid stale state timing issue
      const fetched = await fetchMethods();

      // If no saved methods skip the modal and go straight to PaymentSheet
      if (fetched.length === 0) {
        await handlePayWithNewCard(access_token);
        return;
      }

      setPayModalVisible(true);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Pays the invoice using a saved card — backend confirms the PaymentIntent directly
  const handlePayWithExisting = async () => {
    if (!selectedId) return;
    setPayModalVisible(false);

    try {
      // button has been clicked so lock it from being clicked again
      setLoading(true);

      const access_token = await getToken();
      if (!access_token) {
        Alert.alert("Session Expired", "Please log in again");
        return;
      }

      const response = await fetch(
        // HAS TO BE YOUR OWN LOCAL IP FOR MOBILE TESTING
        "https://kubportal-production.up.railway.app/api/billing/payInvoice",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify({ paymentMethodId: selectedId }),
        },
      );

      if (!response.ok) {
        Alert.alert("Error", "Payment failed");
        return;
      }

      // refresh the bill data to reflect the payment
      await fetchBillData();
      Alert.alert("Success", "Your payment was successful.");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Pays the invoice using a new card via the PaymentSheet
  const handlePayWithNewCard = async (access_token: string) => {
    try {
      setLoading(true);
      setPayModalVisible(false);

      // get the client secret for the open invoice
      const response = await fetch(
        // HAS TO BE YOUR OWN LOCAL IP FOR MOBILE TESTING
        "https://kubportal-production.up.railway.app/api/billing/payInvoice",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      if (!response.ok) {
        Alert.alert("Error", "Failed to initialize payment");
      }

      // obtain the clientSecret from successful intent creation
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
      }
      // catch any other errors not handled explicitly
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
          onPress={() => router.navigate("/(tabs)/billing/programs/autoPay")}
        />
        {/* Add strip functionality here as it opens the same page on billing/index. Not using the Program card as it has unique properties */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={handlePayment}
          disabled={loading || billData?.status !== "open"}
          className={`bg-section rounded-lg overflow-hidden ${
            loading || billData?.status !== "open"
              ? "opacity-50"
              : "opacity-100"
          }`}
        >
          <Text allowFontScaling={false} className="p-4 font-sans text-text_main text-2xl tracking-wide">
            One Time Payment
          </Text>
          <Text allowFontScaling={false} className="px-4 pb-4 font-sans text-text_main text-lg tracking-wide">
            Securely save your banking information to conveniently make
            payments.
          </Text>
          <TouchableOpacity
            onPress={handlePayment}
            disabled={loading || billData?.status !== "open"}
            className="border-t items-center py-5"
          >
            <Text allowFontScaling={false} className="font-bold text-text_main tracking-widest">
              {loading ? "Processing..." : "Pay Now"}
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
            router.navigate("/(tabs)/billing/programs/levelizedBilling")
          }
        />
        <ProgramCard
          title="Paperless Billing"
          description="Eliminate paper bills and receive electronic bill alerts. It's easy, safe, and good for the environment."
          buttonText="Learn more and enroll"
          onPress={() =>
            router.navigate("/(tabs)/billing/programs/paperlessBilling")
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
          onPress={() => router.navigate("/(tabs)/billing/programs/roundUp")}
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
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: tabBarHeight }}
    >
      
      <View className="flex-1">
        <ScreenHeader title="Bill & Payment Programs" />

        <View className="flex-1 p-4 gap-4">
          <Text allowFontScaling={false} className="font-sans text-text_main tracking-wide text-2xl">
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

        {/* Pay Now full page modal */}
        <PayNowModal
          visible={payModalVisible}
          onClose={() => setPayModalVisible(false)}
          methods={methods}
          methodsLoading={methodsLoading}
          selectedId={selectedId}
          onSelectId={(id) => {
            setSelectedId(id);
            setDropdownOpen(false);
          }}
          dropdownOpen={dropdownOpen}
          onToggleDropdown={() => setDropdownOpen(!dropdownOpen)}
          onConfirm={handlePayWithExisting}
          onAddNew={async () => {
            const access_token = await getToken();
            if (!access_token) {
              Alert.alert("Session Expired", "Please log in again");
              return;
            }
            await handlePayWithNewCard(access_token);
          }}
          totalAmountDue={billData?.totalAmountDue ?? 0}
          dueDate={billData?.dueDate ?? null}
        />
      </View>
    </ScrollView>
  );
}
