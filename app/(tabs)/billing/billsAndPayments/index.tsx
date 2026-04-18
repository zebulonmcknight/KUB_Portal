import { useAuth } from "@/components/authContext";
import ScreenHeader from "@/components/headerStyle";
import { icons } from "@/constants/icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { format, parseISO } from "date-fns";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Types matching what the backend returns from getInvoiceHistoryController
type InvoiceItem = {
  type: "invoice";
  id: string;
  invoiceDate: string;
  amountDue: number;
  dueDate: string | null;
  invoicePdf: string | null;
};

type PaymentItem = {
  type: "payment";
  id: string;
  paymentDate: string;
  paymentAmount: number;
  paymentType: string;
  paymentStatus: string;
  invoiceId: string;
};

type BillingItem = InvoiceItem | PaymentItem;

export default function BillsAndPayments() {
  const { getToken } = useAuth();
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();

  const [billingData, setBillingData] = useState<BillingItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Fetch invoice history on each focus
  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, []),
  );

  const fetchHistory = async () => {
    setDataLoading(true);
    try {
      const access_token = await getToken();
      if (!access_token) {
        Alert.alert("Session Expired", "Please log in again");
        return;
      }

         const response = await fetch("https://kubportal-production.up.railway.app/api/billing/invoiceHistory", {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${access_token}`,
            },
         });

      if (!response.ok) {
        Alert.alert("Error", "Failed to fetch billing history");
        return;
      }

      const { items } = await response.json();
      setBillingData(items);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setDataLoading(false);
    }
  };

  const openPDF = async (url: string, id: string) => {
    try {
      setLoadingId(id); // Set only that specific ID to a loading state so it doesnt affect others
      await Linking.openURL(url);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoadingId(null); // Afterwards set the id to null to revert state
    }
  };

  // Show spinner on initial load only
  if (dataLoading && billingData.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <ScreenHeader title="Bills & Payments" />
        <ActivityIndicator size="large" color="#3377F4" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center">
      <ScreenHeader title="Bills & Payments" />
      <FlatList
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarHeight }}
        data={billingData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          if (item.type === "payment") {
            return (
              // If the user wants to view their payment send them to the dynamic routing with the id of said payment attached
              // Payment data is passed as a JSON param to avoid making the same fetch on the detail screen
              <TouchableOpacity
                onPress={() =>
                  router.navigate({
                    pathname: "/(tabs)/billing/billsAndPayments/[paymentId]",
                    params: {
                      paymentId: item.id,
                      payment: JSON.stringify(item),
                    },
                  })
                }
                className="border-b border-section p-3 flex-row mx-4 items-center gap-4"
              >
                <Image
                  source={icons.paid_bill}
                  style={{ width: 14, height: 14 }}
                />
                <View className="flex-col">
                  <Text allowFontScaling={false} className="text-text_main bg-primary font-sans text-xl tracking-wide">
                    {/* Dates are saved in ISO format so have to parse it first before being able to print */}
                    {format(parseISO(item.paymentDate), "MMM dd, yyyy")}
                  </Text>
                  <Text allowFontScaling={false} className="text-inactive_text font-sans text-sm tracking-wide">
                    ${item.paymentAmount.toFixed(2)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }
          return (
            // Other option is viewing the invoice. As of now we download a publicly available pdf to cache and then open sharing for the user.
            // invoicePdf can be null if Stripe hasn't finalized the invoice yet so have alert statement
            <TouchableOpacity
              onPress={() =>
                item.invoicePdf
                  ? openPDF(item.invoicePdf, item.id)
                  : Alert.alert(
                      "Unavailable",
                      "No PDF available for this invoice.",
                    )
              }
              className="border-b border-section p-3 flex-row mx-4 items-center gap-4"
            >
              <Image source={icons.invoice} style={{ width: 14, height: 14 }} />
              <View className="flex-col">
                <Text allowFontScaling={false} className="text-text_main bg-primary font-sans text-xl tracking-wide">
                  {loadingId === item.id
                    ? "Loading..."
                    : format(parseISO(item.invoiceDate), "MMM dd, yyyy")}
                </Text>
                <Text allowFontScaling={false} className="text-inactive_text font-sans text-sm tracking-wide">
                  ${item.amountDue.toFixed(2)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
