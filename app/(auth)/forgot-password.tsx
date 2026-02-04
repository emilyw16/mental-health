import { Link, useRouter } from "expo-router";
import { Mail } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { supabase } from "~/lib/supabase";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setLoading(true);
    const validation = formSchema.safeParse({ email });
    if (!validation.success) {
      setErrors(validation.error.issues);
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert("Check your email", "We sent you a password reset link.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }

    setLoading(false);
  };

  const INPUT_CLASS =
    "bg-background web:group-focus:ring-foreground web:group-focus:ring-2 web:focus:outline-none web:focus:ring-2 web:focus:ring-foreground";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Card className="w-full max-w-sm rounded-2xl bg-background p-6">
            <CardHeader className="items-center">
              <CardTitle className="pb-2 text-center text-4xl">
                Reset Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <View className="gap-5">
                <View className="gap-1.5">
                  <Label>Email</Label>
                  <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    keyboardType="email-address"
                    className={INPUT_CLASS}
                    leftIcon={<Mail className="text-muted-foreground" />}
                  />
                  {errors.find((e) => e.path.includes("email")) && (
                    <Text className="text-destructive text-sm">
                      {errors.find((e) => e.path.includes("email"))?.message}
                    </Text>
                  )}
                </View>
              </View>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button
                className="w-full"
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color={colorScheme === "dark" ? "#000" : "#fff"}
                  />
                ) : (
                  <Text>Send Reset Link</Text>
                )}
              </Button>
              <View className="flex-row items-center gap-2">
                <Text className="text-muted-foreground">
                  Remember your password?
                </Text>
                <Link href="/(auth)/login">
                  <Text className="underline">Sign in</Text>
                </Link>
              </View>
            </CardFooter>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  content: {
    alignItems: "center",
  },
});
