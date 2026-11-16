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

// Minimal, high-performance touch controller HTML served directly to mobile phones
const mobileHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>GlyphPad — Mobile Surface</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; touch-action: none; -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; }
    body { background: #08090a; color: #f5f6f8; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
    header { padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.08); background: #111315; }
    .logo { font-family: monospace; font-weight: bold; letter-spacing: 2px; font-size: 14px; display: flex; align-items: center; gap: 8px; }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #eb0029; }
    .status { font-size: 11px; font-family: monospace; padding: 4px 8px; border-radius: 12px; background: rgba(0,229,117,0.15); color: #00e575; border: 1px solid rgba(0,229,117,0.3); }
    #touchpad { flex: 1; margin: 12px; border-radius: 24px; background: radial-gradient(rgba(255,255,255,0.08) 1.2px, transparent 1.2px), rgba(20,23,26,0.8); background-size: 16px 16px; border: 1px solid rgba(255,255,255,0.12); display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; }
    .hint { font-family: monospace; font-size: 11px; color: #747b77; text-align: center; pointer-events: none; }
    .controls { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 12px 12px; }
    .btn { background: #1c2024; border: 1px solid rgba(255,255,255,0.1); color: #fff; font-family: monospace; font-weight: bold; font-size: 13px; padding: 16px; border-radius: 16px; text-align: center; }
    .btn:active { background: #eb0029; }
    .actions { display: flex; gap: 8px; overflow-x: auto; padding: 0 12px 12px; }
    .action-chip { background: #14171a; border: 1px solid rgba(255,255,255,0.08); color: #9da3af; font-family: monospace; font-size: 10px; padding: 8px 12px; border-radius: 12px; white-space: nowrap; }
    .action-chip:active { background: #fff; color: #000; }
  </style>
</head>
<body>
  <header>
    <div class="logo"><div class="dot"></div>GLYPHPAD</div>
    <div id="status" class="status">CONNECTING...</div>
  </header>

  <div class="actions">
    <div class="action-chip" onclick="sendAction('SHOW_DESKTOP')">WIN+D (DESKTOP)</div>
    <div class="action-chip" onclick="sendAction('TASK_MANAGER')">TASK MANAGER</div>
    <div class="action-chip" onclick="sendAction('VOL_UP')">VOL +</div>
    <div class="action-chip" onclick="sendAction('VOL_DOWN')">VOL -</div>
    <div class="action-chip" onclick="sendAction('MUTE')">MUTE</div>
    <div class="action-chip" onclick="sendAction('LOCK_PC')">LOCK PC</div>
  </div>

  <div id="touchpad">
    <div class="hint">
      <strong>GLYPHPAD TOUCH SURFACE</strong><br><br>
      • 1-Finger Drag: Move Cursor<br>
      • 1-Finger Tap: Left Click<br>
      • 2-Finger Tap: Right Click<br>
      • 2-Finger Drag: Scroll
    </div>
  </div>

  <div class="controls">
    <button class="btn" id="btn-left">LEFT CLICK</button>
    <button class="btn" id="btn-right">RIGHT CLICK</button>
  </div>

  <script>
    const statusEl = document.getElementById('status');
    const pad = document.getElementById('touchpad');
    const wsUrl = 'ws://' + window.location.host + '/ucp';
    let ws = null;
    let lastX = 0, lastY = 0;
    let isTouching = false;
    let touchCount = 0;
    let touchStartTime = 0;
    let lastTapTime = 0;

    function connect() {
      ws = new WebSocket(wsUrl);
      ws.onopen = () => {
        statusEl.textContent = 'CONNECTED';
        statusEl.style.color = '#00e575';
        statusEl.style.borderColor = 'rgba(0,229,117,0.3)';
        statusEl.style.background = 'rgba(0,229,117,0.15)';
      };
      ws.onclose = () => {
        statusEl.textContent = 'RECONNECTING...';
        statusEl.style.color = '#eb0029';
        statusEl.style.borderColor = 'rgba(235,0,41,0.3)';
        statusEl.style.background = 'rgba(235,0,41,0.15)';
        setTimeout(connect, 1500);
      };
    }
    connect();

    function send(type, payload) {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type, payload }));
      }
    }

    function sendAction(action) {
      send('ACTION', { action });
      if (navigator.vibrate) navigator.vibrate(20);
    }

    pad.addEventListener('touchstart', (e) => {
      e.preventDefault();
      isTouching = true;
      touchCount = e.touches.length;
      touchStartTime = Date.now();
      if (e.touches.length > 0) {
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
      }
    });

    pad.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!isTouching) return;
      if (e.touches.length === 1) {
        const dx = (e.touches[0].clientX - lastX) * 1.6;
        const dy = (e.touches[0].clientY - lastY) * 1.6;
        send('MOVE', { dx: Math.round(dx), dy: Math.round(dy) });
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        const dy = e.touches[0].clientY - lastY;
        send('SCROLL', { delta: Math.round(-dy * 3) });
        lastY = e.touches[0].clientY;
      }
    });

    pad.addEventListener('touchend', (e) => {
      e.preventDefault();
      const duration = Date.now() - touchStartTime;
      if (duration < 180 && touchCount === 1) {
        const now = Date.now();
        if (now - lastTapTime < 300) {
          send('DOUBLE_CLICK', {});
          lastTapTime = 0;
        } else {
          send('CLICK', { button: 'LEFT' });
          lastTapTime = now;
        }
        if (navigator.vibrate) navigator.vibrate(15);
      } else if (duration < 220 && touchCount === 2) {
        send('CLICK', { button: 'RIGHT' });
        if (navigator.vibrate) navigator.vibrate(25);
      }
      if (e.touches.length === 0) {
        isTouching = false;
        touchCount = 0;
      }
    });

    // Explicit buttons
    document.getElementById('btn-left').addEventListener('click', () => {
      send('CLICK', { button: 'LEFT' });
      if (navigator.vibrate) navigator.vibrate(15);
    });
    document.getElementById('btn-right').addEventListener('click', () => {
      send('CLICK', { button: 'RIGHT' });
      if (navigator.vibrate) navigator.vibrate(25);
    });
  </script>
