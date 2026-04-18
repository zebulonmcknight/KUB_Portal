import { ReactNode } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface CustomAlertProps {
   message: string | ReactNode;
   visible: boolean;
   onClose: () => void;
   // Optional confirm button — when provided shows two buttons instead of OK
   confirmText?: string;
   onConfirm?: () => void;
}

export default function CustomAlert({ message, visible, onClose, confirmText, onConfirm }: CustomAlertProps) {
   return (
      <Modal animationType="none" transparent={true} visible={visible} onRequestClose={onClose} statusBarTranslucent={true}>
         {/* First view lets us position the box to be at the center of the screen. It also dims the background so alert is focused */}
         <View className="flex-1 justify-center items-center bg-black/50 px-6">
            {/* This creates the actual alert box */}
            <View className="bg-zinc-600 p-6">
               <Text allowFontScaling={false} className="text-text_main text-lg font-sans leading-normal">{message}</Text>
               {/* Need this one to put the buttons at the end of the box. */}
               <View className="items-end flex-row justify-end gap-4 pt-4">
                  {/* If confirmText and onConfirm are provided show two buttons, otherwise show single OK */}
                  {onConfirm && confirmText ? (
                     <>
                        <TouchableOpacity onPress={onClose} className="px-2">
                           <Text allowFontScaling={false} className="text-inactive_text text-base font-bold">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { onClose(); onConfirm(); }} className="px-2">
                           <Text allowFontScaling={false} className="text-text_main text-base font-bold">{confirmText}</Text>
                        </TouchableOpacity>
                     </>
                  ) : (
                     <TouchableOpacity onPress={onClose} className="px-2">
                        <Text allowFontScaling={false} className="text-text_main text-base font-bold">OK</Text>
                     </TouchableOpacity>
                  )}
               </View>
            </View>
         </View>
      </Modal>
   );
}