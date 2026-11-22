import { describe, expect, it } from 'vitest';
import { moneyToWords, numberToWords } from '../src/index.js';

describe('numberToWords', () => {
  it.each([
    [0, 'sıfır'],
    [1, 'bir'],
    [10, 'on'],
    [11, 'on bir'],
    [20, 'yirmi'],
    [99, 'doksan dokuz'],
    [100, 'yüz'],
    [101, 'yüz bir'],
    [123, 'yüz yirmi üç'],
    [200, 'iki yüz'],
    [999, 'dokuz yüz doksan dokuz'],
    [1000, 'bin'],
    [1001, 'bin bir'],
    [1100, 'bin yüz'],
    [1923, 'bin dokuz yüz yirmi üç'],
    [2000, 'iki bin'],
    [11000, 'on bir bin'],
    [100000, 'yüz bin'],
    [101000, 'yüz bir bin'],
    [1000000, 'bir milyon'],
    [1000001, 'bir milyon bir'],
    [1001000, 'bir milyon bin'],
    [2500000, 'iki milyon beş yüz bin'],
    [1000000000, 'bir milyar'],
    [-5, 'eksi beş'],
    [-1000, 'eksi bin'],
    [
      Number.MAX_SAFE_INTEGER,
      'dokuz katrilyon yedi trilyon yüz doksan dokuz milyar iki yüz elli dört milyon yedi yüz kırk bin dokuz yüz doksan bir',
    ],
  ])('%d → %s', (input, expected) => {
    expect(numberToWords(input)).toBe(expected);
  });

  it.each([1.5, Number.NaN, Number.POSITIVE_INFINITY, 2 ** 53])('%d için hata fırlatır', (input) => {
    expect(() => numberToWords(input)).toThrow(RangeError);
  });
});

describe('moneyToWords', () => {
  it.each([
    [123.45, 'yüz yirmi üç lira kırk beş kuruş'],
    [100, 'yüz lira'],
    [0, 'sıfır lira'],
    [0.5, 'elli kuruş'],
    [0.29, 'yirmi dokuz kuruş'], // 0.29 * 100 = 28.999… olur, yuvarlama doğru çalışmalı
    [1000.01, 'bin lira bir kuruş'],
    [-12.3, 'eksi on iki lira otuz kuruş'],
    [-0.001, 'sıfır lira'], // sıfıra yuvarlanan tutarda "eksi" yazılmaz
  ])('%d → %s', (input, expected) => {
    expect(moneyToWords(input)).toBe(expected);
  });

  it('para birimi değiştirilebilir', () => {
    expect(moneyToWords(5.99, { unit: 'dolar', subunit: 'sent' })).toBe('beş dolar doksan dokuz sent');
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER])('%d için hata fırlatır', (input) => {
    expect(() => moneyToWords(input)).toThrow(RangeError);
  });
});
