import { useAuth } from "@/components/authContext";
import ScreenHeader from "@/components/headerStyle";
import { useBillData } from "@/hooks/useBillData";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Linking,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaperlessBilling() {
  const { getToken } = useAuth();
  const { billData, billLoading, fetchBillData } = useBillData();
  const [loading, setLoading] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchBillData();
    }, []),
  );

   const handleToggle = async () => {
      try {
         setLoading(true);
         const access_token = await getToken();
         if (!access_token) {
            Alert.alert("Session Expired", "Please log in again");
            return;
         }

         const response = await fetch("https://kubportal-production.up.railway.app/api/billing/paperless/toggle", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${access_token}`,
            },
         });

      if (!response.ok) {
        Alert.alert("Error", "Failed to update paperless billing");
        return;
      }

      // Refresh bill data so isPaperless updates and button swaps
      await fetchBillData();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Show spinner on initial load before any data exists
  if (billLoading && !billData) {
    return (
      <View className="flex-1 justify-center items-center">
        <ScreenHeader title="Paperless Billing" />
        <ActivityIndicator size="large" color="#3377F4" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ScreenHeader title="Paperless Billing" />
      <View className="flex-1 p-6 gap-6">
        <Text className="text-text_main font-bold text-2xl tracking-wide leading-10">
          Receive and view your bills easily through email.
        </Text>
        <Text className="text-text_main font-sans text-xl tracking-wide leading-8">
          No more hunting for your paper bill. Elect to receive your bill via
          email as soon as it's ready, instead of in the mail. Paperless Billing
          saves time and saves paper. It's easy for you and is good for the
          environment.
        </Text>

        {/* "Learn more" is tappable, "about Paperless Billing" is plain text inline */}
        <Text
          className="text-active_icon font-sans text-xl"
          onPress={() =>
            Linking.openURL(
              "https://www.kub.org/bills-payments/billing-options/paperless-billing/",
            )
          }
        >
          Learn more{" "}
          <Text className="text-text_main">about Paperless Billing</Text>
        </Text>

        <Text className="text-text_main font-sans text-base tracking-wide leading-6">
          By enrolling in Paperless Billing, you accept KUB's{" "}
          {/* Opens the T&C modal instead of linking out */}
          <Text
            className="text-active_icon"
            onPress={() => setTermsVisible(true)}
          >
            Paperless Billing Terms and Conditions.
          </Text>
        </Text>

        {/* Button swaps between enroll and unenroll based on current paperless status */}
        <TouchableOpacity
          disabled={loading}
          className={`mt-2 rounded-xl items-center bg-[#3377F4] ${loading ? "opacity-50" : "opacity-100"}`}
          onPress={handleToggle}
        >
          <Text className="text-text_main font-bold tracking-widest text-lg p-4">
            {loading
              ? "Processing..."
              : billData?.isPaperless
                ? "UNENROLL FROM PAPERLESS BILLING"
                : "ENROLL IN PAPERLESS BILLING"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Paperless Billing Terms and Conditions modal */}
      <Modal
        visible={termsVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setTermsVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-primary">
          {/* Header */}
          <View className="flex-row items-center px-4 py-3">
            <TouchableOpacity
              onPress={() => setTermsVisible(false)}
              className="p-2"
            >
              <Text className="text-text_main text-2xl">✕</Text>
            </TouchableOpacity>
            <Text className="text-text_main font-bold text-xl ml-4">
              Terms and Conditions
            </Text>
          </View>

          <View className="flex-1 p-6 gap-6">
            <Text className="text-text_main font-bold text-2xl tracking-wide leading-10">
              Paperless Billing Terms and Conditions:
            </Text>
            <Text className="text-text_main font-sans text-xl tracking-wide leading-8">
              By continuing, you authorize KUB to stop sending you monthly paper
              bills and start e-mailing you when your monthly bill is available
              on your My Account page. You agree to pay your bill (including any
              late fees) whether or not you receive an e-mail notice or are able
              to access your paperless bill. [If you can't access your bill, you
              may call KUB at (865) 524-2911 for your payment amount.] You are
              still bound by all KUB rules and regulations (which are subject to
              change) even if you do not receive a paper bill or e-mail notice.
              KUB reserves the right to secure accounts in default of payment of
              services rendered. Additionally, all legal, late fees, and
              collection expenses including, but not limited to, principal and
              interest become the liability of the recipient.
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
