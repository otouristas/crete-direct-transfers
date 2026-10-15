/* eslint-disable @typescript-eslint/no-require-imports -- Metro bundles the map marker asset. */
import { useEffect, useRef, useState } from "react";
import { Animated, Image, Pressable, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { CRETE_CENTER } from "./coords";
import type { MapSurfaceProps } from "./map-surface-types";
import { colors } from "./tokens";
import { Icon } from "./icon";

/** Apple MapKit, with a car marker driven exclusively by received GPS samples. */
export function MapSurface({
  points,
  height = 220,
  interactive = true,
  pickMode,
  rounded,
  style,
  onMapPress,
  userPoint,
  driverPoint,
  followDriver = false,
  bottomInset = 0,
}: MapSurfaceProps) {
  const map = useRef<MapView>(null);
  const [ready, setReady] = useState(false);
  const initial = points[0] || userPoint || CRETE_CENTER;
  const position = useRef({
    latitude: new Animated.Value(driverPoint?.lat ?? initial.lat),
    longitude: new Animated.Value(driverPoint?.lng ?? initial.lng),
  }).current;
  const seenDriver = useRef(Boolean(driverPoint));
  const framedDriver = useRef(false);
  const following = useRef(followDriver);
  const latest = useRef({ points, driverPoint, bottomInset });
  latest.current = { points, driverPoint, bottomInset };
  const geometry = points.map((p) => `${p.lat},${p.lng}`).join(";");
  useEffect(() => {
    if (!ready) return;
    const locations = points.map((p) => ({ latitude: p.lat, longitude: p.lng }));
    if (latest.current.driverPoint)
      locations.push({
        latitude: latest.current.driverPoint.lat,
        longitude: latest.current.driverPoint.lng,
      });
    if (locations.length > 1)
      map.current?.fitToCoordinates(locations, {
        // MapKit already excludes mapPadding; adding the sheet twice loses the pins.
        edgePadding: { top: 100, right: 55, bottom: 40, left: 55 },
        animated: true,
      });
    else if (locations.length === 1)
      map.current?.animateToRegion(
        { ...locations[0], latitudeDelta: 0.025, longitudeDelta: 0.025 },
        650,
      );
    // Geometry changes move the camera; typing a label must not reset a map gesture.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geometry, ready, bottomInset]);
  useEffect(() => {
    if (ready && userPoint) following.current = false;
    if (ready && userPoint)
      map.current?.animateToRegion(
        {
          latitude: userPoint.lat,
          longitude: userPoint.lng,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        },
        650,
      );
  }, [ready, userPoint]);
  const driverLat = driverPoint?.lat;
  const driverLng = driverPoint?.lng;
  useEffect(() => {
    if (driverLat == null || driverLng == null) {
      seenDriver.current = false;
      framedDriver.current = false;
      return;
    }
    if (!seenDriver.current) {
      position.latitude.setValue(driverLat);
      position.longitude.setValue(driverLng);
      seenDriver.current = true;
    } else
      Animated.parallel([
        Animated.timing(position.latitude, {
          toValue: driverLat,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(position.longitude, {
          toValue: driverLng,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]).start();
    if (ready && !framedDriver.current) {
      framedDriver.current = true;
      const locations = [
        { latitude: driverLat, longitude: driverLng },
        ...latest.current.points.map((p) => ({ latitude: p.lat, longitude: p.lng })),
      ];
      if (locations.length > 1)
        map.current?.fitToCoordinates(locations, {
          edgePadding: { top: 100, right: 55, bottom: 40, left: 55 },
          animated: true,
        });
      else
        map.current?.animateToRegion(
          {
            latitude: driverLat,
            longitude: driverLng,
            latitudeDelta: 0.012,
            longitudeDelta: 0.012,
          },
          650,
        );
    }
    if (ready && (followDriver || following.current))
      map.current?.animateCamera(
        { center: { latitude: driverLat, longitude: driverLng } },
        { duration: 1000 },
      );
  }, [driverLat, driverLng, followDriver, position, ready]);
  return (
    <View
      style={[
        { height, overflow: "hidden", backgroundColor: "#EDF0F3", borderRadius: rounded ? 20 : 0 },
        style,
      ]}
    >
      <MapView
        ref={map}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: initial.lat,
          longitude: initial.lng,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
        mapType="mutedStandard"
        userInterfaceStyle="light"
        showsCompass={false}
        showsScale={false}
        showsPointsOfInterest={false}
        showsUserLocation={Boolean(userPoint)}
        showsMyLocationButton={false}
        mapPadding={{ top: 0, left: 0, right: 0, bottom: bottomInset }}
        scrollEnabled={interactive}
        zoomEnabled={interactive}
        rotateEnabled={false}
        pitchEnabled={false}
        onPanDrag={() => {
          following.current = false;
        }}
        onMapReady={() => setReady(true)}
        onPress={
          pickMode
            ? (e) =>
                onMapPress?.({
                  lat: e.nativeEvent.coordinate.latitude,
                  lng: e.nativeEvent.coordinate.longitude,
                })
            : undefined
        }
      >
        {points.map((p, i) => (
          <Marker
            key={p.type || i}
            coordinate={{ latitude: p.lat, longitude: p.lng }}
            title={p.label}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={[s.pin, p.type === "dropoff" && s.destination]}>
              <View style={[s.dot, p.type === "dropoff" && { borderRadius: 1 }]} />
            </View>
          </Marker>
        ))}
        {driverPoint && (
          <Marker.Animated
            coordinate={position}
            anchor={{ x: 0.5, y: 0.5 }}
            title="Driver’s GPS position"
          >
            <Image
              source={require("../../assets/car-marker-v2.png")}
              resizeMode="contain"
              // Marker.rotation is Google-only on iOS; rotate the MapKit artwork itself.
              style={{
                width: 80,
                height: 60,
                transform: [{ rotate: `${Math.max(0, driverPoint.heading ?? 0)}deg` }],
              }}
            />
          </Marker.Animated>
        )}
      </MapView>
      {driverPoint && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Follow driver"
          style={[s.follow, { bottom: bottomInset + 20 }]}
          onPress={() => {
            following.current = true;
            map.current?.animateCamera(
              {
                center: { latitude: driverPoint.lat, longitude: driverPoint.lng },
                altitude: 1400,
                zoom: 15,
              },
              { duration: 650 },
            );
          }}
        >
          <Icon name="car-sport" size={23} />
        </Pressable>
      )}
    </View>
  );
}
const s = StyleSheet.create({
  follow: {
    position: "absolute",
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 23,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.15,
    shadowRadius: 7,
  },
  pin: {
    width: 25,
    height: 25,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: "white",
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  destination: { backgroundColor: colors.primary },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "white" },
  car: {
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D2D6DF",
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});
