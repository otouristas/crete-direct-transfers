import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const role = process.argv[2];
if (role === "--help") {
  console.log(
    "Usage: node scripts/run-ios-native.mjs rider|driver\nBuilds the Swift/SwiftUI app with Xcode and installs it on a booted iPhone simulator. Optional: TA_SIMULATOR_UDID, TA_IOS_DERIVED_DATA.",
  );
  process.exit(0);
}
if (!["rider", "driver"].includes(role)) throw new Error("Choose rider or driver.");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const native = path.join(root, "apps/ios-native");
const app = role === "rider" ? "TransferAround" : "TransferAroundDriver";
const run = (command, args) => execFileSync(command, args, { cwd: root, stdio: "inherit" });
if (!fs.existsSync(path.join(native, "TransferAround.xcodeproj")))
  run("xcodegen", ["generate", "--spec", "apps/ios-native/project.yml"]);
const available = JSON.parse(
  execFileSync("xcrun", ["simctl", "list", "devices", "available", "--json"], { encoding: "utf8" }),
);
const devices = Object.values(available.devices).flat();
const udid =
  process.env.TA_SIMULATOR_UDID ||
  devices.find((d) => d.state === "Booted" && d.name.includes("TransferAround"))?.udid;
if (!udid)
  throw new Error("Boot the TransferAround iPhone simulator, or explicitly set TA_SIMULATOR_UDID.");
run("xcrun", ["simctl", "bootstatus", udid, "-b"]);
const derived = process.env.TA_IOS_DERIVED_DATA || path.join(os.tmpdir(), "transferaround-swift");
run("xcodebuild", [
  "-jobs",
  "2",
  "-project",
  path.join(native, "TransferAround.xcodeproj"),
  "-scheme",
  app,
  "-configuration",
  "Debug",
  "-sdk",
  "iphonesimulator",
  "-destination",
  `platform=iOS Simulator,id=${udid}`,
  "-derivedDataPath",
  derived,
  "CODE_SIGNING_ALLOWED=YES",
  "CODE_SIGN_IDENTITY=-",
  "OTHER_SWIFT_FLAGS=$(inherited) -j2 -num-threads 2",
  "build",
]);
const binary = path.join(derived, "Build/Products/Debug-iphonesimulator", `${app}.app`);
run("xcrun", ["simctl", "install", udid, binary]);
run("xcrun", ["simctl", "launch", udid, `com.transferaround.${role}`]);
console.log(`${app}: Swift/SwiftUI app installed. ${binary}`);
