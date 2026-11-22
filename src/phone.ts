/**
 * Türkiye telefon numaraları.
 *
 * Numara aralıkları Google'ın libphonenumber projesindeki Türkiye verisinden alınmıştır
 * (resources/PhoneNumberMetadata.xml, Apache-2.0 lisanslı):
 * https://github.com/google/libphonenumber
 */

/**
 * - `mobile`: Cep telefonu (05xx)
 * - `landline`: Sabit hat (0212, 0312, … ve KKTC için 0392)
 * - `tollFree`: Ücretsiz arama (0800, 0811)
 * - `premium`: Ücretli servis (0900, 0888, 0898)
 * - `voip`: 0850'li kurumsal numaralar
 * - `uan`: 444'lü numaralar (örn. 444 1 444)
 * - `pager`: 0512 çağrı servisleri
 * - `personal`: 0592 uydu telefonları
 */
export type PhoneType =
  | 'mobile'
  | 'landline'
  | 'tollFree'
  | 'premium'
  | 'voip'
  | 'uan'
  | 'pager'
  | 'personal';

export interface ParsedPhone {
  type: PhoneType;
  /** Ülke kodu ve baştaki 0 olmadan numara. Örn. "5321234567" */
  nationalNumber: string;
}

/**
 * - `national`: "0532 123 45 67", sabit hatlarda "(0212) 345 67 89"
 * - `international`: "+90 532 123 45 67"
 * - `e164`: "+905321234567" (veritabanında saklamak ve SMS servisleri için)
 */
export type PhoneFormat = 'national' | 'international' | 'e164';

const TYPE_PATTERNS: ReadonlyArray<readonly [PhoneType, RegExp]> = [
  ['mobile', /^(?:5(?:61(?:011|61\d)|82[2-5]\d\d)\d{4}|5(?:[03-5]\d|1[06]|24|6[24]|7[245]|9[46])\d{7})$/],
  [
    'landline',
    /^(?:2(?:1[26]|[28][2468]|[3-5][268]|[67][246])|3(?:[13][28]|[24-6][2468]|[78][02468]|92)|4(?:[16][246]|[23578][2468]|4[26]))\d{7}$/,
  ],
  ['tollFree', /^8(?:00\d{7}(?:\d{2,3})?|11\d{7})$/],
  ['premium', /^(?:8[89]8|900)\d{7}$/],
  ['voip', /^850\d{7}$/],
  ['uan', /^444\d{4}$/],
  ['pager', /^512\d{7}$/],
  ['personal', /^592(?:21[12]|461)\d{4}$/],
];

/** Yurt dışından aranamayan numaralar: +90 ile yazılırlarsa geçersizdir. */
const NO_INTERNATIONAL_DIALLING = /^(?:444|811\d{3})\d{4}$/;

/**
 * Telefon numarasını çözümler: türünü ve sade (ülke kodu ve baştaki 0 olmadan) hâlini döndürür.
 * Geçersizse null döner.
 *
 * Şu yazımların hepsi kabul edilir: "+90 532 123 45 67", "0090 532…", "90532…",
 * "0532 123 45 67", "(0532) 123-45-67", "532.123.45.67", "+90 (0) 532…".
 * 112, 155 gibi kısa acil durum numaraları desteklenmez.
 *
 * @example
 * parsePhone('+90 532 123 45 67') // { type: 'mobile', nationalNumber: '5321234567' }
 * parsePhone('444 1 444')         // { type: 'uan', nationalNumber: '4441444' }
 */
export function parsePhone(value: string): ParsedPhone | null {
  const parts = splitCountryCode(value);
  if (!parts) return null;

  const { nationalNumber, international } = parts;
  if (international && NO_INTERNATIONAL_DIALLING.test(nationalNumber)) return null;

  for (const [type, pattern] of TYPE_PATTERNS) {
    if (pattern.test(nationalNumber)) return { type, nationalNumber };
  }
  return null;
}

/**
 * Türkiye telefon numarasının geçerli olup olmadığını kontrol eder.
 * İkinci parametreyle belirli bir tür şart koşulabilir.
 *
 * @example
 * isValidPhone('0532 123 45 67')           // true
 * isValidPhone('0212 345 67 89', 'mobile') // false (sabit hat)
 */
export function isValidPhone(value: string, type?: PhoneType): boolean {
  const phone = parsePhone(value);
  return phone !== null && (type === undefined || phone.type === type);
}

/**
 * Telefon numarasını istenen biçimde yazar. Geçersizse null döner.
 *
 * 444'lü ve 0811'li numaralar yurt dışından aranamadığı için her biçimde ulusal yazımla döner.
 *
 * @example
 * formatPhone('05321234567')                  // '0532 123 45 67'
 * formatPhone('05321234567', 'international') // '+90 532 123 45 67'
 * formatPhone('05321234567', 'e164')          // '+905321234567'
 * formatPhone('02123456789')                  // '(0212) 345 67 89'
 */
export function formatPhone(value: string, format: PhoneFormat = 'national'): string | null {
  const phone = parsePhone(value);
  if (!phone) return null;

  const n = phone.nationalNumber;
  if (format === 'national' || NO_INTERNATIONAL_DIALLING.test(n)) return formatNational(phone);
  if (format === 'e164') return `+90${n}`;
  return `+90 ${groupDigits(n)}`;
}

/** Ülke kodunu veya baştaki 0'ı ayıklar. Ayırıcı karakterleri (boşluk, -, ., /, parantez) siler. */
function splitCountryCode(value: string): { nationalNumber: string; international: boolean } | null {
  let s = value.replace(/\(0\)/g, '').replace(/[\s\-./()]/g, '');
  let international = false;

  if (s.startsWith('+')) {
    if (!s.startsWith('+90')) return null;
    s = s.slice(3);
    international = true;
  } else if (s.startsWith('0090')) {
    s = s.slice(4);
    international = true;
  } else if (s.startsWith('90') && s.length === 12) {
    // "905321234567": Türkiye'de 9 ile başlayan 12 haneli bir yerel numara yok.
    s = s.slice(2);
    international = true;
  }

  // Baştaki 0 (ulusal ön ek). "+90 0532…" gibi yaygın hatalı yazımı da kabul ediyoruz.
  if (s.startsWith('0')) s = s.slice(1);

  return /^\d+$/.test(s) ? { nationalNumber: s, international } : null;
}

/** Ulusal ön ek olmadan, libphonenumber'ın Türkiye biçimlerine göre gruplar. */
function groupDigits(n: string): string {
  if (n.length === 7) return `${n.slice(0, 3)} ${n.slice(3, 4)} ${n.slice(4)}`; // 444 1 444
  if (n.length > 10) return `${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`; // 12-13 haneli 0800
  if (/^(?:512|8|90)/.test(n)) return `${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`; // 0850 123 4567
  return `${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6, 8)} ${n.slice(8)}`; // 532 123 45 67
}

function formatNational(phone: ParsedPhone): string {
  const n = phone.nationalNumber;
  if (phone.type === 'uan') return groupDigits(n);
  if (phone.type === 'landline') return `(0${n.slice(0, 3)}) ${groupDigits(n).slice(4)}`;
  return `0${groupDigits(n)}`;
}
