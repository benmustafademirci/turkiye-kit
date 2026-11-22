import { describe, expect, it } from 'vitest';
import { isValidTaxId, isValidVKN } from '../src/index.js';

// Hayalî numaralar: desen olarak seçildi, gerçek bir kişi veya şirketten alınmadı.
// Kontrol haneleri, python-stdnum'daki referans formülle Python'da ayrıca hesaplandı.
const VALID_VKNS = [
  '1234567890',
  '0123456789',
  '0012345672',
  '9876543217',
  '1111111114',
  '2468135797',
  '1357924685',
  '5000000005',
];

/**
 * python-stdnum'daki calc_check_digit fonksiyonunun birebir karşılığı.
 * Bizim koddan farklı olarak haneleri sağdan sola işler. Böylece iki bağımsız
 * yazımı karşılaştırarak algoritmayı gerçek numaralara ihtiyaç duymadan doğrularız.
 * https://github.com/arthurdejong/python-stdnum/blob/master/stdnum/tr/vkn.py
 */
function referenceCheckDigit(first9: string): number {
  let s = 0;
  [...first9].reverse().forEach((digit, index) => {
    const i = index + 1;
    const c1 = (Number(digit) + i) % 10;
    if (c1) s += (c1 * 2 ** i) % 9 || 9;
  });
  return (((10 - s) % 10) + 10) % 10;
}

describe('isValidVKN', () => {
  it.each(VALID_VKNS)('%s geçerli', (vkn) => {
    expect(isValidVKN(vkn)).toBe(true);
  });

  it.each([
    ['1234567891', 'kontrol hanesi yanlış'],
    ['123456789', '9 hane'],
    ['12345678900', '11 hane'],
    ['12345678a0', 'harf içeriyor'],
    ['', 'boş'],
  ])('%s numarasını reddeder (%s)', (value) => {
    expect(isValidVKN(value)).toBe(false);
  });

  it('boşlukları yok sayar', () => {
    expect(isValidVKN('123 456 7890')).toBe(true);
  });

  it('10.000 farklı numarada referans algoritmayla aynı sonucu verir', () => {
    for (let k = 0; k < 10_000; k++) {
      const first9 = String((k * 104_729) % 1_000_000_000).padStart(9, '0');
      const check = referenceCheckDigit(first9);
      for (let digit = 0; digit <= 9; digit++) {
        expect(isValidVKN(first9 + digit), first9 + digit).toBe(digit === check);
      }
    }
  });
});

describe('isValidTaxId', () => {
  it('10 haneli VKN kabul eder', () => {
    expect(isValidTaxId('1234567890')).toBe(true);
  });

  it('11 haneli TCKN kabul eder', () => {
    expect(isValidTaxId('10000000146')).toBe(true);
  });

  it.each(['1234567891', '10000000145', '123', ''])('%s numarasını reddeder', (value) => {
    expect(isValidTaxId(value)).toBe(false);
  });
});
