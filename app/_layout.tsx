import 'react-native-url-polyfill/auto'
import { useEffect } from 'react'
import { Slot, useRouter, useSegments } from 'expo-router'
import { Session } from '@supabase/supabase-js'

import { supabase } from '~/lib/supabase'

export default function RootLayout() {
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        handleSessionChange(session)
      },
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleSessionChange = (session: Session | null) => {
    const inAuthGroup = segments[0] === '(auth)'

    if (session && !inAuthGroup) {
      router.replace('/(tabs)')
    }
    else if (!session) {
      router.replace('/(auth)/login')
    }
  }

  return <Slot />
}