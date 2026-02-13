import { Tabs } from "expo-router";
import { History, Home, User, Users } from "lucide-react-native";

import { HapticTab } from "~/components/haptic-tab";

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
          title: "Home",
          tabBarIcon: ({ color }) => <Home color={color} />,
          tabBarButton: HapticTab,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => <History color={color} />,
          tabBarButton: HapticTab,
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: "Contacts",
          tabBarIcon: ({ color }) => <Users color={color} />,
          tabBarButton: HapticTab,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User color={color} />,
          tabBarButton: HapticTab,
        }}
      />
      <Tabs.Screen
        name="add-contact"
        options={{
          href: null,
          presentation: "modal",
        }}
      />
      <Tabs.Screen
        name="check-in"
        options={{
          href: null,
          presentation: "modal",
        }}
      />
      <Tabs.Screen
        name="log-sleep"
        options={{
          href: null,
          presentation: "modal",
        }}
      />
      <Tabs.Screen
        name="log-social"
        options={{
          href: null,
          presentation: "modal",
        }}
      />
      <Tabs.Screen
        name="log-movement"
        options={{
          href: null,
          presentation: "modal",
        }}
      />
    </Tabs>
  );
}
