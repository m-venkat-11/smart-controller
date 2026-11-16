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

// Find local IPv4 address
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

// Spawn C# Input Injector subprocess
const injectorPath = path.join(__dirname, 'injector.exe');
if (!fs.existsSync(injectorPath)) {
  console.error('[Error] receiver/injector.exe not found! Please compile injector.cs first.');
  process.exit(1);
}

const injector = spawn(injectorPath, [], {
  stdio: ['pipe', 'inherit', 'inherit'],
});

injector.on('error', (err) => {
  console.error('[Injector Error]', err);
});

function sendCommand(cmd) {
  if (injector.stdin.writable) {
    injector.stdin.write(cmd + '\n');
  }
}

// Create HTTP Server
const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/status') {
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
  } else if (req.url === '/' || req.url === '/controller') {
    // Redirect to the rich web controller app or serve quick fallback
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>GlyphPad Receiver v1.0</title>
  <style>
    body { background: #08090a; color: #f5f6f8; font-family: monospace; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
    .card { background: #14171a; border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; padding: 24px; max-width: 90%; }
    .status { color: #00e575; font-weight: bold; margin-bottom: 12px; font-size: 16px; }
    .btn { display: inline-block; background: #eb0029; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="status">● RECEIVER RUNNING ON ${os.hostname()}</div>
    <p>Local IP: <strong>${localIp}:${PORT}</strong></p>
    <p>Launch the full GlyphPad Web App connected to this receiver:</p>
    <a class="btn" href="https://smart-controller.vercel.app">LAUNCH GLYPHPAD CONSOLE</a>
  </div>
</body>
</html>`);
  } else {
    res.writeHead(404);
    res.end();
  }
});

// Create WebSocket Server
const wss = new WebSocketServer({ server, path: '/ucp' });

let clientCount = 0;

wss.on('connection', (ws, req) => {
  clientCount++;
  const clientIp = req.socket.remoteAddress;
  console.log(`[GlyphPad] Controller connected from ${clientIp} (Active clients: ${clientCount})`);

  // Send handshake welcome
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
      // Discard invalid packet
    }
  });

  ws.on('close', () => {
    clientCount--;
    sendCommand('RELEASE_ALL');
    console.log(`[GlyphPad] Controller disconnected. (Active: ${clientCount})`);
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
  console.log(` Windows OS  : ${os.type()} ${os.release()}`);
  console.log(` Status      : ACTIVE & LISTENING`);
  console.log(` Local IP    : http://${localIp}:${PORT}`);
  console.log('----------------------------------------------------------------');
  console.log(' HOW TO CONNECT:');
  console.log(` 1. Open GlyphPad: https://smart-controller.vercel.app`);
  console.log(` 2. In Connection Settings, enter: ${localIp}:${PORT}`);
  console.log(' 3. Your phone/browser will instantly control this Windows PC!');
  console.log('================================================================\n');
});

process.on('SIGINT', () => {
  sendCommand('RELEASE_ALL');
  injector.kill();
  process.exit();
});
