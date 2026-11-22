import { describe, expect, it } from 'vitest';
import { slugify } from '../src/index.js';

describe('slugify', () => {
  it.each([
    ['Çok Güzel Şarkılar', 'cok-guzel-sarkilar'],
    ["İSTANBUL'da Işık", 'istanbul-da-isik'],
    ['ĞÜŞİÖÇ ğüşıöç', 'gusioc-gusioc'],
    ['Kâğıt Ürünleri', 'kagit-urunleri'],
    ['  --Merhaba,   Dünya!!  ', 'merhaba-dunya'],
    ['2026 Yılı Bütçesi', '2026-yili-butcesi'],
    ['', ''],
    ['!!!', ''],
  ])('%s → %s', (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });

  it('farklı ayırıcı kullanılabilir', () => {
    expect(slugify("İSTANBUL'da Işık", '_')).toBe('istanbul_da_isik');
  });
});
