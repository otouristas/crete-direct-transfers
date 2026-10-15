import { execFileSync } from "node:child_process";
import path from "node:path";
import os from "node:os";
const root = process.cwd();
const output =
  process.env.TA_IOS_RELEASE_DIR || path.join(os.tmpdir(), "transferaround-swift-release");
const run = (args) => execFileSync("xcodebuild", args, { cwd: root, stdio: "inherit" });
for (const scheme of ["TransferAround", "TransferAroundDriver"]) {
  run([
    "-jobs",
    "2",
    "-project",
    "apps/ios-native/TransferAround.xcodeproj",
    "-scheme",
    scheme,
    "-configuration",
    "Release",
    "-destination",
    "generic/platform=iOS",
    "-archivePath",
    path.join(output, `${scheme}.xcarchive`),
    "-derivedDataPath",
    path.join(output, "DerivedData"),
    "CODE_SIGNING_ALLOWED=NO",
    "OTHER_SWIFT_FLAGS=$(inherited) -j2 -num-threads 2",
    "archive",
  ]);
  execFileSync(
    process.execPath,
    ["scripts/prepare-ios-archive.mjs", path.join(output, `${scheme}.xcarchive`)],
    { cwd: root, stdio: "inherit" },
  );
}
console.log(
  `Swift iOS archives: ${output}. Export with Xcode automatic distribution signing. No upload was requested.`,
);
