import { PortalHost } from "@rn-primitives/portal";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthInitializer } from "~/components/initializers/auth";
import { useAuth } from "~/hooks/use-auth";
import "~/global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const _router = useRouter();
  const _segments = useSegments();
  const { isAuthenticatedLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticatedLoading) return;
    SplashScreen.hideAsync();
  }, [isAuthenticatedLoading]);

  useEffect(() => {
    if (isAuthenticatedLoading) return;
    // isAuthenticated, isAuthenticatedLoading, segments, router
  }, [isAuthenticatedLoading]);

  return (
    <GestureHandlerRootView className="flex-1">
      <AuthInitializer />
      {isAuthenticatedLoading ? null : (
        <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
          <PortalHost name="RootPortalHost" />
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </SafeAreaView>
      )}
    </GestureHandlerRootView>
  );
}
