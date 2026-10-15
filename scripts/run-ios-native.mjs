import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const role = process.argv[2];
if (role === "--help") {
  console.log(
    "Usage: node scripts/run-ios-native.mjs rider|driver\nBuilds and installs a bundled Release iOS app. Optional: TA_IOS_WORKSPACE, TA_SIMULATOR_UDID.",
  );
  process.exit(0);
}
if (!["rider", "driver"].includes(role)) throw new Error("Choose rider or driver.");
const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = process.env.TA_IOS_WORKSPACE || repository;
const appRoot = path.join(workspace, "apps", role);
const app = role === "rider" ? "TransferAround" : "TransferAroundDriver";
const config = JSON.parse(fs.readFileSync(path.join(appRoot, "app.json"), "utf8")).expo;
const env = { ...process.env, EXTRA_PACKAGER_ARGS: "--max-workers 2" };
if (!env.SSL_CERT_FILE && fs.existsSync("/etc/ssl/cert.pem"))
  env.SSL_CERT_FILE = "/etc/ssl/cert.pem";
const run = (command, args, cwd = appRoot) =>
  execFileSync(command, args, { cwd, env, stdio: "inherit" });
const read = (args) =>
  JSON.parse(execFileSync("xcrun", ["simctl", ...args, "--json"], { encoding: "utf8" }));
if (!fs.existsSync(path.join(appRoot, "node_modules/expo/bin/cli"))) {
  throw new Error(`Install dependencies first: npm --prefix apps/${role} ci`);
}
run(process.execPath, [
  "node_modules/expo/bin/cli",
  "prebuild",
  "--platform",
  "ios",
  "--no-install",
]);
run("pod", ["install", "--project-directory=ios"]);
const devices = Object.values(read(["list", "devices", "available"]).devices).flat();
let udid =
  process.env.TA_SIMULATOR_UDID || devices.find((d) => d.name === "TransferAround iPhone")?.udid;
if (!udid) {
  const runtime = read(["list", "runtimes"])
    .runtimes.filter((r) => r.isAvailable && r.identifier.includes(".iOS-"))
    .sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }))[0];
  if (!runtime) throw new Error("Install an iOS runtime in Xcode first.");
  const types = read(["list", "devicetypes"]).devicetypes;
  const type =
    types.find((d) => d.identifier.endsWith(".iPhone-17-Pro")) ||
    types.filter((d) => d.productFamily === "iPhone").at(-1);
  if (!type) throw new Error("No iPhone simulator device type is installed.");
  udid = execFileSync(
    "xcrun",
    ["simctl", "create", "TransferAround iPhone", type.identifier, runtime.identifier],
    { encoding: "utf8" },
  ).trim();
}
if (!devices.some((d) => d.udid === udid && d.state === "Booted"))
  run("xcrun", ["simctl", "boot", udid]);
run("xcrun", ["simctl", "bootstatus", udid, "-b"]);
const derived = path.join(os.tmpdir(), "transferaround-native-build", role);
run("xcodebuild", [
  "-workspace",
  `ios/${app}.xcworkspace`,
  "-scheme",
  app,
  "-configuration",
  "Release",
  "-destination",
  `id=${udid}`,
  "-derivedDataPath",
  derived,
  "-jobs",
  "2",
  "CODE_SIGNING_ALLOWED=NO",
  "ONLY_ACTIVE_ARCH=YES",
  "IPHONEOS_DEPLOYMENT_TARGET=15.1",
  "build",
]);
const binary = path.join(derived, "Build/Products/Release-iphonesimulator", `${app}.app`);
run("python3", [
  path.join(repository, "scripts/prepare-ios-archive.py"),
  binary,
  path.join(appRoot, "ios", app, `${app}.entitlements`),
  config.ios.appleTeamId,
]);
run("xcrun", ["simctl", "install", udid, binary]);
run("xcrun", ["simctl", "launch", udid, config.ios.bundleIdentifier]);
console.log(
  `Native app installed. Open Xcode Device Hub and select TransferAround iPhone.\n${binary}`,
);
