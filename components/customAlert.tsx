import { ReactNode } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

// Prop allows us to pass in the message we want to display, whether the alert is visible, and a function to close the alert
interface CustomAlertProps {
   message: string | ReactNode; // Allow message to be either a string or a ReactNode for more complex content. This lets us use <Text> components so we can use links inside the message.
   visible: boolean; // Control whether the alert is shown or hidden
   onClose: () => void;
}

export default function CustomAlert({ message, visible, onClose }: CustomAlertProps) {

   return(
         <Modal animationType="none" transparent={true} visible={visible} onRequestClose={onClose} statusBarTranslucent={true}>
            {/* First view lets us position the box to be at the center of the screen. It also dims the background so alert is focused */}
            <View className="flex-1 justify-center items-center bg-black/50 px-6">
               {/* This creates the actual alert box */}
               <View className="bg-zinc-600 p-6">
                  <Text className="text-text_main text-lg font-sans leading-normal">{message}</Text>
                  {/* Need this one to put the 'OK' at the end of the box. */}
                  <View className="items-end">
                     <TouchableOpacity onPress={onClose} className="px-2 pt-4">
                        <Text className="text-text_main text-base font-bold">OK</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </View>
         </Modal>
   )
}