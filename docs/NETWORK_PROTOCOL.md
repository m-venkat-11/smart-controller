# UNIVERSAL CONTROL PROTOCOL (UCP) SPECIFICATION
## Version 1.0 — SmartController: GlyphPad

### 1. Protocol Architecture Overview

The Universal Control Protocol (UCP) is a lightweight, low-overhead, bidirectional binary/JSON envelope designed for low-latency wireless mouse, keyboard, and action streaming over WebSocket/TLS.

### 2. Message Envelope Specification

Every control packet adheres to the following structured contract:

```typescript
export interface UCPEnvelope<T = unknown> {
  version: "1.0";               // Protocol major.minor version
  type: UCPMessageType;         // Enumerated packet type
  sessionId: string;            // Cryptographically random active session token
  sequence: number;             // Monotonically increasing sequence number
  requestId?: string;           // Optional idempotency UUID for discrete actions
  timestamp: number;            // Unix epoch in milliseconds
  payload: T;                   // Strongly typed payload
}
```

### 3. Message Types

| Type | Direction | Purpose | Priority |
| :--- | :--- | :--- | :--- |
| `DISCOVERY` | Broadcast / Multicast | Receiver advertises presence and host capabilities | High |
| `PAIR_REQUEST` | Mobile → PC | Mobile requests pairing approval with public key & name | Critical |
| `PAIR_APPROVE` | PC → Mobile | Host approves pairing and establishes trust token | Critical |
| `SESSION_HELLO` | Mobile → PC | Authenticated session initiation with negotiated cipher | Critical |
| `SESSION_READY` | PC → Mobile | Host confirms readiness and advertises input endpoints | Critical |
| `POINTER_MOVE` | Mobile → PC | Relative dx/dy delta with velocity scaling | Real-time |
| `BUTTON_STATE` | Mobile → PC | Primary/secondary/middle mouse button down/up | Real-time |
| `SCROLL` | Mobile → PC | Vertical and horizontal wheel scroll deltas | Real-time |
| `KEY_CHORD` | Mobile → PC | Allowlisted virtual key combinations & shortcuts | Real-time |
| `ACTION_REQUEST` | Mobile → PC | Pre-approved system action (media, app, lock, power) | High |
| `ACTION_RESULT` | PC → Mobile | Execution outcome (`SUCCESS`, `DENIED`, `UNSUPPORTED`) | Normal |
| `HEARTBEAT` | Both | Round-trip latency measurement and liveness probe | Periodic (1s) |
| `RELEASE_ALL` | Both | Failsafe: immediately releases all held keys & buttons | Critical |
| `DISCONNECT` | Either | Clean session termination | Normal |

### 4. Input Coalescing and Watchdog Rules

1. **Pointer Coalescing:** High-frequency touch moves (up to 120Hz) are queued and coalesced if the network buffer experiences backpressure. Stale positions are superseded by fresh deltas.
2. **Watchdog Timeout:** If no valid heartbeat or message is received for 3000ms, the receiver automatically issues an internal `RELEASE_ALL` to prevent stuck mouse buttons or modifier keys.
3. **Replay & Sequence Protection:** Sequence numbers must increase monotonically; out-of-order or duplicate discrete actions are dropped.
