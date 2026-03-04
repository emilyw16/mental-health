import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import { getLocalDateString } from "~/lib/date-utils";
import { parseSelectValue, toSelectOption } from "~/lib/select-utils";
import { supabase } from "~/lib/supabase";

type SleepQuality =
  | "well_rested"
  | "okay"
  | "restless"
  | "poorly"
  | "did_not_sleep";

const sleepQualityOptions: { label: string; value: SleepQuality }[] = [
  { label: "Well Rested", value: "well_rested" },
  { label: "Okay", value: "okay" },
  { label: "Restless", value: "restless" },
  { label: "Poorly", value: "poorly" },
  { label: "Did Not Sleep", value: "did_not_sleep" },
];

export default function LogSleepScreen() {
  const router = useRouter();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [quality, setQuality] = useState<SleepQuality | null>(null);
  const [hours, setHours] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setQuality(null);
    setHours("");
  };

  useEffect(() => {
    let cancelled = false;
    const loadExisting = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;
      const today = getLocalDateString();
      const { data } = await supabase
        .from("check_ins")
        .select("sleep_quality, notes")
        .eq("user_id", user.id)
        .eq("check_in_date", today)
        .eq("log_type", "sleep")
        .maybeSingle();
      if (!cancelled && data) {
        setQuality(data.sleep_quality as SleepQuality);
        const hoursMatch = data.notes?.match(/Slept for (\d+(?:\.\d+)?) hours/);
        if (hoursMatch) setHours(hoursMatch[1]);
      }
    };
    loadExisting();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    if (!quality) {
      Alert.alert("Error", "Please select a sleep quality.");
      return;
    }
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      Alert.alert("Error", "You must be logged in to log sleep.");
      setLoading(false);
      return;
    }

    const checkInDate = getLocalDateString();
    const checkInData = {
      user_id: user.id,
      check_in_date: checkInDate,
      log_type: "sleep" as const,
      sleep_quality: quality,
      social_interaction: "no_interaction" as const,
      energy_level: 3,
      notes: `Slept for ${hours} hours.`,
    };

    const { error } = await supabase.from("check_ins").upsert(checkInData, {
      onConflict: "user_id,check_in_date,log_type",
    });

    if (error) {
      Alert.alert("Error", `Failed to save sleep log: ${error.message}`);
    } else {
      resetForm();
      Alert.alert("Success", "Sleep log saved successfully.");
      if (from === "check-in") {
        router.replace("/(tabs)/check-in");
      } else {
        router.back();
      }
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 gap-4 bg-background p-6">
      <Text className="font-semibold text-2xl">Log Sleep</Text>
      <View className="gap-2">
        <Label>How would you describe your sleep?</Label>
        <Select
          onValueChange={(value) => {
            const next = parseSelectValue(value);
            if (next) setQuality(next as SleepQuality);
          }}
          value={toSelectOption(quality, sleepQualityOptions)}
        >
          <SelectTrigger>
            <SelectValue
              placeholder="Select sleep quality"
              className="text-foreground"
            />
          </SelectTrigger>
          <SelectContent portalHost="RootPortalHost">
            {sleepQualityOptions.map((option) => (
              <SelectItem
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </SelectContent>
        </Select>
      </View>
      <View className="gap-2">
        <Label>How many hours did you sleep?</Label>
        <Input
          placeholder="e.g., 8"
          keyboardType="numeric"
          value={hours}
          onChangeText={setHours}
        />
      </View>
      <View className="flex-1" />
      <Button onPress={handleSave} disabled={loading}>
        <Text>{loading ? "Saving..." : "Save"}</Text>
      </Button>
      <Button
        variant="outline"
        onPress={() => router.back()}
        disabled={loading}
      >
        <Text>Cancel</Text>
      </Button>
    </View>
  );
}
