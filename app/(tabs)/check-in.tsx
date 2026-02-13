import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useRouter } from "expo-router";

export default function CheckInScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 gap-4 p-6 bg-background">
      <Text className="text-2xl font-semibold">Today's Check-in</Text>
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
