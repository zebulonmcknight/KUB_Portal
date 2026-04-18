import { useAuth } from "@/components/authContext";
import PayNowModal from "@/components/payNowModal";
import { PaymentMethod } from "@/components/paymentPicker";
import { icons } from "@/constants/icons";
import { useBillData } from "@/hooks/useBillData";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useStripe } from "@stripe/stripe-react-native";
import { format } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Billing() {
  // Gets the token from our auth context
  const { getToken } = useAuth();
  const { billData, billLoading, fetchBillData } = useBillData();
  const router = useRouter();
  // paymentSheet used for card processing/payment confirmation
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  // to prevent the user from clicking the button again why the request is still processing
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Payment method selection state for PAY NOW modal
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [methodsLoading, setMethodsLoading] = useState(false);
  const [payModalVisible, setPayModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Grab the screen height so we can display the picture in the background to take up 50% of screen
  const { height, width } = useWindowDimensions();
  const tabBarHeight = useBottomTabBarHeight();

  useFocusEffect(
    useCallback(() => {
      fetchBillData();
    }, []),
  );

  // Since the due date can be null if they dont have previous invoice we account for that here
  const formattedDueDate = billData?.dueDate
    ? format(new Date(billData.dueDate), "MMM dd, yyyy")
    : "-";

  // invoke the backend API to handle the payment request
  // Fetches saved payment methods and pre-selects the default card
  // Returns the array directly so callers can use it immediately without waiting for state to update
  const fetchMethods = async (): Promise<PaymentMethod[]> => {
    setMethodsLoading(true);
    try {
      const access_token = await getToken();
      if (!access_token) {
        Alert.alert("Session Expired", "Please log in again");
        return [];
      }

      const response = await fetch("http://localhost:3000/api/billing/paymentMethods", {
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

  // Called when PAY NOW is tapped, fetches methods first then decides which flow to use
  const handlePayment = async () => {
    try {
      setLoading(true);
      const access_token = await getToken();
      if (!access_token) {
        Alert.alert("Session Expired", "Please log in again");
        return;
      }

      // Use returned array directly to avoid timing issue
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

  // Pays the invoice using a saved card, backend confirms the PaymentIntent directly
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
        "http://localhost:3000/api/billing/payInvoice",
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
        "http://localhost:3000/api/billing/payInvoice",
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
        return;
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
      } else {
        // refresh the bill data to reflect the payment
        await fetchBillData();
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
      // regardless of if errors are caught or not, reset the button so it can be clicked once more
    } finally {
      setLoading(false);
    }
  };

  // Function to open the invoice
  const openPDF = async () => {
    try {
      setPdfLoading(true);
      if (!billData?.invoicePdf) {
        Alert.alert("Error", "No invoice available");
        return;
      }
      await Linking.openURL(billData.invoicePdf);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setPdfLoading(false);
    }
  };



  // Show a loading indicator if waiting on api call or if we have no billData yet
  // Should only run on first instance
  if (billLoading && !billData) {
    return (
      <SafeAreaView className="flex-1 bg-primary items-center justify-center">
        <ActivityIndicator size="large" color="#3377F4" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-primary" edges={['top', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarHeight }}
      >
        <View
          className="w-full justify-between"
          style={{ height: height * 0.55 }}
        >
          {/* Get the image to take up 60% of screen and use absolute so that it doesnt affect other components. Doing 60% to blend image into background */}
          <Image
            source={require("@/assets/images/mountains.jpg")}
            resizeMode="cover" // Will zoom in the image until it fits that specified size (60% in our case).
            className="top-0 w-full absolute h-full"
            style={{
              transform: [{ translateY: -height * 0.07 }],
            }}
          />

          {/* Add a gradient to same area that image takes up. This helps blend the image to the primary background. */}
          <LinearGradient
            colors={[
              "rgba(5, 139, 235, 1)",
              "rgba(5, 139, 235, .6)",
              "rgba(22, 44, 83, 1)",
            ]}
            locations={[0, 0.2, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.8 }}
            style={{
              position: "absolute",
              top: 0,
              width: "100%",
              height: "100%",
            }}
          />

          <View>
            <Text allowFontScaling={false} className="text-text_main font-bold text-3xl text-left w-full p-6"  style={{ marginTop: height * 0.02 }}>
              Welcome
            </Text>
            <View className="flex-row justify-between w-full" style={{paddingHorizontal: width * .17, marginTop: height * .02}}>
              <Text allowFontScaling={false} className="text-text_main font-sans text-base">
                Payment Due
              </Text>
              <Text allowFontScaling={false} className="text-text_main font-bold text-base">
                {formattedDueDate}
              </Text>
            </View>
          </View>

          <View className="w-full items-center">
            <Text allowFontScaling={false} className="text-text_main font-bold text-7xl">
              ${billData ? billData.totalAmountDue.toFixed(2) : "0.00"}
            </Text>

            <View className="items-center rounded-xl" style={{marginTop: height * .03 }}>
              {/* I added a slight dark background here like the blurred part in your image! */}
              <Text allowFontScaling={false} className="text-text_main text-lg">200 W Hill Ave</Text>
              <Text allowFontScaling={false} className="text-inactive_text text-lg">
                Account 8764872181
              </Text>
            </View>
          </View>

          <View className="w-full" style={{paddingHorizontal: width * .08}}>
            {/* create the Subscribe button */}
            <TouchableOpacity
              onPress={handlePayment}
              disabled={loading || billData?.status !== "open"} // disables the button while request is processing
              className={` p-4 rounded-xl w-full items-center mb-2 ${
                loading || billData?.status === "open"
                  ? "bg-active_icon"
                  : "bg-active_icon/50"
              }`}
            >
              {/* if the request is current processing, output processing, otherwise output subscribe */}
              <Text allowFontScaling={false} className="text-text_main font-semibold text-xl">
                {loading ? "Processing..." : "PAY NOW"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={openPDF}
              disabled={pdfLoading || !billData?.invoicePdf}
              className="p-4 rounded-xl w-full items-center mb-8"
            >
              <Text allowFontScaling={false} className="text-text_main font-semibold text-xl">
                {pdfLoading ? "Loading..." : "VIEW BILL"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="w-full">
          <TouchableOpacity
            onPress={() => router.navigate("/(tabs)/billing/billsAndPayments")}
            className="border-b border-section py-4 flex-row mx-4 items-center"
          >
            <Image source={icons.billing} style={{ width: 18, height: 18 }} />
            <Text allowFontScaling={false} className="text-text_main bg-primary font-sans text-xl tracking-wide mx-4">
              Bills & Payments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.navigate("/(tabs)/billing/paymentMethod")}
            className="border-b border-section py-4 flex-row mx-4 items-center"
          >
            <Image
              source={icons.payment_method}
              style={{ width: 18, height: 18 }}
            />
            <Text allowFontScaling={false} className="text-text_main bg-primary font-sans text-xl tracking-wide mx-4">
              Payment Method
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.navigate("/(tabs)/billing/programs")}
            className="border-b border-section py-4 flex-row mx-4 items-center"
          >
            <Image
              source={icons.payment_program}
              style={{ width: 18, height: 18 }}
            />
            <Text allowFontScaling={false} className="text-text_main bg-primary font-sans text-xl tracking-wide mx-4">
              Bill & Payment Programs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.kub.org/fiber-shopping")
            }
            className="border-b border-section py-4 flex-row mx-4 items-center"
          >
            <Image source={icons.fiber} style={{ width: 18, height: 18 }} />
            <Text allowFontScaling={false} className="text-text_main bg-primary font-sans text-xl tracking-wide mx-4">
              Fiber
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.navigate("/(tabs)/billing/promotions")}
            className="border-b border-section flex-row mx-4 py-4 items-center"
          >
            <Image
              source={icons.promotions}
              style={{ width: 18, height: 18 }}
            />
            <Text allowFontScaling={false} className="text-text_main bg-primary font-sans text-xl tracking-wide mx-4">
              Offers & Promotions
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
    </SafeAreaView>
  );
}
