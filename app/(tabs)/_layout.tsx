import { Tabs } from 'expo-router';
import React from 'react';

const _layout = () => {
   return (
      <Tabs
         screenOptions={{
            tabBarShowLabel: false,
            tabBarItemStyle: {
               width: '100%',
               height: '100%',
               justifyContent: 'center',
               alignItems: 'center',
            }
         }}
      >
         <Tabs.Screen
            name='index'
            options={{
               title: 'Billing',
               headerShown: true,
            }}
         />
         <Tabs.Screen
            name='profile'
            options={{
               title: 'Profile',
               headerShown: true,
            }}
         />
      </Tabs>
   )
}

export default _layout;