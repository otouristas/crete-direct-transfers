import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { fetchDriverJobs } from "@transferaround/mobile-shared";
import {
  Card,
  Divider,
  EmptyState,
  Heading,
  RouteRail,
  Screen,
  StatusBadge,
  Text,
  colors,
  fonts,
  space,
} from "@transferaround/mobile-shared/ui";
import { useAuth } from "../../lib/auth";
import { supabase } from "../../lib/supabase";
import { useI18n } from "../../lib/i18n";

type Job = Awaited<ReturnType<typeof fetchDriverJobs>>[number];

export default function JobsScreen() {
  const { user, isDemo } = useAuth();
  const { locale, t } = useI18n();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (isDemo) {
      setJobs([]);
      setLoading(false);
      return;
    }
    if (!user?.id) return;
    setLoading(true);
    try {
      setJobs(await fetchDriverJobs(supabase, user.id));
    } finally {
      setLoading(false);
    }
  }, [user?.id, isDemo]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Screen scroll refreshing={loading} onRefresh={load}>
      <Heading variant="h1">{t("mobile.tab.jobs")}</Heading>

      {loading && jobs.length === 0 ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: space.xl }} />
      ) : null}

      {!loading && jobs.length === 0 ? (
        <EmptyState
          icon="briefcase-outline"
          title={isDemo ? "Demo" : t("mobile.noJobs")}
          subtitle={
            isDemo ? "Go online on Offers to preview sample offers." : t("mobile.noJobsHelp")
          }
        />
      ) : null}

      {jobs.map((j) => (
        <Card key={j.id} onPress={() => router.push(`/job/${j.id}`)} padded>
          <View style={styles.head}>
            <StatusBadge status={String(j.status)} />
            <Text style={styles.price}>€{(j.price_cents / 100).toFixed(0)}</Text>
          </View>
          <Divider />
          <View style={{ marginTop: space.md }}>
            <RouteRail
              from={j.pickup_address || t("mobile.pickup")}
              to={j.dropoff_address || t("mobile.dropoff")}
              compact
            />
          </View>
          <Text variant="caption" color={colors.textMuted} style={{ marginTop: space.md }}>
            {new Date(j.pickup_at).toLocaleString(locale)}
          </Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: space.md,
  },
  price: { fontFamily: fonts.bold, fontSize: 18, color: colors.text },
});
