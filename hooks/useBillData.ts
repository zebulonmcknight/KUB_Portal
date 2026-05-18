import { useAuth } from "@/components/authContext";
import { API_BASE_URL } from "@/constants/api";
import { useState } from "react";
import { Alert } from "react-native";

// Define the shape of what we receive from getCurrentBill
export type BillData = {
  totalAmountDue: number;
  dueDate: string | null;
  isAutoPay: boolean;
  isPaperless: boolean;
  status: string;
  lineItems: { service: string; units: number; amount: number }[];
  invoicePdf: string | null;
};

export function useBillData() {
  const [billLoading, setBillLoading] = useState(false);
  const [billData, setBillData] = useState<BillData | null>(null);
  const { getToken } = useAuth();

  // This will fetch the current bills data to display due data and amount due, as well as check invoice status
  const fetchBillData = async () => {
    setBillLoading(true);
    try {
      // If valid token exists fetch the bill data from the backend
      const access_token = await getToken();

      if (!access_token) {
        Alert.alert("Session Expired", "Please log in again");
        return;
      }

         const response = await fetch(
         `${API_BASE_URL}/api/billing/getCurrentBill`,
         {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${access_token}`,
            },
         },
         );

      if (!response.ok) {
        Alert.alert("Error", "Failed to fetch billing data");
        return;
      }
      const data = await response.json();
      setBillData(data);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setBillLoading(false);
    }
  };

  return { billData, billLoading, fetchBillData };
}
