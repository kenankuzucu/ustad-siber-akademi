/* ==========================================================================
   ÜSTAD SİBER AKADEMİ — MÜFREDAT (akademi-mufredat.js)
   Master liste: 12 (siber kimlik) · 22 (yol haritası) · 23 (12 eğitim alanı)
   24 (ders + quiz) · 29 (çalışma planı) · 38-40 (vaka) · 65 (7 kariyer yolu)
   Ne yapar: 12 eğitim alanının TAM programı — seviye seviye, hafta hafta.
   Çevrimdışı çalışır, ilerleme tarayıcıda saklanır.
   ========================================================================== */
(function () {
  'use strict';
  if (!window.AK) return;
  var AK = window.AK;
  var kac = AK.kac, $ = AK.$, $$ = AK.$$;

  AK.MODUL.push({ id: 'mufredat', simge: '\uD83D\uDCDA', ad: 'MÜFREDAT', alt: '12 alan · 48 seviye · haftalık plan' });
  AK.RENK = AK.RENK || {};
  AK.RENK.mufredat = '#ffd21a';

  /* ---------------------------------------------------------------- VERİ ----
     12 eğitim alanı × 4 seviye. Her seviye: süre, hedef, konular, uygulama,
     proje ve ölçme. Tümü bu makinede uygulanabilir (sunucu istemez).        */
  var S = function (sev, hafta, hedef, konular, uygulama, proje, olcme) {
    return { sev: sev, hafta: hafta, hedef: hedef, konular: konular, uygulama: uygulama, proje: proje, olcme: olcme };
  };

  AK.MUFREDAT = [
    { id: 'network', ad: 'AĞ GÜVENLİĞİ', simge: '\uD83C\uDF10', renk: '#00eaff', seviyeler: [
      S('BAŞLANGIÇ', 4, 'Ağın nasıl çalıştığını okuyup yazabilmek',
        ['OSI ve TCP/IP katmanları', 'IP adresi, alt ağ maskesi, geçit', 'DNS, DHCP, ARP görevleri', 'Switch ve yönlendirici farkı', 'Kablolu/kablosuz bağlantı kontrolü', 'Temel ağ komutları'],
        ['ip a · ip r ile kendi ağını oku', 'ping / traceroute ile yol izle', 'arp -a ile komşu cihazları gör'],
        'Ev/kurum ağının krokisi + cihaz envanteri (marka, IP, MAC, port)',
        '40 soru · SINAV MERKEZİ → AĞ GÜVENLİĞİ'),
      S('ORTA', 5, 'Port, servis ve trafiği tespit edebilmek',
        ['Port kavramı ve yaygın servisler', 'nmap tarama türleri', 'Servis sürümü parmak izi', 'tcpdump ile paket yakalama', 'Güvenlik duvarı temelleri', 'VLAN ve yayın alanı'],
        ['nmap -sS -sV ile kendi labını tara', 'tcpdump ile bir oturumu kaydet', 'ufw ile yalnız gerekli portu aç'],
        'İzole labda port/servis envanter raporu + gereksiz servis kapatma listesi',
        '50 soru · SINAV MERKEZİ → AĞ GÜVENLİĞİ'),
      S('İLERİ', 6, 'Ağ katmanı saldırılarını tanıyıp savunabilmek',
        ['MITM ve ARP spoofing mantığı', 'ARP/DHCP spoofing savunması', '802.1X ve NAC kavramı', 'VPN / IPSec temelleri', 'IDS-IPS (Suricata mantığı)', 'Ağ segmentasyonu'],
        ['İzole labda arpwatch/DHCP snooping kur', 'Suricata ile örnek trafik kuralı yaz', 'Segmentasyon şeması çiz'],
        'Kurum için segmentasyon + izleme planı (kural örnekleriyle)',
        '60 soru · SINAV MERKEZİ → AĞ GÜVENLİĞİ'),
      S('UZMAN', 6, 'Ağ olayını adli bakışla inceleyebilmek',
        ['PCAP derin inceleme akışı', 'TLS trafiğinde gördüğümüz/göremediğimiz', 'DDoS türleri ve savunma', 'Yönlendirme güvenliği (BGP hijack kavramı)', 'Zero Trust ağ mimarisi', 'Ağ olay müdahale adımları'],
        ['Elde edilmiş bir PCAP üzerinde zaman çizelgesi çıkar', 'DDoS savunma katmanlarını planla'],
        'Uçtan uca ağ olay müdahalesi tatbikatı + rapor',
        '60 soru + SENARYO · LABORATUVARLAR') ] },

    { id: 'linux', ad: 'LİNUX GÜVENLİĞİ', simge: '\uD83D\uDC27', renk: '#ff8c1a', seviyeler: [
      S('BAŞLANGIÇ', 4, 'Sistemi güvenli kullanacak kadar komut bilmek',
        ['Klasör yapısı ve dosya yolları', 'İzinler: chmod, chown, umask', 'Kullanıcı ve grup kavramı', 'Süreç izleme: ps, top, kill', 'apt paket yönetimi', 'Yardım: man, --help'],
        ['ls -la / chmod 600 / umask 077 alıştırması', 'ps aux · ss -tulpn ile dinleyenleri gör', 'Yeni kullanıcı aç ve yetkisini sınırla'],
        'Sistem hesap ve izin envanteri + sıkılaştırma önerisi',
        '40 soru · SINAV MERKEZİ → LİNUX GÜVENLİĞİ'),
      S('ORTA', 5, 'Erişimi anahtarla ve servisle yönetebilmek',
        ['sudo ve visudo mantığı', 'SSH anahtarı üretimi ve sertleştirme', 'systemd servis yönetimi', 'journalctl ile günlük okuma', 'cron zamanlanmış görevler', 'Yedek: rsync ve 3-2-1'],
        ['ssh-keygen ile Ed25519 anahtar üret, ssh-copy-id ile kur', 'PermitRootLogin no + PasswordAuthentication no uygula', 'rsync -av --delete ile yedek al'],
        'Anahtarlı SSH girişi + otomatik günlük yedek betiği',
        '50 soru · SINAV MERKEZİ → LİNUX GÜVENLİĞİ'),
      S('İLERİ', 6, 'Sunucuyu ölçülebilir şekilde sertleştirmek',
        ['ufw ve iptables temelleri', 'fail2ban ile kaba kuvvet engeli', 'AppArmor / SELinux profilleri', 'auditd ile denetim kaydı', 'AIDE ile dosya bütünlüğü', 'LUKS ile disk şifreleme'],
        ['ufw default deny + yalnız 22 aç', 'fail2ban sshd kuralını uygula ve test et', 'auditctl ile /etc/passwd izleme kuralı ekle'],
        'Sertleştirme raporu: önce/sonra karşılaştırmalı (lynis çıktısıyla)',
        '60 soru · SINAV MERKEZİ → LİNUX GÜVENLİĞİ'),
      S('UZMAN', 6, 'İzole laboratuvar kurup olay inceleyebilmek',
        ['İzole lab: sanal makine + host-only ağ', 'Konteyner güvenliği temelleri', 'CIS Benchmark yaklaşımı (lynis/openscap)', 'Olay müdahale ilk adımları', 'Rootkit ve şüpheli süreç tespiti', 'Otomasyon: tekrar kurulabilir sertleştirme'],
        ['Kali + hedef VM kur, ağları YALNIZ host-only yap', 'Şüpheli süreç avı: ss -tulpn + ps aux + journalctl'],
        'Tek komutla uygulanan sertleştirme betiği + sıfırdan kurulum kılavuzu',
        '60 soru + LABORATUVARLAR (izole)') ] },

    { id: 'python', ad: 'PYTHON', simge: '\uD83D\uDC0D', renk: '#3affb0', seviyeler: [
      S('BAŞLANGIÇ', 4, 'Küçük araçları kendi başına yazabilmek',
        ['Değişken, tip, liste, sözlük', 'Koşul ve döngüler', 'Fonksiyonlar ve parametreler', 'Dosya okuma/yazma', 'Hata yönetimi (try/except)', 'Kod düzeni ve yorum'],
        ['Kullanıcıdan girdi alan bir birim çevirici yaz', 'Dosya satırlarını sayan betik yaz'],
        'Komut satırında çalışan küçük araç (ör. parola üretici)',
        '40 soru · SINAV MERKEZİ → PYTHON'),
      S('ORTA', 5, 'Veri toplayıp işleyen araç yazabilmek',
        ['Modüller ve sanal ortam (venv)', 'requests ile HTTP', 'JSON ve CSV işleme', 're ile metin ayrıştırma', 'argparse ile komut satırı', 'Log üretimi'],
        ['Bir siteden izinli şekilde başlık bilgisi çek', 'nginix/apache erişim logundan en çok isteyen IP listesi çıkar'],
        'Log analiz aracı: özet + en çok görülen hata kodları',
        '50 soru · SINAV MERKEZİ → PYTHON'),
      S('İLERİ', 6, 'Güvenlik aracı yazıp test edebilmek',
        ['Soket programlama temelleri', 'İzinli hedefte port/servis kontrol betiği', 'cryptography ile şifreleme', 'hashlib ve tuz', 'pytest ile test yazma', 'Paketleme ve sürüm'],
        ['Kendi yazdığın port kontrolünü YALNIZ izole labda çalıştır', 'AES ile dosya şifrele/çöz betiği yaz', 'Betiğe 3 birim testi yaz'],
        'Testleri olan güvenlik kontrol aracı (yalnız izinli/izole ortam)',
        '60 soru · SINAV MERKEZİ → PYTHON'),
      S('UZMAN', 6, 'Güvenli servis ve otomasyon kurabilmek',
        ['asyncio ile paralel iş', 'FastAPI/Flask ile güvenli API', 'Kimlik doğrulama ve oran sınırı', 'Kod inceleme (kendi kodunu denetle)', 'SSAST aracı mantığı', 'AI/ML kullanımında girdi doğrulama'],
        ['Girdi doğrulaması ve oran sınırı olan küçük API yaz', 'Kendi projende gitleaks ile sır taraması yap'],
        'Güvenli API + testler + kısa tehdit modeli',
        '60 soru + PROJE TAKİP') ] },

    { id: 'web', ad: 'WEB GÜVENLİĞİ', simge: '\uD83C\uDF0D', renk: '#4d7cff', seviyeler: [
      S('BAŞLANGIÇ', 4, 'Bir web uygulamasını doğru okuyabilmek',
        ['HTTP/HTTPS ve durum kodları', 'GET/POST ve başlıklar', 'Çerez, oturum, SameSite', 'Tarayıcı geliştirici araçları', 'Same-origin ve CORS kavramı', 'Sertifika nedir'],
        ['Tarayıcıda bir isteği incele, başlıkları not al', 'Çerez özniteliklerini (Secure/HttpOnly/SameSite) listele'],
        'Bir sitenin istek/yanıt analiz raporu',
        '40 soru · SINAV MERKEZİ → WEB GÜVENLİĞİ'),
      S('ORTA', 5, 'OWASP Top 10 risklerini tanımak',
        ['OWASP Top 10 genel bakış', 'XSS türleri ve savunma', 'CSRF ve token mantığı', 'Erişim kontrolü ve IDOR', 'Güvenli girdi doğrulama (allowlist)', 'Güvenli başlıklar (CSP, HSTS)'],
        ['İzole labda DVWA/Juice Shop kur (ana ağdan yalıt)', 'XSS ve CSRF örneklerini izleyip savunmasını uygula'],
        'İzole lab bulgu raporu: 5 bulgu + her biri için düzeltme',
        '50 soru · SINAV MERKEZİ → WEB GÜVENLİĞİ'),
      S('İLERİ', 6, 'Enjeksiyon ve sunucu tarafı riskleri anlamak',
        ['SQL Injection mantığı ve parametreli sorgu', 'Komut enjeksiyonu', 'XXE ve XML güvenliği', 'Güvensiz dosya yükleme', 'SSRF', 'Yapılandırma hataları'],
        ['İzole labda parametreli sorgunun farkı göster', 'Dosya yükleme kurallarını yaz (tip, boyut, isim)'],
        'Sertleştirme denetimi: başlıklar + yükleme + hata yönetimi',
        '60 soru · SINAV MERKEZİ → WEB GÜVENLİĞİ'),
      S('UZMAN', 6, 'Uçtan uca web testi ve raporu çıkarabilmek',
        ['Kimlik doğrulama ve JWT hataları', 'İş mantığı zaafları', 'OWASP API Top 10', 'Tedarik zinciri (npm audit, SCA)', 'Güvenlik duvarı (WAF) davranışı', 'Bulgu yazımı ve önem derecesi'],
        ['İzole labda API yetki testi yap', 'Bağımlılık zafiyet taraması çalıştır'],
        'Tam web testi raporu (izole lab): özet, bulgular, kanıt, çözüm',
        '60 soru + PROJE TAKİP') ] },

    { id: 'blueteam', ad: 'BLUE TEAM / SOC', simge: '\uD83D\uDEE1\uFE0F', renk: '#2ee6a8', seviyeler: [
      S('BAŞLANGIÇ', 4, 'Log okuyup anlamlı sinyal görebilmek',
        ['Log türleri ve kaynakları', 'SIEM ne yapar', 'Uyarı (alert) ile olay (incident) farkı', 'IOC nedir', 'Zaman damgası ve saat dilimi', 'Temel tespit mantığı'],
        ['Kendi makinenin günlüklerini topla ve sınıfla', '3 şüpheli satırı elle işaretle ve nedenini yaz'],
        'Log kaynak envanteri + ilk 10 izlenecek olay listesi',
        '40 soru · SINAV MERKEZİ → BLUE TEAM / SOC'),
      S('ORTA', 5, 'Kural yazıp alarm üretebilmek',
        ['Windows Event ID temelleri', 'Sysmon ile süreç/ağ izleme', 'Korelasyon kuralı yazma', 'Yanlış pozitif ayarı', 'Alarm önceliklendirme', 'Vaka notu tutma'],
        ['5 korelasyon kuralı yaz (ör. çok başarısız giriş)', 'Kuralları örnek loglarla test et'],
        'Kural seti + test sonuçları raporu',
        '50 soru · SINAV MERKEZİ → BLUE TEAM / SOC'),
      S('İLERİ', 6, 'Olay müdahalesini akışa bağlamak',
        ['Sigma kural yapısı', 'Triyaj akışı', 'Olay müdahale adımları (hazırlık→kapanış)', 'Kanıt toplama ve bozulmama', 'Ağ izleme (Suricata/Zeek mantığı)', 'Tehdit istihbaratı kullanımı'],
        ['Bir zararlı davranışı için Sigma kuralı yaz', 'Olay için kanıt toplama sırasını listele'],
        'Olay müdahale playbook (5 senaryo için adım adım)',
        '60 soru + SENARYOLAR'),
      S('UZMAN', 6, 'Tehdit avlayıp ölçümle iyileştirebilmek',
        ['MITRE ATT&CK eşlemesi', 'Hipotez tabanlı tehdit avcılığı', 'Otomatik müdahale mantığı', 'Purple team tatbikatı', 'MTTD / MTTR ölçümü', 'Yönetime rapor'],
        ['Bir ATT&CK tekniği seç, tespit edilebilirliğini test et', 'Tatbikat için senaryo ve ölçüm planı hazırla'],
        'Tatbikat raporu: tespit süresi, kör noktalar, iyileştirme planı',
        '60 soru + LABORATUVARLAR') ] },

    { id: 'kripto', ad: 'KRİPTOGRAFİ', simge: '\uD83D\uDD10', renk: '#c04dff', seviyeler: [
      S('BAŞLANGIÇ', 4, 'Şifreleme ile özetin farkını bilmek',
        ['Simetrik / asimetrik şifreleme', 'Hash ve tek yönlülük', 'Tuz (salt) neden gerekli', 'TLS sertifikası nedir', 'GPG anahtar çifti', 'Parola gücü ve uzunluk'],
        ['Hash al, aynı metinsin iki tuz ile farklı çıktı üret', 'GPG anahtarı üret ve bir metni imzala'],
        'Kendi anahtarların + imzalama kanıtı',
        '40 soru · SINAV MERKEZİ → KRİPTOGRAFİ'),
      S('ORTA', 5, 'Şifrelemeyi günlük işlerde kullanabilmek',
        ['OpenSSL komut satırı', 'Dosya şifreleme (AES)', 'Sertifika zinciri ve doğrulama', 'HSTS ve zorunlu HTTPS', 'Parola kasası (pass/KeePassXC)', 'Yedeklerin şifrelenmesi'],
        ['openssl ile dosya şifrele ve çöz', 'Kendi imzalı sertifika üret ve tarayıcıda incele'],
        'Şifreli yedekleme akışı + parola kasası kurulumu',
        '50 soru · SINAV MERKEZİ → KRİPTOGRAFİ'),
      S('İLERİ', 6, 'Zayıflıkları ölçüp doğrulama kurabilmek',
        ['Hash kırma mantığı (hashcat/john)', 'Kendi parolanı denetle (yerel)', 'TOTP ve 2FA kurulumu', 'Anahtar saklama ve izinler', 'PGP e-posta akışı', 'HMAC ile bütünlük'],
        ['2FA kur ve yedek kodları güvenli sakla', 'TOTP kodunu komutla üretip doğrula'],
        'Parola politikası + tüm hesaplarda 2FA kontrol listesi',
        '60 soru · SINAV MERKEZİ → KRİPTOGRAFİ'),
      S('UZMAN', 6, 'Kriptografiyi tasarım kararına dönüştürmek',
        ['KDF: bcrypt / argon2 seçimi', 'Kriptografik hata avı', 'JWT imza doğrulama', 'Sır yönetimi (Vault mantığı)', 'İmzalama doğrulama (cosign)', 'Kuantum sonrası kavramlar'],
        ['Bir uygulamada hash ve tuz ayarını denetle', 'İmza doğrulama adımını çalıştır'],
        'Sır yönetimi tasarım notu: kim, hangi sırra, nasıl erişir',
        '60 soru + PROJE TAKİP') ] },

    { id: 'adli', ad: 'ADLİ BİLİŞİM', simge: '\uD83D\uDD0E', renk: '#8b6cff', seviyeler: [
      S('BAŞLANGIÇ', 4, 'Delili bozmadan toplayabilmek',
        ['Delil türleri ve uçuculuk', 'Zincir (chain of custody)', 'İmaj alma mantığı', 'Hash ile doğrulama', 'Write blocker ne yapar', 'Not tutma standardı'],
        ['Bir USB belleği imajla ve hash değeriyle doğrula', 'Delil teslim formu doldur'],
        'İmaj + hash + teslim kaydı dosyası',
        '40 soru · SINAV MERKEZİ → ADLİ BİLİŞİM'),
      S('ORTA', 5, 'Diskte ne olduğunu okuyabilmek',
        ['Autopsy / Sleuth Kit kullanımı', 'Silinmiş dosya kurtarma', 'Metadata ve EXIF', 'Zaman çizelgesi kurma', 'Tarayıcı artefaktları', 'Rapor dili'],
        ['İmajı Autopsy ile aç, silinen dosya ara', 'Zaman çizelgesi çıkar ve 3 olayı işaretle'],
        'Timeline raporu: ne, ne zaman, hangi kanıtla',
        '50 soru · SINAV MERKEZİ → ADLİ BİLİŞİM'),
      S('İLERİ', 6, 'Bellek ve ağ adlini birleştirmek',
        ['Bellek analizi (Volatility)', 'Ağ adli: PCAP okuma', 'Windows artefaktları (Registry, Prefetch)', 'Log adli ve saat kayması', 'Mobil adli temelleri', 'Bilirkişi raporu yapısı'],
        ['Bellek imajında süreç ve bağlantı listesi çıkar', 'PCAP dosyasından oturum akışı çıkar'],
        'Bellek + ağ bulgularını birleştiren teknik rapor',
        '60 soru + VAKALAR'),
      S('UZMAN', 6, 'Vakayı uçtan uca yönetebilmek',
        ['Anti-forensics tespiti', 'Şifreli ortamda inceleme sınırları', 'Vaka yönetimi ve saklama', 'Uzman tanıklık raporu', 'Süreç otomasyonu', 'Yöntem doğrulama'],
        ['Bir vakada zaman çizelgesi + karşı kanıtı karşılaştır', 'Raporu hukuki dil ile yeniden yaz'],
        'Tam vaka dosyası: imaj, bulgu, çizelge, rapor, zincir',
        '60 soru + PROJE TAKİP') ] },

    { id: 'osint', ad: 'OSINT', simge: '\uD83D\uDD75\uFE0F', renk: '#ff5fa2', seviyeler: [
      S('BAŞLANGIÇ', 4, 'Açık kaynağı doğru okumak',
        ['Arama operatörleri (site:, filetype:)', 'whois ve dig', 'Sosyal medya gizlilik ayarları', 'Fotoğraf metadata (EXIF)', 'Kaynak doğrulama mantığı', 'Etik ve yasal sınır'],
        ['Kendi dijital ayak izini ara (yalnız kendin)', 'whois ve dig ile bir alan adını incele'],
        'Kendi dijital ayak izi raporu + azaltma planı',
        '40 soru · SINAV MERKEZİ → OSINT'),
      S('ORTA', 5, 'İzinli hedef için istihbarat toplamak',
        ['theHarvester kullanımı', 'Alt alan adı keşfi', 'Shodan mantığı', 'E-posta ve hesap kontrolü', 'Ters görsel arama', 'Bulguyu kaydetme'],
        ['İzinli bir hedef (kendi siten) için toplama yap', 'Bulguları kaynak+ tarihle tablola'],
        'İzinli hedef OSINT dosyası (kaynaklı)',
        '50 soru · SINAV MERKEZİ → OSINT'),
      S('İLERİ', 6, 'İstihbaratı anlamlı hâle getirmek',
        ['İstihbarat döngüsü', 'Kaynak güvenilirliği (A1-F6 mantığı)', 'Anonimlik: VPN+Tor, Tails/Whonix', 'Kripto para iz sürme mantığı', 'Veri ihlali kontrolü', 'Brifing yazımı'],
        ['Bir konu için 3 kaynağı çapraz doğrula', 'Anonimlik sınırlarını ve risklerini yaz'],
        'İstihbarat brifingi (1 sayfa, kaynaklı, önerili)',
        '60 soru · SINAV MERKEZİ → OSINT'),
      S('UZMAN', 6, 'Aktör profili ve OPSEC kurabilmek',
        ['OSINT otomasyonu (spiderfoot mantığı)', 'Tehdit aktörü profili çıkarma', 'OPSEC hataları', 'Yasal sınırlar (KVKK/TCK)', 'Yanıltma (deception) tespiti', 'Yönetim raporu'],
        ['Bir saldırı kampanyasının açık izlerini derle', 'Kendi OPSEC kontrol listeni yaz'],
        'Tehdit aktörü profili + savunma önerileri',
        '60 soru + PROJE TAKİP') ] },

    { id: 'bulut', ad: 'BULUT GÜVENLİĞİ', simge: '\u2601\uFE0F', renk: '#33d6ff', seviyeler: [
      S('BAŞLANGIÇ', 4, 'Bulut ve konteyner mantığını kurmak',
        ['Paylaşılan sorumluluk modeli', 'IAM: kullanıcı, rol, izin', 'Konteyner nedir, imaj nedir', 'Docker temel komutları', 'Bölge/ağ kavramı', 'Sır kavramı (env, dosya)'],
        ['Bir konteyner çalıştır ve içine gir', 'İmajı yalnız gerekli portla ayağa kaldır'],
        'Konteyner çalışma notu: imaj, port, kullanıcı, sınırlar',
        '40 soru · SINAV MERKEZİ → BULUT GÜVENLİĞİ'),
      S('ORTA', 5, 'İmajı ve sırları güvenli tutmak',
        ['Dockerfile güvenliği', 'Kök olmayan kullanıcı ile çalıştırma', 'İmaj tarama (trivy)', 'Katman ve boyut azaltma', 'Sır sızıntısı taraması (gitleaks)', 'Ortam değişkeni yönetimi'],
        ['Bir imajı trivy ile tara, bulguları not al', 'Depo geçmişinde sır taraması yap'],
        'İmaj sertleştirme raporu: önce/sonra zafiyet sayısı',
        '50 soru · SINAV MERKEZİ → BULUT GÜVENLİĞİ'),
      S('İLERİ', 6, 'Kümeyi kurala göre denetlemek',
        ['Kubernetes RBAC', 'Pod güvenliği (securityContext)', 'Network policy', 'Admission control mantığı', 'kube-bench ile denetim', 'IaC taraması (checkov)'],
        ['kubectl auth can-i --list ile yetkini oku', 'kube-bench çıktısındaki başarısızları listele'],
        'Küme denetim raporu + düzeltme sırası (öncelikli)',
        '60 soru · SINAV MERKEZİ → BULUT GÜVENLİĞİ'),
      S('UZMAN', 6, 'Tedarik zincirini uçtan uca güvenceye almak',
        ['CI/CD hattı güvenliği', 'SBOM üretimi (syft) ve tarama (grype)', 'İmzalama ve doğrulama (cosign)', 'Bulut olay müdahalesi', 'Yetki yükseltme yolları (izole lab)', 'Maliyet ve risk dengesi'],
        ['Bir imaj için SBOM üret ve tara', 'Hattına imza doğrulama adımı ekle (taslak)'],
        'Tedarik zinciri güvenlik planı + kontrol listesi',
        '60 soru + PROJE TAKİP') ] },

    { id: 'ai', ad: 'AI GÜVENLİĞİ', simge: '\uD83E\uDDE0', renk: '#ff4d6d', seviyeler: [
      S('BAŞLANGIÇ', 4, 'AI kullanımının risklerini bilmek',
        ['LLM nasıl üretir, nerede yanılır', 'Prompt ve bağlam', 'Halüsinasyon', 'Veri gizliliği: ne yazılmaz', 'Telif ve etik', 'İnsan kontrolü'],
        ['Gizli veri içermeyen bir prompt şablonu yaz', 'Bir çıktıyı 2 kaynakla doğrula'],
        'AI kullanım kontrol listesi (ne paylaşılır, ne paylaşılmaz)',
        '40 soru · SINAV MERKEZİ → AI GÜVENLİĞİ'),
      S('ORTA', 5, 'Prompt tabanlı saldırıları tanımak',
        ['Prompt injection türleri', 'Veri sızdırma yolları', 'Çıktı doğrulama', 'RAG güvenliği temelleri', 'Erişim hakları ve kapsam', 'Loglama ve iz'],
        ['10 maddelik prompt injection test seti yaz', 'Sonuçları tablo hâlinde kaydet'],
        'Prompt injection test seti + sonuç raporu',
        '50 soru · SINAV MERKEZİ → AI GÜVENLİĞİ'),
      S('İLERİ', 6, 'Savunma katmanı kurmak',
        ['Jailbreak savunması', 'Araç (tool) çağırma güvenliği', 'Model kartı okuma', 'Veri zehirleme kavramı', 'Gölge AI politikası', 'Onay akışları'],
        ['Yüksek riskli işlemler için onay adımı tasarla', 'Girdi/çıktı filtresi kuralları yaz'],
        'AI kullanım politikası (kurum için, uygulanabilir)',
        '60 soru · SINAV MERKEZİ → AI GÜVENLİĞİ'),
      S('UZMAN', 6, 'AI sistemini sınayıp raporlamak',
        ['Model ve dosya tedarik zinciri riski', 'Gizlilik korumalı öğrenme kavramı', 'AI red-team yaklaşımı', 'Otomatik koruma (guardrail)', 'Uyum: KVKK / AB AI Yasası', 'Yönetim raporu'],
        ['Kendi modeline 20 senaryoluk red-team testi uygula', 'Bulguları risk derecesiyle tablola'],
        'AI red-team raporu + savunma önerileri',
        '60 soru + PROJE TAKİP') ] },

    { id: 'ctf', ad: 'CTF / LAB', simge: '\uD83D\uDEA9', renk: '#ff9f1a', seviyeler: [
      S('BAŞLANGIÇ', 4, 'Yarışma mantığını ve temel araçları öğrenmek',
        ['CTF türleri (jeopardy / attack-defense)', 'Kategori tanıma', 'file, strings, binwalk', 'İpucu okuma', 'Yazma alışkanlığı', 'Takım içi iş bölümü'],
        ['Kolay 3 makinede numaralandırma yap', 'Her biri için 1 sayfa çözüm yazısı'],
        '3 çözüm yazısı (ne denedim, ne oldu, neden)',
        '40 soru · MİNİ OYUNLAR → CTF ARENA'),
      S('ORTA', 5, 'Kategori bazlı çözüm becerisi',
        ['Web soruları', 'Kripto soruları', 'Adli sorular', 'Steganografi', 'Hash tanıma ve kırma', 'OSINT soruları'],
        ['5 orta seviye soruyu çöz ve yaz', 'Kullandığın komutları not defterine ekle'],
        '5 çözüm + kısa araç notları',
        '50 soru · SINAV MERKEZİ → CTF / LAB'),
      S('İLERİ', 6, 'Makine ele geçirme akışını tamamlamak',
        ['Numaralandırma derinliği', 'Servis istismarı (izinli lab)', 'Yanal hareket', 'Yetki yükseltme', 'Statik tersine mühendislik temeli', 'Zaman yönetimi'],
        ['İzole labda bir makinede uçtan uca akışı uygula', 'Her adımı kanıtla (ekran görüntüsü + komut)'],
        'İzole lab makine raporu: adım adım, kanıtlı',
        '60 soru + LABORATUVARLAR (izole)'),
      S('UZMAN', 6, 'Üretmek ve savunmak',
        ['Kendi izole labini kurma', 'Savunma tarafında CTF', 'Otomasyon ve betikler', 'Zafiyet yazımı (izinli)', 'Takım yönetimi', 'Kurallara uyum'],
        ['Kendi CTF sorunu yaz ve çöz (izinli lab)', 'Savunma bandında bir senaryoyu engelle'],
        'Kendi sorun + çözümü + savunma notları',
        '60 soru + PROJE TAKİP') ] },

    { id: 'kariyer', ad: 'KARİYER', simge: '\uD83D\uDCBC', renk: '#ffd21a', seviyeler: [
      S('BAŞLANGIÇ', 4, 'Nereye gittiğini netleştirmek',
        ['Alan ve rol seçimi', 'Kendini değerlendirme', 'Öğrenme planı kurma', 'Dokümantasyon alışkanlığı', 'Etik çerçeve', 'Zaman yönetimi'],
        ['3 aylık öğrenme planı yaz (haftalık)', 'Haftalık not düzenini kur'],
        'Haftalık plan + ilk ay kontrol listesi',
        '40 soru · SINAV MERKEZİ → KARİYER'),
      S('ORTA', 5, 'Görünür bir portföy kurmak',
        ['CV yazımı (teknik)', 'GitHub portföyü', 'LinkedIn profili', 'Teknik yazı yazma', 'Sertifika haritası', 'Referans yönetimi'],
        ['CV metnini ATS uyumlu hâle getir', 'GitHub profilini düzenle ve 1 proje yayınla'],
        'CV + GitHub portföyü + 1 teknik yazı',
        '50 soru · KARİYER & PORTFÖY'),
      S('İLERİ', 6, 'Mülakata ve işe hazırlanmak',
        ['Teknik mülakat soruları', 'Mülakat simülasyonu', 'Vaka sorusu anlatımı', 'Ücret ve kapsam konuşması', 'Sözleşme ve yazılı izin', 'Referans mektubu'],
        ['3 mülakat simülasyonu yap (kaydet, dinle)', 'Bir teklif için soru listesi hazırla'],
        'Mülakat simülasyonu kaydı + geri bildirim notu',
        '60 soru · KARİYER & PORTFÖY'),
      S('UZMAN', 6, 'Ekip ve hizmet kurmak',
        ['Ekip kurma ve yönetme', 'Test raporu standardı', 'Uyum ve denetim (ISO 27001 / KVKK)', 'Eğitim verme', 'Girişimcilik ve fiyatlama', 'Kişisel marka'],
        ['Standart bir test raporu şablonu hazırla', 'Kendi hizmet kataloğunu yaz'],
        'Hizmet kataloğu + sözleşme/izin taslağı + rapor şablonu',
        '60 soru + PROJE TAKİP') ] }
  ];

  /* ------------------------------------------------------------- YARDIMCI -- */
  var SEV_IKON = ['\u2460', '\u2461', '\u2462', '\u2463'];
  AK.mufTo = function () { return AK.veri.mufredat || (AK.veri.mufredat = {}); };
  AK.mufTam = function (alanId, sevNo) { return !!AK.mufTo()[alanId + ':' + sevNo]; };
  AK.mufAlanTam = function (alan) {
    var n = 0;
    for (var i = 0; i < alan.seviyeler.length; i++) if (AK.mufTam(alan.id, i)) n++;
    return n;
  };
  AK.mufToplam = function () {
    var t = 0;
    AK.MUFREDAT.forEach(function (a) { a.seviyeler.forEach(function () { t++; }); });
    return t;
  };
  AK.mufTamamlanan = function () {
    var t = 0;
    AK.MUFREDAT.forEach(function (a) { a.seviyeler.forEach(function (s, i) { if (AK.mufTam(a.id, i)) t++; }); });
    return t;
  };
  AK.mufHafta = function (alan) {
    var h = 0;
    alan.seviyeler.forEach(function (s) { h += s.hafta; });
    return h;
  };

  /* ------------------------------------------------------------- GÖRÜNÜM -- */
  function ozetKart() {
    var toplam = AK.mufToplam(), tam = AK.mufTamamlanan();
    var yuzde = Math.round(tam / toplam * 100);
    var hafta = 0;
    AK.MUFREDAT.forEach(function (a) { hafta += AK.mufHafta(a); });
    return '<div class="akKutu akMufOzet">'
      + '<div class="akMufKutular">'
      + '<div class="akMufKutu"><b>' + AK.MUFREDAT.length + '</b><span>EĞİTİM ALANI</span></div>'
      + '<div class="akMufKutu"><b>' + toplam + '</b><span>SEVİYE BLOĞU</span></div>'
      + '<div class="akMufKutu"><b>' + hafta + '</b><span>TOPLAM HAFTA</span></div>'
      + '<div class="akMufKutu"><b>' + yuzde + '%</b><span>İLERLEME</span></div>'
      + '</div>'
      + '<div class="akCubuk"><i style="width:' + yuzde + '%"></i></div>'
      + '<div class="akMufIlerleme">' + tam + ' / ' + toplam + ' seviye tamamlandı'
      + ' &nbsp;·&nbsp; <b>Sıradaki:</b> ' + sonrakiOneri() + '</div>'
      + '</div>';
  }

  function sonrakiOneri() {
    for (var i = 0; i < AK.MUFREDAT.length; i++) {
      var a = AK.MUFREDAT[i];
      for (var j = 0; j < a.seviyeler.length; j++) {
        if (!AK.mufTam(a.id, j)) {
          return kac(a.ad) + ' → Seviye ' + (j + 1) + ' (' + a.seviyeler[j].sev + ')';
        }
      }
    }
    return 'TÜM MÜFREDAT TAMAMLANDI ✔';
  }

  function alanSerit() {
    var h = '<div class="akMufSerit">';
    AK.MUFREDAT.forEach(function (a) {
      var t = AK.mufAlanTam(a), top = a.seviyeler.length;
      var tamMi = t === top;
      h += '<button class="akMufAlan" data-mufalan="' + a.id + '" style="--mrenk:' + a.renk + '">'
        + '<span class="akMufAlanSimge">' + a.simge + '</span>'
        + '<span class="akMufAlanAd">' + kac(a.ad) + '</span>'
        + '<span class="akMufAlanAlt">' + t + '/' + top + ' seviye' + (tamMi ? ' ✔' : '') + '</span>'
        + '</button>';
    });
    return h + '</div>';
  }

  function seviyeKart(alan, s, i) {
    var tam = AK.mufTam(alan.id, i);
    var h = '<div class="akMufSeviye' + (tam ? ' akMufBitti' : '') + '" style="--mrenk:' + alan.renk + '">'
      + '<div class="akMufSevUst">'
      + '<span class="akMufSevNo">' + SEV_IKON[i] + '</span>'
      + '<span class="akMufSevAd">SEVİYE ' + (i + 1) + ' — ' + s.sev + '</span>'
      + '<span class="akMufSevSure">' + s.hafta + ' hafta</span>'
      + (tam ? '<span class="akMufTik">TAMAMLANDI ✔</span>' : '')
      + '</div>'
      + '<div class="akMufHedef"><b>HEDEF:</b> ' + s.hedef + '</div>'
      + '<div class="akMufIki">'
      + '<div><div class="akMufAltBaslik">KONULAR</div><ul class="akMufListe">'
      + s.konular.map(function (k) { return '<li>' + k + '</li>'; }).join('')
      + '</ul></div>'
      + '<div><div class="akMufAltBaslik">UYGULAMA</div><ul class="akMufListe akMufUyg">'
      + s.uygulama.map(function (u) { return '<li>' + u + '</li>'; }).join('')
      + '</ul>'
      + '<div class="akMufAltBaslik">PROJE</div><div class="akMufProje">' + s.proje + '</div>'
      + '<div class="akMufAltBaslik">ÖLÇME</div><div class="akMufOlcme">' + s.olcme + '</div>'
      + '</div></div>'
      + '<div class="akMufDugSira">'
      + '<button class="akDug akMufTamDug" data-mufyap="' + alan.id + ':' + i + '">'
      + (tam ? 'İŞARETİ KALDIR' : 'SEVİYEYİ TAMAMLADIM (+40 XP)') + '</button>'
      + '<button class="akDug akMufSinavDug" data-mufsinav="1">SINAVA GİR →</button>'
      + '<button class="akDug akMufLabDug" data-muflab="1">LABORATUVAR →</button>'
      + '</div></div>';
    return h;
  }

  function alanGorunum(alanId) {
    var alan = AK.MUFREDAT.filter(function (a) { return a.id === alanId; })[0];
    if (!alan) alan = AK.MUFREDAT[0];
    var h = '<div class="akMufBaslik" style="--mrenk:' + alan.renk + '">'
      + '<span class="akMufBSimge">' + alan.simge + '</span>'
      + '<span class="akMufBAd">' + kac(alan.ad) + '</span>'
      + '<span class="akMufBMeta">' + alan.seviyeler.length + ' seviye · ' + AK.mufHafta(alan) + ' hafta · '
      + AK.mufAlanTam(alan) + '/' + alan.seviyeler.length + ' tamamlandı</span></div>';
    alan.seviyeler.forEach(function (s, i) { h += seviyeKart(alan, s, i); });
    return h;
  }

  /* -------------------------------------------------------------- MODÜL --- */
  AK.modulEkle('mufredat', function () {
    var ic = AK.icerik;
    var secili = AK.veri.mufSecili || AK.MUFREDAT[0].id;
    AK.veri.mufSecili = secili;

    ic.innerHTML = AK.baslik('MÜFREDAT', '12 alan · 48 seviye · haftalık plan',
      'Her alanın TAM programı: hedef, konular, uygulama, proje ve ölçme. Seviyeyi bitirdikçe işaretle; '
      + 'ilerleme kaydedilir ve Akademi Beyni bir sonraki adımı önerir.');

    ic.innerHTML += ozetKart();
    ic.innerHTML += '<div style="height:10px"></div>' + alanSerit();
    ic.innerHTML += '<div id="akMufAlan" class="akMufAlanAlan">' + alanGorunum(secili) + '</div>';

    /* alan seçimi */
    AK.$$('[data-mufalan]').forEach(function (b) {
      var id = b.getAttribute('data-mufalan');
      if (id === secili) b.classList.add('akMufSec');
      b.onclick = function () {
        AK.veri.mufSecili = id;
        AK.kaydet();
        AK.git('mufredat');
      };
    });

    /* seviye tamamla / kaldır */
    AK.$$('[data-mufyap]').forEach(function (b) {
      b.onclick = function () {
        var p = b.getAttribute('data-mufyap').split(':');
        var alanId = p[0], no = p[1];
        var to = AK.mufTo();
        var anahtar = alanId + ':' + no;
        if (to[anahtar]) {
          delete to[anahtar];
          AK.not('Seviye işareti kaldırıldı.', 'bilgi');
        } else {
          to[anahtar] = { t: Date.now() };
          AK.xpEkle(40, 'Müfredat seviyesi tamamlandı');
          AK.veri.milestone = AK.veri.milestone || [];
          var alan = AK.MUFREDAT.filter(function (a) { return a.id === alanId; })[0];
          var sv = alan ? alan.seviyeler[parseInt(no, 10)] : null;
          AK.veri.milestone.push({ ad: 'Müfredat: ' + (alan ? alan.ad : alanId) + ' · ' + (sv ? sv.sev : no), t: Date.now() });
          AK.not('\u2705 Seviye tamamlandı! +40 XP — ' + (alan ? kac(alan.ad) : '') + ' / ' + (sv ? sv.sev : ''), 'iyi');
        }
        AK.kaydet();
        AK.rozetKontrol = AK.rozetKontrol || function () {};
        try { AK.rozetKontrol(); } catch (e) {}
        AK.git('mufredat');
      };
    });

    /* sınav / laboratuvar kısayolları */
    AK.$$('[data-mufsinav]').forEach(function (b) { b.onclick = function () { AK.git('sinav'); }; });
    AK.$$('[data-muflab]').forEach(function (b) { b.onclick = function () { AK.git('lab'); }; });
  });

  /* Akademi Beyni / görev merkezi için öneri köprüsü */
  AK.mufOneri = function () {
    for (var i = 0; i < AK.MUFREDAT.length; i++) {
      var a = AK.MUFREDAT[i];
      for (var j = 0; j < a.seviyeler.length; j++) {
        if (!AK.mufTam(a.id, j)) {
          var s = a.seviyeler[j];
          return {
            alan: a.ad, alanId: a.id, seviye: s.sev, no: j + 1, hafta: s.hafta,
            hedef: s.hedef, ilkKonu: s.konular[0], proje: s.proje
          };
        }
      }
    }
    return null;
  };
})();
