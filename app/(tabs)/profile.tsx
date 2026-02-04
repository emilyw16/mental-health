import type { Session } from "@supabase/supabase-js";
import { Link } from "expo-router";
import { User } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { supabase } from "~/lib/supabase";

export default function ProfileScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Card className="w-full max-w-sm rounded-2xl bg-background p-6">
          <CardHeader className="items-center">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-muted">
              <User size={40} className="text-muted-foreground" />
            </View>
            <CardTitle className="pb-2 text-center text-2xl">
              Create an Account
            </CardTitle>
            <CardDescription className="text-center">
              Sign up to save your progress, sync across devices, and access all
              features.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex-col gap-3">
            <Link href="/(auth)/signup" asChild>
              <Button className="w-full">
                <Text>Sign Up</Text>
              </Button>
            </Link>
            <View className="flex-row items-center gap-2">
              <Text className="text-muted-foreground">
                Already have an account?
              </Text>
              <Link href="/(auth)/login">
                <Text className="underline">Log in</Text>
              </Link>
            </View>
          </CardFooter>
        </Card>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background p-6">
      <View className="flex-1 items-center justify-center">
        <Card className="w-full max-w-sm rounded-2xl bg-background p-6">
          <CardHeader className="items-center">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-muted">
              <User size={40} className="text-muted-foreground" />
            </View>
            <CardTitle className="pb-2 text-center text-xl">
              {session.user.email}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="text-center text-muted-foreground">
              You&apos;re signed in
            </Text>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onPress={() => supabase.auth.signOut()}
            >
              <Text>Sign Out</Text>
            </Button>
          </CardFooter>
        </Card>
      </View>
    </View>
  );
}
