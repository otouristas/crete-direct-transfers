import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(process.argv[2] || ".output/public");
const port = Number(process.argv[3] || 8082);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".ico": "image/x-icon",
};
http
  .createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
      let file = path.resolve(root, "." + pathname);
      if (file !== root && !file.startsWith(root + path.sep)) {
        res.writeHead(403);
        res.end();
        return;
      }
      try {
        if (!(await stat(file)).isFile()) file = path.join(root, "index.html");
      } catch {
        if (path.extname(pathname)) {
          res.writeHead(404);
          res.end();
          return;
        }
        file = path.join(root, "index.html");
      }
      const body = await readFile(file);
      res.writeHead(200, {
        "content-type": mime[path.extname(file)] || "application/octet-stream",
        "cache-control": "no-store",
      });
      res.end(body);
    } catch {
      res.writeHead(500);
      res.end("Preview unavailable");
    }
  })
  .listen(port, "0.0.0.0", () => console.log(`App preview: http://localhost:${port}/practice`));
