/* ==========================================================================
   ÜSTAD AKADEMİ SİTESİ — LABORATUVARLAR & CTF (akademi-lab.js)
   Master liste: 36 (6 laboratuvar) · 37 (CTF Arena) · 38 (SOC simülasyonu) ·
   39 (olay hikâyeleri / vaka dosyaları) · 40 (karar ağaçları) ·
   78 (adli bilişim laboratuvarı) · 79 (siber haber laboratuvarı) ·
   80 (AI kod inceleme laboratuvarı)
   ========================================================================== */
(function () {
  'use strict';
  if (!window.AK) return;
  var AK = window.AK, kac = AK.kac;

  AK.MODUL.push({ id: 'lab', simge: '\uD83E\uDDEA', ad: 'LABORATUVARLAR', alt: '6 lab + CTF + SOC' });
  AK.RENK.lab = '#59a9ff';

  /* ------------------------------ 36: 6 LABORATUVAR ----------------------- */
  var LABLAR = [
    {
      id: 'lab_ag', ad: 'A\u011E LABORATUVARI', alan: 'network', seviye: 'orta',
      gorev: '192.168.1.0/24 a\u011F\u0131nda izinsiz cihaz ve a\u00E7\u0131k portlar\u0131 tespit et.',
      adimlar: [
        { soru: '\u00D6nce hangi komutla a\u011F\u0131 ke\u015Ffedersin?', secenekler: ['nmap -sn 192.168.1.0/24', 'rm -rf /', 'cat /etc/hostname', 'ping google.com'], dogru: 0, neden: '-sn yaln\u0131z canl\u0131 cihaz taramas\u0131 (ping sweep) yapar.' },
        { soru: 'Bir cihazda 23 numaral\u0131 port a\u00E7\u0131k. Bu ne demek?', secenekler: ['Telnet a\u00E7\u0131k \u2014 \u015Fifresiz y\u00F6netim, KAPAT', 'G\u00FCvenli, dokunma', 'Yaz\u0131c\u0131 portu', 'Zaman sunucusu'], dogru: 0, neden: 'Telnet \u015Fifresizdir; SSH ile de\u011Fi\u015Ftirilmeli.' },
        { soru: 'Sonu\u00E7lar\u0131 nas\u0131l saklars\u0131n?', secenekler: ['nmap -oA tarama_raporu ...', 'Ekrandan not al', 'Hi\u00E7 saklama', 'Yaz\u0131c\u0131dan \u00E7\u0131kar'], dogru: 0, neden: '-oA t\u00FCm formatlarda (normal/xml/grep) rapor kaydeder.' }
      ]
    },
    {
      id: 'lab_linux', ad: 'LINUX LABORATUVARI', alan: 'linux', seviye: 'kolay',
      gorev: 'Yetkisiz eri\u015Fim \u015F\u00FCphesi olan sunucuda ilk kontrol\u00FC yap.',
      adimlar: [
        { soru: 'Hangi kullan\u0131c\u0131lar\u0131n kabu\u011Fu var?', secenekler: ['cat /etc/passwd', 'ls /home', 'whoami', 'uname -a'], dogru: 0, neden: '/etc/passwd kullan\u0131c\u0131 + kabuk bilgisi verir.' },
        { soru: 'Son ba\u015Far\u0131l\u0131 giri\u015Fleri g\u00F6r', secenekler: ['last -n 20', 'df -h', 'top', 'free -m'], dogru: 0, neden: 'last giri\u015F kay\u0131tlar\u0131n\u0131 listeler.' },
        { soru: 'Yeni eklenmi\u015F SUID dosya var m\u0131?', secenekler: ['find / -perm -4000 -newer /etc/hostname 2>/dev/null', 'chmod 777 -R /', 'ls -l', 'du -sh /'], dogru: 0, neden: 'SUID + yak\u0131n tarih = \u015F\u00FCpheli kal\u0131c\u0131l\u0131k.' }
      ]
    },
    {
      id: 'lab_web', ad: 'WEB LABORATUVARI', alan: 'web', seviye: 'orta',
      gorev: 'Kendi test sitende giri\u015F formunu g\u00FCvenli h\u00E2le getir (izole ortam).',
      adimlar: [
        { soru: 'SQL enjeksiyonunu engellemek i\u00E7in?', secenekler: ['Parametreli sorgu (prepared statement)', 'Girdiyi sadece 200 karaktere kes', 'JavaScript ile gizle', 'Hata mesajlar\u0131n\u0131 kapat'], dogru: 0, neden: 'Parametreli sorgu veriyi kod saymaz.' },
        { soru: 'XSS i\u00E7in do\u011Fru savunma?', secenekler: ['\u00C7\u0131kt\u0131y\u0131 kaç\u0131r + Content-Security-Policy', 'Girdiyi b\u00FCy\u00FCk harfe \u00E7evir', 'Yaln\u0131z Chrome\u2019da \u00E7al\u0131\u015Ft\u0131r', 'Resim y\u00FCklemeyi kapat'], dogru: 0, neden: 'Hem ka\u00E7\u0131\u015F hem CSP gerekir.' },
        { soru: 'Oturum g\u00FCvenli\u011Fi i\u00E7in?', secenekler: ['HttpOnly + Secure + SameSite \u00E7erez', '\u00C7erezi localStorage\u2019a koy', 'S\u00FCresiz \u00E7erez', 'Token\u2019\u0131 URL\u2019ye yaz'], dogru: 0, neden: 'HttpOnly XSS ile \u00E7erez \u00E7almay\u0131 engeller.' }
      ]
    },
    {
      id: 'lab_log', ad: 'LOG ANAL\u0130Z LABORATUVARI', alan: 'blueteam', seviye: 'orta',
      gorev: 'Web sunucu logundan sald\u0131r\u0131 izini \u00E7\u0131kar.',
      adimlar: [
        { soru: 'Log sat\u0131r\u0131: 404 ... /wp-login.php?user=admin\' -- Aranan ne?', secenekler: ['SQL enjeksiyon denemesi', 'Normal ziyaret', 'Yedekleme', 'CDN iste\u011Fi'], dogru: 0, neden: 'T\u0131rnak + yorum = enjeksiyon denemesi.' },
        { soru: 'Ayn\u0131 IP\u2019den 500 istek / 1 dakika \u2014 ilk aksiyon?', secenekler: ['IP\u2019yi ge\u00E7ici blokla + incele', 'Sunucuyu yeniden ba\u015Flat', 'Logu sil', 'Hi\u00E7bir \u015Fey'], dogru: 0, neden: '\u00D6nce zarar\u0131 durdur, sonra incele.' },
        { soru: 'Kal\u0131c\u0131 \u00F6nlem?', secenekler: ['WAF kural\u0131 + oran s\u0131n\u0131r\u0131 (rate limit)', 'Port de\u011Fi\u015Ftir', 'Sunucuyu kapat', 'Sadece log tut'], dogru: 0, neden: 'WAF + rate limit tekrar\u0131n\u0131 engeller.' }
      ]
    },
    {
      id: 'lab_soc', ad: 'SOC LABORATUVARI', alan: 'blueteam', seviye: 'ileri',
      gorev: 'SIEM alarm\u0131n\u0131 \u00FC\u00E7 a\u015Famada ele al: do\u011Frula, s\u0131n\u0131rla, raporla.',
      adimlar: [
        { soru: 'Alarm: 40 farkl\u0131 alt alan ad\u0131na DNS iste\u011Fi. \u0130lk ad\u0131m?', secenekler: ['DNS logunu ve alan adlar\u0131n\u0131 incele', 'Antivir\u00FCs\u00FC kapat', 'Makineyi formatla', 'Kullan\u0131c\u0131y\u0131 sil'], dogru: 0, neden: '\u00D6nce kan\u0131t topla (triage).' },
        { soru: 'C2 \u015F\u00FCphesi do\u011Fruysa?', secenekler: ['Makineyi a\u011Fdan izole et', 'Bekle', 'Logu sil', 'Devam et'], dogru: 0, neden: 'Yay\u0131lmay\u0131 \u00F6nlemek i\u00E7in izolasyon.' },
        { soru: 'Rapor i\u00E7in gerekli olan?', secenekler: ['Zaman \u00E7izelgesi + IOC + etki', 'Sadece ekran g\u00F6r\u00FCnt\u00FCs\u00FC', 'S\u00F6zl\u00FC anlat\u0131m', 'Hi\u00E7biri'], dogru: 0, neden: 'Olay m\u00FCdahale raporu kan\u0131t ve zaman ister.' }
      ]
    },
    {
      id: 'lab_adli', ad: 'ADL\u0130 B\u0130L\u0130\u015E\u0130M LABORATUVARI', alan: 'adli', seviye: 'ileri',
      gorev: 'Bir USB imaj\u0131ndan delil \u00E7\u0131kar (78. madde).',
      adimlar: [
        { soru: 'Delil b\u00FCt\u00FCl\u00FC\u011F\u00FC ilk nas\u0131l sa\u011Flan\u0131r?', secenekler: ['sha256sum ile hash al, yaz', 'Dosyay\u0131 a\u00E7 ve bak', 'Kopyala yeter', 'S\u0131k\u0131\u015Ft\u0131r'], dogru: 0, neden: 'Hash, delilin de\u011Fi\u015Fmedi\u011Fini kan\u0131tlar.' },
        { soru: 'Silinmi\u015F dosya izi i\u00E7in?', secenekler: ['İmaj \u00FCzerinde \u00E7al\u0131\u015F (write-blocker)', 'Orijinal diske yaz', 'Format at', 'Kullan\u0131c\u0131ya sor'], dogru: 0, neden: 'Orijinal delile yaz\u0131lmaz; imaj kopyas\u0131 kullan\u0131l\u0131r.' },
        { soru: 'Zaman \u00E7izelgesi neden gerekli?', secenekler: ['Olay s\u0131ras\u0131n\u0131 kan\u0131tlar', 'S\u00FCsleme', 'Dosya boyutu i\u00E7in', 'Gerekli de\u011Fil'], dogru: 0, neden: 'Mahkemede olay s\u0131ras\u0131 kritik.' }
      ]
    }
  ];

  /* ------------------------------ 37: CTF ARENA --------------------------- */
  var CTF = [
    { kat: 'Kripto', ad: 'Base64 a\u00E7', soru: 'dXN0YWQ=', cevap: 'ustad', puan: 20, ipucu: 'Base64 \u00E7\u00F6z\u00FCc\u00FC' },
    { kat: 'Kripto', ad: 'ROT13', soru: 'HFGNQ', cevap: 'ustad', puan: 20, ipucu: '13 harf kayd\u0131r (ROT13)' },
    { kat: 'Web', ad: 'Zafiyet ad\u0131', soru: 'Ba\u015Fka siteden gelen istekle i\u015Flem yapt\u0131rma (TR k\u0131saltma)', cevap: 'csrf', puan: 25, ipucu: 'C S R F' },
    { kat: 'Web', ad: 'Port bulma', soru: 'HTTPS varsay\u0131lan port', cevap: '443', puan: 15, ipucu: '' },
    { kat: 'Linux', ad: 'Dosya izni', soru: 'chmod 755 \u2192 sahibi ne yapabilir? (okuma=5 yazma=2 \u00E7al\u0131\u015Ft\u0131rma=1, ilk hane)', cevap: '7', puan: 15, ipucu: '4+2+1' },
    { kat: 'Linux', ad: 'Log yeri', soru: 'Debian/Ubuntu\u2019da kimlik do\u011Frulama log dosyas\u0131 ad\u0131', cevap: 'auth.log', puan: 25, ipucu: '/var/log/ alt\u0131nda' },
    { kat: 'Adli', ad: 'B\u00FCt\u00FCl\u00FCk', soru: 'Delil b\u00FCt\u00FCl\u00FC\u011F\u00FC i\u00E7in kullan\u0131lan 6 karakterlik k\u0131saltma (\u015Fu an) \u2192 "sha256"', cevap: 'sha256', puan: 20, ipucu: '' },
    { kat: 'A\u011F', ad: 'Telnet', soru: 'Telnet portu', cevap: '23', puan: 15, ipucu: '' },
    { kat: 'A\u011F', ad: 'El s\u0131k\u0131\u015Fma', soru: 'TCP \u00FC\u00E7l\u00FC el s\u0131k\u0131\u015Fmas\u0131n\u0131n ilk paketi (k\u0131saltma)', cevap: 'syn', puan: 25, ipucu: 'S Y N' },
    { kat: 'SOC', ad: 'IOC', soru: 'Sald\u0131r\u0131 g\u00F6stergesi anlam\u0131na gelen 3 harfli k\u0131saltma', cevap: 'ioc', puan: 20, ipucu: '' }
  ];

  /* --------------------------- 38: SOC simülasyonu ------------------------ */
  var OLAY_ADIM = [
    'Alarm\u0131 do\u011Frula (log + kullan\u0131c\u0131 davran\u0131\u015F\u0131)',
    'Etki alan\u0131n\u0131 belirle (hangi makineler)',
    'Yay\u0131lmay\u0131 s\u0131n\u0131rla (a\u011F izolasyonu, hesap kilitleme)',
    'Kan\u0131t topla (imaj, log, IOC)',
    'Temizle ve geri al (yama, parola, kal\u0131c\u0131l\u0131k temizli\u011Fi)',
    'Raporla ve ders \u00E7\u0131kar'
  ];
  var IOC_LISTE = [
    { ad: '203.0.113.9', tur: 'IP adresi' }, { ad: 'superupdate.exe', tur: 'Dosya ad\u0131' },
    { ad: 'update-servis.xyz', tur: 'Alan ad\u0131' }, { ad: 'a3f5c1...9b (dosya \u00F6zeti)', tur: 'Hash' },
    { ad: 'HKCU\\Run\\Updater', tur: 'Kay\u0131t defteri anahtar\u0131' }
  ];

  /* --------------------------- 39: vaka dosyaları ------------------------- */
  var VAKALAR = [
    { ad: 'VAKA 1 \u2014 Fidye Yaz\u0131l\u0131m\u0131', ozet: 'Muhasebe sunucusundaki dosyalar \u015Fifrelendi; fidye notu masa\u00FCst\u00FCnde.',
      sorular: [
        { s: 'En olas\u0131 giri\u015F yolu?', c: ['\u0130nternete a\u00E7\u0131k RDP', 'Fare ar\u0131zas\u0131', 'Yaz\u0131c\u0131 s\u00FCr\u00FCc\u00FCs\u00FC', 'E-posta kotas\u0131'], d: 0 },
        { s: 'Fidyeyi \u00F6demek neden \u00F6nerilmez?', c: ['\u00D6deme \u00E7\u00F6z\u00FCm garantisi vermez ve hedef g\u00F6sterir', 'Pahal\u0131', 'Yava\u015F', 'Yasak de\u011Fil'], d: 0 },
        { s: 'Do\u011Fru ilk ad\u0131m?', c: ['Etkilenen sistemleri a\u011Fdan ay\u0131r', 'Fidye \u00F6de', 'Format at', 'Bekle'], d: 0 }
      ] },
    { ad: 'VAKA 2 \u2014 Kimlik Av\u0131', ozet: 'Personel, banka gibi g\u00F6r\u00FCnen bir e-postadaki ba\u011Flant\u0131ya t\u0131klad\u0131 ve parolas\u0131n\u0131 girdi.',
      sorular: [
        { s: 'Bu sald\u0131r\u0131 t\u00FCr\u00FC?', c: ['Kimlik av\u0131 (phishing)', 'DDOS', 'Fiziksel h\u0131rs\u0131zl\u0131k', 'Yaz\u0131l\u0131m hatas\u0131'], d: 0 },
        { s: 'Hemen ne yap\u0131l\u0131r?', c: ['Parolay\u0131 de\u011Fi\u015Ftir + oturumlar\u0131 kapat + MFA', 'Bekle', 'E-postay\u0131 sil', 'G\u00F6rmezden gel'], d: 0 },
        { s: 'Kal\u0131c\u0131 \u00F6nlem?', c: ['MFA + e-posta do\u011Frulama (SPF/DKIM/DMARC) + e\u011Fitim', 'Antivir\u00FCs', 'Daha b\u00FCy\u00FCk disk', 'G\u00FC\u00E7l\u00FC parola yeter'], d: 0 }
      ] },
    { ad: 'VAKA 3 \u2014 \u0130\u00E7eriden Tehdit', ozet: 'Ayr\u0131lma s\u00FCrecindeki bir \u00E7al\u0131\u015Fan gece toplu dosya kopyalad\u0131.',
      sorular: [
        { s: 'Hangi kontrol bunu yakalar?', c: ['UEBA / veri kayb\u0131 \u00F6nleme (DLP)', 'Firewall', 'Antivir\u00FCs', 'Yedek'], d: 0 },
        { s: '\u00D6nleyici kontrol?', c: ['Ayr\u0131lan personelin eri\u015Fimini ayn\u0131 g\u00FCn kesmek', 'Daha h\u0131zl\u0131 a\u011F', 'Yeni yaz\u0131c\u0131', 'Daha \u00E7ok disk'], d: 0 }
      ] },
    { ad: 'VAKA 4 \u2014 Tedarik Zinciri', ozet: 'Kullan\u0131lan bir yaz\u0131l\u0131m\u0131n g\u00FCncellemesiyle kurum i\u00E7ine arka kap\u0131 bula\u015Ft\u0131.',
      sorular: [
        { s: 'Do\u011Fru yakla\u015F\u0131m?', c: ['Yaz\u0131l\u0131m envanteri + g\u00FCncel imza/hash do\u011Frulamas\u0131', 'T\u00FCm yaz\u0131l\u0131mlar\u0131 kald\u0131r', 'G\u00FCncelleme yapma', 'Bekle'], d: 0 },
        { s: 'En kritik ders?', c: ['G\u00FCven zinciri: kaynak ve b\u00FCt\u00FCl\u00FCk do\u011Frulamas\u0131', 'Daha h\u0131zl\u0131 internet', 'Daha fazla kullan\u0131c\u0131', 'Sadece antivir\u00FCs'], d: 0 }
      ] }
  ];

  /* --------------------------- 40: karar ağaçları ------------------------- */
  var AGAC = {
    baslangic: { metin: 'Bilgisayar\u0131n yava\u015Flad\u0131, disk %100 dolu g\u00F6r\u00FCn\u00FCyor. Ne yapars\u0131n?',
      secenekler: [{ ad: 'Diskte en \u00E7ok yer kaplayan\u0131 bul', git: 'incele' }, { ad: 'Format at', git: 'format' }, { ad: 'G\u00F6rmezden gel', git: 'bekle' }] },
    incele: { metin: 'Beklenmeyen bir klas\u00F6r: /tmp/.cache9 i\u00E7inde 40 GB \u015Fifreli dosya. Ne yapars\u0131n?',
      secenekler: [{ ad: 'Hash al, logla, incele (delil)', git: 'dogru' }, { ad: 'Hemen sil', git: 'hata_sil' }, { ad: 'A\u00E7 ve \u00E7al\u0131\u015Ft\u0131r', git: 'hata_calistir' }] },
    format: { metin: 'Format delili yok eder ve k\u00F6k nedeni bulmaz. Bu bir hatad\u0131r.', son: true,
      ders: 'Format son \u00E7aredir; \u00F6nce kan\u0131t topla, sonra temizle.' },
    bekle: { metin: 'Beklemek sald\u0131r\u0131ya zaman kazand\u0131r\u0131r.', son: true, ders: 'Belirti g\u00F6rmezden gelinmez: yava\u015Flama da bulgu olabilir.' },
    hata_sil: { metin: 'Delili silmek incelemeyi bitirir ama sald\u0131rgan h\u00E2l\u00E2 i\u00E7eride olabilir.', son: true,
      ders: 'Silmeden \u00F6nce imaj/hash ile kan\u0131t al.' },
    hata_calistir: { metin: 'Bilinmeyen dosyay\u0131 \u00E7al\u0131\u015Ft\u0131rd\u0131n \u2014 zararl\u0131 yaz\u0131l\u0131m yay\u0131ld\u0131.', son: true,
      ders: 'Bilinmeyen \u00E7al\u0131\u015Ft\u0131r\u0131labilir dosya izole ortamda a\u00E7\u0131l\u0131r.' },
    dogru: { metin: '\u2705 Do\u011Fru yol: kan\u0131t\u0131 korudun, sald\u0131rgan\u0131 ara\u015Ft\u0131rabilirsin. Kal\u0131c\u0131l\u0131\u011F\u0131 (cron/startup) da kontrol et.', son: true,
      ders: 'Kan\u0131t \u2192 analiz \u2192 temizlik s\u0131ras\u0131 do\u011Frudur.' }
  };

  /* --------------------------- 79/80: özel laboratuvarlar ----------------- */
  var KOD_ORNEK = [
    { dil: 'Python', kod: 'kullanici = input()\nsorgu = "SELECT * FROM uye WHERE ad=\'" + kullanici + "\'"', zafiyet: 'SQL enjeksiyonu', neden: 'Girdi sorguya ekleniyor; parametreli sorgu gerekir.' },
    { dil: 'JavaScript', kod: 'document.getElementById("yorum").innerHTML = gelenYorum;', zafiyet: 'XSS', neden: 'innerHTML ka\u00E7\u0131\u015Fs\u0131z; textContent kullan\u0131lmal\u0131.' },
    { dil: 'Python', kod: 'subprocess.run("ping " + ip, shell=True)', zafiyet: 'Komut enjeksiyonu', neden: 'shell=True + birle\u015Ftirme; liste bi\u00E7imi kullan\u0131lmal\u0131.' },
    { dil: 'PHP', kod: '$dosya = $_GET["d"];\nreadfile("/veri/" . $dosya);', zafiyet: 'Yol gezinme (LFI)', neden: 'D\u0131\u015Far\u0131dan gelen yol do\u011Frulanm\u0131yor.' },
    { dil: 'Python', kod: 'data = yaml.load(kullanici_girdisi)', zafiyet: 'G\u00FCvensiz deserializasyon', neden: 'yaml.safe_load kullan\u0131lmal\u0131.' }
  ];
  var HABER = [
    { baslik: 'Hastane zinciri fidye yaz\u0131l\u0131m\u0131 nedeniyle sistemleri kapatt\u0131', ders: 'Kritik altyap\u0131da yedek + segmentasyon hayat kurtar\u0131r.', soru: 'Fidye yaz\u0131l\u0131m\u0131ndan sonra ilk ad\u0131m?', c: ['Etkilenenleri izole et', 'Fidye \u00F6de', 'T\u00FCm a\u011F\u0131 kapat'], d: 0 },
    { baslik: 'Pop\u00FCler bir npm paketine zararl\u0131 kod eklendi', ders: 'Tedarik zinciri: ba\u011F\u0131ml\u0131l\u0131k s\u00FCr\u00FCmlerini kilitle ve imza do\u011Frula.', soru: 'Risk nedir?', c: ['Tedarik zinciri sald\u0131r\u0131s\u0131', 'Disk ar\u0131zas\u0131', 'A\u011F gecikmesi'], d: 0 },
    { baslik: 'Sald\u0131rganlar VPN cihaz\u0131ndaki yamalanmam\u0131\u015F a\u00E7\u0131\u011F\u0131 kulland\u0131', ders: 'Yama y\u00F6netimi: kritik a\u00E7\u0131klar i\u00E7in son tarih koy.', soru: 'En do\u011Fru \u00F6nlem?', c: ['Yama + varl\u0131k envanteri', 'Daha g\u00FC\u00E7l\u00FC parola', 'Yeni cihaz'], d: 0 },
    { baslik: 'Kimlik av\u0131 e-postalar\u0131 \u00E7al\u0131\u015Fanlar\u0131 hedef ald\u0131', ders: 'Fark\u0131ndal\u0131k e\u011Fitimi + MFA en etkili ikili.', soru: '\u0130lk savunma?', c: ['Fark\u0131ndal\u0131k e\u011Fitimi + MFA', 'Antivir\u00FCs', 'G\u00FC\u00E7l\u00FC parola tek ba\u015F\u0131na'], d: 0 }
  ];

  /* ------------------------------- çizim --------------------------------- */
  function kart(id, ad, aciklama) {
    return '<div class="akKutu" style="margin-bottom:8px"><div style="display:flex;gap:10px;align-items:center">'
      + '<div style="flex:1"><b>' + kac(ad) + '</b><div class="akSoluk" style="font-size:12.4px">' + kac(aciklama) + '</div></div>'
      + '<button class="akDug" data-bolum="' + id + '">A\u00C7</button></div></div>';
  }
  function bitir(ad, puan, toplam, xp, geriId) {
    AK.veri.labTamam = AK.veri.labTamam || [];
    AK.veri.labTamam.push({ ad: ad, t: Date.now(), puan: puan, toplam: toplam });
    AK.xpEkle(xp, 'Lab: ' + ad);
    AK.veri.milestone = AK.veri.milestone || [];
    AK.veri.milestone.push({ ad: 'Lab tamamland\u0131: ' + ad + ' (' + puan + '/' + toplam + ')', t: Date.now() });
    AK.kaydet();
    if (AK.gorevKontrol) AK.gorevKontrol();
    return AK.kutu('<div style="font-size:16px">Sonu\u00E7: <b>' + puan + '/' + toplam + '</b> \u00B7 %'
      + Math.round(puan / toplam * 100) + '</div>' + AK.cubuk(puan / toplam * 100, AK.RENK.lab)
      + '<div class="akDugSira"><button class="akDug" id="labGeri">' + kac(geriId || 'LABORATUVARLAR') + '</button></div>');
  }

  /* adım adım lab oynatıcı */
  function labOyna(lab) {
    var ic = AK.icerik, i = 0, puan = 0;
    function ciz() {
      if (i >= lab.adimlar.length) {
        ic.innerHTML = AK.baslik(lab.ad, 'tamamland\u0131', lab.gorev);
        ic.innerHTML += bitir(lab.ad, puan, lab.adimlar.length, puan * 15);
        return;
      }
      var a = lab.adimlar[i];
      ic.innerHTML = AK.baslik(lab.ad, (i + 1) + ' / ' + lab.adimlar.length, lab.gorev);
      ic.innerHTML += AK.kutu('<div style="font-weight:700;margin-bottom:8px">' + kac(a.soru) + '</div>'
        + '<div class="akDugSira" style="flex-direction:column;align-items:stretch">'
        + a.secenekler.map(function (s, k) {
          return '<button class="akDug akMono" style="text-align:left" data-v="' + k + '">' + kac(s) + '</button>';
        }).join('') + '</div>');
      AK.$$('[data-v]').forEach(function (b) {
        b.onclick = function () {
          var dogru = parseInt(b.getAttribute('data-v'), 10) === a.dogru;
          if (dogru) puan++;
          AK.not((dogru ? '\u2705 ' : '\u274C ') + a.neden, dogru ? 'iyi' : 'kotu');
          i++; ciz();
        };
      });
    }
    ciz();
  }

  /* CTF oynatıcı */
  function ctfOyna() {
    var ic = AK.icerik;
    AK.veri.ctf = AK.veri.ctf || {};
    var cozulen = AK.veri.ctf;
    var puanToplam = 0;
    CTF.forEach(function (g) { if (cozulen[g.ad]) puanToplam += g.puan; });
    ic.innerHTML = AK.baslik('CTF ARENA', puanToplam + ' puan', 'G\u00F6revi \u00E7\u00F6z, cevab\u0131 yaz. (Ger\u00E7ek hedef makine i\u00E7in: bkz. KALI-VE-SUNUCU-ISLERI.txt)');
    CTF.forEach(function (g, k) {
      var cozuldu = !!cozulen[g.ad];
      ic.innerHTML += '<div class="akKutu" style="margin-bottom:8px">'
        + '<div style="display:flex;gap:8px;align-items:center"><span class="akEtiket">' + kac(g.kat) + '</span>'
        + '<b style="flex:1">' + kac(g.ad) + '</b><span class="akSoluk">' + g.puan + ' puan</span>'
        + (cozuldu ? '<span class="akEtiket">\u2705 \u00C7\u00D6Z\u00DCLD\u00DC</span>' : '') + '</div>'
        + '<div style="font-size:13.2px;margin:6px 0">' + kac(g.soru) + '</div>'
        + (cozuldu ? '' : '<div class="akDugSira"><input class="akGirdi" id="ctf' + k + '" placeholder="cevap" style="flex:1">'
          + '<button class="akDug" data-ctf="' + k + '">G\u00D6NDER</button></div>')
        + '</div>';
    });
    AK.$$('[data-ctf]').forEach(function (b) {
      b.onclick = function () {
        var k = parseInt(b.getAttribute('data-ctf'), 10), g = CTF[k];
        var c = (document.getElementById('ctf' + k).value || '').trim().toLowerCase();
        if (c && c === String(g.cevap).toLowerCase()) {
          AK.veri.ctf[g.ad] = 1;
          AK.xpEkle(g.puan, 'CTF: ' + g.ad);
          AK.veri.milestone = AK.veri.milestone || [];
          AK.veri.milestone.push({ ad: 'CTF \u00E7\u00F6z\u00FCld\u00FC: ' + g.ad, t: Date.now() });
          AK.kaydet(); AK.not('\uD83D\uDEA9 Do\u011Fru! +' + g.puan + ' puan', 'iyi'); AK.git('lab'); CTFsekme();
        } else {
          AK.not('\u274C Yanl\u0131\u015F.' + (g.ipucu ? ' \u0130pucu: ' + g.ipucu : ''), 'kotu');
        }
      };
    });
  }

  /* SOC simülasyonu: adımları doğru sıraya koy */
  function socSim() {
    var ic = AK.icerik;
    var secilenler = [];
    function ciz() {
      ic.innerHTML = AK.baslik('SOC S\u0130M\u00DCLASYONU', secilenler.length + ' / ' + OLAY_ADIM.length, 'Olay m\u00FCdahale ad\u0131mlar\u0131n\u0131 do\u011Fru s\u0131rayla se\u00E7.');
      ic.innerHTML += AK.kutu('<div class="akEtiket">SE\u00C7T\u0130\u011E\u0130N SIRA</div>'
        + (secilenler.length ? secilenler.map(function (s, i) { return '<div class="akGorevSatir">' + (i + 1) + '. ' + kac(s) + '</div>'; }).join('')
          : '<div class="akSoluk">Hen\u00FCz se\u00E7im yok.</div>'));
      var kalan = OLAY_ADIM.filter(function (s) { return secilenler.indexOf(s) < 0; });
      ic.innerHTML += AK.kutu('<div class="akEtiket">KALAN ADIMLAR (t\u0131kla)</div>'
        + '<div class="akDugSira" style="flex-direction:column;align-items:stretch">'
        + kalan.map(function (s) { return '<button class="akDug" style="text-align:left" data-a="' + kac(s) + '">' + kac(s) + '</button>'; }).join('')
        + '</div>');
      AK.$$('[data-a]').forEach(function (b) {
        b.onclick = function () {
          var s = b.getAttribute('data-a');
          var beklenen = OLAY_ADIM[secilenler.length];
          if (s === beklenen) {
            secilenler.push(s); AK.not('\u2705 Do\u011Fru s\u0131ra: ' + s, 'iyi');
            if (secilenler.length === OLAY_ADIM.length) {
              ic.innerHTML = AK.baslik('SOC S\u0130M\u00DCLASYONU', 'olay kapat\u0131ld\u0131', 'Olay m\u00FCdahale s\u0131ras\u0131 do\u011Fru.');
              ic.innerHTML += bitir('SOC Sim\u00FClasyonu', OLAY_ADIM.length, OLAY_ADIM.length, 120);
              return;
            }
            ciz();
          } else {
            AK.not('\u274C S\u0131ra yanl\u0131\u015F. S\u0131radaki do\u011Fru ad\u0131m: ' + beklenen, 'kotu');
          }
        };
      });
    }
    ciz();
  }

  /* karar ağacı oynatıcı */
  function agacOyna(dugum) {
    var ic = AK.icerik;
    var d = AGAC[dugum];
    ic.innerHTML = AK.baslik('KARAR A\u011EACI', '40. madde', 'Se\u00E7imlerinin sonucu ger\u00E7ek hayattaki sonu\u00E7tur.');
    ic.innerHTML += AK.kutu('<div style="font-size:14px;line-height:1.7">' + kac(d.metin) + '</div>'
      + (d.son ? '<div class="akBasari" style="margin-top:8px">\uD83D\uDCD8 ' + kac(d.ders) + '</div>'
        + '<div class="akDugSira"><button class="akDug" id="agacBasi">BA\u015ETAN BA\u015ELA</button></div>'
        : '<div class="akDugSira" style="flex-direction:column;align-items:stretch">' + d.secenekler.map(function (s) {
          return '<button class="akDug" style="text-align:left" data-g="' + s.git + '">' + kac(s.ad) + '</button>';
        }).join('') + '</div>'));
    AK.$$('[data-g]').forEach(function (b) {
      b.onclick = function () { agacOyna(b.getAttribute('data-g')); };
    });
    var bs = AK.$('#agacBasi');
    if (bs) bs.onclick = function () { agacOyna('baslangic'); };
  }

  /* kod inceleme lab */
  function kodLab() {
    var ic = AK.icerik, i = 0, puan = 0;
    function ciz() {
      if (i >= KOD_ORNEK.length) {
        ic.innerHTML = AK.baslik('AI KOD \u0130NCELEME LABORATUVARI', 'bitti', '80. madde');
        ic.innerHTML += bitir('Kod \u0130nceleme Lab', puan, KOD_ORNEK.length, puan * 20);
        return;
      }
      var k = KOD_ORNEK[i];
      ic.innerHTML = AK.baslik('KOD \u0130NCELEME', (i + 1) + ' / ' + KOD_ORNEK.length, k.dil + ' \u2014 zafiyeti bul');
      ic.innerHTML += AK.kutu('<pre style="font-family:Consolas,monospace;font-size:12.6px;white-space:pre-wrap;margin:0">' + kac(k.kod) + '</pre>'
        + '<div class="akDugSira">' + ['SQL enjeksiyonu', 'XSS', 'Komut enjeksiyonu', 'Yol gezinme (LFI)', 'G\u00FCvensiz deserializasyon', 'Zafiyet yok']
          .map(function (z) { return '<button class="akDug" data-z="' + kac(z) + '">' + kac(z) + '</button>'; }).join('') + '</div>');
      AK.$$('[data-z]').forEach(function (b) {
        b.onclick = function () {
          var dogru = b.getAttribute('data-z') === k.zafiyet;
          if (dogru) puan++;
          AK.not((dogru ? '\u2705 Do\u011Fru: ' : '\u274C Do\u011Frusu: ') + k.zafiyet + ' \u2014 ' + k.neden, dogru ? 'iyi' : 'kotu');
          i++; ciz();
        };
      });
    }
    ciz();
  }

  /* haber lab */
  function haberLab() {
    var ic = AK.icerik;
    ic.innerHTML = AK.baslik('S\u0130BER HABER LABORATUVARI', '79. madde', 'G\u00FCncel siber g\u00FCvenlik g\u00FCndeminden g\u00FCvenli e\u011Fitim senaryolar\u0131.');
    HABER.forEach(function (h, k) {
      ic.innerHTML += '<div class="akKutu" style="margin-bottom:8px"><b>' + kac(h.baslik) + '</b>'
        + '<div class="akSoluk" style="margin:6px 0">Ders: ' + kac(h.ders) + '</div>'
        + '<div style="font-size:13px;margin-bottom:6px">' + kac(h.soru) + '</div>'
        + '<div class="akDugSira">' + h.c.map(function (c, i2) {
          return '<button class="akDug" data-h="' + k + '" data-i="' + i2 + '">' + kac(c) + '</button>';
        }).join('') + '</div></div>';
    });
    ic.innerHTML += AK.kutu('<div class="akSoluk">Not: otomatik haber \u00E7ekme (RSS) sunucu ister; \u015Fu an senaryolar \u00E7evrimd\u0131\u015F\u0131 haz\u0131r.</div>');
    AK.$$('[data-h]').forEach(function (b) {
      b.onclick = function () {
        var k = parseInt(b.getAttribute('data-h'), 10), i2 = parseInt(b.getAttribute('data-i'), 10);
        var dogru = i2 === HABER[k].d;
        AK.not((dogru ? '\u2705 Do\u011Fru.' : '\u274C Yanl\u0131\u015F.') + ' ' + HABER[k].ders, dogru ? 'iyi' : 'kotu');
        if (dogru) { AK.xpEkle(15, 'Haber lab'); }
      };
    });
  }

  /* sekmeler */
  function CTFsekme() {
    var ic = AK.icerik;
    AK.veri.ctf = AK.veri.ctf || {};
    var cozulen = AK.veri.ctf;
    var puanToplam = 0;
    CTF.forEach(function (g) { if (cozulen[g.ad]) puanToplam += g.puan; });
    AK.veri.ctfPuan = Math.max(AK.veri.ctfPuan || 0, puanToplam);
    AK.kaydet();
    ic.innerHTML = AK.baslik('CTF ARENA', puanToplam + ' puan',
      'G\u00F6revi \u00E7\u00F6z, cevab\u0131 yaz. Ger\u00E7ek hedef makine + canl\u0131 skor i\u00E7in: KALI-VE-SUNUCU-ISLERI.txt');
    CTF.forEach(function (g, k) {
      var cozuldu = !!cozulen[g.ad];
      ic.innerHTML += '<div class="akKutu" style="margin-bottom:8px">'
        + '<div style="display:flex;gap:8px;align-items:center"><span class="akEtiket">' + kac(g.kat) + '</span>'
        + '<b style="flex:1">' + kac(g.ad) + '</b><span class="akSoluk">' + g.puan + ' puan</span>'
        + (cozuldu ? '<span class="akEtiket">\u2705 \u00C7\u00D6Z\u00DCLD\u00DC</span>' : '') + '</div>'
        + '<div style="font-size:13.2px;margin:6px 0">' + kac(g.soru) + '</div>'
        + (cozuldu ? '' : '<div class="akDugSira"><input class="akDug" id="ctf' + k + '" placeholder="cevap" style="flex:1;padding:9px">'
          + '<button class="akDug" data-ctf="' + k + '">G\u00D6NDER</button></div>')
        + '</div>';
    });
    AK.$$('[data-ctf]').forEach(function (b) {
      b.onclick = function () {
        var k = parseInt(b.getAttribute('data-ctf'), 10), g = CTF[k];
        var el = document.getElementById('ctf' + k);
        var c = (el && el.value ? el.value : '').trim().toLowerCase();
        if (c && c === String(g.cevap).toLowerCase()) {
          AK.veri.ctf[g.ad] = 1;
          AK.xpEkle(g.puan, 'CTF: ' + g.ad);
          AK.kaydet(); AK.not('\uD83D\uDEA9 Do\u011Fru! +' + g.puan + ' puan', 'iyi'); CTFsekme();
        } else {
          AK.not('\u274C Yanl\u0131\u015F.' + (g.ipucu ? ' \u0130pucu: ' + g.ipucu : ''), 'kotu');
        }
      };
    });
  }

  if (AK.veri) AK.veri.ctf = AK.veri.ctf || {};

  AK.modulEkle('lab', function () {
    var ic = AK.icerik;
    var v = AK.veri;
    v.labTamam = v.labTamam || [];
    v.ctf = v.ctf || {};
    ic.innerHTML = AK.baslik('LABORATUVARLAR', v.labTamam.length + ' tamamland\u0131',
      'Senaryo tabanl\u0131 al\u0131\u015Ft\u0131rmalar. Ger\u00E7ek makinede uygulama i\u00E7in Kali gerekir \u2014 burada ad\u0131m ad\u0131m do\u011Fru karar\u0131 \u00F6\u011Freniyorsun.');
    LABLAR.forEach(function (l) { ic.innerHTML += kart(l.id, l.ad, l.gorev); });
    ic.innerHTML += '<div style="height:8px"></div>';
    ic.innerHTML += kart('ctf', 'CTF ARENA \u2014 ' + Object.keys(v.ctf).length + '/' + CTF.length + ' \u00E7\u00F6z\u00FCld\u00FC', '10 g\u00F6rev, puan sistemi (37. madde)');
    ic.innerHTML += kart('soc', 'SOC S\u0130M\u00DCLASYONU', 'Olay m\u00FCdahale ad\u0131mlar\u0131n\u0131 s\u0131rala (38. madde)');
    ic.innerHTML += kart('vakalar', 'VAKA DOSYALARI', VAKALAR.length + ' ger\u00E7ek\u00E7i vaka, ' + VAKALAR.reduce(function (a, x) { return a + x.sorular.length; }, 0) + ' soru (39. madde)');
    ic.innerHTML += kart('agac', 'KARAR A\u011EACI', 'Hatal\u0131 karar\u0131n nedenini a\u00E7\u0131klar (40. madde)');
    ic.innerHTML += kart('adli', 'ADL\u0130 B\u0130L\u0130\u015E\u0130M LABORATUVARI', 'Kan\u0131t, hash, zaman \u00E7izelgesi (78. madde)');
    ic.innerHTML += kart('kod', 'AI KOD \u0130NCELEME LABORATUVARI', KOD_ORNEK.length + ' kod par\u00E7as\u0131, zafiyet analizi (80. madde)');
    ic.innerHTML += kart('haber', 'S\u0130BER HABER LABORATUVARI', HABER.length + ' g\u00FCndem senaryosu (79. madde)');

    ic.innerHTML += AK.kutu('<div class="akEtiket">// TAMAMLANANLAR</div>'
      + (v.labTamam.length ? v.labTamam.slice(-10).reverse().map(function (x) {
        return '<div class="akGorevSatir">\u2705 ' + kac(x.ad) + ' <span class="akSoluk">' + AK.trTarih(x.t) + '</span></div>';
      }).join('') : '<div class="akSoluk">Hen\u00FCz laboratuvar tamamlanmad\u0131.</div>'));

    AK.$$('[data-bolum]').forEach(function (b) {
      b.onclick = function () {
        var id = b.getAttribute('data-bolum');
        if (id === 'ctf') return CTFsekme();
        if (id === 'soc') return socSim();
        if (id === 'agac') return agacOyna('baslangic');
        if (id === 'kod') return kodLab();
        if (id === 'haber') return haberLab();
        if (id === 'adli') return labOyna(LABLAR.filter(function (l) { return l.id === 'lab_adli'; })[0]);
        if (id === 'vakalar') return vakaCiz(0, 0);
        var lab = LABLAR.filter(function (l) { return l.id === id; })[0];
        if (lab) labOyna(lab);
      };
    });

    function vakaCiz(vi, si) {
      var vk = VAKALAR[vi];
      if (!vk) {
        ic.innerHTML = AK.baslik('VAKA DOSYALARI', 'bitti', 'T\u00FCm vakalar incelendi.');
        ic.innerHTML += bitir('Vaka Dosyalar\u0131', VAKALAR.length, VAKALAR.length, 100);
        return;
      }
      if (si >= vk.sorular.length) return vakaCiz(vi + 1, 0);
      var s = vk.sorular[si];
      ic.innerHTML = AK.baslik(vk.ad, (si + 1) + ' / ' + vk.sorular.length, vk.ozet);
      ic.innerHTML += AK.kutu('<div style="font-weight:700;margin-bottom:8px">' + kac(s.s) + '</div>'
        + '<div class="akDugSira" style="flex-direction:column;align-items:stretch">'
        + s.c.map(function (x, k) { return '<button class="akDug" style="text-align:left" data-vs="' + k + '">' + kac(x) + '</button>'; }).join('')
        + '</div>');
      AK.$$('[data-vs]').forEach(function (b2) {
        b2.onclick = function () {
          var dogru = parseInt(b2.getAttribute('data-vs'), 10) === s.d;
          AK.not(dogru ? '\u2705 Do\u011Fru.' : '\u274C Yanl\u0131\u015F.', dogru ? 'iyi' : 'kotu');
          if (dogru) AK.xpEkle(15, 'Vaka sorusu');
          vakaCiz(vi, si + 1);
        };
      });
    }
  });
})();
