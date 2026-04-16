import ScreenHeader from "@/components/headerStyle";
import { mockPromotions } from "@/constants/mockPromotionData";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";


export default function Promotions(){

   const tabBarHeight = useBottomTabBarHeight();
   const router = useRouter();

   return(
      <View className="flex-1">
         <ScreenHeader title="Offers & Promotions" />
         <ScrollView
         className="flex-1"
         showsVerticalScrollIndicator={false}
         contentContainerStyle={{paddingBottom: tabBarHeight, paddingTop: 16}}
         >
            { mockPromotions.map((promotion) => (
               // This is the card itself
               <View key={promotion.id} className="bg-section mx-4 mb-6 overflow-hidden flex-col rounded-md">

                  {/* The image the card uses */}
                  <Image
                     source={promotion.image}
                     style={{width: "100%", height: 240}}
                     resizeMode="cover"
                  />

                  <View className="p-4">
                     {/* This is the title of the card */}
                     <Text className="text-text_main font-semibold text-lg mt-4 tracking-wide">
                        {promotion.title}
                     </Text>
                     {/* The description */}
                     <Text className="text-text_main font-sans text-base mt-4 tracking-wide">
                        {promotion.description}
                     </Text>
                     {/* Learn more button */}
                     <TouchableOpacity onPress={() => router.navigate(promotion.route)}
                        className="bg-active_icon rounded-xl justify-center items-center py-3.5 mt-8"
                     >
                        <Text className="text-text_main font-semibold text-lg tracking-wide">
                           LEARN MORE
                        </Text>
                     </TouchableOpacity>
                  </View>
               </View>
            ))}
            
         </ScrollView>
      </View>
   );
}