import { Link, useRouter } from "expo-router";
import { Eye, Lock, Mail } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export default function SignupScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async () => {
    setLoading(true);
    const validation = formSchema.safeParse(formData);
    if (!validation.success) {
      setErrors(validation.error.issues);
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) Alert.alert(error.message);
    else router.replace("/(tabs)");

    setLoading(false);
  };

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
              <CardTitle className="pb-2 text-center text-2xl">
                Create an account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <View className="gap-5">
                <View className="gap-1.5">
                  <Label>Email</Label>
                  <Input
                    placeholder="Email"
                    value={formData.email}
                    onChangeText={(text) => handleInputChange("email", text)}
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    keyboardType="email-address"
                    leftIcon={<Mail className="text-muted-foreground" />}
                  />
                  {errors.find((e) => e.path.includes("email")) && (
                    <Text className="text-destructive text-sm">
                      {errors.find((e) => e.path.includes("email"))?.message}
                    </Text>
                  )}
                </View>
                <View className="gap-1.5">
                  <Label>Password</Label>
                  <Input
                    placeholder="Password"
                    value={formData.password}
                    onChangeText={(text) => handleInputChange("password", text)}
                    secureTextEntry={!isPasswordVisible}
                    leftIcon={<Lock className="text-muted-foreground" />}
                    rightIcon={
                      <Pressable
                        onPress={() => setPasswordVisible(!isPasswordVisible)}
                      >
                        <Eye className="text-muted-foreground" />
                      </Pressable>
                    }
                  />
                  {errors.find((e) => e.path.includes("password")) && (
                    <Text className="text-destructive text-sm">
                      {errors.find((e) => e.path.includes("password"))?.message}
                    </Text>
                  )}
                </View>
              </View>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button
                className="w-full"
                onPress={handleSignUp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color={colorScheme === "dark" ? "#000" : "#fff"}
                  />
                ) : (
                  <Text>Sign Up</Text>
                )}
              </Button>
              <View className="flex-row items-center gap-2">
                <Text className="text-muted-foreground">
                  Already have an account?
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
