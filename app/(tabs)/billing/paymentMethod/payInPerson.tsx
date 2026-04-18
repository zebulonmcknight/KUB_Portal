/*
Customers can pay their KUB bill at PaySite Kiosks and participating grocery stores across KUB's service territory.

There is an additional payment transaction fee and payments post immediately. Check with a cashier at participating stores.

Please note the following information about the KUB Payment Locations Map:

This map shows payment locations in the KUB service area.
Payment locations include PaySite Kiosks, KUB Payment Centers, and In-Store Bill Pay.
Details about each payment location can be viewed by clicking on the location symbol.
Both PaySite Kiosks and In-Store Bill Pay locations charge a small fee.

VIEW MAP button that links to https://www.kub.org/bills-payments/payment-locations-map/
*/

import ScreenHeader from "@/components/headerStyle";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function PayInPerson() {
  const tabBarHeight = useBottomTabBarHeight();
  return (
    <View className="flex-1 justify-center items-center">
      <ScreenHeader title="Pay In Person" />
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarHeight }}
      >
        <View className="justify-start pt-4 flex-1 gap-4">
          <Text allowFontScaling={false} className="text-text_main font-sans text-xl tracking-wide px-6 pt-4">
            Customers can pay their KUB bill at PaySite Kiosks and participating grocery stores across KUB's service territory.
          </Text>
          <Text allowFontScaling={false} className="text-text_main font-sans text-xl tracking-wide px-6">
            There is an additional payment transaction fee and payments post immediately. Check with a cashier at participating stores.
          </Text>
          <Text allowFontScaling={false} className="text-text_main font-sans text-xl tracking-wide px-6">
            Please note the following information about the KUB Payment Locations Map:
          </Text>
          <View>
              <View className="flex-row gap-2 ml-8">
                <Text allowFontScaling={false} className="text-text_main text-2xl">{'\u2022'}</Text>
                <Text allowFontScaling={false} className="flex-1 font-sans text-text_main tracking-wide text-base mt-1">
                    This map shows payment locations in the KUB service area.
                </Text>
              </View>
              <View className="flex-row gap-2 ml-8">
                <Text allowFontScaling={false} className="text-text_main text-2xl">{'\u2022'}</Text>
                <Text allowFontScaling={false} className="flex-1 font-sans text-text_main tracking-wide text-base mt-1">
                    Payment locations include PaySite Kiosks, KUB Payment Centers, and In-Store Bill Pay.
                </Text>
              </View>
              <View className="flex-row gap-2 ml-8">
                <Text allowFontScaling={false} className="text-text_main text-2xl">{'\u2022'}</Text>
                <Text allowFontScaling={false} className="flex-1 font-sans text-text_main tracking-wide text-base mt-1">
                    Details about each payment location can be viewed by clicking on the location symbol.
                </Text>
              </View>
              <View className="flex-row gap-2 ml-8">
                <Text allowFontScaling={false} className="text-text_main text-2xl">{'\u2022'}</Text>
                <Text allowFontScaling={false} className="flex-1 font-sans text-text_main tracking-wide text-base mt-1">
                    Both PaySite Kiosks and In-Store Bill Pay locations charge a small fee.
                </Text>
              </View>
          </View>

          {/* Redirects user to website so they can view the map. */}
          <TouchableOpacity onPress={() => Linking.openURL("https://www.kub.org/bills-payments/payment-locations-map/")} className="bg-active_icon rounded-xl justify-center items-center py-3.5 mx-6 mt-4">
            <Text allowFontScaling={false} className="text-text_main font-bold text-lg tracking-wider px-1">
              VIEW MAP
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
