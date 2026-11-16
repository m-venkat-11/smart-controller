/**
 * GLYPHPAD WINDOWS COMPANION RECEIVER
 * Universal Control Protocol (UCP v1.0) Server
 * Lightweight, zero-cloud, local-first input bridge for Windows
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 8443;

// Find non-internal IPv4 address
function getLocalIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

const localIp = getLocalIp();

// Spawn C# Input Injector subprocess safely
let injector = null;
try {
  injector = spawn('injector.exe', [], {
    cwd: __dirname,
    shell: true,
    stdio: ['pipe', 'pipe', 'pipe'],
    windowsHide: true,
  });

  injector.on('spawn', () => {
    console.log('[GlyphPad] C# Native Win32 Input Injector attached.');
  });

  injector.on('error', (err) => {
    console.warn('[GlyphPad] Injector process warning:', err.message);
  });
} catch (e) {
  console.warn('[GlyphPad] Could not spawn injector.exe:', e.message);
}

function sendCommand(cmd) {
  if (injector && injector.stdin && injector.stdin.writable) {
    try {
      injector.stdin.write(cmd + '\n');
    } catch (_) {}
  }
}

// MIME types for static files
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

// Dist folder path
const distPath = path.join(__dirname, '..', 'dist');

// Create HTTP Server
const server = http.createServer((req, res) => {
  // Enable full CORS for web controller access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Status endpoint for receiver discovery & health check
  if (pathname === '/status' || pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'READY',
      protocol: 'UCP-1.0',
      host: os.hostname(),
      platform: 'win32',
      arch: os.arch(),
      ip: localIp,
      port: PORT,
      clients: wss ? wss.clients.size : 0,
      timestamp: Date.now()
    }));
    return;
  }

  // Serve static files from dist/ if available
  if (fs.existsSync(distPath)) {
    let filePath = path.join(distPath, pathname === '/' ? 'index.html' : pathname);

    // If file doesn't exist, fallback to index.html (SPA routing)
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distPath, 'index.html');
    }

    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(500);
          res.end('Error loading asset');
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content);
        }
      });
      return;
    }
  }

  // Fallback landing page if dist/ hasn't been built
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>GlyphPad Receiver v1.0</title>
  <style>
    body { background: #08090a; color: #fff; font-family: monospace; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
    .card { background: #121417; border: 1px solid rgba(255,255,255,0.15); border-radius: 24px; padding: 32px; max-width: 90%; }
    .btn { display: inline-block; background: #eb0029; color: #fff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <h2 style="color:#00e575">● GLYPHPAD RECEIVER RUNNING</h2>
    <p>Host: <strong>${os.hostname()}</strong> | IP: <strong>${localIp}:${PORT}</strong></p>
    <a class="btn" href="https://smart-controller.vercel.app">LAUNCH WEB CONTROLLER</a>
  </div>
</body>
</html>`);
});

// Create WebSocket Server
const wss = new WebSocketServer({ server, path: '/ucp' });

let clientCount = 0;

wss.on('connection', (ws, req) => {
  clientCount++;
  const clientIp = req.socket.remoteAddress;
  console.log(`[GlyphPad] Client connected from ${clientIp} (Total active: ${clientCount})`);

  // Send handshake greeting
  ws.send(JSON.stringify({
    type: 'SESSION_ACK',
    payload: {
      status: 'AUTHENTICATED',
      host: os.hostname(),
      platform: 'Windows',
      version: '1.0.0',
      timestamp: Date.now()
    }
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      const type = data.type;
      const payload = data.payload || {};

      switch (type) {
        case 'PING':
          ws.send(JSON.stringify({
            type: 'PONG',
            payload: {
              clientTimestamp: payload.timestamp || Date.now(),
              serverTimestamp: Date.now()
            }
          }));
          break;

        case 'MOVE':
        case 'POINTER_MOVE':
          sendCommand(`M ${Math.round(payload.dx || 0)} ${Math.round(payload.dy || 0)}`);
          break;

        case 'CLICK':
        case 'BUTTON_STATE':
          if (payload.button === 'RIGHT') {
            sendCommand('RC');
          } else if (payload.button === 'MIDDLE') {
            sendCommand('MC');
          } else {
            sendCommand('LC');
          }
          break;

        case 'DOUBLE_CLICK':
          sendCommand('LDC');
          break;

        case 'SCROLL':
          sendCommand(`S ${Math.round(payload.delta || payload.deltaY || 0)}`);
          if (payload.deltaX) {
            sendCommand(`HS ${Math.round(payload.deltaX)}`);
          }
          break;

        case 'ACTION':
        case 'ACTION_REQUEST':
        case 'SHORTCUT':
          sendCommand(`ACTION ${payload.action || payload.actionId || payload.shortcut || ''}`);
          break;

        case 'TYPE_TEXT':
        case 'TEXT':
          if (payload.text) {
            const b64 = Buffer.from(payload.text, 'utf-8').toString('base64');
            sendCommand(`TEXT ${b64}`);
          }
          break;

        case 'KEY':
        case 'KEY_DOWN':
        case 'KEY_UP':
          if (payload.vk) {
            sendCommand(`K ${payload.vk}`);
          } else if (payload.key) {
            sendCommand(`ACTION ${payload.key.toUpperCase()}`);
          }
          break;

        case 'RELEASE_ALL':
          sendCommand('RELEASE_ALL');
          break;
      }
    } catch (e) {
      // Discard malformed packet
    }
  });

  ws.on('close', () => {
    clientCount--;
    sendCommand('RELEASE_ALL');
    console.log(`[GlyphPad] Client disconnected. (Remaining: ${clientCount})`);
  });
});

// Start Server
server.listen(PORT, '0.0.0.0', () => {
  console.clear();
  console.log('================================================================');
  console.log('                   GLYPHPAD RECEIVER v1.0                      ');
  console.log('              Universal Wireless Touchpad Host                  ');
  console.log('================================================================');
  console.log(` Host Name   : ${os.hostname()}`);
  console.log(` Windows OS  : ${os.type()} ${os.release()} (${os.arch()})`);
  console.log(` Status      : ACTIVE & LISTENING`);
  console.log(` Local URL   : http://${localIp}:${PORT}`);
  console.log('----------------------------------------------------------------');
  console.log(' 📱 HOW TO CONNECT YOUR PHONE:');
  console.log(` 1. Connect your phone to the same Wi-Fi.`);
  console.log(` 2. On your phone browser, open:`);
  console.log(`    👉 http://${localIp}:${PORT}`);
  console.log(' 3. The full GlyphPad controller loads directly from your PC!');
  console.log('    Your phone will instantly control your computer.');
  console.log('================================================================\n');
});

process.on('SIGINT', () => {
  sendCommand('RELEASE_ALL');
  if (injector) injector.kill();
  process.exit();
});
