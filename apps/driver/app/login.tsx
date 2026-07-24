import { Redirect } from "expo-router";
import { SKIP_AUTH } from "../lib/config";
import LoginForm from "../components/login-form";

export default function LoginRoute() {
  if (SKIP_AUTH) return <Redirect href="/(tabs)" />;
  return <LoginForm />;
}
