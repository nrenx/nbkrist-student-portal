import { maskAadhaar } from './maskData';

// Test cases for maskAadhaar function
describe('maskAadhaar', () => {
  test('should handle null or undefined values', () => {
    expect(maskAadhaar(null)).toBe('');
    expect(maskAadhaar(undefined)).toBe('');
    expect(maskAadhaar('')).toBe('');
  });

  test('should mask standard 12-digit Aadhaar numbers', () => {
    expect(maskAadhaar('123456789012')).toBe('********9012');
    expect(maskAadhaar('123456789012')).toBe('****-****-9012');
  });

  test('should preserve formatting in Aadhaar numbers', () => {
    expect(maskAadhaar('1234-5678-9012')).toBe('****-****-9012');
    expect(maskAadhaar('1234 5678 9012')).toBe('**** **** 9012');
  });

  test('should handle non-standard length Aadhaar numbers', () => {
    expect(maskAadhaar('12345')).toBe('*2345');
    expect(maskAadhaar('1234567')).toBe('***4567');
  });

  test('should not re-mask already masked Aadhaar numbers', () => {
    expect(maskAadhaar('****-****-9012')).toBe('****-****-9012');
    expect(maskAadhaar('********9012')).toBe('********9012');
  });
});
