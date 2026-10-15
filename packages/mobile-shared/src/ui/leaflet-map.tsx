import { createElement, useEffect, useMemo, useRef } from "react";
import { Platform, View, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";
import { colors, radius } from "./tokens";
import { CRETE_CENTER, resolveCoords, type LatLng } from "./coords";
import { MapSurface } from "./map-surface";
import type { LiveMapPosition } from "./map-surface-types";

export type MapPoint = LatLng & { type?: "pickup" | "dropoff"; label?: string };

type MapMessage = { type: "mapPress"; lat: number; lng: number } | { type: "ready" };

/** Stable fingerprint of marker geometry (ignores labels / typing). */
function pointsKey(points: MapPoint[]): string {
  return points.map((p) => `${p.type ?? "x"}:${p.lat.toFixed(5)},${p.lng.toFixed(5)}`).join("|");
}

function buildHtml(points: MapPoint[], interactive: boolean, pickMode: boolean): string {
  const center = points[0] ?? CRETE_CENTER;
  const tiles =
    process.env.EXPO_PUBLIC_MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
  const data = JSON.stringify(
    points.map((p) => ({ lat: p.lat, lng: p.lng, type: p.type ?? "dropoff" })),
  );
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
       border:2px solid #fff;box-shadow:0 2px 6px rgba(16,17,20,.35);}
  .pin.pickup{background:${colors.accent};}
  .pin.dropoff{background:${colors.primary};}
  .leaflet-container{font-family:-apple-system,system-ui,sans-serif;background:${colors.surfaceMuted};}
  ${pickMode ? "body{cursor:crosshair;}" : ""}
</style>
</head><body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  function post(msg){
    var raw = JSON.stringify(msg);
    if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
      window.ReactNativeWebView.postMessage(raw);
    } else if (window.parent && window.parent !== window) {
      window.parent.postMessage(raw, '*');
    }
  }
  var pts = ${data};
  var pickMode = ${pickMode ? "true" : "false"};
  var map = L.map('map', {${opts}, attributionControl:true}).setView([${center.lat}, ${center.lng}], 11);
  L.tileLayer(${JSON.stringify(tiles)}, {
    maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
  }).addTo(map);
  function makeIcon(type){
    return L.divIcon({ className:'', html:'<div class="pin '+type+'"></div>', iconSize:[22,22], iconAnchor:[11,22] });
  }
  var layerGroup = L.layerGroup().addTo(map);
  function renderPts(list){
    layerGroup.clearLayers();
    var latlngs = [];
    list.forEach(function(p){
      var type = p.type || 'dropoff';
      L.marker([p.lat, p.lng], { icon: makeIcon(type) }).addTo(layerGroup);
      latlngs.push([p.lat, p.lng]);
    });
    if (latlngs.length > 1) {
      L.polyline(latlngs, { color:'${colors.primary}', weight:4, opacity:0.85, dashArray:'2,9', lineCap:'round' }).addTo(layerGroup);
      map.fitBounds(latlngs, { padding:[56,56] });
    } else if (latlngs.length === 1) {
      map.setView(latlngs[0], 13);
    }
  }
  renderPts(pts);
  if (pickMode) {
    map.on('click', function(e){
      post({ type:'mapPress', lat:e.latlng.lat, lng:e.latlng.lng });
    });
  }
  window.__taSetInteractive = function(on){
    if (on) {
      map.dragging.enable(); map.scrollWheelZoom.enable(); map.doubleClickZoom.enable();
      map.boxZoom.enable(); map.keyboard.enable();
      if (map.touchZoom) map.touchZoom.enable();
    } else {
      map.dragging.disable(); map.scrollWheelZoom.disable(); map.doubleClickZoom.disable();
      map.boxZoom.disable(); map.keyboard.disable();
      if (map.touchZoom) map.touchZoom.disable();
    }
  };
  window.__taUpdatePoints = function(raw){
    try { renderPts(JSON.parse(raw)); } catch (e) {}
  };
  setTimeout(function(){ map.invalidateSize(); post({ type:'ready' }); }, 80);
</script>
</body></html>`;
}

function parseMessage(raw: string): MapMessage | null {
  try {
    const data = JSON.parse(raw) as MapMessage;
    if (data?.type === "mapPress" && typeof data.lat === "number" && typeof data.lng === "number") {
      return data;
    }
    if (data?.type === "ready") return data;
  } catch {
    /* ignore */
  }
  return null;
}

/** Interactive OpenStreetMap (Leaflet + configurable OSM tiles). Web uses iframe; native uses WebView. */
export function LeafletMap({
  points,
  height = 220,
  interactive = true,
  pickMode = false,
  rounded = false,
  style,
  onMapPress,
}: {
  points: MapPoint[];
  height?: number;
  interactive?: boolean;
  /** When true, taps emit `onMapPress`. */
  pickMode?: boolean;
  rounded?: boolean;
  style?: StyleProp<ViewStyle>;
  onMapPress?: (point: LatLng) => void;
}) {
  const key = pointsKey(points);
  // Rebuild HTML only when marker geometry or pickMode changes — not on typing.
  const html = useMemo(
    () => buildHtml(points, true, pickMode),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: key + pickMode only
    [key, pickMode],
  );

  const webRef = useRef<WebView>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const onMapPressRef = useRef(onMapPress);
  onMapPressRef.current = onMapPress;
  const lastKey = useRef(key);

  // Live-update interactivity without remounting (native WebView only).
  useEffect(() => {
    if (Platform.OS === "web") return;
    const on = interactive || pickMode;
    webRef.current?.injectJavaScript(
      `window.__taSetInteractive && window.__taSetInteractive(${on ? "true" : "false"}); true;`,
    );
  }, [interactive, pickMode]);

  // If points change after mount without HTML rebuild, inject (native).
  useEffect(() => {
    if (Platform.OS === "web") return;
    if (lastKey.current === key) return;
    lastKey.current = key;
    const payload = JSON.stringify(
      points.map((p) => ({ lat: p.lat, lng: p.lng, type: p.type ?? "dropoff" })),
    );
    webRef.current?.injectJavaScript(
      `window.__taUpdatePoints && window.__taUpdatePoints(${JSON.stringify(payload)}); true;`,
    );
  }, [key, points]);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const handler = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      const raw = typeof event.data === "string" ? event.data : null;
      if (!raw) return;
      const msg = parseMessage(raw);
      if (msg?.type === "mapPress") onMapPressRef.current?.({ lat: msg.lat, lng: msg.lng });
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const onNativeMessage = (event: WebViewMessageEvent) => {
    const msg = parseMessage(event.nativeEvent.data);
    if (msg?.type === "mapPress") onMapPress?.({ lat: msg.lat, lng: msg.lng });
  };

  return (
    <View
      style={[
        styles.wrap,
        { height, pointerEvents: interactive || pickMode ? "auto" : "none" },
        rounded ? styles.rounded : null,
        style,
      ]}
    >
      {Platform.OS === "web" ? (
        createElement("iframe", {
          title: "Route map",
          ref: iframeRef,
          srcDoc: html,
          style: {
            border: "0",
            width: "100%",
            height: "100%",
            display: "block",
            background: colors.surfaceMuted,
          },
          sandbox: "allow-scripts allow-same-origin",
        })
      ) : (
        <WebView
          ref={webRef}
          originWhitelist={["*"]}
          source={{ html, baseUrl: "https://transferaround.com" }}
          userAgent="TransferAround/1.0 (+https://transferaround.com)"
          style={styles.web}
          scrollEnabled={false}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          androidLayerType="hardware"
          onMessage={onNativeMessage}
        />
      )}
    </View>
  );
}

/** Convenience: resolve a from/to address pair into a route map. */
export function RouteMap({
  from,
  to,
  fromPoint,
  toPoint,
  height,
  interactive,
  pickMode,
  rounded,
  style,
  onMapPress,
  userPoint,
  driverPoint,
  followDriver,
  bottomInset,
  routeGeometry,
  routeEstimated,
}: {
  from?: string | null;
  to?: string | null;
  fromPoint?: LatLng | null;
  toPoint?: LatLng | null;
  height?: number;
  interactive?: boolean;
  pickMode?: boolean;
  rounded?: boolean;
  style?: StyleProp<ViewStyle>;
  onMapPress?: (point: LatLng) => void;
  userPoint?: LatLng | null;
  driverPoint?: LiveMapPosition | null;
  followDriver?: boolean;
  bottomInset?: number;
  routeGeometry?: LatLng[];
  routeEstimated?: boolean;
}) {
  // Prefer explicit lat/lng selections; only fall back to label geocode when points are set.
  const points = useMemo<MapPoint[]>(() => {
    const out: MapPoint[] = [];
    if (fromPoint) {
      out.push({ ...fromPoint, type: "pickup", label: from ?? undefined });
    } else if (from) {
      const a = resolveCoords(from);
      if (a) out.push({ ...a, type: "pickup", label: from });
    }
    if (toPoint) {
      out.push({ ...toPoint, type: "dropoff", label: to ?? undefined });
    } else if (to) {
      const b = resolveCoords(to);
      if (b) out.push({ ...b, type: "dropoff", label: to });
    }
    return out;
  }, [from, to, fromPoint, toPoint]);

  return (
    <MapSurface
      points={points}
      height={height}
      interactive={interactive}
      pickMode={pickMode}
      rounded={rounded}
      style={style}
      onMapPress={onMapPress}
      userPoint={userPoint}
      driverPoint={driverPoint}
      followDriver={followDriver}
      bottomInset={bottomInset}
      routeGeometry={routeGeometry}
      routeEstimated={routeEstimated}
    />
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: "hidden", backgroundColor: colors.surfaceMuted },
  rounded: { borderRadius: radius.lg },
  web: { flex: 1, backgroundColor: colors.surfaceMuted },
});
