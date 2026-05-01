import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SecurityManager } from './SecurityManager';
import { SessionGuard } from './SessionGuard';
import { InputValidator } from './InputValidator';
import { RateLimiter } from './RateLimiter';

// Mocking dependencies that SecurityManager uses
vi.mock('./SessionGuard', () => ({
  SessionGuard: {
    initialize: vi.fn().mockResolvedValue(undefined),
    onLock: vi.fn(),
    validateSession: vi.fn().mockResolvedValue(true),
    getSession: vi.fn().mockReturnValue({ isValid: true }),
  }
}));

vi.mock('./RateLimiter', () => ({
  RateLimiter: {
    checkPreset: vi.fn().mockReturnValue({ allowed: true, retryAfterMs: 0 }),
    getAnalytics: vi.fn().mockReturnValue({ blockRate: 0 }),
  }
}));

vi.mock('./InputValidator', () => ({
  InputValidator: {
    validate: vi.fn().mockReturnValue({ isValid: true, sanitized: 'clean', threats: [] }),
    getThreatStats: vi.fn().mockReturnValue({ total: 0, bySeverity: { critical: 0 } }),
  }
}));

describe('SecurityManager', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Re-apply default successful returns
    vi.mocked(SessionGuard.initialize).mockResolvedValue(undefined);
    vi.mocked(SessionGuard.validateSession).mockResolvedValue(true);
    vi.mocked(SessionGuard.getSession).mockReturnValue({ isValid: true, sessionId: 'test', startTime: 0, lastActivity: 0, deviceFingerprint: 'test', ipHash: 'test' } as any);
    vi.mocked(RateLimiter.checkPreset).mockReturnValue({ allowed: true, retryAfterMs: 0 });
    vi.mocked(RateLimiter.getAnalytics).mockReturnValue({ blockRate: 0 });
    vi.mocked(InputValidator.validate).mockReturnValue({ isValid: true, sanitized: 'clean', threats: [] });
    vi.mocked(InputValidator.getThreatStats).mockReturnValue({ total: 0, bySeverity: { critical: 0 } });
  });

  it('should initialize correctly', async () => {
    await SecurityManager.initialize();
    expect(SessionGuard.initialize).toHaveBeenCalled();
  });

  it('should validate input and log events', () => {
    const result = SecurityManager.validateInput('test input');
    expect(InputValidator.validate).toHaveBeenCalledWith('test input', 'chat');
    expect(result.isValid).toBe(true);
    
    const events = SecurityManager.getEvents();
    expect(events.some(e => e.type === 'input_clean')).toBe(true);
  });

  it('should handle rate limited input', () => {
    // Override mock for this test
    vi.mocked(RateLimiter.checkPreset).mockReturnValue({ allowed: false, retryAfterMs: 5000 });
    
    const result = SecurityManager.validateInput('spam');
    expect(result.isValid).toBe(false);
    
    const events = SecurityManager.getEvents();
    expect(events.some(e => e.type === 'rate_limited')).toBe(true);
  });

  it('should secure API calls', async () => {
    const result = await SecurityManager.secureApiCall('/test-endpoint');
    expect(SessionGuard.validateSession).toHaveBeenCalled();
    expect(RateLimiter.checkPreset).toHaveBeenCalled();
    expect(result.allowed).toBe(true);
  });

  it('should report correct status', () => {
    const status = SecurityManager.getStatus();
    expect(status.overallHealth).toBe('healthy');
    expect(status.sessionActive).toBe(true);
  });
});
