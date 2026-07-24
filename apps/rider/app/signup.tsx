import { Redirect } from "expo-router";
import { SKIP_AUTH } from "../lib/config";
import SignupForm from "../components/signup-form";

export default function SignupRoute() {
  if (SKIP_AUTH) return <Redirect href="/(tabs)" />;
  return <SignupForm />;
}
