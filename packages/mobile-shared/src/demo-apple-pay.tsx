import { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Icon, Text, fonts } from "./ui";

/** Deliberately isolated simulation. It never invokes Wallet, Stripe or a real booking API. */
export function DemoApplePay({
  visible,
  amountCents,
  destination,
  onClose,
  onAuthorize,
}: {
  visible: boolean;
  amountCents: number;
  destination: string;
  onClose: () => void;
  onAuthorize: () => Promise<boolean>;
}) {
  const insets = useSafeAreaInsets();
  const [busy, setBusy] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState(false);
  const amount = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(
    amountCents / 100,
  );
  function dismiss() {
    if (busy) return;
    setComplete(false);
    setError(false);
    onClose();
  }
  async function authorize() {
    if (busy) return;
    setBusy(true);
    setError(false);
    try {
      const ok = await onAuthorize();
      setComplete(ok);
      setError(!ok);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={dismiss}>
      <View style={s.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityLabel="Close demo payment"
          onPress={dismiss}
        />
        <View
          style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 24) }]}
          accessibilityViewIsModal
        >
          <View style={s.grabber} />
          <View style={s.header}>
            <View style={s.logo}>
              <Icon name="logo-apple" size={28} color="#101114" />
              <Text style={s.pay}>Pay</Text>
            </View>
            <View style={s.badge}>
              <Text style={s.badgeText}>DEMO · NO CHARGE</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cancel demo Apple Pay"
              disabled={busy}
              onPress={dismiss}
              hitSlop={12}
            >
              <Icon name="close" size={22} color="#646A74" />
            </Pressable>
          </View>
          {complete ? (
            <View style={s.success}>
              <View style={s.successIcon}>
                <Icon name="checkmark" size={35} color="#101114" />
              </View>
              <Text style={s.title}>Practice payment complete.</Text>
              <Text style={s.description}>
                Your practice payment is complete. Your driver can now accept the journey.
              </Text>
              <Text style={s.note}>No card was accessed or charged.</Text>
              <Button title="Follow your journey" onPress={dismiss} fullWidth />
            </View>
          ) : (
            <>
              <Text style={s.title}>Confirm your{`\n`}practice ride.</Text>
              <View style={s.card}>
                <View style={s.cardTop}>
                  <Text style={s.cardBrand}>TransferAround</Text>
                  <Icon name="wifi-outline" size={22} color="#EBF2FF" />
                </View>
                <View style={s.chip} />
                <Text style={s.cardDigits}>•••• •••• •••• 4242</Text>
                <Text style={s.cardFoot}>FICTIONAL DEMO CARD</Text>
              </View>
              <View style={s.summary}>
                <View style={s.line}>
                  <Text style={s.label}>Your arrival</Text>
                  <Text style={s.value}>{destination}</Text>
                </View>
                <View style={s.separator} />
                <View style={s.line}>
                  <Text style={s.label}>Demo total</Text>
                  <Text style={s.amount}>{amount}</Text>
                </View>
              </View>
              <Button
                title={`Simulate Apple Pay · ${amount}`}
                icon="logo-apple"
                onPress={() => void authorize()}
                loading={busy}
                fullWidth
              />
              <Text style={s.note}>
                A TransferAround demo of the payment step. This is not the Wallet payment sheet. No
                real payment is requested.
              </Text>
              {error && (
                <Text accessibilityRole="alert" style={s.error}>
                  The practice trip could not be created. Please try again.
                </Text>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(8,32,27,0.55)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    padding: 24,
    gap: 20,
  },
  grabber: {
    width: 38,
    height: 4,
    borderRadius: 3,
    backgroundColor: "#CED5C6",
    alignSelf: "center",
    marginTop: -12,
  },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  logo: { flexDirection: "row", alignItems: "center" },
  pay: { fontSize: 27, lineHeight: 35, fontFamily: fonts.semibold, color: "#101114" },
  badge: {
    backgroundColor: "#EBF2FF",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  badgeText: { fontSize: 8, fontFamily: fonts.bodySemibold, letterSpacing: 1, color: "#2059C2" },
  title: {
    fontFamily: fonts.bold,
    fontSize: 33,
    lineHeight: 38,
    letterSpacing: -0.8,
    color: "#101114",
  },
  card: { backgroundColor: "#101114", borderRadius: 24, padding: 23, gap: 20, minHeight: 184 },
  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardBrand: { color: "#FFFFFF", fontFamily: fonts.semibold, fontSize: 16 },
  chip: {
    width: 30,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#CCD1D9",
    borderColor: "#E7E8EC",
    borderWidth: 1,
  },
  cardDigits: { color: "#E4E7ED", letterSpacing: 3, fontSize: 16, fontFamily: fonts.medium },
  cardFoot: { color: "#AEB5C1", fontSize: 8, letterSpacing: 2, fontFamily: fonts.medium },
  summary: { gap: 15 },
  line: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 24 },
  label: { color: "#646A74", fontFamily: fonts.medium, fontSize: 12 },
  value: {
    color: "#101114",
    fontFamily: fonts.semibold,
    fontSize: 12,
    flex: 1,
    textAlign: "right",
  },
  separator: { height: 1, backgroundColor: "#E7E8EC" },
  amount: {
    color: "#101114",
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.8,
  },
  note: {
    fontSize: 10,
    lineHeight: 16,
    fontFamily: fonts.body,
    color: "#646A74",
    textAlign: "center",
  },
  error: { fontSize: 12, color: "#B33E35" },
  success: { alignItems: "center", gap: 20, paddingVertical: 30 },
  successIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#EBF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    color: "#646A74",
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 23,
    textAlign: "center",
  },
});
