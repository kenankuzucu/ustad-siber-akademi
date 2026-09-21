# CHANGELOG

## [1.6.3] — 22 Eylül 2026 (MİNİ OYUNLAR ÇOĞALTILDI · 8 → 14 OYUN · havuz 215)
### İstek (Kenan)
- "Şimdi mini oyunları sorularını da çoğalt, oyun kategorisinde çoğalt."

### Eklendi — 6 YENİ OYUN
1. **PAROLA GÜCÜ** — 12 parola, güçlü/zayıf kararı + gerekçe.
2. **OLTALAMA AVI** — 12 mesaj (e-posta/SMS/arama), oltalama mı gerçek mi?
3. **LOG AVI** — 10 kayıt grubu, şüpheli satırı bul.
4. **HASH TANIMA** — 10 özet; MD5 / SHA-1 / SHA-256 / bcrypt / Argon2 / Base64 ayırt et.
5. **OLAY SIRASI** — olay müdahale adımlarını doğru sırayla tıkla (NIST akışı).
6. **ARAÇ EŞLEŞTİRME** — 14 görev → doğru araç (nmap, gobuster, autopsy, hashcat...).

### Çoğaltıldı — mevcut oyunların soru havuzları
| Oyun | Önce | Şimdi |
|---|---|---|
| AĞ SAVUNMASI (port kuralı) | 8 | **24** (oyunda 8 soru) |
| SOC ALARM (log kaydı) | 8 | **26** (oyunda 10 soru) |
| LİNUX GÖREVİ (komut) | 6 | **18** (oyunda 8 soru) |
| WEB GÖREVİ (kanıt) | 8 | **22** (oyunda 8 soru) · zafiyet türü 8 → **15** |
| KRİPTO BULMACA (şifre) | 4 | **16** (oyunda 8 soru) |
| ADLİ VAKA | 3 | **10** (oyunda 6 soru) |
| ESCAPE ROOM (oda) | 4 | **10** |
| DEDEKTİF | 1 vaka / 3 soru | **3 ayrı vaka** / 5 soru |
- **Soru/görev havuzu toplamı: 215** (önce 44).
- Yazım/cevap denetimi: 3 Sezar şifresi cevabı düzeltildi (PGRCT→nepar, WMFIV→siber, LBMJ→kali).

### Doğrulama (canlı tarayıcı)
- Modülde **14 oyun kartı**; 14 oyunun **14'ü de hatasız açılıyor** (id listesi ve içerik uzunlukları ölçüldü).
- `node --check akademi-oyun.js` temiz.
- `service-worker.js`: v1.6.2 → v1.6.3.

## [1.6.2] — 22 Eylül 2026 (GİRİŞ GÖRÜNÜMÜ İÇERİYE TAŞINDI)
### İstek (Kenan)
- "İlk giriş parlaklığını ve tema olarak YEŞİL rengi ve CAM GİBİ NETLİĞİ içeride verir misin, yazıların netliğini."

### Yapıldı (akademi.css — yeni bölüm: "İÇERİ KATMANI: CAM + YEŞİL + PARLAKLIK")
- **Parlaklık:** içeri perdesine zümrüt yeşili ışıma katmanları eklendi (giriş ekranının aynısı);
  içerik alanına ayrı yeşil/altın ışıma. Varsayılan tema zaten **zümrüt (yeşil)**.
- **Cam netliği:** kutular, listeler, notlar, seçenekler, form alanları ve üst şerit
  buzlu cam oldu — `backdrop-filter: blur(12px) saturate(165%) brightness(112%)`,
  ince beyaz üst kenar ışığı + yeşil kenarlık + derin gölge.
- **Yazı netliği:** `-webkit-font-smoothing: antialiased` + `text-rendering: optimizeLegibility`;
  cam üstünde okunurluk için ince koyu gölge; başlıklarda neon yeşil ışıma.
  `--ak-soluk` soluk griden **canlı yeşil-beyaza** çekildi (solmuş görünüm yasak).
- **Koruma:** açık temalar (krem · gül · buz) bu bloktan **muaf** — bozulmadı (ekranla doğrulandı).
- Küçük ekranda blur azaltıldı (hız).

