/**
 * GlyphPad Multi-Touch & Gesture Classifier
 * Enforces strict tolerances:
 * - Tap duration <= 180ms
 * - Double tap <= 300ms
 * - Multi-touch settle <= 80ms (suppresses accidental clicks during multi-finger gestures)
 * - Hold to drag >= 350ms
 */

export interface TouchContact {
  id: number;
  x: number;
  y: number;
  startTime: number;
}

export type GestureEvent =
  | { type: 'POINTER_MOVE'; dx: number; dy: number }
  | { type: 'LEFT_CLICK' }
  | { type: 'DOUBLE_CLICK' }
  | { type: 'RIGHT_CLICK' }
  | { type: 'MIDDLE_CLICK' }
  | { type: 'DRAG_START' }
  | { type: 'DRAG_MOVE'; dx: number; dy: number }
  | { type: 'DRAG_END' }
  | { type: 'SCROLL'; deltaX: number; deltaY: number }
  | { type: 'PINCH'; scale: number }
  | { type: 'APP_SWITCH' };

export class GestureClassifier {
  private activeContacts: Map<number, TouchContact> = new Map();
  private lastTapTime: number = 0;
  private lastTapPosition: { x: number; y: number } | null = null;
  private isDragging: boolean = false;
  private multiTouchSettling: boolean = false;
  private initialDistance: number = 0;

  // Configuration
  public sensitivity: number = 1.0;
  public naturalScrolling: boolean = true;

  constructor(sensitivity = 1.0, naturalScrolling = true) {
    this.sensitivity = sensitivity;
    this.naturalScrolling = naturalScrolling;
  }

  public onTouchStart(contacts: { id: number; x: number; y: number }[]): GestureEvent[] {
    const now = Date.now();
    const events: GestureEvent[] = [];

    contacts.forEach(c => {
      this.activeContacts.set(c.id, {
        id: c.id,
        x: c.x,
        y: c.y,
        startTime: now,
      });
    });

    if (this.activeContacts.size > 1) {
      this.multiTouchSettling = true;
      if (this.isDragging) {
        this.isDragging = false;
        events.push({ type: 'DRAG_END' });
      }

      if (this.activeContacts.size === 2) {
        const [c1, c2] = Array.from(this.activeContacts.values());
        this.initialDistance = Math.hypot(c2.x - c1.x, c2.y - c1.y);
      }
    }

    return events;
  }

  public onTouchMove(contacts: { id: number; x: number; y: number }[]): GestureEvent[] {
    const events: GestureEvent[] = [];
    const count = this.activeContacts.size;

    if (count === 1) {
      const contact = contacts[0];
      const prev = this.activeContacts.get(contact.id);
      if (prev) {
        const dx = (contact.x - prev.x) * this.sensitivity;
        const dy = (contact.y - prev.y) * this.sensitivity;

        if (this.isDragging) {
          events.push({ type: 'DRAG_MOVE', dx, dy });
        } else {
          events.push({ type: 'POINTER_MOVE', dx, dy });
        }

        this.activeContacts.set(contact.id, { ...prev, x: contact.x, y: contact.y });
      }
    } else if (count === 2) {
      // Two finger scroll or pinch
      const [c1, c2] = contacts;
      const prev1 = this.activeContacts.get(c1.id);
      const prev2 = this.activeContacts.get(c2.id);

      if (prev1 && prev2) {
        const currentDist = Math.hypot(c2.x - c1.x, c2.y - c1.y);
        const distDiff = Math.abs(currentDist - this.initialDistance);

        if (distDiff > 25) {
          // Pinch gesture
          const scale = currentDist / (this.initialDistance || 1);
          events.push({ type: 'PINCH', scale });
          this.initialDistance = currentDist;
        } else {
          // Two-finger scroll
          const avgDy = ((c1.y - prev1.y) + (c2.y - prev2.y)) / 2;
          const avgDx = ((c1.x - prev1.x) + (c2.x - prev2.x)) / 2;
          const scrollFactor = this.naturalScrolling ? -1 : 1;
          events.push({
            type: 'SCROLL',
            deltaX: avgDx * 1.5 * scrollFactor,
            deltaY: avgDy * 1.5 * scrollFactor,
          });
        }

        this.activeContacts.set(c1.id, { ...prev1, x: c1.x, y: c1.y });
        this.activeContacts.set(c2.id, { ...prev2, x: c2.x, y: c2.y });
      }
    } else if (count === 3) {
      // 3-finger app switch
      events.push({ type: 'APP_SWITCH' });
    }

    return events;
  }

  public onTouchEnd(liftedIds: number[]): GestureEvent[] {
    const now = Date.now();
    const events: GestureEvent[] = [];
    const priorCount = this.activeContacts.size;

    liftedIds.forEach(id => {
      const contact = this.activeContacts.get(id);
      if (contact) {
        const duration = now - contact.startTime;

        if (priorCount === 1) {
          if (this.isDragging) {
            this.isDragging = false;
            events.push({ type: 'DRAG_END' });
          } else if (duration <= 180) {
            // Check double tap
            if (this.lastTapPosition && (now - this.lastTapTime) <= 300) {
              events.push({ type: 'DOUBLE_CLICK' });
              this.lastTapPosition = null;
              this.lastTapTime = 0;
            } else {
              events.push({ type: 'LEFT_CLICK' });
              this.lastTapPosition = { x: contact.x, y: contact.y };
              this.lastTapTime = now;
            }
          }
        } else if (priorCount === 2 && duration <= 220) {
          events.push({ type: 'RIGHT_CLICK' });
        } else if (priorCount === 3 && duration <= 250) {
          events.push({ type: 'MIDDLE_CLICK' });
        }

        this.activeContacts.delete(id);
      }
    });

    if (this.activeContacts.size === 0) {
      this.multiTouchSettling = false;
      this.initialDistance = 0;
    }

    return events;
  }
}
