import { describe, expect, it } from 'vitest';
import { isValidTaxId, isValidVKN } from '../src/index.js';

// Test vektörleri python-stdnum projesinden alınmıştır (stdnum/tr/vkn.py ve tests/test_tr_vkn.doctest):
// https://github.com/arthurdejong/python-stdnum
const VALID_VKNS = [
  '4540536920',
  '0010213576',
  '0010441520',
  '0080463579',
  '0180044810',
  '0280352329',
  '0620203425',
  '0680581023',
];

describe('isValidVKN', () => {
  it.each(VALID_VKNS)('%s geçerli', (vkn) => {
    expect(isValidVKN(vkn)).toBe(true);
  });

  it.each([
    ['4540536921', 'kontrol hanesi yanlış'],
    ['454053692', '9 hane'],
    ['45405369200', '11 hane'],
    ['45405369a0', 'harf içeriyor'],
    ['', 'boş'],
  ])('%s numarasını reddeder (%s)', (value) => {
    expect(isValidVKN(value)).toBe(false);
  });

  it('boşlukları yok sayar', () => {
    expect(isValidVKN('454 053 6920')).toBe(true);
  });
});

describe('isValidTaxId', () => {
  it('10 haneli VKN kabul eder', () => {
    expect(isValidTaxId('4540536920')).toBe(true);
  });

  it('11 haneli TCKN kabul eder', () => {
    expect(isValidTaxId('10000000146')).toBe(true);
  });

  it.each(['4540536921', '10000000145', '123', ''])('%s numarasını reddeder', (value) => {
    expect(isValidTaxId(value)).toBe(false);
  });
});
