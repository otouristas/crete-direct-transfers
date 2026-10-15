const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const fs = require("fs");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);
const installedRoots = [projectRoot, workspaceRoot]
  .map((root) => path.resolve(root, "node_modules"))
  .filter((p) => fs.existsSync(p))
  .map((p) => fs.realpathSync(p));
const sharedRoot = fs.realpathSync(path.resolve(workspaceRoot, "packages/mobile-shared"));
config.watchFolders = [workspaceRoot, sharedRoot, ...installedRoots];
config.resolver.nodeModulesPaths = installedRoots;
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
