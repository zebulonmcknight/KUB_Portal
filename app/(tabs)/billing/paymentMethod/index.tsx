import { useAuth } from "@/components/authContext";
import ScreenHeader from "@/components/headerStyle";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useStripe } from "@stripe/stripe-react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Shape of paymentMethod returned from our backend
type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
};

export default function PaymentMethod() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const tabBarHeight = useBottomTabBarHeight();

  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [methodsLoading, setMethodsLoading] = useState(false);
  const [loading, setLoading] = useState(false); // for add payment button
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null); // tracks which rows menu is open
  const [loadingId, setLoadingId] = useState<string | null>(null); // tracks which row is doing an action

  // fetch saved payment methods on focus so list stays updated after add/delete
  useFocusEffect(
    useCallback(() => {
      fetchMethods();
    }, []),
  );

  const fetchMethods = async () => {
    try {
      setMethodsLoading(true);
      const access_token = await getToken();
      if (!access_token) {
        Alert.alert("Session Expired", "Please log in again");
        return;
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
        return;
      }

      const { methods } = await response.json();

      // Pin default to top, sort the rest oldest to newest by Stripe's created order
      // Stripe returns cards newest first so we reverse for the non-default ones
      const sorted = [...methods].reverse();
      setMethods(sorted);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setMethodsLoading(false);
    }
  };

  // Detaches the card from the Stripe customer and refreshes the list
  const handleDelete = async (id: string) => {
    Alert.alert("Remove Card", "Are you sure you want to remove this card?", [
      { text: "No" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            setLoadingId(id);
            setMenuOpenId(null);
            const access_token = await getToken();
            if (!access_token) {
              Alert.alert("Session Expired", "Please log in again");
              return;
            }

                     const response = await fetch("https://kubportal-production.up.railway.app/api/billing/paymentMethods/remove", {
                        method: "POST",
                        headers: {
                           "Content-Type": "application/json",
                           Authorization: `Bearer ${access_token}`,
                        },
                        body: JSON.stringify({ paymentMethodId: id }),
                     });

            if (!response.ok) {
              Alert.alert("Error", "Failed to remove payment method");
              return;
            }

            await fetchMethods();
          } catch (error: any) {
            Alert.alert("Error", error.message);
          } finally {
            setLoadingId(null);
          }
        },
      },
    ]);
  };

  // Updates the customer's default payment method on Stripe and refreshes
  const handleSetDefault = async (id: string) => {
    try {
      setLoadingId(id);
      setMenuOpenId(null);
      const access_token = await getToken();
      if (!access_token) {
        Alert.alert("Session Expired", "Please log in again");
        return;
      }

         const response = await fetch("https://kubportal-production.up.railway.app/api/billing/paymentMethods/setDefault", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify({ paymentMethodId: id }),
         });

      if (!response.ok) {
        Alert.alert("Error", "Failed to set default payment method");
        return;
      }

      await fetchMethods();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoadingId(null);
    }
  };

  // Launches SetupSheet to collect a new card, then saves it via addPaymentMethod endpoint
  const handleAddNew = async () => {
    try {
      setLoading(true);
      const access_token = await getToken();
      if (!access_token) {
        Alert.alert("Session Expired", "Please log in again");
        return;
      }

         // Create a SetupIntent to initialize the sheet
         const setupResponse = await fetch("https://kubportal-production.up.railway.app/api/billing/autopay/setup", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${access_token}`,
            },
         });

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

      // Extract setupIntentId from clientSecret and save the payment method
      const setupIntentId = clientSecret.split("_secret_")[0];

         const addResponse = await fetch("https://kubportal-production.up.railway.app/api/billing/paymentMethods/add", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify({ setupIntentId }),
         });

      if (!addResponse.ok) {
        Alert.alert("Error", "Failed to save payment method");
        return;
      }

      await fetchMethods();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentMethod = (item: PaymentMethod) => {
    const isMenuOpen = menuOpenId === item.id;
    const isItemLoading = loadingId === item.id;

    return (
      <View
        key={item.id}
        className="border-b border-section py-4 flex-row items-center justify-between"
      >
        <View className="gap-1">
          {/* Default badge shown inline with card type */}
          <View className="flex-row items-center gap-2">
            <Text allowFontScaling={false} className="text-text_main text-xl font-sans tracking-wide">
              Credit / Debit Card
            </Text>
            {item.isDefault && (
              <View className="bg-active_icon px-2 py-0.5 rounded-full">
                <Text allowFontScaling={false} className="text-text_main text-xs font-bold">
                  Default
                </Text>
              </View>
            )}
          </View>
          <Text allowFontScaling={false} className="text-inactive_text text-sm font-sans tracking-wide">
            **** {item.last4}
          </Text>
          <Text allowFontScaling={false} className="text-inactive_text text-sm font-sans tracking-wide">
            {item.brand.toUpperCase()} EXP.{" "}
            {String(item.expMonth).padStart(2, "0")}/
            {String(item.expYear).slice(-2)}
          </Text>
        </View>

        <View className="items-end">
          {isItemLoading ? (
            <ActivityIndicator size="small" color="#3377F4" className="p-4" />
          ) : (
            <TouchableOpacity
              onPress={() => setMenuOpenId(isMenuOpen ? null : item.id)}
              className="py-1"
            >
              <Text allowFontScaling={false} className="text-blue-500 text-2xl p-4 leading-none">⋮</Text>
            </TouchableOpacity>
          )}

          {isMenuOpen && (
            <View className="bg-section mr-4 rounded-lg overflow-hidden">
              {/* Only show Set as Default if not already default */}
              {!item.isDefault && methods.length > 1 && (
                <TouchableOpacity
                  onPress={() => handleSetDefault(item.id)}
                  className="px-4 py-2 border-b border-inactive_icon"
                >
                  <Text allowFontScaling={false} className="text-text_main text-base font-sans">
                    Set as Default
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                className="px-4 py-2"
              >
                <Text allowFontScaling={false} className="text-red-500 text-base font-sans">Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (methodsLoading && methods.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <ScreenHeader title="Payment Method" />
        <ActivityIndicator size="large" color="#3377F4" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ScreenHeader title="Payment Method" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarHeight }}
      >
        <View className="ml-4 mt-12">
          <Text allowFontScaling={false} className="text-text_main tracking-wide text-xl font-bold">
            Saved Payment Methods
          </Text>

          {methods.map(renderPaymentMethod)}

          {/* Add Payment Method row */}
          <TouchableOpacity
            onPress={handleAddNew}
            disabled={loading}
            className={`border-b border-section flex-row items-center justify-between ${loading ? "opacity-50" : "opacity-100"}`}
          >
            <Text allowFontScaling={false} className="text-text_main text-xl font-sans tracking-wide">
              {loading ? "Processing..." : "Add Payment Method"}
            </Text>
            <Text allowFontScaling={false} className="text-blue-500 p-4 text-2xl">+</Text>
          </TouchableOpacity>

          <Text allowFontScaling={false} className="text-text_main tracking-wide text-xl font-bold mt-10">
            Other Payment Methods
          </Text>

          <View className="gap-2 mt-4">
            <TouchableOpacity
              onPress={() =>
                router.navigate("/(tabs)/billing/paymentMethod/payInPerson")
              }
              className="border-b border-section py-2"
            >
              <Text allowFontScaling={false} className="text-text_main tracking-wide text-xl font-sans">
                Pay In Person
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                router.navigate("/(tabs)/billing/paymentMethod/payByPhone")
              }
              className="border-b border-section py-2"
            >
              <Text allowFontScaling={false} className="text-text_main tracking-wide text-xl font-sans">
                Pay By Phone
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                router.navigate("/(tabs)/billing/paymentMethod/payByMail")
              }
              className="border-b border-section py-2"
            >
              <Text allowFontScaling={false} className="text-text_main tracking-wide text-xl font-sans">
                Pay By Mail
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
