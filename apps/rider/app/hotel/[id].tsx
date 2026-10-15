import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import {
  Button,
  Heading,
  Icon,
  Text,
  colors,
  fonts,
  radius,
  shadow,
  space,
} from "@transferaround/mobile-shared/ui";
import { liteapiMobile } from "../../lib/liteapi";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type RoomOffer = {
  offerId: string;
  name: string;
  board?: string;
  price?: number;
};

type HotelDetails = {
  name?: string;
  address?: string;
  city?: string;
  country?: string;
  main_photo?: string;
  hotelImages?: Array<{ url?: string; caption?: string }>;
  starRating?: number;
  stars?: number;
  rating?: number;
  reviewCount?: number;
  hotelDescription?: string;
  description?: string;
  hotelFacilities?: Array<{ name?: string } | string>;
  facilities?: Array<{ name?: string } | string>;
};

function nightsBetween(checkin?: string, checkout?: string): number {
  if (!checkin || !checkout) return 1;
  const a = new Date(checkin).getTime();
  const b = new Date(checkout).getTime();
  const n = Math.round((b - a) / (1000 * 60 * 60 * 24));
  return Math.max(1, n);
}

function Stars({ count }: { count: number }) {
  const n = Math.max(0, Math.min(5, Math.round(count)));
  if (!n) return null;
  return (
    <View style={styles.stars}>
      {Array.from({ length: n }).map((_, i) => (
        <Icon key={i} name="star" size={14} color="#F59E0B" />
      ))}
    </View>
  );
}

function facilityName(f: { name?: string } | string): string {
  return typeof f === "string" ? f : String(f.name ?? "");
}

const WINDOW_W = Dimensions.get("window").width;