### Doğrulama
- Modül ekranları canlı tarayıcıda görüntülendi: Siber Kimlik Kartı · Karne & Analitik ·
  Hata Mesajları; yeşil temada cam + parlak, açık temada (krem) bozulma **yok**.
- `service-worker.js`: v1.6.1 → v1.6.2 (yeni CSS tarayıcıya insin).

## [1.6.1] — 22 Eylül 2026 (BÜTÜN KATEGORİLER SORU KAZANDI · havuz 1.506)
### Bulunan eksik (içerik denetimi — "kategoride eksik olanlar")
- 46 bölümün **37'sinde hiç soru yoktu**; sorular tek bölümde toplanmıştı.
- 44 → bunların 37'si öğretim içeriği taşıyordu ama **hiç sınavı yoktu**.

### Eklendi (kategori kategori dolduruldu)
- **351 yeni soru** (hepsi 4 seçenekli + açıklamalı):
  LİNUX KOMUTLARI 20 · KALİ ARAÇLARI 20 · PORT REHBERİ 15 · TERİM SÖZLÜĞÜ 20 ·
  CVE 15 · FİLTRE/REGEX 15 · ACTIVE DIRECTORY 20 · MOBİL & IOT 15 · SENARYOLAR 15 ·
  GERÇEK VAKALAR 15 · LABORATUVAR 12 · HATA MESAJLARI 12 · ALTIN İPUÇLARI 12 ·
  TEK SATIRLIK 12 · SİSTEM DENETİMİ 12 · ANONİMLİK/OPSEC 12 · HUKUK 7 · DALLAR 8 ·
  HACKER TÜRLERİ 8 · TARİH 7 · SERTİFİKA 7 · KALİ KURULUM 6 · KALİ REHBERİ 6 ·
  EĞLENCE 8 · ARAÇ KILAVUZU 7 · YOL HARİTASI 7 · HABERLER 7 · ALAN HARİTASI 8 ·
  HIZLI BAŞVURU 6 · İSTATİSTİK 7 · ARAÇ SÖZLÜĞÜ 10.
- Yazım düzeltmesi: "GERİÇEK VAKALAR" → "GERÇEK VAKALAR"; "maskxlekmek" → "maskelemek".

### Sonuç (canlı tarayıcıda doğrulandı)
- Soru havuzu 1.155 → **1.506** · kategori 69 → **100** · bölüm **46** · kayıt **4.535**.
- **SORUSUZ BÖLÜM: 0** ✔ · **BOŞ ALAN: 0** ✔ · 19 modül açılıyor · hata yok.
- `service-worker.js`: v1.6.0 → v1.6.1.

## [1.6.0] — 22 Eylül 2026 (alan sınavı boşluğu giderildi · havuz 1.155)
### Bulunan eksik (içerik denetimi)
- 44 bölümün 37'sinde **hiç soru yoktu**; 1.000 sorunun tamamı tek bölümde ('test') duruyordu.
- Bu yüzden **12 eğitim alanından 8'inin sınavı BOŞTU** (soru bulamıyordu):
  network · python · web · blueteam · adli · osint · ai · kariyer.
  (Sorusu olanlar: linux 30 · kripto 60 · bulut 30 · ctf 820.)

### Eklendi
- **195 yeni soru** (hepsi 4 seçenekli + açıklamalı):
  AĞ GÜVENLİĞİ 18 · WEB 18 · BLUE TEAM/SOC 19 · ADLİ BİLİŞİM 20 · OSINT 20 · KARİYER 20 +
  PYTHON 20 · AI GÜVENLİĞİ 20.
- **2 yeni bölüm**: `python` (PYTHON GÜVENLİK VE OTOMASYON, 41 kayıt) ve
  `ai` (AI GÜVENLİĞİ VE MODEL RİSKLERİ, 39 kayıt) — konu + komut + soru karışık.
- `akademi.js` → `AK.ALAN`: python ve ai alanlarına bölüm bağlandı (`bolumler: ['python'] / ['ai']`).

