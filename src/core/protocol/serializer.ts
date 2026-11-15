/**
 * Universal Control Protocol Serializer & Packet Validator
 */
import { UCPEnvelope, UCPMessageType } from './types';

let sequenceCounter = 0;

export function getNextSequence(): number {
  return ++sequenceCounter;
}

export function resetSequence(): void {
  sequenceCounter = 0;
}

export function createUCPEnvelope<T>(
  type: UCPMessageType,
  sessionId: string,
  payload: T,
  requestId?: string
): UCPEnvelope<T> {
  return {
    version: "1.0",
    type,
    sessionId,
    sequence: getNextSequence(),
    requestId,
    timestamp: Date.now(),
    payload,
  };
}

export function serializePacket<T>(envelope: UCPEnvelope<T>): string {
  return JSON.stringify(envelope);
}

export function parseAndValidatePacket(raw: string): UCPEnvelope | null {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== "1.0" || !parsed.type || typeof parsed.sequence !== "number") {
      console.warn("Invalid UCP packet discarded:", raw);
      return null;
    }
    return parsed as UCPEnvelope;
  } catch (err) {
    console.error("UCP deserialization error:", err);
    return null;
  }
}
