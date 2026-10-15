module.exports = function withIosMinimumVersion(config) {
  const { withPodfile } = require(
    require.resolve("@expo/config-plugins", {
      paths: [config._internal.projectRoot],
    }),
  );
  return withPodfile(config, (result) => {
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
};
