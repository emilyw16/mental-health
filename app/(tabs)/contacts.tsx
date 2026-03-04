import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Bell, Heart, Shield, Users } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  useColorScheme,
  View,
} from "react-native";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { supabase } from "~/lib/supabase";

const steps = [
  {
    number: 1,
    title: "Add trusted people",
    description: "Invite friends or family who care about your wellbeing",
    icon: Heart,
  },
  {
    number: 2,
    title: "Share gentle updates",
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

type Contact = {
  id: string;
  contact_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  relationship: string | null;
};

export default function ContactsScreen() {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#9ca3af" : "#6b7280";
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      const fetchContacts = async () => {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) {
            setLoading(false);
            return;
          }
          const { data, error } = await supabase
            .from("trusted_contacts")
            .select(
              "id, contact_name, contact_email, contact_phone, relationship",
            )
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
          if (!cancelled) {
            if (error)
              Alert.alert("Error", `Failed to load contacts: ${error.message}`);
            else setContacts(data ?? []);
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      };
      setLoading(true);
      fetchContacts();
      return () => {
        cancelled = true;
      };
    }, []),
  );

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

        {/* Contacts List or Empty State */}
        {loading ? (
          <ActivityIndicator size="large" color={iconColor} />
        ) : contacts.length === 0 ? (
          <Card className="border border-border">
            <CardContent className="items-center gap-4 py-12">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Users size={32} color={iconColor} />
              </View>
              <View className="items-center gap-2">
                <Text className="text-center font-semibold">
                  No contacts added yet
                </Text>
                <Text className="text-muted-foreground text-sm">
                  Add people you trust to be part of your support network
                </Text>
              </View>
              <Button
                className="mt-2"
                onPress={() => router.push("/(tabs)/add-contact")}
              >
                <Text>Add Your First Contact</Text>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <View className="gap-3">
            {contacts.map((contact) => (
              <Card key={contact.id} className="border border-border">
                <CardHeader className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-primary-50">
                    <Users size={20} color={iconColor} />
                  </View>
                  <View className="flex-1">
                    <CardTitle className="text-base">
                      {contact.contact_name}
                    </CardTitle>
                    {(contact.contact_email || contact.contact_phone) && (
                      <CardDescription>
                        {[contact.contact_email, contact.contact_phone]
                          .filter(Boolean)
                          .join(" · ")}
                      </CardDescription>
                    )}
                  </View>
                </CardHeader>
              </Card>
            ))}
            <Button
              variant="outline"
              onPress={() => router.push("/(tabs)/add-contact")}
            >
              <Text>Add Another Contact</Text>
            </Button>
          </View>
        )}

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
