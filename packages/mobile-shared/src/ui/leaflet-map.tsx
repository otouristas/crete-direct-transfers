import { useMemo } from "react";
import { View, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { WebView } from "react-native-webview";
import { colors, radius } from "./tokens";
import { CRETE_CENTER, resolveCoords, type LatLng } from "./coords";

export type MapPoint = LatLng & { type?: "pickup" | "dropoff"; label?: string };

function buildHtml(points: MapPoint[], interactive: boolean): string {
  const center = points[0] ?? CRETE_CENTER;
  const data = JSON.stringify(points);
  const opts = interactive
    ? "zoomControl:false"
    : "zoomControl:false, dragging:false, scrollWheelZoom:false, doubleClickZoom:false, boxZoom:false, keyboard:false, tap:false, touchZoom:false";
  return `<!doctype html><html><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<style>
  html,body,#map{height:100%;margin:0;background:${colors.surfaceMuted};}
  .pin{width:22px;height:22px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
       border:2px solid #fff;box-shadow:0 2px 6px rgba(11,37,69,.35);}
  .pin.pickup{background:${colors.accent};}
  .pin.dropoff{background:${colors.primary};}
  .leaflet-container{font-family:-apple-system,system-ui,sans-serif;background:${colors.surfaceMuted};}
</style>
</head><body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  var pts = ${data};
  var map = L.map('map', {${opts}, attributionControl:false}).setView([${center.lat}, ${center.lng}], 11);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19, subdomains: 'abcd'
  }).addTo(map);
  function makeIcon(type){
    return L.divIcon({ className:'', html:'<div class="pin '+type+'"></div>', iconSize:[22,22], iconAnchor:[11,22] });
  }
  var latlngs = [];
  pts.forEach(function(p){
    var type = p.type || 'dropoff';
    L.marker([p.lat, p.lng], { icon: makeIcon(type) }).addTo(map);
    latlngs.push([p.lat, p.lng]);
  });
  if (latlngs.length > 1) {
    L.polyline(latlngs, { color:'${colors.primary}', weight:4, opacity:0.85, dashArray:'2,9', lineCap:'round' }).addTo(map);
    map.fitBounds(latlngs, { padding:[48,48] });
  } else if (latlngs.length === 1) {
    map.setView(latlngs[0], 13);
  }
</script>
</body></html>`;
}

/** Interactive OpenStreetMap (Leaflet + Carto light tiles) in a WebView. */
export function LeafletMap({
  points,
  height = 220,
  interactive = true,
  rounded = false,
  style,
}: {
  points: MapPoint[];
  height?: number;
  interactive?: boolean;
  rounded?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const html = useMemo(() => buildHtml(points, interactive), [points, interactive]);
  return (
    <View
      style={[styles.wrap, { height }, rounded ? styles.rounded : null, style]}
      pointerEvents={interactive ? "auto" : "none"}
    >
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        style={styles.web}
        scrollEnabled={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        androidLayerType="hardware"
      />
    </View>
  );
}

/** Convenience: resolve a from/to address pair into a route map. */
export function RouteMap({
  from,
  to,
  height,
  interactive,
  rounded,
  style,
}: {
  from?: string | null;
  to?: string | null;
  height?: number;
  interactive?: boolean;
  rounded?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const points = useMemo<MapPoint[]>(() => {
    const out: MapPoint[] = [];
    const a = resolveCoords(from);
    const b = resolveCoords(to);
    if (a) out.push({ ...a, type: "pickup", label: from ?? undefined });
    if (b) out.push({ ...b, type: "dropoff", label: to ?? undefined });
    return out;
  }, [from, to]);
  return (
    <LeafletMap points={points} height={height} interactive={interactive} rounded={rounded} style={style} />
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: "hidden", backgroundColor: colors.surfaceMuted },
  rounded: { borderRadius: radius.lg },
  web: { flex: 1, backgroundColor: colors.surfaceMuted },
});
