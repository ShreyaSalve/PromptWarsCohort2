/**
 * SessionGuard — Session fingerprinting, idle timeout, and tamper detection.
 */

import { CryptoUtils } from './CryptoUtils';

export interface SessionInfo {
  id: string;
  fingerprint: string;
  createdAt: number;
  lastActivity: number;
  isValid: boolean;
  securityLevel: 'normal' | 'elevated' | 'locked';
  anomalyCount: number;
}

export class SessionGuard {
  private static session: SessionInfo | null = null;
  private static idleTimeoutMs = 15 * 60 * 1000; // 15 minutes
  private static idleTimer: ReturnType<typeof setTimeout> | null = null;
  private static onLockCallbacks: Array<() => void> = [];
  private static anomalyLog: Array<{ type: string; timestamp: number; detail: string }> = [];

  static async initialize(): Promise<SessionInfo> {
    const fingerprint = await CryptoUtils.generateDeviceFingerprint();
    const id = CryptoUtils.generateSessionId();

    this.session = {
      id,
      fingerprint,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      isValid: true,
      securityLevel: 'normal',
      anomalyCount: 0,
    };

    // Store fingerprint for tamper detection
    try {
      sessionStorage.setItem('_electra_fp', fingerprint);
      sessionStorage.setItem('_electra_sid', id);
    } catch { /* private browsing */ }

    this.startIdleTimer();
    this.setupActivityListeners();

    return this.session;
  }

  static async validateSession(): Promise<boolean> {
    if (!this.session) return false;

    const currentFp = await CryptoUtils.generateDeviceFingerprint();
    if (currentFp !== this.session.fingerprint) {
      this.logAnomaly('fingerprint_mismatch', 'Device fingerprint changed mid-session');
      this.session.anomalyCount++;
      if (this.session.anomalyCount >= 3) {
        this.lockSession('Too many fingerprint anomalies');
        return false;
      }
    }

    // Check idle timeout
    if (Date.now() - this.session.lastActivity > this.idleTimeoutMs) {
      this.lockSession('Session idle timeout');
      return false;
    }

    // Check stored session integrity
    try {
      const storedSid = sessionStorage.getItem('_electra_sid');
      if (storedSid && storedSid !== this.session.id) {
        this.logAnomaly('session_hijack', 'Session ID mismatch detected');
        this.lockSession('Session integrity violation');
        return false;
      }
    } catch { /* private browsing */ }

    return this.session.isValid;
  }

  static recordActivity(): void {
    if (this.session) {
      this.session.lastActivity = Date.now();
      this.resetIdleTimer();
    }
  }

  static getSession(): SessionInfo | null {
    return this.session ? { ...this.session } : null;
  }

  static onLock(callback: () => void): void {
    this.onLockCallbacks.push(callback);
  }

  static getAnomalyLog() { return [...this.anomalyLog]; }

  static getSessionAge(): number {
    return this.session ? Date.now() - this.session.createdAt : 0;
  }

  static getIdleTime(): number {
    return this.session ? Date.now() - this.session.lastActivity : 0;
  }

  static unlockSession(): void {
    if (this.session) {
      this.session.isValid = true;
      this.session.securityLevel = 'normal';
      this.session.lastActivity = Date.now();
      this.startIdleTimer();
    }
  }

  private static lockSession(reason: string): void {
    if (this.session) {
      this.session.isValid = false;
      this.session.securityLevel = 'locked';
      this.logAnomaly('session_locked', reason);
    }
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.onLockCallbacks.forEach(cb => { try { cb(); } catch {} });
  }

  private static logAnomaly(type: string, detail: string): void {
    this.anomalyLog.push({ type, timestamp: Date.now(), detail });
    if (this.anomalyLog.length > 200) this.anomalyLog = this.anomalyLog.slice(-200);
  }

  private static startIdleTimer(): void {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => this.lockSession('Idle timeout'), this.idleTimeoutMs);
  }

  private static resetIdleTimer(): void {
    this.startIdleTimer();
  }

  private static setupActivityListeners(): void {
    const handler = () => this.recordActivity();
    ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(evt =>
      document.addEventListener(evt, handler, { passive: true })
    );
  }
}
