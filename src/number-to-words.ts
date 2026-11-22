const ONES = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const TENS = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];
const SCALES = ['', 'bin', 'milyon', 'milyar', 'trilyon', 'katrilyon'];

/** 0–999 arasındaki bir sayıyı kelimelere çevirir. 0 için boş dizi döner. */
function groupToWords(n: number): string[] {
  const hundreds = Math.floor(n / 100);
  const tens = Math.floor((n % 100) / 10);
  const ones = n % 10;

  const words: string[] = [];
  if (hundreds > 1) words.push(ONES[hundreds]); // "bir yüz" denmez, sadece "yüz"
  if (hundreds > 0) words.push('yüz');
  if (tens > 0) words.push(TENS[tens]);
  if (ones > 0) words.push(ONES[ones]);
  return words;
}

/**
 * Tam sayıyı Türkçe yazıya çevirir.
 * Negatif sayılar "eksi" ile başlar. En fazla Number.MAX_SAFE_INTEGER desteklenir.
 *
 * @throws {RangeError} Sayı güvenli bir tam sayı değilse (ondalıklı, NaN, Infinity, çok büyük).
 *
 * @example
 * numberToWords(1923) // 'bin dokuz yüz yirmi üç'
 * numberToWords(-5)   // 'eksi beş'
 */
export function numberToWords(value: number): string {
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(
      `numberToWords: en fazla ${Number.MAX_SAFE_INTEGER} olan bir tam sayı bekleniyordu, gelen: ${value}`,
    );
  }
  if (value === 0) return 'sıfır';

  const words: string[] = [];
  let rest = Math.abs(value);

  for (let scale = 0; rest > 0; scale++) {
    const group = rest % 1000;
    rest = Math.floor(rest / 1000);
    if (group === 0) continue;

    // "bir bin" denmez, sadece "bin". Ama "bir milyon", "bir milyar" denir.
    const part = scale === 1 && group === 1 ? [] : groupToWords(group);
    if (SCALES[scale]) part.push(SCALES[scale]);
    words.unshift(...part);
  }

  if (value < 0) words.unshift('eksi');
  return words.join(' ');
}

export interface MoneyToWordsOptions {
  /** Ana para birimi. Varsayılan: "lira" */
  unit?: string;
  /** Alt para birimi. Varsayılan: "kuruş" */
  subunit?: string;
}

/**
 * Para tutarını Türkçe yazıya çevirir. Tutar en yakın kuruşa yuvarlanır.
 * Fatura, çek ve senet gibi belgelerde kullanılan "yazıyla tutar" için uygundur.
 *
 * Not: JavaScript ondalık sayıları tam olarak saklayamaz (örneğin 1.005 aslında
 * 1.00499… olarak saklanır). Kesin sonuç gereken yerlerde tutarı kuruş cinsinden
 * tutup 100'e bölerek verin.
 *
 * @throws {RangeError} Tutar sonlu bir sayı değilse veya çok büyükse.
 *
 * @example
 * moneyToWords(123.45) // 'yüz yirmi üç lira kırk beş kuruş'
 * moneyToWords(5.99, { unit: 'dolar', subunit: 'sent' }) // 'beş dolar doksan dokuz sent'
 */
export function moneyToWords(amount: number, options: MoneyToWordsOptions = {}): string {
  const { unit = 'lira', subunit = 'kuruş' } = options;

  const totalSubunits = Math.round(Math.abs(amount) * 100);
  if (!Number.isFinite(amount) || !Number.isSafeInteger(totalSubunits)) {
    throw new RangeError(`moneyToWords: geçersiz veya çok büyük tutar: ${amount}`);
  }

  const main = Math.floor(totalSubunits / 100);
  const sub = totalSubunits % 100;

  const parts: string[] = [];
  if (main > 0 || sub === 0) parts.push(`${numberToWords(main)} ${unit}`);
  if (sub > 0) parts.push(`${numberToWords(sub)} ${subunit}`);

  const text = parts.join(' ');
  return amount < 0 && totalSubunits > 0 ? `eksi ${text}` : text;
}
