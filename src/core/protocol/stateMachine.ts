/**
 * GlyphPad Connection State Machine
 */
import { ConnectionState } from './types';

export class ConnectionStateMachine {
  private currentState: ConnectionState = 'DISCONNECTED';
  private listeners: ((state: ConnectionState) => void)[] = [];

  constructor(initialState: ConnectionState = 'DISCONNECTED') {
    this.currentState = initialState;
  }

  public getState(): ConnectionState {
    return this.currentState;
  }

  public subscribe(listener: (state: ConnectionState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public transition(nextState: ConnectionState, reason?: string): boolean {
    if (this.currentState === nextState) return true;

    // Validate valid transitions
    const valid = this.isValidTransition(this.currentState, nextState);
    if (!valid) {
      console.warn(`[State Machine] Illegal transition attempted: ${this.currentState} -> ${nextState}`);
      return false;
    }

    const prev = this.currentState;
    this.currentState = nextState;
    console.log(`[State Machine] Transition: ${prev} -> ${nextState} ${reason ? `(${reason})` : ''}`);

    this.listeners.forEach(fn => fn(this.currentState));
    return true;
  }

  private isValidTransition(from: ConnectionState, to: ConnectionState): boolean {
    // Failsafe transitions allowed from anywhere
    if (to === 'DISCONNECTED' || to === 'FAILED' || to === 'REVOKED') return true;

    const allowedTransitions: Record<ConnectionState, ConnectionState[]> = {
      UNPAIRED: ['DISCOVERING', 'PAIRING', 'DISCONNECTED', 'FAILED', 'REVOKED'],
      DISCOVERING: ['DEVICE_FOUND', 'DISCONNECTED', 'FAILED', 'REVOKED'],
      DEVICE_FOUND: ['PAIRING', 'CONNECTING', 'DISCOVERING', 'DISCONNECTED', 'FAILED', 'REVOKED'],
      PAIRING: ['PAIRED', 'FAILED', 'DISCONNECTED', 'REVOKED'],
      PAIRED: ['CONNECTING', 'DISCONNECTED', 'FAILED', 'REVOKED'],
      CONNECTING: ['CONNECTED', 'FAILED', 'RECONNECTING', 'DISCONNECTED', 'REVOKED'],
      CONNECTED: ['DEGRADED', 'DISCONNECTED', 'RECONNECTING', 'FAILED', 'REVOKED'],
      DEGRADED: ['CONNECTED', 'DISCONNECTED', 'RECONNECTING', 'FAILED', 'REVOKED'],
      RECONNECTING: ['CONNECTING', 'CONNECTED', 'DISCONNECTED', 'FAILED', 'REVOKED'],
      DISCONNECTED: ['DISCOVERING', 'CONNECTING', 'UNPAIRED', 'PAIRING', 'FAILED', 'REVOKED'],
      FAILED: ['DISCOVERING', 'PAIRING', 'DISCONNECTED', 'REVOKED'],
      REVOKED: ['DISCOVERING', 'PAIRING', 'DISCONNECTED', 'FAILED'],
    };

    return allowedTransitions[from]?.includes(to) ?? false;
  }
}
