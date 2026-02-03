
import { View, Text, StyleSheet } from 'react-native'
import { Link } from 'expo-router'

import { Button } from '~/components/ui/button'

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        We notice the quiet changes, so you don't face them alone
      </Text>
      <Link href="/onboarding/how-it-works" asChild>
        <Button>
          <Text>Get Started</Text>
        </Button>
      </Link>
      <Link href="/(auth)/login" asChild>
        <Button variant="link">
          <Text>Sign In</Text>
        </Button>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
})
