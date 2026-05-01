/**
 * SecurityManager — Central orchestrator for the ELECTRA security system.
 * Coordinates all security modules and provides a unified API.
 */

import { InputValidator, type ValidationResult } from './InputValidator';
import { RateLimiter } from './RateLimiter';
import { SessionGuard, type SessionInfo } from './SessionGuard';
import { CryptoUtils } from './CryptoUtils';

export type SecurityEventType = 
  | 'session_init' | 'session_lock' | 'session_validated'
  | 'input_blocked' | 'input_sanitized' | 'input_clean'
  | 'rate_limited' | 'rate_ok'
  | 'api_call_secured' | 'threat_detected' | 'csp_violation';

export interface SecurityEvent {
  type: SecurityEventType;
  timestamp: number;
  detail: string;
  severity: 'info' | 'warn' | 'critical';
}

export interface SecurityStatus {
  overallHealth: 'healthy' | 'warning' | 'critical';
  sessionActive: boolean;
  threatCount: number;
  rateLimitStatus: string;
  uptime: number;
  events: SecurityEvent[];
}

class SecurityManagerClass {
  private events: SecurityEvent[] = [];
  private initialized = false;
  private initTime = 0;
  private listeners: Array<(event: SecurityEvent) => void> = [];

  async initialize(): Promise<void> {
    if (this.initialized) return;
    this.initTime = Date.now();

    // Initialize session
    await SessionGuard.initialize();
    this.logEvent('session_init', 'Security session initialized', 'info');

    // Set up session lock handler
    SessionGuard.onLock(() => {
      this.logEvent('session_lock', 'Session locked due to security event', 'critical');
    });

    // Set up CSP violation listener
    document.addEventListener('securitypolicyviolation', (e) => {
      this.logEvent('csp_violation', `CSP violation: ${e.violatedDirective} — ${e.blockedURI}`, 'critical');
    });

    this.initialized = true;
  }

  /**
   * Validate and secure user input before processing.
   */
  validateInput(input: string, context: 'chat' | 'search' | 'form' = 'chat'): ValidationResult {
    // Rate check for input
    const rateKey = context === 'chat' ? 'chat_messages' : 'search_queries';
    const rateResult = RateLimiter.checkPreset(`input_${context}`, rateKey);

    if (!rateResult.allowed) {
      this.logEvent('rate_limited', `Input rate limited (${context}): retry in ${Math.ceil(rateResult.retryAfterMs / 1000)}s`, 'warn');
      return {
        isValid: false,
        sanitized: '',
        threats: [{
          type: 'suspicious_pattern',
          severity: 'medium',
          description: `Rate limit exceeded. Try again in ${Math.ceil(rateResult.retryAfterMs / 1000)} seconds.`,
          matched: 'rate_limit',
          timestamp: Date.now(),
        }],
      };
    }

    const result = InputValidator.validate(input, context);

    if (result.threats.length > 0) {
      const hasCritical = result.threats.some(t => t.severity === 'critical');
      this.logEvent(
        hasCritical ? 'input_blocked' : 'input_sanitized',
        `${result.threats.length} threat(s) in ${context} input`,
        hasCritical ? 'critical' : 'warn'
      );
    } else {
      this.logEvent('input_clean', `Clean ${context} input processed`, 'info');
    }

    return result;
  }

  /**
   * Secure an API call with rate limiting and session validation.
   */
  async secureApiCall(endpoint: string): Promise<{ allowed: boolean; reason?: string }> {
    // Validate session
    const sessionValid = await SessionGuard.validateSession();
    if (!sessionValid) {
      this.logEvent('session_lock', 'API call blocked: invalid session', 'critical');
      return { allowed: false, reason: 'Session expired or invalid. Please refresh.' };
    }

    // Rate limit check
    const rateResult = RateLimiter.checkPreset(`api_${endpoint}`, 'gemini_api');
    if (!rateResult.allowed) {
      this.logEvent('rate_limited', `API rate limited: ${endpoint}`, 'warn');
      return { allowed: false, reason: `Rate limit exceeded. Try again in ${Math.ceil(rateResult.retryAfterMs / 1000)}s.` };
    }

    this.logEvent('api_call_secured', `Secured API call: ${endpoint}`, 'info');
    return { allowed: true };
  }

  /**
   * Get comprehensive security status.
   */
  getStatus(): SecurityStatus {
    const session = SessionGuard.getSession();
    const threatStats = InputValidator.getThreatStats();
    const rateAnalytics = RateLimiter.getAnalytics();

    let health: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (threatStats.total > 5 || rateAnalytics.blockRate > 10) health = 'warning';
    if (threatStats.bySeverity?.critical > 0 || !session?.isValid) health = 'critical';

    return {
      overallHealth: health,
      sessionActive: session?.isValid ?? false,
      threatCount: threatStats.total,
      rateLimitStatus: `${rateAnalytics.blockRate.toFixed(1)}% blocked`,
      uptime: Date.now() - this.initTime,
      events: this.events.slice(-50),
    };
  }

  /**
   * Subscribe to security events.
   */
  onEvent(listener: (event: SecurityEvent) => void): () => void {
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  getEvents(): SecurityEvent[] { return [...this.events]; }
  getSession(): SessionInfo | null { return SessionGuard.getSession(); }

  private logEvent(type: SecurityEventType, detail: string, severity: 'info' | 'warn' | 'critical'): void {
    const event: SecurityEvent = { type, timestamp: Date.now(), detail, severity };
    this.events.push(event);
    if (this.events.length > 200) this.events = this.events.slice(-200);
    this.listeners.forEach(l => { try { l(event); } catch (e) { /* ignore listener errors */ } });
  }
}

// Singleton export
export const SecurityManager = new SecurityManagerClass();
