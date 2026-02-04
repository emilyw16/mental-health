import { Bell, Heart, Shield, Users } from "lucide-react-native";
import { ScrollView, useColorScheme, View } from "react-native";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";

const steps = [
  {
    number: 1,
    title: "Add trusted people",
    description: "Invite friends or family who care about your wellbeing",
    icon: Heart,
  },
  {
    number: 2,
    title: "They get gentle updates",
    description: "We share patterns, not private details",
    icon: Bell,
  },
  {
    number: 3,
    title: "Support when needed",
    description: "They can reach out if they notice changes",
    icon: Shield,
  },
];

export default function ContactsScreen() {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#9ca3af" : "#6b7280";

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingVertical: 48 }}
    >
      <View className="gap-8 px-6">
        {/* Header */}
        <View className="gap-2">
          <Text className="font-semibold text-2xl">Trusted Contacts</Text>
          <Text className="text-muted-foreground">
            People who care about your wellbeing
          </Text>
        </View>

        {/* Empty State Card */}
        <Card className="border border-border">
          <CardContent className="items-center gap-4 py-12">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Users size={32} color={iconColor} />
            </View>
            <View className="items-center gap-2">
              <Text className="text-center font-semibold">
                No contacts added yet
              </Text>
              <Text className="text-center text-muted-foreground text-sm">
                Add people you trust to be part of your support network
              </Text>
            </View>
            <Button className="mt-2">
              <Text>Add Your First Contact</Text>
            </Button>
          </CardContent>
        </Card>

        {/* How It Works Section */}
        <View className="gap-4">
          <Text className="font-semibold text-lg">How it works</Text>
          <View className="gap-3">
            {steps.map((step) => {
              const IconComponent = step.icon;
              return (
                <Card key={step.number} className="border border-border">
                  <CardHeader className="flex-row items-start gap-4">
                    <View className="h-8 w-8 items-center justify-center rounded-full bg-primary-50">
                      <Text className="font-semibold text-primary-600">
                        {step.number}
                      </Text>
                    </View>
                    <View className="flex-1 gap-1">
                      <CardTitle className="text-base">{step.title}</CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </View>
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <IconComponent size={20} color={iconColor} />
                    </View>
                  </CardHeader>
                </Card>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
