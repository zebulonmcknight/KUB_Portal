import ScreenHeader from "@/components/headerStyle";
import { Text, View } from "react-native";

export default function ProjectHelp(){

   return(
      <View className="flex-1 justify-center">
         <ScreenHeader title="Project Help" />
         <Text>
            Hello
         </Text>
      </View>
   );
}