import { highlightedIcons, icons } from '@/constants/icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image, View } from 'react-native';

const TabIcon = ({icon}: any) => {
   return(
      <View>
         <Image source={icon} style={{ width: 24, height: 24 }}/>
      </View>
   )
}

const _layout = () => {
   return (
      <Tabs
         screenOptions={{
            headerShown: false,
            headerStyle: {
               backgroundColor: '#091C3C',
            },
            headerShadowVisible: false,
            tabBarShowLabel: true,
            tabBarInactiveTintColor: '#F7FDFD',
            tabBarStyle: {
               backgroundColor: '#091C3C',
               shadowColor: 'transparent',
               height: 106,
               width: '100%',
               position: 'absolute',
               overflow: 'hidden',
               borderWidth: 1,
               borderColor: "#091C3C"
            }
         }}
      >
         <Tabs.Screen
            name='index'
            options={{
               title: 'Billing',
               headerShown: true,
               tabBarIcon: ({ focused }) => (
                  <TabIcon
                     icon={!focused ? icons.billing : highlightedIcons.highlightedBilling}
                  />
               )
            }}
         />
         <Tabs.Screen
            name='profile'
            options={{
               title: 'Profile',
               headerShown: true,
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
               headerShown: true,
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
               headerShown: true,
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

export default _layout;