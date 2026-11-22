import { compact } from './internal.js';

/** TR + 2 kontrol hanesi + 5 haneli banka kodu + 1 rezerv hane + 16 haneli hesap no = 26 karakter */
const TR_IBAN = /^TR\d{24}$/;

/**
 * Türk IBAN'ının geçerli olup olmadığını kontrol eder (ISO 13616, mod 97 kontrolü).
 * Boşluklar ve küçük harf kabul edilir. Başka ülkelerin IBAN'ları için false döner.
 *
 * @example
 * isValidIBAN('TR33 0006 1005 1978 6457 8413 26') // true
 */
export function isValidIBAN(value: string): boolean {
  const iban = compact(value).toUpperCase();
  if (!TR_IBAN.test(iban)) return false;

  // İlk 4 karakter sona taşınır, harfler sayıya çevrilir (A=10 … Z=35), kalan 1 olmalıdır.
  return mod97(iban.slice(4) + iban.slice(0, 4)) === 1;
}

/**
 * IBAN'ı 4'erli gruplar hâlinde yazar. Geçerlilik kontrolü yapmaz.
 *
 * @example
 * formatIBAN('tr330006100519786457841326') // 'TR33 0006 1005 1978 6457 8413 26'
 */
export function formatIBAN(value: string): string {
  return compact(value).toUpperCase().replace(/(.{4})(?=.)/g, '$1 ');
}

/** Çok büyük sayıyı BigInt'e gerek kalmadan, rakam rakam mod 97 hesaplar. */
function mod97(text: string): number {
  let remainder = 0;
  for (const char of text) {
    const digits = char >= 'A' && char <= 'Z' ? String(char.charCodeAt(0) - 55) : char;
    for (const digit of digits) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }
  }
  return remainder;
}
