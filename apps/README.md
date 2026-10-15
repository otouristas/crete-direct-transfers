# TransferAround iOS apps

The canonical iOS apps are entirely Swift and SwiftUI in `ios-native/`.

| App | Xcode scheme | Bundle ID |
| --- | --- | --- |
| Traveler | TransferAround | com.transferaround.rider |
| Driver | TransferAroundDriver | com.transferaround.driver |

Open `ios-native/TransferAround.xcodeproj` in Xcode. Supabase Swift is pinned through Swift Package Manager. Maps, routing, GPS, authentication UI and remote notifications use Apple frameworks. There is no JavaScript runtime, Expo, Metro or CocoaPods in these iOS apps.

From the repository root, `npm run ios:rider` / `npm run ios:driver` build and install the Swift apps on a booted iPhone simulator. Node only runs the build commands. Xcode signs simulator apps so Apple Keychain session storage works. Never manually re-sign simulator binaries.

The `rider/`, `driver/` and `native-plugins/` directories contain the retained pre-rewrite implementation and web prototypes. They are not the iOS release source.

Shared protected Supabase tables and server checkout APIs connect the native apps and website. Test transfers use separate tables, explicitly marked demo payment, approved test membership, atomic acceptance and no financial side effects.

See [iOS release notes](../docs/release/IOS.md) for validation and distribution status.
