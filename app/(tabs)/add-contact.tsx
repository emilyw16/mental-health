import { View, Alert } from "react-native";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useRouter } from "expo-router";
import { Label } from "~/components/ui/label";
import { useState } from "react";
import { supabase } from "~/lib/supabase";

export default function AddContactScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      Alert.alert("Error", "You must be logged in to add a contact.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("trusted_contacts").insert({
      user_id: user.id,
      contact_name: name,
      contact_email: email,
      contact_phone: phone,
    });

    if (error) {
      Alert.alert("Error", "Failed to save contact: " + error.message);
    } else {
      setName("");
      setEmail("");
      setPhone("");
      Alert.alert("Success", "Contact saved successfully.");
      router.back();
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 gap-4 p-6 bg-background">
      <Text className="text-2xl font-semibold">Add Trusted Contact</Text>
      <View className="gap-2">
        <Label>Name</Label>
        <Input
          placeholder="Contact's name"
          value={name}
          onChangeText={setName}
          editable={!loading}
        />
      </View>
      <View className="gap-2">
        <Label>Email</Label>
        <Input
          placeholder="Contact's email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />
      </View>
      <View className="gap-2">
        <Label>Phone Number</Label>
        <Input
          placeholder="Contact's phone number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          editable={!loading}
        />
      </View>
      <View className="flex-1" />
      <Button onPress={handleSave} disabled={loading}>
        <Text>{loading ? "Saving..." : "Save Contact"}</Text>
      </Button>
      <Button
        variant="outline"
        onPress={() => router.back()}
        disabled={loading}
      >
        <Text>Cancel</Text>
      </Button>
    </View>
  );
}
