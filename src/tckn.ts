import { compact } from './internal.js';

/**
 * T.C. Kimlik Numarası'nın (TCKN) geçerli olup olmadığını kontrol eder.
 *
 * Kurallar:
 * - 11 haneden oluşur, ilk hane 0 olamaz.
 * - 10. hane = ((1, 3, 5, 7, 9. hanelerin toplamı × 7) − (2, 4, 6, 8. hanelerin toplamı)) mod 10
 * - 11. hane = ilk 10 hanenin toplamı mod 10
 *
 * Bu kontrol yalnızca numaranın matematiksel olarak geçerli olduğunu gösterir.
 * Numaranın gerçek bir kişiye ait olduğunu doğrulamaz.
 *
 * @example
 * isValidTCKN('10000000146') // true
 * isValidTCKN('10000000145') // false
 */
export function isValidTCKN(value: string | number): boolean {
  const tckn = compact(value);
  if (!/^[1-9]\d{10}$/.test(tckn)) return false;

  const d = Array.from(tckn, Number);
  const oddSum = d[0] + d[2] + d[4] + d[6] + d[8];
  const evenSum = d[1] + d[3] + d[5] + d[7];

  // JavaScript'te % negatif sonuç verebildiği için +10 ile pozitife çekiyoruz.
  const tenth = (((oddSum * 7 - evenSum) % 10) + 10) % 10;
  if (tenth !== d[9]) return false;

  const firstTenSum = d.slice(0, 10).reduce((sum, digit) => sum + digit, 0);
  return firstTenSum % 10 === d[10];
}
