import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { Link, useRouter } from 'expo-router'
import { Eye, Lock, Mail } from 'lucide-react-native'
import { z } from 'zod'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { useColorScheme } from '~/lib/useColorScheme'
import { cn } from '~/lib/utils'
import { supabase } from '~/lib/supabase'

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
})

export default function SignupScreen() {
  const router = useRouter()
  const { isDarkColorScheme } = useColorScheme()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<z.ZodIssue[]>([])
  const [loading, setLoading] = useState(false)
  const [isPasswordVisible, setPasswordVisible] = useState(false)

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSignUp = async () => {
    setLoading(true)
    const validation = formSchema.safeParse(formData)
    if (!validation.success) {
      setErrors(validation.error.errors)
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    })

    if (error)
      Alert.alert(error.message)
    else
      router.replace('/(tabs)')

    setLoading(false)
  }

  const INPUT_CLASS
    = 'bg-background web:group-focus:ring-foreground web:group-focus:ring-2 web:focus:outline-none web:focus:ring-2 web:focus:ring-foreground'

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Card className="w-full max-w-sm p-6 rounded-2xl bg-background">
            <CardHeader className="items-center">
              <CardTitle className="pb-2 text-4xl text-center">
                Create an account
              </CardTitle>
              <CardDescription className="text-center">
                Enter your email and password to create an account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <View className="gap-5">
                <View className="gap-1.5">
                  <Label>Email</Label>
                  <Input
                    placeholder="Email"
                    value={formData.email}
                    onChangeText={text => handleInputChange('email', text)}
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    keyboardType="email-address"
                    className={INPUT_CLASS}
                    leftIcon={<Mail className="text-muted-foreground" />}
                  />
                  {errors.find(e => e.path.includes('email')) && (
                    <Text className="text-sm text-destructive">
                      {errors.find(e => e.path.includes('email'))!.message}
                    </Text>
                  )}
                </View>
                <View className="gap-1.5">
                  <Label>Password</Label>
                  <Input
                    placeholder="Password"
                    value={formData.password}
                    onChangeText={text => handleInputChange('password', text)}
                    secureTextEntry={!isPasswordVisible}
                    className={INPUT_CLASS}
                    leftIcon={<Lock className="text-muted-foreground" />}
                    rightIcon={
                      <Pressable onPress={() => setPasswordVisible(!isPasswordVisible)}>
                        <Eye className="text-muted-foreground" />
                      </Pressable>
                    }
                  />
                  {errors.find(e => e.path.includes('password')) && (
                    <Text className="text-sm text-destructive">
                      {errors.find(e => e.path.includes('password'))!.message}
                    </Text>
                  )}
                </View>
              </View>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button className="w-full" onPress={handleSignUp} disabled={loading}>
                {loading
                  ? (
                    <ActivityIndicator
                      size="small"
                      color={isDarkColorScheme ? '#000' : '#fff'}
                    />
                    )
                  : (
                    <Text>Sign Up</Text>
                    )}
              </Button>
              <View className="flex-row items-center gap-2">
                <Text className="text-muted-foreground">
                  Already have an account?
                </Text>
                <Link href="/(auth)/login">
                  <Text className="underline">
                    Sign in
                  </Text>
                </Link>
              </View>
            </CardFooter>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
  },
})
