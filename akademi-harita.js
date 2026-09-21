/* ==========================================================================
   ÜSTAD AKADEMİ SİTESİ — HARİTA, YOLCULUK, FİNAL, ARŞİV, AYARLAR
   (akademi-harita.js)
   Master liste: 50 (Siber Dünya Haritası 2.0) · 51 (yolculuk günlüğü) ·
   52-53 (final sınavları + teori/pratik değerlendirmesi) · 86 (arama/bildirim) ·
   87 (TR/EN dil) · 88 (PWA) · 92/129 (erişilebilirlik) · 114-119 (profil
   karşılaştırma, gelişim grafiği, arşiv)
   ========================================================================== */
(function () {
  'use strict';
  if (!window.AK) return;
  var AK = window.AK, kac = AK.kac;

  AK.MODUL.push({ id: 'harita', simge: '\uD83D\uDDFA\uFE0F', ad: 'S\u0130BER D\u00DCNYA HAR\u0130TASI', alt: 'harita 2.0 + yolculuk + final' });
  AK.RENK.harita = '#4dd6c1';

  /* --------------------------- 87: TR/EN sözlük -------------------------- */
  AK.DIL = (AK.veri && AK.veri.dil) || 'tr';
  var SOZLUK = {
    'S\u0130BER K\u0130ML\u0130K': 'CYBER IDENTITY', '\u00D6N SINAV': 'PLACEMENT EXAM',
    'AKADEM\u0130 BEYN\u0130': 'ACADEMY BRAIN', 'BECER\u0130 A\u011EACI': 'SKILL TREE',
    'SINAV MERKEZ\u0130': 'EXAM CENTER', 'YANLI\u015ELAR DEFTER\u0130': 'MISTAKE BOOK',
    'TEKRAR MOTORU': 'REPEAT ENGINE', 'KARNE & ANAL\u0130T\u0130K': 'REPORT & ANALYTICS',
    'SERT\u0130F\u0130KA': 'CERTIFICATE', 'D\u0130J\u0130TAL KASA': 'DIGITAL VAULT',
    'PORTF\u00D6Y & CV': 'PORTFOLIO & CV', 'PROJE TAK\u0130P': 'PROJECT TRACKER',
    'G\u00D6REV MERKEZ\u0130': 'MISSION CENTER', 'M\u0130N\u0130 OYUNLAR': 'MINI GAMES',
    'LABORATUVARLAR': 'LABORATORIES', 'AI \u00D6\u011ERETMEN & MENTOR': 'AI TEACHER & MENTOR',
    'KAR\u0130YER & PORTF\u00D6Y': 'CAREER & PORTFOLIO', 'S\u0130BER D\u00DCNYA HAR\u0130TASI': 'CYBER WORLD MAP'
  };
  AK.ceviri = function (s) { return (AK.DIL === 'en' && SOZLUK[s]) ? SOZLUK[s] : s; };

  /* ------------------------- 50: harita 2.0 (canvas) ---------------------- */
  function haritaCiz(tuval) {
    if (!tuval || !tuval.getContext) return;
    var ctx = tuval.getContext('2d');
    var W = tuval.width = Math.min(980, (AK.icerik.clientWidth || 900) - 30);
    var H = tuval.height = Math.round(W * 0.5);
    var sm = AK.skillMatris ? AK.skillMatris() : [];
    var alanlar = AK.ALAN || [];
    var n = alanlar.length || 1;
    var zaman = 0;

    /* adalar: her alan bir adadır, ustalık yüzdesi ada dolgunluğunu belirler */
    var adalar = alanlar.map(function (a, i) {
      var aci = (i / n) * Math.PI * 2;
      var mx = W / 2 + Math.cos(aci) * (W * 0.32);
      var my = H / 2 + Math.sin(aci) * (H * 0.34);
      var s = sm.filter(function (x) { return x.id === a.id; })[0] || { yuzde: 0 };
      return { x: mx, y: my, ad: a.ad, id: a.id, yuzde: s.yuzde || 0, renk: AK.RENK[a.id] || '#4dd6c1' };
    });

    function kare() {
      if (!document.body.contains(tuval)) return;
      zaman += 0.02;
      ctx.clearRect(0, 0, W, H);
      /* zemin ızgara */
      ctx.strokeStyle = 'rgba(46,230,168,.10)';
      ctx.lineWidth = 1;
      var g;
      for (g = 0; g <= W; g += 40) { ctx.beginPath(); ctx.moveTo(g, 0); ctx.lineTo(g, H); ctx.stroke(); }
      for (g = 0; g <= H; g += 40) { ctx.beginPath(); ctx.moveTo(0, g); ctx.lineTo(W, g); ctx.stroke(); }
      /* bağlantı çizgileri */
      ctx.strokeStyle = 'rgba(201,139,58,.28)';
      adalar.forEach(function (a, i) {
        var b = adalar[(i + 1) % adalar.length];
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      });
      /* adalar */
      adalar.forEach(function (a) {
        var r = 16 + (a.yuzde / 100) * 26;
        ctx.beginPath();
        ctx.arc(a.x, a.y, r + Math.sin(zaman + a.x) * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = a.renk;
        ctx.globalAlpha = 0.18 + (a.yuzde / 100) * 0.55;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = a.renk;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#eef7f3';
        ctx.font = '11px Consolas, monospace';
        ctx.textAlign = 'center';
        var ad = a.ad.length > 16 ? a.ad.slice(0, 15) + '\u2026' : a.ad;
        ctx.fillText(ad, a.x, a.y - r - 6);
        ctx.fillStyle = '#9dbfb2';
        ctx.fillText('%' + Math.round(a.yuzde), a.x, a.y + 4);
      });
      requestAnimationFrame(kare);
    }
    kare();

    /* tıklama: en yakın adaya git */
    tuval.onclick = function (e) {
      var r = tuval.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      var en = null, enD = 1e9;
      adalar.forEach(function (a) {
        var d = Math.hypot(a.x - x, a.y - y);
        if (d < enD) { enD = d; en = a; }
      });
      if (en && enD < 60) AK.not('Ada: ' + en.ad + ' \u2014 ustal\u0131k %' + Math.round(en.yuzde) + '. Dersler i\u00E7in AI \u00D6\u011Fretmen b\u00F6l\u00FCm\u00FCn\u00FC kullan.', 'bilgi');
    };
  }

  /* ---------------------------- 51: yolculuk günlüğü ---------------------- */
  function gunlukSatirlari() {
    var v = AK.veri, liste = [];
    (v.milestone || []).forEach(function (m) { liste.push({ t: m.t, tur: 'Kilometre ta\u015F\u0131', ad: m.ad }); });
    (v.oturumlar || []).forEach(function (o) { liste.push({ t: o.t, tur: 'S\u0131nav', ad: (o.tur || 's\u0131nav') + ' \u00B7 %' + o.skor }); });
    (v.sertifikalar || []).forEach(function (s) { liste.push({ t: s.t, tur: 'Sertifika', ad: s.ad || 'Sertifika' }); });
    if (v.onSinav) liste.push({ t: v.onSinav.t || Date.now(), tur: '\u00D6n s\u0131nav', ad: 'Seviye: ' + (v.onSinav.seviye || '-') + ' \u00B7 skor %' + (v.onSinav.skor || 0) });
    if (v.mezun) liste.push({ t: v.mezun.t, tur: 'Mezuniyet', ad: 'Mezuniyet kaydedildi' });
    liste.sort(function (a, b) { return b.t - a.t; });
    return liste;
  }

  /* ------------------------- 52-53: final sınavları ----------------------- */
  function finalSinavi(tur, ad) {
    var ic = AK.icerik;
    var havuz = (AK.tumSorular ? AK.tumSorular() : []).slice();
    havuz = havuz.sort(function () { return Math.random() - 0.5; });
    var istenen = tur === 'genel' ? 20 : 10;
    havuz = havuz.slice(0, istenen);
    if (!havuz.length) { AK.not('Soru havuzu bo\u015F.', 'uyari'); return; }
    var i = 0, dogru = 0;
    function ciz() {
      if (i >= havuz.length) {
        var yuzde = Math.round(dogru / havuz.length * 100);
        var gecti = yuzde >= 70;
        AK.veri.finalSonuc = AK.veri.finalSonuc || {};
        AK.veri.finalSonuc[tur] = { skor: yuzde, t: Date.now(), gecti: gecti };
        AK.veri.oturumlar.push({ t: Date.now(), tur: ad, soru: havuz.length, dogru: dogru, skor: yuzde, seviye: tur });
        AK.xpEkle(dogru * 8, 'Final: ' + ad);
        AK.veri.milestone = AK.veri.milestone || [];
        AK.veri.milestone.push({ ad: ad + ' sonucu: %' + yuzde + (gecti ? ' (ge\u00E7ti)' : ' (kald\u0131)'), t: Date.now() });
        AK.kaydet();
        ic.innerHTML = AK.baslik(ad, gecti ? 'GE\u00C7T\u0130N' : 'TEKRAR GEREK', 'Ge\u00E7me notu %70');
        ic.innerHTML += AK.kutu('<div style="font-size:18px">Skor: <b>%' + yuzde + '</b> (' + dogru + '/' + havuz.length + ')</div>'
          + AK.cubuk(yuzde, gecti ? '#2ee6a8' : '#ff6a3d')
          + '<div class="akSoluk" style="margin-top:6px">' + (gecti ? 'Sertifika uygunlu\u011Fu i\u00E7in Sertifika mod\u00FCl\u00FCne git.' : 'Eksik konular\u0131 AI \u00D6\u011Fretmen ve Yanl\u0131\u015Flar Defteri ile kapat, sonra tekrar dene.') + '</div>'
          + '<div class="akDugSira"><button class="akDug" id="fGeri">\u2190 GER\u0130</button></div>');
        AK.$('#fGeri').onclick = function () { AK.git('harita'); };
        if (AK.gorevKontrol) AK.gorevKontrol();
        return;
      }
      var q = havuz[i];
      ic.innerHTML = AK.baslik(ad, (i + 1) + '/' + havuz.length, 'Final s\u0131nav\u0131 \u2014 her soru puand\u0131r.');
      ic.innerHTML += AK.kutu('<div style="font-size:14px;font-weight:700;margin-bottom:8px">' + kac(q.soru || q.s || '') + '</div>'
        + '<div class="akDugSira" style="flex-direction:column;align-items:stretch">'
        + (q.secenekler || q.c || []).map(function (x, k) {
          return '<button class="akDug" style="text-align:left" data-f="' + k + '">' + kac(x) + '</button>';
        }).join('') + '</div>');
      var d = (q.dogru != null ? q.dogru : (q.d != null ? q.d : 0));
      AK.$$('[data-f]').forEach(function (b) {
        b.onclick = function () {
          var ok = parseInt(b.getAttribute('data-f'), 10) === d;
          if (ok) dogru++;
          AK.not(ok ? '\u2705 Do\u011Fru.' : '\u274C Yanl\u0131\u015F.', ok ? 'iyi' : 'kotu');
          i++; ciz();
        };
      });
    }
    ciz();
  }

  /* --------------------- 114-117: profil karşılaştırma ------------------- */
  function profilKarsilastir(tuval) {
    var v = AK.veri;
    var bas = v.onSinav || { skor: 0, seviye: '-' };
    var simdi = 0;
    var o = v.oturumlar || [];
    if (o.length) {
      var son = o.slice(-5);
      simdi = Math.round(son.reduce(function (a, x) { return a + (x.skor || 0); }, 0) / son.length);
    }
    var sm = (AK.skillMatris ? AK.skillMatris() : []).slice().sort(function (a, b) { return (b.yuzde || 0) - (a.yuzde || 0); });
    var guclu = sm.slice(0, 3), zayif = sm.slice(-3).reverse();

    var s = AK.kutu('<div class="akEtiket">// 114-118. MADDE \u2014 S\u0130BER PROF\u0130L\u0130N HAZIR</div>'
      + '<div style="display:flex;gap:14px;flex-wrap:wrap;margin:8px 0">'
      + '<div><div class="akSoluk">Ba\u015Flang\u0131\u00E7 puan\u0131</div><div style="font-size:24px;font-weight:700">%' + (bas.skor || 0) + '</div></div>'
      + '<div><div class="akSoluk">\u015Eimdiki ortalama</div><div style="font-size:24px;font-weight:700;color:#2ee6a8">%' + simdi + '</div></div>'
      + '<div><div class="akSoluk">Geli\u015Fim</div><div style="font-size:24px;font-weight:700">' + (simdi - (bas.skor || 0) >= 0 ? '+' : '') + (simdi - (bas.skor || 0)) + '</div></div>'
      + '<div><div class="akSoluk">S\u0131nav say\u0131s\u0131</div><div style="font-size:24px;font-weight:700">' + o.length + '</div></div></div>'
      + '<div class="akEtiket">G\u00DC\u00C7L\u00DC ALANLAR</div>'
      + (guclu.length ? guclu.map(function (a) { return '<div class="akGorevSatir">\uD83D\uDD25 ' + kac(a.ad) + ' \u2014 %' + Math.round(a.yuzde || 0) + '</div>'; }).join('') : '<div class="akSoluk">Hen\u00FCz veri yok.</div>')
      + '<div class="akEtiket" style="margin-top:8px">GEL\u0130\u015ET\u0130R\u0130LECEK ALANLAR</div>'
      + (zayif.length ? zayif.map(function (a) { return '<div class="akGorevSatir">\uD83C\uDFAF ' + kac(a.ad) + ' \u2014 %' + Math.round(a.yuzde || 0) + '</div>'; }).join('') : '<div class="akSoluk">Hen\u00FCz veri yok.</div>')
      + '<div class="akSoluk" style="margin-top:8px">Felsefe: \u201CHerkes ayn\u0131 yerden ba\u015Flamaz; akademi \u00F6nce seni tan\u0131r, sonra yolu olu\u015Fturur.\u201D</div>');

    /* gelişim grafiği */
    setTimeout(function () {
      if (!tuval || !tuval.getContext) return;
      var ctx = tuval.getContext('2d');
      var W = tuval.width = Math.min(940, (AK.icerik.clientWidth || 900) - 30), H = tuval.height = 180;
      ctx.clearRect(0, 0, W, H);
      var ot = (AK.veri.oturumlar || []).slice(-14);
      if (ot.length < 2) {
        ctx.fillStyle = '#9dbfb2'; ctx.font = '13px Segoe UI, sans-serif';
        ctx.fillText('Grafik i\u00E7in en az 2 s\u0131nav gerekir. \u015Eu an: ' + ot.length, 16, H / 2);
        return;
      }
      var maxD = Math.max.apply(null, ot.map(function (x) { return x.skor || 0; }));
      ctx.strokeStyle = 'rgba(46,230,168,.25)';
      for (var g = 0; g <= 4; g++) {
        var yy = 20 + (H - 50) * g / 4;
        ctx.beginPath(); ctx.moveTo(40, yy); ctx.lineTo(W - 12, yy); ctx.stroke();
        ctx.fillStyle = '#6f8f84'; ctx.font = '10px Consolas, monospace';
        ctx.fillText(Math.round(maxD - maxD * g / 4) + '%', 6, yy + 3);
      }
      ctx.beginPath();
      ctx.strokeStyle = '#2ee6a8'; ctx.lineWidth = 2;
      ot.forEach(function (x, i) {
        var px = 40 + (W - 60) * (i / (ot.length - 1));
        var py = 20 + (H - 50) * (1 - (x.skor || 0) / (maxD || 1));
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ot.forEach(function (x, i) {
        var px = 40 + (W - 60) * (i / (ot.length - 1));
        var py = 20 + (H - 50) * (1 - (x.skor || 0) / (maxD || 1));
        ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#d8fff0'; ctx.fill();
      });
    }, 30);
    return s;
  }

  /* ------------------------------- 119: arşiv ----------------------------- */
  function arsivKart() {
    return AK.kutu('<div class="akEtiket">// 119. MADDE \u2014 AR\u015E\u0130V (y\u0131llar sonra inceleme)</div>'
      + '<div class="akSoluk">B\u00FCt\u00FCn ilerlemen bu cihazda sakl\u0131. A\u015Fa\u011F\u0131daki d\u00FC\u011Fmelerle yedek al\u0131p ba\u015Fka cihaza ta\u015F\u0131yabilirsin.</div>'
      + '<div class="akDugSira"><button class="akDug" id="arYedek">\u2B07\uFE0F YEDEK AL (.json)</button>'
      + '<button class="akDug" id="arYazdir">\uD83D\uDDA8\uFE0F AR\u015E\u0130V\u0130 YAZDIR</button>'
      + '<label class="akDug" style="cursor:pointer">\u2B06\uFE0F YEDEK Y\u00DCKLE<input type="file" id="arDosya" accept="application/json" style="display:none"></label>'
      + '</div>');
  }

  /* ------------------------------- ayarlar -------------------------------- */
  function ayarKart() {
    var a = AK.veri.ayarlar;
    return AK.kutu('<div class="akEtiket">// 87-88 + 129. MADDE \u2014 AYARLAR</div>'
      + '<div class="akDugSira"><span class="akSoluk">Dil:</span>'
      + '<button class="akDug" data-dil="tr">T\u00DCRK\u00C7E</button><button class="akDug" data-dil="en">ENGLISH</button></div>'
      + '<div class="akDugSira" style="margin-top:8px"><span class="akSoluk">Yaz\u0131 boyutu:</span>'
      + '<button class="akDug" data-yazi="14">K\u00DC\u00C7\u00DCK</button><button class="akDug" data-yazi="15.5">NORMAL</button>'
      + '<button class="akDug" data-yazi="17.5">B\u00DCY\u00DCK</button></div>'
      + '<div class="akDugSira" style="margin-top:8px"><span class="akSoluk">Eri\u015Filebilirlik:</span>'
      + '<button class="akDug" id="kontrast">Y\u00DCKSEK KAR\u015EITLIK</button>'
      + '<button class="akDug" id="pwaKur">\uD83D\uDCF1 UYGULAMA OLARAK KUR</button></div>'
      + '<div class="akSoluk" style="margin-top:8px">Tema: sa\u011F \u00FCstteki tema d\u00FC\u011Fmesi \u00B7 '
      + 'Not: ders i\u00E7erikleri T\u00FCrk\u00E7edir; "English" se\u00E7ildi\u011Finde men\u00FC ve ba\u015Fl\u0131klar \u0130ngilizce olur.</div>');
  }

  /* ------------------------------- çizim --------------------------------- */
  AK.modulEkle('harita', function () {
    var ic = AK.icerik;
    var v = AK.veri;
    ic.innerHTML = AK.baslik('S\u0130BER D\u00DCNYA HAR\u0130TASI', '2.0', '12 alan birer adad\u0131r; ada ne kadar doluysa ustal\u0131\u011F\u0131n o kadar.');

    ic.innerHTML += AK.kutu('<canvas id="haritaTuval" style="width:100%;display:block"></canvas>'
      + '<div class="akSoluk" style="margin-top:6px">Ada dolgunlu\u011Fu = o alandaki ustal\u0131k y\u00FCzdesi. Haritaya dokunarak bilgi alabilirsin.</div>');
    setTimeout(function () { haritaCiz(AK.$('#haritaTuval')); }, 40);

    /* final sınavları */
    ic.innerHTML += '<div style="height:10px"></div>' + AK.kutu('<div class="akEtiket">// 52-53. MADDE \u2014 F\u0130NAL SINAVLARI</div>'
      + '<div class="akSoluk">Ge\u00E7me notu %70. Teori sorular\u0131 + uygulama (lab) + senaryo (vaka) birlikte de\u011Ferlendirilir.</div>'
      + '<div class="akDugSira"><button class="akDug" id="finalAlan">B\u00D6L\u00DCM F\u0130NAL\u0130 (10 soru)</button>'
      + '<button class="akDug" id="finalGenel">GENEL S\u0130BER G\u00DCVENL\u0130K F\u0130NAL\u0130 (20 soru)</button></div>'
      + ((v.finalSonuc && v.finalSonuc.genel) ? '<div class="akBasari" style="margin-top:8px">Son genel final: %' + v.finalSonuc.genel.skor
        + ' \u2014 ' + (v.finalSonuc.genel.gecti ? 'GE\u00C7T\u0130' : 'tekrar gerek') + '</div>' : ''));

    /* profil karşılaştırma + grafik */
    ic.innerHTML += '<div style="height:10px"></div>' + profilKarsilastir(null);
    ic.innerHTML += '<div class="akKutu"><div class="akEtiket">// 117. MADDE \u2014 GEL\u0130\u015E\u0130M GRAF\u0130\u011E\u0130 (son 14 s\u0131nav)</div>'
      + '<canvas id="gelisimTuval" style="width:100%;display:block"></canvas></div>';
    setTimeout(function () { profilKarsilastir(AK.$('#gelisimTuval')); }, 60);

    /* yolculuk günlüğü */
    var gl = gunlukSatirlari();
    ic.innerHTML += '<div style="height:10px"></div>' + AK.kutu('<div class="akEtiket">// 51. MADDE \u2014 S\u0130BER YOLCULUK G\u00DCNL\u00DC\u011e\u00DC</div>'
      + (gl.length ? gl.slice(0, 25).map(function (x) {
        return '<div class="akGorevSatir">' + AK.trTarih(x.t) + ' \u00B7 <span class="akEtiket">' + kac(x.tur) + '</span> ' + kac(x.ad) + '</div>';
      }).join('') : '<div class="akSoluk">Hen\u00FCz kay\u0131t yok.</div>'));

    /* arama (86) */
    ic.innerHTML += '<div style="height:10px"></div>' + AK.kutu('<div class="akEtiket">// 86. MADDE \u2014 ARAMA</div>'
      + '<div class="akDugSira"><input id="araKutu" class="akGirdi" style="flex:1;padding:10px" placeholder="mod\u00FCl, b\u00F6l\u00FCm, terim ara (\u00F6r. nmap, parola, XSS)">'
      + '<button class="akDug" id="araDug">ARA</button></div><div id="araSonuc" style="margin-top:8px"></div>');

    ic.innerHTML += '<div style="height:10px"></div>' + arsivKart();
    ic.innerHTML += '<div style="height:10px"></div>' + ayarKart();

    /* olaylar */
    AK.$('#finalAlan').onclick = function () { finalSinavi('alan', 'B\u00F6l\u00FCm Final S\u0131nav\u0131'); };
    AK.$('#finalGenel').onclick = function () { finalSinavi('genel', 'Genel Siber G\u00FCvenlik Final S\u0131nav\u0131'); };

    AK.$('#araDug').onclick = function () {
      var q = (AK.$('#araKutu').value || '').trim();
      if (!q) return;
      var sonuc = [];
      var qq = q.toLowerCase();
      (AK.MODUL || []).forEach(function (m) { if ((m.ad || '').toLowerCase().indexOf(qq) >= 0) sonuc.push({ tur: 'Mod\u00FCl', ad: m.ad, git: m.id }); });
      var bs = (window.V && V.bolumler) || [];
      bs.forEach(function (b) {
        if ((b.ad || '').toLowerCase().indexOf(qq) >= 0) sonuc.push({ tur: 'B\u00F6l\u00FCm', ad: b.ad, git: 'mentor' });
        (b.kayitlar || []).forEach(function (r) {
          var m = ((r.ad || '') + ' ' + (r.metin || '')).toLowerCase();
          if (m.indexOf(qq) >= 0 && sonuc.length < 40) sonuc.push({ tur: 'Kay\u0131t', ad: (r.ad || '') + ' \u2014 ' + b.ad, git: 'mentor' });
        });
      });
      var s = '<div class="akEtiket">' + sonuc.length + ' SONU\u00C7</div>';
      if (!sonuc.length) s += '<div class="akSoluk">Bulunamad\u0131. Farkl\u0131 kelime dene.</div>';
      sonuc.slice(0, 20).forEach(function (x) {
        s += '<div class="akGorevSatir"><span class="akEtiket">' + kac(x.tur) + '</span> <span data-git="' + x.git + '" style="cursor:pointer;text-decoration:underline">'
          + kac(x.ad) + '</span></div>';
      });
      AK.$('#araSonuc').innerHTML = s;
      AK.$$('[data-git]').forEach(function (e2) { e2.onclick = function () { AK.git(e2.getAttribute('data-git')); }; });
    };
    AK.$('#araKutu').addEventListener('keydown', function (e) { if (e.key === 'Enter') AK.$('#araDug').click(); });

    AK.$('#arYedek').onclick = function () {
      var b = new Blob([JSON.stringify(AK.veri, null, 1)], { type: 'application/json' });
      var a2 = document.createElement('a');
      a2.href = URL.createObjectURL(b);
      a2.download = 'ustad-akademi-yedek-' + AK.gun() + '.json';
      a2.click();
      AK.not('Yedek indirildi.', 'iyi');
    };
    AK.$('#arYazdir').onclick = function () { window.print(); };
    AK.$('#arDosya').onchange = function (ev) {
      var f = ev.target.files && ev.target.files[0];
      if (!f) return;
      var oku = new FileReader();
      oku.onload = function () {
        try {
          var j = JSON.parse(oku.result);
          if (!j || typeof j !== 'object') throw new Error('bo\u015F');
          try { localStorage.setItem(AK.ANAHTAR || 'ustad-akademi-sitesi-v1', JSON.stringify(j)); } catch (e) {}
          AK.not('\u2705 Yedek y\u00FCklendi. Sayfay\u0131 yenile.', 'iyi');
        } catch (e) { AK.not('\u274C Dosya okunamad\u0131.', 'kotu'); }
      };
      oku.readAsText(f);
    };

    AK.$$('[data-dil]').forEach(function (b) {
      b.onclick = function () {
        AK.veri.dil = b.getAttribute('data-dil'); AK.DIL = AK.veri.dil; AK.kaydet();
        AK.not(AK.DIL === 'en' ? 'Menu language: English' : 'Men\u00FC dili: T\u00FCrk\u00E7e', 'bilgi');
        AK.menuCiz(); AK.git('harita');
      };
    });
    AK.$$('[data-yazi]').forEach(function (b) {
      b.onclick = function () {
        var px = b.getAttribute('data-yazi') + 'px';
        AK.icerik.style.fontSize = px;
        AK.veri.ayarlar.yaziBoyut = px;
        AK.kaydet();
        AK.not('Yaz\u0131 boyutu: ' + px, 'bilgi');
      };
    });
    AK.$('#kontrast').onclick = function () {
      var a3 = !AK.veri.ayarlar.kontrast;
      AK.veri.ayarlar.kontrast = a3; AK.kaydet();
      document.documentElement.style.filter = a3 ? 'contrast(1.25) saturate(1.15)' : '';
      AK.not(a3 ? 'Y\u00FCksek kar\u015F\u0131tl\u0131k a\u00E7\u0131k.' : 'Y\u00FCksek kar\u015F\u0131tl\u0131k kapal\u0131.', 'bilgi');
    };
    AK.$('#pwaKur').onclick = function () {
      AK.not('Kurulum: taray\u0131c\u0131 men\u00FCs\u00FCnden "Uygulamay\u0131 y\u00FCkle / Ana ekrana ekle" se\u00E7. Site \u00E7evrimd\u0131\u015F\u0131 \u00E7al\u0131\u015Facak \u015Fekilde haz\u0131r.', 'bilgi');
    };
  });
})();
