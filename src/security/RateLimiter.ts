/**
 * RateLimiter — Sliding-window rate limiter for API calls.
 */

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blockDurationMs: number;
  name: string;
}

interface RateLimitEntry {
  timestamps: number[];
  blockedUntil: number | null;
  totalBlocks: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

export const RATE_LIMIT_PRESETS: Record<string, RateLimitConfig> = {
  gemini_api: { maxRequests: 10, windowMs: 60000, blockDurationMs: 120000, name: 'Gemini API' },
  chat_messages: { maxRequests: 20, windowMs: 60000, blockDurationMs: 60000, name: 'Chat' },
  search_queries: { maxRequests: 30, windowMs: 60000, blockDurationMs: 30000, name: 'Search' },
  global: { maxRequests: 100, windowMs: 60000, blockDurationMs: 60000, name: 'Global' },
};

export class RateLimiter {
  private static limiters = new Map<string, RateLimitEntry>();
  private static eventLog: Array<{ key: string; action: string; timestamp: number }> = [];

  static check(key: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now();
    let entry = this.limiters.get(key);
    if (!entry) {
      entry = { timestamps: [], blockedUntil: null, totalBlocks: 0 };
      this.limiters.set(key, entry);
    }

    if (entry.blockedUntil && now < entry.blockedUntil) {
      this.eventLog.push({ key, action: 'blocked', timestamp: now });
      return { allowed: false, remaining: 0, retryAfterMs: entry.blockedUntil - now };
    }
    if (entry.blockedUntil) entry.blockedUntil = null;

    entry.timestamps = entry.timestamps.filter(t => t > now - config.windowMs);

    if (entry.timestamps.length >= config.maxRequests) {
      const multiplier = Math.min(Math.pow(2, entry.totalBlocks), 16);
      entry.blockedUntil = now + config.blockDurationMs * multiplier;
      entry.totalBlocks++;
      this.eventLog.push({ key, action: 'rate_exceeded', timestamp: now });
      return { allowed: false, remaining: 0, retryAfterMs: entry.blockedUntil - now };
    }

    entry.timestamps.push(now);
    this.eventLog.push({ key, action: 'allowed', timestamp: now });
    if (this.eventLog.length > 500) this.eventLog = this.eventLog.slice(-500);
    return { allowed: true, remaining: config.maxRequests - entry.timestamps.length, retryAfterMs: 0 };
  }

  static checkPreset(key: string, preset: string): RateLimitResult {
    return this.check(key, RATE_LIMIT_PRESETS[preset] || RATE_LIMIT_PRESETS.global);
  }

  static getAnalytics() {
    const total = this.eventLog.length;
    const blocked = this.eventLog.filter(e => e.action !== 'allowed').length;
    return { totalRequests: total, totalBlocked: blocked, blockRate: total > 0 ? (blocked / total) * 100 : 0 };
  }

  static getEventLog() { return [...this.eventLog]; }
  static resetAll() { this.limiters.clear(); this.eventLog = []; }
}
