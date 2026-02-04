"use client";

import * as Sentry from "@sentry/react-native";
import { useEffect } from "react";
import { Alert } from "react-native";
import { useAuthStore } from "~/hooks/use-auth";
import { supabase } from "~/lib/supabase";

export function AuthInitializer() {
  const {
    setUser,
    setDbUser,
    setIsPremium,
    setIsAuthenticatedLoading,
    setIsPremiumLoading,
  } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsAuthenticatedLoading(true);
        setIsPremiumLoading(true);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          return;
        }

        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        // First check if the user is premium in the database
        setIsPremium(userData?.is_premium ?? false);

        setDbUser(userData);
        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        Alert.alert(
          "Error fetching user:",
          error instanceof Error ? error.message : "Unknown error",
        );
        Sentry.captureException(error);
        setUser(null);
      } finally {
        setIsAuthenticatedLoading(false);
        setIsPremiumLoading(false);
      }
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [
    setUser,
    setDbUser,
    setIsPremium,
    setIsAuthenticatedLoading,
    setIsPremiumLoading,
  ]);

  return null;
}
