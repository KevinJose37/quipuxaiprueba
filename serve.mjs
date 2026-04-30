// serve.mjs — Adaptador Node.js para TanStack Start (Cloudflare Worker)
import { createServer, request as httpRequest } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const CLIENT_DIR = join(__dirname, 'dist', 'client');
const API_BACKEND = process.env.API_BACKEND || 'http://api:8888';
const PORT = parseInt(process.env.PORT || '3000', 10);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
};

async function tryRead(path) {
  try { return await readFile(path); } catch { return null; }
}

// Import the Cloudflare Worker entry
const mod = await import('./dist/server/index.js');
const worker = mod.default;

// Mock Cloudflare ASSETS binding
const ASSETS = {
  fetch: async (req) => {
    const url = new URL(typeof req === 'string' ? req : req.url);
    const data = await tryRead(join(CLIENT_DIR, url.pathname));
    if (data) {
      const ext = extname(url.pathname);
      return new Response(data, {
        headers: { 'Content-Type': MIME[ext] || 'application/octet-stream' },
      });
    }
    return new Response('Not Found', { status: 404 });
  },
};

// Proxy /api/* requests to backend
function proxyApi(req, res) {
  const target = new URL(req.url, API_BACKEND);
  const proxy = httpRequest(target, {
    method: req.method,
    headers: { ...req.headers, host: target.host },
  }, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  proxy.on('error', () => { res.writeHead(502); res.end('Bad Gateway'); });
  req.pipe(proxy);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);

  // 1. Proxy API
  if (url.pathname.startsWith('/api/')) return proxyApi(req, res);

  // 2. Static files
  if (url.pathname !== '/' && !url.pathname.endsWith('/')) {
    const data = await tryRead(join(CLIENT_DIR, url.pathname));
    if (data) {
      const ext = extname(url.pathname);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      return res.end(data);
    }
  }

  // 3. SSR via Cloudflare Worker
  try {
    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (typeof v === 'string') headers.set(k, v);
    }
    const webReq = new Request(url.toString(), { method: req.method, headers });
    const env = { ASSETS };
    const ctx = { waitUntil: () => {}, passThroughOnException: () => {} };
    const webRes = await worker.fetch(webReq, env, ctx);

    const resHeaders = {};
    webRes.headers.forEach((v, k) => { resHeaders[k] = v; });
    res.writeHead(webRes.status, resHeaders);
    if (webRes.body) {
      const reader = webRes.body.getReader();
      let chunk;
      while (!(chunk = await reader.read()).done) res.write(chunk.value);
    }
    res.end();
  } catch (err) {
    console.error('SSR Error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
