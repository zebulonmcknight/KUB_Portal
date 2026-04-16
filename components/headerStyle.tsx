import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";

interface HeaderStyleProps {
  title: string;
  onPress?: () => void;
}

export default function ScreenHeader({ title, onPress }: HeaderStyleProps) {
   return (
      <Stack.Screen
         options={{
         title,
         headerStyle: {
            backgroundColor: "#3377F4",
         },
         headerTitleStyle: {
            fontFamily: 'Inter_400Regular',
            fontSize: 18,
         },
         headerTitleAlign: "left",
         headerTintColor: "#FFFFFF",
         headerShadowVisible: false,
         ...(onPress && {
            headerRight: () => (
               <TouchableOpacity onPress={onPress}>
               <MaterialIcons name="info" size={24} color="white" />
               </TouchableOpacity>
            ),
         }),
         }}
      />
   );
}