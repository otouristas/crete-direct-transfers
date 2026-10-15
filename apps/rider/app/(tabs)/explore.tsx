import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from "react-native";
import {
  Button,
  Heading,
  Screen,
  SectionLabel,
  Text,
  colors,
  fonts,
  radius,
  space,
} from "@transferaround/mobile-shared/ui";
import { HotelCard, type HotelCardData } from "../../components/hotel-card";
import { liteapiMobile } from "../../lib/liteapi";

function defaultDate(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function nightsBetween(checkin: string, checkout: string): number {
  const a = new Date(checkin).getTime();
  const b = new Date(checkout).getTime();
  const n = Math.round((b - a) / (1000 * 60 * 60 * 24));
  return Math.max(1, n);
}

function hasFreeCancel(rate: Record<string, unknown> | undefined): boolean {
  if (!rate) return false;
  const policies = rate.cancellationPolicies;
  if (policies == null) return false;
  const raw = JSON.stringify(policies).toLowerCase();
  return raw.includes("free") || raw.includes("refundable") || raw.includes("cancel");
}

export default function ExploreScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<"hotels" | "flights">("hotels");
  const [placeQuery, setPlaceQuery] = useState("Chania");
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [vibe, setVibe] = useState("");
  const [checkin, setCheckin] = useState(defaultDate(7));
  const [checkout, setCheckout] = useState(defaultDate(10));
  const [origin, setOrigin] = useState("HER");
  const [dest, setDest] = useState("ATH");
  const [flightDate, setFlightDate] = useState(defaultDate(14));
  const [adults, setAdults] = useState("2");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hotels, setHotels] = useState<HotelCardData[]>([]);
  const [flights, setFlights] = useState<Array<{ offerId: string; label: string; price?: number }>>(
    [],
  );

  const nights = useMemo(() => nightsBetween(checkin, checkout), [checkin, checkout]);

  async function searchPlaces() {
    setBusy(true);
    setError(null);
    try {
      const res = await liteapiMobile.places(placeQuery, "locality");
      const data = (res.data as Array<{ placeId: string; displayName: string }> | undefined) ?? [];
      if (data[0]) {
        setPlaceId(data[0].placeId);
        setPlaceQuery(data[0].displayName);
      } else {
        setError("No place found");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Places failed");
    } finally {
      setBusy(false);
    }
  }

  async function searchHotels() {
    setBusy(true);
    setError(null);
    setHotels([]);
    try {
      const res = await liteapiMobile.hotelRates({
        checkin,
        checkout,
        adults: Number(adults) || 2,
        placeId: placeId || undefined,
        aiSearch: vibe.trim() || undefined,
        currency: "EUR",
        guestNationality: "GR",
        includeHotelData: true,
        maxRatesPerHotel: 1,
      });

      const rates =
        (res.data as
          | Array<{
              hotelId: string;
              roomTypes?: Array<{
                offerId?: string;
                rates?: Array<Record<string, unknown>>;
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
              city?: string;
              rating?: number;
              starRating?: number;
              stars?: number;
            }>
          | undefined) ?? [];

      const byId = new Map(rates.map((h) => [h.hotelId, h]));

      const cards: HotelCardData[] = meta.length
        ? meta.map((h) => {
            const r = byId.get(h.id);
            const rt = r?.roomTypes?.[0];
            const rate = rt?.rates?.[0];
            const total = (rate?.retailRate as { total?: Array<{ amount: number }> } | undefined)
              ?.total?.[0]?.amount;
            return {
              hotelId: h.id,
              name: h.name,
              photo: h.main_photo,
              address: h.address,
              city: h.city,
              rating: h.rating,
              stars: h.starRating ?? h.stars,
              offerId: rt?.offerId,
              price: total,
              board: rate?.boardName ? String(rate.boardName) : undefined,
              freeCancellation: hasFreeCancel(rate),
            };
          })
        : rates.map((h) => {
            const rt = h.roomTypes?.[0];
            const rate = rt?.rates?.[0];
            const total = (rate?.retailRate as { total?: Array<{ amount: number }> } | undefined)
              ?.total?.[0]?.amount;
            return {
              hotelId: h.hotelId,
              name: h.hotelId,
              offerId: rt?.offerId,
              price: total,
              board: rate?.boardName ? String(rate.boardName) : undefined,
              freeCancellation: hasFreeCancel(rate),
            };
          });

      setHotels(cards);
      if (!cards.length) setError("No hotels found for these dates");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hotel search failed");
    } finally {
      setBusy(false);
    }
  }

  async function searchFlights() {
    setBusy(true);
    setError(null);
    setFlights([]);
    try {
      const res = await liteapiMobile.flightRates({
        legs: [{ origin: origin.toUpperCase(), destination: dest.toUpperCase(), date: flightDate }],
        adults: Number(adults) || 1,
        currency: "EUR",
        country: "GR",
      });
      const list =
        (res.data as Array<Record<string, unknown>> | undefined) ??
        (res.offers as Array<Record<string, unknown>> | undefined) ??
        [];
      setFlights(
        list.slice(0, 20).map((o, i) => {
          const pricing = o.pricing as { display?: { total?: number } } | undefined;
          return {
            offerId: String(o.offerId ?? o.id ?? `f-${i}`),
            label: String(o.summary ?? `${origin} → ${dest}`),
            price: pricing?.display?.total,
          };
        }),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Flight search failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen scroll>
      <Heading variant="h1">Explore</Heading>
      <Text variant="body" color={colors.textMuted}>
        Hotels & flights via Nuitee Connect
      </Text>

      <View style={styles.seg}>
        {(["hotels", "flights"] as const).map((m) => (
          <Pressable
            key={m}
            onPress={() => setMode(m)}
            style={[styles.segBtn, mode === m ? styles.segOn : null]}
          >
            <Text
              variant="subtitle"
              color={mode === m ? colors.primary : colors.textMuted}
              style={{ fontFamily: fonts.bodySemibold, textTransform: "capitalize" }}
            >
              {m}
            </Text>
          </Pressable>
        ))}
      </View>

      {mode === "hotels" ? (
        <View style={styles.form}>
          <SectionLabel>Destination</SectionLabel>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              value={placeQuery}
              onChangeText={setPlaceQuery}
              placeholder="City"
              placeholderTextColor={colors.textFaint}
            />
            <Button title="Find" onPress={() => void searchPlaces()} />
          </View>
          <TextInput
            style={styles.input}
            value={vibe}
            onChangeText={setVibe}
            placeholder="Or vibe search…"
            placeholderTextColor={colors.textFaint}
          />
          <View style={styles.row}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text variant="caption" color={colors.textMuted}>
                Check-in
              </Text>
              <TextInput style={styles.input} value={checkin} onChangeText={setCheckin} />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text variant="caption" color={colors.textMuted}>
                Check-out
              </Text>
              <TextInput style={styles.input} value={checkout} onChangeText={setCheckout} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text variant="caption" color={colors.textMuted}>
                Adults
              </Text>
              <TextInput
                style={styles.input}
                value={adults}
                onChangeText={setAdults}
                keyboardType="number-pad"
              />
            </View>
          </View>
          <Button
            title="Search hotels"
            onPress={() => void searchHotels()}
            loading={busy}
            fullWidth
          />
        </View>
      ) : (
        <View style={styles.form}>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              value={origin}
              onChangeText={setOrigin}
              autoCapitalize="characters"
              maxLength={3}
            />
            <TextInput
              style={styles.input}
              value={dest}
              onChangeText={setDest}
              autoCapitalize="characters"
              maxLength={3}
            />
          </View>
          <TextInput style={styles.input} value={flightDate} onChangeText={setFlightDate} />
          <Button
            title="Search flights"
            onPress={() => void searchFlights()}
            loading={busy}
            fullWidth
          />
        </View>
      )}

      {busy ? <ActivityIndicator color={colors.accent} style={{ marginTop: space.lg }} /> : null}
      {error ? (
        <Text variant="caption" color={colors.danger} style={{ marginTop: space.md }}>
          {error}
        </Text>
      ) : null}

      {mode === "hotels" && hotels.length > 0 ? (
        <Text variant="subtitle" style={{ marginTop: space.xl, marginBottom: space.sm }}>
          {hotels.length} properties · {nights} night{nights === 1 ? "" : "s"}
        </Text>
      ) : null}

      <View style={{ gap: space.lg, marginTop: mode === "hotels" && hotels.length ? 0 : space.xl }}>
        {mode === "hotels"
          ? hotels.map((h) => (
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
                      adults: adults || "2",
                      name: h.name,
                      photo: h.photo ?? "",
                      price: h.price != null ? String(h.price) : "",
                      stars: h.stars != null ? String(h.stars) : "",
                      rating: h.rating != null ? String(h.rating) : "",
                      address: h.address ?? h.city ?? "",
                      board: h.board ?? "",
                    },
                  })
                }
              />
            ))
          : flights.map((f) => (
              <View key={f.offerId} style={styles.flightCard}>
                <Text variant="subtitle">{f.label}</Text>
                <Text style={styles.flightPrice}>
                  {f.price != null ? `€${f.price.toFixed(0)}` : "—"}
                </Text>
              </View>
            ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  seg: { flexDirection: "row", gap: space.sm, marginTop: space.lg },
  segBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: space.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
  },
  segOn: { backgroundColor: colors.accentSoft },
  form: { gap: space.md, marginTop: space.lg },
  row: { flexDirection: "row", gap: space.sm, alignItems: "flex-end" },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: 12,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  flightCard: {
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: 4,
  },
  flightPrice: { fontFamily: fonts.display, fontSize: 22, color: colors.text },
});
