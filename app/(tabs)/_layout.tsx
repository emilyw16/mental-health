import { Tabs } from 'expo-router'
import { Home, History, Users, Settings } from 'lucide-react-native'

import { HapticTab } from '~/components/haptic-tab'

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} />,
          tabBarButton: HapticTab,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <History color={color} />,
          tabBarButton: HapticTab,
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Contacts',
          tabBarIcon: ({ color }) => <Users color={color} />,
          tabBarButton: HapticTab,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings color={color} />,
          tabBarButton: HapticTab,
        }}
      />
    </Tabs>
  )
}