# UI Components

This project uses Nativewind and TailwindCSS for styling.

## Component Organization

Following shadcn conventions:
- **Reusable building blocks**: `@/components/ui`
- **Feature components**: `@/components/buttons`, `@/components/initializers`
- **Other components**: `@/components`

## Auth Buttons (`@/components/buttons`)

- `apple-button.tsx` - Apple Sign In using expo-apple-authentication
- `google-button.tsx` - Google OAuth via Supabase with expo-web-browser
- `sign-out-button.tsx` - Sign out from Supabase
- `upgrade-button.tsx` - Opens RevenueCat paywall

## Initializers (`@/components/initializers`)

Components that run side effects on mount (no UI):
- `auth.tsx` - Fetches user state, sets up auth listener, checks premium status
- `revenuecat.tsx` - Configures RevenueCat SDK

## Hooks (`@/hooks`)

- `use-auth.tsx` - Zustand store for auth state (user, dbUser, isPremium, loading states)
