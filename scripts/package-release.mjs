import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const name = `transferaround-${stamp}`;
const destination = path.join(root, "release", name);
await mkdir(destination, { recursive: true });
const entries = [
  [".output", "website"],
  ["apps/rider/dist", "traveler-web"],
  ["apps/driver/dist", "driver-web"],
  ["apps/rider/dist-ios", "ios-javascript/traveler"],
  ["apps/driver/dist-ios", "ios-javascript/driver"],
  ["docs/release", "documentation"],
  [".env.example", "server.env.example"],
  ["apps/rider/.env.example", "traveler.env.example"],
  ["apps/driver/.env.example", "driver.env.example"],
];
for (const [source, target] of entries) {
  await cp(path.join(root, source), path.join(destination, target), {
    recursive: true,
    filter: (file) => !/\/(?:\.env(?:\.local)?|node_modules|\.DS_Store)$/.test(file),
  });
}
// Deploy this compiled Worker directly; its source build is already complete.
const configPath = path.join(destination, "website/server/wrangler.json");
const config = JSON.parse(await readFile(configPath, "utf8"));
delete config.build;
await writeFile(configPath, JSON.stringify(config, null, 2) + "\n");
await writeFile(
  path.join(destination, "README.txt"),
  `TransferAround release candidate\n\n` +
    `website/ is the compiled Cloudflare Worker and public assets.\n` +
    `After configuring the required server secrets and verifying the target account,\n` +
    `deploy from website/server using: npx wrangler deploy --config wrangler.json\n` +
    `traveler-web/ and driver-web/ are browser app previews; serve with SPA fallback.\n` +
    `ios-javascript/ contains Hermes JavaScript exports, NOT signed installable apps.\n` +
    `See documentation/README.md for activation requirements and test instructions.\n` +
    `No production deployment or real Stripe payment has been performed.\n`,
);
const checksums = [];
async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await scan(file);
    else {
      const bytes = await readFile(file);
      checksums.push(
        `${createHash("sha256").update(bytes).digest("hex")}  ${path.relative(destination, file)}`,
      );
    }
  }
}
await scan(destination);
await writeFile(path.join(destination, "SHA256SUMS"), checksums.sort().join("\n") + "\n");
const archive = path.join(root, "release", `${name}.tar.gz`);
execFileSync("tar", ["-czf", archive, "-C", path.join(root, "release"), name], {
  env: { ...process.env, COPYFILE_DISABLE: "1" },
});
console.log(archive);
