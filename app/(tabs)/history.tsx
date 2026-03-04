import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Calendar, Flame, Target } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  useColorScheme,
  View,
} from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { supabase } from "~/lib/supabase";
import type { CheckIn } from "~/types";

/** Parse YYYY-MM-DD as local date to avoid timezone shift when displaying */
function formatLocalDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString();
}

const SEED_FLAG = "seed-2026-02-09-movement";

export default function HistoryScreen() {
  const colorScheme = useColorScheme();
  const mutedIconColor = colorScheme === "dark" ? "#9ca3af" : "#6b7280";
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [dayStreak, setDayStreak] = useState(0);

  useEffect(() => {
    const seedYesterdayMovement = async () => {
      try {
        const alreadySeeded = await AsyncStorage.getItem(SEED_FLAG);
        if (alreadySeeded === "true") {
          return;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const yesterday = "2026-02-09";
        const { data, error } = await supabase
          .from("check_ins")
          .select("id")
          .eq("user_id", user.id)
          .eq("log_type", "movement")
          .eq("check_in_date", yesterday);

        if (error) {
          console.error("Error checking for seed data:", error);
          return;
        }

        if (data.length === 0) {
          const notes = `
            Movement: 30 minutes
            Intensity: medium
            Physical Pain: none
          `;
          await supabase.from("check_ins").insert({
            user_id: user.id,
            check_in_date: yesterday,
            log_type: "movement",
            energy_level: 3,
            notes: notes.trim(),
            sleep_quality: "okay",
            social_interaction: "no_interaction",
          });
        }
        await AsyncStorage.setItem(SEED_FLAG, "true");
      } catch (e) {
        console.error("Failed to seed data:", e);
      }
    };

    seedYesterdayMovement();
  }, []);

  const calculateDayStreak = useCallback((data: CheckIn[]) => {
    if (data.length === 0) {
      setDayStreak(0);
      return;
    }

    const uniqueDates = [...new Set(data.map((d) => d.check_in_date))]
      .sort()
      .reverse();
    const sortedDates = uniqueDates.map((s) => {
      const [y, m, d] = s.split("-").map(Number);
      return new Date(y, m - 1, d);
    });
    let streak = 1;
    let lastDate = sortedDates[0];

    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = sortedDates[i];
      const diffTime = lastDate.getTime() - currentDate.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);

      if (diffDays > 0 && diffDays <= 1) {
        streak++;
        lastDate = currentDate;
      } else if (diffDays > 1) {
        break;
      }
    }

    setDayStreak(streak);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      const fetchCheckIns = async () => {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) {
            Alert.alert("Error", "You must be logged in to view your history.");
            return;
          }

          const { data, error } = await supabase
            .from("check_ins")
            .select("*")
            .eq("user_id", user.id)
            .order("check_in_date", { ascending: false });

          if (!cancelled) {
            if (error) {
              Alert.alert(
                "Error",
                `Failed to fetch check-ins: ${error.message}`,
              );
            } else {
              setCheckIns(data ?? []);
              calculateDayStreak(data ?? []);
            }
          }
        } catch (_error) {
          if (!cancelled) Alert.alert("Error", "An unexpected error occurred.");
        } finally {
          if (!cancelled) setLoading(false);
        }
      };

      setLoading(true);
      fetchCheckIns();
      return () => {
        cancelled = true;
      };
    }, [calculateDayStreak]),
  );
  const weeklyCheckIns = checkIns.filter((d) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    const startStr =
      startOfWeek.getFullYear() +
      "-" +
      String(startOfWeek.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(startOfWeek.getDate()).padStart(2, "0");
    const endStr =
      endOfWeek.getFullYear() +
      "-" +
      String(endOfWeek.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(endOfWeek.getDate()).padStart(2, "0");
    const dateStr = d.check_in_date;
    return dateStr >= startStr && dateStr <= endStr;
  });

  const stats = [
    {
      label: "Day Streak",
      value: dayStreak.toString(),
      icon: Flame,
      bgColor: "bg-primary-50/50",
      iconColor: "#3b82f6",
    },
    {
      label: "This Week",
      value: `${new Set(weeklyCheckIns.map((d: { check_in_date: string }) => d.check_in_date)).size}/7`,
      icon: Target,
      bgColor: "bg-success/30",
      iconColor: "#22c55e",
    },
    {
      label: "Total Weeks",
      value: "0", // This would require more complex logic
      icon: Calendar,
      bgColor: "bg-muted",
      iconColor: "#6b7280",
    },
  ];

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
          {loading ? (
            <ActivityIndicator size="large" color={mutedIconColor} />
          ) : checkIns.length === 0 ? (
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
          ) : (
            <View className="gap-4">
              {checkIns.map((checkIn) => {
                const logType =
                  checkIn.log_type ??
                  (checkIn.notes?.includes("Interactions:")
                    ? "social"
                    : "sleep");

                let notesToDisplay = checkIn.notes || "";
                if (logType === "movement") {
                  const notesLines = notesToDisplay
                    .split("\n")
                    .map((line) => line.trim());
                  const intensityIndex = notesLines.findIndex((line) =>
                    line.startsWith("Intensity:"),
                  );
                  notesLines.splice(
                    intensityIndex + 1,
                    0,
                    `Energy Level: ${checkIn.energy_level}`,
                  );
                  notesToDisplay = notesLines.join("\n");
                } else if (logType === "social") {
                  notesToDisplay = notesToDisplay
                    .split("\n")
                    .map((line) => line.trim())
                    .join("\n");
                }

                return (
                  <Card key={checkIn.id} className="border border-border">
                    <CardHeader>
                      <CardTitle>
                        {formatLocalDate(checkIn.check_in_date)} · {logType}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="gap-2">
                      <Text className="text-muted-foreground">
                        {notesToDisplay}
                      </Text>
                    </CardContent>
                  </Card>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
