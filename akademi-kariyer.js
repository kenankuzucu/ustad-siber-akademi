/* ==========================================================================
   ÜSTAD AKADEMİ SİTESİ — KARİYER & PORTFÖY (akademi-kariyer.js)
   Master liste: 60-61 (Cyber Portfolio) · 62 (CV + AI CV analizi) ·
   63 (LinkedIn/sosyal paylaşım) · 64-65 (kariyer simülatörü + 7 kariyer yolu) ·
   66 (AI mülakat simülatörü) · 67-69 (proje merkezi + proje sergisi) ·
   81 (mezuniyet sistemi + mezun profili)
   ========================================================================== */
(function () {
  'use strict';
  if (!window.AK) return;
  var AK = window.AK, kac = AK.kac;

  AK.MODUL.push({ id: 'kariyer', simge: '\uD83D\uDCBC', ad: 'KAR\u0130YER & PORTF\u00D6Y', alt: 'CV, m\u00FClakat, proje sergisi' });
  AK.RENK.kariyer = '#ff9f45';

  /* ---------------------------- 65: 7 kariyer yolu ------------------------ */
  var YOLLAR = [
    { id: 'soc', ad: 'SOC ANALYST', alanlar: ['blueteam', 'network'], araclar: 'SIEM, EDR, log analizi', hedef: 'Alarm kuyru\u011Funu y\u00F6netmek' },
    { id: 'blue', ad: 'BLUE TEAM / SAVUNMA', alanlar: ['blueteam', 'linux', 'kripto'], araclar: 'Sertle\u015Ftirme, yama y\u00F6netimi', hedef: 'Sald\u0131r\u0131 y\u00FCzeyini k\u00FC\u00E7\u00FCltmek' },
    { id: 'network', ad: 'NETWORK SECURITY', alanlar: ['network', 'linux'], araclar: 'Nmap, Wireshark, firewall', hedef: 'A\u011F\u0131 tasarlamak ve izlemek' },
    { id: 'adli', ad: 'D\u0130J\u0130TAL FORENSICS', alanlar: ['adli', 'linux', 'kripto'], araclar: 'Autopsy, FTK, hash', hedef: 'Delil \u00E7\u0131karmak ve raporlamak' },
    { id: 'bulut', ad: 'CLOUD SECURITY', alanlar: ['bulut', 'linux'], araclar: 'IAM, konteyner, IaC', hedef: 'Bulut yap\u0131land\u0131rmas\u0131n\u0131 g\u00FCvenli kurmak' },
    { id: 'ai', ad: 'AI SECURITY', alanlar: ['ai', 'python'], araclar: 'Model g\u00FCvenli\u011Fi, veri koruma', hedef: 'AI sistemlerini korumak' },
    { id: 'sizma', ad: 'PENETRATION TESTING', alanlar: ['network', 'web', 'kripto'], araclar: 'Burp, Metasploit (izole lab)', hedef: 'Yasal izinle zafiyet bulmak' }
  ];

  function uyum(yol) {
    var sm = AK.skillMatris ? AK.skillMatris() : [];
    var top = 0, n = 0;
    yol.alanlar.forEach(function (a) {
      var x = sm.filter(function (s) { return s.id === a; })[0];
      if (x) { top += (x.yuzde || 0); n++; }
    });
    return n ? Math.round(top / n) : 0;
  }

  /* --------------------------- 66: mülakat soruları ---------------------- */
  var MULAKAT = [
    { s: 'Bir alarm\u0131n ger\u00E7ek tehdit mi yanl\u0131\u015F alarm m\u0131 oldu\u011Funu nas\u0131l anlars\u0131n?', c: ['Log korelasyonu + kullan\u0131c\u0131 davran\u0131\u015F\u0131 + IOC kontrol\u00FC', 'Alarm\u0131 kapat\u0131r\u0131m', 'Kullan\u0131c\u0131y\u0131 su\u00E7lar\u0131m', 'Beklerim'], d: 0 },
    { s: 'Fidye yaz\u0131l\u0131m\u0131 bula\u015Ft\u0131ysa ilk 3 ad\u0131m?', c: ['\u0130zole et \u2192 kan\u0131t topla \u2192 yedekten geri d\u00F6n', 'Fidye \u00F6de', 'Format at', 'Antivir\u00FCs a\u00E7'], d: 0 },
    { s: 'HTTPS trafi\u011Fini neden u\u00E7tan uca g\u00F6remeyiz?', c: ['\u015Eifreleme + sertifika do\u011Frulamas\u0131', 'Port kapal\u0131', 'DNS yok', 'Yava\u015F'], d: 0 },
    { s: 'En az yetki ilkesi nedir?', c: ['Kullan\u0131c\u0131ya i\u015Fi i\u00E7in gereken en az izin', 'Herkes y\u00F6netici olsun', 'Parola payla\u015F\u0131m\u0131', '\u0130zinsiz \u00E7al\u0131\u015Fma'], d: 0 },
    { s: 'Sertifika do\u011Frulama kodu neden gerekir?', c: ['Belgenin ger\u00E7ekli\u011Fi ba\u011F\u0131ms\u0131z do\u011Frulanabilsin', 'S\u00FCs', 'PDF boyutu', 'Zorunlu de\u011Fil'], d: 0 },
    { s: 'Log tutman\u0131n as\u0131l faydas\u0131?', c: ['Olay sonras\u0131 zaman \u00E7izelgesi ve kan\u0131t', 'Disk doldurma', 'Yava\u015Flatma', 'Gerekli de\u011Fil'], d: 0 },
    { s: 'Zafiyet taramas\u0131 ile s\u0131zma testi fark\u0131?', c: ['Tarama bulur, s\u0131zma testi s\u00F6m\u00FCr\u00FClebilirli\u011Fi kan\u0131tlar', 'Ayn\u0131 \u015Fey', 'Tarama daha derin', 'Fark yok'], d: 0 },
    { s: 'Yedekleme 3-2-1 kural\u0131?', c: ['3 kopya, 2 farkl\u0131 ortam, 1 \u00E7evrimd\u0131\u015F\u0131', '3 disk ayn\u0131 yerde', '2 yedek yeter', '1 bulut yeter'], d: 0 }
  ];

  /* ------------------------------ 67-68: projeler ------------------------- */
  var PROJELER = [
    { id: 'p1', ad: 'G\u00FCvenli Oturum A\u00E7ma Mod\u00FCl\u00FC', seviye: 'Ba\u015Flang\u0131\u00E7', alan: 'web', adimlar: 'Parametreli sorgu, parola \u00F6zetleme (bcrypt/Argon2), oturum \u00E7erezi HttpOnly+Secure, 5 hata kilidi.' },
    { id: 'p2', ad: 'Ki\u015Fisel A\u011F Tarama Raporu', seviye: 'Ba\u015Flang\u0131\u00E7', alan: 'network', adimlar: 'Kendi a\u011F\u0131nda nmap -sV taramas\u0131, port envanteri, gereksiz servis kapatma \u00F6nerisi, rapor.' },
    { id: 'p3', ad: 'Log \u0130zleme Panosu', seviye: 'Orta', alan: 'blueteam', adimlar: 'auth.log/web.log ayr\u0131\u015Ft\u0131r\u0131c\u0131, ba\u015Far\u0131s\u0131z giri\u015F sayac\u0131, e\u015Fik a\u015F\u0131m\u0131nda uyar\u0131, g\u00FCnl\u00FCk \u00F6zet.' },
    { id: 'p4', ad: 'Yanl\u0131\u015F Yap\u0131land\u0131rma Denet\u00E7isi', seviye: 'Orta', alan: 'linux', adimlar: 'SUID listesi, a\u00E7\u0131k portlar, bo\u015F parolal\u0131 hesaplar, world-writable dosyalar \u2192 kontrol listesi.' },
    { id: 'p5', ad: 'Dosya B\u00FCt\u00FCl\u00FC\u011F\u00FC \u0130zleyici', seviye: 'Orta', alan: 'adli', adimlar: 'Klas\u00F6rdeki dosyalar\u0131n SHA-256 \u00F6zetini sakla, de\u011Fi\u015Fince uyar (b\u00FCt\u00FCl\u00FCk izleme).' },
    { id: 'p6', ad: 'KABA KUVVET SAVUNMASI', seviye: 'Orta', alan: 'blueteam', adimlar: 'Oran s\u0131n\u0131r\u0131, artan gecikme, hesap kilitleme, loglama ve uyar\u0131.' },
    { id: 'p7', ad: 'OSINT Profil \u00C7\u0131karma (kendi ad\u0131na)', seviye: 'Orta', alan: 'osint', adimlar: 'A\u00E7\u0131k kaynaklarda kendi dijital izini \u00E7\u0131kar, gereksiz verileri kald\u0131r.' },
    { id: 'p8', ad: 'Mini SOC Sim\u00FC lat\u00F6r\u00FC'.replace('\u00FC ', '\u00FC'), seviye: '\u0130leri', alan: 'blueteam', adimlar: 'Alarm \u00FCreteci, \u00F6nem s\u0131ralamas\u0131, olay kayd\u0131 a\u00E7ma, kapan\u0131\u015F raporu.' },
    { id: 'p9', ad: 'Kripto Ara\u00E7 Kutusu', seviye: '\u0130leri', alan: 'kripto', adimlar: 'Base64/ROT13/Sezar a\u00E7-kapa, SHA-256 kar\u015F\u0131la\u015Ft\u0131r, dosya b\u00FCt\u00FCl\u00FC\u011F\u00FC.' },
    { id: 'p10', ad: 'Bulut Yap\u0131land\u0131rma Denetimi', seviye: '\u0130leri', alan: 'bulut', adimlar: 'IAM fazla yetki taramas\u0131, a\u00E7\u0131k depolama kontrol\u00FC, gereksiz anahtar temizli\u011Fi.' }
  ];

  /* ------------------------------- portföy -------------------------------- */
  function portfoyOzet() {
    var v = AK.veri;
    var r = AK.rutbe ? AK.rutbe() : { ad: '-\u00D6\u011ERENC\u0130' };
    return {
      ad: (v.profil && v.profil.ad) ? v.profil.ad : 'Kenan Kuzucu',
      no: (v.profil && v.profil.no) ? v.profil.no : '-',
      seviye: AK.seviye ? AK.seviye() : 1,
      rutbe: r.ad || r,
      xp: v.xp || 0,
      rozet: Object.keys(v.rozetler || {}).length,
      sertifika: (v.sertifikalar || []).length,
      lab: (v.labTamam || []).length,
      ctf: Object.keys(v.ctf || {}).length,
      proje: Object.keys(v.projeTamam || {}).length,
      hedef: AK.hedef ? (AK.hedef() ? AK.hedef().ad : 'belirlenmedi') : '-',
      soru: AK.toplamSoru ? AK.toplamSoru() : 0,
      dogru: AK.dogruSoru ? AK.dogruSoru() : 0
    };
  }
  function cvMetni() {
    var o = portfoyOzet();
    var sm = (AK.skillMatris ? AK.skillMatris() : []).slice().sort(function (a, b) { return (b.yuzde || 0) - (a.yuzde || 0); }).slice(0, 5);
    var l = [];
    l.push('KENAN KUZUCU');
    l.push('\u00D6\u011ERENC\u0130 NO: ' + o.no + '  |  R\u00DCTBE: ' + o.rutbe + '  |  SEV\u0130YE: ' + o.seviye);
    l.push('HEDEF: ' + o.hedef);
    l.push('');
    l.push('\u00D6ZET');
    l.push('Siber g\u00FCvenlik alan\u0131nda uygulamal\u0131 e\u011Fitim al\u0131yorum. ' + o.soru + ' soru \u00E7\u00F6zd\u00FCm ('
      + o.dogru + ' do\u011Fru), ' + o.lab + ' laboratuvar tamamlad\u0131m, ' + o.ctf + ' CTF g\u00F6revi \u00E7\u00F6zd\u00FCm, '
      + o.rozet + ' rozet ve ' + o.sertifika + ' sertifika kazand\u0131m. Toplam ' + o.xp + ' XP.');
    l.push('');
    l.push('G\u00DC\u00C7L\u00DC ALANLAR');
    sm.forEach(function (a) { l.push('- ' + a.ad + ' (%' + Math.round(a.yuzde || 0) + ')'); });
    l.push('');
    l.push('PROJELER');
    (AK.veri.projeTamam ? Object.keys(AK.veri.projeTamam) : []).forEach(function (id) {
      var p = PROJELER.filter(function (x) { return x.id === id; })[0];
      if (p) l.push('- ' + p.ad + ' (' + p.seviye + ')');
    });
    l.push('');
    l.push('SERT\u0130F\u0130KALAR');
    (AK.veri.sertifikalar || []).forEach(function (s) { l.push('- ' + (s.ad || 'Sertifika') + ' \u2014 ' + (s.kod || '') + ' (' + AK.trTarih(s.t) + ')'); });
    l.push('');
    l.push('NOT: Bu CV, akademideki ger\u00E7ek ilerleme verisinden otomatik \u00FCretildi.');
    return l.join('\n');
  }

  function cvAnaliz(metin) {
    var uyarilar = [], iyi = [];
    var m = metin.toLowerCase();
    if (m.length < 400) uyarilar.push('CV k\u0131sa; her proje i\u00E7in 1-2 sat\u0131r sonu\u00E7 yaz (\u00F6l\u00E7\u00FClebilir).');
    if (!/sertifika/.test(m)) uyarilar.push('Sertifika b\u00F6l\u00FCm\u00FC yok \u2014 akademiden kazand\u0131klar\u0131n\u0131 ekle.');
    if (!/lab|laboratuvar|proje/.test(m)) uyarilar.push('Uygulama kan\u0131t\u0131 yok: laboratuvar ve proje ekle (i\u015Fe al\u0131mda en \u00E7ok bu bak\u0131l\u0131r).');
    if (!/\d/.test(m)) uyarilar.push('Say\u0131 yok: "20 soru", "3 lab" gibi \u00F6l\u00E7\u00FClebilir ifade kullan.');
    if (/en iyi|m\u00FCkemmel|harika/.test(m)) uyarilar.push('Abart\u0131l\u0131 ifadeler yerine kan\u0131t yaz.');
    if (/sertifika/.test(m)) iyi.push('Sertifika b\u00F6l\u00FCm\u00FC var \u2014 do\u011Frulama kodu eklemeyi unutma.');
    if (/\d/.test(m)) iyi.push('\u00D6l\u00E7\u00FClebilir say\u0131lar var.');
    if (/proje/.test(m)) iyi.push('Proje b\u00F6l\u00FCm\u00FC var.');
    return { uyarilar: uyarilar, iyi: iyi };
  }

  /* ------------------------------- çizim --------------------------------- */
  AK.modulEkle('kariyer', function () {
    var ic = AK.icerik;
    var o = portfoyOzet();
    ic.innerHTML = AK.baslik('KAR\u0130YER & PORTF\u00D6Y', o.rutbe + ' \u00B7 ' + o.xp + ' XP',
      'Portf\u00F6y, CV, kariyer yollar\u0131, m\u00FClakat, proje sergisi ve mezuniyet.');

    /* portföy */
    ic.innerHTML += AK.kutu('<div class="akEtiket">// 60-61. MADDE \u2014 CYBER PORTFOLIO</div>'
      + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-top:8px">'
      + [['\u00D6\u011Frenci No', o.no], ['Seviye / R\u00FCtbe', o.seviye + ' \u00B7 ' + o.rutbe],
         ['Soru', o.soru + ' (' + o.dogru + ' do\u011Fru)'], ['Laboratuvar', o.lab],
         ['CTF', o.ctf], ['Rozet', o.rozet], ['Sertifika', o.sertifika], ['Proje', o.proje]]
        .map(function (x) { return '<div style="border:1px solid var(--ak-cizgi);border-radius:10px;padding:8px">'
          + '<div class="akSoluk" style="font-size:11.5px">' + x[0] + '</div><b>' + kac(String(x[1])) + '</b></div>'; }).join('')
      + '</div>');

    /* CV */
    var cv = cvMetni();
    ic.innerHTML += '<div style="height:10px"></div>' + AK.kutu('<div class="akEtiket">// 62. MADDE \u2014 CV (\u00F6nizleme)</div>'
      + '<pre id="cvMetin" style="font-family:Consolas,monospace;font-size:12.2px;white-space:pre-wrap;line-height:1.6;max-height:260px;overflow:auto">' + kac(cv) + '</pre>'
      + '<div class="akDugSira"><button class="akDug" id="cvKopya">\uD83D\uDCCB KOPYALA</button>'
      + '<button class="akDug" id="cvIndir">\u2B07\uFE0F \u0130ND\u0130R (.txt)</button>'
      + '<button class="akDug" id="cvYazdir">\uD83D\uDDA8\uFE0F YAZDIR / PDF</button>'
      + '<button class="akDug" id="cvAnaliz">\uD83E\uDDE0 AI CV ANAL\u0130Z\u0130</button></div>'
      + '<div id="cvSonuc" style="margin-top:8px"></div>');

    /* 63: LinkedIn / paylaşım */
    ic.innerHTML += '<div style="height:10px"></div>' + AK.kutu('<div class="akEtiket">// 63. MADDE \u2014 PAYLA\u015EIM (LinkedIn)</div>'
      + '<div class="akSoluk">A\u015Fa\u011F\u0131daki metni kopyalay\u0131p LinkedIn/WhatsApp/X\u2019te payla\u015Fabilirsin. Otomatik payla\u015F\u0131m yap\u0131lmaz \u2014 karar sende.</div>'
      + '<pre id="paylasMetin" style="font-family:Consolas,monospace;font-size:12.2px;white-space:pre-wrap;margin-top:8px">'
      + kac('\uD83D\uDEE1\uFE0F \u00DCSTAD S\u0130BER AKADEM\u0130 ilerlemem:\n'
        + '\u2022 Seviye ' + o.seviye + ' \u00B7 ' + o.xp + ' XP \u00B7 ' + o.rozet + ' rozet\n'
        + '\u2022 ' + o.soru + ' soru \u00B7 ' + o.lab + ' laboratuvar \u00B7 ' + o.ctf + ' CTF g\u00F6revi\n'
        + '\u2022 ' + o.sertifika + ' sertifika \u00B7 hedefim: ' + o.hedef + '\n'
        + '#SiberG\u00FCvenlik #BlueTeam #SOC')
      + '</pre><div class="akDugSira"><button class="akDug" id="payKopya">\uD83D\uDCCB METN\u0130 KOPYALA</button>'
      + '<button class="akDug" id="payLinkedin">LinkedIn\u2019i A\u00E7</button></div>');

    /* kariyer simülatörü */
    ic.innerHTML += '<div style="height:10px"></div>' + AK.kutu('<div class="akEtiket">// 64-65. MADDE \u2014 S\u0130BER KAR\u0130YER S\u0130M\u00DCLAT\u00D6R\u00DC (7 YOL)</div>'
      + YOLLAR.map(function (y) {
        var u = uyum(y);
        return '<div style="margin:10px 0"><div style="display:flex;gap:8px;align-items:center"><b style="flex:1">' + kac(y.ad) + '</b>'
          + '<span class="akSoluk">uyum %' + u + '</span></div>'
          + AK.cubuk(u, AK.RENK.kariyer)
          + '<div class="akSoluk" style="font-size:12px;margin-top:4px">' + kac(y.araclar) + ' \u00B7 ' + kac(y.hedef)
          + ' \u00B7 gerekli alanlar: ' + y.alanlar.map(function (a) {
            var al = (AK.ALAN || []).filter(function (x) { return x.id === a; })[0];
            return kac(al ? al.ad : a);
          }).join(', ') + '</div></div>';
      }).join(''));

    /* mülakat */
    ic.innerHTML += '<div style="height:10px"></div>' + AK.kutu('<div class="akEtiket">// 66. MADDE \u2014 AI M\u00DCLAKAT S\u0130M\u00DCLAT\u00D6R\u00DC</div>'
      + '<div class="akSoluk">8 teknik soru \u2022 do\u011Fru cevap ve gerek\u00E7esi ile.</div>'
      + '<div class="akDugSira"><button class="akDug" id="mulakatBasla">M\u00DCLAKATA BA\u015ELA</button></div>');

    /* proje merkezi + sergi */
    AK.veri.projeTamam = AK.veri.projeTamam || {};
    ic.innerHTML += '<div style="height:10px"></div>' + AK.kutu('<div class="akEtiket">// 67-69. MADDE \u2014 PROJE MERKEZ\u0130 & SERG\u0130</div>'
      + PROJELER.map(function (p) {
        var ok = !!AK.veri.projeTamam[p.id];
        return '<div class="akKutu" style="margin-bottom:8px"><div style="display:flex;gap:8px;align-items:center">'
          + '<b style="flex:1">' + kac(p.ad) + '</b><span class="akEtiket">' + kac(p.seviye) + '</span>'
          + (ok ? '<span class="akEtiket">\u2705 bitti</span>' : '')
          + '<button class="akDug" data-proje="' + p.id + '">' + (ok ? 'DETAY' : 'A\u00C7') + '</button></div>'
          + '<div class="akSoluk" style="font-size:12.4px;margin-top:4px">' + kac(p.adimlar) + '</div></div>';
      }).join('')
      + '<div class="akSoluk">Sergi: tamamlanan projeler CV\u2019ye ve portföye otomatik eklenir.</div>');

    /* mezuniyet */
    var sert = (AK.veri.sertifikalar || []).length;
    var sart = { sertifika: 3, xp: 3000, lab: 6, ctf: 5 };
    var mOk = sert >= sart.sertifika && o.xp >= sart.xp && o.lab >= sart.lab && o.ctf >= sart.ctf;
    ic.innerHTML += '<div style="height:10px"></div>' + AK.kutu('<div class="akEtiket">// 81. MADDE \u2014 MEZUN\u0130YET</div>'
      + '<div class="akGorevSatir">' + (sert >= sart.sertifika ? '\u2705' : '\u2B1C') + ' En az ' + sart.sertifika + ' sertifika (' + sert + ')</div>'
      + '<div class="akGorevSatir">' + (o.xp >= sart.xp ? '\u2705' : '\u2B1C') + ' En az ' + sart.xp + ' XP (' + o.xp + ')</div>'
      + '<div class="akGorevSatir">' + (o.lab >= sart.lab ? '\u2705' : '\u2B1C') + ' En az ' + sart.lab + ' laboratuvar (' + o.lab + ')</div>'
      + '<div class="akGorevSatir">' + (o.ctf >= sart.ctf ? '\u2705' : '\u2B1C') + ' En az ' + sart.ctf + ' CTF g\u00F6revi (' + o.ctf + ')</div>'
      + '<div class="akDugSira"><button class="akDug" id="mezunDug"' + (mOk ? '' : ' disabled') + '>'
      + (mOk ? '\uD83C\uDF93 MEZUN PROF\u0130L\u0130N\u0130 OLU\u015ETUR' : '\uD83D\uDD12 \u015EARTLAR TAMAMLANMADI') + '</button></div>'
      + (AK.veri.mezun ? '<div class="akBasari" style="margin-top:8px">\uD83C\uDF93 Mezun: ' + kac(AK.veri.mezun.ad || '') + ' \u2014 ' + AK.trTarih(AK.veri.mezun.t) + '</div>' : ''));

    /* olaylar */
    AK.$('#cvKopya').onclick = function () {
      try { navigator.clipboard.writeText(cv); AK.not('CV kopyaland\u0131.', 'iyi'); }
      catch (e) { AK.not('Kopyalama engellendi; metni elle se\u00E7.', 'uyari'); }
    };
    AK.$('#cvIndir').onclick = function () {
      var b = new Blob([cv], { type: 'text/plain;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.download = 'KENAN-KUZUCU-CV.txt';
      a.click();
      AK.not('CV indirildi.', 'iyi');
    };
    AK.$('#cvYazdir').onclick = function () { window.print(); };
    AK.$('#cvAnaliz').onclick = function () {
      var a = cvAnaliz(cv);
      var s = '<div class="akKutu"><div class="akEtiket">AI CV ANAL\u0130Z\u0130</div>';
      a.iyi.forEach(function (x) { s += '<div class="akGorevSatir">\u2705 ' + kac(x) + '</div>'; });
      a.uyarilar.forEach(function (x) { s += '<div class="akGorevSatir">\u26A0\uFE0F ' + kac(x) + '</div>'; });
      if (!a.uyarilar.length) s += '<div class="akGorevSatir">\uD83C\uDF89 CV sa\u011Fl\u0131kl\u0131 g\u00F6r\u00FCn\u00FCyor.</div>';
      s += '</div>';
      AK.$('#cvSonuc').innerHTML = s;
    };
    AK.$('#payKopya').onclick = function () {
      try { navigator.clipboard.writeText(AK.$('#paylasMetin').textContent); AK.not('Payla\u015F\u0131m metni kopyaland\u0131.', 'iyi'); }
      catch (e) { AK.not('Kopyalama engellendi.', 'uyari'); }
    };
    AK.$('#payLinkedin').onclick = function () {
      window.open('https://www.linkedin.com/feed/?shareActive=true', '_blank');
      AK.not('LinkedIn a\u00E7\u0131ld\u0131 \u2014 metni yap\u0131\u015Ft\u0131r.', 'bilgi');
    };
    AK.$('#mulakatBasla').onclick = function () { mulakat(0, 0); };
    AK.$$('[data-proje]').forEach(function (b) {
      b.onclick = function () {
        var id = b.getAttribute('data-proje');
        var p = PROJELER.filter(function (x) { return x.id === id; })[0];
        ic.innerHTML = AK.baslik(p.ad, p.seviye, 'Proje teslim ad\u0131mlar\u0131');
        ic.innerHTML += AK.kutu('<div style="font-size:13.6px;line-height:1.8">' + kac(p.adimlar) + '</div>'
          + '<div class="akEtiket" style="margin-top:10px">TESL\u0130M \u0130\u00C7\u0130N</div>'
          + '<ul class="brifMaddeler"><li>Yapt\u0131\u011F\u0131n\u0131 1 sayfada anlat (ama\u00E7, y\u00F6ntem, sonu\u00E7)</li>'
          + '<li>Kod/ekran kan\u0131t\u0131 ekle</li><li>\u00D6\u011Frendi\u011Fin 3 \u015Feyi yaz</li></ul>'
          + '<div class="akDugSira"><button class="akDug" id="pBitir">\u2705 PROJEY\u0130 TAMAMLADIM</button>'
          + '<button class="akDug" id="pGeri">\u2190 GER\u0130</button></div>');
        AK.$('#pGeri').onclick = function () { AK.git('kariyer'); };
        AK.$('#pBitir').onclick = function () {
          AK.veri.projeTamam[p.id] = { t: Date.now() };
          AK.veri.milestone = AK.veri.milestone || [];
          AK.veri.milestone.push({ ad: 'Proje tamamland\u0131: ' + p.ad, t: Date.now() });
          AK.xpEkle(120, 'Proje: ' + p.ad);
          AK.kaydet(); AK.not('\u2705 Proje portföye eklendi (+120 XP).', 'iyi'); AK.git('kariyer');
        };
      };
    });
    AK.$('#mezunDug').onclick = function () {
      AK.veri.mezun = { ad: (AK.veri.profil && AK.veri.profil.ad) || 'Kenan Kuzucu', t: Date.now() };
      AK.kaydet();
      AK.not('\uD83C\uDF93 Mezuniyet kaydedildi! Transkript ve portf\u00F6y g\u00FCncellendi.', 'iyi');
      AK.git('kariyer');
    };

    function mulakat(i, puan) {
      if (i >= MULAKAT.length) {
        ic.innerHTML = AK.baslik('AI M\u00DCLAKAT S\u0130M\u00DCLAT\u00D6R\u00DC', 'bitti', '\u00C7oktan se\u00E7meli teknik m\u00FClakat');
        ic.innerHTML += AK.kutu('<div style="font-size:16px">Skor: <b>%' + Math.round(puan / MULAKAT.length * 100) + '</b> (' + puan + '/' + MULAKAT.length + ')</div>'
          + AK.cubuk(puan / MULAKAT.length * 100, AK.RENK.kariyer)
          + '<div class="akDugSira"><button class="akDug" id="mGeri">\u2190 KAR\u0130YER</button></div>');
        AK.xpEkle(puan * 15, 'M\u00FClakat sim\u00FClasyonu');
        AK.veri.mulakatSkor = Math.max(AK.veri.mulakatSkor || 0, Math.round(puan / MULAKAT.length * 100));
        AK.kaydet();
        AK.$('#mGeri').onclick = function () { AK.git('kariyer'); };
        return;
      }
      var q = MULAKAT[i];
      ic.innerHTML = AK.baslik('AI M\u00DCLAKAT S\u0130M\u00DCLAT\u00D6R\u00DC', (i + 1) + '/' + MULAKAT.length, 'M\u00FClakat sorusu');
      ic.innerHTML += AK.kutu('<div style="font-size:14px;font-weight:700">' + kac(q.s) + '</div>'
        + '<div class="akDugSira" style="flex-direction:column;align-items:stretch">'
        + q.c.map(function (x, k) {
          return '<button class="akDug" style="text-align:left" data-m="' + k + '">' + kac(String.fromCharCode(65 + k)) + ') ' + kac(x) + '</button>';
        }).join('') + '</div>');
      AK.$$('[data-m]').forEach(function (b) {
        b.onclick = function () {
          var ok = parseInt(b.getAttribute('data-m'), 10) === q.d;
          AK.not(ok ? '\u2705 Do\u011Fru cevap.' : '\u274C Yanl\u0131\u015F \u2014 m\u00FClakatta bu \u015Fekilde elenirsin.', ok ? 'iyi' : 'kotu');
          mulakat(i + 1, puan + (ok ? 1 : 0));
        };
      });
    }
  });
})();
