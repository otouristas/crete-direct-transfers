import type { StyleProp, ViewStyle } from "react-native";
import type { LatLng } from "./coords";
export type LiveMapPosition = LatLng & { heading?: number | null; capturedAt?: string };
export type MapSurfaceProps = {
  points: (LatLng & { type?: "pickup" | "dropoff"; label?: string })[];
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
};
