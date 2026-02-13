import {
  Calendar,
  Lightbulb,
  MessageCircle,
  Moon,
  Share2,
} from "lucide-react-native";
import { ScrollView, useColorScheme, View, Pressable, Alert, Share } from "react-native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "~/lib/supabase";

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
  const mutedIconColor = colorScheme === "dark" ? "#9ca3af" : "#6b7280";
  const router = useRouter();
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [weeklyCheckIns, setWeeklyCheckIns] = useState<any[]>([]);
  const [weeklyInsights, setWeeklyInsights] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      const fetchCheckIns = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            setLoading(false);
            return;
          }

          const { data, error } = await supabase
            .from("check_ins")
            .select("*")
            .eq("user_id", user.id)
            .order("check_in_date", { ascending: false });

          if (!cancelled) {
            if (error) {
              Alert.alert("Error", "Failed to fetch check-ins: " + error.message);
            } else {
              const allCheckIns = data ?? [];
              
              const today = new Date();
              const startOfWeek = new Date(today);
              startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
              const endOfWeek = new Date(startOfWeek);
              endOfWeek.setDate(endOfWeek.getDate() + 6);
              const startStr = startOfWeek.toISOString().split('T')[0];
              const endStr = endOfWeek.toISOString().split('T')[0];
              
              const currentWeekCheckIns = allCheckIns.filter(d => {
                const dateStr = d.check_in_date;
                return dateStr >= startStr && dateStr <= endStr;
              });

              setWeeklyCheckIns(currentWeekCheckIns);
              const uniqueDays = new Set(currentWeekCheckIns.map(d => d.check_in_date)).size;
              setWeeklyProgress(uniqueDays);
              processWeeklyData(allCheckIns);
            }
          }
        } catch (error) {
          if (!cancelled) Alert.alert("Error", "An unexpected error occurred.");
        } finally {
          if (!cancelled) setLoading(false);
        }
      };

      setLoading(true);
      fetchCheckIns();
      return () => { cancelled = true; };
    }, [])
  );

  const processWeeklyData = (data: any[]) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    const startStr = startOfWeek.getFullYear() + "-" + String(startOfWeek.getMonth() + 1).padStart(2, "0") + "-" + String(startOfWeek.getDate()).padStart(2, "0");
    const endStr = endOfWeek.getFullYear() + "-" + String(endOfWeek.getMonth() + 1).padStart(2, "0") + "-" + String(endOfWeek.getDate()).padStart(2, "0");

    const thisWeekCheckIns = data.filter(d => {
      const dateStr = d.check_in_date;
      return dateStr >= startStr && dateStr <= endStr;
    });

    setWeeklyCheckIns(thisWeekCheckIns);

    if (thisWeekCheckIns.length < 3) {
      setWeeklyInsights([]);
      return;
    }

    const newInsights: string[] = [];

    const getMostCommon = (items: (string | number)[]) => {
      if (items.length === 0) return null;
      const counts = items.reduce((acc, item) => {
        const key = String(item);
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const mostCommon = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
      if (counts[mostCommon] > items.length / 2) {
        return mostCommon;
      }
      return null;
    };

    // Social insights
    const socialCheckIns = thisWeekCheckIns.filter(d => d.log_type === "social");
    if (socialCheckIns.length > 0) {
      const interactions = socialCheckIns.map(d => d.notes?.match(/Interactions: (\d+)/)?.[1]).filter(Boolean).map(Number);
      if (interactions.length > 0) {
        const totalInteractions = interactions.reduce((sum, count) => sum + count, 0);
        const avgInteractions = totalInteractions / socialCheckIns.length;
        newInsights.push(`You had an average of ${avgInteractions.toFixed(1)} social interactions.`);
      }

      const feelings = socialCheckIns.map(d => d.notes?.match(/Feeling: (\w+)/)?.[1]).filter(Boolean);
      const mostCommonFeeling = getMostCommon(feelings);
      if (mostCommonFeeling) {
        newInsights.push(`You've consistently felt ${mostCommonFeeling.replace(/_/g, " ")} this week.`);
      }

      const qualities = socialCheckIns.map(d => d.notes?.match(/Quality: (\w+)/)?.[1]).filter(Boolean);
      const mostCommonQuality = getMostCommon(qualities);
      if (mostCommonQuality) {
        newInsights.push(`Your interactions have been consistently ${mostCommonQuality}.`);
      }

      const emotionalPains = socialCheckIns.map(d => d.notes?.match(/Emotional Pain: (\w+)/)?.[1]).filter(p => p && p !== 'none');
      if (emotionalPains.length > 0) {
        newInsights.push(`You reported emotional pain on ${emotionalPains.length} day${emotionalPains.length > 1 ? 's' : ''}.`);
      }
    }

    // Sleep insights
    const sleepCheckIns = thisWeekCheckIns.filter(d => d.log_type === "sleep");
    if (sleepCheckIns.length > 0) {
      const sleepHours = sleepCheckIns.map(d => d.notes?.match(/Slept for (\d+(?:\.\d+)?)/)?.[1]).filter(Boolean).map(parseFloat);
      if (sleepHours.length > 0) {
        const avgSleep = sleepHours.reduce((sum, h) => sum + h, 0) / sleepHours.length;
        newInsights.push(`Your average sleep this week was ${avgSleep.toFixed(1)} hours.`);
        const daysWithLittleSleep = sleepHours.filter(h => h < 6).length;
        if (daysWithLittleSleep > 0) {
          newInsights.push(`You had ${daysWithLittleSleep} day${daysWithLittleSleep > 1 ? 's' : ''} with less than 6 hours of sleep.`);
        }
      }

      const sleepQualities = sleepCheckIns.map(d => d.sleep_quality).filter(Boolean);
      const mostCommonSleep = getMostCommon(sleepQualities);
      if (mostCommonSleep) {
        newInsights.push(`You've been sleeping ${mostCommonSleep.replace(/_/g, " ")} this week.`);
      }
    }
    
    // Movement insights
    const movementCheckIns = thisWeekCheckIns.filter(d => d.log_type === "movement");
    if (movementCheckIns.length > 0) {
      const totalMinutes = movementCheckIns.map(d => d.notes?.match(/Movement: (\d+)/)?.[1]).filter(Boolean).map(Number).reduce((sum, mins) => sum + mins, 0);
      if (totalMinutes > 0) {
                            let movementString = `You've moved for a total of ${totalMinutes} minutes this week.`;
                            if (totalMinutes >= 60) {
                              const hours = Math.floor(totalMinutes / 60);
                              const minutes = totalMinutes % 60;
                              movementString = `You've moved for a total of ${hours} hour${hours > 1 ? 's' : ''}${minutes > 0 ? ` and ${minutes} minute${minutes > 1 ? 's' : ''}` : ''} this week.`;
                            }
                            newInsights.push(movementString);      }

      const energyLevels = movementCheckIns.map(d => d.energy_level).filter(Boolean);
      const mostCommonEnergy = getMostCommon(energyLevels);
      if (mostCommonEnergy) {
        newInsights.push(`Your energy has been consistently level ${mostCommonEnergy}.`);
      }

      const intensities = movementCheckIns.map(d => d.notes?.match(/Intensity: (\w+)/)?.[1]).filter(Boolean);
      const mostCommonIntensity = getMostCommon(intensities);
      if (mostCommonIntensity) {
        newInsights.push(`Your movement intensity has been consistently ${mostCommonIntensity}.`);
      }
      
      const physicalPains = movementCheckIns.map(d => d.notes?.match(/Physical Pain: (\w+)/)?.[1]).filter(p => p && p !== 'none');
      if (physicalPains.length > 0) {
        newInsights.push(`You reported physical pain on ${physicalPains.length} day${physicalPains.length > 1 ? 's' : ''}.`);
      }
    }

    setWeeklyInsights(newInsights);
  };

  const shareWeeklyUpdate = async () => {
    const daysCount = new Set(weeklyCheckIns.map((d: { check_in_date: string }) => d.check_in_date)).size;
    
    const insightLines = weeklyInsights.map(insight => insight
      .replace(/^You've/, "I've")
      .replace(/^Your/, "My")
      .replace(/^You had an average/, "I had an average")
    );

    const lines = [
      `This week I checked in ${daysCount}/7 days.`, 
      ...insightLines,
      "Reach out anytime if you want to connect.",
    ];
    const message = lines.join("\n\n");
    try {
      await Share.share({
        message,
        title: "Weekly update",
      });
    } catch {
      // User cancelled or share not available
    }
  };

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
                <Text className="text-muted-foreground text-sm">{weeklyProgress}/7 days</Text>
              </View>
              <Progress value={(weeklyProgress / 7) * 100} />
            </View>
            <Button onPress={() => router.push("/(tabs)/check-in")}>
              <Text>Start Today&apos;s Check-in</Text>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <View className="gap-4">
          <Text className="font-semibold text-lg">Quick Actions</Text>
          <View className="flex-row gap-3">
            <Pressable className="flex-1" onPress={() => router.push("/(tabs)/log-sleep")}>
              <Card className="border border-border bg-primary-50/50">
                <CardContent className="items-center gap-3 py-4">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Moon size={20} color={iconColor} />
                  </View>
                  <Text className="text-center text-sm">Log Sleep</Text>
                </CardContent>
              </Card>
            </Pressable>
            <Pressable className="flex-1" onPress={() => router.push("/(tabs)/log-social")}>
              <Card className="flex-1 border border-border bg-primary-50/50">
                <CardContent className="items-center gap-3 py-4">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <MessageCircle size={20} color={iconColor} />
                  </View>
                  <Text className="text-center text-sm">Log Social</Text>
                </CardContent>
              </Card>
            </Pressable>
            <Pressable className="flex-1" onPress={() => router.push("/(tabs)/log-movement")}>
              <Card className="flex-1 border border-border bg-primary-50/50">
                <CardContent className="items-center gap-3 py-4">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Calendar size={20} color={iconColor} />
                  </View>
                  <Text className="text-center text-sm">Log Movement</Text>
                </CardContent>
              </Card>
            </Pressable>
          </View>
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
          <CardContent className="gap-4">
            <View className="rounded-lg bg-background/50 p-4">
              {weeklyInsights.length > 0 ? (
                weeklyInsights.map((insight, index) => (
                  <Text key={index} className="text-center text-muted-foreground text-sm mb-2">
                    {insight}
                  </Text>
                ))
              ) : (
                <Text className="text-center text-muted-foreground text-sm">
                  Complete at least 3 check-ins this week to unlock your first insight
                </Text>
              )}
            </View>
            <Button variant="outline" onPress={shareWeeklyUpdate} disabled={weeklyInsights.length === 0}>
              <Share2 size={18} color={mutedIconColor} />
              <Text>Share weekly update</Text>
            </Button>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
