import { View, Alert, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Label } from "~/components/ui/label";
import { getLocalDateString } from "~/lib/date-utils";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabase";
import { parseSelectValue, toSelectOption } from "~/lib/select-utils";

const energyLevels = [
  { label: "1 (Lowest)", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5 (Highest)", value: "5" },
];

const intensityLevels = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const painLevels = [
  { label: "None", value: "none" },
  { label: "Mild", value: "mild" },
  { label: "Moderate", value: "moderate" },
  { label: "Severe", value: "severe" },
];

export default function LogMovementScreen() {
  const router = useRouter();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [movementMinutes, setMovementMinutes] = useState("");
  const [intensity, setIntensity] = useState<string | null>(null);
  const [physicalPainLevel, setPhysicalPainLevel] = useState<string | null>(
    null
  );
  const [energyLevel, setEnergyLevel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setMovementMinutes("");
    setIntensity(null);
    setPhysicalPainLevel(null);
    setEnergyLevel(null);
  };

  useEffect(() => {
    let cancelled = false;
    const loadExisting = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) return;
      const today = getLocalDateString();
      const { data } = await supabase
        .from("check_ins")
        .select("energy_level, notes")
        .eq("user_id", user.id)
        .eq("check_in_date", today)
        .eq("log_type", "movement")
        .maybeSingle();
      if (!cancelled && data) {
        setEnergyLevel(String(data.energy_level));
        const movementMatch = data.notes?.match(/Movement: (\d+) minutes/);
        const intensityMatch = data.notes?.match(/Intensity: (\w+)/);
        const painMatch = data.notes?.match(/Physical Pain: (\w+)/);
        if (movementMatch) setMovementMinutes(movementMatch[1]);
        if (intensityMatch && intensityLevels.some(o => o.value === intensityMatch[1])) setIntensity(intensityMatch[1]);
        if (painMatch && painLevels.some(o => o.value === painMatch[1])) setPhysicalPainLevel(painMatch[1]);
      }
    };
    loadExisting();
    return () => { cancelled = true; };
  }, []);

  const handleSave = async () => {
    if (!energyLevel || !intensity || !physicalPainLevel) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      Alert.alert("Error", "You must be logged in to log your movement.");
      setLoading(false);
      return;
    }

    const notes = `
      Movement: ${movementMinutes} minutes
      Intensity: ${intensity}
      Physical Pain: ${physicalPainLevel}
    `;

    const checkInDate = getLocalDateString();
    const checkInData = {
      user_id: user.id,
      check_in_date: checkInDate,
      log_type: "movement" as const,
      energy_level: parseInt(energyLevel, 10),
      notes: notes.trim(),
      sleep_quality: "okay" as const,
      social_interaction: "no_interaction" as const,
    };

    const { error } = await supabase
      .from("check_ins")
      .upsert(checkInData, {
        onConflict: "user_id,check_in_date,log_type",
      });

    if (error) {
      Alert.alert("Error", "Failed to save movement log: " + error.message);
    } else {
      resetForm();
      Alert.alert("Success", "Movement log saved successfully.");
      if (from === "check-in") {
        router.replace("/(tabs)/check-in");
      } else {
        router.back();
      }
    }
    setLoading(false);
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 gap-4"
    >
      <Text className="text-2xl font-semibold">Log Movement</Text>
      <View className="gap-2">
        <Label>How many minutes of movement did you get?</Label>
        <Input
          placeholder="e.g., 30"
          keyboardType="numeric"
          value={movementMinutes}
          onChangeText={setMovementMinutes}
        />
      </View>
      <View className="gap-2">
        <Label>Level of Intensity</Label>
        <Select
          onValueChange={(value) => {
            const next = parseSelectValue(value);
            if (next) setIntensity(next);
          }}
          value={toSelectOption(intensity, intensityLevels)}
        >
          <SelectTrigger>
            <SelectValue
              placeholder="Select intensity"
              className="text-foreground"
            />
          </SelectTrigger>
          <SelectContent portalHost="RootPortalHost">
            {intensityLevels.map((option) => (
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
        <Label>Energy Level</Label>
        <Select
          onValueChange={(value) => {
            const next = parseSelectValue(value);
            if (next) setEnergyLevel(next);
          }}
          value={toSelectOption(energyLevel, energyLevels)}
        >
          <SelectTrigger>
            <SelectValue
              placeholder="Select energy level"
              className="text-foreground"
            />
          </SelectTrigger>
          <SelectContent portalHost="RootPortalHost">
            {energyLevels.map((option) => (
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
        <Label>Physical Pain</Label>
        <Select
          onValueChange={(value) => {
            const next = parseSelectValue(value);
            if (next) setPhysicalPainLevel(next);
          }}
          value={toSelectOption(physicalPainLevel, painLevels)}
        >
          <SelectTrigger>
            <SelectValue
              placeholder="Select pain level"
              className="text-foreground"
            />
          </SelectTrigger>
          <SelectContent portalHost="RootPortalHost">
            {painLevels.map((option) => (
              <SelectItem
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </SelectContent>
        </Select>
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
    </ScrollView>
  );
}
