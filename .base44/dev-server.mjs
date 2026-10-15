// Base44 sandbox dev server.
//
// This project is a build-free static site (index.html + app.js + data.js +
// styles.css + slide images), so the sandbox serves the repo directory as-is and
// pushes a browser reload whenever a source file changes. Sandbox tooling only —
// it is not part of the lesson app itself and nothing in the app depends on it.
import { createServer } from "node:http";
import { readFile, readdir, stat } from "node:fs/promises";
import { extname, join, normalize, relative, sep } from "node:path";

const ROOT = process.cwd();
const PORT = Number(process.env.PORT || 3000);
const POLL_MS = 1000;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2"
};

// Injected into HTML responses so edits show up in the browser without a manual reload.
const RELOAD_SNIPPET = `<script>
(function () {
  try {
    var es = new EventSource("/__dev_reload");
    es.onmessage = function () { location.reload(); };
  } catch (e) {}
})();
</script>
`;

const clients = new Set();

async function treeSignature(dir, acc = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await treeSignature(full, acc);
      continue;
    }
    const info = await stat(full);
    acc.push(`${relative(ROOT, full)}:${info.mtimeMs}:${info.size}`);
  }
  return acc;
}

// Cheap polling keeps working across bind mounts where inotify events may not reach us.
async function watchLoop() {
  let last = "";
  for (;;) {
    let current = "";
    try {
      current = (await treeSignature(ROOT)).join("|");
    } catch (e) { /* transient (e.g. file replaced mid-scan) */ }
    if (last && current && current !== last) {
      for (const res of clients) {
        try { res.write("data: reload\n\n"); } catch (e) { /* dropped client */ }
      }
    }
    if (current) last = current;
    await new Promise((resolve) => setTimeout(resolve, POLL_MS));
  }
}

function fail(res, code, message) {
  res.writeHead(code, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
  res.end(message);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (url.pathname === "/__dev_reload") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store",
      Connection: "keep-alive"
    });
    res.write(": connected\n\n");
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return;
  }

  let pathname = decodeURIComponent(url.pathname);
  if (pathname.endsWith("/")) pathname += "index.html";

  const filePath = normalize(join(ROOT, pathname));
  if (filePath !== ROOT && !filePath.startsWith(ROOT + sep)) {
    return fail(res, 403, "Forbidden");
  }

  let body;
  try {
    body = await readFile(filePath);
  } catch (e) {
    return fail(res, 404, "Not found");
  }

  const type = MIME[extname(filePath).toLowerCase()] || "application/octet-stream";
  if (type.startsWith("text/html")) {
    body = Buffer.from(
      body.toString("utf8").replace(/<\/body>/i, `${RELOAD_SNIPPET}</body>`)
    );
  }

  res.writeHead(200, {
    "Content-Type": type,
    "Content-Length": body.length,
    // No-store so a browser reload always picks up the edited source.
    "Cache-Control": "no-store"
  });
  res.end(req.method === "HEAD" ? undefined : body);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`serving ${ROOT} on http://0.0.0.0:${PORT} (live reload on)`);
  watchLoop();
});
