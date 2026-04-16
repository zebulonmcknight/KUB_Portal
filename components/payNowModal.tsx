import { format } from "date-fns";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomAlert from "./customAlert";
import { PaymentMethod } from "./paymentPicker";

interface PayNowModalProps {
   visible: boolean;
   onClose: () => void;
   methods: PaymentMethod[];
   methodsLoading: boolean;
   selectedId: string | null;
   onSelectId: (id: string) => void;
   dropdownOpen: boolean;
   onToggleDropdown: () => void;
   onConfirm: () => void;
   onAddNew: () => void;
   totalAmountDue: number;
   dueDate: string | null;
}

export default function PayNowModal({
   visible,
   onClose,
   methods,
   methodsLoading,
   selectedId,
   onSelectId,
   dropdownOpen,
   onToggleDropdown,
   onConfirm,
   onAddNew,
   totalAmountDue,
   dueDate,
}: PayNowModalProps) {

   const router = useRouter();
   const selectedCard = methods.find(m => m.id === selectedId);
   const formattedDue = dueDate ? format(new Date(dueDate), "MMM dd, yyyy") : null;
   const today = format(new Date(), "MMM dd, yyyy");
   const canPay = totalAmountDue > 0;
   const [showConfirm, setShowConfirm] = useState(false);

   // Show confirmation alert before calling onConfirm
   const handleNext = () => {
      setShowConfirm(true);
   };

   return (
      <Modal
         visible={visible}
         transparent={false}
         animationType="slide"
         onRequestClose={onClose}
      >
         <SafeAreaView className="flex-1 bg-primary">

            {/* Header */}
            <View className="flex-row items-center px-4 py-3">
               <TouchableOpacity onPress={onClose} className="p-2">
                  <Text className="text-text_main text-2xl">✕</Text>
               </TouchableOpacity>
               <Text className="text-text_main font-bold text-xl ml-4">
                  Pay Now
               </Text>
            </View>

            <View className="flex-1 px-6 pt-4 gap-6">
               {/* Balance heading */}
               <Text className="text-text_main font-bold text-2xl tracking-wide">
                  Your current balance is ${totalAmountDue.toFixed(2)}
                  {formattedDue ? ` due on ${formattedDue}` : ""}
               </Text>

               {methodsLoading ? (
                  <ActivityIndicator size="large" color="#3377F4" />
               ) : (
                  <>
                     {/* Payment Amount row */}
                     <View className="border-b border-section pb-4">
                        <Text className="text-text_main font-sans text-xl tracking-wide">
                           Payment Amount
                        </Text>
                        <Text className="text-inactive_text font-sans text-sm tracking-wide mt-1">
                           ${totalAmountDue.toFixed(2)}
                        </Text>
                     </View>

                     {/* Payment Method row with dropdown */}
                     <View className="border-b border-section pb-4">
                        <TouchableOpacity
                           onPress={onToggleDropdown}
                           className="flex-row justify-between items-start"
                        >
                           <View>
                              <Text className="text-text_main font-sans text-xl tracking-wide">
                                 Payment Method
                              </Text>
                              {selectedCard ? (
                                 <>
                                    <Text className="text-inactive_text font-sans text-sm tracking-wide mt-1">
                                       **** {selectedCard.last4}
                                    </Text>
                                    <Text className="text-inactive_text font-sans text-sm tracking-wide">
                                       {selectedCard.brand.toUpperCase()} EXP {String(selectedCard.expMonth).padStart(2, "0")}/{String(selectedCard.expYear).slice(-2)}
                                    </Text>
                                 </>
                              ) : (
                                 <Text className="text-inactive_text font-sans text-sm tracking-wide mt-1">
                                    No card selected
                                 </Text>
                              )}
                           </View>
                           <Text className="text-text_main text-lg pt-1">
                              {dropdownOpen ? "▲" : "▼"}
                           </Text>
                        </TouchableOpacity>

                        {/* Expanded card list */}
                        {dropdownOpen && (
                           <View className="bg-section rounded-xl overflow-hidden mt-3">
                              {methods.map(method => (
                                 <TouchableOpacity
                                    key={method.id}
                                    onPress={() => onSelectId(method.id)}
                                    className={`p-4 flex-row justify-between items-center border-b border-inactive_icon ${
                                       method.id === selectedId ? "bg-active_icon/20" : ""
                                    }`}
                                 >
                                    <View>
                                       <Text className="text-text_main font-sans text-base">
                                          {method.brand.toUpperCase()} **** {method.last4}
                                       </Text>
                                       <Text className="text-inactive_text text-sm font-sans">
                                          EXP. {String(method.expMonth).padStart(2, "0")}/{String(method.expYear).slice(-2)}
                                       </Text>
                                    </View>
                                    {/* Checkmark on the currently selected card */}
                                    {method.id === selectedId && (
                                       <Text className="text-active_icon text-xl">✓</Text>
                                    )}
                                 </TouchableOpacity>
                              ))}

                              {/* Add New Card option */}
                              <TouchableOpacity
                                 onPress={onAddNew}
                                 className="p-4 flex-row justify-between items-center"
                              >
                                 <Text className="text-active_icon font-sans text-base">
                                    Add New Card
                                 </Text>
                                 <Text className="text-active_icon text-xl">+</Text>
                              </TouchableOpacity>
                           </View>
                        )}
                     </View>

                     {/* Payment Date row */}
                     <View className="border-b border-section pb-4">
                        <Text className="text-text_main font-sans text-xl tracking-wide">
                           Payment Date
                        </Text>
                        <Text className="text-inactive_text font-sans text-sm tracking-wide mt-1">
                           {today}
                        </Text>
                     </View>

                     {/* NEXT button — disabled if nothing owed */}
                     <TouchableOpacity
                        onPress={handleNext}
                        disabled={!canPay || !selectedId}
                        className={`rounded-xl items-center bg-active_icon ${
                           !canPay || !selectedId ? "opacity-50" : "opacity-100"
                        }`}
                     >
                        <Text className="text-text_main font-bold tracking-widest text-lg p-4">
                           NEXT
                        </Text>
                     </TouchableOpacity>

                     {/* Pay in person info card */}
                     <View className="bg-section rounded-xl p-6 items-center gap-3">
                        <Text className="text-text_main font-sans text-base text-center">
                           Want to{" "}
                           <Text
                              className="text-active_icon"
                              onPress={() => {
                                 onClose();
                                 router.navigate("/(tabs)/billing/paymentMethod/payInPerson");
                              }}
                           >
                              pay your bill in person
                           </Text>
                           ? See payment locations near you.
                        </Text>
                     </View>
                  </>
               )}
            </View>
            <CustomAlert
               message={`Are you sure you want to submit a payment of $${totalAmountDue.toFixed(2)}?`}
               visible={showConfirm}
               onClose={() => setShowConfirm(false)}
               confirmText="Submit"
               onConfirm={onConfirm}
            />
         </SafeAreaView>
      </Modal>
   );
}