### Sonuç (doğrulandı)
- Bölüm 44 → **46** · kayıt 3.989 → **4.184** · soru havuzu 1.000 → **1.155** (kategori 69).
- **12 alanın 12'si de soru buluyor (boş alan: 0)**, `hata=""`.
- `service-worker.js`: v1.5.0 → v1.6.0.

## [1.5.0] — 22 Eylül 2026 (MÜFREDAT modülü)
### Eklendi
- **`akademi-mufredat.js` (474 satır) + `akademi-mufredat.css`** — 19. modül: MÜFREDAT.
  - **12 eğitim alanı** (Ağ, Linux, Python, Web, Blue Team/SOC, Kriptografi, Adli Bilişim,
    OSINT, Bulut, AI, CTF/Lab, Kariyer).
  - Her alan **4 seviye** (Başlangıç · Orta · İleri · Uzman) → toplam **48 seviye bloğu · 252 hafta**.
  - Her seviyede: **hedef**, 6 **konu**, 3 **uygulama**, **proje** ve **ölçme** (kaç soru / hangi modül).
  - İlerleme kaydı (`AK.veri.mufredat`), her seviye için **+40 XP**, kilometre taşına yazım,
    SINAV MERKEZİ ve LABORATUVARLAR kısayolları, "Sıradaki adım" önerisi.
- Alt canlı şeritteki alan/modül sayısı artık **dinamik** (12 ALAN · 19 MODÜL).

### Doğrulama
- Gerçek tarayıcı: `modulSayisi=19 · mufAlan=12 · mufSeviye=48 · mufHafta=252 · hata=""`;
  menüde 12 alan düğmesi, 4 seviye kartı, düğmeler çalışıyor.
- 20 JS dosyası `node --check` temiz.

## [1.4.0] — 22 Eylül 2026 (soru bankası 1000 + görsel katman)
### Eklendi
- **Soru bankası 882 → 1000**: 118 yeni soru, 16 kategoride (Komutlar, Ağ, Web, Şifre Kırma,
  Kablosuz, OSINT, Kavramlar, Güvenlik, Yasal, OWASP, Enjeksiyon, Kriptografi, Adli Bilişim,
  Sistem Sertleştirme, Bulut ve Konteyner, Zararlı Yazılım). Her soru 4 seçenekli + açıklamalı.
- **Siber Ağaç** (`akademi-agac.js/.css`): fraktal ağaç, düşen dişli kod yaprakları,
  günlük azim sözleri (klasik serif), hafif rüzgâr salınımı.
- **Siber Kuşlar** (`akademi-kus.js/.css`): KALİ (turkuaz) + ÜSTAD KENAN (altın),
  3 katman kanat, yelpaze kuyruk, süzülme animasyonu.
- **Panel tema sayısı 13'e çıkarıldı** (OKYANUS · MOR · KAN · ALTIN · NEON · SİYAH eklendi).
- `DURUM-DOKUMU.txt`: 144 kalemin tam durum dökümü.

### Değişti
- `akademi-veri.js`: `toplam` 3871 → 3989, `uretim` alanı güncellendi.
- `service-worker.js`: `ustad-akademi-v1.3.0` → `ustad-akademi-v1.4.0`.
- Giriş ekranındaki sahne şeridi kaldırıldı; işlevler 3D Stüdyo'ya taşındı (orada zaten var).
- Profil resmindeki `hue-rotate` animasyonu kaldırıldı → resim her temada net.

### Doğrulama
- 19 JS dosyası `node --check` temiz · gerçek tarayıcıda SORU=1000 · KATEGORİ=62 · BOZUK=0.

## [1.1.0] — 21 Eylül 2026 (canlı panel + 3D açık)
### Eklendi
- `canli.css`: canlılık katmanı — akan aurora fonu, hareketli ızgara, inen tarama çizgisi,
  nabız atan durum ışıkları, kayan "sistem canlı" şeridi, üzerinden ışık geçen düğmeler/kartlar,
  animasyonlu ilerleme çubukları, canlı istatistik kutuları.
