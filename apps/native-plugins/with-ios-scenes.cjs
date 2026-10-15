// SDK 54 compatibility for Xcode 27's required UIKit scene lifecycle.
// Keep the bridge in AppDelegate and attach its root view to the scene's window.
module.exports = function withIosScenes(config) {
  const { withInfoPlist, withAppDelegate } = require(
    require.resolve("@expo/config-plugins", { paths: [config._internal.projectRoot] }),
  );
  config = withInfoPlist(config, (result) => {
    result.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: "Default Configuration",
            UISceneDelegateClassName: "TransferAroundSceneDelegate",
          },
        ],
      },
    };
    return result;
  });
  return withAppDelegate(config, (result) => {
    if (result.modResults.language !== "swift") throw new Error("Swift AppDelegate required");
    const marker = "// TransferAround scene lifecycle";
    if (result.modResults.contents.includes(marker)) return result;
    const legacy =
      /#if os\(iOS\) \|\| os\(tvOS\)\s+window = UIWindow\(frame: UIScreen\.main\.bounds\)[\s\S]*?#endif/;
    if (!legacy.test(result.modResults.contents))
      throw new Error("Unexpected Expo AppDelegate template");
    result.modResults.contents =
      result.modResults.contents.replace(legacy, marker) +
      `

@objc(TransferAroundSceneDelegate)
class TransferAroundSceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(_ scene: UIScene, willConnectTo session: UISceneSession,
             options connectionOptions: UIScene.ConnectionOptions) {
    guard let windowScene = scene as? UIWindowScene,
          let app = UIApplication.shared.delegate as? AppDelegate,
          let factory = app.reactNativeFactory else { return }
    let sceneWindow = UIWindow(windowScene: windowScene)
    sceneWindow.frame = windowScene.coordinateSpace.bounds
    window = sceneWindow
    app.window = sceneWindow
    var launchOptions: [UIApplication.LaunchOptionsKey: Any] = [:]
    if let context = connectionOptions.urlContexts.first {
      launchOptions[.url] = context.url
      launchOptions[.sourceApplication] = context.options.sourceApplication
    }
    if let activity = connectionOptions.userActivities.first {
      launchOptions[.userActivityDictionary] = ["UIApplicationLaunchOptionsUserActivityKey": activity]
    }
    factory.startReactNative(withModuleName: "main", in: sceneWindow, launchOptions: launchOptions)
    sceneWindow.rootViewController?.view.frame = sceneWindow.bounds
    sceneWindow.rootViewController?.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    sceneWindow.rootViewController?.view.setNeedsLayout()
    sceneWindow.rootViewController?.view.layoutIfNeeded()
    NSLog("TransferAround scene window: %@, root: %@", String(describing: sceneWindow.frame), String(describing: sceneWindow.rootViewController?.view))
  }

  func scene(_ scene: UIScene, openURLContexts contexts: Set<UIOpenURLContext>) {
    guard let app = UIApplication.shared.delegate as? AppDelegate else { return }
    for context in contexts {
      var options: [UIApplication.OpenURLOptionsKey: Any] = [.openInPlace: context.options.openInPlace]
      if let source = context.options.sourceApplication { options[.sourceApplication] = source }
      _ = app.application(UIApplication.shared, open: context.url, options: options)
    }
  }

  func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
    guard let app = UIApplication.shared.delegate as? AppDelegate else { return }
    _ = app.application(UIApplication.shared, continue: userActivity, restorationHandler: { _ in })
  }

  func sceneDidBecomeActive(_ scene: UIScene) {
    (UIApplication.shared.delegate as? AppDelegate)?.applicationDidBecomeActive(UIApplication.shared)
  }
  func sceneWillResignActive(_ scene: UIScene) {
    (UIApplication.shared.delegate as? AppDelegate)?.applicationWillResignActive(UIApplication.shared)
  }
  func sceneWillEnterForeground(_ scene: UIScene) {
    (UIApplication.shared.delegate as? AppDelegate)?.applicationWillEnterForeground(UIApplication.shared)
  }
  func sceneDidEnterBackground(_ scene: UIScene) {
    (UIApplication.shared.delegate as? AppDelegate)?.applicationDidEnterBackground(UIApplication.shared)
  }
}
`;
    return result;
  });
};
