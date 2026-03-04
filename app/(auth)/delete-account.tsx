import { router } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { supabase } from "~/lib/supabase";

export default function DeleteAccount() {
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  async function handleDelete() {
    setLoading(true);
    if (confirmText !== "permanently delete") {
      Alert.alert(
        "Incorrect confirmation text",
        "Please type 'permanently delete' to confirm.",
      );
      setLoading(false);
      return;
    }

    const { error } = await supabase.rpc("delete_my_account");

    if (error) {
      Alert.alert("Error deleting account", error.message);
    } else {
      Alert.alert(
        "Account deleted",
        "Your account has been successfully deleted.",
      );
      supabase.auth.signOut();
      router.replace("/");
    }
    setLoading(false);
  }

  return (
    <View className="flex-1 items-center justify-center bg-background p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete your
            account and all associated data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Text className="mb-2 text-muted-foreground text-sm">
            To confirm, please type{" "}
            <Text className="font-bold text-destructive">
              permanently delete
            </Text>{" "}
            below:
          </Text>
          <Input
            placeholder="permanently delete"
            onChangeText={setConfirmText}
            value={confirmText}
            autoCapitalize="none"
            editable={!loading}
          />
        </CardContent>
        <CardFooter>
          <Button
            variant="destructive"
            className="w-full"
            onPress={handleDelete}
            disabled={loading || confirmText !== "permanently delete"}
          >
            <Text>{loading ? "Deleting..." : "Permanently Delete Account"}</Text>
          </Button>
        </CardFooter>
      </Card>
    </View>
  );
}
