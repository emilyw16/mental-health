import { Link } from "expo-router";
import { Bell, LineChart, Users } from "lucide-react-native";
import { useColorScheme, View } from "react-native";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";

const features = [
  {
    number: 1,
    title: "Daily check-ins",
    description: "Quick questions about sleep, social interaction, and routine",
    icon: Bell,
  },
  {
    number: 2,
    title: "Pattern recognition",
    description: "We notice trends, not just bad days",
    icon: LineChart,
  },
  {
    number: 3,
    title: "Trusted support",
    description: "Your chosen contacts are there when you need them",
    icon: Users,
  },
];

export default function HowItWorksScreen() {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#9ca3af" : "#6b7280";

  return (
    <View className="flex-1 justify-between bg-background px-8 py-16">
      {/* Header */}
      <View className="gap-2">
        <Text className="font-semibold text-2xl">How It Works</Text>
        <Text className="text-muted-foreground">
          Simple steps to support your wellbeing
        </Text>
      </View>

      {/* Feature Cards */}
      <View className="gap-4">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <Card key={feature.number} className="border border-border">
              <CardHeader className="flex-row items-start gap-4">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-primary-50">
                  <Text className="font-semibold text-primary-600">
                    {feature.number}
                  </Text>
                </View>
                <View className="flex-1 gap-1">
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </View>
                <View className="h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <IconComponent size={20} color={iconColor} />
                </View>
              </CardHeader>
            </Card>
          );
        })}
      </View>

      {/* Bottom button */}
      <Link href="/onboarding/privacy" asChild>
        <Button size="lg">
          <Text>Continue</Text>
        </Button>
      </Link>
    </View>
  );
}
