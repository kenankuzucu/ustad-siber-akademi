/* ==========================================================================
   ÜSTAD AKADEMİ SİTESİ — GÖREV MERKEZİ (akademi-gorev.js)
   Master liste: 9 (hedef+seviye) · 13 (Welcome Mission) · 48 (milestone/avatar/
   başarı merkezi) · 49 (liderlik/rekor) · 67-68 (proje görevleri) · 75 (sezon)
   76 (gizli görevler) · 86 (arama/filtreleme/bildirim) · 113 (kilometre taşları)
   ========================================================================== */
(function () {
  'use strict';
  if (!window.AK) return;
  var AK = window.AK;
  var kac = AK.kac;

  AK.MODUL.push({ id: 'gorev', simge: '\uD83D\uDEE1\uFE0F', ad: 'G\u00D6REV MERKEZ\u0130', alt: 'bug\u00FCn ne yapmal\u0131y\u0131m?' });
  AK.RENK = AK.RENK || {};
  AK.RENK.gorev = '#2ee6a8';

  /* ----------------------------- HEDEFLER (9) ----------------------------- */
  AK.HEDEF = [
    { id: 'soc', ad: 'SOC ANALYST', aciklama: 'Alarm kuyru\u011Fu, log, olay m\u00FCdahalesi', alanlar: ['blueteam', 'network', 'linux'] },
    { id: 'blue', ad: 'BLUE TEAM', aciklama: 'Savunma, sertle\u015Ftirme, denetim', alanlar: ['blueteam', 'network', 'kripto'] },
    { id: 'network', ad: 'NETWORK SECURITY', aciklama: 'A\u011F tasar\u0131m\u0131, portlar, izleme', alanlar: ['network', 'linux'] },
    { id: 'adli', ad: 'ADL\u0130 B\u0130L\u0130\u015E\u0130M', aciklama: 'Kan\u0131t, imaj, rapor', alanlar: ['adli', 'linux', 'kripto'] },
    { id: 'bulut', ad: 'BULUT G\u00DCVENL\u0130\u011E\u0130', aciklama: 'Konteyner, IAM, yap\u0131land\u0131rma', alanlar: ['bulut', 'linux'] },
    { id: 'ai', ad: 'AI G\u00DCVENL\u0130\u011E\u0130', aciklama: 'Model, veri, prompt g\u00FCvenli\u011Fi', alanlar: ['ai', 'python'] },
    { id: 'sizma', ad: 'SIZMA TEST\u0130', aciklama: 'Yasal, izole lab \u00E7al\u0131\u015Fmas\u0131', alanlar: ['network', 'web', 'kripto'] },
    { id: 'osint', ad: 'OSINT / \u0130ST\u0130HBARAT', aciklama: 'A\u00E7\u0131k kaynak, iz analizi', alanlar: ['osint', 'anonimlik'] }
  ];
  AK.hedef = function () { return AK.veri.hedef ? (AK.HEDEF.filter(function (h) { return h.id === AK.veri.hedef; })[0] || null) : null; };

  /* ----------------------------- GÖREVLER --------------------------------- */
  var GOREV_TUR = {
    soru: '\u2747\uFE0F', lab: '\uD83E\uDDEA', vaka: '\uD83D\uDD0E', ctf: '\uD83D\uDEA9',
    ders: '\uD83D\uDCD8', oyun: '\uD83C\uDFAE', tekrar: '\uD83D\uDD01'
  };

  /* bugünün görev seti — deterministik (aynı gün aynı görev), gerçek veriden */
  AK.gununGorevleri = function () {
    var g = AK.gun();
    var tohum = 0, i;
    for (i = 0; i < g.length; i++) tohum = (tohum * 31 + g.charCodeAt(i)) >>> 0;
    var h = AK.hedef();
    var zorluk = AK.veri.onSinav ? (AK.veri.onSinav.seviye || 'orta') : 'kolay';
    var cok = zorluk === 'ileri' || zorluk === 'uzman' ? 20 : (zorluk === 'orta' ? 15 : 10);
    var alanAd = h ? h.ad : 'genel';
    return [
      { id: 'g_soru_' + g, tur: 'soru', ad: cok + ' soru \u00E7\u00F6z (' + alanAd + ')', xp: 40, hedef: { hedefSayi: cok, sayac: AK.veri.gunluk[g] ? (AK.veri.gunluk[g].soru || 0) : 0 } },
      { id: 'g_tekrar_' + g, tur: 'tekrar', ad: 'Vadesi gelen tekrarlar\u0131n\u0131 bitir (' + AK.vadeliTekrarlar().length + ' soru)', xp: 30, hedef: { hedefSayi: Math.max(1, Math.min(20, AK.vadeliTekrarlar().length)), sayac: 0 } },
      { id: 'g_lab_' + g, tur: 'lab', ad: '1 laboratuvar senaryosu tamamla', xp: 50, hedef: { hedefSayi: 1, sayac: (AK.veri.labTamam || []).length && AK.gun(AK.veri.labTamam[AK.veri.labTamam.length - 1].t) === g ? 1 : 0 } },
      { id: 'g_vaka_' + g, tur: 'vaka', ad: '1 vaka dosyas\u0131 / olay hik\u00E2yesi incele', xp: 35, hedef: { hedefSayi: 1, sayac: 0 } },
      { id: 'g_seri_' + g, tur: 'ders', ad: 'Bug\u00FCn\u00FC i\u015Faretle (seri: ' + AK.seri() + ' g\u00FCn)', xp: 20, hedef: { hedefSayi: 1, sayac: 1 } }
    ];
  };

  /* gizli görevler (76) — koşul dolunca görünür */
  AK.GIZLI = [
    { id: 'gizli_gece', ad: 'GECE VARD\u0130YASI', kosul: 'Gece 00:00-05:00 aras\u0131 10 soru \u00E7\u00F6z', kontrol: function () { var h = new Date().getHours(); return h >= 0 && h < 5 && AK.toplamSoru() >= 10; }, xp: 60 },
    { id: 'gizli_kusursuz', ad: 'KUSURSUZ SER\u0130', kosul: '3 s\u0131nav\u0131 \u00FCst \u00FCste %90+ ile bitir', kontrol: function () { var o = AK.veri.oturumlar.slice(-3); return o.length >= 3 && o.every(function (x) { return x.skor >= 90; }); }, xp: 80 },
    { id: 'gizli_defter', ad: 'DEFTER\u0130 KAPAT', kosul: 'Yanl\u0131\u015Flar defterini s\u0131f\u0131rla (hepsini do\u011Fru yap)', kontrol: function () { return AK.toplamSoru() >= 30 && AK.yanlisListesi && AK.yanlisListesi().length === 0; }, xp: 70 },
    { id: 'gizli_gezgin', ad: 'GEZG\u0130N', kosul: 'B\u00FCt\u00FCn mod\u00FClleri en az bir kez a\u00E7', kontrol: function () { return Object.keys(AK.veri.gezilen || {}).length >= (AK.MODUL.length - 2); }, xp: 50 },
    { id: 'gizli_arastirmaci', ad: 'ARA\u015ETIRMACI', kosul: '40 soruya "Bana Neden?" ile bak', kontrol: function () { return (AK.veri.nedenSayisi || 0) >= 40; }, xp: 60 }
  ];

  /* sezon (75) */
  AK.SEZON = function () {
    var d = new Date();
    var no = Math.floor((d.getMonth()) / 3) + 1;
    var adlar = ['KI\u015E', '\u0130LKBAHAR', 'YAZ', 'SONBAHAR'];
    return { no: no, ad: adlar[(no - 1) % 4] + ' SEZONU ' + d.getFullYear(), bitis: '3 ayl\u0131k d\u00F6nem' };
  };

  /* ------------------------------ ÇİZİM ----------------------------------- */
  function hedefKart() {
    var h = AK.hedef();
    if (!h) {
      return AK.kutu('<div class="akEtiket">// 9. MADDE — HEDEF SE\u00C7\u0130M\u0130</div>'
        + '<div style="margin:6px 0 10px">Hen\u00FCz hedef se\u00E7medin. Hedefini se\u00E7; g\u00F6revler ve \u00F6neriler ona g\u00F6re \u00FCretilir.</div>'
        + '<div class="akDugSira">' + AK.HEDEF.map(function (x) {
          return '<button class="akDug" data-hedef="' + x.id + '" style="--ak-renk:' + (AK.RENK[x.alanlar[0]] || '#2ee6a8') + '">'
            + kac(x.ad) + '</button>';
        }).join('') + '</div>');
    }
    return AK.kutu('<div class="akEtiket">// HEDEF\u0130N</div><div style="font-size:18px;font-weight:700;margin:6px 0">'
      + kac(h.ad) + '</div><div class="akSoluk">' + kac(h.aciklama) + '</div>'
      + '<div class="akSoluk" style="margin-top:6px">\u0130lgili alanlar: ' + h.alanlar.map(function (a) {
        var al = (AK.ALAN || []).filter(function (x) { return x.id === a; })[0];
        return al ? kac(al.ad) : a;
      }).join(' \u00B7 ') + '</div>'
      + '<div class="akDugSira" style="margin-top:10px"><button class="akDug" id="hedefDegis">HEDEF\u0130 DE\u011E\u0130\u015ET\u0130R</button></div>');
  }

  function welcomeKart() {
    var adim1 = !!AK.veri.profil, adim2 = !!AK.veri.hedef, adim3 = !!AK.veri.onSinav;
    var hepsi = adim1 && adim2 && adim3;
    var s = '<div class="akEtiket">// 13. MADDE \u2014 WELCOME MISSION</div>';
    s += '<div class="akGorevSatir">' + (adim1 ? '\u2705' : '\u2B1C') + ' 1. Siber Kimlik kart\u0131n\u0131 olu\u015Ftur</div>';
    s += '<div class="akGorevSatir">' + (adim2 ? '\u2705' : '\u2B1C') + ' 2. Hedefini se\u00E7</div>';
    s += '<div class="akGorevSatir">' + (adim3 ? '\u2705' : '\u2B1C') + ' 3. \u00D6n s\u0131nava gir, seviyeni \u00F6\u011Fren</div>';
    if (hepsi && !AK.veri.rozetler.welcome) {
      return AK.kutu(s + '<div class="akDugSira" style="margin-top:10px"><button class="akDug" id="welcomeAl">\uD83C\uDF81 \u00D6D\u00DCL\u00DC AL (+100 XP + ROZET)</button></div>');
    }
    if (hepsi) {
      return AK.kutu(s + '<div class="akBasari" style="margin-top:8px">\uD83C\uDF89 Welcome Mission tamam \u2014 rozet kazan\u0131ld\u0131.</div>');
    }
    return AK.kutu(s + '<div class="akSoluk" style="margin-top:8px">S\u0131radaki ad\u0131m\u0131 bitir; \u00F6d\u00FC\u00FCl 100 XP + WELCOME rozeti.</div>');
  }

  function gununGorevleri() {
    var g = AK.gun();
    var s = '<div class="akEtiket">// 30. MADDE \u2014 BUG\u00DCN\u00DCN G\u00D6REV\u0130 (' + g + ')</div>';
    AK.gununGorevleri().forEach(function (x) {
      var tamam = (x.hedef.sayac >= x.hedef.hedefSayi) || (AK.veri.gunlukGorev && AK.veri.gunlukGorev[x.id]);
      s += '<div class="akGorevSatir">' + (tamam ? '\u2705' : (GOREV_TUR[x.tur] || '\u25AB')) + ' ' + kac(x.ad)
        + ' <span class="akSoluk">+' + x.xp + ' XP</span></div>';
    });
    return AK.kutu(s);
  }

  function gizliKart() {
    var s = '<div class="akEtiket">// 76. MADDE \u2014 G\u0130ZL\u0130 G\u00D6REVLER</div>';
    var acik = 0;
    AK.GIZLI.forEach(function (x) {
      var ok = false;
      try { ok = !!x.kontrol(); } catch (e) { ok = false; }
      if (ok) acik++;
      s += '<div class="akGorevSatir">' + (ok ? '\uD83D\uDD13 ' : '\uD83D\uDD12 ') + kac(x.ad)
        + ' <span class="akSoluk">\u2014 ' + kac(x.kosul) + '</span></div>';
    });
    s += '<div class="akSoluk" style="margin-top:6px">A\u00E7\u0131lan: ' + acik + ' / ' + AK.GIZLI.length + '</div>';
    return AK.kutu(s);
  }

  function basariMerkezi() {
    var v = AK.veri;
    v.milestone = v.milestone || [];
    var av = v.avatar || '\uD83E\uDD8A';
    var avatarlar = ['\uD83E\uDD8A', '\uD83D\uDC3A', '\uD83E\uDD85', '\uD83D\uDC22', '\uD83E\uDD81', '\uD83D\uDC09', '\uD83E\uDDA9', '\uD83D\uDC3C'];
    var s = '<div class="akEtiket">// 48. MADDE \u2014 BA\u015EARI MERKEZ\u0130</div>';
    s += '<div style="font-size:30px;margin:6px 0">' + av + ' <span style="font-size:15px">avatar\u0131n</span></div>';
    s += '<div class="akDugSira">' + avatarlar.map(function (a) {
      return '<button class="akDug" data-avatar="' + a + '" style="font-size:18px">' + a + '</button>';
    }).join('') + '</div>';
    var r = AK.rutbe();
    s += '<div style="margin-top:10px">R\u00FCtbe: <b>' + kac(r.ad || r) + '</b> \u00B7 Seviye ' + AK.seviye() + ' \u00B7 ' + v.xp + ' XP</div>';
    s += '<div style="margin-top:8px">Rozetler: ' + Object.keys(v.rozetler).length + ' / ' + (AK.ROZET ? AK.ROZET.length : 14) + '</div>';
    if (v.milestone.length) {
      s += '<div style="margin-top:10px"><div class="akEtiket">K\u0130LOMETRE TA\u015ELARI</div>'
        + v.milestone.slice(-8).reverse().map(function (m) {
          return '<div class="akGorevSatir">\uD83D\uDD38 ' + kac(m.ad) + ' <span class="akSoluk">' + AK.trTarih(m.t) + '</span></div>';
        }).join('') + '</div>';
    } else {
      s += '<div class="akSoluk" style="margin-top:8px">Hen\u00FCz kilometre ta\u015F\u0131 yok; ilerledik\u00E7e burada birikecek.</div>';
    }
    return AK.kutu(s);
  }

  function liderlikKart() {
    var v = AK.veri;
    var o = v.oturumlar || [];
    var en = o.slice().sort(function (a, b) { return b.skor - a.skor; }).slice(0, 5);
    var s = '<div class="akEtiket">// 49. MADDE \u2014 REKOR TABLOSU (bu cihaz)</div>';
    if (!en.length) s += '<div class="akSoluk">Hen\u00FCz s\u0131nav yok.</div>';
    en.forEach(function (x, i) {
      s += '<div class="akGorevSatir"><b>' + (i + 1) + '.</b> ' + kac(x.tur || 's\u0131nav')
        + ' \u00B7 %' + x.skor + ' \u00B7 ' + x.dogru + '/' + x.soru + ' <span class="akSoluk">' + AK.trTarih(x.t) + '</span></div>';
    });
    s += '<div class="akSoluk" style="margin-top:8px">Not: \u00E7ok kullan\u0131c\u0131l\u0131 canl\u0131 s\u0131ralama sunucu ister (bkz. KALI-VE-SUNUCU-ISLERI.txt).</div>';
    return AK.kutu(s);
  }

  function sezonKart() {
    var s = AK.SEZON();
    return AK.kutu('<div class="akEtiket">// 75. MADDE \u2014 SEZON</div>'
      + '<div style="font-size:16px;font-weight:700;margin:6px 0">' + kac(s.ad) + '</div>'
      + '<div class="akSoluk">' + kac(s.bitis) + ' \u00B7 sezon g\u00F6revleri ve rozetleri sezon boyunca say\u0131l\u0131r.</div>'
      + '<div style="margin-top:8px">Bu sezondaki XP: <b>' + (AK.veri.sezonXP || 0) + '</b></div>');
  }

  AK.modulEkle('gorev', function () {
    var ic = AK.icerik;
    ic.innerHTML = AK.baslik('G\u00D6REV MERKEZ\u0130', 'bug\u00FCn ne yapmal\u0131y\u0131m?',
      'Hedefin, g\u00FCnl\u00FCk g\u00F6revlerin, gizli g\u00F6revler ve ba\u015Far\u0131 merkezin tek ekranda.');
    ic.innerHTML += hedefKart();
    ic.innerHTML += '<div style="height:10px"></div>' + welcomeKart();
    ic.innerHTML += '<div style="height:10px"></div>' + gununGorevleri();
    ic.innerHTML += '<div style="height:10px"></div>' + sezonKart();
    ic.innerHTML += '<div style="height:10px"></div>' + gizliKart();
    ic.innerHTML += '<div style="height:10px"></div>' + basariMerkezi();
    ic.innerHTML += '<div style="height:10px"></div>' + liderlikKart();

    /* olaylar */
    AK.$$('[data-hedef]').forEach(function (b) {
      b.onclick = function () {
        AK.veri.hedef = b.getAttribute('data-hedef');
        AK.veri.milestone = AK.veri.milestone || [];
        AK.veri.milestone.push({ ad: 'Hedef belirlendi: ' + b.textContent, t: Date.now() });
        AK.xpEkle(25, 'Hedef belirleme');
        AK.kaydet(); AK.rozetKontrol(); AK.git('gorev'); AK.not('Hedefin kaydedildi.', 'iyi');
      };
    });
    var hd = AK.$('#hedefDegis');
    if (hd) hd.onclick = function () { AK.veri.hedef = null; AK.kaydet(); AK.git('gorev'); };
    var wa = AK.$('#welcomeAl');
    if (wa) wa.onclick = function () {
      if (!AK.veri.rozetler.welcome) { AK.veri.xp += 100; AK.rozetKazan('welcome'); }
      AK.kaydet(); AK.git('gorev'); AK.not('\uD83C\uDF81 Welcome Mission \u00F6d\u00FCl\u00FC: +100 XP ve WELCOME rozeti!', 'iyi');
    };
    AK.$$('[data-avatar]').forEach(function (b) {
      b.onclick = function () { AK.veri.avatar = b.getAttribute('data-avatar'); AK.kaydet(); AK.git('gorev'); };
    });
  });

  /* modül gezme sayacı (gizli görev için) */
  var eskiGit = AK.git;
  AK.git = function (id) {
    AK.veri.gezilen = AK.veri.gezilen || {};
    if (!AK.veri.gezilen[id]) { AK.veri.gezilen[id] = 1; AK.kaydet(); }
    return eskiGit.apply(this, arguments);
  };

  /* görev kontrolü — bir modül tamamlandığında çağrılır */
  AK.gorevKontrol = function () {
    var g = AK.gun();
    var gorevler = AK.gununGorevleri();
    AK.veri.gunlukGorev = AK.veri.gunlukGorev || {};
    gorevler.forEach(function (x) {
      var tamam = x.hedef.sayac >= x.hedef.hedefSayi;
      if (tamam && !AK.veri.gunlukGorev[x.id]) {
        AK.veri.gunlukGorev[x.id] = 1;
        AK.veri.sezonXP = (AK.veri.sezonXP || 0) + x.xp;
        AK.xpEkle(x.xp, 'G\u00FCnl\u00FCk g\u00F6rev: ' + x.ad);
      }
    });
    AK.GIZLI.forEach(function (x) {
      try {
        if (x.kontrol() && !AK.veri.rozetler['gizli_' + x.id]) {
          AK.rozetKazan('gizli_' + x.id);
          AK.xpEkle(x.xp, 'Gizli g\u00F6rev: ' + x.ad);
          AK.veri.milestone = AK.veri.milestone || [];
          AK.veri.milestone.push({ ad: 'Gizli g\u00F6rev a\u00E7\u0131ld\u0131: ' + x.ad, t: Date.now() });
        }
      } catch (e) {}
    });
    if (g) AK.veri.sonGorevGun = g;
  };
})();
