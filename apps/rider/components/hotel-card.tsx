import { Image, Pressable, StyleSheet, View } from "react-native";
import { Icon, Text, colors, fonts, radius, shadow, space } from "@transferaround/mobile-shared/ui";

export type HotelCardData = {
  hotelId: string;
  name: string;
  photo?: string;
  address?: string;
  city?: string;
  stars?: number;
  rating?: number;
  price?: number;
  offerId?: string;
  freeCancellation?: boolean;
  board?: string;
};

function Stars({ count }: { count: number }) {
  const n = Math.max(0, Math.min(5, Math.round(count)));
  return (
    <View style={styles.stars}>
      {Array.from({ length: n }).map((_, i) => (
        <Icon key={i} name="star" size={12} color="#F59E0B" />
      ))}
    </View>
  );
}

export function HotelCard({
  hotel,
  nights = 1,
  onPress,
}: {
  hotel: HotelCardData;
  nights?: number;
  onPress: () => void;
}) {
  const location = [hotel.address, hotel.city].filter(Boolean).join(", ");
  const perNight = hotel.price != null && nights > 0 ? Math.round(hotel.price / nights) : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed ? { opacity: 0.94 } : null]}
    >
      <View style={styles.imageWrap}>
        {hotel.photo ? (
          <Image source={{ uri: hotel.photo }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imageFallback}>
            <Icon name="business-outline" size={36} color={colors.textFaint} />
          </View>
        )}
        {hotel.rating != null ? (
          <View style={styles.scoreBadge}>
            <Text variant="subtitle" color={colors.inverse} style={{ fontSize: 14 }}>
              {hotel.rating.toFixed(1)}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text variant="title" style={styles.name} numberOfLines={2}>
            {hotel.name}
          </Text>
          {hotel.stars != null && hotel.stars > 0 ? <Stars count={hotel.stars} /> : null}
        </View>

        {location ? (
          <View style={styles.locRow}>
            <Icon name="location-outline" size={14} color={colors.textMuted} />
            <Text variant="caption" color={colors.textMuted} numberOfLines={1} style={{ flex: 1 }}>
              {location}
            </Text>
          </View>
        ) : null}

        <View style={styles.chips}>
          {hotel.freeCancellation ? (
            <View style={[styles.chip, styles.chipOk]}>
              <Icon name="checkmark-circle" size={12} color={colors.success} />
              <Text variant="caption" color={colors.success}>
                Free cancellation
              </Text>
            </View>
          ) : null}
          {hotel.board ? (
            <View style={styles.chip}>
              <Text variant="caption" color={colors.textMuted}>
                {hotel.board}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.priceRow}>
          <View>
            {perNight != null ? (
              <Text variant="caption" color={colors.textMuted}>
                from €{perNight}/night
              </Text>
            ) : null}
            <Text style={styles.price}>
              {hotel.price != null ? `€${Math.round(hotel.price)}` : "—"}
            </Text>
            <Text variant="caption" color={colors.textFaint}>
              total · {nights} night{nights === 1 ? "" : "s"}
            </Text>
          </View>
          <View style={styles.seeBtn}>
            <Text variant="label" color={colors.inverse}>
              See availability
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    ...shadow.card,
  },
  imageWrap: {
    height: 168,
    backgroundColor: colors.surfaceMuted,
  },
  image: { width: "100%", height: "100%" },
  imageFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreBadge: {
    position: "absolute",
    top: space.md,
    right: space.md,
    minWidth: 40,
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
  },
  body: { padding: space.lg, gap: space.sm },
  titleRow: { gap: 4 },
  name: { color: colors.text },
  stars: { flexDirection: "row", gap: 2, marginTop: 2 },
  locRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 2 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  chipOk: { backgroundColor: colors.successSoft },
  priceRow: {
    marginTop: space.sm,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: space.md,
  },
  price: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 30,
    color: colors.text,
    letterSpacing: -0.4,
  },
  seeBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: space.md,
    paddingVertical: 10,
    borderRadius: radius.md,
  },
});
