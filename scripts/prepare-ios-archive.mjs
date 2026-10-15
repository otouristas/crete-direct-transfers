import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Unsigned archives do not carry CODE_SIGN_ENTITLEMENTS into an export.
// Preserve the target's declared capabilities in the archive signature;
// Xcode subsequently applies the trusted Apple distribution signature/profile.
const archive = process.argv[2];
if (!archive?.endsWith(".xcarchive")) throw new Error("Pass an iPhone .xcarchive path.");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const plist = (file, key) =>
  JSON.parse(
    execFileSync(
      "plutil",
      key ? ["-extract", key, "json", "-o", "-", file] : ["-convert", "json", "-o", "-", file],
      { encoding: "utf8" },
    ),
  );
const archived = plist(path.join(archive, "Info.plist"), "ApplicationProperties");
const bundle = archived.CFBundleIdentifier;
const role =
  bundle === "com.transferaround.rider"
    ? "Traveler"
    : bundle === "com.transferaround.driver"
      ? "Driver"
      : null;
if (!role) throw new Error("This archive does not belong to a TransferAround iOS target.");
const app = path.join(archive, "Products", archived.ApplicationPath);
const info = plist(path.join(app, "Info.plist"));
if (
  !info.CFBundleSupportedPlatforms?.includes("iPhoneOS") ||
  info.UIDeviceFamily?.join(",") !== "1"
)
  throw new Error(
    "Only device archives for iPhone are supported; simulator apps must keep their Xcode-generated signatures.",
  );
const name = role === "Traveler" ? "TransferAround" : "TransferAroundDriver";
const declared = plist(path.join(root, "apps/ios-native", role, `${name}.entitlements`));
const team = "S768Y6EZW8";
const identifier = `${team}.${bundle}`;
const entitlements = {
  ...declared,
  "com.apple.developer.team-identifier": team,
  "application-identifier": identifier,
  "keychain-access-groups": [identifier],
  "get-task-allow": false,
};
if (
  entitlements["aps-environment"] !== "development" ||
  entitlements["com.apple.developer.applesignin"]?.[0] !== "Default"
)
  throw new Error("Required push and Apple sign-in capabilities are missing from the target.");
const temporary = mkdtempSync(path.join(os.tmpdir(), "ta-archive-entitlements-"));
try {
  const file = path.join(temporary, "entitlements.plist");
  writeFileSync(file, JSON.stringify(entitlements), { mode: 0o600 });
  execFileSync("plutil", ["-convert", "xml1", file]);
  execFileSync(
    "codesign",
    ["--force", "--sign", "-", "--entitlements", file, "--timestamp=none", app],
    { stdio: "inherit" },
  );
  const signed = execFileSync("codesign", ["-d", "--entitlements", ":-", app], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
  if (!signed.includes("aps-environment") || !signed.includes("com.apple.developer.applesignin"))
    throw new Error("The archive signature did not preserve the declared capabilities.");
  console.log(
    `${bundle}: archive capabilities preserved. Export with Xcode automatic distribution signing and verify the final IPA before uploading.`,
  );
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
