import type { User } from "@supabase/supabase-js";
import { create } from "zustand";
import type { Tables } from "~/types/database.types";

type DbUser = Tables<"users">;

interface AuthState {
  user: User | null;
  dbUser: DbUser | null;
  isAuthenticated: boolean;
  isAuthenticatedLoading: boolean;
  isPremium: boolean;
  isPremiumLoading: boolean;
  setUser: (user: User | null) => void;
  setDbUser: (dbUser: DbUser | null) => void;
  setIsPremium: (isPremium: boolean) => void;
  setIsAuthenticatedLoading: (loading: boolean) => void;
  setIsPremiumLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  dbUser: null,
  isAuthenticated: false,
  isAuthenticatedLoading: true,
  isPremium: false,
  isPremiumLoading: true,
  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
    });
  },
  setDbUser: (dbUser) => set({ dbUser }),
  setIsPremium: (isPremium) => set({ isPremium }),
  setIsAuthenticatedLoading: (loading) =>
    set({ isAuthenticatedLoading: loading }),
  setIsPremiumLoading: (loading) => set({ isPremiumLoading: loading }),
}));

export const useAuth = () => useAuthStore();
