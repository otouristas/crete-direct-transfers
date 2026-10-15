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
  `TransferAround website release\n\n` +
    `website/ contains the compiled Cloudflare Worker and public assets.\n` +
    `The verified live deployment is https://crete-direct-transfers.gk-3ae.workers.dev.\n` +
    `transferaround.com still needs DNS cutover.\n` +
    `Deploy this compiled output from website/server using: npx wrangler deploy --config wrangler.json\n` +
    `Configure protected server secrets in the intended Cloudflare account.\n` +
    `Native iOS apps are delivered separately through TestFlight and signed IPA files.\n` +
    `This website archive does not contain installable iOS apps or local credentials.\n` +
    `See documentation/README.md for payment activation and verification limits.\n` +
    `No real Stripe charge, refund or payout has been performed.\n`,
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
