import { useAuth } from "@/components/authContext";
import ScreenHeader from "@/components/headerStyle";
import PaymentPicker, { PaymentMethod } from "@/components/paymentPicker";
import { useBillData } from "@/hooks/useBillData";
import { useStripe } from "@stripe/stripe-react-native";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Linking,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function AutoPay() {
  const { getToken } = useAuth();
  const { billData, billLoading, fetchBillData } = useBillData();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  // Prevents the button from being pressed again
  const [loading, setLoading] = useState(false);

  // Payment method selection state
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [methodsLoading, setMethodsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch bill data each time the screen is focused so isAutoPay is always up to date
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

      const response = await fetch(
        "http://localhost:3000/api/billing/paymentMethods",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

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

  // Called when user taps Enroll, fetches methods first then decides which flow to use
  const handleEnrollPress = async () => {
    const access_token = await getToken();
    if (!access_token) {
      Alert.alert("Session Expired", "Please log in again");
      return;
    }

    // Use returned array directly to avoid stale state timing issue
    const fetched = await fetchMethods();

    // If no saved methods skip the modal and go straight to SetupSheet
    if (fetched.length === 0) {
      await handleAddNewCard(access_token);
      return;
    }

    // Otherwise show the modal so user can pick a card or add new
    setModalVisible(true);
  };

  // Launches the SetupSheet to collect a new card, then enrolls with the resulting setupIntentId
  const handleAddNewCard = async (access_token: string) => {
    try {
      setLoading(true);
      setModalVisible(false);

      // Create a SetupIntent to initialize the sheet
      const setupResponse = await fetch(
        "http://localhost:3000/api/billing/autopay/setup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      if (!setupResponse.ok) {
        Alert.alert("Error", "Failed to initialize card setup");
        return;
      }

      const { clientSecret } = await setupResponse.json();
      if (!clientSecret) {
        Alert.alert("Error", "No client secret returned from server");
        return;
      }

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "KUB",
        setupIntentClientSecret: clientSecret,
      });

      if (initError) {
        Alert.alert("Error", initError.message);
        return;
      }

      const { error: sheetError } = await presentPaymentSheet();
      if (sheetError) {
        Alert.alert("Error", sheetError.message);
        return;
      }

      // The setupIntentId is embedded in the clientSecret before '_secret_'
      // e.g. "seti_ABC123_secret_XYZ" → "seti_ABC123"
      // Backend uses this to retrieve the completed intent and extract the payment method
      const setupIntentId = clientSecret.split("_secret_")[0];
      await enrollWithIntent(access_token, setupIntentId);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Enrolls using an existing saved payment method
  const handleConfirmExisting = async () => {
    if (!selectedId) return;
    setModalVisible(false);

    try {
      setLoading(true);
      const access_token = await getToken();
      if (!access_token) {
        Alert.alert("Session Expired", "Please log in again");
        return;
      }

      const response = await fetch(
        "http://localhost:3000/api/billing/autopay/enroll",
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
        Alert.alert("Error", "Failed to enroll in AutoPay");
        return;
      }

      // Refresh bill data so isAutoPay updates and button swaps to Cancel
      await fetchBillData();
      Alert.alert("Success", "You have been enrolled in AutoPay.");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Shared enroll call used after SetupSheet completes, sends setupIntentId to backend
  const enrollWithIntent = async (
    access_token: string,
    setupIntentId: string,
  ) => {
    const enrollResponse = await fetch(
      "http://localhost:3000/api/billing/autopay/enroll",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ setupIntentId }),
      },
    );

    if (!enrollResponse.ok) {
      Alert.alert("Error", "Failed to enroll in AutoPay");
      return;
    }

    // Refresh bill data so isAutoPay updates and button swaps to Cancel
    await fetchBillData();
    Alert.alert("Success", "You have been enrolled in AutoPay.");
  };

  // Shows a confirmation alert before cancelling AutoPay
  const handleCancel = () => {
    Alert.alert("Cancel AutoPay", "Are you sure you want to cancel AutoPay?", [
      { text: "No" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            setLoading(true);
            const access_token = await getToken();
            if (!access_token) {
              Alert.alert("Session Expired", "Please log in again");
              return;
            }

            const response = await fetch(
              "http://localhost:3000/api/billing/autopay/cancel",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${access_token}`,
                },
              },
            );

            if (!response.ok) {
              Alert.alert("Error", "Failed to cancel AutoPay");
              return;
            }

            // Refresh bill data so isAutoPay updates and button swaps back to Enroll
            await fetchBillData();
            Alert.alert("Success", "AutoPay has been cancelled.");
          } catch (error: any) {
            Alert.alert("Error", error.message);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  // Show spinner on initial load before any data exists
  // Subsequent refreshes update silently without blocking the UI
  if (billLoading && !billData) {
    return (
      <View className="flex-1 justify-center items-center">
        <ScreenHeader title="AutoPay" />
        <ActivityIndicator size="large" color="#3377F4" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ScreenHeader title="AutoPay" />
      <View className="flex-1 p-6 gap-6">
        <Text className="text-text_main font-bold text-2xl tracking-wide leading-10">
          AutoPay ensures that your bill is always paid on time.
        </Text>
        <Text className="text-text_main font-sans text-2xl tracking-widest leading-10">
          Payments are automatically drafted from your saved payment method on
          or near your bill due date each month.
        </Text>
        <Text className="text-text_main font-sans text-xl tracking-wide leading-7">
          You will continue to receive a monthly statement that looks like a
          normal bill, but which shows Amount to be drafted. You can unenroll
          from AutoPay at any time.
        </Text>

        {/* "Learn more" is tappable, "about AutoPay" is plain text inline */}
        <Text
          className="text-active_icon font-sans text-xl"
          onPress={() =>
            Linking.openURL("https://www.kub.org/bills-payments/autopay")
          }
        >
          Learn more <Text className="text-text_main">about AutoPay</Text>
        </Text>

        {/* Single button that swaps between enroll and cancel based on current autopay status */}
        <TouchableOpacity
          disabled={loading}
          className={`mt-4 rounded-xl items-center bg-[#3377F4] ${loading ? "opacity-50" : "opacity-100"}`}
          onPress={billData?.isAutoPay ? handleCancel : handleEnrollPress}
        >
          <Text className="text-text_main font-bold tracking-widest text-lg p-4">
            {loading
              ? "Processing..."
              : billData?.isAutoPay
                ? "CANCEL AUTOPAY"
                : "ENROLL IN AUTOPAY"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Payment method picker modal */}
      <PaymentPicker
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        methods={methods}
        methodsLoading={methodsLoading}
        selectedId={selectedId}
        onSelectId={(id) => {
          setSelectedId(id);
          setDropdownOpen(false);
        }}
        dropdownOpen={dropdownOpen}
        onToggleDropdown={() => setDropdownOpen(!dropdownOpen)}
        onConfirm={handleConfirmExisting}
        onAddNew={async () => {
          const access_token = await getToken();
          if (!access_token) {
            Alert.alert("Session Expired", "Please log in again");
            return;
          }
          await handleAddNewCard(access_token);
        }}
      />
    </View>
  );
}
