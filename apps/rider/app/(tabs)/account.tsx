import { useRouter } from "expo-router";
import { Linking, StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Heading,
  Icon,
  ListRow,
  Screen,
  SectionLabel,
  Text,
  colors,
  space,
} from "@transferaround/mobile-shared/ui";
import { useAuth } from "../../lib/auth";
import { API_URL } from "../../lib/config";

export default function AccountScreen() {
  const { user, profile, signOut, isDemo } = useAuth();
  const router = useRouter();

  return (
    <Screen scroll>
      <Heading variant="h1">Account</Heading>

      <Card padded>
        <View style={styles.profile}>
          <Avatar name={profile?.full_name} size={60} />
          <View style={{ flex: 1 }}>
            <Text variant="h2">{profile?.full_name || "Traveler"}</Text>
            <Text variant="caption" color={colors.textMuted}>
              {user?.email}
            </Text>
            <Text variant="caption" color={colors.textMuted}>
              {profile?.phone || "No phone on file"}
            </Text>
          </View>
        </View>
      </Card>

      <SectionLabel>Manage</SectionLabel>
      <Card padded={false}>
        <ListRow
          icon="receipt-outline"
          title="Your trips"
          subtitle="Bookings & receipts"
          onPress={() => router.push("/(tabs)/trips")}
        />
        <Divider inset={space.lg} />
        <ListRow
          icon="help-buoy-outline"
          title="Help & support"
          subtitle="Get help with a booking"
          iconColor={colors.accentDeep}
          iconBg={colors.accentSoft}
          onPress={() => void Linking.openURL(`${API_URL}/faq`)}
        />
        <Divider inset={space.lg} />
        <ListRow
          icon="document-text-outline"
          title="Terms & privacy"
          onPress={() => void Linking.openURL(`${API_URL}/legal/terms`)}
        />
      </Card>

      {isDemo ? (
        <Card padded style={styles.demo}>
          <Icon name="information-circle-outline" size={20} color={colors.accentDeep} />
          <Text variant="body" color={colors.textMuted} style={{ flex: 1 }}>
            Demo mode — sign-in is skipped for this preview.
          </Text>
        </Card>
      ) : (
        <Button title="Sign out" variant="outline" icon="log-out-outline" onPress={() => void signOut()} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  profile: { flexDirection: "row", alignItems: "center", gap: space.lg },
  demo: { flexDirection: "row", alignItems: "center", gap: space.md },
});
