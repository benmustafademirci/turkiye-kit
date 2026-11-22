# turkiye-kit

[![CI](https://github.com/benmustafademirci/turkiye-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/benmustafademirci/turkiye-kit/actions/workflows/ci.yml)
[![Lisans: MIT](https://img.shields.io/badge/lisans-MIT-blue.svg)](LICENSE)

Türkiye'ye özel doğrulama ve biçimlendirme araçları. **Sıfır bağımlılık**, TypeScript tipleri dahil, Node.js, tarayıcı, Bun ve Deno'da çalışır.

```ts
import { isValidTCKN, isValidIBAN, moneyToWords, slugify } from 'turkiye-kit';

isValidTCKN('10000000146');                    // true
isValidIBAN('TR33 0006 1005 1978 6457 8413 26'); // true
moneyToWords(1923.05);                         // 'bin dokuz yüz yirmi üç lira beş kuruş'
slugify('Çok Güzel Şarkılar');                 // 'cok-guzel-sarkilar'
```

## Neden?

Türkiye'de form, ödeme veya fatura yazan her geliştirici aynı kodu yeniden yazıyor: TC kimlik kontrolü, IBAN doğrulama, "yazıyla tutar"... Bu kodlar genelde projeden projeye kopyalanıyor, test edilmiyor ve uç durumlarda hata veriyor ("bir bin", "0.29 TL → yirmi sekiz kuruş" gibi).

`turkiye-kit` bunları tek bir yerde, test edilmiş ve kaynağı belli kurallarla toplar.

## Kurulum

```bash
npm install turkiye-kit
```

## Kullanım

### TC Kimlik Numarası

```ts
import { isValidTCKN } from 'turkiye-kit';

isValidTCKN('10000000146');      // true
isValidTCKN(10000000146);        // true (sayı da kabul edilir)
isValidTCKN('100 000 001 46');   // true (boşluklar yok sayılır)
isValidTCKN('10000000145');      // false
```

### Vergi Kimlik Numarası

```ts
import { isValidVKN, isValidTaxId } from 'turkiye-kit';

isValidVKN('4540536920');     // true
isValidVKN('0010213576');     // true (0 ile başlayabilir, bu yüzden string verin)

// Şirketler VKN, şahıslar TCKN kullanır. İkisini birden kabul etmek için:
isValidTaxId('4540536920');   // true (VKN)
isValidTaxId('10000000146');  // true (TCKN)
```

### IBAN

```ts
import { isValidIBAN, formatIBAN } from 'turkiye-kit';

isValidIBAN('TR330006100519786457841326');       // true
isValidIBAN('tr33 0006 1005 1978 6457 8413 26'); // true
isValidIBAN('DE89370400440532013000');           // false (yalnızca Türk IBAN'ları)

formatIBAN('tr330006100519786457841326');        // 'TR33 0006 1005 1978 6457 8413 26'
```

### Sayıyı yazıya çevirme

```ts
import { numberToWords, moneyToWords } from 'turkiye-kit';

numberToWords(1000);      // 'bin'          ("bir bin" değil)
numberToWords(1000000);   // 'bir milyon'
numberToWords(-42);       // 'eksi kırk iki'

moneyToWords(123.45);     // 'yüz yirmi üç lira kırk beş kuruş'
moneyToWords(0.5);        // 'elli kuruş'
moneyToWords(5.99, { unit: 'dolar', subunit: 'sent' }); // 'beş dolar doksan dokuz sent'
```

### Türkçe slug

```ts
import { slugify } from 'turkiye-kit';

slugify("İSTANBUL'da Işık");        // 'istanbul-da-isik'
slugify('Kâğıt Ürünleri');          // 'kagit-urunleri'
slugify('Çok Güzel Şarkılar', '_'); // 'cok_guzel_sarkilar'
```

## API

| Fonksiyon | Ne yapar |
| --- | --- |
| `isValidTCKN(value)` | 11 haneli T.C. Kimlik No'yu kontrol eder |
| `isValidVKN(value)` | 10 haneli Vergi Kimlik No'yu kontrol eder |
| `isValidTaxId(value)` | VKN veya TCKN kabul eder |
| `isValidIBAN(value)` | Türk IBAN'ını mod 97 ile kontrol eder |
| `formatIBAN(value)` | IBAN'ı 4'erli gruplar hâlinde yazar |
| `numberToWords(n)` | Tam sayıyı Türkçe yazıya çevirir |
| `moneyToWords(amount, options?)` | Tutarı lira/kuruş olarak yazıya çevirir |
| `slugify(text, separator?)` | Türkçe karakterleri doğru çevirerek URL dostu metin üretir |

## Önemli not

Doğrulama fonksiyonları yalnızca numaranın **matematiksel olarak** geçerli olduğunu kontrol eder. Bir TC kimlik veya vergi numarasının gerçek bir kişiye ya da şirkete ait olduğunu göstermez. Bunun için resmî servisler (NVİ, GİB) kullanılmalıdır.

## Yol haritası

Katkıya açık konular. Başlamak için iyi yerler:

- [ ] Telefon numarası doğrulama ve biçimlendirme (`+90 5xx xxx xx xx`)
- [ ] Araç plakası doğrulama (il kodu 01–81 ve harf/rakam düzenleri)
- [ ] IBAN'dan banka adını bulma
- [ ] İl ve ilçe listesi
- [ ] Resmî tatiller (dinî bayramlar dahil)
- [ ] Fatura tarzı bitişik yazım ("YalnızYüzYirmiÜçTürkLirası")

## Katkıda bulunma

Katkılarınızı bekliyoruz! Nasıl başlayacağınız [CONTRIBUTING.md](CONTRIBUTING.md) dosyasında anlatılıyor. Hata bildirmek veya özellik önermek için [bir issue açın](https://github.com/benmustafademirci/turkiye-kit/issues/new/choose).

## Lisans

[MIT](LICENSE)

---

### English

`turkiye-kit` is a zero-dependency TypeScript library for Turkey-specific validation and formatting: Turkish national ID (TCKN), tax ID (VKN), Turkish IBAN, number-to-words in Turkish, and Turkish-aware slugify. Works in Node.js, browsers, Bun and Deno. Install with `npm install turkiye-kit`.
