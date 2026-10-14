// Temporary server that serves the set folder on 127.0.0.1 only.
// Maps the two virtual paths used by cards.html to real folders:
//   /__engine/...         -> the engine's shared/ (fonts, base CSS)
//   /__kit/<channel>/...  -> that channel skill's kit/ (brand CSS, images)
// So the set folder needs no copy of the engine or kit, and files never need absolute paths.

const fs = require('fs');
const http = require('http');
const path = require('path');
const { config, SHARED_DIR, kitDir } = require('./paths.cjs');

const LOOPBACK = '127.0.0.1';
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.otf': 'font/otf',
  '.ttf': 'font/ttf',
  '.woff2': 'font/woff2',
};
const DEFAULT_MIME = 'application/octet-stream';

// Converts a request URL into (base folder, relative path inside it).
function resolveTarget(pathname, setDir) {
  const { engine, kit } = config.routes;
  if (pathname.startsWith(engine)) return { base: SHARED_DIR, relative: pathname.slice(engine.length) };
  if (pathname.startsWith(kit)) {
    const [channel, ...rest] = pathname.slice(kit.length).split('/');
    return { base: kitDir(channel), relative: rest.join('/') };
  }
  return { base: setDir, relative: pathname.replace(/^\/+/, '') };
}

function resolveFile(pathname, setDir) {
  const { base, relative } = resolveTarget(pathname, setDir);
  const filePath = path.resolve(base, relative);
  const insideBase = filePath === base || filePath.startsWith(base + path.sep);
  return insideBase ? filePath : null;
}

function handleRequest(setDir, request, response) {
  let filePath = null;
  try {
    const { pathname } = new URL(request.url, `http://${LOOPBACK}`);
    filePath = resolveFile(decodeURIComponent(pathname), setDir);
  } catch (error) {
    response.writeHead(400).end(String(error.message));
    return;
  }
  if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end(`Not found: ${request.url}`);
    return;
  }
  const type = MIME_TYPES[path.extname(filePath).toLowerCase()] || DEFAULT_MIME;
  response.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  fs.createReadStream(filePath).pipe(response);
}

// Gets a free port from the OS, so it never collides with ports used by other services.
function startServer(setDir) {
  const server = http.createServer((request, response) => handleRequest(setDir, request, response));
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, LOOPBACK, () => {
      const { port } = server.address();
      resolve({
        origin: `http://${LOOPBACK}:${port}`,
        close: () => new Promise((done) => server.close(done)),
      });
    });
  });
}

module.exports = { startServer };
