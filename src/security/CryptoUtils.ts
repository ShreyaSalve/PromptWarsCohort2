/**
 * CryptoUtils — Client-side cryptographic utilities
 * Uses the Web Crypto API for secure hashing, encryption, and fingerprinting.
 */

export class CryptoUtils {
  private static encoder = new TextEncoder();

  /**
   * Generate a SHA-256 hash of any string input.
   */
  static async sha256(message: string): Promise<string> {
    const data = this.encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Generate a cryptographically secure random token.
   */
  static generateToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Generate a unique session ID with timestamp prefix.
   */
  static generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const random = this.generateToken(16);
    return `ELCTR_${timestamp}_${random}`;
  }

  /**
   * Derive a device fingerprint from browser characteristics.
   * Used for session binding — NOT for tracking users.
   */
  static async generateDeviceFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width.toString(),
      screen.height.toString(),
      screen.colorDepth.toString(),
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      navigator.hardwareConcurrency?.toString() || 'unknown',
      (navigator as any).deviceMemory?.toString() || 'unknown',
    ];
    return this.sha256(components.join('|'));
  }

  /**
   * Generate an AES-GCM key for symmetric encryption.
   */
  static async generateEncryptionKey(): Promise<CryptoKey> {
    return crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt data with AES-GCM.
   */
  static async encrypt(data: string, key: CryptoKey): Promise<{ ciphertext: string; iv: string }> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = this.encoder.encode(data);
    const cipherBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );
    return {
      ciphertext: btoa(String.fromCharCode(...new Uint8Array(cipherBuffer))),
      iv: btoa(String.fromCharCode(...iv)),
    };
  }

  /**
   * Decrypt AES-GCM encrypted data.
   */
  static async decrypt(ciphertext: string, iv: string, key: CryptoKey): Promise<string> {
    const cipherBuffer = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
    const ivBuffer = Uint8Array.from(atob(iv), c => c.charCodeAt(0));
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivBuffer },
      key,
      cipherBuffer
    );
    return new TextDecoder().decode(decryptedBuffer);
  }

  /**
   * HMAC-based message integrity verification.
   */
  static async hmacSign(message: string, secret: string): Promise<string> {
    const keyData = this.encoder.encode(secret);
    const key = await crypto.subtle.importKey(
      'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, this.encoder.encode(message));
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Verify HMAC signature.
   */
  static async hmacVerify(message: string, signature: string, secret: string): Promise<boolean> {
    const computed = await this.hmacSign(message, secret);
    // Constant-time comparison
    if (computed.length !== signature.length) return false;
    let result = 0;
    for (let i = 0; i < computed.length; i++) {
      result |= computed.charCodeAt(i) ^ signature.charCodeAt(i);
    }
    return result === 0;
  }
}
