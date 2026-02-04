import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "~/global.css";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthInitializer } from "~/components/initializers/auth";
import { useAuth } from "~/hooks/use-auth";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isAuthenticatedLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticatedLoading) return;
    SplashScreen.hideAsync();
  }, [isAuthenticatedLoading]);

  useEffect(() => {
    if (isAuthenticatedLoading) return;

    const inOnboarding = segments[0] === "onboarding";
    const inAuth = segments[0] === "(auth)";

    // User hasn't completed onboarding and isn't authenticated
    if (!isAuthenticated) {
      if (!inOnboarding && !inAuth) {
        router.replace("/onboarding");
      }
    }
    // User has completed onboarding or is authenticated
    else if (isAuthenticated) {
      if (inOnboarding || inAuth) {
        router.replace("/(tabs)");
      }
    }
  }, [isAuthenticated, isAuthenticatedLoading, segments, router]);

  return (
    <GestureHandlerRootView className="flex-1">
      <AuthInitializer />
      {isAuthenticatedLoading ? null : (
        <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
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
