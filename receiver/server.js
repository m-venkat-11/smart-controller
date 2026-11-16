/**
 * GLYPHPAD UNIVERSAL COMPANION RECEIVER
 * Universal Control Protocol (UCP v1.0) Server
 * Cross-Platform: Windows, macOS, and Linux
 * Zero-cloud, local-first input bridge
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn, exec } = require('child_process');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 8443;
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
    console.log('[GlyphPad] Starting Native Win32 Input Injector via PowerShell...');
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
        console.log('[GlyphPad] ✓ Native Win32 Input Injector is READY and ACTIVE.');
      }
    });

    winInjector.stderr.on('data', (data) => {
      const msg = data.toString().trim();
      if (msg) console.warn('[GlyphPad] Injector notice:', msg);
    });

    winInjector.on('error', (err) => {
      console.warn('[GlyphPad] Injector process warning:', err.message);
    });

    winInjector.on('close', (code) => {
      if (code !== 0 && code !== null) {
        console.warn(`[GlyphPad] Injector stopped with code ${code}. Auto-restarting in 1s...`);
        setTimeout(startWindowsInjector, 1000);
      }
    });
  } catch (e) {
    console.warn('[GlyphPad] Could not spawn injector.ps1:', e.message);
  }
}

if (CURRENT_OS === 'win32') {
  startWindowsInjector();
} else if (CURRENT_OS === 'darwin') {
  console.log('[GlyphPad] Running on macOS. Initializing AppleScript/Quartz adapter.');
} else {
  console.log('[GlyphPad] Running on Linux. Initializing X11/Wayland input adapter.');
}

function sendNativeCommand(cmd, payload = {}) {
  if (CURRENT_OS === 'win32') {
    if (winInjector && winInjector.stdin && winInjector.stdin.writable) {
      try {
        winInjector.stdin.write(cmd + '\n');
      } catch (err) {
        console.warn('[GlyphPad] Failed writing to injector:', err.message);
      }
    }
  } else if (CURRENT_OS === 'darwin') {
    // macOS AppleScript / osascript dispatching
    handleMacCommand(cmd, payload);
  } else if (CURRENT_OS === 'linux') {
    // Linux xdotool dispatching
    handleLinuxCommand(cmd, payload);
  }
}

// macOS Input Dispatcher
function handleMacCommand(cmd, payload) {
  const parts = cmd.split(' ');
  const op = parts[0].toUpperCase();

  try {
    if (op === 'M') {
      // Relative mouse move on macOS via AppleScript / cliclick
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
          exec(`osascript -e 'tell application "System Events" to key code 103'`); // F11
          break;
        case 'TASK_VIEW':
        case 'TASK_MANAGER':
          exec(`open -a "Activity Monitor"`);
          break;
        case 'SETTINGS':
          exec(`open "x-apple.systempreferences:"`);
          break;
        case 'SEARCH':
          exec(`osascript -e 'tell application "System Events" to key code 49 using command down'`); // Spotlight
          break;
        case 'FILE_MANAGER':
        case 'EXPLORER':
          exec(`open -a Finder ~`);
          break;
        case 'TERMINAL':
          exec(`open -a Terminal`);
          break;
        case 'CALCULATOR':
          exec(`open -a Calculator`);
          break;
        case 'LOCK_PC':
          exec(`osascript -e 'tell application "System Events" to key code 12 using {control down, command down}'`); // Lock
          break;
        case 'VOL_UP':
          exec(`osascript -e 'set volume output volume ((output volume of (get volume settings)) + 6)'`);
          break;
        case 'VOL_DOWN':
          exec(`osascript -e 'set volume output volume ((output volume of (get volume settings)) - 6)'`);
          break;
        case 'MUTE':
          exec(`osascript -e 'set volume output muted not (output muted of (get volume settings))'`);
          break;
        case 'MEDIA_PLAY_PAUSE':
          exec(`osascript -e 'tell application "Music" to playpause'`);
          break;
        case 'MEDIA_NEXT':
          exec(`osascript -e 'tell application "Music" to next track'`);
          break;
        case 'MEDIA_PREV':
          exec(`osascript -e 'tell application "Music" to previous track'`);
          break;
      }
    }
  } catch (_) {}
}

// Linux Input Dispatcher
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
      const btn = d > 0 ? 4 : 5;
      exec(`xdotool click ${btn}`, () => {});
    } else if (op === 'ACTION') {
      const act = parts[1] || '';
      switch (act.toUpperCase()) {
        case 'SHOW_DESKTOP':
          exec(`xdotool key super+d`);
          break;
        case 'TASK_MANAGER':
          exec(`gnome-system-monitor || ksysguard`);
          break;
        case 'TERMINAL':
          exec(`x-terminal-emulator || gnome-terminal`);
          break;
        case 'SETTINGS':
          exec(`gnome-control-center || systemsettings`);
          break;
        case 'SEARCH':
          exec(`xdotool key super`);
          break;
        case 'LOCK_PC':
          exec(`loginctl lock-session || xdg-screensaver lock`);
          break;
        case 'VOL_UP':
          exec(`amixer -D pulse sset Master 5%+ || pactl set-sink-volume @DEFAULT_SINK@ +5%`);
          break;
        case 'VOL_DOWN':
          exec(`amixer -D pulse sset Master 5%- || pactl set-sink-volume @DEFAULT_SINK@ -5%`);
          break;
        case 'MUTE':
          exec(`amixer -D pulse sset Master toggle || pactl set-sink-mute @DEFAULT_SINK@ toggle`);
          break;
      }
    }
  } catch (_) {}
}

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

function getNormalizedPlatform() {
  if (CURRENT_OS === 'win32') return 'windows';
  if (CURRENT_OS === 'darwin') return 'macos';
  return 'linux';
}

const server = http.createServer((req, res) => {
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

  // Universal Receiver Health & Capabilities API
  if (pathname === '/status' || pathname === '/health' || pathname === '/capabilities') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: 'READY',
        protocol: 'UCP-1.0',
        host: os.hostname(),
        platform: getNormalizedPlatform(),
        osName: `${os.type()} ${os.release()}`,
        arch: os.arch(),
        deviceType: os.type().toLowerCase().includes('windows') ? 'laptop' : 'desktop',
        ip: primaryIp,
        interfaces: networkList,
        port: PORT,
        clients: wss ? wss.clients.size : 0,
        timestamp: Date.now(),
      })
    );
    return;
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
  <title>GlyphPad Universal Receiver</title>
  <style>
    body { background: #08090a; color: #fff; font-family: monospace; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
    .card { background: #121417; border: 1px solid rgba(255,255,255,0.15); border-radius: 24px; padding: 32px; max-width: 90%; }
    .btn { display: inline-block; background: #eb0029; color: #fff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <h2 style="color:#00e575">● GLYPHPAD RECEIVER RUNNING</h2>
    <p>Host: <strong>${os.hostname()}</strong> (${getNormalizedPlatform().toUpperCase()})</p>
    <p>Local IP: <strong>${primaryIp}:${PORT}</strong></p>
    <a class="btn" href="https://smart-controller.vercel.app">LAUNCH WEB CONTROLLER</a>
  </div>
</body>
</html>`);
});

// ==========================================
// WEBSOCKET PROTOCOL ENGINE (UCP v1.0)
// ==========================================
const wss = new WebSocketServer({ server, path: '/ucp' });

let clientCount = 0;

wss.on('connection', (ws, req) => {
  clientCount++;
  const clientIp = req.socket.remoteAddress;
  console.log(`[GlyphPad] Device connected from ${clientIp} (Total active: ${clientCount})`);

  // Send dynamic handshake with full machine profile
  ws.send(
    JSON.stringify({
      type: 'SESSION_ACK',
      payload: {
        status: 'AUTHENTICATED',
        host: os.hostname(),
        platform: getNormalizedPlatform(),
        osName: `${os.type()} ${os.release()}`,
        arch: os.arch(),
        ip: primaryIp,
        interfaces: networkList,
        version: '1.0.0',
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
    console.log(`[GlyphPad] Device disconnected. (Remaining: ${clientCount})`);
  });
});

// Handle Server Errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[GlyphPad ERROR] Port ${PORT} is already in use by another instance or application.`);
    console.error(`Run start-receiver.bat to auto-close stale instances, or close any existing terminal.\n`);
    process.exit(1);
  } else {
    console.error('[GlyphPad ERROR]', err);
  }
});

// Start Server
server.listen(PORT, '0.0.0.0', () => {
  console.clear();
  console.log('================================================================');
  console.log('            GLYPHPAD UNIVERSAL COMPANION RECEIVER               ');
  console.log('           Connect Any Mobile Phone to Any Computer             ');
  console.log('================================================================');
  console.log(` Host Name   : ${os.hostname()}`);
  console.log(` OS Platform : ${getNormalizedPlatform().toUpperCase()} (${os.type()} ${os.release()})`);
  console.log(` Status      : ACTIVE & LISTENING`);
  console.log('----------------------------------------------------------------');
  console.log(' 🌐 AVAILABLE NETWORK ADDRESSES:');
  networkList.forEach((iface) => {
    console.log(`    👉 http://${iface.address}:${PORT}  [${iface.name}]`);
  });
  console.log('----------------------------------------------------------------');
  console.log(' 📱 HOW TO CONNECT ANY SMARTPHONE:');
  console.log(' 1. Connect phone to the same Wi-Fi network.');
  console.log(` 2. On your phone browser, open any of the above URLs.`);
  console.log(' 3. The phone loads GlyphPad directly and connects immediately!');
  console.log('================================================================\n');
});

process.on('SIGINT', () => {
  sendNativeCommand('RELEASE_ALL');
  if (winInjector) winInjector.kill();
  process.exit();
});