</body>
</html>`;

// Create HTTP Server
const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/controller') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(mobileHtml);
  } else if (req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'READY', host: os.hostname(), ip: localIp, port: PORT }));
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
  console.log(`[GlyphPad] Phone connected from ${clientIp} (Active: ${clientCount})`);

  let watchdogTimer = setInterval(() => {
    // Heartbeat check
  }, 2000);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      const type = data.type;
      const payload = data.payload || {};

      switch (type) {
        case 'MOVE':
        case 'POINTER_MOVE':
          sendCommand(`M ${payload.dx || 0} ${payload.dy || 0}`);
          break;

        case 'CLICK':
        case 'BUTTON_STATE':
          if (payload.button === 'RIGHT') {
            sendCommand('RC');
          } else {
            sendCommand('LC');
          }
          break;

        case 'DOUBLE_CLICK':
          sendCommand('LDC');
          break;

        case 'SCROLL':
          sendCommand(`S ${payload.delta || payload.deltaY || 0}`);
          break;

        case 'ACTION':
        case 'ACTION_REQUEST':
          sendCommand(`ACTION ${payload.action || payload.actionId || ''}`);
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
    clearInterval(watchdogTimer);
    sendCommand('RELEASE_ALL');
    console.log(`[GlyphPad] Phone disconnected. (Active: ${clientCount})`);
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
  console.log(' HOW TO CONNECT YOUR PHONE:');
  console.log(` 1. Connect phone to the same Wi-Fi as your PC.`);
  console.log(` 2. On your phone browser, open:`);
  console.log(`    👉 http://${localIp}:${PORT}`);
  console.log(' 3. Your phone touchscreen will immediately control this PC!');
  console.log('================================================================\n');
});

process.on('SIGINT', () => {
  sendCommand('RELEASE_ALL');
  injector.kill();
  process.exit();
});
