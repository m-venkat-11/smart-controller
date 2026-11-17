/**
 * DIGITAL TOUCHPAD — UNIVERSAL COMPANION RECEIVER
 * Universal Control Protocol (UCP v2.0)
 * Standalone Zero-Manual-Configuration Server
 * Cross-Platform: Windows, macOS, and Linux
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const dgram = require('dgram');
const { spawn, exec } = require('child_process');
const { WebSocketServer } = require('ws');
let QRCode = null;
try {
  QRCode = require('qrcode');
} catch (_) {}

const PORT = process.env.PORT || 8443;
const UDP_PORT = 8444;
const CURRENT_OS = os.platform(); // 'win32' | 'darwin' | 'linux'

// Detect all valid non-internal IPv4 addresses across network adapters
function getNetworkInterfacesList() {
  const nets = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push({ name, address: net.address });
      }
    }
  }
  return addresses.length > 0 ? addresses : [{ name: 'loopback', address: '127.0.0.1' }];
}

const networkList = getNetworkInterfacesList();
const primaryIp = networkList[0].address;

function getNormalizedPlatform() {
  if (CURRENT_OS === 'win32') return 'windows';
  if (CURRENT_OS === 'darwin') return 'macos';
  return 'linux';
}

// ==========================================
// TRUSTED DEVICES & PAIRING STATE (UCP v2.0)
// ==========================================
const TRUSTED_DEVICES_FILE = path.join(__dirname, 'trusted_devices.json');

function loadTrustedDevices() {
  try {
    if (fs.existsSync(TRUSTED_DEVICES_FILE)) {
      return JSON.parse(fs.readFileSync(TRUSTED_DEVICES_FILE, 'utf-8'));
    }
  } catch (_) {}
  return [];
}

function saveTrustedDevices(devices) {
  try {
    fs.writeFileSync(TRUSTED_DEVICES_FILE, JSON.stringify(devices, null, 2), 'utf-8');
  } catch (_) {}
}

let trustedDevices = loadTrustedDevices();

// Rotating 6-Digit PIN and Challenge Token (Refreshes every 3 minutes)
let currentPairingPin = Math.floor(100000 + Math.random() * 900000).toString();
let currentPairingToken = crypto.randomBytes(16).toString('hex');
let tokenExpiresAt = Date.now() + 180000;

function refreshPairingChallenge() {
  currentPairingPin = Math.floor(100000 + Math.random() * 900000).toString();
  currentPairingToken = crypto.randomBytes(16).toString('hex');
  tokenExpiresAt = Date.now() + 180000;
}
setInterval(refreshPairingChallenge, 180000);

// ==========================================
// CROSS-PLATFORM INPUT INJECTION BACKEND
// ==========================================
let winInjector = null;

function startWindowsInjector() {
  const psExe = path.join(
    process.env.SystemRoot || 'C:\\Windows',
    'System32',
    'WindowsPowerShell',
    'v1.0',
    'powershell.exe'
  );
  const psScript = path.join(__dirname, 'injector.ps1');

  try {
    console.log('[Digital Touchpad] Starting Native Win32 SendInput Injector via PowerShell...');
    winInjector = spawn(
      psExe,
      ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', psScript],
      {
        cwd: __dirname,
        stdio: ['pipe', 'pipe', 'pipe'],
        windowsHide: true,
      }
    );

    winInjector.stdout.on('data', (data) => {
      const msg = data.toString().trim();
      if (msg.includes('INJECTOR_READY')) {
        console.log('[Digital Touchpad] ✓ Native Win32 SendInput Injector is READY and ACTIVE.');
      }
    });

    winInjector.stderr.on('data', (data) => {
      const msg = data.toString().trim();
      if (msg) console.warn('[Digital Touchpad] Injector notice:', msg);
    });

    winInjector.on('error', (err) => {
      console.warn('[Digital Touchpad] Injector process warning:', err.message);
    });

    winInjector.on('close', (code) => {
      if (code !== 0 && code !== null) {
        console.warn(`[Digital Touchpad] Injector stopped with code ${code}. Auto-restarting in 1s...`);
        setTimeout(startWindowsInjector, 1000);
      }
    });
  } catch (e) {
    console.warn('[Digital Touchpad] Could not spawn injector.ps1:', e.message);
  }
}

if (CURRENT_OS === 'win32') {
  startWindowsInjector();
} else if (CURRENT_OS === 'darwin') {
  console.log('[Digital Touchpad] Running on macOS. Initializing AppleScript/Quartz adapter.');
} else {
  console.log('[Digital Touchpad] Running on Linux. Initializing X11/Wayland input adapter.');
}

function sendNativeCommand(cmd, payload = {}) {
  if (CURRENT_OS === 'win32') {
    if (winInjector && winInjector.stdin && winInjector.stdin.writable) {
      try {
        winInjector.stdin.write(cmd + '\n');
      } catch (err) {
        console.warn('[Digital Touchpad] Failed writing to injector:', err.message);
      }
    }
  } else if (CURRENT_OS === 'darwin') {
    handleMacCommand(cmd, payload);
  } else if (CURRENT_OS === 'linux') {
    handleLinuxCommand(cmd, payload);
  }
}

// macOS AppleScript / osascript dispatching
function handleMacCommand(cmd, payload) {
  const parts = cmd.split(' ');
  const op = parts[0].toUpperCase();
  try {
    if (op === 'M') {
      const dx = parseInt(parts[1]) || 0;
      const dy = parseInt(parts[2]) || 0;
      exec(`osascript -e 'tell application "System Events" to set {x, y} to {${dx}, ${dy}}'`, () => {});
    } else if (op === 'LC') {
      exec(`osascript -e 'tell application "System Events" to click'`, () => {});
    } else if (op === 'RC') {
      exec(`osascript -e 'tell application "System Events" to perform action "AXShowMenu"'`, () => {});
    } else if (op === 'ACTION') {
      const act = parts[1] || '';
      switch (act.toUpperCase()) {
        case 'SHOW_DESKTOP':
          exec(`osascript -e 'tell application "System Events" to key code 103'`);
          break;
        case 'TASK_VIEW':
        case 'TASK_MANAGER':
          exec(`open -a "Activity Monitor"`);
          break;
        case 'SETTINGS':
          exec(`open "x-apple.systempreferences:"`);
          break;
        case 'SEARCH':
          exec(`osascript -e 'tell application "System Events" to key code 49 using command down'`);
          break;
        case 'LOCK_PC':
          exec(`osascript -e 'tell application "System Events" to key code 12 using {control down, command down}'`);
          break;
      }
    }
  } catch (_) {}
}

// Linux xdotool dispatching
function handleLinuxCommand(cmd, payload) {
  const parts = cmd.split(' ');
  const op = parts[0].toUpperCase();
  try {
    if (op === 'M') {
      const dx = parseInt(parts[1]) || 0;
      const dy = parseInt(parts[2]) || 0;
      exec(`xdotool mousemove_relative -- ${dx} ${dy}`, () => {});
    } else if (op === 'LC') {
      exec(`xdotool click 1`, () => {});
    } else if (op === 'RC') {
      exec(`xdotool click 3`, () => {});
    } else if (op === 'S') {
      const d = parseInt(parts[1]) || 0;
      exec(`xdotool click ${d > 0 ? 4 : 5}`, () => {});
    }
  } catch (_) {}
}

// ==========================================
// UDP BROADCAST SERVICE DISCOVERY (LAN Beacon)
// ==========================================
function startUdpDiscovery() {
  try {
    const udp = dgram.createSocket({ type: 'udp4', reuseAddr: true });

    udp.on('error', (err) => {
      console.warn('[Digital Touchpad] UDP discovery notice:', err.message);
    });

    udp.on('message', (msg, rinfo) => {
      try {
        const req = JSON.parse(msg.toString());
        if (req.action === 'DISCOVER_DIGITAL_TOUCHPAD') {
          const resp = Buffer.from(
            JSON.stringify({
              service: 'digital-touchpad',
              version: '2.0.0',
              host: os.hostname(),
              platform: getNormalizedPlatform(),
              osName: `${os.type()} ${os.release()}`,
              ip: primaryIp,
              port: PORT,
              pin: currentPairingPin,
              pairingToken: currentPairingToken,
            })
          );
          udp.send(resp, rinfo.port, rinfo.address);
        }
      } catch (_) {}
    });

    udp.bind(UDP_PORT, () => {
      try {
        udp.setBroadcast(true);
        console.log(`[Digital Touchpad] UDP Discovery Beacon active on port ${UDP_PORT}`);

        // Broadcast announcement every 2.5s for zero-config auto discovery
        setInterval(() => {
          try {
            const announcement = Buffer.from(
              JSON.stringify({
                service: 'digital-touchpad',
                version: '2.0.0',
                host: os.hostname(),
                platform: getNormalizedPlatform(),
                ip: primaryIp,
                port: PORT,
              })
            );
            udp.send(announcement, UDP_PORT, '255.255.255.255');
          } catch (_) {}
        }, 2500);
      } catch (_) {}
    });
  } catch (e) {
    console.warn('[Digital Touchpad] Could not bind UDP discovery socket:', e.message);
  }
}

startUdpDiscovery();

// ==========================================
// HTTP SERVER & STATIC ASSETS
// ==========================================
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

const distPath = path.join(__dirname, '..', 'dist');

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Zero-Config Subnet Discovery & Capabilities Endpoint
  if (pathname === '/status' || pathname === '/health' || pathname === '/capabilities') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: 'READY',
        service: 'digital-touchpad',
        protocol: 'UCP-2.0',
        host: os.hostname(),
        platform: getNormalizedPlatform(),
        osName: `${os.type()} ${os.release()}`,
        arch: os.arch(),
        deviceType: os.type().toLowerCase().includes('windows') ? 'laptop' : 'desktop',
        ip: primaryIp,
        interfaces: networkList,
        port: PORT,
        pin: currentPairingPin,
        pairingToken: currentPairingToken,
        trustedCount: trustedDevices.length,
        clients: wss ? wss.clients.size : 0,
        timestamp: Date.now(),
      })
    );
    return;
  }

  // QR Code Dynamic Pairing Endpoint (Generates live scannable PNG or SVG)
  if (pathname === '/pairing-qr') {
    const pairUrl = `http://${primaryIp}:${PORT}?pair=${currentPairingPin}&token=${currentPairingToken}`;
    const format = parsedUrl.searchParams.get('format') || 'png';
    if (QRCode) {
      try {
        if (format === 'svg') {
          const svg = await QRCode.toString(pairUrl, {
            type: 'svg',
            color: { dark: '#000000', light: '#ffffff' },
            margin: 1,
          });
          res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
          res.end(svg);
          return;
        } else {
          const pngBuf = await QRCode.toBuffer(pairUrl, {
            type: 'png',
            width: 256,
            margin: 1,
            color: { dark: '#000000', light: '#ffffff' },
          });
          res.writeHead(200, { 'Content-Type': 'image/png' });
          res.end(pngBuf);
          return;
        }
      } catch (_) {}
    }
    // Fallback JSON payload if QRCode library is not loaded
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ url: pairUrl, pin: currentPairingPin, token: currentPairingToken }));
    return;
  }

  // Trusted Devices API
  if (pathname === '/trusted-devices') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(trustedDevices));
      return;
    }
    if (req.method === 'DELETE') {
      const devId = parsedUrl.searchParams.get('id');
      if (devId) {
        trustedDevices = trustedDevices.filter((d) => d.id !== devId);
        saveTrustedDevices(trustedDevices);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, trustedDevices }));
      return;
    }
  }

  // Serve static files from dist/ if available
  if (fs.existsSync(distPath)) {
    let filePath = path.join(distPath, pathname === '/' ? 'index.html' : pathname);

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
  <title>Digital Touchpad Receiver</title>
  <style>
    body { background: #08090a; color: #fff; font-family: monospace; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
    .card { background: #121417; border: 1px solid rgba(255,255,255,0.15); border-radius: 24px; padding: 32px; max-width: 90%; }
    .btn { display: inline-block; background: #eb0029; color: #fff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <h2 style="color:#00e575">● DIGITAL TOUCHPAD RECEIVER ACTIVE</h2>
    <p>Host: <strong>${os.hostname()}</strong> (${getNormalizedPlatform().toUpperCase()})</p>
    <p>Pairing PIN: <strong style="font-size:24px; letter-spacing:4px; color:#eb0029">${currentPairingPin}</strong></p>
    <p>Local IP: <strong>${primaryIp}:${PORT}</strong></p>
    <a class="btn" href="https://smart-controller.vercel.app">LAUNCH WEB CONTROLLER</a>
  </div>
</body>
</html>`);
});

// ==========================================
// WEBSOCKET PROTOCOL ENGINE (UCP v2.0)
// ==========================================
const wss = new WebSocketServer({ server, path: '/ucp' });

let clientCount = 0;

wss.on('connection', (ws, req) => {
  clientCount++;
  const clientIp = req.socket.remoteAddress;
  try {
    req.socket.setNoDelay(true);
  } catch (_) {}
  let authenticatedDeviceId = null;
  let isSessionAuthenticated = false;

  console.log(`[Digital Touchpad] Device connected from ${clientIp} (Total active: ${clientCount})`);

  // Send initial handshake with pairing challenge & machine profile
  ws.send(
    JSON.stringify({
      type: 'SESSION_ACK',
      payload: {
        status: 'READY_TO_AUTHENTICATE',
        host: os.hostname(),
        platform: getNormalizedPlatform(),
        osName: `${os.type()} ${os.release()}`,
        arch: os.arch(),
        ip: primaryIp,
        interfaces: networkList,
        pin: currentPairingPin,
        pairingToken: currentPairingToken,
        version: '2.0.0',
        timestamp: Date.now(),
      },
    })
  );

  let subpixelX = 0;
  let subpixelY = 0;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      const type = data.type;
      const payload = data.payload || {};

      switch (type) {
        case 'PING':
          ws.send(
            JSON.stringify({
              type: 'PONG',
              payload: {
                clientTimestamp: payload.timestamp || Date.now(),
                serverTimestamp: Date.now(),
              },
            })
          );
          break;

        // One-Time Secure Pairing Request (PRD Section 3)
        case 'PAIR_REQUEST': {
          const reqPin = (payload.pin || '').toString().replace(/\s/g, '');
          const reqToken = payload.token || '';
          const devId = payload.deviceId || `device_${Date.now()}`;
          const devName = payload.deviceName || 'Smartphone';

          const pinValid = reqPin === currentPairingPin;
          const tokenValid = reqToken === currentPairingToken && Date.now() < tokenExpiresAt;

          if (pinValid || tokenValid) {
            // Generate permanent authenticated session token
            const authToken = crypto.randomBytes(24).toString('hex');
            authenticatedDeviceId = devId;
            isSessionAuthenticated = true;

            // Save to trusted devices
            trustedDevices = trustedDevices.filter((d) => d.id !== devId);
            trustedDevices.push({
              id: devId,
              name: devName,
              token: authToken,
              pairedAt: Date.now(),
              lastSeen: Date.now(),
              ip: clientIp,
            });
            saveTrustedDevices(trustedDevices);

            console.log(`[Digital Touchpad] ✓ Authenticated new trusted device: ${devName} (${devId})`);

            ws.send(
              JSON.stringify({
                type: 'PAIR_ACK',
                payload: {
                  status: 'PAIRED',
                  authToken,
                  deviceId: devId,
                  host: os.hostname(),
                  platform: getNormalizedPlatform(),
                },
              })
            );
          } else {
            console.warn(`[Digital Touchpad] Pairing rejected from ${clientIp}. Invalid PIN/Token.`);
            ws.send(
              JSON.stringify({
                type: 'PAIR_REJECTED',
                payload: { reason: 'INVALID_CREDENTIALS' },
              })
            );
          }
          break;
        }

        // Fast One-Tap Reconnection for Trusted Devices (PRD Section 3.2)
        case 'SESSION_RESUME': {
          const devId = payload.deviceId;
          const authToken = payload.authToken;
          const trusted = trustedDevices.find((d) => d.id === devId && d.token === authToken);

          if (trusted) {
            authenticatedDeviceId = devId;
            isSessionAuthenticated = true;
            trusted.lastSeen = Date.now();
            saveTrustedDevices(trustedDevices);

            console.log(`[Digital Touchpad] ✓ Trusted device reconnected: ${trusted.name}`);
            ws.send(
              JSON.stringify({
                type: 'SESSION_RESUMED',
                payload: {
                  status: 'AUTHENTICATED',
                  host: os.hostname(),
                  platform: getNormalizedPlatform(),
                },
              })
            );
          } else {
            ws.send(
              JSON.stringify({
                type: 'SESSION_FAILED',
                payload: { reason: 'UNTRUSTED_DEVICE_PAIRING_REQUIRED' },
              })
            );
          }
          break;
        }

        case 'REVOKE_TRUST': {
          if (payload.deviceId) {
            trustedDevices = trustedDevices.filter((d) => d.id !== payload.deviceId);
            saveTrustedDevices(trustedDevices);
          }
          break;
        }

        // Real-Time Mouse Movement with Sub-Pixel Delta Accumulation
        case 'MOVE':
        case 'POINTER_MOVE': {
          const rawDx = Number(payload.dx) || 0;
          const rawDy = Number(payload.dy) || 0;
          subpixelX += rawDx;
          subpixelY += rawDy;

          const stepX = Math.trunc(subpixelX);
          const stepY = Math.trunc(subpixelY);

          if (stepX !== 0 || stepY !== 0) {
            subpixelX -= stepX;
            subpixelY -= stepY;
            sendNativeCommand(`M ${stepX} ${stepY}`);
          }
          break;
        }

        case 'CLICK':
        case 'BUTTON_STATE': {
          const btn = (payload.button || 'LEFT').toUpperCase();
          const act = (payload.action || 'CLICK').toUpperCase();
          if (act === 'DOWN') {
            if (btn === 'RIGHT') sendNativeCommand('RD');
            else if (btn === 'MIDDLE') sendNativeCommand('MD');
            else sendNativeCommand('LD');
          } else if (act === 'UP') {
            if (btn === 'RIGHT') sendNativeCommand('RU');
            else if (btn === 'MIDDLE') sendNativeCommand('MU');
            else sendNativeCommand('LU');
          } else {
            if (btn === 'RIGHT') sendNativeCommand('RC');
            else if (btn === 'MIDDLE') sendNativeCommand('MC');
            else sendNativeCommand('LC');
          }
          break;
        }

        case 'DOUBLE_CLICK':
          sendNativeCommand('LDC');
          break;

        case 'SCROLL':
          sendNativeCommand(`S ${Math.round(payload.delta || payload.deltaY || 0)}`);
          if (payload.deltaX) {
            sendNativeCommand(`HS ${Math.round(payload.deltaX)}`);
          }
          break;

        case 'ACTION':
        case 'ACTION_REQUEST':
        case 'SHORTCUT':
          sendNativeCommand(`ACTION ${payload.action || payload.actionId || payload.shortcut || ''}`);
          break;

        case 'TYPE_TEXT':
        case 'TEXT':
          if (payload.text) {
            const b64 = Buffer.from(payload.text, 'utf-8').toString('base64');
            sendNativeCommand(`TEXT ${b64}`);
          }
          break;

        case 'KEY':
        case 'KEY_DOWN':
        case 'KEY_UP':
          if (payload.vk) {
            sendNativeCommand(`K ${payload.vk}`);
          } else if (payload.key) {
            sendNativeCommand(`ACTION ${payload.key.toUpperCase()}`);
          }
          break;

        case 'RELEASE_ALL':
          sendNativeCommand('RELEASE_ALL');
          break;
      }
    } catch (e) {
      // Discard malformed packet
    }
  });

  ws.on('close', () => {
    clientCount--;
    sendNativeCommand('RELEASE_ALL');
    console.log(`[Digital Touchpad] Device disconnected. (Remaining: ${clientCount})`);
  });
});

// Handle Server Errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[Digital Touchpad ERROR] Port ${PORT} is already in use by another instance.`);
    console.error(`Run start-receiver.bat to auto-close stale instances, or close any existing terminal.\n`);
    process.exit(1);
  } else {
    console.error('[Digital Touchpad ERROR]', err);
  }
});

// Start Server
server.listen(PORT, '0.0.0.0', () => {
  console.clear();
  console.log('================================================================');
  console.log('               DIGITAL TOUCHPAD COMPANION RECEIVER              ');
  console.log('              Universal Cross-Platform Wireless Touchpad        ');
  console.log('================================================================');
  console.log(` Host Name    : ${os.hostname()}`);
  console.log(` OS Platform  : ${getNormalizedPlatform().toUpperCase()} (${os.type()} ${os.release()})`);
  console.log(` Protocol     : Universal Control Protocol v2.0 (UCP v2.0)`);
  console.log(` Status       : ACTIVE & LISTENING`);
  console.log(` Pairing PIN  : ${currentPairingPin}`);
  console.log('----------------------------------------------------------------');
  console.log(' 🌐 AVAILABLE NETWORK ADDRESSES:');
  networkList.forEach((iface) => {
    console.log(`    👉 http://${iface.address}:${PORT}  [${iface.name}]`);
  });
  console.log('----------------------------------------------------------------');
  console.log(' 📱 ZERO-CONFIG PAIRING:');
  console.log(' 1. Connect phone to the same Wi-Fi.');
  console.log(` 2. On your phone, visit: http://${primaryIp}:${PORT}`);
  console.log(' 3. Or scan the QR code displayed in the desktop app.');
  console.log('================================================================\n');
});

process.on('SIGINT', () => {
  sendNativeCommand('RELEASE_ALL');
  if (winInjector) winInjector.kill();
  process.exit();
});
