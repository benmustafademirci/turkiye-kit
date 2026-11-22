import { describe, expect, it } from 'vitest';
import { formatPhone, isValidPhone, parsePhone } from '../src/index.js';

// Örnek numaralar desen olarak seçildi veya libphonenumber'ın kendi örnek numaralarıdır.

describe('parsePhone', () => {
  it.each([
    '+90 532 123 45 67',
    '+905321234567',
    '0090 532 123 45 67',
    '905321234567',
    '0532 123 45 67',
    '05321234567',
    '5321234567',
    '(0532) 123-45-67',
    '0532.123.45.67',
    '0532/123 45 67',
    '+90 (0) 532 123 45 67',
    '+90 0532 123 45 67',
  ])('%s → mobil 5321234567', (input) => {
    expect(parsePhone(input)).toEqual({ type: 'mobile', nationalNumber: '5321234567' });
  });

  it.each([
    ['0501 234 56 78', 'mobile'],
    ['0542 123 45 67', 'mobile'],
    ['0555 123 45 67', 'mobile'],
    ['0212 345 67 89', 'landline'],
    ['(0216) 345 67 89', 'landline'],
    ['0312 345 67 89', 'landline'],
    ['0392 345 67 89', 'landline'], // KKTC
    ['0800 123 45 67', 'tollFree'],
    ['0800 123 456 789', 'tollFree'], // 13 haneli ücretsiz hat
    ['0811 123 45 67', 'tollFree'],
    ['0900 123 45 67', 'premium'],
    ['0888 123 45 67', 'premium'],
    ['0850 123 45 67', 'voip'],
    ['444 1 444', 'uan'],
    ['0444 1 444', 'uan'],
    ['0512 345 67 89', 'pager'],
    ['0592 212 12 34', 'personal'],
  ])('%s → %s', (input, type) => {
    expect(parsePhone(input)?.type).toBe(type);
  });

  it.each([
    ['0532 123 45 6', '9 hane'],
    ['0532 123 45 678', '11 hane'],
    ['0520 123 45 67', '0520 kullanılmıyor'],
    ['0211 345 67 89', '0211 alan kodu yok'],
    ['0111 222 33 44', '01 ile başlayan numara yok'],
    ['+1 532 123 45 67', 'başka ülke kodu'],
    ['+90 444 1 444', '444 yurt dışından aranamaz'],
    ['0090 811 123 45 67', '0811 yurt dışından aranamaz'],
    ['0532 123 45 6a', 'harf içeriyor'],
    ['112', 'kısa numara'],
    ['', 'boş'],
  ])('%s → null (%s)', (input) => {
    expect(parsePhone(input)).toBeNull();
  });
});

describe('isValidPhone', () => {
  it('geçerli numarayı kabul eder', () => {
    expect(isValidPhone('0532 123 45 67')).toBe(true);
  });

  it('tür şartı koşulabilir', () => {
    expect(isValidPhone('0532 123 45 67', 'mobile')).toBe(true);
    expect(isValidPhone('0212 345 67 89', 'mobile')).toBe(false);
    expect(isValidPhone('0212 345 67 89', 'landline')).toBe(true);
  });

  it('geçersiz numarayı reddeder', () => {
    expect(isValidPhone('0520 123 45 67')).toBe(false);
  });
});

describe('formatPhone', () => {
  it.each([
    ['05321234567', 'national', '0532 123 45 67'],
    ['05321234567', 'international', '+90 532 123 45 67'],
    ['05321234567', 'e164', '+905321234567'],
    ['+90 212 345 6789', 'national', '(0212) 345 67 89'],
    ['02123456789', 'international', '+90 212 345 67 89'],
    ['08501234567', 'national', '0850 123 4567'],
    ['08501234567', 'international', '+90 850 123 4567'],
    ['0800123456789', 'national', '0800 123 456789'],
    ['4441444', 'national', '444 1 444'],
    ['4441444', 'international', '444 1 444'], // yurt dışından aranamaz, ulusal yazım
    ['4441444', 'e164', '444 1 444'],
  ] as const)('%s (%s) → %s', (input, format, expected) => {
    expect(formatPhone(input, format)).toBe(expected);
  });

  it('varsayılan biçim ulusaldır', () => {
    expect(formatPhone('+905321234567')).toBe('0532 123 45 67');
  });

  it('geçersiz numara için null döner', () => {
    expect(formatPhone('0520 123 45 67')).toBeNull();
  });

  it('çıktısı tekrar çözümlenebilir', () => {
    for (const format of ['national', 'international', 'e164'] as const) {
      const formatted = formatPhone('05321234567', format);
      expect(parsePhone(formatted ?? '')?.nationalNumber).toBe('5321234567');
    }
  });
});
