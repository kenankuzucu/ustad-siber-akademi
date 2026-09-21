/* ==========================================================================
   ÜSTAD SİBER AKADEMİ — AKADEMİ BEYNİ · BECERİ AĞACI · KARNE (akademi-beyin.js)
   Çevrimdışı KURAL MOTORU: öğrenci verisini okur, eksikleri bulur, günlük/haftalık
   plan üretir, tekrar zamanını belirler, seviyeyi günceller, motivasyon verir.
   (Gerçek LLM mentor = sunucu/anahtar işi; bu modül onun çevrimdışı çekirdeğidir.)
   ========================================================================== */
(function () {
  'use strict';
  var AK = window.AK;
  if (!AK) return;
  var kac = AK.kac, $ = AK.$, $$ = AK.$$, ic = function () { return document.getElementById('akIcerik'); };

  /* ------------------------------ beyin çekirdeği ------------------------- */
  var MOTIVE = [
    'Bug\u00FCn att\u0131\u011F\u0131n ad\u0131m k\u00FC\u00E7\u00FCk olabilir; ama d\u00FCn atmad\u0131n.',
    'Yanl\u0131\u015F yapmak, \u00F6\u011Frenmenin faturas\u0131d\u0131r. \u00D6demeye devam et.',
    'Bir komutu ezberlemek de\u011Fil, ne i\u015Fe yarad\u0131\u011F\u0131n\u0131 bilmek ustal\u0131kt\u0131r.',
    'Kimse g\u00FCvenli\u011Fi bir gecede \u00F6\u011Frenmez; ama her gece biraz \u00F6\u011Frenen bir g\u00FCn ustala\u015F\u0131r.',
    'Terminalde korkmadan yazd\u0131\u011F\u0131n g\u00FCn, \u00F6\u011Frenci bitti\u011Fi g\u00FCnd\u00FCr.',
    'Zay\u0131f oldu\u011Fun alan, en h\u0131zl\u0131 puan kazanaca\u011F\u0131n aland\u0131r.',
    'Bug\u00FCn 10 soru, y\u0131lda 3.650 soru. Fark b\u00F6yle a\u00E7\u0131l\u0131r.',
    'Sistemleri anlamak, k\u0131rmaktan daha zor ve daha de\u011Ferli.',
    '\u00D6\u011Frendi\u011Fini yazmay\u0131 b\u0131rakma; not alan, iki kez \u00F6\u011Frenir.',
    'Sab\u0131r, siber g\u00FCvenli\u011Fin en g\u00FC\u00E7l\u00FC arac\u0131d\u0131r.',
    'D\u00FCn oldu\u011Fun ki\u015Fiden biraz daha ileridesin. Devam et.',
    'Hedefin sertifika de\u011Fil, anlayan bir zihin olsun.'
  ];

  function motivasyon() {
    var v = AK.veri;
    var kalan = MOTIVE.filter(function (m) { return v.mesajGecmis.indexOf(m) < 0; });
    if (!kalan.length) { v.mesajGecmis = []; kalan = MOTIVE.slice(); }
    var sec = kalan[Math.floor(Math.random() * kalan.length)];
    v.mesajGecmis.push(sec);
    if (v.mesajGecmis.length > 8) v.mesajGecmis.shift();
    AK.kaydet();
    return sec;
  }

  function okumaDurumu() {
    /* mevcut sitenin OGR.oku verisi + akademi okuma kaydı */
    var d = { okunan: 0, toplam: 0, bolumler: [] };
    if (!window.V || !V.bolumler) return d;
    var oku = (window.OGR && OGR.oku) ? OGR.oku : null;
    V.bolumler.forEach(function (b) {
      var n = (b.kayitlar || []).length, o = 0;
      (b.kayitlar || []).forEach(function (r, i) {
        if ((oku && oku[b.id + '#' + i]) || AK.veri.okuma[b.id + '#' + i]) o++;
      });
      d.okunan += o; d.toplam += n;
      d.bolumler.push({ id: b.id, ad: b.ad, okunan: o, toplam: n, oran: n ? Math.round(o / n * 100) : 0 });
    });
    d.yuzde = d.toplam ? Math.round(d.okunan / d.toplam * 100) : 0;
    return d;
  }

  function sonOkunan() {
    var son = window.OGR && OGR.son ? OGR.son : null;
    if (!son || !window.V) return null;
    var b = V.bolumler.filter(function (x) { return x.id === son.id; })[0];
    if (!b) return null;
    var i = 0, kayitlar = b.kayitlar || [];
    while (i < kayitlar.length && (OGR.oku[b.id + '#' + i])) i++;
    return { bolum: b, index: i, kayit: kayitlar[i] || null, kalan: kayitlar.length - i };
  }

  /* zayıf/güçlü alan analizi */
  function analiz() {
    var m = AK.skillMatris();
    var olculen = m.filter(function (a) { return a.soru >= 3; });
    var zayif = olculen.slice().sort(function (a, b) { return a.oran - b.oran; });
    var guclu = olculen.slice().sort(function (a, b) { return b.oran - a.oran; });
    var iceriksiz = m.filter(function (a) { return !a.icerikVar; });
    var mevcut = AK.veri.oturumlar.filter(function (o) { return o.soru >= 5; });
    var sonSkor = mevcut.length ? Math.round(mevcut.slice(-5).reduce(function (s, o) { return s + o.skor; }, 0) / Math.min(5, mevcut.length)) : null;
    return {
      matris: m, zayif: zayif, guclu: guclu, iceriksiz: iceriksiz,
      baslangic: AK.veri.onSinav ? AK.veri.onSinav.skor : null,
      simdi: sonSkor,
      fark: (sonSkor != null && AK.veri.onSinav) ? sonSkor - AK.veri.onSinav.skor : null,
      vadeli: AK.vadeliTekrarlar().length,
      yanlis: AK.yanlisListesi().length
    };
  }

  function planaHazir(adet, alanId, zorlukNot) {
    /* beyin önerisi -> sınav modülüne aktarılıp başlatılır */
    AK.git('sinav');
    setTimeout(function () {
      var s = document.getElementById('akAlan'), n = document.getElementById('akAdet');
      if (s && alanId) {
        var bulundu = false;
        $$('option', s).forEach(function (o) { if (o.value === alanId) bulundu = true; });
        if (bulundu) s.value = alanId;
      }
      if (n) {
        var hedef = String(adet);
        var var_ = false;
        $$('option', n).forEach(function (o) { if (o.value === hedef) var_ = true; });
        n.value = var_ ? hedef : '20';
      }
      var b = document.getElementById('akBasla');
      if (b) { b.focus(); AK.not('Beyin plan\u0131 haz\u0131r: ayarlar dolduruldu, ' + (zorlukNot || 'BA\u015ELA') + ' dü\u011Fmesine bas.', 'iyi'); }
    }, 120);
  }

  /* -------------------------------- BEYİN --------------------------------- */
  AK.modulEkle('beyin', function () {
    var v = AK.veri;
    if (!v.profil) {
      ic().innerHTML = AK.baslik('AKADEM\u0130 BEYN\u0130') +
        '<div class="akNot akUyari">Beyin \u00E7al\u0131\u015Fmas\u0131 i\u00E7in \u00F6nce <b>S\u0130BER K\u0130ML\u0130K</b> olu\u015Fturmal\u0131s\u0131n.</div>'
        + '<div class="akDugSira"><button class="akDug akBirincil" onclick="AK.git(\'kimlik\')">\uD83E\uDEAA K\u0130ML\u0130K OLU\u015ETUR</button></div>';
      return;
    }
    var a = analiz(), okuma = okumaDurumu(), son = sonOkunan(), s = AK.seviye(), r = AK.rutbe();
    var h = AK.baslik('AKADEM\u0130 BEYN\u0130', kac(r.ad) + ' \u00B7 LV ' + s.seviye,
      'Beyin; kimlik, \u00F6n s\u0131nav, s\u0131nav ge\u00E7mi\u015Fi, yanl\u0131\u015F defteri ve okuma verini birle\u015Ftirip '
      + '<b>bug\u00FCn ne yapman gerekti\u011Fini</b> s\u00F6yler. \u00C7evrimd\u0131\u015F\u0131 kural motoru \u2014 internetsiz \u00E7al\u0131\u015F\u0131r.');

    /* 1) günün görevi */
    var gorevler = [];
    if (a.vadeli > 0) gorevler.push({ t: 'Tekrar: vadesi gelen ' + a.vadeli + ' soruyu \u00E7\u00F6z (\u00F6nce bu!)', git: 'tekrar', dug: 'TEKRARA G\u0130T' });
    if (a.zayif.length) gorevler.push({ t: 'Zay\u0131f alan: <b>' + kac(a.zayif[0].ad) + '</b> (%' + a.zayif[0].oran + ') \u2014 20 soru', plan: { adet: 20, alan: a.zayif[0].id }, dug: 'SINAVA BA\u015ELA' });
    if (!v.onSinav) gorevler.push({ t: '\u00D6n s\u0131nav\u0131 yap: seviyen belirlensin (24 soru, s\u00FCresiz)', git: 'onsinav', dug: '\u00D6N SINAV' });
    if (a.yanlis > 0) gorevler.push({ t: 'Yanl\u0131\u015F defteri: ' + a.yanlis + ' soruyu d\u00FCzelt', git: 'defter', dug: 'DEFTER\u0130 \u00C7\u00D6Z' });
    if (son) gorevler.push({ t: 'Okuma: <b>' + kac(son.bolum.ad) + '</b> b\u00F6l\u00FCm\u00FCnde ' + son.kalan + ' kart kald\u0131', oku: son.bolum.id, dug: 'B\u00D6L\u00DCM\u00DC A\u00C7' });
    gorevler.push({ t: 'Kontrol: <b>KARNE</b> mod\u00FCl\u00FCnden geli\u015Fimini g\u00F6r', git: 'karne', dug: 'KARNEM' });

    h += '<div class="akKutular">';
    h += AK.kutu('<h3>BUG\u00DCN\u00DCN G\u00D6REV\u0130</h3><div class="akListe" style="margin-top:6px">'
      + gorevler.slice(0, 4).map(function (g, i) {
        return '<div class="akSatir"><span class="akNo">' + (i + 1) + '.</span>'
          + '<span style="flex:1 1 200px">' + g.t + '</span>'
          + '<button class="akDug" data-g="' + i + '" style="padding:4px 8px;font-size:11px">' + g.dug + '</button></div>';
      }).join('') + '</div>');
    h += AK.kutu('<h3>DURUM</h3><div class="akKucuk">'
      + 'Seviye: <b>' + s.seviye + '</b> \u00B7 ' + AK.veri.xp + ' XP \u00B7 sonraki r\u00FCtbe: <b>'
      + (r.sonraki ? kac(r.sonraki.ad) + ' (' + r.sonraki.xp + ' XP)' : 'en \u00FCst') + '</b></div>'
      + AK.cubuk(r.sonraki ? Math.round((v.xp - AK.RUTBE.filter(function (x) { return x.xp <= v.xp; }).slice(-1)[0].xp) /
        (r.sonraki.xp - AK.RUTBE.filter(function (x) { return x.xp <= v.xp; }).slice(-1)[0].xp) * 100) : 100)
      + '<div class="akKucuk">\u00E7al\u0131\u015Fma serisi: <b>' + AK.seri() + ' g\u00FCn</b> \u00B7 '
      + 'son 7 g\u00FCn: <b>' + (function () {
        var t = 0, d = new Date();
        for (var i = 0; i < 7; i++) { var x = v.gunluk[AK.gun(d.getTime())]; if (x) t += (x.soru || 0); d = new Date(d.getTime() - 864e5); }
        return t;
      })() + ' soru</b></div>');
    h += '</div>';

    /* 2) motivasyon + gelişim */
    h += '<div class="akNot akIyi" style="margin-top:14px"><b>Akademi Beyni:</b> ' + kac(motivasyon()) + '</div>';

    /* 3) başlangıç vs şimdi */
    h += '<h3 style="margin:16px 0 8px">BA\u015ELANGI\u00C7 \u2194 \u015E\u0130MD\u0130</h3><div class="akKutular">';
    h += AK.kutu('<h3>\u00D6N SINAV</h3><div class="akBuyuk">' + (a.baslangic != null ? '%' + a.baslangic : '\u2014')
      + '</div>' + AK.cubuk(a.baslangic || 0) + '<div class="akKucuk">ba\u015Flang\u0131\u00E7 seviyesi: '
      + (v.onSinav ? kac(v.onSinav.seviye) : 'hen\u00FCz yok') + '</div>');
    h += AK.kutu('<h3>SON SINAVLAR</h3><div class="akBuyuk" style="color:' +
      (a.fark == null ? 'inherit' : (a.fark >= 0 ? '#00e05a' : '#ff5470')) + '">'
      + (a.simdi != null ? '%' + a.simdi : '\u2014') + '</div>' + AK.cubuk(a.simdi || 0)
      + '<div class="akKucuk">' + (a.fark == null ? 'kar\u015F\u0131la\u015Ft\u0131rma i\u00E7in s\u0131nav \u00E7\u00F6z'
        : 'fark: <b>' + (a.fark >= 0 ? '+' : '') + a.fark + ' puan</b>') + '</div>');
    h += AK.kutu('<h3>OKUMA</h3><div class="akBuyuk">%' + okuma.yuzde + '</div>' + AK.cubuk(okuma.yuzde)
      + '<div class="akKucuk">' + okuma.okunan + ' / ' + okuma.toplam + ' kart okundu</div>');
    h += AK.kutu('<h3>SORU</h3><div class="akBuyuk">' + AK.toplamSoru() + '</div>'
      + '<div class="akKucuk">do\u011Fru: <b>' + AK.dogruSoru() + '</b> \u00B7 yanl\u0131\u015F defteri: <b>'
      + a.yanlis + '</b> \u00B7 vadesi gelen tekrar: <b>' + a.vadeli + '</b></div>');
    h += '</div>';

    /* 4) nerede kaldım / sırada ne var */
    h += '<h3 style="margin:16px 0 8px">NEREDE KALDIM? &amp; SIRADA NE VAR?</h3>';
    h += '<div class="akKutular">';
    h += AK.kutu('<h3>\uD83D\uDCCC NEREDE KALDIM</h3><div class="akKucuk">'
      + (son ? 'B\u00F6l\u00FCm: <b>' + kac(son.bolum.ad) + '</b><br>S\u0131radaki kart: <b>'
        + kac((son.kayit && (son.kayit.ad || son.kayit.metin)) || '\u2014') + '</b><br>Kalan kart: <b>'
        + son.kalan + '</b>' : 'Hen\u00FCz okuma kayd\u0131n yok. Bir b\u00F6l\u00FCm a\u00E7, okumaya ba\u015Fla.') + '</div>'
      + (son ? '<div class="akDugSira"><button class="akDug akIkincil" data-oku="' + kac(son.bolum.id) + '">\u25B6 B\u00D6L\u00DCM\u00DC A\u00C7</button></div>' : ''));
    h += AK.kutu('<h3>\uD83E\uDE9C SIRADA NE VAR</h3><div class="akListe" style="margin-top:6px">'
      + (function () {
        var adimlar = [];
        if (a.vadeli) adimlar.push('Vadesi gelen ' + a.vadeli + ' tekrar\u0131 bitir');
        if (!v.onSinav) adimlar.push('\u00D6n s\u0131nav\u0131 tamamla (24 soru)');
        if (a.zayif[0]) adimlar.push(a.zayif[0].ad + ' alan\u0131nda 20 soru \u00E7\u00F6z');
        if (a.zayif[1]) adimlar.push(a.zayif[1].ad + ' alan\u0131na ge\u00E7');
        if (a.yanlis) adimlar.push('Yanl\u0131\u015F defterindeki ' + a.yanlis + ' soruyu d\u00FCzelt');
        adimlar.push('Bir s\u0131navda %70+ al\u0131p sertifika \u00FCret');
        adimlar.push('Portf\u00F6y/CV olu\u015Ftur');
        return adimlar.slice(0, 6).map(function (x, i) {
          return '<div class="akSatir"><span class="akNo">' + (i + 1) + '.</span><span>' + x + '</span></div>';
        }).join('');
      })() + '</div>');
    h += '</div>';

    /* 5) haftalık plan */
    h += '<h3 style="margin:16px 0 8px">HAFTALIK \u00C7ALI\u015EMA PLANI (otomatik \u00FCretildi)</h3>';
    var gunler = ['Pazartesi', 'Sal\u0131', '\u00C7ar\u015Famba', 'Per\u015Fembe', 'Cuma', 'Cumartesi', 'Pazar'];
    var sirali = a.matris.slice().sort(function (x, y) { return x.oran - y.oran; });
    h += '<div class="akListe"><div class="akSatirUst"><span>G\u00DCN</span><span>ODAK</span>'
      + '<span class="akSag">G\u00D6REV</span></div>';
    gunler.forEach(function (g, i) {
      var alan = sirali[i % Math.max(1, Math.min(7, sirali.length))] || { ad: 'Tekrar' };
      var gorev = (i % 3 === 0) ? '20 soru + hata analizi' : (i % 3 === 1 ? '10 soru + 1 b\u00F6l\u00FCm okuma' : 'Tekrar + yanl\u0131\u015F defteri');
      if (i === 3 && !v.onSinav) { alan = { ad: '\u00D6N SINAV' }; gorev = '24 soru seviye tespiti'; }
      if (i === 6) { gorev = 'Genel s\u0131nav (30 soru) + karne kontrol\u00FC'; }
      h += '<div class="akSatir"><span class="akNo" style="min-width:80px">' + g + '</span>'
        + '<span style="flex:1 1 160px">' + kac(alan.ad) + '</span>'
        + '<span class="akSag">' + kac(gorev) + '</span></div>';
    });
    h += '</div>';

    /* 6) dürüst eksik listesi */
    if (a.iceriksiz.length) {
      h += '<div class="akNot akUyari"><b>D\u00FCr\u00FCst not \u2014 i\u00E7eri\u011Fi hen\u00FCz olmayan alanlar:</b> '
        + a.iceriksiz.map(function (x) { return kac(x.ad); }).join(' \u00B7 ')
        + '. Bu alanlar\u0131n soru/i\u00E7eri\u011Fi Kali ve sunucu a\u015Famas\u0131nda \u00FCretilecek '
        + '(bkz. <b>00-YAPILAMAYANLAR-KALI-VE-SUNUCU.txt</b>). Sistem bunlar\u0131 sahte sorularla doldurmaz.</div>';
    }
    var rapor = 'Bu rapor senin verinden \u00FCretildi: ';
    if (a.baslangic != null && a.simdi != null) {
      rapor += 'ba\u015Flang\u0131\u00E7ta %' + a.baslangic + ' ile ba\u015Flad\u0131n, son s\u0131navlar\u0131nda %' + a.simdi
        + ' seviyesindesin (' + (a.fark >= 0 ? '+' : '') + a.fark + ' puan). ';
    } else {
      rapor += 'hen\u00FCz kar\u015F\u0131la\u015Ft\u0131rma i\u00E7in yeterli s\u0131nav verisi yok. ';
    }
    if (a.guclu[0]) rapor += 'En g\u00FC\u00E7l\u00FC alan\u0131n <b>' + a.guclu[0].ad + '</b> (%' + a.guclu[0].oran + '). ';
    if (a.zayif[0]) rapor += 'En \u00E7ok geli\u015Ftirmen gereken alan\u0131n <b>' + a.zayif[0].ad + '</b> (%' + a.zayif[0].oran + '). ';
    rapor += 'Toplam <b>' + AK.toplamSoru() + '</b> soru \u00E7\u00F6zd\u00FCn, <b>' + AK.dogruSoru() + '</b> do\u011Fru yapt\u0131n; '
      + okuma.yuzde + '% i\u00E7erik okudun ve <b>' + AK.seri() + ' g\u00FCn</b> \u00FCst \u00FCste \u00E7al\u0131\u015Ft\u0131n.';
    h += '<div class="akNot"><b>AI GEL\u0130\u015E\u0130M RAPORU:</b> ' + rapor + '</div>';

    ic().innerHTML = h;
    /* butonlar */
    $$('[data-g]').forEach(function (b) {
      b.onclick = function () {
        var g = gorevler[parseInt(b.getAttribute('data-g'), 10)];
        if (!g) return;
        if (g.git) AK.git(g.git);
        else if (g.plan) planaHazir(g.plan.adet, g.plan.alan, 'SINAVA BA\u015ELA');
        else if (g.oku) bolumAcById(g.oku);
      };
    });
    $$('[data-oku]').forEach(function (b) {
      b.onclick = function () { bolumAcById(b.getAttribute('data-oku')); };
    });
  });

  function bolumAcById(bid) {
    if (!window.V) return;
    var idx = -1;
    V.bolumler.forEach(function (b, i) { if (b.id === bid) idx = i; });
    if (idx < 0) return;
    AK.kapat();
    if (typeof window.bolumAc === 'function') window.bolumAc(idx); else AK.not('B\u00F6l\u00FCm a\u00E7\u0131lamad\u0131.', 'kotu');
  }

  /* ------------------------------ BECERİ AĞACI ---------------------------- */
  AK.modulEkle('skill', function () {
    var a = analiz(), m = a.matris;
    var h = AK.baslik('BECER\u0130 A\u011EACI & S\u0130BER RADAR', '12 alan',
      '\u0130ki g\u00F6r\u00FCn\u00FCm ayn\u0131 veriden: <b>radar</b> alanlar\u0131n dengesini, <b>a\u011Fa\u00E7</b> hangi dalda '
      + 'ne kadar ustala\u015Ft\u0131\u011F\u0131n\u0131 g\u00F6sterir. Ustal\u0131k; s\u0131nav do\u011Frulu\u011Fu (%78) + okuma (%22) ile hesaplan\u0131r \u2014 uydurma puan yok.');
    h += '<div class="akKutular">';
    h += AK.kutu('<h3>S\u0130BER RADAR</h3><canvas class="akTuval" id="akRadar" width="620" height="620"></canvas>'
      + '<div class="akKucuk" style="text-align:center">12 alan \u00B7 \u00F6l\u00E7\u00FClen ustal\u0131k</div>');
    h += AK.kutu('<h3>BECER\u0130 A\u011EACI</h3><div class="akListe" style="margin-top:6px">'
      + m.map(function (x, i) {
        var renk = x.oran >= 85 ? '#d4af37' : (x.oran >= 60 ? '#00e05a' : (x.oran >= 30 ? '#ffc107' : '#ff5470'));
        return '<div class="akSatir"><span class="akNo">' + (i + 1) + '.</span>'
          + '<span style="flex:0 0 165px">' + kac(x.ad) + '</span>'
          + '<span style="flex:1 1 90px">' + AK.cubuk(x.oran, renk) + '</span>'
          + '<span class="akSag" style="color:' + renk + '">%' + x.oran + '</span>'
          + '<button class="akDug" data-alan="' + x.id + '" style="padding:3px 7px;font-size:11px">\u00C7ALI\u015E</button></div>';
      }).join('') + '</div>');
    h += '</div>';
    h += '<div class="akKutular" style="margin-top:14px">';
    h += AK.kutu('<h3>\uD83C\uDFC6 USTALIK SEV\u0130YELER\u0130</h3><div class="akKucuk">'
      + '<b>%85+</b> UZMAN (alt\u0131n) \u00B7 <b>%60-84</b> \u0130LER\u0130 (ye\u015Fil) \u00B7 <b>%30-59</b> GEL\u0130\u015E\u0130YOR (sar\u0131) \u00B7 '
      + '<b>%30 alt\u0131</b> BA\u015ELANGI\u00C7 (k\u0131rm\u0131z\u0131)</div>');
    h += AK.kutu('<h3>\uD83C\uDF96\uFE0F UZMAN ROZET\u0130</h3><div class="akKucuk">'
      + (m.some(function (x) { return x.oran >= 85 && x.soru >= 8; })
        ? '\u2714 kazan\u0131ld\u0131 \u2014 bir alanda %85 ustal\u0131k'
        : 'Bir alanda %85 ustal\u0131k + en az 8 soru \u00E7\u00F6z\u00FCnce kazan\u0131l\u0131r.') + '</div>');
    h += '</div>';
    ic().innerHTML = h;
    radarCiz($('#akRadar'), m);
    $$('[data-alan]').forEach(function (b) {
      b.onclick = function () { planaHazir(20, b.getAttribute('data-alan'), 'SINAVA BA\u015ELA'); };
    });
  });

  function radarCiz(c, m) {
    if (!c) return;
    var g = c.getContext('2d'), W = c.width, H = c.height, cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2 - 78;
    var n = m.length, i;
    g.clearRect(0, 0, W, H);
    /* halkalar */
    for (var k = 1; k <= 5; k++) {
      g.beginPath();
      for (i = 0; i < n; i++) {
        var an = -Math.PI / 2 + i * 2 * Math.PI / n;
        var rr = R * k / 5;
        var x = cx + Math.cos(an) * rr, y = cy + Math.sin(an) * rr;
        if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
      }
      g.closePath();
      g.strokeStyle = k === 5 ? 'rgba(160,190,220,.55)' : 'rgba(160,190,220,.20)';
      g.lineWidth = k === 5 ? 2 : 1; g.stroke();
    }
    /* eksenler + etiketler */
    g.font = '600 15px "Segoe UI", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (i = 0; i < n; i++) {
      var an2 = -Math.PI / 2 + i * 2 * Math.PI / n;
      g.beginPath(); g.moveTo(cx, cy);
      g.lineTo(cx + Math.cos(an2) * R, cy + Math.sin(an2) * R);
      g.strokeStyle = 'rgba(160,190,220,.18)'; g.stroke();
      var lx = cx + Math.cos(an2) * (R + 34), ly = cy + Math.sin(an2) * (R + 34);
      g.fillStyle = '#9fb6cd'; g.fillText(m[i].ad, lx, ly);
      g.fillStyle = '#ffd968'; g.font = '600 13px Consolas, monospace';
      g.fillText('%' + m[i].oran, lx, ly + 15);
      g.font = '600 15px "Segoe UI", sans-serif';
    }
    /* alan */
    g.beginPath();
    for (i = 0; i < n; i++) {
      var an3 = -Math.PI / 2 + i * 2 * Math.PI / n;
      var r3 = R * Math.max(0.04, m[i].oran / 100);
      var x3 = cx + Math.cos(an3) * r3, y3 = cy + Math.sin(an3) * r3;
      if (i === 0) g.moveTo(x3, y3); else g.lineTo(x3, y3);
    }
    g.closePath();
    var grd = g.createRadialGradient(cx, cy, 10, cx, cy, R);
    grd.addColorStop(0, 'rgba(0,224,90,.55)'); grd.addColorStop(1, 'rgba(55,224,255,.30)');
    g.fillStyle = grd; g.fill();
    g.strokeStyle = '#00e05a'; g.lineWidth = 3; g.stroke();
    for (i = 0; i < n; i++) {
      var an4 = -Math.PI / 2 + i * 2 * Math.PI / n;
      var r4 = R * Math.max(0.04, m[i].oran / 100);
      g.beginPath(); g.arc(cx + Math.cos(an4) * r4, cy + Math.sin(an4) * r4, 4.5, 0, Math.PI * 2);
      g.fillStyle = '#ffffff'; g.fill();
    }
    g.fillStyle = 'rgba(255,217,104,.9)'; g.font = '700 16px "Segoe UI", sans-serif';
    g.fillText('\u00DCSTAD S\u0130BER AKADEM\u0130', cx, cy + 4);
  }

  /* --------------------------------- KARNE -------------------------------- */
  AK.modulEkle('karne', function () {
    var v = AK.veri, a = analiz(), okuma = okumaDurumu();
    var h = AK.baslik('KARNE & ANAL\u0130T\u0130K', 'son 14 g\u00FCn',
      'Beynin \u00FCretti\u011Fi karne: g\u00FCnl\u00FCk \u00E7al\u0131\u015Fma grafi\u011Fi, ba\u015Flang\u0131\u00E7-seviye kar\u015F\u0131la\u015Ft\u0131rmas\u0131, '
      + 'alan performans\u0131, okuma ilerlemesi ve geli\u015Fim raporu.');
    h += '<div class="akKutular">';
    h += AK.kutu('<h3>SON 14 G\u00DCN \u00C7ALI\u015EMA</h3><canvas id="akGrafik" width="640" height="260" '
      + 'style="width:100%;height:auto"></canvas><div class="akKucuk">her \u00E7ubuk bir g\u00FCn \u00B7 ye\u015Fil: \u00E7\u00F6z\u00FClen soru \u00B7 alt\u0131n: XP/10</div>');
    h += AK.kutu('<h3>SEV\u0130YE GEL\u0130\u015E\u0130M\u0130</h3>'
      + '<div class="akListe"><div class="akSatir"><span class="akNo">1.</span><span>\u00D6n s\u0131nav (ba\u015Flang\u0131\u00E7)</span>'
      + '<span class="akSag">%' + (a.baslangic != null ? a.baslangic : 0) + '</span></div>'
      + '<div class="akSatir"><span class="akNo">2.</span><span>Son 5 s\u0131nav ortalamas\u0131</span>'
      + '<span class="akSag">%' + (a.simdi != null ? a.simdi : 0) + '</span></div>'
      + '<div class="akSatir"><span class="akNo">3.</span><span>Fark</span><span class="akSag" style="color:'
      + (a.fark == null ? 'inherit' : (a.fark >= 0 ? '#00e05a' : '#ff5470')) + '">'
      + (a.fark == null ? '\u2014' : (a.fark >= 0 ? '+' : '') + a.fark + ' puan') + '</span></div></div>'
      + AK.cubuk(a.simdi || 0));
    h += '</div>';

    h += '<h3 style="margin:16px 0 8px">ALAN PERFORMANSI (zay\u0131ftan g\u00FC\u00E7l\u00FCye)</h3><div class="akListe">'
      + '<div class="akSatirUst"><span>#</span><span>ALAN</span><span class="akSag">DO\u011ERU / SORU \u00B7 USTALIK</span></div>';
    m8(a.matris).forEach(function (x, i) {
      h += '<div class="akSatir"><span class="akNo">' + (i + 1) + '.</span>'
        + '<span style="flex:1 1 180px">' + kac(x.ad) + '</span>'
        + '<span class="akSag">' + x.dogru + ' / ' + x.soru + ' \u00B7 %' + x.oran + '</span></div>';
    });
    h += '</div>';

    h += '<h3 style="margin:16px 0 8px">OKUMA \u0130LERLEMES\u0130 (ilk 12 b\u00F6l\u00FCm)</h3><div class="akListe">'
      + '<div class="akSatirUst"><span>#</span><span>B\u00D6L\u00DCM</span><span class="akSag">OKUNAN / TOPLAM</span></div>';
    okuma.bolumler.slice().sort(function (x, y) { return y.okunan - x.okunan; }).slice(0, 12).forEach(function (b, i) {
      h += '<div class="akSatir"><span class="akNo">' + (i + 1) + '.</span>'
        + '<span style="flex:1 1 200px">' + kac(b.ad) + '</span>'
        + '<span class="akSag">' + b.okunan + ' / ' + b.toplam + ' \u00B7 %' + b.oran + '</span></div>';
    });
    h += '</div>';
    h += '<div class="akKucuk" style="margin-top:8px">B\u00F6l\u00FCm say\u0131s\u0131: <b>' + okuma.bolumler.length
      + '</b> \u00B7 toplam kart: <b>' + okuma.toplam + '</b> \u00B7 okunan: <b>' + okuma.okunan + '</b></div>';

    /* rozet vitrini */
    h += '<h3 style="margin:16px 0 8px">ROZET V\u0130TR\u0130N\u0130 (' + Object.keys(v.rozetler).length + ' / ' + AK.ROZET.length + ')</h3>';
    h += '<div class="akRozetler">' + AK.ROZET.map(function (r) {
      var kazanildi = !!v.rozetler[r.id];
      return '<span class="akRozet' + (kazanildi ? ' kazanildi' : '') + '" title="' + kac(r.kosul) + '">'
        + '<span class="akRSimge">' + r.simge + '</span>' + kac(r.ad)
        + (kazanildi ? ' \u00B7 ' + AK.trTarih(v.rozetler[r.id]) : ' \u2014 ' + kac(r.kosul)) + '</span>';
    }).join('') + '</div>';

    /* rütbe şeridi */
    h += '<h3 style="margin:16px 0 8px">R\u00DCTBE BASAMAKLARI</h3><div class="akRutbe">'
      + AK.RUTBE.map(function (r) {
        return '<span class="akRBasamak' + (v.xp >= r.xp ? ' aktif' : '') + '">' + kac(r.ad)
          + ' <span style="opacity:.7">' + r.xp + ' XP</span></span>';
      }).join('') + '</div>';

    h += '<div class="akDugSira" style="margin-top:16px"><button class="akDug akIkincil" id="akKarneYaz">'
      + '\uD83D\uDDA8 KARNEY\u0130 YAZDIR</button>'
      + '<button class="akDug akBirincil" id="akKarneTest">\uD83D\uDD01 KEND\u0130N\u0130 YEN\u0130DEN TEST ET (20 soru)</button></div>';
    ic().innerHTML = h;

    gunGrafik($('#akGrafik'), v);
    $('#akKarneTest').onclick = function () {
      AK.git('sinav');
      setTimeout(function () {
        var b = document.getElementById('akBasla');
        if (b) { b.focus(); AK.not('Ayarlar haz\u0131r \u2014 SINAVA BA\u015ELA d\u00FC\u011Fmesine bas (20 soru, adaptif).', 'iyi'); }
      }, 120);
    };
    $('#akKarneYaz').onclick = function () { karneYazdir(a, okuma); };
  });

  function m8(m) { return m.slice().sort(function (a, b) { return a.oran - b.oran; }); }

  function gunGrafik(c, v) {
    if (!c) return;
    var g = c.getContext('2d'), W = c.width, H = c.height;
    g.clearRect(0, 0, W, H);
    var gunler = [], d = new Date(), maxS = 1, maxX = 1, i;
    for (i = 13; i >= 0; i--) {
      var t = new Date(d.getTime() - i * 864e5);
      var x = v.gunluk[AK.gun(t.getTime())] || { soru: 0, xp: 0 };
      gunler.push({ t: t, soru: x.soru || 0, xp: x.xp || 0 });
      if ((x.soru || 0) > maxS) maxS = x.soru;
      if ((x.xp || 0) / 10 > maxX) maxX = (x.xp || 0) / 10;
    }
    var pay = W / 14;
    g.strokeStyle = 'rgba(160,190,220,.25)'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(0, H - 26); g.lineTo(W, H - 26); g.stroke();
    gunler.forEach(function (x, k) {
      var bx = k * pay + pay * 0.22, bw = pay * 0.26;
      var hs = (x.soru / maxS) * (H - 60);
      var hx = (x.xp / 10 / maxX) * (H - 60);
      g.fillStyle = '#00e05a'; g.fillRect(bx, H - 26 - hs, bw, hs);
      g.fillStyle = '#ffd968'; g.fillRect(bx + bw + 2, H - 26 - hx, bw, hx);
      if (x.soru) {
        g.fillStyle = '#eaf4ff'; g.font = '600 12px Consolas, monospace'; g.textAlign = 'center';
        g.fillText(String(x.soru), bx + bw, H - 32 - hs);
      }
    });
    g.fillStyle = '#9fb6cd'; g.font = '600 13px "Segoe UI", sans-serif'; g.textAlign = 'left';
    g.fillText('14 g\u00FCn \u00F6nce', 2, H - 8);
    g.textAlign = 'right'; g.fillText('bug\u00FCn', W - 2, H - 8);
  }

  function karneYazdir(a, okuma) {
    var v = AK.veri;
    var w = window.open('', '_blank');
    if (!w) { AK.not('A\u00E7\u0131l\u0131r pencere engellendi.', 'kotu'); return; }
    var cv = document.getElementById('akGrafik');
    var gorsel = cv ? cv.toDataURL('image/png') : '';
    var h = '<html><head><meta charset="utf-8"><title>Karne \u2014 ' + kac(v.profil ? v.profil.ad : '') + '</title>'
      + '<style>body{font-family:"Segoe UI",Arial,sans-serif;color:#12212f;padding:32px}'
      + 'h1{font-size:22px;margin:0 0 4px}h2{font-size:13px;letter-spacing:.16em;text-transform:uppercase;'
      + 'color:#6b5a24;border-bottom:2px solid #c9a227;padding-bottom:4px;margin:20px 0 8px}'
      + 'table{border-collapse:collapse;width:100%;font-size:13px}th,td{border-bottom:1px solid #ddd;padding:6px 4px;text-align:left}'
      + '.no{width:34px;font-family:Consolas,monospace}img{max-width:100%;border:1px solid #ddd;border-radius:8px}</style></head><body>';
    h += '<h1>\u00DCSTAD S\u0130BER AKADEM\u0130 \u2014 \u00D6\u011ERENC\u0130 KARNES\u0130</h1>';
    h += '<div>' + kac(v.profil ? v.profil.ad : '\u2014') + ' \u00B7 ' + kac(v.profil ? v.profil.no : '')
      + ' \u00B7 ' + AK.trTarih() + ' \u00B7 R\u00FCtbe: ' + kac(AK.rutbe().ad) + ' \u00B7 seviye ' + AK.seviye().seviye
      + ' \u00B7 ' + v.xp + ' XP</div>';
    if (gorsel) h += '<h2>Son 14 G\u00FCn</h2><img src="' + gorsel + '">';
    h += '<h2>Alan Performans\u0131</h2><table><tr><th class="no">#</th><th>Alan</th><th>Do\u011Fru</th><th>Soru</th><th>Ustal\u0131k</th></tr>';
    m8(a.matris).forEach(function (x, i) {
      h += '<tr><td class="no">' + (i + 1) + '.</td><td>' + kac(x.ad) + '</td><td>' + x.dogru + '</td><td>'
        + x.soru + '</td><td>%' + x.oran + '</td></tr>';
    });
    h += '</table>';
    h += '<h2>\u00D6zet</h2><div>\u00C7\u00F6z\u00FClen soru: <b>' + AK.toplamSoru() + '</b> \u00B7 do\u011Fru: <b>'
      + AK.dogruSoru() + '</b> \u00B7 s\u0131nav: <b>' + v.oturumlar.length + '</b> \u00B7 okuma: <b>%'
      + okuma.yuzde + '</b> \u00B7 seri: <b>' + AK.seri() + ' g\u00FCn</b> \u00B7 rozet: <b>'
      + Object.keys(v.rozetler).length + '/' + AK.ROZET.length + '</b></div>';
    h += '<script>window.onload=function(){setTimeout(function(){window.print();},500);}<\/script></body></html>';
    w.document.write(h); w.document.close();
  }
})();
