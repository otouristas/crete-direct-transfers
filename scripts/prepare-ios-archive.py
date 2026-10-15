#!/usr/bin/env python3
"""Preserve native entitlements for Xcode's automatic distribution export.

The initial signatures are ad hoc. Only a successful Xcode export produces a
distribution-signed IPA suitable for App Store Connect.
"""
import pathlib
import plistlib
import subprocess
import sys
import tempfile

archive, entitlement_source, team = sys.argv[1:]
source = pathlib.Path(archive)
apps = [source] if source.suffix == ".app" else list((source / "Products/Applications").glob("*.app"))
if len(apps) != 1:
    raise ValueError("Expected exactly one application in the archive")
application = apps[0]
info = plistlib.loads((application / "Info.plist").read_bytes())
identifier = f"{team}.{info['CFBundleIdentifier']}"
entitlements = plistlib.loads(pathlib.Path(entitlement_source).read_bytes())
if "iPhoneSimulator" in info.get("CFBundleSupportedPlatforms", []):
    # UI/GPS simulator checks need no device capabilities or keychain access.
    # Apple account authentication is verified on distribution-signed devices.
    entitlements = {}
else:
    entitlements.update({
        "application-identifier": identifier,
        "com.apple.developer.team-identifier": team,
        "keychain-access-groups": [identifier],
    })
for framework in sorted((application / "Frameworks").glob("*.framework")):
    subprocess.run(["codesign", "--force", "--sign", "-", str(framework)], check=True)
with tempfile.TemporaryDirectory(prefix="transferaround-signing-") as temporary:
    path = pathlib.Path(temporary) / "entitlements.plist"
    path.write_bytes(plistlib.dumps(entitlements))
    subprocess.run([
        "codesign", "--force", "--sign", "-", "--entitlements", str(path),
        "--generate-entitlement-der", str(application),
    ], check=True)
