import { useRouter } from "expo-router";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function CheckInScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 gap-4 bg-background p-6">
      <Text className="font-semibold text-2xl">Today&apos;s Check-in</Text>
      <Button onPress={() => router.push("/(tabs)/log-sleep?from=check-in")}>
        <Text>Log Sleep</Text>
      </Button>
      <Button onPress={() => router.push("/(tabs)/log-social?from=check-in")}>
        <Text>Log Social Activity</Text>
      </Button>
      <Button onPress={() => router.push("/(tabs)/log-movement?from=check-in")}>
        <Text>Log Movement</Text>
      </Button>
      <View className="flex-1" />
      <Button variant="outline" onPress={() => router.back()}>
        <Text>Done</Text>
      </Button>
    </View>
  );
}
