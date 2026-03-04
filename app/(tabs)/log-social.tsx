import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
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

type InteractionQuality = "good" | "medium" | "bad";
type InteractionFeeling =
  | "happy"
  | "no_change"
  | "angry"
  | "sad"
  | "afraid"
  | "anxious";

const qualityOptions: { label: string; value: InteractionQuality }[] = [
  { label: "Good", value: "good" },
  { label: "Medium", value: "medium" },
  { label: "Bad", value: "bad" },
];

const feelingOptions: { label: string; value: InteractionFeeling }[] = [
  { label: "No Change", value: "no_change" },
  { label: "Happy", value: "happy" },
  { label: "Angry", value: "angry" },
  { label: "Sad", value: "sad" },
  { label: "Afraid", value: "afraid" },
  { label: "Anxious", value: "anxious" },
];

const painLevels = [
  { label: "None", value: "none" },
  { label: "Mild", value: "mild" },
  { label: "Moderate", value: "moderate" },
  { label: "Severe", value: "severe" },
];

export default function LogSocialScreen() {
  const router = useRouter();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [interactions, setInteractions] = useState("");
  const [quality, setQuality] = useState<InteractionQuality | null>(null);
  const [feeling, setFeeling] = useState<InteractionFeeling | null>(null);
  const [emotionalPainLevel, setEmotionalPainLevel] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setInteractions("");
    setQuality(null);
    setFeeling(null);
    setEmotionalPainLevel(null);
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
        .select("notes")
        .eq("user_id", user.id)
        .eq("check_in_date", today)
        .eq("log_type", "social")
        .maybeSingle();
      if (!cancelled && data?.notes) {
        const interactionsMatch = data.notes.match(/Interactions: (\d+)/);
        const qualityMatch = data.notes.match(/Quality: (\w+)/);
        const feelingMatch = data.notes.match(/Feeling: (\w+)/);
        const painMatch = data.notes.match(/Emotional Pain: (\w+)/);
        if (interactionsMatch) setInteractions(interactionsMatch[1]);
        if (qualityMatch && ["good", "medium", "bad"].includes(qualityMatch[1]))
          setQuality(qualityMatch[1] as InteractionQuality);
        if (
          feelingMatch &&
          feelingOptions.some((o) => o.value === feelingMatch[1])
        )
          setFeeling(feelingMatch[1] as InteractionFeeling);
        if (painMatch && painLevels.some((o) => o.value === painMatch[1]))
          setEmotionalPainLevel(painMatch[1]);
      }
    };
    loadExisting();
    return () => {
      cancelled = true;
    };
  }, []);

  const mapQualityToEnum = (quality: InteractionQuality) => {
    switch (quality) {
      case "good":
        return "meaningful_connection";
      case "medium":
        return "brief_interaction";
      case "bad":
        return "no_interaction"; // Or 'avoided_people'
    }
  };

  const handleSave = async () => {
    if (!quality || !feeling || !interactions || !emotionalPainLevel) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      Alert.alert("Error", "You must be logged in to log social activity.");
      setLoading(false);
      return;
    }

    const notes = `
      Interactions: ${interactions}
      Quality: ${quality}
      Feeling: ${feeling}
      Emotional Pain: ${emotionalPainLevel}
    `;

    const checkInDate = getLocalDateString();
    const checkInData = {
      user_id: user.id,
      check_in_date: checkInDate,
      log_type: "social" as const,
      social_interaction: mapQualityToEnum(quality),
      notes: notes.trim(),
      sleep_quality: "okay" as const,
      energy_level: 3,
    };

    const { error } = await supabase.from("check_ins").upsert(checkInData, {
      onConflict: "user_id,check_in_date,log_type",
    });

    if (error) {
      Alert.alert("Error", `Failed to save social log: ${error.message}`);
    } else {
      resetForm();
      Alert.alert("Success", "Social log saved successfully.");
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
      <Text className="font-semibold text-2xl">Log Social Activity</Text>
      <View className="gap-2">
        <Label>How many social interactions did you have?</Label>
        <Input
          placeholder="e.g., 3"
          keyboardType="numeric"
          value={interactions}
          onChangeText={setInteractions}
        />
      </View>
      <View className="gap-2">
        <Label>Overall quality of interactions?</Label>
        <Select
          onValueChange={(value) => {
            const next = parseSelectValue(value);
            if (next) setQuality(next as InteractionQuality);
          }}
          value={toSelectOption(quality, qualityOptions)}
        >
          <SelectTrigger>
            <SelectValue
              placeholder="Select quality"
              className="text-foreground"
            />
          </SelectTrigger>
          <SelectContent portalHost="RootPortalHost">
            {qualityOptions.map((option) => (
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
        <Label>How did they make you feel?</Label>
        <Select
          onValueChange={(value) => {
            const next = parseSelectValue(value);
            if (next) setFeeling(next as InteractionFeeling);
          }}
          value={toSelectOption(feeling, feelingOptions)}
        >
          <SelectTrigger>
            <SelectValue
              placeholder="Select feeling"
              className="text-foreground"
            />
          </SelectTrigger>
          <SelectContent portalHost="RootPortalHost">
            {feelingOptions.map((option) => (
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
        <Label>Emotional Pain</Label>
        <Select
          onValueChange={(value) => {
            const next = parseSelectValue(value);
            if (next) setEmotionalPainLevel(next);
          }}
          value={toSelectOption(emotionalPainLevel, painLevels)}
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
