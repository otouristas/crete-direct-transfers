import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import {
  Button,
  EmptyState,
  Heading,
  Screen,
  Text,
  colors,
  fonts,
  radius,
  shadow,
  space,
} from "@transferaround/mobile-shared/ui";
import { liteapiMobile } from "../../lib/liteapi";

type HotelHit = {
  hotelId: string;
  name: string;
  price?: number;
  currency?: string;
  offerId?: string;
  photo?: string;
  address?: string;
  stars?: number;
};

const DEST_CHIPS = ["Chania", "Rethymno", "Heraklion", "Elounda", "Bali"] as const;

function defaultDate(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function nightsBetween(checkin: string, checkout: string) {
  const a = new Date(`${checkin}T12:00:00`);
  const b = new Date(`${checkout}T12:00:00`);
  const n = Math.round((b.getTime() - a.getTime()) / 86_400_000);
  return Math.max(1, n);
}

function HotelCard({
  hotel,
  nights,
  onPress,
}: {
  hotel: HotelHit;
  nights: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed ? { transform: [{ scale: 0.985 }], opacity: 0.96 } : null,
      ]}
    >
      <View style={styles.photoWrap}>
        {hotel.photo ? (
          <Image source={{ uri: hotel.photo }} style={styles.photo} resizeMode="cover" />
        ) : (
          <View style={[styles.photo, styles.photoFallback]}>
            <Text variant="title" color={colors.inverse} style={{ opacity: 0.7 }}>
              {hotel.name.slice(0, 1)}
            </Text>
          </View>
        )}
        <View style={styles.photoScrim} />
        {hotel.price != null ? (
          <View style={styles.pricePill}>
            <Text style={styles.priceAmount}>€{Math.round(hotel.price)}</Text>
            <Text style={styles.priceUnit}>/ {nights}n</Text>
          </View>
        ) : null}
        {hotel.stars != null && hotel.stars > 0 ? (
          <View style={styles.starChip}>
            <Text style={styles.starText}>{"★".repeat(Math.min(5, Math.round(hotel.stars)))}</Text>
          </View>
        ) : null}
        <View style={styles.photoMeta}>
          <Text style={styles.hotelName} numberOfLines={2}>
            {hotel.name}
          </Text>
          {hotel.address ? (
            <Text style={styles.hotelAddr} numberOfLines={1}>
              {hotel.address}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

export default function HotelsScreen() {
  const router = useRouter();
  const [placeQuery, setPlaceQuery] = useState("Chania");
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [vibe, setVibe] = useState("");
  const [checkin, setCheckin] = useState(defaultDate(7));
  const [checkout, setCheckout] = useState(defaultDate(10));
  const [busy, setBusy] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hotels, setHotels] = useState<HotelHit[]>([]);
  const [searched, setSearched] = useState(false);

  const resolvePlace = useCallback(async (query: string) => {
    setResolving(true);
    setError(null);
    try {
      const res = await liteapiMobile.places(query, "locality");
      const data = (res.data as Array<{ placeId: string; displayName: string }> | undefined) ?? [];
      if (!data[0]) {
        setError("No destination found");
        setPlaceId(null);
        return null;
      }
      setPlaceId(data[0].placeId);
      setPlaceQuery(data[0].displayName);
      return data[0].placeId;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Places failed");
      return null;
    } finally {
      setResolving(false);
    }
  }, []);

  const searchHotels = useCallback(
    async (overridePlaceId?: string | null) => {
      setBusy(true);
      setError(null);
      setHotels([]);
      setSearched(true);
      try {
        let pid = overridePlaceId ?? placeId;
        if (!pid && !vibe.trim()) {
          pid = await resolvePlace(placeQuery);
        }
        const res = await liteapiMobile.hotelRates({
          checkin,
          checkout,
          adults: 2,
          placeId: pid || undefined,
          aiSearch: vibe.trim() || undefined,
          currency: "EUR",
          guestNationality: "GR",
          maxRatesPerHotel: 1,
        });
        const rates =
          (res.data as
            | Array<{
                hotelId: string;
                roomTypes?: Array<{
                  offerId?: string;
                  rates?: Array<{
                    retailRate?: { total?: Array<{ amount: number; currency?: string }> };
                  }>;
                }>;
              }>
            | undefined) ?? [];
        const meta =
          (res.hotels as
            | Array<{
                id: string;
                name: string;
                main_photo?: string;
                address?: string;
                starRating?: number;
                rating?: number;
              }>
            | undefined) ?? [];
        const byId = new Map(rates.map((h) => [h.hotelId, h]));
        const mapped: HotelHit[] = (
          meta.length
            ? meta
            : rates.map((r) => ({
                id: r.hotelId,
                name: r.hotelId,
                main_photo: undefined as string | undefined,
                address: undefined as string | undefined,
                starRating: undefined as number | undefined,
              }))
        ).map((h) => {
          const r = byId.get(h.id);
          const rt = r?.roomTypes?.[0];
          const total = rt?.rates?.[0]?.retailRate?.total?.[0];
          return {
            hotelId: h.id,
            name: h.name,
            photo: typeof h.main_photo === "string" ? h.main_photo : undefined,
            address: typeof h.address === "string" ? h.address : undefined,
            stars: Number(h.starRating ?? 0) || undefined,
            offerId: rt?.offerId,
            price: total?.amount,
            currency: total?.currency ?? "EUR",
          };
        });
        setHotels(mapped.filter((h) => h.name));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Hotel search failed");
      } finally {
        setBusy(false);
      }
    },
    [checkin, checkout, placeId, placeQuery, resolvePlace, vibe],
  );

  useEffect(() => {
    void (async () => {
      const pid = await resolvePlace("Chania");
      if (pid) await searchHotels(pid);
    })();
    // Initial Crete showcase only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nights = nightsBetween(checkin, checkout);

  return (
    <Screen scroll padded={false}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Partner stays</Text>
        <Heading variant="h1" style={{ color: colors.inverse }}>
          Hotels
        </Heading>
        <Text variant="body" color="rgba(248,250,252,0.78)" style={{ marginTop: space.sm }}>
          Find guest stays near pickups — then offer the transfer.
        </Text>

        <View style={styles.searchCard}>
          <TextInput
            style={styles.searchInput}
            value={placeQuery}
            onChangeText={setPlaceQuery}
            placeholder="Where are they staying?"
            placeholderTextColor={colors.textFaint}
            returnKeyType="search"
            onSubmitEditing={() => void searchHotels()}
          />
          <TextInput
            style={[styles.searchInput, styles.vibeInput]}
            value={vibe}
            onChangeText={setVibe}
            placeholder="Vibe · beach boutique, sea view…"
            placeholderTextColor={colors.textFaint}
          />
          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <Text variant="caption" color={colors.textFaint}>
                Check-in
              </Text>
              <TextInput
                style={styles.dateInput}
                value={checkin}
                onChangeText={setCheckin}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.dateField}>
              <Text variant="caption" color={colors.textFaint}>
                Check-out
              </Text>
              <TextInput
                style={styles.dateInput}
                value={checkout}
                onChangeText={setCheckout}
                autoCapitalize="none"
              />
            </View>
          </View>
          <Button
            title={busy || resolving ? "Searching…" : "Search hotels"}
            onPress={() => void searchHotels()}
            loading={busy || resolving}
            fullWidth
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {DEST_CHIPS.map((chip) => {
          const on = placeQuery.toLowerCase().includes(chip.toLowerCase());
          return (
            <Pressable
              key={chip}
              onPress={() => {
                setPlaceQuery(chip);
                setVibe("");
                void (async () => {
                  const pid = await resolvePlace(chip);
                  if (pid) await searchHotels(pid);
                })();
              }}
              style={[styles.chip, on ? styles.chipOn : null]}
            >
              <Text variant="label" color={on ? colors.inverse : colors.textMuted}>
                {chip}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.list}>
        {error ? (
          <Text variant="caption" color={colors.danger} style={{ marginBottom: space.md }}>
            {error}
          </Text>
        ) : null}

        {busy && hotels.length === 0 ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.accent} size="large" />
            <Text variant="body" color={colors.textMuted} style={{ marginTop: space.md }}>
              Loading stays…
            </Text>
          </View>
        ) : null}

        {!busy && searched && hotels.length === 0 && !error ? (
          <EmptyState
            icon="home-outline"
            title="No hotels found"
            subtitle="Try another city or a vibe search like “sea view boutique”."
          />
        ) : null}

        {hotels.map((h) => (
          <HotelCard
            key={h.hotelId}
            hotel={h}
            nights={nights}
            onPress={() =>
              router.push({
                pathname: "/hotel/[id]",
                params: {
                  id: h.hotelId,
                  offerId: h.offerId ?? "",
                  checkin,
                  checkout,
                  name: h.name,
                  photo: h.photo ?? "",
                  price: h.price != null ? String(h.price) : "",
                  address: h.address ?? "",
                },
              })
            }
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: space.xl,
    paddingTop: space.lg,
    paddingBottom: space.xxxl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  eyebrow: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.accent,
    marginBottom: space.sm,
  },
  searchCard: {
    marginTop: space.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space.lg,
    gap: space.md,
    ...shadow.raised,
  },
  searchInput: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: 12,
    color: colors.text,
    backgroundColor: colors.surfaceMuted,
    fontFamily: fonts.body,
    fontSize: 15,
  },
  vibeInput: { backgroundColor: colors.surface },
  dateRow: { flexDirection: "row", gap: space.sm },
  dateField: {
    flex: 1,
    gap: 4,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateInput: {
    color: colors.text,
    fontFamily: fonts.bodySemibold,
    fontSize: 14,
    padding: 0,
  },
  chips: {
    paddingHorizontal: space.xl,
    paddingVertical: space.lg,
    gap: space.sm,
  },
  chip: {
    paddingHorizontal: space.lg,
    paddingVertical: space.sm + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  list: {
    paddingHorizontal: space.xl,
    paddingBottom: space.xxxl,
    gap: space.lg,
  },
  loading: {
    alignItems: "center",
    paddingVertical: space.xxxl,
  },
  card: {
    borderRadius: radius.xl,
    overflow: "hidden",
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  photoWrap: {
    height: 220,
    position: "relative",
  },
  photo: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  photoFallback: {
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  photoScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(11, 37, 69, 0.28)",
  },
  photoMeta: {
    position: "absolute",
    left: space.lg,
    right: space.lg,
    bottom: space.lg,
    gap: 4,
  },
  hotelName: {
    fontFamily: fonts.bold,
    fontSize: 20,
    lineHeight: 24,
    color: colors.inverse,
    letterSpacing: -0.3,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  hotelAddr: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: "rgba(248,250,252,0.85)",
  },
  pricePill: {
    position: "absolute",
    top: space.md,
    right: space.md,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    ...shadow.card,
  },
  priceAmount: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.primary,
  },
  priceUnit: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textMuted,
  },
  starChip: {
    position: "absolute",
    top: space.md,
    left: space.md,
    backgroundColor: "rgba(11, 37, 69, 0.72)",
    borderRadius: radius.pill,
    paddingHorizontal: space.sm + 2,
    paddingVertical: 4,
  },
  starText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.highlight,
    letterSpacing: 1,
  },
});
