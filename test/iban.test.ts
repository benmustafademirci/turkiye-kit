import { describe, expect, it } from 'vitest';
import { formatIBAN, isValidIBAN } from '../src/index.js';

// IBAN kayıt defterindeki (SWIFT IBAN Registry) Türkiye örneği
const VALID = 'TR330006100519786457841326';

describe('isValidIBAN', () => {
  it('geçerli Türk IBAN’ını kabul eder', () => {
    expect(isValidIBAN(VALID)).toBe(true);
  });

  it('boşluklu ve küçük harfli yazımı kabul eder', () => {
    expect(isValidIBAN('tr33 0006 1005 1978 6457 8413 26')).toBe(true);
  });

  it.each([
    ['TR330006100519786457841327', 'kontrol tutmuyor'],
    ['TR33000610051978645784132', '25 karakter'],
    ['TR3300061005197864578413261', '27 karakter'],
    ['DE89370400440532013000', 'Alman IBAN’ı (geçerli ama Türk değil)'],
    ['XX330006100519786457841326', 'ülke kodu yanlış'],
    ['', 'boş'],
  ])('%s reddedilir (%s)', (value) => {
    expect(isValidIBAN(value)).toBe(false);
  });

  it('herhangi bir hanedeki tek bir değişikliği yakalar', () => {
    for (let i = 2; i < VALID.length; i++) {
      for (let digit = 0; digit <= 9; digit++) {
        if (String(digit) === VALID[i]) continue;
        const changed = VALID.slice(0, i) + digit + VALID.slice(i + 1);
        expect(isValidIBAN(changed), changed).toBe(false);
      }
    }
  });
});

describe('formatIBAN', () => {
  it('4’erli gruplara ayırır ve büyük harfe çevirir', () => {
    expect(formatIBAN('tr330006100519786457841326')).toBe('TR33 0006 1005 1978 6457 8413 26');
  });

  it('zaten biçimli metni bozmaz', () => {
    expect(formatIBAN('TR33 0006 1005 1978 6457 8413 26')).toBe('TR33 0006 1005 1978 6457 8413 26');
  });
});
