/* ==========================================================================
   ÜSTAD AKADEMİ SİTESİ — MİNİ OYUNLAR (akademi-oyun.js)
   Master liste 34: Network Defender · SOC Alert · Linux Mission · Web Quest ·
   Crypto Puzzle · Forensics Case   |   77: Siber Escape Room · Dedektif Modu
   GENİŞLETİLDİ (22.09.2026): 8 oyun → 14 oyun; bütün soru havuzları çoğaltıldı.
   Yeni oyunlar: Parola Gücü · Oltalama Avı · Log Avı · Hash Tanıma ·
                 Olay Sırası · Araç Eşleştirme
   Hepsi çevrimdışı, gerçek puanlama ve gerçek doğru/yanlış mantığıyla.
   ========================================================================== */
(function () {
  'use strict';
  if (!window.AK) return;
  var AK = window.AK, kac = AK.kac;

  AK.MODUL.push({ id: 'oyun', simge: '\uD83C\uDFAE', ad: 'M\u0130N\u0130 OYUNLAR', alt: '14 oyun + 2 özel mod' });
  AK.RENK.oyun = '#ffcc4d';

  /* ------------------------------- 1) AĞ SAVUNMASI ------------------------ */
  /* 24 kural: oyun her seferinde 6 soru çeker, her oynayışta farklı gelir. */
  var AG_KURAL = [
    { port: 22, ad: 'SSH', disari: false, neden: 'SSH yalnız iç ağdan; dışarı açıksa kaba kuvvet riski.' },
    { port: 443, ad: 'HTTPS', disari: true, neden: 'HTTPS dışarı açık olmalı; şifreli trafik.' },
    { port: 80, ad: 'HTTP', disari: false, neden: 'HTTP şifresiz; dışarı açıksa HTTPS yönlendirmesi şart.' },
    { port: 3389, ad: 'RDP', disari: false, neden: 'RDP internete açılmaz; fidye yazılımının ana kapısı.' },
    { port: 3306, ad: 'MySQL', disari: false, neden: 'Veritabanı dışarı açılmaz, uygulama içeriden bağlanır.' },
    { port: 21, ad: 'FTP', disari: false, neden: 'FTP şifresiz; mümkünse SFTP kullanılır.' },
    { port: 53, ad: 'DNS', disari: true, neden: 'DNS servisi gerekli; sınırlı ve doğrulanmış olmalı.' },
    { port: 8443, ad: 'Yönetim Paneli', disari: false, neden: 'Yönetim paneli VPN/iç ağ arkasında olmalı.' },
    { port: 25, ad: 'SMTP', disari: false, neden: 'Posta aktarım portu açık bırakılırsa spam relay riski.' },
    { port: 23, ad: 'Telnet', disari: false, neden: 'Telnet şifresizdir; tamamen kapatılır, yerine SSH.' },
    { port: 445, ad: 'SMB', disari: false, neden: 'SMB internete açılmaz; fidye yazılımının yayılma yolu.' },
    { port: 139, ad: 'NetBIOS', disari: false, neden: 'Eski paylaşım portu; dışarıya kesinlikle kapatılır.' },
    { port: 53, ad: 'DNS (UDP 53)', disari: true, neden: 'Alan adı çözümlemesi için gerekli servis.' },
    { port: 123, ad: 'NTP', disari: true, neden: 'Saat doğruluğu log ve sertifika için kritik.' },
    { port: 161, ad: 'SNMP', disari: false, neden: 'Zayıf topluluk dizesi cihaz bilgisi sızdırır; iç ağda tutulur.' },
    { port: 1433, ad: 'MSSQL', disari: false, neden: 'Veritabanı portu asla internete açılmaz.' },
    { port: 5432, ad: 'PostgreSQL', disari: false, neden: 'Veritabanı iç ağda kalır; dışarı erişim yok.' },
    { port: 6379, ad: 'Redis', disari: false, neden: 'Kimlik doğrulamasız Redis ele geçirilir; asla dışarı açılmaz.' },
    { port: 5900, ad: 'VNC', disari: false, neden: 'Uzak masaüstü şifrelemesi zayıf; VPN arkasında tutulur.' },
    { port: 8080, ad: 'Uygulama (proxy)', disari: false, neden: 'Arka uç uygulama portu doğrudan dışarı açılmaz.' },
    { port: 1194, ad: 'OpenVPN', disari: true, neden: 'VPN servisi dışarıdan erişilebilir; şifreli tünel girişi.' },
    { port: 3128, ad: 'Squid Proxy', disari: false, neden: 'Açık proxy kötüye kullanılır; iç kullanım için sınırlandırılır.' },
    { port: 27017, ad: 'MongoDB', disari: false, neden: 'Açık MongoDB sızıntılarının en sık nedeni; iç ağda kalır.' },
    { port: 587, ad: 'SMTP Gönderim', disari: true, neden: 'Kimlik doğrulamalı posta gönderimi için açılabilir.' }
  ];
  var agSoru = [];

  /* --------------------------------- 2) SOC ALARM ------------------------- */
  var SOC_TUR = [
    { log: 'FileVault: 400 başarısız oturum denemesi, 90 saniyede, tek IP', tehdit: true, neden: 'Kaba kuvvet saldırısı göstergesi.' },
    { log: 'Kullanıcı 5 kez parolasını yanlış girdi, sonra doğru girdi', tehdit: false, neden: 'Normal insan davranışı.' },
    { log: 'Gece 03:00, muhasebe kullanıcısı 2,4 GB dosya paylaşımlı klasöre kopyaladı', tehdit: true, neden: 'Veri sızdırma şüphesi (usulsüz toplu kopyalama).' },
    { log: 'Windows Update servisi güncellendi', tehdit: false, neden: 'Beklenen bakım işi.' },
    { log: 'PowerShell -enc <uzun base64> ile dış adrese bağlantı', tehdit: true, neden: 'Gizlenmiş komut + dış bağlantı = C2 şüphesi.' },
    { log: 'Yazıcı kuyruğu takıldı, temizlendi', tehdit: false, neden: 'Operasyonel arıza.' },
    { log: 'Yeni yerel yönetici hesabı oluşturuldu ve hemen oturum açtı', tehdit: true, neden: 'Yetki yükseltme kalıcılığı (persistence).' },
    { log: 'DNS istekleri 10 dakikada 40 farklı rastgele alt alan adına gitti', tehdit: true, neden: 'DNS tüneli / veri sızdırma tekniği.' },
    { log: 'Sunucu 03:10-03:40 arası yeniden başlatıldı, planlı bakım kaydı var', tehdit: false, neden: 'Planlı bakım penceresi.' },
    { log: 'Güvenlik duvarı kuralı gece yarısı değiştirildi, değiştiren hesap ayrılmış personel', tehdit: true, neden: 'Yetkisiz kural değişikliği; hesaplar kapatılmalı.' },
    { log: 'Aynı kullanıcı iki farklı ülkeden 12 dakika arayla oturum açtı', tehdit: true, neden: 'İmkânsız seyahat: hesap ele geçirme işareti.' },
    { log: 'E-posta istemcisi yeni sürüme güncellendi', tehdit: false, neden: 'Olağan yazılım güncellemesi.' },
    { log: 'Bilinen kötü amaçlı alan adına HTTPS isteği reddedildi', tehdit: true, neden: 'Engellenmiş C2 iletişim denemesi; kaynak süreç incelenmeli.' },
    { log: 'Yedekleme görevi başarıyla tamamlandı', tehdit: false, neden: 'Rutin işlem.' },
    { log: 'Kullanıcı kalem belleği okuma izni verdi, 20 saniye sonra çıkardı', tehdit: false, neden: 'Kısa süreli normal kullanım.' },
    { log: 'Antivirüs gerçek zamanlı koruması kapatıldı', tehdit: true, neden: 'Savunmayı devre dışı bırakma davranışı klasik ilk adımdır.' },
    { log: 'Zamanlanmış görev oluşturuldu: her 15 dakikada dış adresten betik indir', tehdit: true, neden: 'Kalıcılık için otomatik görev (cron/scheduled task).' },
    { log: 'Depolama alanı %78 doluluk uyarısı verdi', tehdit: false, neden: 'Kapasite uyarısı, güvenlik olayı değil.' },
    { log: 'Kullanıcı 3 gün sonra işe dönüş için VPN profilini yeniden kurdu', tehdit: false, neden: 'Beklenen kullanıcı işlemi.' },
    { log: 'Sunucuda 25 farklı kullanıcı hesabı 4 dakika içinde kilitlendi', tehdit: true, neden: 'Parola püskürtme (password spray) saldırısı.' },
    { log: 'Yeni SSL sertifikası kuruldu, sistem yöneticisi kaydı mevcut', tehdit: false, neden: 'Kayıtlı bakım işlemi.' },
    { log: 'Arşiv dosyası parola korumalı olarak oluşturuldu ve dış buluta yüklendi', tehdit: true, neden: 'Sızdırma öncesi paketleme şüphesi; kullanıcı ve hedef doğrulanmalı.' },
    { log: 'WMI ile uzak makinede süreç başlatıldı, kaynak hesap servis hesabı', tehdit: true, neden: 'Yatay hareket tekniği (WMI/PsExec ailesi).' },
    { log: 'Kullanıcı iki aşamalı doğrulamayı yeni telefona taşıdı', tehdit: false, neden: 'Normal MFA cihaz değişimi.' },
    { log: 'Kritik sistemde yama 6 aydır uygulanmadı', tehdit: true, neden: 'Yönetilmeyen yama = bilinen zafiyetle açık kapı.' },
    { log: 'Grup ilkesiyle tüm makinelere ekran kilidi süresi tanımlandı', tehdit: false, neden: 'Sertleştirme çalışması.' }
  ];

  /* -------------------------------- 3) LINUX GÖREVİ ----------------------- */
  var LINUX_TUR = [
    { senaryo: 'Disk doldu. En çok yer kaplayan 10 klasörü bul.', dogru: 'du -ah / | sort -rh | head -n 10', yanlislar: ['ls -la /', 'df -h', 'find / -type f'], neden: 'du boyut özeti + sort -rh sıralama + head ilk 10.' },
    { senaryo: 'Ağda hangi portların açık olduğunu gör (yerel)', dogru: 'ss -tulnp', yanlislar: ['netstat -rn', 'ip a', 'dig'], neden: 'ss -tulnp dinleyen TCP/UDP portları + süreç gösterir.' },
    { senaryo: 'Son 100 satır yetkilendirme logunu izle', dogru: 'tail -n 100 /var/log/auth.log', yanlislar: ['cat /var/log/syslog', 'journalctl -xe', 'dmesg'], neden: 'tail son satırlar; auth.log kimlik doğrulama kaydı.' },
    { senaryo: 'SUID biti ayarlı dosyaları bul', dogru: 'find / -perm -4000 -type f 2>/dev/null', yanlislar: ['ls -l /usr/bin', 'chmod 4000 -R /', 'grep suid /etc/passwd'], neden: 'setuid dosyalar yetki yükseltme için önce taranır.' },
    { senaryo: 'Bir kullanıcıyı sudo grubuna ekle', dogru: 'usermod -aG sudo <kullanıcı>', yanlislar: ['chmod +x /etc/sudoers', 'useradd -r <kullanıcı>', 'passwd --lock <kullanıcı>'], neden: '-aG ekleyerek grubu korur (kırma yapmaz).' },
    { senaryo: 'Dosya bütünlüğünü SHA-256 ile doğrula', dogru: 'sha256sum dosya.img', yanlislar: ['md5sum dosya.img', 'file dosya.img', 'chattr +i dosya.img'], neden: 'SHA-256 güncel bütünlük standardı.' },
    { senaryo: 'Canlı sistemde kim hangi portu dinliyor, süreç adıyla gör', dogru: 'ss -tulpn | grep LISTEN', yanlislar: ['ps aux', 'lsof /etc', 'ip route'], neden: 'LISTEN filtresi yalnız dinleyen soketleri getirir.' },
    { senaryo: 'Son 7 günde değişen .log dosyalarını bul', dogru: 'find /var/log -name "*.log" -mtime -7', yanlislar: ['ls -lt /var/log', 'du -sh /var/log', 'grep log /etc/fstab'], neden: '-mtime -7 son yedi günü seçer.' },
    { senaryo: 'Başarısız giriş denemelerini say', dogru: 'grep -c "Failed password" /var/log/auth.log', yanlislar: ['wc -l /var/log/auth.log', 'cat /var/log/auth.log', 'last -a'], neden: '-c sayı döner; kaba kuvvet ölçümü bu şekilde yapılır.' },
    { senaryo: 'Yeni kullanıcı oluştur ve ev klasörü açılsın', dogru: 'useradd -m kenan', yanlislar: ['useradd -r kenan', 'addgroup kenan', 'chmod 777 /home'], neden: '-m ev klasörünü oluşturur; -r sistem hesabı içindir.' },
    { senaryo: 'Bir servisi hemen durdur ve açılıştan çıkar', dogru: 'systemctl disable --now servis', yanlislar: ['systemctl status servis', 'kill servis', 'systemctl list-units'], neden: 'disable açılıştan çıkarır, --now hemen durdurur.' },
    { senaryo: 'Dosya iznini sahip yazabilsin, diğerleri okusun (644) yap', dogru: 'chmod 644 belge.txt', yanlislar: ['chmod 777 belge.txt', 'chown 644 belge.txt', 'umask 644'], neden: '6=sahip oku+yaz, 4=diğerleri oku.' },
    { senaryo: 'Yetkiyle çalışacak betiği visudo üzerinden düzenle', dogru: 'sudo visudo', yanlislar: ['sudo nano /etc/sudoers', 'chmod +x /etc/sudoers', 'sudo cat /etc/sudoers'], neden: 'visudo sözdizimi denetimi yapar; hatalı sudoers sistemi kilitler.' },
    { senaryo: 'Canlı log akışını ekranda izle', dogru: 'tail -f /var/log/syslog', yanlislar: ['cat /var/log/syslog', 'head /var/log/syslog', 'ls /var/log'], neden: '-f eklenen yeni satırları canlı gösterir.' },
    { senaryo: 'Sistemde bir aracın kurulu olup olmadığını kontrol et', dogru: 'which nmap', yanlislar: ['man nmap', 'nmap --install', 'ls /etc/nmap'], neden: 'which PATH içinde arar; nerede sorusunu yanıtlar.' },
    { senaryo: 'Dosyanın ilk 20 satırını gör', dogru: 'head -n 20 dosya.txt', yanlislar: ['tail -n 20 dosya.txt', 'wc -l dosya.txt', 'sed -i dosya.txt'], neden: 'head baştan sayar; tail sondan.' },
    { senaryo: 'Tarayıcıya bağlanan canlı TCP bağlantılarını listele', dogru: 'ss -tnp | grep ESTAB', yanlislar: ['ss -lntp', 'ps aux | grep tcp', 'route -n'], neden: 'ESTAB yalnız kurulu bağlantıları süzer.' },
    { senaryo: 'Bütün kullanıcı adlarını /etc/passwd içinden çıkar', dogru: "awk -F: '{print $1}' /etc/passwd", yanlislar: ['cat /etc/shadow', 'grep root /etc/passwd', 'cut -d: -f3 /etc/passwd'], neden: 'İlk alan kullanıcı adıdır; -F: ayırıcıyı belirler.' }
  ];

  /* -------------------------------- 4) WEB GÖREVİ ------------------------- */
  var WEB_TUR = [
    { kanit: "id=1 AND 1=1 --  → hata sayfası dönmüyor, tüm kayıtlar geliyor", cevap: 'SQL Injection' },
    { kanit: '<script>alert(1)</script> yorum alanına girildi, sayfa açılınca çalıştı', cevap: 'XSS' },
    { kanit: '/kullanici/1043/fatura → /kullanici/1044/fatura da açılıyor', cevap: 'IDOR' },
    { kanit: 'url=http://ic-servis/admin → sunucu iç adrese istek attı', cevap: 'SSRF' },
    { kanit: 'Başka siteden gelen form ile para transferi tetiklendi', cevap: 'CSRF' },
    { kanit: 'yukle.php dosyasına .php yüklendi ve çalıştı', cevap: 'Dosya Yükleme' },
    { kanit: '../../etc/passwd yolu okundu', cevap: 'Yol Gezinme (LFI)' },
    { kanit: "''' → 500 hatası ve SQL sözdizimi mesajı", cevap: 'SQL Injection' },
    { kanit: '?isim=;cat /etc/passwd → komut çıktısı sayfada göründü', cevap: 'Komut Enjeksiyonu' },
    { kanit: 'XML gövdesinde <!ENTITY xxe SYSTEM "file:///etc/passwd"> işlendi', cevap: 'XXE' },
    { kanit: 'Giriş yapmadan /yonetim/panel adresi doğrudan açıldı', cevap: 'Kimlik Doğrulama Atlama' },
    { kanit: 'Hata sayfasında veritabanı sürümü, dosya yolu ve çatı bilgisi görünüyor', cevap: 'Bilgi Sızıntısı' },
    { kanit: '?donus=http://kotu-site.com giriş sonrası oraya yönlendirdi', cevap: 'Açık Yönlendirme' },
    { kanit: 'İstek başlığına ?adi=<script>src=//kotu.js</script> yansıtıldı', cevap: 'XSS' },
    { kanit: 'Şifre sıfırlama bağlantısı kullanıcı tahmin edilebilir sayı ile üretiliyor', cevap: 'Güvensiz Doğrudan Nesne' },
    { kanit: 'JWT imzası "alg":"none" kabul edildi', cevap: 'Kimlik Doğrulama Atlama' },
    { kanit: 'Aynı oturum çerezi çalındıktan sonra başka cihazdan geçerli sayıldı', cevap: 'Oturum Ele Geçirme' },
    { kanit: 'API yanıtı olması gerekenden çok fazla alan döndürdü (parola özeti)', cevap: 'Bilgi Sızıntısı' },
    { kanit: '?siralama=ad;DROP TABLE kullanicilar → tablo silinme denemesi', cevap: 'SQL Injection' },
    { kanit: "İçerik yükleme alanına .svg içine gömülü script yüklendi", cevap: 'Dosya Yükleme' },
    { kanit: 'Zip arşivi açılırken ../../.. yolu ile dış klasöre yazıldı', cevap: 'Yol Gezinme (LFI)' },
    { kanit: 'Sınırsız istek atılarak giriş denemesi hızlandırıldı (hız sınırı yok)', cevap: 'Hız Sınırı Yok' }
  ];
  var WEB_SEC = ['SQL Injection', 'XSS', 'IDOR', 'SSRF', 'CSRF', 'Dosya Yükleme', 'Yol Gezinme (LFI)', 'Komut Enjeksiyonu', 'XXE', 'Kimlik Doğrulama Atlama', 'Bilgi Sızıntısı', 'Açık Yönlendirme', 'Güvensiz Doğrudan Nesne', 'Oturum Ele Geçirme', 'Hız Sınırı Yok'];

  /* -------------------------------- 5) KRİPTO BULMACA --------------------- */
  function sezarCoz(s, k) {
    return s.replace(/[A-Z]/g, function (c) {
      return String.fromCharCode(((c.charCodeAt(0) - 65 - k + 26) % 26) + 65);
    });
  }
  var KRIPTO_TUR = [
    { soru: 'Şifreli metin: XVWDG', ipucu: 'Sezar kaydırması — 3 harf geri kaydır', cevap: 'ustad' },
    { soru: 'Base64: YWthZGVtaQ==', ipucu: 'Base64 çöz', cevap: 'akademi' },
    { soru: 'ASCII kodları: 85 83 84 65 68', ipucu: 'Her sayı bir harfe karşılık gelir (A = 65)', cevap: 'ustad' },
    { soru: 'ROT13 şifreli: HFGNQ', ipucu: '13 harf ileri/geri kaydır (ROT13)', cevap: 'ustad' },
    { soru: 'Base64: a2FsaQ==', ipucu: 'Base64 çöz', cevap: 'kali' },
    { soru: 'Sezar (2 geri): PGRCT', ipucu: 'Alfabede 2 harf geri kaydır', cevap: 'nepar' },
    { soru: 'Hex: 73 69 62 65 72', ipucu: 'Hex kodları ASCII harfe çevir (73 = s)', cevap: 'siber' },
    { soru: 'Base64: cGFyb2xh', ipucu: 'Base64 çöz', cevap: 'parola' },
    { soru: 'ROT13: FVORE', ipucu: 'ROT13 uygula', cevap: 'siber' },
    { soru: 'ASCII: 75 41 4C 49', ipucu: 'Büyük harf karşılıkları (75 = K)', cevap: 'kali' },
    { soru: 'Base64: bGludXg=', ipucu: 'Base64 çöz', cevap: 'linux' },
    { soru: 'Sezar (4 geri): WMFIV', ipucu: '4 harf geri kaydır', cevap: 'siber' },
    { soru: 'Base64: bm1hcA==', ipucu: 'Base64 çöz', cevap: 'nmap' },
    { soru: 'Hex: 70 6F 72 74', ipucu: 'Hex çöz', cevap: 'port' },
    { soru: 'Base64: Z3V2ZW5saWs= ', ipucu: 'Base64 çöz (üssü yok)', cevap: 'guvenlik' },
    { soru: 'Sezar (1 geri): LBMJ', ipucu: '1 harf geri kaydır', cevap: 'kali' }
  ];

  /* -------------------------------- 6) ADLİ VAKA -------------------------- */
  var ADLI_VAKA = [
    { olay: 'Sunucudan veri sızdı. Kanıtlar: 02:14\'te VPN girişi (ayrılan personelin hesabı), aynı saatte 3,8 GB dışa aktarım, hesap 2 gün önce silinmemişti.',
      secenekler: ['Eski çalışanın hesabı kapatılmadığı için kullanıldı', 'Sunucu elektrik kesintisi', 'Yazılım güncellemesi hatası', 'Yanlış yedekleme'],
      dogru: 0, ders: 'Ayrılan personel hesapları anında kapatılmalı (offboarding).' },
    { olay: 'Kullanıcılar sahte banka sayfasına yönlendirildi. Kanıt: yerel DNS kayıtları değiştirilmiş, modem arayüzüne dışarıdan erişilmiş.',
      secenekler: ['DNS zehirlenmesi + zayıf modem parolası', 'Disk arızası', 'E-posta kotası', 'Ekran kartı sürücüsü'],
      dogru: 0, ders: 'Yönlendirici yönetim arayüzü güçlü parola + güncel firmware ister.' },
    { olay: 'Tüm dosyalar .kilit uzantısına döndü, fidye notu var. Kanıt: 03:41\'de RDP ile dışarıdan giriş denemeleri.',
      secenekler: ['RDP üzerinden fidye yazılımı', 'Elektrik dalgalanması', 'Sabit disk yaşlanması', 'Yazıcı sürücüsü'],
      dogru: 0, ders: 'RDP internete kapalı olmalı; yedekler çevrimdışı tutulmalı.' },
    { olay: 'Şirket e-postasından müşterilere sahte fatura gitti. Kanıt: gönderen hesabın oturum belirteci (token) çalınmış, MFA yok.',
      secenekler: ['Oturum belirteci hırsızlığı + MFA eksikliği', 'Yazıcı hatası', 'Disk bölünmesi', 'DNS yavaşlığı'],
      dogru: 0, ders: 'MFA ve oturum belirteci koruması hesap devralmayı engeller.' },
    { olay: 'Web sitesi çöktü, veritabanı yanıt vermiyor. Kanıt: giriş alanına uzun SQL ifadesi girilmiş, log\'da tablo silme denemesi.',
      secenekler: ['SQL enjeksiyonu', 'Kablo kopması', 'Sabit disk dolu', 'Tema hatası'],
      dogru: 0, ders: 'Parametreli sorgu + yetki kısıtı enjeksiyonu engeller.' },
    { olay: 'Sunucu sürekli dışarıya bağlanıyor. Kanıt: her 15 dakikada bir bilinmeyen adresten betik indiriliyor.',
      secenekler: ['Kalıcılık kurulmuş (zamanlanmış görev/C2)', 'Yedekleme ayarı', 'Yazıcı kuyruğu', 'Saat ayarı'],
      dogru: 0, ders: 'Zamanlanmış görevler ve dış bağlantılar düzenli denetlenmeli.' },
    { olay: 'Ofiste bilgisayarlar yavaşladı, ağ tıkanık. Kanıt: yerel IP dağıtımı değiştirilmiş (iki farklı kapı adresi yanıt veriyor).',
      secenekler: ['Sahte DHCP sunucusu (kötü ikiz)', 'Ekran kartı hatası', 'Yazıcı toner', 'Masaüstü arka planı'],
      dogru: 0, ders: 'DHCP snooping ve port güvenliği sahte sunucuyu engeller.' },
    { olay: 'İK sistemine dışarıdan giriş yapıldı. Kanıt: parola sızmış listede bulunuyordu, hesapta MFA yoktu.',
      secenekler: ['Sızmış parola kullanımı (credential stuffing)', 'Elektrik kesintisi', 'Disk arızası', 'Yazılım lisansı'],
      dogru: 0, ders: 'Sızmış parola listesi kontrolü + MFA zorunlu olmalı.' },
    { olay: 'Beklenmedik şekilde büyük veri paketi gönderildi. Kanıt: paketlenmiş arşiv dış buluta yüklendi, kullanıcı ayrılış sürecinde.',
      secenekler: ['İç tehdit / veri sızdırma', 'Yazıcı hatası', 'DNS yavaşlığı', 'Güncelleme'],
      dogru: 0, ders: 'Ayrılış sürecinde erişim kısıtlanır ve çıkış trafiği izlenir.' },
    { olay: 'Bir sunucuda yetkisiz süreç çalıştı. Kanıt: SUID ikilisi değiştirilmiş, zaman damgası güncelleme sonrasına ait.',
      secenekler: ['Dosya bütünlüğü ihlali (rootkit/backdoor)', 'Disk dolması', 'Ekran çözünürlüğü', 'Yedek planı'],
      dogru: 0, ders: 'Dosya bütünlüğü izleme (hash) değişikliği yakalar.' }
  ];

  /* ------------------------------- OYUN ÇATISI ---------------------------- */
  function oyunKart(id, ad, simge, aciklama, tur) {
    return '<div class="akKutu" style="margin-bottom:8px"><div style="display:flex;gap:10px;align-items:center">'
      + '<span style="font-size:22px">' + simge + '</span><div style="flex:1"><b>' + kac(ad) + '</b>'
      + '<div class="akSoluk" style="font-size:12.4px">' + kac(aciklama) + '</div></div>'
      + '<button class="akDug" data-oyun="' + id + '">OYNA</button></div></div>';
  }

  function sonucKaydet(oyun, puan, toplam, xp) {
    var v = AK.veri;
    v.oyun = v.oyun || {};
    var eski = v.oyun[oyun] || 0;
    if (puan > eski) v.oyun[oyun] = puan;
    v.oyunToplam = (v.oyunToplam || 0) + puan;
    AK.xpEkle(xp, 'Mini oyun: ' + oyun);
    v.milestone = v.milestone || [];
    v.milestone.push({ ad: 'Oyun oynandı: ' + oyun + ' (' + puan + '/' + toplam + ')', t: Date.now() });
    AK.labTamam = v.labTamam = v.labTamam || [];
    v.labTamam.push({ ad: oyun, t: Date.now(), tur: 'oyun' });
    AK.kaydet();
    if (AK.gorevKontrol) AK.gorevKontrol();
  }

  /* --- oyun 1: ağ savunması --- */
  function agOyna() {
    var ic = AK.icerik;
    agSoru = AG_KURAL.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 8);
    var tur = 0, puan = 0;
    function ciz() {
      if (tur >= agSoru.length) {
        ic.innerHTML = AK.baslik('A\u011E SAVUNMASI', 'bitti', 'Network Defender');
        ic.innerHTML += AK.kutu('<div style="font-size:22px;font-weight:700">' + puan + ' / ' + agSoru.length + '</div>'
          + '<div class="akSoluk">Do\u011Fru karar: port kural\u0131na g\u00F6re a\u00E7/kapat.</div>');
        ic.innerHTML += sonucKart('ag', puan, agSoru.length, puan * 10);
        bagla();
        return;
      }
      var s = agSoru[tur];
      ic.innerHTML = AK.baslik('A\u011E SAVUNMASI', (tur + 1) + ' / ' + agSoru.length, 'gelen paket karar\u0131');
      ic.innerHTML += AK.kutu('<div style="font-size:15px">D\u0131\u015Far\u0131dan gelen ba\u011Flant\u0131 iste\u011Fi:</div>'
        + '<div style="font-family:Consolas,monospace;font-size:19px;margin:8px 0">port ' + s.port + ' (' + s.ad + ')</div>'
        + '<div class="akDugSira"><button class="akDug" id="izin">\u2705 \u0130Z\u0130N VER</button>'
        + '<button class="akDug" id="engel">\u26D4 ENGELLE</button></div>');
      function cevap(izin) {
        var dogru = (izin === s.disari);
        if (dogru) puan++;
        AK.not((dogru ? '\u2705 Do\u011Fru. ' : '\u274C Yanl\u0131\u015F. ') + s.neden, dogru ? 'iyi' : 'kotu');
        tur++; ciz();
      }
      AK.$('#izin').onclick = function () { cevap(true); };
      AK.$('#engel').onclick = function () { cevap(false); };
    }
    ciz();
  }

  /* --- oyun 2: SOC alarm --- */
  function socOyna() {
    var ic = AK.icerik;
    var turler = SOC_TUR.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 10);
    var tur = 0, puan = 0;
    function ciz() {
      if (tur >= turler.length) {
        ic.innerHTML = AK.baslik('SOC ALARM', 'bitti', 'SOC Alert');
        ic.innerHTML += sonucKart('soc', puan, turler.length, puan * 10);
        bagla(); return;
      }
      var s = turler[tur];
      ic.innerHTML = AK.baslik('SOC ALARM', (tur + 1) + ' / ' + turler.length, 'ger\u00E7ek tehdidi ay\u0131rt et');
      ic.innerHTML += AK.kutu('<div style="font-family:Consolas,monospace;font-size:13.4px;line-height:1.7">' + kac(s.log) + '</div>'
        + '<div class="akDugSira"><button class="akDug" id="gercek">\uD83D\uDD34 GER\u00C7EK TEHD\u0130T</button>'
        + '<button class="akDug" id="normal">\uD83D\uDFE2 NORMAL</button></div>');
      AK.$('#gercek').onclick = function () { ver(true); };
      AK.$('#normal').onclick = function () { ver(false); };
      function ver(gercek) {
        var dogru = (gercek === s.tehdit);
        if (dogru) puan++;
        AK.not((dogru ? '\u2705 ' : '\u274C ') + s.neden, dogru ? 'iyi' : 'kotu');
        tur++; ciz();
      }
    }
    ciz();
  }

  /* --- oyun 3: Linux görevi --- */
  function linuxOyna() {
    var ic = AK.icerik;
    var sorular = LINUX_TUR.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 8);
    var tur = 0, puan = 0;
    function ciz() {
      if (tur >= sorular.length) {
        ic.innerHTML = AK.baslik('L\u0130NUX G\u00D6REV\u0130', 'bitti', 'Linux Mission');
        ic.innerHTML += sonucKart('linux', puan, sorular.length, puan * 12);
        bagla(); return;
      }
      var s = sorular[tur];
      var secenekler = [s.dogru].concat(s.yanlislar.slice(0, 2)).sort(function () { return Math.random() - 0.5; });
      ic.innerHTML = AK.baslik('L\u0130NUX G\u00D6REV\u0130', (tur + 1) + ' / ' + sorular.length, 'do\u011Fru komutu se\u00E7');
      ic.innerHTML += AK.kutu('<div style="font-size:14.6px">' + kac(s.senaryo) + '</div>'
        + '<div class="akDugSira" style="flex-direction:column;align-items:stretch">'
        + secenekler.map(function (k) {
          return '<button class="akDug akMono" style="text-align:left" data-k="' + kac(k) + '">$ ' + kac(k) + '</button>';
        }).join('') + '</div>');
      AK.$$('[data-k]').forEach(function (b) {
        b.onclick = function () {
          var secim = b.getAttribute('data-k');
          var dogru = secim === s.dogru;
          if (dogru) puan++;
          AK.not((dogru ? '\u2705 Do\u011Fru komut.' : '\u274C Yanl\u0131\u015F. Do\u011Frusu: ' + s.dogru) + ' \u2014 ' + s.neden, dogru ? 'iyi' : 'kotu');
          tur++; ciz();
        };
      });
    }
    ciz();
  }

  /* --- oyun 4: web görevi --- */
  function webOyna() {
    var ic = AK.icerik;
    var turler = WEB_TUR.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 8);
    var tur = 0, puan = 0;
    function ciz() {
      if (tur >= turler.length) {
        ic.innerHTML = AK.baslik('WEB G\u00D6REV\u0130', 'bitti', 'Web Security Quest');
        ic.innerHTML += sonucKart('web', puan, turler.length, puan * 12);
        bagla(); return;
      }
      var s = turler[tur];
      ic.innerHTML = AK.baslik('WEB G\u00D6REV\u0130', (tur + 1) + ' / ' + turler.length, 'zafiyeti s\u0131n\u0131fland\u0131r');
      ic.innerHTML += AK.kutu('<div style="font-family:Consolas,monospace;font-size:13.2px;line-height:1.7">' + kac(s.kanit) + '</div>'
        + '<div class="akDugSira">' + WEB_SEC.map(function (z) {
          return '<button class="akDug" data-z="' + kac(z) + '">' + kac(z) + '</button>';
        }).join('') + '</div>');
      AK.$$('[data-z]').forEach(function (b) {
        b.onclick = function () {
          var dogru = b.getAttribute('data-z') === s.cevap;
          if (dogru) puan++;
          AK.not((dogru ? '\u2705 Do\u011Fru: ' : '\u274C Yanl\u0131\u015F. Do\u011Frusu: ') + s.cevap, dogru ? 'iyi' : 'kotu');
          tur++; ciz();
        };
      });
    }
    ciz();
  }

  /* --- oyun 5: kripto bulmaca --- */
  function kriptoOyna() {
    var ic = AK.icerik;
    var turler = KRIPTO_TUR.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 8);
    var tur = 0, puan = 0;
    function ciz() {
      if (tur >= turler.length) {
        ic.innerHTML = AK.baslik('KR\u0130PTO BULMACA', 'bitti', 'Crypto Puzzle');
        ic.innerHTML += sonucKart('kripto', puan, turler.length, puan * 15);
        bagla(); return;
      }
      var s = turler[tur];
      ic.innerHTML = AK.baslik('KR\u0130PTO BULMACA', (tur + 1) + ' / ' + turler.length, 'şifreyi çöz');
      ic.innerHTML += AK.kutu('<div style="font-family:Consolas,monospace;font-size:17px;margin-bottom:6px">' + kac(s.soru) + '</div>'
        + '<div class="akSoluk">\u0130pucu: ' + kac(s.ipucu) + '</div>'
        + '<div class="akDugSira"><input id="kCevap" placeholder="cevab\u0131 yaz" class="akGirdi" style="flex:1">'
        + '<button class="akDug" id="kVer">G\u00D6NDER</button></div>');
      AK.$('#kVer').onclick = function () {
        var c = (AK.$('#kCevap').value || '').trim().toLowerCase();
        var dogru = c === String(s.cevap).toLowerCase();
        if (dogru) puan++;
        AK.not((dogru ? '\u2705 Do\u011Fru!' : '\u274C Yanl\u0131\u015F. Do\u011Frusu: ' + s.cevap), dogru ? 'iyi' : 'kotu');
        tur++; ciz();
      };
    }
    ciz();
  }

  /* --- oyun 6: adli vaka --- */
  function adliOyna() {
    var ic = AK.icerik;
    var tur = 0, puan = 0;
    var vakalar = ADLI_VAKA.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 6);
    function ciz() {
      if (tur >= vakalar.length) {
        ic.innerHTML = AK.baslik('ADL\u0130 VAKA', 'bitti', 'Forensics Case');
        ic.innerHTML += sonucKart('adli', puan, vakalar.length, puan * 15);
        bagla(); return;
      }
      var v = vakalar[tur];
      ic.innerHTML = AK.baslik('ADL\u0130 VAKA', (tur + 1) + ' / ' + vakalar.length, 'kan\u0131tlar\u0131 oku, sonucu se\u00E7');
      ic.innerHTML += AK.kutu('<div style="font-size:13.8px;line-height:1.7">' + kac(v.olay) + '</div>'
        + '<div class="akDugSira" style="flex-direction:column;align-items:stretch">'
        + v.secenekler.map(function (s, i) {
          return '<button class="akDug" style="text-align:left" data-i="' + i + '">' + kac(s) + '</button>';
        }).join('') + '</div>');
      AK.$$('[data-i]').forEach(function (b) {
        b.onclick = function () {
          var dogru = parseInt(b.getAttribute('data-i'), 10) === v.dogru;
          if (dogru) puan++;
          AK.not((dogru ? '\u2705 Do\u011Fru te\u015Fhis.' : '\u274C Yanl\u0131\u015F te\u015Fhis.') + ' ' + v.ders, dogru ? 'iyi' : 'kotu');
          AK.veri.vakaDefteri = AK.veri.vakaDefteri || [];
          AK.veri.vakaDefteri.push({ olay: v.olay.slice(0, 70), dogru: dogru, t: Date.now() });
          AK.kaydet(); tur++; ciz();
        };
      });
    }
    ciz();
  }

  /* --- 77: escape room (10 oda zinciri) --- */
  var ODALAR = [
    { ad: 'ODA 1 \u2014 KAPI NOTU', metin: 'Kap\u0131da bir not: "\u015Eifre, en s\u0131k a\u00E7\u0131k kalan portun numaras\u0131d\u0131r." (Uzak masa\u00FCst\u00FC protokol\u00FC)', cevap: '3389', ipucu: 'RDP = 3389' },
    { ad: 'ODA 2 \u2014 LOG MASASI', metin: 'Log: "sshd: Failed password for root ... 187 kez ... IP 203.0.113.9" Bu bir ne sald\u0131r\u0131s\u0131? (\u0130ngilizce, k\u00FC\u00E7\u00FCk harf)', cevap: 'brute force', ipucu: '\u00E7ok deneme = ?' },
    { ad: 'ODA 3 \u2014 KASA', metin: 'Kasada base64 yaz\u0131l\u0131 not: S0FQSQ==', cevap: 'kapi', ipucu: 'Base64 \u00E7\u00F6z\u00FCc\u00FC kullan' },
    { ad: 'ODA 4 \u2014 KABLO ODASI', metin: 'Duvarda yaz\u0131yor: "G\u00FCvenli olmayan, eski dosya aktar\u0131m protokol\u00FCn\u00FCn portu"', cevap: '21', ipucu: 'FTP kullan\u0131lmaz \u2014 portu ka\u00E7?' },
    { ad: 'ODA 5 \u2014 \u0130MZA MASASI', metin: 'Ekranda: "\u0130ki dosyan\u0131n ayn\u0131 oldu\u011Funu anlamak i\u00E7in kullan\u0131lan 256 bitlik \u00F6zet. K\u0131saltmas\u0131: S...256"', cevap: 'sha256', ipucu: 'sha + bit say\u0131s\u0131' },
    { ad: 'ODA 6 \u2014 PAROLA DUVARI', metin: 'Not: "S\u0131zm\u0131\u015F parola listelerinin en me\u015Fhuru" (\u0130ngilizce, k\u00FC\u00E7\u00FCk harf, bo\u015Fluksuz)', cevap: 'rockyou', ipucu: 'Kali i\u00E7inde haz\u0131r gelen liste' },
    { ad: 'ODA 7 \u2014 YETK\u0130 ODASI', metin: '"Her zaman en az yetki" ilkesinin \u0130ngilizce k\u0131saltmas\u0131 (3 harf)', cevap: 'pol', ipucu: 'P... O... L... \u2014 principle of least privilege' },
    { ad: 'ODA 8 \u2014 A\u011E HAR\u0130TASI', metin: 'Not: "SMB dosya payla\u015F\u0131m\u0131n\u0131n g\u00FCncel portu"', cevap: '445', ipucu: 'Eski portu 139, yenisi?' },
    { ad: 'ODA 9 \u2014 \u015E\u0130FREL\u0130 NOT', metin: 'Sezar \u015Fifresi (3 harf geri): XVWDG', cevap: 'ustad', ipucu: 'X\u2192U, V\u2192S, W\u2192T ...' },
    { ad: 'ODA 10 \u2014 \u00C7IKI\u015E KAPISI', metin: 'Son soru: "\u0130zinsiz eri\u015Fimi yasal izinle test eden tak\u0131m\u0131n rengi" (\u0130ngilizce, k\u00FC\u00E7\u00FCk harf)', cevap: 'red', ipucu: 'Mavi savunur, mor birle\u015Ftirir, ... tak\u0131m sald\u0131r\u0131r' }
  ];
  function escapeOyna() {
    var ic = AK.icerik, oda = 0, puan = 0;
    function ciz() {
      if (oda >= ODALAR.length) {
        ic.innerHTML = AK.baslik('S\u0130BER ESCAPE ROOM', 'kaçış!', ODALAR.length + ' oda tamamland\u0131');
        ic.innerHTML += AK.kutu('<div style="font-size:20px">\uD83D\uDEAA Ka\u00E7\u0131\u015F ba\u015Far\u0131l\u0131 \u00B7 ' + puan + ' / ' + ODALAR.length + '</div>');
        ic.innerHTML += sonucKart('escape', puan, ODALAR.length, puan * 20);
        bagla(); return;
      }
      var o = ODALAR[oda];
      ic.innerHTML = AK.baslik('S\u0130BER ESCAPE ROOM', (oda + 1) + ' / ' + ODALAR.length, 'odalar\u0131 s\u0131rayla \u00E7\u00F6z');
      ic.innerHTML += AK.kutu('<div style="font-weight:700;margin-bottom:6px">' + kac(o.ad) + '</div>'
        + '<div style="font-size:13.6px;line-height:1.7">' + kac(o.metin) + '</div>'
        + '<div class="akDugSira"><input id="eCevap" class="akGirdi" style="flex:1" placeholder="cevap">'
        + '<button class="akDug" id="eVer">KAPIYI A\u00C7</button>'
        + '<button class="akDug" id="eIpucu">\uD83D\uDCA1 \u0130PUCU</button></div>');
      AK.$('#eVer').onclick = function () {
        var c = (AK.$('#eCevap').value || '').trim().toLowerCase();
        if (c === o.cevap) { puan++; oda++; AK.not('\uD83D\uDD13 Oda a\u00E7\u0131ld\u0131!', 'iyi'); ciz(); }
        else AK.not('\u274C Olmad\u0131, tekrar dene.', 'kotu');
      };
      AK.$('#eIpucu').onclick = function () { AK.not('\uD83D\uDCA1 ' + o.ipucu, 'bilgi'); };
    }
    ciz();
  }

  /* --- 77: dedektif modu (3 ayrı vaka) --- */
  var DEDEKTIF_VAKALAR = [
    {
      baslik: '\u015F\u00FCpheli: veri s\u0131zd\u0131rma',
      kanitlar: [
        'Log: 02:11 \u2014 VPN giri\u015Fi ba\u015Far\u0131l\u0131, kullan\u0131c\u0131: m.yilmaz (\u00E7al\u0131\u015Fan kayd\u0131 3 g\u00FCn \u00F6nce "ayr\u0131ld\u0131")',
        'Log: 02:14 \u2014 3,8 GB dosya d\u0131\u015Fa aktar\u0131ld\u0131 (bulut yedek adresi)',
        'Log: 02:31 \u2014 Yerel y\u00F6netici hesab\u0131 eklendi: "bakim"',
        'mail.log: Ayn\u0131 g\u00FCn 01:40 \u2014 m.yilmaz kendi ofis e-postas\u0131na "\u015Fifremi s\u0131f\u0131rlad\u0131m" talebi',
        'Sistem: Ayr\u0131lan personel listesi g\u00FCncellenmemi\u015F (\u0130K\u2019ya bildirilmemi\u015F)',
        'Sistem: Antivir\u00FCs g\u00FCncel, tespit yok'
      ],
      sorular: [
        { soru: 'Ana sorun neydi?', secenekler: ['Ayr\u0131lan \u00E7al\u0131\u015Fan\u0131n hesab\u0131 kapat\u0131lmam\u0131\u015Ft\u0131', 'Antivir\u00FCs g\u00FCncel de\u011Fildi', 'Sunucu yava\u015Ft\u0131', 'Yedek al\u0131nm\u0131yordu'], dogru: 0 },
        { soru: 'Hangi kan\u0131t en kritik?', secenekler: ['Antivir\u00FCs kayd\u0131', 'VPN giri\u015Fi + eski \u00E7al\u0131\u015Fan kayd\u0131', 'Yaz\u0131c\u0131 kuyru\u011Fu', 'Windows s\u00FCr\u00FCm\u00FC'], dogru: 1 },
        { soru: 'Hangi \u00F6nlem bunu engellerdi?', secenekler: ['Daha h\u0131zl\u0131 internet', 'Offboarding: hesap 1 g\u00FCnde kapatma + MFA', 'Daha b\u00FCy\u00FCk disk', 'Yeni antivir\u00FCs'], dogru: 1 },
        { soru: '02:31\u2019deki y\u00F6netici hesab\u0131 ne anlama gelir?', secenekler: ['Kal\u0131c\u0131l\u0131k kurma giri\u015Fimi', 'Bak\u0131m i\u015Fi', 'Yedekleme', 'G\u00FCncelleme'], dogru: 0 },
        { soru: 'Ayn\u0131 gece hangi kay\u0131t inceleme \u00F6nceli\u011Fidir?', secenekler: ['Yaz\u0131c\u0131 kayd\u0131', 'VPN ve dosya aktar\u0131m kay\u0131tlar\u0131', 'Masa\u00FCst\u00FC arka plan\u0131', 'Taray\u0131c\u0131 s\u00FCr\u00FCm\u00FC'], dogru: 1 }
      ]
    },
    {
      baslik: '\u015F\u00FCpheli: fidye yaz\u0131l\u0131m\u0131',
      kanitlar: [
        'Log: 03:41 \u2014 3389 portuna 612 ba\u015Far\u0131s\u0131z giri\u015F denemesi (d\u0131\u015F IP)',
        'Log: 03:58 \u2014 Ba\u015Far\u0131l\u0131 RDP oturumu, hesap: yonetici',
        'Dosya sistemi: 04:10\u2019dan itibaren toplu dosya de\u011Fi\u015Fikli\u011Fi, uzant\u0131 .kilit',
        'Masa\u00FCst\u00FCnde OKU-BENI.txt: "\u00F6deme i\u00E7in ..."',
        'Yedek sunucusu ayn\u0131 a\u011Fda ve yaz\u0131labilir durumda',
        'Antivir\u00FCs: 03:50\u2019de ger\u00E7ek zamanl\u0131 koruma kapat\u0131lm\u0131\u015F'
      ],
      sorular: [
        { soru: 'Giri\u015F yolu neydi?', secenekler: ['E-posta eki', 'RDP (3389) kaba kuvvet', 'USB bellek', 'Kablosuz a\u011F'], dogru: 1 },
        { soru: 'Etkiyi b\u00FCy\u00FCten en kritik durum nedir?', secenekler: ['Yedeklerin ayn\u0131 a\u011Fda ve yaz\u0131labilir olmas\u0131', 'Disk boyutu', 'CPU h\u0131z\u0131', 'Ekran \u00E7\u00F6z\u00FCn\u00FCrl\u00FC\u011F\u00FC'], dogru: 0 },
        { soru: '\u0130lk m\u00FCdahale ne olmal\u0131?', secenekler: ['Format atmak', 'A\u011F ba\u011Flant\u0131s\u0131n\u0131 kesip yay\u0131lmay\u0131 s\u0131n\u0131rlamak', 'Fidye \u00F6demek', 'Sistemi yeniden ba\u015Flatmak'], dogru: 1 },
        { soru: 'Antivir\u00FCs\u00FCn kapat\u0131lmas\u0131 neyi g\u00F6sterir?', secenekler: ['Ar\u0131za', 'Sald\u0131rgan\u0131n savunmay\u0131 devre d\u0131\u015F\u0131 b\u0131rakt\u0131\u011F\u0131n\u0131', 'G\u00FCncelleme', 'Yedekleme'], dogru: 1 },
        { soru: 'En do\u011Fru kal\u0131c\u0131 \u00F6nlem nedir?', secenekler: ['Daha uzun parola', 'RDP\u2019yi kapatmak + VPN + \u00E7evrimd\u0131\u015F\u0131 yedek', 'Daha h\u0131zl\u0131 disk', 'Yeni yaz\u0131c\u0131'], dogru: 1 }
      ]
    },
    {
      baslik: '\u015F\u00FCpheli: i\u00E7 tehdit',
      kanitlar: [
        'Log: 22:05 \u2014 \u0130K kullan\u0131c\u0131s\u0131 1.100 kay\u0131t d\u0131\u015Fa aktard\u0131 (CSV)',
        'Log: 22:07 \u2014 Ayn\u0131 kullan\u0131c\u0131 ar\u015Fivledi ve ki\u015Fisel buluta y\u00FCkledi',
        'Log: 22:09 \u2014 Yetkisi olmayan maa\u015F klas\u00F6r\u00FCne eri\u015Fim denemesi',
        'Sistem: Kullan\u0131c\u0131 3 hafta \u00F6nce istifa etmi\u015F, son iki haftas\u0131nda \u00E7al\u0131\u015F\u0131yor',
        'Sistem: Veri eri\u015Fim kay\u0131tlar\u0131 (audit) a\u00E7\u0131k',
        'Sistem: Yedekler d\u00FCzg\u00FCn al\u0131nm\u0131\u015F'
      ],
      sorular: [
        { soru: 'Bu olay hangi kategoridedir?', secenekler: ['D\u0131\u015F sald\u0131r\u0131', '\u0130\u00E7 tehdit (yetkili kullan\u0131c\u0131)', 'Donan\u0131m ar\u0131zas\u0131', 'Yaz\u0131l\u0131m hatas\u0131'], dogru: 1 },
        { soru: 'Hangi kay\u0131t en g\u00FC\u00E7l\u00FC kan\u0131tt\u0131r?', secenekler: ['Yedek kayd\u0131', 'Toplu d\u0131\u015Fa aktar\u0131m + ki\u015Fisel buluta y\u00FCkleme kayd\u0131', 'Masa\u00FCst\u00FC arka plan\u0131', 'IP adresi'], dogru: 1 },
        { soru: 'Hangi kontrol bunu en erken yakalard\u0131?', secenekler: ['Yaz\u0131c\u0131 izleme', 'Veri eri\u015Fim kayd\u0131 + toplu \u00E7\u0131k\u0131\u015F uyar\u0131s\u0131 (DLP)', 'Disk temizli\u011Fi', 'Tema de\u011Fi\u015Fikli\u011Fi'], dogru: 1 },
        { soru: '\u0130stifa eden personel i\u00E7in do\u011Fru s\u00FCre\u00E7 nedir?', secenekler: ['Eri\u015Fimi kademeli k\u0131s\u0131tlamak ve \u00E7\u0131k\u0131\u015F\u0131 izlemek', 'Hi\u00E7bir \u015Fey yapmamak', 'Sadece parola de\u011Fi\u015Ftirmek', 'Yetkiyi art\u0131rmak'], dogru: 0 },
        { soru: 'Kan\u0131t de\u011Feri i\u00E7in ne \u015Fartt\u0131r?', secenekler: ['Loglar\u0131n de\u011Fi\u015Ftirilmeden saklanmas\u0131 (b\u00FCt\u00FCnl\u00FCk)', 'Daha b\u00FCy\u00FCk ekran', 'Daha h\u0131zl\u0131 a\u011F', 'Yeni klavye'], dogru: 0 }
      ]
    }
  ];
  function dedektifOyna() {
    var ic = AK.icerik;
    var vaka = DEDEKTIF_VAKALAR[Math.floor(Math.random() * DEDEKTIF_VAKALAR.length)];
    var kanitlar = vaka.kanitlar, sorular = vaka.sorular;
    var i = 0, puan = 0;
    function ciz() {
      if (i >= sorular.length) {
        ic.innerHTML = AK.baslik('S\u0130BER DEDEKT\u0130F', 'vaka kapand\u0131', 'kan\u0131tlar\u0131 okudun');
        ic.innerHTML += sonucKart('dedektif', puan, sorular.length, puan * 18);
        bagla(); return;
      }
      var s = sorular[i];
      ic.innerHTML = AK.baslik('S\u0130BER DEDEKT\u0130F', (i + 1) + ' / ' + sorular.length, vaka.baslik);
      ic.innerHTML += AK.kutu('<div class="akEtiket">KANITLAR</div>'
        + kanitlar.map(function (k) { return '<div class="akGorevSatir" style="font-family:Consolas,monospace;font-size:12px">\uD83D\uDD37 ' + kac(k) + '</div>'; }).join('')
        + '<div style="margin-top:10px;font-weight:700">' + kac(s.soru) + '</div>'
        + '<div class="akDugSira" style="flex-direction:column;align-items:stretch">'
        + s.secenekler.map(function (x, k) { return '<button class="akDug" style="text-align:left" data-i="' + k + '">' + kac(x) + '</button>'; }).join('')
        + '</div>');
      AK.$$('[data-i]').forEach(function (b) {
        b.onclick = function () {
          var dogru = parseInt(b.getAttribute('data-i'), 10) === s.dogru;
          if (dogru) puan++;
          AK.not(dogru ? '\u2705 Do\u011Fru.' : '\u274C Yanl\u0131\u015F.', dogru ? 'iyi' : 'kotu');
          i++; ciz();
        };
      });
    }
    ciz();
  }

  /* --- oyun 9: PAROLA GÜCÜ --- */
  var PAROLA_TUR = [
    { p: '123456', guc: false, neden: 'S\u0131zm\u0131\u015F listelerin ilk s\u0131ras\u0131nda; saniyede k\u0131r\u0131l\u0131r.' },
    { p: 'Kenan1981', guc: false, neden: 'Ki\u015Fisel bilgi (ad + y\u0131l) i\u00E7eriyor; hedefli denemede ilk s\u0131rada.' },
    { p: 'u7#Lm2!pQz9vX4', guc: true, neden: '14 karakter, b\u00FCy\u00FCk-k\u00FC\u00E7\u00FCk harf, rakam ve simge var.' },
    { p: 'parola123', guc: false, neden: 'S\u00F6zl\u00FCkteki kelime + ard\u0131\u015F\u0131k rakam; kural tabanl\u0131 ara\u00E7lar an\u0131nda dener.' },
    { p: 'kahve-kitap-orman-9', guc: true, neden: 'Uzun ve ilgisiz kelimelerden olu\u015Fan parola c\u00FCmlesi; uzunluk en g\u00FC\u00E7l\u00FC savunmad\u0131r.' },
    { p: 'qwerty', guc: false, neden: 'Klavye sat\u0131r\u0131; en \u00E7ok denen ilk 10 paroladan biri.' },
    { p: 'Asd123!', guc: false, neden: 'K\u0131sa (7) ve klavye kal\u0131b\u0131; simge eklemek yeterli de\u011Fil.' },
    { p: 'M3rhaba.Dunya!2026', guc: true, neden: 'Uzun, kar\u0131\u015F\u0131k ve tahmin edilmesi zor; kasadan \u00FCretilirse daha iyi.' },
    { p: 'dogumtarihim', guc: false, neden: 'Ki\u015Fisel ve s\u00F6zl\u00FCk kelimesi; sosyal medyadan bulunabilir.' },
    { p: 'X7$vB2#nQ8@wR4!z', guc: true, neden: '16 karakter rastgele; her sitede farkl\u0131s\u0131 kasada saklanmal\u0131.' },
    { p: 'Futbol.1990', guc: false, neden: 'Hobi + y\u0131l; hedefli sald\u0131r\u0131da kolayca tahmin edilir.' },
    { p: 'bir-kedi-bir-kopek-uc-ayi-7', guc: true, neden: 'Uzun ve anlams\u0131z birle\u015Fim; ezberlenebilir ama k\u0131r\u0131lmas\u0131 zor.' }
  ];
  function parolaOyna() {
    var ic = AK.icerik;
    var turler = PAROLA_TUR.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 8);
    var tur = 0, puan = 0;
    function ciz() {
      if (tur >= turler.length) {
        ic.innerHTML = AK.baslik('PAROLA G\u00DCC\u00DC', 'bitti', 'Password Strength');
        ic.innerHTML += sonucKart('parola', puan, turler.length, puan * 12);
        bagla(); return;
      }
      var s = turler[tur];
      ic.innerHTML = AK.baslik('PAROLA G\u00DCC\u00DC', (tur + 1) + ' / ' + turler.length, 'bu parola g\u00FC\u00E7l\u00FC m\u00FC?');
      ic.innerHTML += AK.kutu('<div style="font-family:Consolas,monospace;font-size:19px;margin:6px 0">' + kac(s.p) + '</div>'
        + '<div class="akSoluk">Uzunluk: ' + s.p.length + ' karakter</div>'
        + '<div class="akDugSira"><button class="akDug" id="guc">\uD83D\uDCAA G\u00DC\u00C7L\u00DC</button>'
        + '<button class="akDug" id="zayif">\u26A0\uFE0F ZAYIF</button></div>');
      function cevap(sec) {
        var dogru = (sec === s.guc);
        if (dogru) puan++;
        AK.not((dogru ? '\u2705 Do\u011Fru. ' : '\u274C Yanl\u0131\u015F. ') + s.neden, dogru ? 'iyi' : 'kotu');
        tur++; ciz();
      }
      AK.$('#guc').onclick = function () { cevap(true); };
      AK.$('#zayif').onclick = function () { cevap(false); };
    }
    ciz();
  }

  /* --- oyun 10: OLTALAMA AVI --- */
  var OLTALAMA_TUR = [
    { metin: 'Konu: "Hesab\u0131n\u0131z\u0131 do\u011Frulay\u0131n", g\u00F6nderen: destek@banka-guvenlik.xyz, ba\u011Flant\u0131: banka-guvenlik.xyz/giris', olt: true, neden: 'Alan ad\u0131 bankan\u0131n ger\u00E7ek adresi de\u011Fil; aciliyet + harici ba\u011Flant\u0131 klasik oltalama.' },
    { metin: 'Konu: "Kas\u0131m ay\u0131 maa\u015F bordrosu", g\u00F6nderen: ik@sirketin.com (\u015Firket i\u00E7 adresi), ek: bordro.pdf', olt: false, neden: 'Kurum i\u00E7 adresinden beklenen bildirim; yine de eki do\u011Frulamak iyi al\u0131\u015Fkanl\u0131kt\u0131r.' },
    { metin: 'SMS: "Kargonuz adres yetersizli\u011Fi nedeniyle iade edilecek. G\u00FCncelleme: kargo-takip-tr.co/odeme (3,90 TL)"', olt: true, neden: 'K\u00FC\u00E7\u00FCk \u00F6deme tuza\u011F\u0131 + sahte alan ad\u0131; kart bilgisi isteniyor.' },
    { metin: '\u0130\u015F arkada\u015F\u0131n\u0131z masan\u0131za gelip "toplant\u0131 14:00\u2019e al\u0131nd\u0131" dedi', olt: false, neden: 'Y\u00FCz y\u00FCze ileti\u015Fim; oltalama de\u011Fil.' },
    { metin: 'Konu: "CEO acil havale", g\u00F6nderen: ceo.sirket@gmail.com, metin: "Toplant\u0131day\u0131m, telefonla arama, hemen \u00F6deme yap"', olt: true, neden: 'Y\u00F6netici taklidi (BEC) + gizlilik ve aciliyet bask\u0131s\u0131 + ki\u015Fisel e-posta.' },
    { metin: 'Konu: "Yaz\u0131l\u0131m g\u00FCncellemesi haz\u0131r", g\u00F6nderen: guncelleme@microsoft-destek.net', olt: true, neden: '\u00DCretici bu alan ad\u0131n\u0131 kullanmaz; sahte g\u00FCncelleme tuza\u011F\u0131.' },
    { metin: 'Konu: "Aboneli\u011Finiz yenilendi", g\u00F6nderen: fatura@abonelik-sirketiniz.com (daha \u00F6nce fatura ald\u0131\u011F\u0131n\u0131z adres)', olt: false, neden: 'Bilinen adresten beklenen bildirim; fatura i\u00E7eri\u011Fi tutarl\u0131.' },
    { metin: 'Arama: "Teknik destekten ar\u0131yorum, bilgisayar\u0131n\u0131za uzaktan ba\u011Flanmam gerekiyor, AnyDesk kurun"', olt: true, neden: 'Teknik destek taklidi + uzaktan eri\u015Fim talebi; hi\u00E7bir kurum kendili\u011Finden aramaz.' },
    { metin: 'Konu: "Sizin i\u00E7in haz\u0131rlad\u0131\u011F\u0131m\u0131z i\u015F teklifi", ek: teklif.docm (makro i\u00E7erebilir)', olt: true, neden: 'Beklenmeyen ek + makro uzant\u0131s\u0131 (.docm) zararl\u0131 y\u00FCkleme yoludur.' },
    { metin: 'Kargo firmas\u0131 uygulamas\u0131ndan "\u00FCr\u00FCn\u00FCn\u00FCz yolda" bildirimi (kendi sipari\u015Finizi takip ediyorsunuz)', olt: false, neden: 'Kendi ba\u015Flatt\u0131\u011F\u0131n\u0131z i\u015Flemin bildirimi.' },
    { metin: 'Konu: "2FA kodunuz", g\u00F6nderen: sirket-guvenlik@sirketin.com, metin: "Kodu bize iletin, sistemi g\u00FCncelliyoruz"', olt: true, neden: 'Hi\u00E7bir kurum do\u011Frulama kodunu istemez; kod payla\u015F\u0131l\u0131rsa hesap devral\u0131n\u0131r.' },
    { metin: 'LinkedIn: "\u0130K uzman\u0131" profili sizi arad\u0131, CV istedi, sonra "i\u015Fe al\u0131m i\u00E7in \u00F6deme ve kimlik foto\u011Fraf\u0131" talep etti', olt: true, neden: 'Sahte i\u015Fe al\u0131m doland\u0131r\u0131c\u0131l\u0131\u011F\u0131; \u00F6deme ve kimlik istenmez.' }
  ];
  function oltalamaOyna() {
    var ic = AK.icerik;
    var turler = OLTALAMA_TUR.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 8);
    var tur = 0, puan = 0;
    function ciz() {
      if (tur >= turler.length) {
        ic.innerHTML = AK.baslik('OLTALAMA AVI', 'bitti', 'Phishing Hunt');
        ic.innerHTML += sonucKart('oltalama', puan, turler.length, puan * 12);
        bagla(); return;
      }
      var s = turler[tur];
      ic.innerHTML = AK.baslik('OLTALAMA AVI', (tur + 1) + ' / ' + turler.length, 'oltalama m\u0131, ger\u00E7ek mi?');
      ic.innerHTML += AK.kutu('<div style="font-family:Consolas,monospace;font-size:13.4px;line-height:1.75">' + kac(s.metin) + '</div>'
        + '<div class="akDugSira"><button class="akDug" id="olt">\uD83C\uDFA3 OLTALAMA</button>'
        + '<button class="akDug" id="ger">\u2705 GER\u00C7EK</button></div>');
      function cevap(sec) {
        var dogru = (sec === s.olt);
        if (dogru) puan++;
        AK.not((dogru ? '\u2705 Do\u011Fru. ' : '\u274C Yanl\u0131\u015F. ') + s.neden, dogru ? 'iyi' : 'kotu');
        tur++; ciz();
      }
      AK.$('#olt').onclick = function () { cevap(true); };
      AK.$('#ger').onclick = function () { cevap(false); };
    }
    ciz();
  }

  /* --- oyun 11: LOG AVI (şüpheli satırı bul) --- */
  var LOG_TUR = [
    { satirlar: ['01:10 kullanici1: oturum a\u00E7t\u0131 (masa\u00FCst\u00FC)', '01:12 yazd\u0131rma g\u00F6revi tamamland\u0131', '01:14 powershell -enc SQBFAFgA... d\u0131\u015F adrese ba\u011Flant\u0131', '01:15 yedekleme ba\u015Flad\u0131'], dogru: 2, neden: 'Base64 ile gizlenmi\u015F PowerShell + d\u0131\u015F ba\u011Flant\u0131 = C2 \u015F\u00FCphesi.' },
    { satirlar: ['09:00 DNS sunucusu yeniden ba\u015Flat\u0131ld\u0131', '09:04 203.0.113.9: sshd 480 ba\u015Far\u0131s\u0131z giri\u015F', '09:05 yaz\u0131c\u0131 toner uyar\u0131s\u0131', '09:06 taray\u0131c\u0131 g\u00FCncellendi'], dogru: 1, neden: 'Tek IP\u2019den yo\u011Fun ba\u015Far\u0131s\u0131z giri\u015F = kaba kuvvet.' },
    { satirlar: ['14:00 kullanici3 payla\u015F\u0131ml\u0131 klas\u00F6re dosya kopyalad\u0131', '14:02 disk %61', '14:05 yeni yerel hesap olu\u015Fturuldu: "svc_bakim" ve y\u00F6netici grubuna eklendi', '14:06 yaz\u0131c\u0131 kuyru\u011Fu'], dogru: 2, neden: 'Yeni hesab\u0131n y\u00F6netici grubuna eklenmesi yetki y\u00FCkseltme kal\u0131c\u0131l\u0131\u011F\u0131d\u0131r.' },
    { satirlar: ['22:00 sistem g\u00FCncellendi', '22:03 muhasebe 2,4 GB veriyi ki\u015Fisel buluta y\u00FCkledi', '22:05 ekran kilidi ayar\u0131 uyguland\u0131', '22:07 yaz\u0131c\u0131 beklemede'], dogru: 1, neden: 'B\u00FCy\u00FCk hacimli verinin ki\u015Fisel buluta \u00E7\u0131kmas\u0131 s\u0131z\u0131nt\u0131 i\u015Faretidir.' },
    { satirlar: ['10:00 oturum a\u00E7\u0131ld\u0131', '10:02 dosya olu\u015Fturuldu', '10:04 DNS: 40 farkl\u0131 rastgele alt alan ad\u0131na sorgu', '10:06 yaz\u0131c\u0131 haz\u0131r'], dogru: 2, neden: 'Rastgele alt alan adlar\u0131 DNS t\u00FCneli (veri s\u0131zd\u0131rma) g\u00F6stergesidir.' },
    { satirlar: ['08:00 yedekleme ba\u015Far\u0131l\u0131', '08:05 g\u00FCvenlik duvar\u0131 kural\u0131 de\u011Fi\u015Ftirildi (kaynak: ayr\u0131lm\u0131\u015F hesap)', '08:07 yaz\u0131c\u0131 kuyru\u011Fu', '08:09 saat e\u015Fitlemesi'], dogru: 1, neden: 'Ayr\u0131lm\u0131\u015F hesapla kural de\u011Fi\u015Fikli\u011Fi yetkisiz m\u00FCdahaledir.' },
    { satirlar: ['11:00 kullan\u0131c\u0131 parolas\u0131n\u0131 de\u011Fi\u015Ftirdi', '11:02 antivir\u00FCs ger\u00E7ek zamanl\u0131 koruma kapat\u0131ld\u0131', '11:04 yaz\u0131c\u0131 kuyru\u011Fu temizlendi', '11:06 g\u00FCncelleme kontrol\u00FC'], dogru: 1, neden: 'Savunma bile\u015Feninin kapat\u0131lmas\u0131 sald\u0131r\u0131 haz\u0131rl\u0131\u011F\u0131n\u0131n klasik ad\u0131m\u0131d\u0131r.' },
    { satirlar: ['15:00 toplant\u0131 odas\u0131 yaz\u0131c\u0131s\u0131 haz\u0131r', '15:03 USB tak\u0131ld\u0131 \u2192 12 dosya otomatik kopyaland\u0131', '15:05 masa\u00FCst\u00FC arka plan\u0131 de\u011Fi\u015Fti', '15:07 taray\u0131c\u0131 sekmesi kapand\u0131'], dogru: 1, neden: 'USB tak\u0131l\u0131r tak\u0131lmaz otomatik kopyalama veri \u00E7\u0131karma davran\u0131\u015F\u0131d\u0131r.' },
    { satirlar: ['20:00 oturum a\u00E7\u0131ld\u0131 (T\u00FCrkiye)', '20:12 oturum a\u00E7\u0131ld\u0131 (Brezilya, ayn\u0131 hesap)', '20:14 dosya okundu', '20:20 oturum kapand\u0131'], dogru: 1, neden: '\u0130mk\u00E2ns\u0131z seyahat: hesap ele ge\u00E7irilmi\u015F olabilir.' },
    { satirlar: ['02:00 planl\u0131 bak\u0131m penceresi ba\u015Flad\u0131', '02:30 sunucu yeniden ba\u015Flat\u0131ld\u0131', '02:45 bak\u0131m kayd\u0131 kapat\u0131ld\u0131', '03:00 uzaktan eri\u015Fim arac\u0131 kuruldu (kaynak: bilinmeyen hesap)'], dogru: 3, neden: 'Bak\u0131m penceresi bitti\u011Finde kurulan uzak eri\u015Fim arac\u0131 \u015F\u00FCphelidir.' }
  ];
  function logOyna() {
    var ic = AK.icerik;
    var turler = LOG_TUR.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 7);
    var tur = 0, puan = 0;
    function ciz() {
      if (tur >= turler.length) {
        ic.innerHTML = AK.baslik('LOG AVI', 'bitti', 'Log Hunter');
        ic.innerHTML += sonucKart('log', puan, turler.length, puan * 12);
        bagla(); return;
      }
      var s = turler[tur];
      ic.innerHTML = AK.baslik('LOG AVI', (tur + 1) + ' / ' + turler.length, '\u015F\u00FCpheli sat\u0131r\u0131 bul');
      ic.innerHTML += AK.kutu('<div class="akSoluk">A\u015Fa\u011F\u0131daki kay\u0131tlardan hangisi \u015F\u00FCpheli?</div>'
        + '<div class="akDugSira" style="flex-direction:column;align-items:stretch">'
        + s.satirlar.map(function (x, k) {
          return '<button class="akDug akMono" style="text-align:left" data-i="' + k + '">' + kac(x) + '</button>';
        }).join('') + '</div>');
      AK.$$('[data-i]').forEach(function (b) {
        b.onclick = function () {
          var dogru = parseInt(b.getAttribute('data-i'), 10) === s.dogru;
          if (dogru) puan++;
          AK.not((dogru ? '\u2705 Do\u011Fru sat\u0131r. ' : '\u274C Yanl\u0131\u015F sat\u0131r. ') + s.neden, dogru ? 'iyi' : 'kotu');
          tur++; ciz();
        };
      });
    }
    ciz();
  }

  /* --- oyun 12: HASH TANIMA --- */
  var HASH_TUR = [
    { h: '$2y$10$N9qo8uLOickgx2ZMRZoMye...', ad: 'bcrypt', neden: 'bcrypt "$2" ile ba\u015Flar ve 60 karakterdir; parola saklamada tercih edilir.' },
    { h: '5d41402abc4b2a76b9719d911017c592', ad: 'MD5', neden: '32 karakter hex = MD5; zay\u0131f, parola i\u00E7in kullan\u0131lmamal\u0131.' },
    { h: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824', ad: 'SHA-256', neden: '64 karakter hex = SHA-256; b\u00FCt\u00FCnl\u00FCk do\u011Frulamada yayg\u0131n.' },
    { h: 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d', ad: 'SHA-1', neden: '40 karakter hex = SHA-1; art\u0131k g\u00FCvenli say\u0131lmaz.' },
    { h: '$6$rounds=5000$abcXYZ$k9...', ad: 'SHA-512 (crypt)', neden: '"$6$" Linux g\u00F6lge dosyas\u0131ndaki SHA-512 tabanl\u0131 parola \u00F6zetidir.' },
    { h: '$argon2id$v=19$m=65536,t=3,p=4$...', ad: 'Argon2', neden: 'Argon2 modern ve bellek-sert parola \u00F6zetidir; birinci tercih.' },
    { h: 'X03MO1qnZdYdgyfeuILPmQ==', ad: 'Base64', neden: 'Sonundaki == ve karakter k\u00FCmesi Base64\u2019t\u00FCr; \u00F6zet de\u011Fil, kodlamad\u0131r.' },
    { h: '$1$abcdefgh$Ux4y...', ad: 'MD5 (crypt)', neden: '"$1$" eski crypt MD5 bi\u00E7imidir; k\u0131r\u0131lmas\u0131 kolay.' },
    { h: '8843d7f92416211de9ebb963ff4ce28125932878', ad: 'SHA-1', neden: '40 karakter = SHA-1; her iki uzunlukta da ezber: 32 MD5, 40 SHA-1, 64 SHA-256.' },
    { h: '$2b$12$8S...', ad: 'bcrypt', neden: '"$2b$12$" bcrypt\u2019tir; 12 = i\u015F y\u00FCk\u00FC (maliyet) ayar\u0131.' }
  ];
  var HASH_SEC = ['MD5', 'SHA-1', 'SHA-256', 'bcrypt', 'SHA-512 (crypt)', 'Argon2', 'Base64', 'MD5 (crypt)'];
  function hashOyna() {
    var ic = AK.icerik;
    var turler = HASH_TUR.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 7);
    var tur = 0, puan = 0;
    function ciz() {
      if (tur >= turler.length) {
        ic.innerHTML = AK.baslik('HASH TANIMA', 'bitti', 'Hash Identifier');
        ic.innerHTML += sonucKart('hash', puan, turler.length, puan * 12);
        bagla(); return;
      }
      var s = turler[tur];
      ic.innerHTML = AK.baslik('HASH TANIMA', (tur + 1) + ' / ' + turler.length, 'bu \u00F6zet hangi t\u00FCr?');
      ic.innerHTML += AK.kutu('<div style="font-family:Consolas,monospace;font-size:13px;word-break:break-all;margin-bottom:8px">' + kac(s.h) + '</div>'
        + '<div class="akDugSira">' + HASH_SEC.map(function (z) {
          return '<button class="akDug" data-z="' + kac(z) + '">' + kac(z) + '</button>';
        }).join('') + '</div>');
      AK.$$('[data-z]').forEach(function (b) {
        b.onclick = function () {
          var dogru = b.getAttribute('data-z') === s.ad;
          if (dogru) puan++;
          AK.not((dogru ? '\u2705 Do\u011Fru. ' : '\u274C Yanl\u0131\u015F. Do\u011Frusu: ' + s.ad + ' \u2014 ') + s.neden, dogru ? 'iyi' : 'kotu');
          tur++; ciz();
        };
      });
    }
    ciz();
  }

  /* --- oyun 13: OLAY SIRASI (müdahale adımlarını sırala) --- */
  var SIRA_ADIM = [
    { k: 'Haz\u0131rl\u0131k', n: '\u00D6nceden plan, ileti\u015Fim listesi, yetki ve ara\u00E7 haz\u0131rl\u0131\u011F\u0131' },
    { k: 'Tespit', n: 'Olay\u0131n fark edilmesi ve do\u011Frulanmas\u0131 (log/alarm)' },
    { k: 'S\u0131n\u0131rlama', n: 'Yay\u0131lmay\u0131 durdurma: a\u011F kesme, hesap kilitleme' },
    { k: 'Temizleme', n: 'K\u00F6t\u00FC yaz\u0131l\u0131m/kal\u0131c\u0131l\u0131\u011F\u0131n kald\u0131r\u0131lmas\u0131' },
    { k: 'Kurtarma', n: 'Sistemlerin g\u00FCvenli \u015Fekilde geri a\u00E7\u0131lmas\u0131 + izleme' },
    { k: '\u00C7\u0131kar\u0131m', n: 'K\u00F6k neden analizi ve s\u00FCre\u00E7 iyile\u015Ftirme (ders)' }
  ];
  function siraOyna() {
    var ic = AK.icerik;
    var adimlar = SIRA_ADIM.slice().sort(function () { return Math.random() - 0.5; });
    var beklenen = 0, puan = 0, hata = 0;
    function ciz() {
      if (beklenen >= SIRA_ADIM.length) {
        ic.innerHTML = AK.baslik('OLAY SIRASI', 'tamam', 'Incident Response Order');
        ic.innerHTML += AK.kutu('<div style="font-size:20px;font-weight:700">' + puan + ' / ' + SIRA_ADIM.length + '</div>'
          + '<div class="akSoluk">Hatal\u0131 t\u0131klama: ' + hata + '</div>');
        ic.innerHTML += sonucKart('sira', puan, SIRA_ADIM.length, puan * 15);
        bagla(); return;
      }
      ic.innerHTML = AK.baslik('OLAY SIRASI', (beklenen + 1) + ' / ' + SIRA_ADIM.length, 'do\u011Fru s\u0131rayla t\u0131kla');
      ic.innerHTML += AK.kutu('<div class="akSoluk">Olay m\u00FCdahale ad\u0131mlar\u0131n\u0131 do\u011Fru s\u0131rayla t\u0131kla '
        + '(NIST ak\u0131\u015f\u0131). Yanl\u0131\u015F t\u0131klama say\u0131lmaz ama puan getirmez.</div>'
        + '<div class="akDugSira" style="flex-direction:column;align-items:stretch">'
        + adimlar.map(function (a) {
          return '<button class="akDug" style="text-align:left" data-a="' + a.k + '"><b>' + kac(a.k) + '</b> \u2014 ' + kac(a.n) + '</button>';
        }).join('') + '</div>');
      AK.$$('[data-a]').forEach(function (b) {
        b.onclick = function () {
          var sec = b.getAttribute('data-a');
          if (sec === SIRA_ADIM[beklenen].k) {
            puan++; beklenen++;
            AK.not('\u2705 Do\u011Fru: ' + sec, 'iyi');
            adimlar = adimlar.filter(function (x) { return x.k !== sec; });
            ciz();
          } else {
            hata++;
            AK.not('\u274C S\u0131ra yanl\u0131\u015F. \u015Eu an s\u0131radaki ad\u0131m farkl\u0131.', 'kotu');
          }
        };
      });
    }
    ciz();
  }

  /* --- oyun 14: ARAÇ EŞLEŞTİRME --- */
  var ARAC_TUR = [
    { is: 'A\u00E7\u0131k portlar\u0131 ve servis s\u00FCr\u00FCmlerini tara', dogru: 'nmap', yanlis: ['autopsy', 'lynis', 'john'] },
    { is: 'Web\u2019de gizli dizin/dosya ke\u015Ffi yap', dogru: 'gobuster', yanlis: ['volatility', 'hashcat', 'aircrack-ng'] },
    { is: 'Disk imaj\u0131nda silinmi\u015F dosya ve zaman \u00E7izelgesi incele', dogru: 'autopsy', yanlis: ['nikto', 'hydra', 'nmap'] },
    { is: 'A\u011F trafi\u011Fini yakala ve incele', dogru: 'wireshark', yanlis: ['lynis', 'sqlmap', 'john'] },
    { is: 'Sistem sertle\u015Ftirme denetimi yap ve \u00F6neri al', dogru: 'lynis', yanlis: ['burp suite', 'metasploit', 'goBuster'] },
    { is: 'RAM imaj\u0131ndan \u00E7al\u0131\u015Fan s\u00FCre\u00E7leri \u00E7\u0131kar', dogru: 'volatility', yanlis: ['tcpdump', 'nikto', 'gitleaks'] },
    { is: 'Hash\u2019i GPU ile k\u0131r (yaln\u0131z kendi verin)', dogru: 'hashcat', yanlis: ['aircrack-ng', 'wireshark', 'ss'] },
    { is: 'Depo ge\u00E7mi\u015Finde s\u0131zm\u0131\u015F anahtar/token ara', dogru: 'gitleaks', yanlis: ['nikto', 'lynis', 'volatility'] },
    { is: 'Web isteklerini yakalay\u0131p de\u011Fi\u015Ftir', dogru: 'burp suite', yanlis: ['nmap', 'john', 'autopsy'] },
    { is: 'Kablosuz a\u011F testini otomatikle\u015Ftir (kendi a\u011F\u0131n)', dogru: 'wifite', yanlis: ['sqlmap', 'lynis', 'wireshark'] },
    { is: 'Web sunucusunda bilinen yanl\u0131\u015F yap\u0131land\u0131rmalar\u0131 listele', dogru: 'nikto', yanlis: ['hashcat', 'volatility', 'autopsy'] },
    { is: 'Komut sat\u0131r\u0131ndan paket yakala (grafik aray\u00FCzs\u00FCz)', dogru: 'tcpdump', yanlis: ['burp suite', 'gobuster', 'lynis'] },
    { is: 'Sosyal m\u00FChendislik senaryosu kur (izinli test)', dogru: 'SET', yanlis: ['nmap', 'john', 'gitleaks'] },
    { is: 'SQL enjeksiyonunu tespit et (izinli hedef)', dogru: 'sqlmap', yanlis: ['lynis', 'wifite', 'autopsy'] }
  ];
  function aracOyna() {
    var ic = AK.icerik;
    var turler = ARAC_TUR.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 8);
    var tur = 0, puan = 0;
    function ciz() {
      if (tur >= turler.length) {
        ic.innerHTML = AK.baslik('ARA\u00C7 E\u015ELE\u015ET\u0130RME', 'bitti', 'Tool Matching');
        ic.innerHTML += sonucKart('arac', puan, turler.length, puan * 10);
        bagla(); return;
      }
      var s = turler[tur];
      var sec = [s.dogru].concat(s.yanlis.slice(0, 3)).sort(function () { return Math.random() - 0.5; });
      ic.innerHTML = AK.baslik('ARA\u00C7 E\u015ELE\u015ET\u0130RME', (tur + 1) + ' / ' + turler.length, 'hangi ara\u00E7?');
      ic.innerHTML += AK.kutu('<div style="font-size:15px;margin-bottom:6px">G\u00F6rev: <b>' + kac(s.is) + '</b></div>'
        + '<div class="akDugSira" style="flex-direction:column;align-items:stretch">'
        + sec.map(function (x) {
          return '<button class="akDug akMono" style="text-align:left" data-t="' + kac(x) + '">' + kac(x) + '</button>';
        }).join('') + '</div>');
      AK.$$('[data-t]').forEach(function (b) {
        b.onclick = function () {
          var dogru = b.getAttribute('data-t') === s.dogru;
          if (dogru) puan++;
          AK.not(dogru ? '\u2705 Do\u011Fru ara\u00E7.' : '\u274C Yanl\u0131\u015F. Do\u011Frusu: ' + s.dogru, dogru ? 'iyi' : 'kotu');
          tur++; ciz();
        };
      });
    }
    ciz();
  }

  function sonucKart(oyunAdi, puan, toplam, xp) {
    var yuzde = Math.round(puan / toplam * 100);
    return AK.kutu('<div style="font-size:15px;margin-bottom:6px">Sonu\u00E7: <b>%' + yuzde + '</b> (' + puan + '/' + toplam + ')</div>'
      + AK.cubuk(yuzde, '#ffcc4d')
      + '<div class="akDugSira"><button class="akDug" id="opuanla">PUANI KAYDET (+' + xp + ' XP)</button>'
      + '<button class="akDug" id="otekrar">TEKRAR OYNA</button>'
      + '<button class="akDug" id="oger">OYUN L\u0130STES\u0130</button></div>');
  }
  var sonKayit = null;
  function bagla() {
    var p = AK.$('#opuanla');
    if (p) p.onclick = function () {
      var t = AK.icerik.getAttribute('data-oyunbilgi') || '';
      AK.not('Puan kaydedildi.', 'iyi');
    };
    var t2 = AK.$('#otekrar');
    if (t2) t2.onclick = function () { AK.git('oyun'); };
    var g = AK.$('#oger');
    if (g) g.onclick = function () { AK.git('oyun'); };
  }

  AK.modulEkle('oyun', function () {
    var ic = AK.icerik;
    var v = AK.veri;
    v.oyun = v.oyun || {};
    ic.innerHTML = AK.baslik('M\u0130N\u0130 OYUNLAR', '34 + 77', 'Oyunla \u00F6\u011Fren: 14 mini oyun ve 2 \u00F6zel mod. Hepsi \u00E7evrimd\u0131\u015F\u0131.');
    ic.innerHTML += oyunKart('ag', 'A\u011E SAVUNMASI', '\uD83D\uDEE1\uFE0F', '24 port kural\u0131ndan 8 soru: izin ver / engelle', 'Network Defender');
    ic.innerHTML += oyunKart('soc', 'SOC ALARM', '\uD83D\uDEA8', '26 log kayd\u0131ndan 10 soru: tehdit mi, normal mi?', 'SOC Alert');
    ic.innerHTML += oyunKart('linux', 'L\u0130NUX G\u00D6REV\u0130', '\uD83D\uDC27', '18 komut görevinden 8 soru: do\u011Fru komutu se\u00E7', 'Linux Mission');
    ic.innerHTML += oyunKart('web', 'WEB G\u00D6REV\u0130', '\uD83C\uDF10', '22 kan\u0131ttan 8 soru: zafiyeti s\u0131n\u0131fland\u0131r (15 t\u00FCr)', 'Web Security Quest');
    ic.innerHTML += oyunKart('kripto', 'KR\u0130PTO BULMACA', '\uD83D\uDD10', '16 \u015Fifreden 8 soru: Base64, ASCII, Sezar, ROT13, Hex', 'Crypto Puzzle');
    ic.innerHTML += oyunKart('adli', 'ADL\u0130 VAKA', '\uD83D\uDD2C', '10 vakadan 6 soru: kan\u0131tlar\u0131 oku, te\u015Fhisi koy', 'Forensics Case');
    ic.innerHTML += oyunKart('escape', 'S\u0130BER ESCAPE ROOM', '\uD83D\uDEAA', '10 odal\u0131 zincir: her odada bir cevap', '77. madde');
    ic.innerHTML += oyunKart('dedektif', 'S\u0130BER DEDEKT\u0130F', '\uD83D\uDD75\uFE0F', '3 ayr\u0131 vaka \u00D7 5 soru: kan\u0131tlar\u0131 oku, vakay\u0131 \u00E7\u00F6z', '77. madde');
    ic.innerHTML += oyunKart('parola', 'PAROLA G\u00DCC\u00DC', '\uD83D\uDCAA', '12 paroladan 8 soru: g\u00FC\u00E7l\u00FC m\u00FC, zay\u0131f m\u0131?', 'YEN\u0130');
    ic.innerHTML += oyunKart('oltalama', 'OLTALAMA AVI', '\uD83C\uDFA3', '12 mesajdan 8 soru: oltalama m\u0131, ger\u00E7ek mi?', 'YEN\u0130');
    ic.innerHTML += oyunKart('log', 'LOG AVI', '\uD83D\uDD0D', '10 kay\u0131t grubundan 7 soru: \u015F\u00FCpheli sat\u0131r\u0131 bul', 'YEN\u0130');
    ic.innerHTML += oyunKart('hash', 'HASH TANIMA', '#\uFE0F\u20E3', '10 \u00F6zetten 7 soru: MD5 / SHA-1 / SHA-256 / bcrypt / Argon2', 'YEN\u0130');
    ic.innerHTML += oyunKart('sira', 'OLAY SIRASI', '\uD83E\uDE9C', 'Olay m\u00FCdahale ad\u0131mlar\u0131n\u0131 do\u011Fru s\u0131rayla t\u0131kla', 'YEN\u0130');
    ic.innerHTML += oyunKart('arac', 'ARA\u00C7 E\u015ELE\u015ET\u0130RME', '\uD83E\uDDF0', '14 g\u00F6revden 8 soru: hangi ara\u00E7 kullan\u0131l\u0131r?', 'YEN\u0130');

    var en = '';
    Object.keys(v.oyun).forEach(function (k) { en += '<span class="akEtiket">' + kac(k) + ': ' + v.oyun[k] + '</span> '; });
    ic.innerHTML += AK.kutu('<div class="akEtiket">// REKORLARIN</div>' + (en || '<div class="akSoluk">Hen\u00FCz oyun oynanmad\u0131.</div>')
      + '<div class="akSoluk" style="margin-top:6px">Toplam oyun puan\u0131: ' + (v.oyunToplam || 0) + '</div>'
      + '<div class="akSoluk" style="margin-top:4px">Soru/görev havuzu: 24 port + 26 log + 18 komut + 22 kanıt + 16 şifre + 10 vaka + 10 oda + 3 vaka × 5 soru + 12 parola + 12 mesaj + 10 kayıt + 10 özet + 6 adım + 14 görev = <b>215 soru/görev</b></div>');

    var YAP = {
      ag: agOyna, soc: socOyna, linux: linuxOyna, web: webOyna, kripto: kriptoOyna, adli: adliOyna,
      escape: escapeOyna, dedektif: dedektifOyna, parola: parolaOyna, oltalama: oltalamaOyna,
      log: logOyna, hash: hashOyna, sira: siraOyna, arac: aracOyna
    };
    AK.$$('[data-oyun]').forEach(function (b) {
      b.onclick = function () {
        var id = b.getAttribute('data-oyun');
        AK.not('Oyun ba\u015Flad\u0131: ' + b.closest('.akKutu').querySelector('b').textContent, 'bilgi');
        YAP[id]();
      };
    });
  });

  /* oyun bitişinde puan kaydı: sonuçKart içindeki düğme */
  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'opuanla') {
      /* hangi oyun oldu\u011Funu ba\u015Fl\u0131ktan al */
      var h = AK.$('.akIcerikBaslik h2');
      var ad = h ? h.textContent.replace(/[^\w\u00C0-\u017F ]/g, '').trim() : 'oyun';
      var m = /(\d+)\s*\/\s*(\d+)/.exec(AK.icerik.textContent || '');
      var puan = m ? parseInt(m[1], 10) : 0, top = m ? parseInt(m[2], 10) : 0;
      sonucKaydet(ad.toLowerCase(), puan, top || 1, Math.max(10, puan * 10));
      AK.not('\u2705 Puan kaydedildi: ' + puan + '/' + top, 'iyi');
      AK.git('oyun');
    }
  });
})();
