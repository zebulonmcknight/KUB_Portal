import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from "react-native";

// Shape of a payment method returned from our backend
export type PaymentMethod = {
   id: string;
   brand: string;
   last4: string;
   expMonth: number;
   expYear: number;
   isDefault: boolean;
};

interface PaymentPickerProps {
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
   confirmLabel?: string;
}

export default function PaymentPicker({
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
   confirmLabel = "CONFIRM",
}: PaymentPickerProps) {

   const selectedCard = methods.find(m => m.id === selectedId);

   return (
      <Modal
         visible={visible}
         transparent
         animationType="slide"
         onRequestClose={onClose}
      >
         {/* Semi-transparent backdrop — tapping outside closes the modal */}
         <TouchableOpacity
            className="flex-1 bg-black/50"
            activeOpacity={1}
            onPress={onClose}
         />

         <View className="bg-primary rounded-t-2xl p-6 gap-4">
            {/* Header row with title and X close button */}
            <View className="flex-row justify-between items-center">
               <Text allowFontScaling={false} className="text-text_main font-bold text-xl tracking-wide">
                  Select Payment Method
               </Text>
               <TouchableOpacity onPress={onClose}>
                  <Text allowFontScaling={false} className="text-text_main text-2xl px-2">✕</Text>
               </TouchableOpacity>
            </View>

            {methodsLoading ? (
               <ActivityIndicator size="large" color="#3377F4" />
            ) : (
               <>
                  {/* Collapsed dropdown showing selected card, tapping expands the list */}
                  <TouchableOpacity
                     onPress={onToggleDropdown}
                     className="bg-section rounded-xl p-4 flex-row justify-between items-center"
                  >
                     <View>
                        {selectedCard ? (
                           <>
                              <Text allowFontScaling={false} className="text-text_main font-sans text-base">
                                 {selectedCard.brand.toUpperCase()} **** {selectedCard.last4}
                              </Text>
                              <Text allowFontScaling={false} className="text-inactive_text text-sm font-sans">
                                 EXP. {String(selectedCard.expMonth).padStart(2, "0")}/{String(selectedCard.expYear).slice(-2)}
                              </Text>
                           </>
                        ) : (
                           <Text allowFontScaling={false} className="text-inactive_text font-sans text-base">
                              No card selected
                           </Text>
                        )}
                     </View>
                     {/* Arrow flips when dropdown is open */}
                     <Text allowFontScaling={false} className="text-text_main text-lg">
                        {dropdownOpen ? "▲" : "▼"}
                     </Text>
                  </TouchableOpacity>

                  {/* Expanded card list, only visible when dropdown is open */}
                  {dropdownOpen && (
                     <View className="bg-section rounded-xl overflow-hidden">
                        {methods.map(method => (
                           <TouchableOpacity
                              key={method.id}
                              onPress={() => onSelectId(method.id)}
                              className={`p-4 flex-row justify-between items-center border-b border-inactive_icon ${
                                 method.id === selectedId ? "bg-active_icon/20" : ""
                              }`}
                           >
                              <View>
                                 <Text allowFontScaling={false} className="text-text_main font-sans text-base">
                                    {method.brand.toUpperCase()} **** {method.last4}
                                 </Text>
                                 <Text allowFontScaling={false} className="text-inactive_text text-sm font-sans">
                                    EXP. {String(method.expMonth).padStart(2, "0")}/{String(method.expYear).slice(-2)}
                                 </Text>
                              </View>
                              {/* Checkmark on the currently selected card */}
                              {method.id === selectedId && (
                                 <Text allowFontScaling={false} className="text-active_icon text-xl">✓</Text>
                              )}
                           </TouchableOpacity>
                        ))}

                        {/* Add New Card option at the bottom of the expanded list */}
                        <TouchableOpacity
                           onPress={onAddNew}
                           className="p-4 flex-row justify-between items-center"
                        >
                           <Text allowFontScaling={false} className="text-active_icon font-sans text-base">
                              Add New Card
                           </Text>
                           <Text allowFontScaling={false} className="text-active_icon text-xl">+</Text>
                        </TouchableOpacity>
                     </View>
                  )}

                  {/* Confirm button, calls onConfirm with currently selected card */}
                  <TouchableOpacity
                     onPress={onConfirm}
                     disabled={!selectedId}
                     className={`rounded-xl items-center bg-[#3377F4] mt-2 ${!selectedId ? "opacity-50" : "opacity-100"}`}
                  >
                     <Text allowFontScaling={false} className="text-text_main font-bold tracking-widest text-lg p-4">
                        {confirmLabel}
                     </Text>
                  </TouchableOpacity>
               </>
            )}
         </View>
      </Modal>
   );
}