export default function HotelDetailScreen() {
  const params = useLocalSearchParams<{
    id: string;
    offerId?: string;
    name?: string;
    checkin?: string;
    checkout?: string;
    adults?: string;
    photo?: string;
    price?: string;
    stars?: string;
    rating?: string;
    address?: string;
    board?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const hotelId = params.id;
  const nights = nightsBetween(params.checkin, params.checkout);

  const [details, setDetails] = useState<HotelDetails | null>(null);
  const [rooms, setRooms] = useState<RoomOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState(params.offerId || "");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function load() {
      try {
        const [detailsRes, ratesRes] = await Promise.all([
          liteapiMobile.hotelDetails(hotelId),
          params.checkin && params.checkout
            ? liteapiMobile.hotelRates({
                hotelIds: [hotelId],
                checkin: params.checkin,
                checkout: params.checkout,
                adults: Number(params.adults) || 2,
                currency: "EUR",
                guestNationality: "GR",
                maxRatesPerHotel: 12,
                roomMapping: true,
                includeHotelData: false,
              })
            : Promise.resolve(null),
        ]);

        if (cancelled) return;

        const raw = detailsRes as { data?: HotelDetails } & HotelDetails;
        const d = (raw.data ?? raw) as HotelDetails;
        setDetails(d && typeof d === "object" ? d : null);

        if (ratesRes) {
          const rows =
            (
              ratesRes.data as Array<{ roomTypes?: Array<Record<string, unknown>> }> | undefined
            )?.[0]?.roomTypes ?? [];
          const out: RoomOffer[] = [];
          for (const rt of rows) {
            const offerId = String(rt.offerId ?? "");
            const rate = (rt.rates as Array<Record<string, unknown>> | undefined)?.[0];
            if (!offerId || !rate) continue;
            const total = (rate.retailRate as { total?: Array<{ amount: number }> } | undefined)
              ?.total?.[0]?.amount;
            out.push({
              offerId,
              name: String(rate.name ?? "Room"),
              board: rate.boardName ? String(rate.boardName) : undefined,
              price: total,
            });
          }
          setRooms(out);
          setSelectedOffer((prev) => prev || out[0]?.offerId || "");
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load hotel");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [hotelId, params.checkin, params.checkout, params.adults]);

  const name = details?.name || params.name || hotelId;
  const address =
    details?.address ||
    [details?.city, details?.country].filter(Boolean).join(", ") ||
    params.address ||
    "";
  const stars =
    details?.starRating ?? details?.stars ?? (params.stars ? Number(params.stars) : undefined);
  const rating = details?.rating ?? (params.rating ? Number(params.rating) : undefined);
  const description = details?.hotelDescription || details?.description || "";

  const photos = useMemo(() => {
    const list: string[] = [];
    if (details?.main_photo) list.push(details.main_photo);
    for (const img of details?.hotelImages ?? []) {
      if (img.url && !list.includes(img.url)) list.push(img.url);
    }
    if (!list.length && params.photo) list.push(params.photo);
    return list.slice(0, 12);
  }, [details, params.photo]);

  const facilities = useMemo(() => {
    const raw = details?.hotelFacilities ?? details?.facilities ?? [];
    return raw.map(facilityName).filter(Boolean).slice(0, 16);
  }, [details]);

  const selectedRoom = rooms.find((r) => r.offerId === selectedOffer) ?? rooms[0];
  const displayPrice =
    selectedRoom?.price ?? (params.price ? Number(params.price) : undefined) ?? undefined;

  async function prebookAndPay() {
    const offerId = selectedOffer || params.offerId;
    if (!offerId) {
      setError("Select a room first");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const pre = await liteapiMobile.hotelPrebook(offerId);
      const data = (pre.data as Record<string, unknown> | undefined) ?? pre;
      const prebookId = String(data.prebookId ?? "");
      const transactionId = String(data.transactionId ?? "");
      if (!prebookId) throw new Error("Missing prebookId");

      const url =
        `https://transferaround.com/hotels/checkout?prebookId=${encodeURIComponent(prebookId)}` +
        `&transactionId=${encodeURIComponent(transactionId)}`;
      setInfo("Opening secure checkout…");
      await Linking.openURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Prebook failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 120 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          {photos.length ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const i = Math.round(e.nativeEvent.contentOffset.x / WINDOW_W);
                setPhotoIndex(i);
              }}
            >
              {photos.map((uri) => (
                <Image key={uri} source={{ uri }} style={styles.heroImage} resizeMode="cover" />
              ))}
            </ScrollView>
          ) : (
            <View style={[styles.heroImage, styles.heroFallback]}>
              <Icon name="business-outline" size={48} color={colors.textFaint} />
            </View>
          )}
          <Pressable
            style={[styles.backBtn, { top: Math.max(insets.top, 12) + 8 }]}
            onPress={() => router.back()}
          >
            <Icon name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          {photos.length > 1 ? (
            <View style={styles.dots}>
              <Text variant="caption" color={colors.inverse}>
                {photoIndex + 1}/{photos.length}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.panel}>
          <View style={styles.titleBlock}>
            <View style={{ flex: 1, gap: 4 }}>
              <Heading variant="h1">{name}</Heading>
              <Stars count={stars ?? 0} />
              {address ? (
                <View style={styles.locRow}>
                  <Icon name="location-outline" size={16} color={colors.textMuted} />
                  <Text variant="caption" color={colors.textMuted} style={{ flex: 1 }}>
                    {address}
                  </Text>
                </View>
              ) : null}
              {params.checkin && params.checkout ? (
                <Text variant="caption" color={colors.textMuted}>
                  {params.checkin} → {params.checkout} · {nights} night
                  {nights === 1 ? "" : "s"} · {params.adults || 2} adults
                </Text>
              ) : null}
            </View>
            {rating != null ? (
              <View style={styles.score}>
                <Text variant="subtitle" color={colors.inverse} style={{ fontSize: 18 }}>
                  {Number(rating).toFixed(1)}
                </Text>
                <Text variant="caption" color={colors.inverse} style={{ opacity: 0.85 }}>
                  Score
                </Text>
              </View>
            ) : null}
          </View>

          {loading ? (
            <ActivityIndicator color={colors.accent} style={{ marginVertical: space.xl }} />
          ) : null}

          {description ? (
            <View style={styles.section}>
              <Text variant="subtitle">About this property</Text>
              <Text variant="body" color={colors.textMuted}>
                {description
                  .replace(/<[^>]+>/g, " ")
                  .replace(/\s+/g, " ")
                  .trim()
                  .slice(0, 600)}
                {description.length > 600 ? "…" : ""}
              </Text>
            </View>
          ) : null}

          {facilities.length ? (
            <View style={styles.section}>
              <Text variant="subtitle">Amenities</Text>
              <View style={styles.facilityGrid}>
                {facilities.map((f) => (
                  <View key={f} style={styles.facilityChip}>
                    <Icon name="checkmark-circle-outline" size={14} color={colors.accentDeep} />
                    <Text
                      variant="caption"
                      color={colors.text}
                      numberOfLines={1}
                      style={{ flex: 1 }}
                    >
                      {f}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text variant="subtitle">Choose your room</Text>
            {rooms.length === 0 && !loading ? (
              <Text variant="caption" color={colors.textMuted}>
                {params.offerId
                  ? "Using the offer from search results below."
                  : "No room rates for these dates."}
              </Text>
            ) : null}
            {rooms.map((r) => {
              const on = r.offerId === selectedOffer;
              return (
                <Pressable
                  key={r.offerId}
                  onPress={() => setSelectedOffer(r.offerId)}
                  style={[styles.roomCard, on ? styles.roomOn : null]}
                >
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text variant="subtitle">{r.name}</Text>
                    {r.board ? (
                      <Text variant="caption" color={colors.textMuted}>
                        {r.board}
                      </Text>
                    ) : null}
                  </View>
                  <Text style={styles.roomPrice}>
                    {r.price != null ? `€${Math.round(r.price)}` : "—"}
                  </Text>
                </Pressable>
              );
            })}
            {!rooms.length && params.offerId ? (
              <View style={[styles.roomCard, styles.roomOn]}>
                <View style={{ flex: 1 }}>
                  <Text variant="subtitle">Selected offer</Text>
                  {params.board ? (
                    <Text variant="caption" color={colors.textMuted}>
                      {params.board}
                    </Text>
                  ) : null}
                </View>
                <Text style={styles.roomPrice}>
                  {displayPrice != null ? `€${Math.round(displayPrice)}` : "—"}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.section}>
            <Text variant="subtitle">Guest details</Text>
            <TextInput
              style={styles.input}
              placeholder="First name"
              placeholderTextColor={colors.textFaint}
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.input}
              placeholder="Last name"
              placeholderTextColor={colors.textFaint}
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.textFaint}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {error ? (
            <Text variant="caption" color={colors.danger}>
              {error}
            </Text>
          ) : null}
          {info ? (
            <Text variant="caption" color={colors.accentDeep}>
              {info}
            </Text>
          ) : null}

          <Pressable onPress={() => router.push("/(tabs)")} style={styles.transferLink}>
            <Icon name="car-outline" size={16} color={colors.accentDeep} />
            <Text variant="subtitle" color={colors.accentDeep}>
              Book airport transfer instead
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={[styles.ctaBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View>
          <Text variant="caption" color={colors.textMuted}>
            Total · {nights} night{nights === 1 ? "" : "s"}
          </Text>
          <Text style={styles.ctaPrice}>
            {displayPrice != null ? `€${Math.round(displayPrice)}` : "—"}
          </Text>
        </View>
        <View style={{ flex: 1, maxWidth: 220 }}>
          <Button
            title="Reserve & pay"
            onPress={() => void prebookAndPay()}
            loading={busy}
            fullWidth
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: {},
  hero: {
    height: 280,
    backgroundColor: colors.surfaceMuted,
  },
  heroImage: {
    width: WINDOW_W,
    height: 280,
  },
  heroFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  backBtn: {
    position: "absolute",
    left: space.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.card,
  },
  dots: {
    position: "absolute",
    bottom: space.md,
    right: space.lg,
    backgroundColor: "rgba(16,17,20,0.75)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  panel: {
    marginTop: -20,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    backgroundColor: colors.bg,
    paddingHorizontal: space.lg,
    paddingTop: space.xl,
    gap: space.lg,
  },
  titleBlock: { flexDirection: "row", gap: space.md, alignItems: "flex-start" },
  stars: { flexDirection: "row", gap: 2 },
  locRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  score: {
    minWidth: 52,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  section: { gap: space.sm },
  facilityGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  facilityChip: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roomCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  roomOn: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  roomPrice: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.text,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: 12,
    color: colors.text,
    backgroundColor: colors.surface,
    fontFamily: fonts.body,
  },
  transferLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: space.md,
  },
  ctaBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadow.sheet,
  },
  ctaPrice: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.text,
  },
});
