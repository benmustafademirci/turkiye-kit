import { compact } from './internal.js';
import { isValidTCKN } from './tckn.js';

/**
 * 10 haneli Vergi Kimlik Numarası'nın (VKN) geçerli olup olmadığını kontrol eder.
 *
 * VKN 0 ile başlayabildiği için yalnızca metin (string) kabul eder:
 * sayıya çevrilirse baştaki sıfırlar kaybolur.
 *
 * Algoritma (ilk 9 hane, soldan sağa i = 0..8 için, ağırlık w = 9 − i):
 * - c1 = (hane + w) mod 10. c1 = 0 ise bu hane toplama katkı yapmaz.
 * - c2 = (c1 × 2^w) mod 9. c2 = 0 ise 9 kabul edilir. c2 toplama eklenir.
 * - Kontrol hanesi (10. hane) = (10 − toplam mod 10) mod 10
 *
 * Bu kontrol numaranın kime ait olduğunu göstermez. Gerçek mükellef
 * doğrulaması için GİB servisleri kullanılmalıdır.
 *
 * @example
 * isValidVKN('1234567890') // true
 * isValidVKN('1234567891') // false
 */
export function isValidVKN(value: string): boolean {
  const vkn = compact(value);
  if (!/^\d{10}$/.test(vkn)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    const weight = 9 - i;
    const c1 = (Number(vkn[i]) + weight) % 10;
    if (c1 === 0) continue;
    const c2 = (c1 * 2 ** weight) % 9;
    sum += c2 === 0 ? 9 : c2;
  }

  return (10 - (sum % 10)) % 10 === Number(vkn[9]);
}

/**
 * Vergi numarası olarak kullanılabilecek bir değeri kontrol eder.
 * Şirketler 10 haneli VKN, şahıs şirketleri ve bireyler 11 haneli TCKN kullanır
 * (örneğin e-Fatura'da her ikisi de geçerlidir).
 *
 * @example
 * isValidTaxId('1234567890')  // true (VKN)
 * isValidTaxId('10000000146') // true (TCKN)
 */
export function isValidTaxId(value: string): boolean {
  const id = compact(value);
  if (id.length === 10) return isValidVKN(id);
  if (id.length === 11) return isValidTCKN(id);
  return false;
}
