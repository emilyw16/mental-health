import {
  Calendar,
  MessageCircle,
  Moon,
  Sparkles,
  TrendingUp,
} from "lucide-react-native";
import { ScrollView, useColorScheme, View } from "react-native";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Text } from "~/components/ui/text";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#9ca3af" : "#6b7280";

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingVertical: 48 }}
    >
      <View className="gap-8 px-6">
        {/* Greeting Section */}
        <View className="gap-2">
          <Text className="font-semibold text-2xl">{getGreeting()}</Text>
          <Text className="text-muted-foreground">
            How are you feeling today?
          </Text>
        </View>

        {/* Daily Check-in Card */}
        <Card className="border border-border bg-muted/50">
          <CardHeader>
            <CardTitle>Daily Check-in</CardTitle>
            <CardDescription>
              Track your mood, sleep, and social connections
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-4">
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-muted-foreground text-sm">
                  Weekly progress
                </Text>
                <Text className="text-muted-foreground text-sm">4/7 days</Text>
              </View>
              <Progress value={57} />
            </View>
            <Button>
              <Text>Start Today&apos;s Check-in</Text>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <View className="gap-4">
          <Text className="font-semibold text-lg">Quick Actions</Text>
          <View className="flex-row gap-3">
            <Card className="flex-1 border border-border bg-primary-50/50">
              <CardContent className="items-center gap-3 py-4">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Moon size={20} color={iconColor} />
                </View>
                <Text className="text-center text-sm">Log Sleep</Text>
              </CardContent>
            </Card>
            <Card className="flex-1 border border-border bg-primary-50/50">
              <CardContent className="items-center gap-3 py-4">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <MessageCircle size={20} color={iconColor} />
                </View>
                <Text className="text-center text-sm">Social</Text>
              </CardContent>
            </Card>
            <Card className="flex-1 border border-border bg-primary-50/50">
              <CardContent className="items-center gap-3 py-4">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Calendar size={20} color={iconColor} />
                </View>
                <Text className="text-center text-sm">Routine</Text>
              </CardContent>
            </Card>
          </View>
        </View>

        {/* Patterns Insight Card */}
        <Card className="border border-border">
          <CardHeader>
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-success/30">
                <TrendingUp size={20} color="#22c55e" />
              </View>
              <View className="flex-1 gap-1">
                <CardTitle>Your Patterns</CardTitle>
                <CardDescription>Weekly insights</CardDescription>
              </View>
            </View>
          </CardHeader>
          <CardContent>
            <View className="flex-row items-center gap-2 rounded-lg bg-muted/50 p-3">
              <Sparkles size={16} color={iconColor} />
              <Text className="flex-1 text-muted-foreground text-sm">
                Complete more check-ins to see your patterns
              </Text>
            </View>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
