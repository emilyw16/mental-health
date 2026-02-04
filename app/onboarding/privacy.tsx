import { Link } from "expo-router";
import { Check } from "lucide-react-native";
import { View } from "react-native";

import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";

const privacyPoints = [
  {
    title: "Your data stays private",
    description: "Information stays on your device unless you choose to share",
  },
  {
    title: "No selling your data",
    description: "We never sell your information to third parties",
  },
  {
    title: "You're in control",
    description: "You decide who sees your check-in summaries",
  },
];

export default function PrivacyScreen() {
  return (
    <View className="flex-1 justify-between bg-background px-8 py-16">
      {/* Header */}
      <View className="gap-2">
        <Text className="font-semibold text-2xl">Your Privacy Matters</Text>
        <Text className="text-muted-foreground">
          We take your privacy seriously
        </Text>
      </View>

      {/* Privacy Points Card */}
      <Card className="border border-border">
        <CardContent className="gap-6 py-6">
          {privacyPoints.map((point) => (
            <View key={point.title} className="flex-row items-start gap-4">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-success/30">
                <Check size={16} color="#22c55e" />
              </View>
              <View className="flex-1 gap-1">
                <Text className="font-semibold">{point.title}</Text>
                <Text className="text-muted-foreground text-sm">
                  {point.description}
                </Text>
              </View>
            </View>
          ))}
        </CardContent>
      </Card>

      {/* Bottom section */}
      <View className="gap-4">
        <Link href="/(auth)/signup" asChild>
          <Button size="lg">
            <Text>Create Account</Text>
          </Button>
        </Link>
        <Text className="text-center text-muted-foreground text-xs">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}
