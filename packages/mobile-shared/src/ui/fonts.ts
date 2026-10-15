import { useFonts } from "expo-font";
import {
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from "@expo-google-fonts/inter";

/**
 * Loads the brand typefaces (Plus Jakarta Sans display + Inter body).
 * The registered family names match `fonts` in tokens.ts. Returns `true`
 * once the fonts are ready; render a branded splash until then.
 */
export function useAppFonts(): boolean {
  const [loaded] = useFonts({
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });
  return loaded;
}
