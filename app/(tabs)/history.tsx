import { Calendar, Flame, Lightbulb, Target } from "lucide-react-native";
import { ScrollView, useColorScheme, View } from "react-native";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";

const stats = [
  {
    label: "Day Streak",
    value: "0",
    icon: Flame,
    bgColor: "bg-primary-50/50",
    iconColor: "#3b82f6",
  },
  {
    label: "This Week",
    value: "0/7",
    icon: Target,
    bgColor: "bg-success/30",
    iconColor: "#22c55e",
  },
  {
    label: "Total Weeks",
    value: "0",
    icon: Calendar,
    bgColor: "bg-muted",
    iconColor: "#6b7280",
  },
];

export default function HistoryScreen() {
  const colorScheme = useColorScheme();
  const mutedIconColor = colorScheme === "dark" ? "#9ca3af" : "#6b7280";

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingVertical: 48 }}
    >
      <View className="gap-8 px-6">
        {/* Header */}
        <View className="gap-2">
          <Text className="font-semibold text-2xl">Your Journey</Text>
          <Text className="text-muted-foreground">
            Track your progress over time
          </Text>
        </View>

        {/* Stats Row */}
        <View className="flex-row gap-3">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <Card
                key={stat.label}
                className={`flex-1 border border-border ${stat.bgColor}`}
              >
                <CardContent className="items-center gap-2 py-4">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-background/50">
                    <IconComponent size={20} color={stat.iconColor} />
                  </View>
                  <Text className="font-semibold text-xl">{stat.value}</Text>
                  <Text className="text-center text-muted-foreground text-xs">
                    {stat.label}
                  </Text>
                </CardContent>
              </Card>
            );
          })}
        </View>

        {/* Recent Activity Section */}
        <View className="gap-4">
          <Text className="font-semibold text-lg">Recent Activity</Text>
          <Card className="border border-border">
            <CardContent className="items-center gap-3 py-8">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Calendar size={24} color={mutedIconColor} />
              </View>
              <Text className="text-center text-muted-foreground">
                Your check-ins will appear here
              </Text>
            </CardContent>
          </Card>
        </View>

        {/* Weekly Insights Card */}
        <Card className="border border-border bg-muted/30">
          <CardHeader>
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-primary-50">
                <Lightbulb size={20} color="#3b82f6" />
              </View>
              <View className="flex-1 gap-1">
                <CardTitle>Weekly Insights</CardTitle>
                <CardDescription>
                  Patterns we notice in your data
                </CardDescription>
              </View>
            </View>
          </CardHeader>
          <CardContent>
            <View className="rounded-lg bg-background/50 p-4">
              <Text className="text-center text-muted-foreground text-sm">
                Complete at least 3 check-ins this week to unlock your first
                insight
              </Text>
            </View>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
