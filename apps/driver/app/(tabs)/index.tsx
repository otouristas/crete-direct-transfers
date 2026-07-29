import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as Notifications from "expo-notifications";
import {
  fetchMyJobOffers,
  fetchOpenJobs,
  respondToOffer,
  claimJob,
  setDriverOnline,
} from "@transferaround/mobile-shared";
import {
  Avatar,
  Button,
  Card,
  Divider,
  EmptyState,
  Heading,
  Icon,
  RouteRail,
  Screen,
  SectionLabel,
  StatTile,
  Text,
  colors,
  fonts,
  radius,
  space,
} from "@transferaround/mobile-shared/ui";
import { useAuth } from "../../lib/auth";
import { useI18n } from "../../lib/i18n";
import { supabase } from "../../lib/supabase";
import { API_URL } from "../../lib/config";
import {
  ACCEPT_ACTION,
  DECLINE_ACTION,
  presentDemoOfferNotification,
} from "../../lib/demo-notifications";

type Offer = Awaited<ReturnType<typeof fetchMyJobOffers>>[number];
type OpenJob = Awaited<ReturnType<typeof fetchOpenJobs>>[number];
type DemoOffer = Offer & { customerName: string };

function euros(cents: number) {
  return `€${(cents / 100).toFixed(0)}`;
}

/** Fresh demo offers (expiry relative to "now" so countdowns start on go-online). */
function makeDemoOffers(): DemoOffer[] {
  return [
    {
      offer_id: "demo-offer-1",
      id: "demo-booking-1",
      customerName: "George K.",
      pickup_address: "Chania Airport (CHQ)",
      dropoff_address: "Elounda",
      pickup_at: new Date(Date.now() + 36e5 * 20).toISOString(),
      price_cents: 9500,
      expires_at: new Date(Date.now() + 90_000).toISOString(),
    } as DemoOffer,
    {
      offer_id: "demo-offer-2",
      id: "demo-booking-2",
      customerName: "Maria S.",
      pickup_address: "Heraklion Airport (HER)",
      dropoff_address: "Rethymno Old Town",
      pickup_at: new Date(Date.now() + 36e5 * 28).toISOString(),
      price_cents: 7800,
      expires_at: new Date(Date.now() + 75_000).toISOString(),
    } as DemoOffer,
  ];
}

function GateScreen({
  icon,
  title,
  subtitle,
  onSignOut,
}: {
  icon: any;
  title: string;
  subtitle: string;
  onSignOut: () => void;
}) {
  const { t } = useI18n();
  return (
    <Screen edges={["top", "bottom"]}>
      <View style={styles.gate}>
        <View style={styles.gateIcon}>
          <Icon name={icon} size={30} color={colors.accentDeep} />
        </View>
        <Heading variant="h1" center>
          {title}
        </Heading>
        <Text variant="body" color={colors.textMuted} center>
          {subtitle}
        </Text>
        <Button
          title={t("common.signOut")}
          variant="outline"
          icon="log-out-outline"
          onPress={onSignOut}
        />
      </View>
    </Screen>
  );
}

