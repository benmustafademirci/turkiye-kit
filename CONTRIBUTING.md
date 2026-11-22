# Katkı rehberi

Katkıda bulunmak istediğiniz için teşekkürler! Bu rehber ilk katkınızı kolayca yapmanız için hazırlandı.

## Kurulum

Node.js 20 veya üstü gerekir.

```bash
git clone <repo-adresi>
cd turkiye-kit
npm install
npm test
```

## Komutlar

| Komut | Ne yapar |
| --- | --- |
| `npm test` | Testleri bir kez çalıştırır |
| `npm run test:watch` | Dosya değiştikçe testleri yeniden çalıştırır |
| `npm run typecheck` | TypeScript tip kontrolü yapar |
| `npm run build` | `dist/` klasörüne ESM, CommonJS ve tip dosyalarını üretir |

## Kurallar

1. **Sıfır çalışma zamanı bağımlılığı.** Kütüphane hiçbir pakete bağımlı olmamalı. Geliştirme araçları (`devDependencies`) serbesttir.
2. **Her kuralın bir kaynağı olsun.** Bir algoritma veya kural eklerken, nereden öğrendiğinizi (resmî belge, standart, güvenilir bir açık kaynak proje) kod yorumuna veya PR açıklamasına yazın.
3. **Test olmadan özellik olmaz.** Geçerli ve geçersiz örnekleri, uç durumları (boş metin, boşluklar, sınır değerler) test edin.
4. **Fonksiyon adları İngilizce, açıklamalar Türkçe.** Böylece kütüphane her projede doğal görünür, belgeler de hedef kitleye uygun olur.
5. **Küçük PR'lar.** Her PR tek bir konuya odaklansın.

## Yeni bir özellik eklemek

1. `src/` altında yeni bir dosya oluşturun (örneğin `src/phone.ts`).
2. Fonksiyonu JSDoc ile belgeleyin ve en az bir `@example` ekleyin.
3. `src/index.ts` dosyasından dışa aktarın.
4. `test/` altında testlerini yazın.
5. README'deki API tablosuna ve örneklere ekleyin.

## Not: Neden TypeScript 6?

Derleme aracımız `tsup`, tip dosyalarını üretmek için TypeScript'in JavaScript API'sini kullanıyor. TypeScript 7 (yeni yerel derleyici) bu API'yi henüz sunmadığı için geliştirme ortamında TypeScript 6 kullanıyoruz. Bu yalnızca bizim derleme sürecimizi etkiler. Kütüphaneyi kullananlar TypeScript 7 dahil istedikleri sürümü kullanabilir.
