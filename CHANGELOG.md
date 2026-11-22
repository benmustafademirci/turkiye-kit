# Değişiklik günlüğü

Bu projedeki önemli değişiklikler bu dosyada listelenir.
Sürüm numaraları [Semantic Versioning](https://semver.org/lang/tr/) kurallarına uyar.

## [0.2.0] - 2026-11-22

### Eklendi

- `parsePhone`, `isValidPhone`, `formatPhone`: Türkiye telefon numarası çözümleme, doğrulama ve biçimlendirme. Mobil, sabit hat (KKTC dahil), 0800, 0850, 0900, 444 ve diğer türler desteklenir. Numara aralıkları Google libphonenumber verisinden alındı ve libphonenumber-js ile 80.000 numara üzerinde karşılaştırıldı.

### Değişti

- Testlerde ve örneklerde kullanılan, internetten derlenmiş gerçek vergi numaraları hayalî numaralarla değiştirildi. VKN algoritması artık bağımsız bir referans yazımla 10.000 numara üzerinde çapraz kontrol ediliyor.

### Eklendi

- README'ye "Gizlilik ve KVKK" bölümü
- Katkı rehberine "gerçek kişisel veri kullanmayın" kuralı

## [0.1.0] - 2026-11-22

İlk sürüm.

### Eklendi

- `isValidTCKN`: T.C. Kimlik Numarası doğrulama
- `isValidVKN`: Vergi Kimlik Numarası doğrulama
- `isValidTaxId`: VKN veya TCKN kabul eden vergi numarası doğrulama
- `isValidIBAN`, `formatIBAN`: Türk IBAN doğrulama ve biçimlendirme
- `numberToWords`, `moneyToWords`: Sayıyı ve para tutarını Türkçe yazıya çevirme
- `slugify`: Türkçe karakterleri doğru çeviren slug üretici