- Üst barda **canlı saat** ve "3D AKTİF • CANLI" göstergesi; canlı istatistik paneli
  (TOPLAM XP · AKTİF SERİ · BÖLÜM · TEKRAR VAKTİ) — sayaçlar animasyonlu.
- 3D artık **her zaman açık** ve aç/kapat düğmesi yok; otomatik sahne turu varsayılan açık (12 sn).
- Modül değişince sahne kısa bir "nabız" verir (`SA.dokun()`).

### Güvenlik / dayanıklılık
- 3D, sayfa tıklanabilir hâle geldikten SONRA başlar (ilk boyamayı asla geciktirmez).
- Başlamadan önce ana iş parçacığı sağlık testi (rAF örneklemesi); sayfa akıcı değilse 3D başlatılmaz.
- Kare süresi gözcüsü: üst üste 12 yavaş karede 3D sessizce durur, panel animasyonlarla canlı kalır.
- Giriş (fade-in) animasyonları kaldırıldı: hiçbir öğe "soluk" görünemez.

## [1.0.0] — 21 Eylül 2026 (ilk çalışan sürüm)

## [1.0.0] — 21 Eylül 2026 (ilk çalışan sürüm)
### Eklendi
- Yeni site kimliği: grafit + zümrüt + bakır; "görev brifingi" açılış ekranı.
- Kendi 3D motoru (`sahne.js`): YEMİN · KAFES · VERİ NEHRİ · RADAR TARAMASI · SIFIR NOKTASI,
  RASTGELE / OTOMATİK / SOLUK / 3D KAPAT denetimleri, WebGL yoksa güvenli düşme.
- Çekirdek akademi katmanı: Siber Kimlik, Ön Sınav, Akademi Beyni, Beceri Ağacı, Sınav Merkezi,
  Yanlışlar Defteri, Tekrar Motoru, Karne & Analitik, Sertifika, Dijital Kasa, Proje Takip.
- Görev Merkezi: hedef seçimi, Welcome Mission, günlük görevler, gizli görevler, sezon,
  başarı merkezi (avatar + kilometre taşları), rekor tablosu.
- Mini oyunlar: Ağ Savunması, SOC Alarm, Linux Görevi, Web Görevi, Kripto Bulmaca, Adli Vaka,
  Siber Escape Room (4 oda), Siber Dedektif.
- Laboratuvarlar: 6 senaryo laboratuvarı + CTF Arena (10 görev) + SOC simülasyonu +
  4 vaka dosyası + karar ağacı + adli bilişim + kod inceleme + haber laboratuvarı.
- AI Öğretmen & Mentor: kütüphane aramalı soru-cevap kural motoru, sesli öğretmen (Türkçe TTS),
  12 alan ders listesi + ders içi quiz, kişisel haftalık plan, eksik konu analizi.
- Kariyer & Portföy: Cyber Portfolio, otomatik CV + AI CV analizi, paylaşım metni,
  7 kariyer yolu uyum analizi, 8 soruluk mülakat simülatörü, 10 proje + proje sergisi, mezuniyet.
- Siber Dünya Haritası 2.0 (canvas ada haritası), yolculuk günlüğü, final sınavları,
  gelişim grafiği (son 14 sınav), TR/EN menü, yazı boyutu, yüksek karşıtlık, arşiv yedek/yükleme.
- PWA: `manifest.json` + `service-worker.js` (telefona kurulabilir, çevrimdışı).

### Düzeltildi
- Modüller yüklenmeden ekran çiziliyordu → geç çizim onarımı eklendi.
- Eski denemenin kayıtları karışıyordu → bu sitenin kendi depo anahtarı (`ustad-akademi-sitesi-v1`).

### Bilinen eksikler (sunucu/Kali gerekir)
- Kayıt/giriş/e-posta doğrulama, çok kullanıcılı paneller, canlı ders, mentor eşleşmesi,
  turnuvalar, QR'lı online doğrulama, 2FA, audit log → `KALI-VE-SUNUCU-ISLERI.txt`.
- Gerçek sanal terminal/sandbox ve gerçek CTF hedef makinesi (Kali).
