
import { View, Text } from 'react-native'
import { Link } from 'expo-router'

export default function WelcomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the App</Text>
      <Link href="/(auth)/login">
        <Text>Get Started</Text>
      </Link>
    </View>
  )
}
