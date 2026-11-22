/**
 * Girdiyi metne çevirir ve tüm boşlukları siler ("100 000 001 46" → "10000000146").
 * Rakam dışındaki karakterleri silmez; onları doğrulama fonksiyonları reddeder.
 */
export function compact(value: string | number): string {
  return String(value).replace(/\s+/g, '');
}
