import React from 'react';
import { Tabs } from 'expo-router';
import { Clock, History, CirclePlus as PlusCircle } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#F8FAFC',
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: '#334155',
        },
        headerTitleAlign: 'center', // ✅ Center the header title globally
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Timers',
          tabBarIcon: ({ color, size }) => <Clock size={size} color={color} />,
          headerTitle: 'My Timers',
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add Timer',
          tabBarIcon: ({ color, size }) => <PlusCircle size={size} color={color} />,
          headerTitle: 'Create Timer',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <History size={size} color={color} />,
          headerTitle: 'Timer History',
        }}
      />
    </Tabs>
  );
}
