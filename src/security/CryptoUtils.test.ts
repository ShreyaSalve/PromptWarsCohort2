import { describe, it, expect } from 'vitest';
import { CryptoUtils } from './CryptoUtils';

describe('CryptoUtils', () => {
  it('should generate a sha256 hash', async () => {
    const message = "hello world";
    const hash = await CryptoUtils.sha256(message);
    expect(hash).toBeDefined();
    expect(hash.length).toBe(64); // SHA-256 is 64 hex chars
  });

  it('should generate a token of specified length', () => {
    const length = 16;
    const token = CryptoUtils.generateToken(length);
    expect(token.length).toBe(length * 2); // 16 bytes = 32 hex chars
  });

  it('should generate unique session IDs', () => {
    const id1 = CryptoUtils.generateSessionId();
    const id2 = CryptoUtils.generateSessionId();
    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^ELCTR_/);
  });

  it('should encrypt and decrypt data correctly', async () => {
    const data = "sensitive information";
    const key = await CryptoUtils.generateEncryptionKey();
    const { ciphertext, iv } = await CryptoUtils.encrypt(data, key);
    
    expect(ciphertext).not.toBe(data);
    
    const decrypted = await CryptoUtils.decrypt(ciphertext, iv, key);
    expect(decrypted).toBe(data);
  });

  it('should sign and verify HMAC correctly', async () => {
    const message = "message to sign";
    const secret = "top-secret-key";
    const signature = await CryptoUtils.hmacSign(message, secret);
    
    const isValid = await CryptoUtils.hmacVerify(message, signature, secret);
    expect(isValid).toBe(true);
    
    const isInvalid = await CryptoUtils.hmacVerify("tampered message", signature, secret);
    expect(isInvalid).toBe(false);
  });
});
