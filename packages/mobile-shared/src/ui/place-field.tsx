import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Text } from "./text";
import { Icon } from "./icon";
import { colors, radius, space } from "./tokens";

export type MobilePlaceKind = "airport" | "port" | "destination" | "route-end" | "address";

export type MobilePlace = {
  id: string;
  label: string;
  kind: MobilePlaceKind;
  lat?: number;
  lng?: number;
  routeEndKey?: string;
  iata?: string;
  countryCode?: string;
  countryName?: string;
};

export type PlaceGroup = {
  key: string;
  label: string;
  places: MobilePlace[];
};

type SearchFn = (
  query: string,
  contextPlace?: MobilePlace | null,
) => Promise<{ places: MobilePlace[]; groups?: PlaceGroup[] }>;

/**
 * Homepage-style place field: typed search (IATA / hubs / addresses) with
 * Pin on map + GPS actions and a suggestion dropdown.
 */
export function PlaceField({
  label,
  placeholder,
  value,
  selected,
  contextPlace,
  onQueryChange,
  onSelect,
  onPinOnMap,
  onUseGps,
  search,
  pinLabel = "Pin on map",
  gpsLabel = "GPS",
  gpsBusy = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  selected?: MobilePlace | null;
  contextPlace?: MobilePlace | null;
  onQueryChange: (q: string) => void;
  onSelect: (place: MobilePlace) => void;
  onPinOnMap: () => void;
  onUseGps: () => void;
  search: SearchFn;
  pinLabel?: string;
  gpsLabel?: string;
  gpsBusy?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState<MobilePlace[]>([]);
  const [groups, setGroups] = useState<PlaceGroup[]>([]);
  const seq = useRef(0);

  const runSearch = useCallback(
    async (q: string) => {
      const id = ++seq.current;
      setLoading(true);
      try {
        const res = await search(q, contextPlace);
        if (id !== seq.current) return;
        setPlaces(res.places);
        setGroups(res.groups ?? []);
      } catch {
        if (id !== seq.current) return;
        setPlaces([]);
        setGroups([]);
      } finally {
        if (id === seq.current) setLoading(false);
      }
    },
    [search, contextPlace],
  );

  useEffect(() => {
    if (!open) return;
    const q = value.trim();
    const delay = q.length >= 3 ? 280 : 0;
    const t = setTimeout(() => void runSearch(q), delay);
    return () => clearTimeout(t);
  }, [value, open, runSearch]);

  const showGroups = open && !value.trim() && groups.length > 0;
  const showList = open && (places.length > 0 || loading || showGroups);

  return (
    <View style={styles.wrap}>
      <Text variant="label" color={colors.textMuted}>
        {label}
      </Text>
      <View style={[styles.field, open ? styles.fieldOpen : null]}>
        <Icon
          name={selected?.kind === "airport" ? "airplane" : "location-outline"}
          size={18}
          color={colors.textFaint}
        />
        <TextInput
          value={value}
          onChangeText={(t) => {
            onQueryChange(t);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          placeholderTextColor={colors.textFaint}
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="words"
        />
        {value ? (
          <Pressable
            onPress={() => {
              onQueryChange("");
              setOpen(true);
            }}
            hitSlop={8}
          >
            <Icon name="close-circle" size={18} color={colors.textFaint} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={onPinOnMap}>
          <Icon name="map-outline" size={14} color={colors.accentDeep} />
          <Text variant="caption" color={colors.accentDeep} style={styles.actionText}>
            {pinLabel}
          </Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={onUseGps} disabled={gpsBusy}>
          {gpsBusy ? (
            <ActivityIndicator size="small" color={colors.accentDeep} />
          ) : (
            <Icon name="navigate" size={14} color={colors.accentDeep} />
          )}
          <Text variant="caption" color={colors.accentDeep} style={styles.actionText}>
            {gpsLabel}
          </Text>
        </Pressable>
      </View>

      {showList ? (
        <View style={styles.dropdown}>
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={colors.accent} />
            </View>
          ) : null}
          <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 220 }}>
            {showGroups
              ? groups.map((g) => (
                  <View key={g.key}>
                    <Text variant="caption" color={colors.textFaint} style={styles.groupLabel}>
                      {g.label}
                    </Text>
                    {g.places.map((p) => (
                      <SuggestionRow
                        key={p.id}
                        place={p}
                        onPress={() => {
                          onSelect(p);
                          setOpen(false);
                        }}
                      />
                    ))}
                  </View>
                ))
              : places.map((p) => (
                  <SuggestionRow
                    key={p.id}
                    place={p}
                    onPress={() => {
                      onSelect(p);
                      setOpen(false);
                    }}
                  />
                ))}
            {!loading && !showGroups && places.length === 0 ? (
              <Text variant="caption" color={colors.textMuted} style={styles.empty}>
                No places found
              </Text>
            ) : null}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

function SuggestionRow({ place, onPress }: { place: MobilePlace; onPress: () => void }) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Icon
        name={
          place.kind === "airport"
            ? "airplane"
            : place.kind === "port"
              ? "boat-outline"
              : "location"
        }
        size={16}
        color={colors.accentDeep}
      />
      <View style={{ flex: 1 }}>
        <Text variant="subtitle" numberOfLines={1}>
          {place.label}
        </Text>
        <Text variant="caption" color={colors.textMuted}>
          {place.iata ? `${place.iata} · ` : ""}
          {place.kind}
          {place.countryName ? ` · ${place.countryName}` : ""}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.sm, zIndex: 2 },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: space.md,
    minHeight: 48,
  },
  fieldOpen: { borderColor: colors.accent },
  input: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: 10 },
  actions: { flexDirection: "row", gap: space.sm },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  actionText: { fontWeight: "600" },
  dropdown: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  loadingRow: { padding: space.md, alignItems: "center" },
  groupLabel: {
    paddingHorizontal: space.md,
    paddingTop: space.md,
    paddingBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  empty: { padding: space.md },
});
