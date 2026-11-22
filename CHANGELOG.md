# Değişiklik günlüğü

Bu projedeki önemli değişiklikler bu dosyada listelenir.
Sürüm numaraları [Semantic Versioning](https://semver.org/lang/tr/) kurallarına uyar.

## [0.1.0] - 2026-11-22

İlk sürüm.

### Eklendi

- `isValidTCKN`: T.C. Kimlik Numarası doğrulama
- `isValidVKN`: Vergi Kimlik Numarası doğrulama
- `isValidTaxId`: VKN veya TCKN kabul eden vergi numarası doğrulama
- `isValidIBAN`, `formatIBAN`: Türk IBAN doğrulama ve biçimlendirme
- `numberToWords`, `moneyToWords`: Sayıyı ve para tutarını Türkçe yazıya çevirme
- `slugify`: Türkçe karakterleri doğru çeviren slug üretici
