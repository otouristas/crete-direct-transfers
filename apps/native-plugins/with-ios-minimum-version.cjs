module.exports = function withIosMinimumVersion(config) {
  const { withPodfile, withXcodeProject, withDangerousMod } = require(
    require.resolve("@expo/config-plugins", {
      paths: [config._internal.projectRoot],
    }),
  );
  config = withPodfile(config, (result) => {
    const marker = "# TransferAround: Xcode 27 supports iOS 15 and later.";
    if (!result.modResults.contents.includes(marker)) {
      result.modResults.contents = result.modResults.contents.replace(
        /post_install do \|installer\|([\s\S]*?)\n  end/,
        (_match, body) =>
          `post_install do |installer|${body}\n    ${marker}\n    installer.pods_project.targets.each do |target|\n      target.build_configurations.each do |build_config|\n        current = build_config.build_settings['IPHONEOS_DEPLOYMENT_TARGET']\n        if current.nil? || Gem::Version.new(current) < Gem::Version.new('15.1')\n          build_config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '15.1'\n        end\n      end\n    end\n  end`,
      );
    }
    return result;
  });
  // Expo SDK 54's generated scripts need quoted paths for Application Support.
  config = withXcodeProject(config, (result) => {
    const phases = result.modResults.hash.project.objects.PBXShellScriptBuildPhase;
    for (const phase of Object.values(phases)) {
      if (typeof phase !== "object" || typeof phase.shellScript !== "string") continue;
      phase.shellScript = phase.shellScript.replace(
        "`\\\"$NODE_BINARY\\\" --print \\\"require('path').dirname(require.resolve('react-native/package.json')) + '/scripts/react-native-xcode.sh'\\\"`",
        "/bin/bash \\\"$(\\\"$NODE_BINARY\\\" --print \\\"require('path').dirname(require.resolve('react-native/package.json')) + '/scripts/react-native-xcode.sh'\\\")\\\"",
      );
    }
    return result;
  });
  return withDangerousMod(config, [
    "ios",
    async (result) => {
      const fs = require("node:fs/promises");
      const path = require("node:path");
      const constants = path.dirname(
        require.resolve("expo-constants/package.json", {
          paths: [result.modRequest.projectRoot],
        }),
      );
      const fixes = [
        ["scripts/get-app-config-ios.sh", "basename $PROJECT_DIR", 'basename "$PROJECT_DIR"'],
        [
          "ios/EXConstants.podspec",
          'bash -l -c \\"#{env_vars}$PODS_TARGET_SRCROOT/../scripts/get-app-config-ios.sh\\"',
          '/bin/bash -l \\"#{env_vars}$PODS_TARGET_SRCROOT/../scripts/get-app-config-ios.sh\\"',
        ],
      ];
      for (const [relative, from, to] of fixes) {
        const file = path.join(constants, relative);
        const original = await fs.readFile(file, "utf8");
        if (original.includes(from)) await fs.writeFile(file, original.replace(from, to));
      }
      return result;
    },
  ]);
};
