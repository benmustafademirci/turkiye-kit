/**
 * Metni Türkçe karakterleri doğru dönüştürerek URL dostu hâle getirir.
 *
 * ç→c, ğ→g, ı→i, İ→i, ö→o, ş→s, ü→u ve â/î/û gibi şapkalı harfler sadeleşir.
 * Harf ve rakam dışındaki her şey ayırıcıya dönüşür, baştaki ve sondaki ayırıcılar silinir.
 *
 * @example
 * slugify('Çok Güzel Şarkılar')   // 'cok-guzel-sarkilar'
 * slugify("İSTANBUL'da Işık", '_') // 'istanbul_da_isik'
 */
export function slugify(text: string, separator = '-'): string {
  return text
    .replace(/ı/g, 'i') // noktasız ı, Unicode'da ayrıştırılamaz, elle çeviriyoruz
    .normalize('NFD') // "ç"yi "c + çengel", "İ"yi "I + nokta" gibi harf ve işarete ayırır
    .replace(/[̀-ͯ]/g, '') // işaretleri siler
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .join(separator);
}
