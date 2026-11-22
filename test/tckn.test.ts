import { describe, expect, it } from 'vitest';
import { isValidTCKN } from '../src/index.js';

describe('isValidTCKN', () => {
  it('geçerli numarayı kabul eder', () => {
    expect(isValidTCKN('10000000146')).toBe(true);
  });

  it('sayı olarak verilen numarayı kabul eder', () => {
    expect(isValidTCKN(10000000146)).toBe(true);
  });

  it('boşlukları yok sayar', () => {
    expect(isValidTCKN(' 100 000 001 46 ')).toBe(true);
  });

  it.each([
    ['01000000146', '0 ile başlıyor'],
    ['10000000145', '11. hane yanlış'],
    ['10000000136', '10. hane yanlış'],
    ['1000000014', '10 hane'],
    ['100000001460', '12 hane'],
    ['1000000014a', 'harf içeriyor'],
    ['', 'boş'],
  ])('%s numarasını reddeder (%s)', (value) => {
    expect(isValidTCKN(value)).toBe(false);
  });

  it('herhangi bir hanedeki tek bir değişikliği yakalar', () => {
    const valid = '10000000146';
    for (let i = 0; i < valid.length; i++) {
      for (let digit = 0; digit <= 9; digit++) {
        if (String(digit) === valid[i]) continue;
        const changed = valid.slice(0, i) + digit + valid.slice(i + 1);
        expect(isValidTCKN(changed), changed).toBe(false);
      }
    }
  });
});