export default function OffersScreen() {
  const { profile, user, refreshProfile, signOut, isDemo, setDemoOnline } = useAuth();
  const { t } = useI18n();
  const driverRow = (() => {
    const dp = profile?.driver_profiles as
      | { is_online?: boolean; approval_status?: string; vehicle_make_model?: string }
      | { is_online?: boolean; approval_status?: string; vehicle_make_model?: string }[]
      | null
      | undefined;
    if (!dp) return null;
    return Array.isArray(dp) ? (dp[0] ?? null) : dp;
  })();
  const isOnline = Boolean(driverRow?.is_online);
  const approved = profile?.role === "driver" && driverRow?.approval_status === "approved";

  const [offers, setOffers] = useState<Offer[]>([]);
  const [jobs, setJobs] = useState<OpenJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  const load = useCallback(async () => {
    if (!isOnline) {
      setOffers([]);
      setJobs([]);
      setLoading(false);
      return;
    }
    if (isDemo) {
      setOffers(makeDemoOffers());
      setJobs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [o, j] = await Promise.all([fetchMyJobOffers(supabase), fetchOpenJobs(supabase)]);
      setOffers(o);
      setJobs(j);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("mobile.failedLoad"));
    } finally {
      setLoading(false);
    }
  }, [isOnline, isDemo]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (isDemo || !user?.id) return;
    const channel = supabase
      .channel(`driver-offers-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "job_offers",
          filter: `driver_id=eq.${user.id}`,
        },
        () => {
          void load();
        },
      )
      .subscribe();
    const poll = setInterval(() => void load(), 15_000);
    return () => {
      void supabase.removeChannel(channel);
      clearInterval(poll);
    };
  }, [user?.id, load, isDemo]);

  useEffect(() => {
    if (!isOnline || offers.length === 0) return;
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, [isOnline, offers.length]);

  async function toggleOnline() {
    setBusyId("online");
    try {
      if (isDemo) {
        const goingOnline = !isOnline;
        setDemoOnline(goingOnline);
        setAccepted(null);
        if (goingOnline) {
          // Simulate an incoming dispatch push ~1.6s after going online.
          const first = makeDemoOffers()[0];
          setTimeout(() => {
            void presentDemoOfferNotification({
              offerId: first.offer_id as string,
              customerName: first.customerName,
              from: first.pickup_address as string,
              to: first.dropoff_address as string,
              priceCents: first.price_cents as number,
            });
          }, 1600);
        }
      } else {
        await setDriverOnline(supabase, !isOnline);
        await refreshProfile();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update availability");
    } finally {
      setBusyId(null);
    }
  }

  // Handle taps / actions on the demo ride-request notification.
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as {
        type?: string;
        offerId?: string;
        customerName?: string;
      };
      if (data?.type !== "demo_offer" || !data.offerId) return;
      setOffers((prev) => prev.filter((o) => o.offer_id !== data.offerId));
      if (response.actionIdentifier === DECLINE_ACTION) {
        setError(`Declined ${data.customerName ?? "the"} ride (demo).`);
      } else {
        // Default tap or the Accept action button.
        setAccepted(`You accepted ${data.customerName ?? "the"} ride`);
      }
    });
    return () => sub.remove();
  }, []);

  async function onRespond(offerId: string, accept: boolean, bookingId: string) {
    if (isDemo) {
      setError(
        accept ? "Demo mode — accept is preview only." : "Demo mode — offer declined (local).",
      );
      if (!accept) setOffers((prev) => prev.filter((o) => o.offer_id !== offerId));
      return;
    }
    setBusyId(offerId);
    try {
      const booking = await respondToOffer(supabase, offerId, accept);
      if (accept && booking) {
        await fetch(`${API_URL}/api/dispatch/assigned`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ bookingId }),
        }).catch(() => null);
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Respond failed");
    } finally {
      setBusyId(null);
    }
  }

  async function onClaim(bookingId: string) {
    if (isDemo) {
      setError(t("mobile.demoClaimOnly"));
      return;
    }
    setBusyId(bookingId);
    try {
      await claimJob(supabase, bookingId);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("mobile.claimFailed"));
    } finally {
      setBusyId(null);
    }
  }

  if (profile && profile.role !== "driver") {
    return (
      <GateScreen
        icon="car-outline"
        title={t("mobile.driverAccessRequired")}
        subtitle={t("mobile.driverAccessBody")}
        onSignOut={() => void signOut()}
      />
    );
  }

  if (profile && !approved) {
    return (
      <GateScreen
        icon="time-outline"
        title={t("mobile.pendingApproval")}
        subtitle={t("mobile.pendingApprovalBody")}
        onSignOut={() => void signOut()}
      />
    );
  }

  const firstName = (profile?.full_name ?? t("mobile.driverDefault")).split(" ")[0];
  const stats = isDemo
    ? { earnings: "€240", trips: "4", rating: "4.9" }
    : { earnings: "—", trips: "—", rating: "New" };

  function countdown(expires?: string | null) {
    if (!expires) return null;
    const secs = Math.max(0, Math.round((new Date(expires).getTime() - now) / 1000));
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return { secs, label: `${m}:${s.toString().padStart(2, "0")}` };
  }

  return (
    <Screen scroll refreshing={loading} onRefresh={load}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text variant="caption" color={colors.textMuted}>
            DRIVER
          </Text>
          <Heading variant="h1">{t("mobile.greeting", { name: firstName })}</Heading>
        </View>
        {driverRow?.vehicle_make_model ? (
          <View style={styles.vehicleChip}>
            <Icon name="car-sport" size={14} color={colors.primary} />
            <Text
              variant="caption"
              color={colors.primary}
              style={{ fontFamily: fonts.bodySemibold }}
            >
              {driverRow.vehicle_make_model}
            </Text>
          </View>
        ) : null}
      </View>

      <Card padded elevated style={isOnline ? styles.heroOnline : undefined}>
        <View style={styles.heroTop}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isOnline ? colors.success : colors.textFaint },
            ]}
          />
          <View style={{ flex: 1 }}>
            <Text variant="h2">{isOnline ? t("mobile.online") : t("mobile.offlineTitle")}</Text>
            <Text variant="caption" color={colors.textMuted}>
              {isOnline ? t("mobile.onlineBody") : t("mobile.offlineBody")}
            </Text>
          </View>
        </View>
        <Button
          title={isOnline ? t("mobile.goOffline") : t("mobile.goOnline")}
          icon={isOnline ? "pause" : "flash"}
          variant={isOnline ? "outline" : "accent"}
          onPress={() => void toggleOnline()}
          loading={busyId === "online"}
          fullWidth
          style={{ marginTop: space.lg }}
        />
      </Card>

      <Card padded>
        <View style={styles.statsRow}>
          <StatTile
            label="Today"
            value={stats.earnings}
            icon={<Icon name="cash-outline" size={18} color={colors.accentDeep} />}
          />
          <View style={styles.statDivider} />
          <StatTile
            label="Trips"
            value={stats.trips}
            icon={<Icon name="navigate-outline" size={18} color={colors.accentDeep} />}
          />
          <View style={styles.statDivider} />
          <StatTile
            label="Rating"
            value={stats.rating}
            icon={<Icon name="star-outline" size={18} color={colors.accentDeep} />}
          />
        </View>
      </Card>

      {error ? (
        <View style={styles.errorBox}>
          <Icon name="alert-circle" size={18} color={colors.danger} />
          <Text variant="caption" color={colors.danger} style={{ flex: 1 }}>
            {error}
          </Text>
        </View>
      ) : null}

      {!isOnline ? (
        <EmptyState
          icon="flash-outline"
          title={t("mobile.offlineTitle")}
          subtitle={t("mobile.offlineHelp")}
        />
      ) : (
        <>
          <SectionLabel>{t("mobile.personalOffers")}</SectionLabel>
          {offers.length === 0 ? (
            <EmptyState
              icon="notifications-outline"
              title={t("mobile.noOffers")}
              subtitle={t("mobile.noOffersHelp")}
            />
          ) : (
            offers.map((o) => {
              const cd = countdown(o.expires_at as string | null);
              const expiring = cd ? cd.secs <= 20 : false;
              return (
                <Card key={o.offer_id ?? o.id ?? ""} padded>
                  <View style={styles.offerHead}>
                    <View style={styles.offerTag}>
                      <Icon name="flash" size={13} color={colors.accentDeep} />
                      <Text
                        variant="caption"
                        color={colors.accentDeep}
                        style={{ fontFamily: fonts.bodySemibold }}
                      >
                        {t("mobile.newOffer")}
                      </Text>
                    </View>
                    {cd ? (
                      <View style={[styles.timer, expiring ? styles.timerHot : null]}>
                        <Icon
                          name="time-outline"
                          size={13}
                          color={expiring ? colors.danger : colors.textMuted}
                        />
                        <Text
                          variant="caption"
                          color={expiring ? colors.danger : colors.textMuted}
                          style={{ fontFamily: fonts.bodySemibold }}
                        >
                          {cd.label}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <View style={{ marginTop: space.md }}>
                    <RouteRail
                      from={(o.pickup_address as string) || "Pickup"}
                      to={(o.dropoff_address as string) || "Drop-off"}
                    />
                  </View>

                  <Divider />
                  <View style={styles.offerMeta}>
                    <View>
                      <Text variant="caption" color={colors.textMuted}>
                        {t("mobile.pickup")}
                      </Text>
                      <Text variant="subtitle">
                        {o.pickup_at ? new Date(o.pickup_at).toLocaleString() : "—"}
                      </Text>
                    </View>
                    <Text style={styles.price}>{euros((o.price_cents as number) ?? 0)}</Text>
                  </View>

                  <View style={styles.offerActions}>
                    <Button
                      title={t("mobile.decline")}
                      variant="outline"
                      onPress={() => void onRespond(o.offer_id as string, false, o.id as string)}
                      style={{ flex: 1 }}
                    />
                    <Button
                      title={t("mobile.accept")}
                      variant="accent"
                      onPress={() => void onRespond(o.offer_id as string, true, o.id as string)}
                      loading={busyId === o.offer_id}
                      style={{ flex: 1 }}
                    />
                  </View>
                </Card>
              );
            })
          )}

          <SectionLabel>{t("mobile.openPool")}</SectionLabel>
          {jobs.length === 0 ? (
            <EmptyState
              icon="albums-outline"
              title={t("mobile.poolEmpty")}
              subtitle={t("mobile.poolEmptyHelp")}
            />
          ) : (
            jobs.map((j) => (
              <Card key={j.id} padded>
                <RouteRail
                  from={(j.pickup_address as string) || "Pickup"}
                  to={(j.dropoff_address as string) || "Drop-off"}
                />
                <Divider />
                <View style={styles.offerMeta}>
                  <View>
                    <Text variant="caption" color={colors.textMuted}>
                      {t("mobile.pickup")}
                    </Text>
                    <Text variant="subtitle">
                      {new Date(j.pickup_at as string).toLocaleString()}
                    </Text>
                  </View>
                  <Text style={styles.price}>{euros(j.price_cents as number)}</Text>
                </View>
                <Button
                  title={t("mobile.claimJob")}
                  variant="primary"
                  icon="hand-left-outline"
                  onPress={() => void onClaim(j.id as string)}
                  loading={busyId === j.id}
                  fullWidth
                  style={{ marginTop: space.md }}
                />
              </Card>
            ))
          )}
        </>
      )}

      <Button
        title={t("common.signOut")}
        variant="ghost"
        icon="log-out-outline"
        onPress={() => void signOut()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: space.md },
  vehicleChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primarySoft,
    paddingVertical: 6,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
  },
  heroOnline: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  heroTop: { flexDirection: "row", alignItems: "center", gap: space.md },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  statsRow: { flexDirection: "row", alignItems: "center" },
  statDivider: { width: 1, height: 36, backgroundColor: colors.border },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    backgroundColor: colors.dangerSoft,
    padding: space.md,
    borderRadius: radius.md,
  },
  offerHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  offerTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.accentSoft,
    paddingVertical: 4,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
  },
  timer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.surfaceMuted,
    paddingVertical: 4,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
  },
  timerHot: { backgroundColor: colors.dangerSoft },
  offerMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: space.md,
  },
  price: { fontFamily: fonts.display, fontSize: 24, color: colors.text, letterSpacing: -0.5 },
  offerActions: { flexDirection: "row", gap: space.md, marginTop: space.lg },
  gate: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: space.md,
    paddingHorizontal: space.xl,
  },
  gateIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.xs,
  },
});
