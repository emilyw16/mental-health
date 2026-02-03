
import { View, Text, StyleSheet } from 'react-native'
import { Link } from 'expo-router'

import { Button } from '~/components/ui/button'

export default function HowItWorksScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How It Works</Text>
      <View style={styles.pointsContainer}>
        <Text style={styles.point}>
          Daily check-ins about sleep, social interaction, and routine
        </Text>
        <Text style={styles.point}>
          We notice patterns, not just bad days
        </Text>
        <Text style={styles.point}>
          Your trusted contacts are there when you need them
        </Text>
      </View>
      <Link href="/onboarding/privacy" asChild>
        <Button>
          <Text>Next</Text>
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
    marginBottom: 24,
  },
  pointsContainer: {
    marginBottom: 24,
  },
  point: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
})
