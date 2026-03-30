import { highlightedIcons, icons } from '@/constants/icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image, View } from 'react-native';

// Component to render the tab icons, changing based on whether the tab is focused or not
const TabIcon = ({icon}: any) => {
   return(
      <View>
         <Image source={icon} style={{ width: 24, height: 24 }}/>
      </View>
   )
}

export default function TabsLayout () {
   return (
      <Tabs
         screenOptions={{
            headerStyle: {
               backgroundColor: '#091C3C', // Match the header background to the app's theme
            },
            headerShadowVisible: false, // Remove the shadow underneath header for seamless integration with background
            tabBarShowLabel: true, // Show labels under icons for better clarity
            tabBarStyle: {
               backgroundColor: '#091C3C', // Match the tab bar background to the app's theme
               shadowColor: 'transparent', // Remove the shadown of the tab bar for seamless integration with background
               height: 90,
               width: '100%',
               position: 'absolute',
               overflow: 'hidden',
               borderWidth: 1,
               borderColor: "#091C3C"
            }
         }}
      >
         {/* Each screen corresponds to a tab in the bottom navigation */}
         <Tabs.Screen
            name='billing'
            options={{
               title: 'Billing',
               headerShown: false,
               tabBarIcon: ({ focused }) => (
                  <TabIcon
                     icon={!focused ? icons.billing : highlightedIcons.highlightedBilling} // Change icon based on whether the tab is focused or not
                  />
               )
            }}
         />
         <Tabs.Screen
            name='profile'
            options={{
               title: 'Profile',
               headerShown: false,
               tabBarIcon: ({ focused }) => (
                  <TabIcon
                     icon={!focused ? icons.profile : highlightedIcons.highlightedProfile}
                  />
               )
            }}
         />
         <Tabs.Screen
            name='outages'
            options={{
               title: 'Outages',
               headerShown: false,
               tabBarIcon: ({ focused }) => (
                  <TabIcon
                     icon={!focused ? icons.outages : highlightedIcons.highlightedOutages}
                  />
               )
            }}
         />
         <Tabs.Screen
            name='chatbot'
            options={{
               title: 'Q&A',
               headerShown: false,
               tabBarIcon: ({ focused }) => (
                  <TabIcon
                     icon={!focused ? icons.chatbot : highlightedIcons.highlightedChatbot}
                  />
               )
            }}
         />
      </Tabs>
   );
}