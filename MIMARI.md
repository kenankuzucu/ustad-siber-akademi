# MİMARİ (nasıl çalışır)

## Katmanlar
1. **Kabuk (`index.html` + `site.css`)**: açılış ekranı, 3D tuvali, modül yükleyici.
2. **Çekirdek (`akademi.js`)**: depo (`AK.veri`), XP/rütbe/rozet motoru, menü ve modül
   yönlendirme (`AK.modulEkle(id, çiz)`, `AK.git(id)`), yardımcılar (`AK.baslik`, `AK.kutu`,
   `AK.cubuk`, `AK.not`), aralıklı tekrar takvimi (1-3-7-16-35-75 gün).
3. **Eklenti modülleri** (`akademi-*.js`): yüklenirken kendini çekirdeğe kaydeder
   (`AK.modulEkle`) ve menüye eklenir (`AK.MODUL.push`). Yeni modül eklemek için
   tek yeni dosya + `index.html`'e tek satır yeterlidir.
4. **Veri (`akademi-veri.js`)**: `window.EGITIM_VERI = {bolumler:[{id,ad,simge,kayitlar:[{ad,metin,ornek,...}]}]}`.
   Modüller bu veriyi doğrudan kullanır (`window.V`); ağ isteği yoktur.
5. **3D (`sahne.js`)**: Three.js üzerine 5 sahne. WebGL yoksa `SA.basla()` false döner ve
   site normal çalışır (3D kapatılır, hata gösterilmez).
6. **PWA**: `manifest.json` + `service-worker.js`; kabuk dosyaları önbelleğe alınır.

## Veri akışı
`V.bolumler` (içerik) → modüller (ders, lab, oyun, sınav) → `AK.veri` (kullanıcı ilerlemesi)
→ `AK.xpEkle/rozetKazan/milestone` → karne, harita, portföy, sertifika.

## Güvenlik ilkeleri
- Sunucu yok → oturum/parola riski yok; veri cihazda.
- Gerçek saldırı aracı çağrısı yok; laboratuvarlar senaryo tabanlıdır (izole ortam gerektirenler
  `KALI-VE-SUNUCU-ISLERI.txt`'te).
- Sertifika, şartlar dolmadan üretilmez; her sertifikada doğrulama kodu bulunur.

## Genişletme
Yeni bir modül: `akademi-yenimodul.js` oluştur, `AK.MODUL.push({id,simge,ad,alt})` ve
`AK.modulEkle('id', cizimFonksiyonu)` yaz, `index.html`'e `<script src="akademi-yenimodul.js"></script>`
ekle. Çekirdeği değiştirmen gerekmez.
