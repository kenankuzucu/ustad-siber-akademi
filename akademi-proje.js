/* ==========================================================================
   ÜSTAD SİBER AKADEMİ — PROJE TAKİP (akademi-proje.js)  ·  144 KONU
   Master listesinin (141 madde + 3 çerçeve kalemi = 144) canlı takibi.
   Her kalem: durum (yapıldı / kısmen / bekliyor) + yer (burada / Kali / sunucu).
   Durum bilgisi bu cihazda saklanır; tıklayarak ilerletebilirsin.
   ========================================================================== */
(function () {
  'use strict';
  var AK = window.AK;
  if (!AK) return;
  var kac = AK.kac, $$ = AK.$$, ic = function () { return document.getElementById('akIcerik'); };

  AK.PROJE = [
 {
  "no": 1,
  "metin": "GitHub repository ve profesyonel proje yapısı oluştur.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 2,
  "metin": "Frontend, backend, database, API, AI, sınav, soru, laboratuvar, CTF ve sertifika modüllerini modüler mimaride oluştur.",
  "durum": "bekliyor",
  "yer": "kali",
  "not": ""
 },
 {
  "no": 3,
  "metin": "Modern ve profesyonel siber güvenlik temalı ana sayfa oluştur.",
  "durum": "yapildi",
  "yer": "bura",
  "not": "Ana sayfa yayında (index.html)"
 },
 {
  "no": 4,
  "metin": "Dark Mode ve Light Mode oluştur.",
  "durum": "yapildi",
  "yer": "bura",
  "not": "12 tema + akademide 6 yumuşak/koyu tema"
 },
 {
  "no": 5,
  "metin": "Tam responsive tasarım oluştur.",
  "durum": "yapildi",
  "yer": "bura",
  "not": "responsive kırılma noktaları"
 },
 {
  "no": 6,
  "metin": "Kayıt, giriş, şifre sıfırlama ve e-posta doğrulama sistemlerini oluştur.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 7,
  "metin": "Öğrenci profil ve dashboard sistemini oluştur.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 8,
  "metin": "Sinematik akademi giriş ekranı ve interaktif hoş geldin deneyimi oluştur.",
  "durum": "kismen",
  "yer": "sunucu",
  "not": "Şifreli animasyonlu giriş perdesi + 3D sahne motoru var"
 },
 {
  "no": 9,
  "metin": "Öğrenciye hedef seçtirme ve başlangıç seviyesini belirtme sistemi oluştur; nihai seviyeyi AI belirlesin.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 10,
  "metin": "“Neden Siber Güvenlik?” ve “Bu Akademide Ne Öğreneceksin?” bölümlerini oluştur.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 11,
  "metin": "Rozet, laboratuvar, CTF ve sertifika önizlemeleri oluştur.",
  "durum": "bekliyor",
  "yer": "kali",
  "not": ""
 },
 {
  "no": 12,
  "metin": "Öğrenciye benzersiz Siber Kimlik Kartı ve öğrenci ID sistemi oluştur.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 13,
  "metin": "İlk girişte Welcome Mission oluştur ve ilk görevde XP/rozet kazandır.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 14,
  "metin": "Başlangıç seviye belirleme sınavı oluştur.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 15,
  "metin": "En az 1000+ soruluk soru bankası altyapısı oluştur.",
  "durum": "kismen",
  "yer": "bura",
  "not": "702 seviyeli soru (hedef 1000+)"
 },
 {
  "no": 16,
  "metin": "Sorulara kategori, konu, zorluk, beceri ve öğrenme hedefi metadata'sı ekle.",
  "durum": "yapildi",
  "yer": "bura",
  "not": "kategori/grup/seviye/etiket alanları"
 },
 {
  "no": 17,
  "metin": "Kolay, orta, zor ve uzman seviyeleri oluştur.",
  "durum": "yapildi",
  "yer": "bura",
  "not": "kolay-orta-zor-uzman seviye alanı"
 },
 {
  "no": 18,
  "metin": "Adaptif ve rastgele soru seçme sistemi oluştur.",
  "durum": "yapildi",
  "yer": "bura",
  "not": "akademi adaptif + rastgele motor"
 },
 {
  "no": 19,
  "metin": "Sınav değerlendirme ve kategori bazlı analiz motoru oluştur.",
  "durum": "yapildi",
  "yer": "bura",
  "not": "kategori bazlı analiz ekranı"
 },
 {
  "no": 20,
  "metin": "AI ile öğrencinin bilgi seviyesini ve başlangıç seviyesini analiz et.",
  "durum": "kismen",
  "yer": "sunucu",
  "not": "çevrimdışı kural motoru"
 },
 {
  "no": 21,
  "metin": "Öğrenci bilgi haritası ve görsel Skill Tree oluştur.",
  "durum": "kismen",
  "yer": "sunucu",
  "not": "beceri radarı + ağaç"
 },
 {
  "no": 22,
  "metin": "Kişiselleştirilmiş eğitim yol haritası oluştur.",
  "durum": "kismen",
  "yer": "bura",
  "not": "haftalık plan üretimi"
 },
 {
  "no": 23,
  "metin": "Network Security, Linux Security, Python, Web Security, Blue Team, SOC, Cryptography, Digital Forensics, OSINT, Cloud Security, AI Security ve CTF eğitim alanlarını oluştur.",
  "durum": "bekliyor",
  "yer": "kali",
  "not": ""
 },
 {
  "no": 24,
  "metin": "Ders içerik yönetim sistemi ve ders içi quiz sistemi oluştur.",
  "durum": "kismen",
  "yer": "bura",
  "not": "44 bölüm + soru bankası"
 },
 {
  "no": 25,
  "metin": "Adaptif sınav motoru oluştur.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 26,
  "metin": "Doğru ve yanlış cevapların nedenlerini açıklayan “Bana Neden?” modu oluştur.",
  "durum": "yapildi",
  "yer": "bura",
  "not": "Bana Neden? modu"
 },
 {
  "no": 27,
  "metin": "Eksik konu, eksik beceri ve akıllı hatırlatma sistemleri oluştur.",
  "durum": "kismen",
  "yer": "bura",
  "not": "yanlış defteri + tekrar takvimi"
 },
 {
  "no": 28,
  "metin": "Öğrencinin kaldığı yerden devam etmesini sağla.",
  "durum": "yapildi",
  "yer": "sunucu",
  "not": "KALDIĞIM YER + beyin"
 },
 {
  "no": 29,
  "metin": "Günlük, haftalık ve uzun vadeli AI kişiselleştirilmiş çalışma planı oluştur.",
  "durum": "kismen",
  "yer": "bura",
  "not": "günlük + haftalık plan"
 },
 {
  "no": 30,
  "metin": "“Bugünün Görevi”, “Bugün ne çalışmalıyım?”, “Nerede kaldım?” ve “Sırada ne var?” özelliklerini oluştur.",
  "durum": "yapildi",
  "yer": "bura",
  "not": "Bugünün Görevi / Nerede kaldım / Sırada ne var"
 },
 {
  "no": 31,
  "metin": "Motivasyon mesajlarını öğrencinin ilerlemesine göre kişiselleştir ve tekrarını engelle.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 32,
  "metin": "Başarısızlıkta küçümsemeyen, geliştirici mesajlar ve küçük başarıları kutlayan sistem oluştur.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 33,
  "metin": "Oyunlaştırılmış sınav, XP, puan, bonus, ipucu, süre, streak ve seviye sistemlerini oluştur.",
  "durum": "kismen",
  "yer": "bura",
  "not": "XP, seviye, seri, rozet (liderlik sunucu)"
 },
 {
  "no": 34,
  "metin": "Network Defender, SOC Alert, Linux Mission, Web Security Quest, Crypto Puzzle ve Forensics Case mini oyunlarını oluştur.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 35,
  "metin": "Güvenli ve izole sanal terminal/sandbox altyapısı oluştur.",
  "durum": "bekliyor",
  "yer": "kali",
  "not": ""
 },
 {
  "no": 36,
  "metin": "Network, Linux, Web Security, Log Analysis, SOC ve Digital Forensics laboratuvarlarını oluştur.",
  "durum": "bekliyor",
  "yer": "kali",
  "not": ""
 },
 {
  "no": 37,
  "metin": "CTF Arena, kategoriler, flag, puan, seviye ve görev sistemlerini oluştur.",
  "durum": "bekliyor",
  "yer": "kali",
  "not": ""
 },
 {
  "no": 38,
  "metin": "Blue Team/SOC simülasyonu, alarm, log, IOC ve Incident Response senaryolarını oluştur.",
  "durum": "bekliyor",
  "yer": "kali",
  "not": ""
 },
 {
  "no": 39,
  "metin": "Siber Olay Hikâyeleri, Siber Olay Dedektifi ve Siber Güvenlik Vaka Dosyaları oluştur.",
  "durum": "bekliyor",
  "yer": "kali",
  "not": ""
 },
 {
  "no": 40,
  "metin": "İnteraktif karar ağaçları oluştur ve yanlış kararların nedenlerini açıkla.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 41,
  "metin": "AI Siber Güvenlik Öğretmeni, AI soru-cevap, AI açıklama, AI soru/quiz üretme ve AI yanlış cevap analiz sistemlerini oluştur.",
  "durum": "kismen",
  "yer": "bura",
  "not": "kural motoru metinleri"
 },
 {
  "no": 42,
  "metin": "AI Öğrenme Koçu ve AI Sesli Öğretmen oluştur; konuşmalı soru-cevap desteği sağla.",
  "durum": "kismen",
  "yer": "bura",
  "not": "tarayıcı sesi mümkün; kural motoru hazır"
 },
 {
  "no": 43,
  "metin": "Siber Güvenlik Radarı oluştur ve becerileri görselleştir.",
  "durum": "yapildi",
  "yer": "bura",
  "not": "Siber Güvenlik Radarı"
 },
 {
  "no": 44,
  "metin": "Analitik dashboard, soru/ders/lab/CTF/XP istatistikleri, haftalık/aylık grafikler ve AI gelişim raporları oluştur.",
  "durum": "kismen",
  "yer": "kali",
  "not": "karne grafikleri"
 },
 {
  "no": 45,
  "metin": "Güçlü alanlar, zayıf alanlar, eksikler, uzmanlık alanları ve hedef uzmanlığa göre AI beceri açığı analizi oluştur.",
  "durum": "kismen",
  "yer": "bura",
  "not": "zayıf alan + beceri açığı analizi"
 },
 {
  "no": 46,
  "metin": "Spaced Repetition, Akıllı Tekrar Motoru ve Yanlışlar Defteri oluştur.",
  "durum": "yapildi",
  "yer": "bura",
  "not": "aralıklı tekrar + yanlışlar defteri"
 },
 {
  "no": 47,
  "metin": "Periyodik “Kendini Yeniden Test Et” ve ezberlemeyi önleyen alternatif soru üretme sistemlerini oluştur.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 48,
  "metin": "Kişisel hedef, milestone, animasyonlu başarı, avatar, Başarı Merkezi ve Achievement sistemlerini oluştur.",
  "durum": "kismen",
  "yer": "bura",
  "not": "rozet + rütbe sistemi"
 },
 {
  "no": 49,
  "metin": "Kategori rozetleri ve liderlik tablosu oluştur.",
  "durum": "kismen",
  "yer": "sunucu",
  "not": "kategori rozetleri var; liderlik sunucu"
 },
 {
  "no": 50,
  "metin": "Siber Dünya Haritası ve Siber Dünya Haritası 2.0 oluştur.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 51,
  "metin": "Siber Yolculuk Günlüğü oluştur; ilk sınav, ders, lab, CTF, rozet, sertifika ve güncel seviyeyi kronolojik kaydet.",
  "durum": "bekliyor",
  "yer": "kali",
  "not": ""
 },
 {
  "no": 52,
  "metin": "Bölüm final sınavları ve Genel Siber Güvenlik Final Sınavı oluştur.",
  "durum": "kismen",
  "yer": "bura",
  "not": "sınav modu + adaptif sınav"
 },
 {
  "no": 53,
  "metin": "Teori + pratik + laboratuvar + senaryo değerlendirmesi oluştur.",
  "durum": "bekliyor",
  "yer": "kali",
  "not": ""
 },
 {
  "no": 54,
  "metin": "Sertifika uygunluk sistemi oluştur.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 55,
  "metin": "Network, Linux, Python, Web Security, Blue Team, SOC, Cryptography, Digital Forensics, OSINT, CTF ve Final Academy için farklı profesyonel sertifika tasarımları oluştur.",
  "durum": "kismen",
  "yer": "kali",
  "not": "genel + 11 alan sertifika şablonu"
 },
 {
  "no": 56,
  "metin": "Sertifikalarda öğrenci adı, program, skor, seviye, tarih, benzersiz sertifika numarası ve doğrulama kodu göster.",
  "durum": "yapildi",
  "yer": "sunucu",
  "not": "ad, program, skor, seviye, tarih, no, kod"
 },
 {
  "no": 57,
  "metin": "QR kodlu online sertifika doğrulama sistemi oluştur.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 58,
  "metin": "Dijital sertifika kasası ve dijital transkript oluştur.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 59,
  "metin": "PDF sertifika oluşturma, görüntüleme, yazdırma ve paylaşma sistemlerini oluştur.",
  "durum": "kismen",
  "yer": "bura",
  "not": "PNG indirme + yazdırma (PDF: yazdır→PDF)"
 },
 {
  "no": 60,
  "metin": "Profesyonel öğrenci profili ve Cyber Portfolio oluştur.",
  "durum": "kismen",
  "yer": "sunucu",
  "not": "Cyber Portföy modülü"
 },
 {
  "no": 61,
  "metin": "Sertifika, rozet, CTF, laboratuvar ve proje başarılarını portföye ekle.",
  "durum": "bekliyor",
  "yer": "kali",
  "not": ""
 },
 {
  "no": 62,
  "metin": "CV oluşturma ve AI destekli CV analiz/geliştirme sistemi oluştur.",
  "durum": "kismen",
  "yer": "bura",
  "not": "CV üretimi var; AI analiz sunucu işi"
 },
 {
  "no": 63,
  "metin": "LinkedIn ve sosyal paylaşım altyapısı oluştur.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 64,
  "metin": "Kariyer Hazırlık, Siber Kariyer Simülatörü ve Kariyer Uyum Analizi oluştur.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 65,
  "metin": "SOC Analyst, Blue Team, Network Security, Digital Forensics, Cloud Security, AI Security ve Penetration Testing kariyer yollarını oluştur.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 66,
  "metin": "AI iş görüşmesi simülatörü ve teknik mülakat soru bankası oluştur.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 67,
  "metin": "Proje üretim ve proje görev merkezi oluştur.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 68,
  "metin": "Öğrenci seviyesine göre güvenli siber güvenlik projeleri öner ve tamamlanan projeleri portföye ekle.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 69,
  "metin": "Siber Proje Sergisi oluştur.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 70,
  "metin": "Canlı Eğitim Odası oluştur.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 71,
  "metin": "Eğitmenlerin canlı ders açmasını, öğrencilerin katılmasını, soru sormasını ve ders sonunda mini sınav yapılmasını sağla.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 72,
  "metin": "Öğrenci-Mentor sistemi oluştur.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 73,
  "metin": "Takım görevleri ve ekip halinde güvenli senaryo çözme sistemi oluştur.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 74,
  "metin": "Siber Turnuvalar, CTF/SOC turnuvaları ve bilgi yarışmaları oluştur.",
  "durum": "bekliyor",
  "yer": "kali",
  "not": ""
 },
 {
  "no": 75,
  "metin": "Sezon sistemi, sezon görevleri, rozetleri ve başarılarını oluştur.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 76,
  "metin": "Gizli görevler ve başarıya bağlı görev açma sistemi oluştur.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 77,
  "metin": "Siber Escape Room ve Siber Dedektif Modu oluştur.",
  "durum": "bekliyor",
  "yer": "kali",
  "not": ""
 },
 {
  "no": 78,
  "metin": "Dijital Adli Bilişim Laboratuvarını geliştir.",
  "durum": "bekliyor",
  "yer": "kali",
  "not": ""
 },
 {
  "no": 79,
  "metin": "Siber Haber Laboratuvarı oluştur ve güncel siber güvenlik gelişmelerinden güvenli eğitim senaryoları üretme altyapısı hazırla.",
  "durum": "bekliyor",
  "yer": "kali",
  "not": ""
 },
 {
  "no": 80,
  "metin": "AI Kod İnceleme Laboratuvarı oluştur; güvenli eğitim kodlarını analiz et, hataları ve güvenlik sorunlarını açıkla.",
  "durum": "bekliyor",
  "yer": "kali",
  "not": ""
 },
 {
  "no": 81,
  "metin": "Mezuniyet sistemi, Akademi Mezuniyet Sertifikası ve Mezun Profili oluştur.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 82,
  "metin": "Mezunlar Ağı oluştur.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 83,
  "metin": "Eğitmen paneli ve eğitmen analitik sistemini oluştur.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 84,
  "metin": "Yönetici paneli oluştur.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 85,
  "metin": "Öğrenci, eğitmen, kurs, soru, sınav, lab, CTF, rozet, sertifika, AI ve içerik yönetim sistemlerini oluştur.",
  "durum": "bekliyor",
  "yer": "kali",
  "not": ""
 },
 {
  "no": 86,
  "metin": "Arama, filtreleme, bildirim ve duyuru sistemlerini oluştur.",
  "durum": "kismen",
  "yer": "sunucu",
  "not": "arama var; bildirim sunucu"
 },
 {
  "no": 87,
  "metin": "Türkçe ve İngilizce dil desteği oluştur.",
  "durum": "kismen",
  "yer": "bura",
  "not": "Türkçe tam; İngilizce yok"
 },
 {
  "no": 88,
  "metin": "PWA ve mobil uygulamaya hazır API altyapısı oluştur.",
  "durum": "kismen",
  "yer": "sunucu",
  "not": "PWA var; API sunucu işi"
 },
 {
  "no": 89,
  "metin": "Authentication, rol bazlı yetkilendirme ve 2FA oluştur.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 90,
  "metin": "Rate limiting, input validation, session, API ve password güvenliğini uygula.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 91,
  "metin": "Audit Log, backup ve veri bütünlüğü sistemlerini oluştur.",
  "durum": "bekliyor",
  "yer": "kali",
  "not": ""
 },
 {
  "no": 92,
  "metin": "Performans, UX, güvenlik ve accessibility testlerini oluştur.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 93,
  "metin": "Gerçek database/API/data flow kullan; sahte/demo özellikleri mümkün olduğunca kullanma.",
  "durum": "yapildi",
  "yer": "sunucu",
  "not": "gerçek veri, uydurma özellik yok"
 },
 {
  "no": 94,
  "metin": "Gelecekte genişletilebilir modüler mimari oluştur.",
  "durum": "yapildi",
  "yer": "bura",
  "not": "modüler dosya mimarisi"
 },
 {
  "no": 95,
  "metin": "README, kurulum, kullanım, mimari ve API dokümantasyonunu oluştur.",
  "durum": "kismen",
  "yer": "sunucu",
  "not": "OKU-BENI + dokümantasyon klasörü"
 },
 {
  "no": 96,
  "metin": "Versioning, Changelog, Issues ve Roadmap sistemlerini oluştur.",
  "durum": "kismen",
  "yer": "kali",
  "not": "sürüm numaraları takip ediliyor"
 },
 {
  "no": 97,
  "metin": "Baştan sona gerçek kullanıcı yolculuğunu test et.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 98,
  "metin": "Production-ready temizlik, optimizasyon ve GitHub hazırlığını tamamla.",
  "durum": "kismen",
  "yer": "bura",
  "not": "temizlik sürüyor"
 },
 {
  "no": 99,
  "metin": "AI Siber Mentor oluştur; öğrencinin eğitim geçmişine göre kişisel tavsiyeler versin.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 100,
  "metin": "AI Mentor; “Bugün ne öğrenmeliyim?”, “Neden bu soruyu yanlış yaptım?”, “Hangi konuda eksiğim?” ve kariyer hedefleriyle ilgili soruları öğrencinin gerçek verilerine göre yanıtlasın.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 101,
  "metin": "Siber Akademi Ana Komuta Merkezi oluştur.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 102,
  "metin": "Öğrenci, AI, dersler, sınavlar, laboratuvarlar, CTF, Skill Tree, XP, rozetler, sertifikalar, kariyer ve portföy sistemlerini birbirine bağla.",
  "durum": "bekliyor",
  "yer": "kali",
  "not": ""
 },
 {
  "no": 103,
  "metin": "AI Akademi Beyni oluştur.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 104,
  "metin": "Öğrencinin bilgi düzeyini, hedeflerini, derslerini, sınavlarını, hatalarını, laboratuvarlarını, CTF çalışmalarını, becerilerini, rozetlerini, sertifikalarını ve kariyer hedeflerini tek bir AI Öğrenme Profilinde birleştir.",
  "durum": "kismen",
  "yer": "kali",
  "not": "AI öğrenme profili (yerel)"
 },
 {
  "no": 105,
  "metin": "AI Akademi Beyni öğrencinin seviyesini sürekli güncellesin.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 106,
  "metin": "AI Akademi Beyni eksikleri analiz etsin.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 107,
  "metin": "AI Akademi Beyni uygun dersleri önersin.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 108,
  "metin": "AI Akademi Beyni tekrar zamanını belirlesin.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 109,
  "metin": "AI Akademi Beyni öğrencinin sonraki adımını belirlesin.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 110,
  "metin": "AI Akademi Beyni mevcut becerileri kariyer hedefleriyle karşılaştırsın.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 111,
  "metin": "AI Akademi Beyni bütün akademi modüllerini birbirine bağlayan merkezi öğrenme motoru olarak çalışsın.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 112,
  "metin": "Öğrencinin bütün eğitim yolculuğunu kayıt aşamasından mezuniyete kadar takip et.",
  "durum": "kismen",
  "yer": "sunucu",
  "not": "kayıttan bugüne takip yerel"
 },
 {
  "no": 113,
  "metin": "İlk girişten itibaren tüm gelişim kilometre taşlarını kaydet.",
  "durum": "yapildi",
  "yer": "sunucu",
  "not": "kilometre taşları kayıtlı"
 },
 {
  "no": 114,
  "metin": "“Siber Profilin Hazır” ekranını oluştur.",
  "durum": "yapildi",
  "yer": "bura",
  "not": "Siber Profilin Hazır (beyin ekranı)"
 },
 {
  "no": 115,
  "metin": "Başlangıç puanı ile mevcut puanı karşılaştır.",
  "durum": "yapildi",
  "yer": "bura",
  "not": "başlangıç puanı ↔ mevcut puan"
 },
 {
  "no": 116,
  "metin": "Geçmiş ve mevcut seviyeyi karşılaştır.",
  "durum": "yapildi",
  "yer": "bura",
  "not": "geçmiş ↔ mevcut seviye"
 },
 {
  "no": 117,
  "metin": "Gelişimi grafiklerle göster.",
  "durum": "yapildi",
  "yer": "bura",
  "not": "karne grafikleri"
 },
 {
  "no": 118,
  "metin": "Güçlü yönleri ve geliştirilmesi gereken alanları sürekli güncelle.",
  "durum": "yapildi",
  "yer": "bura",
  "not": "güçlü/zayıf sürekli güncellenir"
 },
 {
  "no": 119,
  "metin": "Eğitim yolculuğunun yıllar sonra dahi incelenebilmesini sağla.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 120,
  "metin": "“Herkes aynı yerden başlamaz. ÜSTAD SİBER AKADEMİ önce seni tanır, sonra sana uygun yolu oluşturur.” felsefesini bütün öğrenci deneyimine uygula.",
  "durum": "yapildi",
  "yer": "sunucu",
  "not": "felsefe arayüzde uygulandı"
 },
 {
  "no": 121,
  "metin": "“Dün olduğun kişiden biraz daha ileridesin. Devam et.” gibi kişiselleştirilmiş gelişim mesajları göster.",
  "durum": "yapildi",
  "yer": "bura",
  "not": "tekrar etmeyen motivasyon mesajları"
 },
 {
  "no": 122,
  "metin": "Akademiyi basit bir kurs sitesi değil, tam kapsamlı bir Siber Akademi ekosistemi olarak tasarla.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 123,
  "metin": "Bütün modüllerin gerçek veri alışverişi yapmasını sağla.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 124,
  "metin": "Siber güvenlik eğitimlerinde yalnızca yasal, kontrollü ve izole eğitim ortamları kullan.",
  "durum": "kismen",
  "yer": "kali",
  "not": "yasal+izole lab Kali aşaması"
 },
 {
  "no": 125,
  "metin": "Güvenlik, gizlilik, erişim kontrolü ve veri korumasını temel prensip olarak uygula.",
  "durum": "yapildi",
  "yer": "sunucu",
  "not": "şifreli içerik, yerel veri, erişim perdesi"
 },
 {
  "no": 126,
  "metin": "Bütün modülleri ve kullanıcı rollerini test et.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 127,
  "metin": "Sertifika doğrulama, AI önerileri, laboratuvar izolasyonu, CTF izolasyonu, API ve database güvenliğini test et.",
  "durum": "bekliyor",
  "yer": "kali",
  "not": ""
 },
 {
  "no": 128,
  "metin": "Mobil ve masaüstü deneyimini test et.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 129,
  "metin": "Accessibility kontrollerini tamamla.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 130,
  "metin": "Kod yapısını temizle ve gereksiz dosyaları kaldır.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 131,
  "metin": "Hataları düzelt ve güvenlik açıklarını gider.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 132,
  "metin": "Dokümantasyonu tamamla.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 133,
  "metin": "GitHub README'sini profesyonel hale getir.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 134,
  "metin": "GitHub proje yapısını düzenle.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 135,
  "metin": "Proje sürümünü belirle.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 136,
  "metin": "Changelog ve Roadmap'i güncelle.",
  "durum": "bekliyor",
  "yer": "kali",
  "not": ""
 },
 {
  "no": 137,
  "metin": "Production-ready son kontrolünü gerçekleştir.",
  "durum": "bekliyor",
  "yer": "sunucu",
  "not": ""
 },
 {
  "no": 138,
  "metin": "İlk çalışan sürümü hazırla.",
  "durum": "kismen",
  "yer": "bura",
  "not": "çalışan sürüm: site + APK var"
 },
 {
  "no": 139,
  "metin": "Yeni özelliklerin sonradan eklenebileceği altyapıyı koru.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 140,
  "metin": "Akademiyi uzun vadeli geliştirilebilir bir teknoloji projesi olarak tasarla.",
  "durum": "bekliyor",
  "yer": "bura",
  "not": ""
 },
 {
  "no": 141,
  "metin": "Nihai hedef olarak öğrenciyi tanıyan, seviyesini ölçen, kişisel eğitim yolu oluşturan, ders veren, sınav yapan, hatalarını analiz eden, laboratuvar yaptıran, CTF oynatan, SOC deneyimi sağlayan, AI mentor sunan, kariyer hazırlayan, proje ve portföy oluşturan, başarılarını belgeleyen ve bütün süreci AI Akademi Beyni ile yöneten kapsamlı bir siber güvenlik eğitim ekosistemi oluştur.",
  "durum": "bekliyor",
  "yer": "kali",
  "not": ""
 },
 {
  "no": 142,
  "metin": "Ana slogan: “Bilgini Ölç • Kendini Geliştir • Siber Dünyada Yolunu Çiz”",
  "durum": "yapildi",
  "yer": "bura",
  "not": "Projenin çerçevesi (slogan/felsefe/yolculuk) arayüze işlendi"
 },
 {
  "no": 143,
  "metin": "Akademi felsefesi: “Herkes aynı yerden başlamaz. ÜSTAD SİBER AKADEMİ önce seni tanır, sonra sana uygun yolu oluşturur.”",
  "durum": "yapildi",
  "yer": "bura",
  "not": "Projenin çerçevesi (slogan/felsefe/yolculuk) arayüze işlendi"
 },
 {
  "no": 144,
  "metin": "Son kullanıcı deneyimi:",
  "durum": "yapildi",
  "yer": "bura",
  "not": "Projenin çerçevesi (slogan/felsefe/yolculuk) arayüze işlendi"
 }
];

  var YER = { bura: { simge: '\uD83D\uDCBB', ad: 'BURADA', renk: '#37e0ff' },
              kali: { simge: '\uD83D\uDC09', ad: 'KAL\u0130', renk: '#ff9f1a' },
              sunucu: { simge: '\uD83C\uDF10', ad: 'SUNUCU', renk: '#b14cff' } };
  var DURUM = { yapildi: { simge: '\u2714', ad: 'YAPILDI', renk: '#00e05a' },
                kismen: { simge: '\u25D0', ad: 'KISMEN', renk: '#ffc107' },
                bekliyor: { simge: '\u2610', ad: 'BEKL\u0130YOR', renk: '#ff5470' } };

  function durumAl(no) {
    var v = AK.veri.takip = AK.veri.takip || {};
    if (v[no]) return v[no];
    var k = AK.PROJE.filter(function (x) { return x.no === no; })[0];
    return k ? k['durum'] : 'bekliyor';
  }
  function sayimlar() {
    var s = { yapildi: 0, kismen: 0, bekliyor: 0, bura: 0, kali: 0, sunucu: 0 };
    AK.PROJE.forEach(function (k) {
      s[durumAl(k.no)]++; s[k.yer]++;
    });
    return s;
  }

  AK.modulEkle('takip', function () {
    var s = sayimlar(), toplam = AK.PROJE.length;
    var h = AK.baslik('PROJE TAKİP — 144 KONU', s.yapildi + ' / ' + toplam + ' yapıldı',
      'Master listesinin tamamı (141 madde + slogan, felsefe ve son kullanıcı yolculuğu = <b>144 kalem</b>) '
      + 'burada. Her kalemin <b>durumu</b> ve <b>nerede yapılacağı</b> yazılı. Satıra tıklayınca durum ilerler '
      + '(bekliyor → kısmen → yapıldı) ve bu cihazda saklanır.');

    h += '<div class="akKutular">';
    h += AK.kutu('<h3>YAPILDI</h3><div class="akBuyuk" style="color:#00e05a">' + s.yapildi + '</div>'
      + AK.cubuk(s.yapildi / toplam * 100, '#00e05a') + '<div class="akKucuk">%' + Math.round(s.yapildi / toplam * 100) + ' tamam</div>');
    h += AK.kutu('<h3>KISMEN</h3><div class="akBuyuk" style="color:#ffc107">' + s.kismen + '</div>'
      + AK.cubuk(s.kismen / toplam * 100, '#ffc107') + '<div class="akKucuk">çekirdeği var, tamamlanacak</div>');
    h += AK.kutu('<h3>BEKLİYOR</h3><div class="akBuyuk" style="color:#ff5470">' + s.bekliyor + '</div>'
      + AK.cubuk(s.bekliyor / toplam * 100, '#ff5470') + '<div class="akKucuk">henüz başlanmadı</div>');
    h += AK.kutu('<h3>NERE YAPILACAK</h3><div class="akKucuk">'
      + '\uD83D\uDCBB burada (tarayıcı): <b>' + s.bura + '</b><br>'
      + '\uD83D\uDC09 Kali (sanal makine): <b>' + s.kali + '</b><br>'
      + '\uD83C\uDF10 sunucu (cPanel/VPS): <b>' + s.sunucu + '</b></div>');
    h += '</div>';

    h += '<div class="akDugSira" style="margin-top:14px">'
      + '<button class="akDug" data-f="tum">TÜMÜ (' + toplam + ')</button>'
      + '<button class="akDug" data-f="yapildi">\u2714 YAPILDI (' + s.yapildi + ')</button>'
      + '<button class="akDug" data-f="kismen">\u25D0 KISMEN (' + s.kismen + ')</button>'
      + '<button class="akDug" data-f="bekliyor">\u2610 BEKLİYOR (' + s.bekliyor + ')</button>'
      + '<button class="akDug" data-f="bura">\uD83D\uDCBB BURADA (' + s.bura + ')</button>'
      + '<button class="akDug" data-f="kali">\uD83D\uDC09 KALİ (' + s.kali + ')</button>'
      + '<button class="akDug" data-f="sunucu">\uD83C\uDF10 SUNUCU (' + s.sunucu + ')</button>'
      + '</div>';

    h += '<div id="akTakipListe" style="margin-top:12px"></div>';
    h += '<div class="akDugSira" style="margin-top:12px">'
      + '<button class="akDug akIkincil" id="akTakipIndir">\u2B07 LİSTEYİ İNDİR (.txt)</button>'
      + '<button class="akDug" id="akTakipYaz">\uD83D\uDDA8 YAZDIR</button>'
      + '<button class="akDug akKapat" id="akTakipSifirla">\u21BA İŞARETLERİ SIFIRLA</button>'
      + '</div>';
    h += '<div class="akNot akUyari" style="margin-top:12px">Bu ekranın durumları <b>kanıta dayalı</b> işaretlendi: '
      + 'yalnızca gerçekten çalışan, dosyası ve ekran görüntüsü olan işler “yapıldı” sayıldı. '
      + 'ŞüPHEN olanlar “kısmen”, henüz dokunulmayanlar “bekliyor” olarak duruyor.</div>';

    ic().innerHTML = h;
    AK._takipFiltre = 'tum';
    takipListe();
    $$('[data-f]').forEach(function (b) {
      b.onclick = function () {
        AK._takipFiltre = b.getAttribute('data-f');
        $$('[data-f]').forEach(function (x) { x.classList.remove('akIkincil'); });
        b.classList.add('akIkincil');
        takipListe();
      };
    });
    $$('[data-f]')[0].classList.add('akIkincil');
    document.getElementById('akTakipIndir').onclick = takipIndir;
    document.getElementById('akTakipYaz').onclick = takipYazdir;
    document.getElementById('akTakipSifirla').onclick = function () {
      if (!confirm('Takip işaretleri başlangıç durumuna dönecek. Emin misin?')) return;
      AK.veri.takip = {}; AK.kaydet(); AK.git('takip');
    };
  });

  function takipListe() {
    var f = AK._takipFiltre || 'tum';
    var liste = AK.PROJE.filter(function (k) {
      if (f === 'tum') return true;
      if (f === 'bura' || f === 'kali' || f === 'sunucu') return k.yer === f;
      return durumAl(k.no) === f;
    });
    var h = '<div class="akListe"><div class="akSatirUst"><span>NO</span><span>KONU</span>'
      + '<span class="akSag">YER \u00B7 DURUM (' + liste.length + ' kalem)</span></div>';
    liste.forEach(function (k) {
      var d = durumAl(k.no), y = YER[k.yer], dd = DURUM[d];
      h += '<div class="akSatir" data-no="' + k.no + '" style="cursor:pointer;flex-wrap:wrap">'
        + '<span class="akNo">' + k.no + '.</span>'
        + '<span style="flex:1 1 320px">' + kac(k.metin)
        + (k['not'] ? '<br><span style="color:var(--ak-soluk);font-size:11.5px">\u21B3 ' + kac(k['not']) + '</span>' : '')
        + '</span>'
        + '<span class="akSag" style="white-space:nowrap">'
        + '<span style="color:' + y.renk + '">' + y.simge + ' ' + y.ad + '</span> \u00B7 '
        + '<span style="color:' + dd.renk + '">' + dd.simge + ' ' + dd.ad + '</span></span></div>';
    });
    h += '</div>';
    document.getElementById('akTakipListe').innerHTML = h;
    $$('#akTakipListe .akSatir[data-no]').forEach(function (r) {
      r.onclick = function () {
        var no = parseInt(r.getAttribute('data-no'), 10);
        var d = durumAl(no);
        var yeni = d === 'bekliyor' ? 'kismen' : (d === 'kismen' ? 'yapildi' : 'bekliyor');
        AK.veri.takip[no] = yeni; AK.kaydet();
        AK.git('takip');
      };
    });
  }

  function takipMetni() {
    var s = sayimlar();
    var t = 'ÜSTAD SİBER AKADEMİ — PROJE TAKİP (144 KONU)\n'
      + 'Özet: yapıldı ' + s.yapildi + ' · kısmen ' + s.kismen + ' · bekliyor ' + s.bekliyor
      + ' · burada ' + s.bura + ' · Kali ' + s.kali + ' · sunucu ' + s.sunucu + '\n'
      + '='.repeat(78) + '\n';
    AK.PROJE.forEach(function (k) {
      t += String(k.no).padStart(3, ' ') + '. [' + (durumAl(k.no) === 'yapildi' ? 'X' : (durumAl(k.no) === 'kismen' ? '~' : ' ')) + '] '
        + '[' + k.yer.toUpperCase() + '] ' + k.metin + (k['not'] ? '  (' + k['not'] + ')' : '') + '\n';
    });
    return t;
  }
  function takipIndir() {
    var b = new Blob([takipMetni()], { type: 'text/plain;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = 'USTAD-SIBER-AKADEMI-144-KONU.txt';
    document.body.appendChild(a); a.click(); a.remove();
    AK.not('✔ Liste indirildi.', 'iyi');
  }
  function takipYazdir() {
    var w = window.open('', '_blank');
    if (!w) { AK.not('Açılır pencere engellendi.', 'kotu'); return; }
    var s = sayimlar();
    var h = '<html><head><meta charset="utf-8"><title>144 Konu</title><style>'
      + 'body{font-family:"Segoe UI",Arial,sans-serif;color:#12212f;padding:26px;font-size:12px}'
      + 'h1{font-size:19px}h2{font-size:12px;color:#6b5a24;font-weight:400}'
      + 'table{border-collapse:collapse;width:100%}th,td{border-bottom:1px solid #ddd;padding:4px 5px;text-align:left;vertical-align:top}'
      + '.no{width:34px;font-family:Consolas,monospace}.yer{width:70px;font-family:Consolas,monospace}'
      + '.d{width:70px;font-family:Consolas,monospace}</style></head><body>';
    h += '<h1>ÜSTAD SİBER AKADEMİ — PROJE TAKİP (144 KONU)</h1>';
    h += '<h2>yapıldı ' + s.yapildi + ' · kısmen ' + s.kismen + ' · bekliyor ' + s.bekliyor
      + ' · burada ' + s.bura + ' · Kali ' + s.kali + ' · sunucu ' + s.sunucu + ' · ' + AK.trTarih() + '</h2>';
    h += '<table><tr><th class="no">No</th><th>Konu</th><th class="yer">Yer</th><th class="d">Durum</th></tr>';
    AK.PROJE.forEach(function (k) {
      h += '<tr><td class="no">' + k.no + '.</td><td>' + kac(k.metin) + (k['not'] ? ' <i>(' + kac(k['not']) + ')</i>' : '')
        + '</td><td class="yer">' + k.yer.toUpperCase() + '</td><td class="d">' + durumAl(k.no).toUpperCase() + '</td></tr>';
    });
    h += '</table><script>window.onload=function(){setTimeout(function(){window.print();},400);}<\/script></body></html>';
    w.document.write(h); w.document.close();
  }
})();
