/**
 * UNIVERSAL CONTROL PROTOCOL (UCP) v1.0
 * Core Type Definitions & Protocol Contracts
 */

export type UCPVersion = "1.0";

export type UCPMessageType =
  | "DISCOVERY"
  | "PAIR_REQUEST"
  | "PAIR_APPROVE"
  | "PAIR_REJECT"
  | "SESSION_HELLO"
  | "SESSION_READY"
  | "POINTER_MOVE"
  | "BUTTON_STATE"
  | "SCROLL"
  | "KEY_CHORD"
  | "ACTION_REQUEST"
  | "ACTION_RESULT"
  | "HEARTBEAT"
  | "RELEASE_ALL"
  | "DISCONNECT";

export type ConnectionState =
  | "UNPAIRED"
  | "DISCOVERING"
  | "DEVICE_FOUND"
  | "PAIRING"
  | "PAIRED"
  | "CONNECTING"
  | "CONNECTED"
  | "DEGRADED"
  | "RECONNECTING"
  | "DISCONNECTED"
  | "FAILED"
  | "REVOKED";

export type MouseButton = "LEFT" | "RIGHT" | "MIDDLE";
export type ButtonAction = "DOWN" | "UP" | "CLICK" | "DOUBLE_CLICK";

export type SystemActionId =
  | "ACTION_SETTINGS"
  | "ACTION_FILE_EXPLORER"
  | "ACTION_SEARCH"
  | "ACTION_TASK_MANAGER"
  | "ACTION_SHOW_DESKTOP"
  | "ACTION_LOCK_PC"
  | "ACTION_VOLUME_UP"
  | "ACTION_VOLUME_DOWN"
  | "ACTION_MUTE_TOGGLE"
  | "ACTION_MEDIA_PLAY_PAUSE"
  | "ACTION_MEDIA_NEXT"
  | "ACTION_MEDIA_PREV"
  | "ACTION_SCREENSHOT"
  | "ACTION_SLEEP"
  | "ACTION_SHUTDOWN"
  | "ACTION_RESTART";

export interface UCPEnvelope<T = unknown> {
  version: UCPVersion;
  type: UCPMessageType;
  sessionId: string;
  sequence: number;
  requestId?: string;
  timestamp: number;
  payload: T;
}

export interface PointerMovePayload {
  dx: number;
  dy: number;
  pressure?: number;
  isTouch?: boolean;
}

export interface ButtonStatePayload {
  button: MouseButton;
  action: ButtonAction;
}

export interface ScrollPayload {
  deltaX: number;
  deltaY: number;
  isSmooth?: boolean;
}

export interface KeyChordPayload {
  keys: string[];
  isDown: boolean;
}

export interface ActionRequestPayload {
  actionId: SystemActionId;
  confirmed?: boolean;
}

export interface ActionResultPayload {
  actionId: SystemActionId;
  status: "EXECUTED" | "DENIED" | "UNSUPPORTED" | "FAILED";
  message?: string;
}

export interface HeartbeatPayload {
  clientTimestamp: number;
  serverTimestamp?: number;
  roundTripMs?: number;
}

export interface DeviceInfo {
  id: string;
  name: string;
  platform: "android" | "ios" | "windows" | "macos" | "linux" | "chromeos";
  ipAddress: string;
  port: number;
  protocolVersion: UCPVersion;
  pairingApproved: boolean;
  capabilities: {
    mouse: boolean;
    keyboard: boolean;
    media: boolean;
    power: boolean;
    bluetoothHid: boolean;
  };
}
