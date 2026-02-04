import { Link } from "expo-router";
import { useColorScheme, View } from "react-native";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function WelcomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const circleColor = isDark ? "#374151" : "#e5e7eb";

  return (
    <View className="flex-1 justify-between bg-background px-8 py-16">
      {/* Top spacer */}
      <View />

      {/* Center content */}
      <View className="items-center gap-8">
        {/* Abstract icon - nested circles */}
        <View className="items-center justify-center">
          <View
            className="h-32 w-32 items-center justify-center rounded-full"
            style={{ backgroundColor: circleColor }}
          >
            <View
              className="h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: isDark ? "#4b5563" : "#d1d5db" }}
            >
              <View className="h-10 w-10 rounded-full bg-primary" />
            </View>
          </View>
        </View>

        {/* Tagline */}
        <View className="gap-4">
          <Text className="text-center font-serif text-3xl leading-tight">
            We notice the quiet changes, so you don&apos;t face them alone
          </Text>
          <Text className="text-center text-muted-foreground">
            A gentle companion for your mental wellbeing
          </Text>
        </View>
      </View>

      {/* Bottom buttons */}
      <View className="gap-3">
        <Link href="/onboarding/how-it-works" asChild>
          <Button size="lg">
            <Text>Get Started</Text>
          </Button>
        </Link>
        <Link href="/(auth)/login" asChild>
          <Button variant="ghost">
            <Text>I already have an account</Text>
          </Button>
        </Link>
      </View>
    </View>
  );
}
