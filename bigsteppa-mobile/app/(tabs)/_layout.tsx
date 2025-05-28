import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  // const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: () => <FontAwesome name="home" size={24} color='#ff914d'/>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: () => <AntDesign name="profile" size={24} color='#ff914d' />,
        }}
      />
    </Tabs>
  );
}
