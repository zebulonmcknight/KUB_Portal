import { highlightedIcons, icons } from '@/constants/icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image, View } from 'react-native';

const TabIcon = ({focused, icon, title}: any) => {

   if( focused ){
      return(
         <View>
            <Image source={icon} style={{ width: 24, height: 24 }}/>
         </View>
      )
   }
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
            tabBarShowLabel: true,
            tabBarStyle: {
               backgroundColor: '#091C3C',
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
                     focused={focused}
                     icon={!focused ? icons.billing : highlightedIcons.highlightedBilling}
                     title='Billing'
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
                     focused={focused}
                     icon={!focused ? icons.profile : highlightedIcons.highlightedProfile}
                     title='Profile'
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
                     focused={focused}
                     icon={!focused ? icons.outages : highlightedIcons.highlightedOutages}
                     title='Outages'
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
                     focused={focused}
                     icon={!focused ? icons.chatbot : highlightedIcons.highlightedChatbot}
                     title='Q&A'
                  />
               )
            }}
         />
      </Tabs>
   );
}

export default _layout;