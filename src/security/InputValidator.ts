/**
 * InputValidator — XSS prevention, injection protection, and input sanitization.
 * All user-facing inputs should pass through this validator.
 */

/**
 * Result of an input validation process.
 */
export interface ValidationResult {
  /** Whether the input is considered safe. */
  isValid: boolean;
  /** The sanitized version of the input string. */
  sanitized: string;
  /** List of detected threats, if any. */
  threats: ThreatReport[];
}

/**
 * Detailed report for a detected security threat.
 */
export interface ThreatReport {
  type: 'xss' | 'sql_injection' | 'command_injection' | 'prompt_injection' | 'data_exfiltration' | 'suspicious_pattern';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  matched: string;
  timestamp: number;
}

// Patterns that indicate XSS attacks
const XSS_PATTERNS: RegExp[] = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /on\w+\s*=\s*["'][^"']*["']/gi,
  /javascript\s*:/gi,
  /data\s*:\s*text\/html/gi,
  /expression\s*\(/gi,
  /url\s*\(\s*["']?\s*javascript/gi,
  /<iframe[^>]*>/gi,
  /<object[^>]*>/gi,
  /<embed[^>]*>/gi,
  /<form[^>]*>/gi,
  /document\.(cookie|domain|write)/gi,
  /window\.(location|open|eval)/gi,
  /eval\s*\(/gi,
  /setTimeout\s*\(\s*["']/gi,
  /setInterval\s*\(\s*["']/gi,
  /\.innerHTML\s*=/gi,
  /\.outerHTML\s*=/gi,
  /import\s*\(/gi,
  /fetch\s*\(/gi,
  /XMLHttpRequest/gi,
];

// Patterns that indicate SQL injection
const SQL_INJECTION_PATTERNS: RegExp[] = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|EXECUTE)\b)/gi,
  /('|")\s*(OR|AND)\s*('|")/gi,
  /;\s*(DROP|DELETE|TRUNCATE|ALTER)/gi,
  /--\s*$/gm,
  /\/\*[\s\S]*?\*\//g,
  /\b(CHAR|CONCAT|0x[0-9a-f]+)\b/gi,
];

// Patterns that indicate command injection
const COMMAND_INJECTION_PATTERNS: RegExp[] = [
  /[;&|`$]\s*(cat|ls|rm|wget|curl|bash|sh|python|node|nc|ncat)/gi,
  /\$\(.*\)/g,
  /`[^`]*`/g,
  /\|\s*\w+/g,
  />\s*\/\w+/g,
];

// Patterns that indicate AI prompt injection
const PROMPT_INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions|prompts|rules)/gi,
  /you\s+are\s+now\s+(a|an|in)\s+/gi,
  /forget\s+(all\s+)?(your|the)\s+(rules|instructions|guidelines)/gi,
  /override\s+(system|safety)\s+(prompt|instructions)/gi,
  /act\s+as\s+(if\s+)?you\s+(are|were)\s+/gi,
  /jailbreak/gi,
  /DAN\s+mode/gi,
  /pretend\s+you\s+(are|have)\s+(no|unlimited)/gi,
  /bypass\s+(your|the)\s+(filter|safety|content)/gi,
  /system\s*:\s*/gi,
  /\[INST\]/gi,
  /\[\/INST\]/gi,
  /<<SYS>>/gi,
];

// Data exfiltration patterns
const DATA_EXFIL_PATTERNS: RegExp[] = [
  /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,  // Credit card
  /\b\d{12}\b/g,  // Aadhaar-like
  /\b[A-Z]{5}\d{4}[A-Z]\b/g,  // PAN card
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,  // Email (flagged as sensitive)
];

export class InputValidator {
  private static threatLog: ThreatReport[] = [];
  private static readonly MAX_INPUT_LENGTH = 2000;
  private static readonly MAX_THREAT_LOG = 500;

  /**
   * Validate and sanitize user input.
   */
  static validate(input: string, context: 'chat' | 'search' | 'form' = 'chat'): ValidationResult {
    const threats: ThreatReport[] = [];

    // Length check
    if (input.length > this.MAX_INPUT_LENGTH) {
      threats.push({
        type: 'suspicious_pattern',
        severity: 'medium',
        description: `Input exceeds maximum length (${input.length}/${this.MAX_INPUT_LENGTH})`,
        matched: `Length: ${input.length}`,
        timestamp: Date.now(),
      });
      input = input.slice(0, this.MAX_INPUT_LENGTH);
    }

    // XSS detection
    for (const pattern of XSS_PATTERNS) {
      const match = input.match(pattern);
      if (match) {
        threats.push({
          type: 'xss',
          severity: 'critical',
          description: `XSS pattern detected: ${pattern.source.slice(0, 40)}`,
          matched: match[0].slice(0, 50),
          timestamp: Date.now(),
        });
      }
    }

    // SQL injection detection
    for (const pattern of SQL_INJECTION_PATTERNS) {
      const match = input.match(pattern);
      if (match) {
        threats.push({
          type: 'sql_injection',
          severity: 'high',
          description: `SQL injection pattern detected`,
          matched: match[0].slice(0, 50),
          timestamp: Date.now(),
        });
      }
    }

    // Command injection detection
    for (const pattern of COMMAND_INJECTION_PATTERNS) {
      const match = input.match(pattern);
      if (match) {
        threats.push({
          type: 'command_injection',
          severity: 'critical',
          description: `Command injection pattern detected`,
          matched: match[0].slice(0, 50),
          timestamp: Date.now(),
        });
      }
    }

    // Prompt injection detection (especially important for AI chatbot)
    if (context === 'chat') {
      for (const pattern of PROMPT_INJECTION_PATTERNS) {
        const match = input.match(pattern);
        if (match) {
          threats.push({
            type: 'prompt_injection',
            severity: 'high',
            description: `AI prompt injection attempt detected`,
            matched: match[0].slice(0, 50),
            timestamp: Date.now(),
          });
        }
      }
    }

    // Data exfiltration detection
    for (const pattern of DATA_EXFIL_PATTERNS) {
      const match = input.match(pattern);
      if (match) {
        threats.push({
          type: 'data_exfiltration',
          severity: 'medium',
          description: `Sensitive data pattern detected in input`,
          matched: '***REDACTED***',
          timestamp: Date.now(),
        });
      }
    }

    // Sanitize the input
    const sanitized = this.sanitize(input);

    // Log threats
    this.threatLog.push(...threats);
    if (this.threatLog.length > this.MAX_THREAT_LOG) {
      this.threatLog = this.threatLog.slice(-this.MAX_THREAT_LOG);
    }

    return {
      isValid: threats.filter(t => t.severity === 'critical' || t.severity === 'high').length === 0,
      sanitized,
      threats,
    };
  }

  /**
   * Sanitize input by escaping dangerous characters.
   */
  static sanitize(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/\\/g, '&#x5C;');
  }

  /**
   * Decode sanitized input back to readable text (for display purposes only).
   */
  static decode(input: string): string {
    return input
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/')
      .replace(/&#x5C;/g, '\\');
  }

  /**
   * Get all recorded threats.
   */
  static getThreatLog(): ThreatReport[] {
    return [...this.threatLog];
  }

  /**
   * Get threat statistics.
   */
  static getThreatStats(): {
    total: number;
    bySeverity: Record<string, number>;
    byType: Record<string, number>;
    last24h: number;
  } {
    const now = Date.now();
    const dayAgo = now - 24 * 60 * 60 * 1000;

    const bySeverity: Record<string, number> = {};
    const byType: Record<string, number> = {};

    for (const t of this.threatLog) {
      bySeverity[t.severity] = (bySeverity[t.severity] || 0) + 1;
      byType[t.type] = (byType[t.type] || 0) + 1;
    }

    return {
      total: this.threatLog.length,
      bySeverity,
      byType,
      last24h: this.threatLog.filter(t => t.timestamp > dayAgo).length,
    };
  }

  /**
   * Clear the threat log.
   */
  static clearThreatLog(): void {
    this.threatLog = [];
  }
}
