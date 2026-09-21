/* ==========================================================================
   ÜSTAD SİBER AKADEMİ — SINAV, BEYİN VERİSİ, SERTİFİKA (akademi-sinav.js)
   Ön sınav (seviye tespiti) · adaptif sınav · "Bana Neden?" · yanlışlar defteri
   aralıklı tekrar · sertifika üretimi · dijital kasa/transkript · portföy & CV
   Çevrimdışı çalışır.
   ========================================================================== */
(function () {
  'use strict';
  var AK = window.AK;
  if (!AK) return;
  var kac = AK.kac, $ = AK.$, $$ = AK.$$, ic = function () { return document.getElementById('akIcerik'); };

  var SV = { kolay: 1, orta: 2, zor: 3, uzman: 4 };
  var SVR = ['', 'KOLAY', 'ORTA', 'ZOR', 'UZMAN'];

  function seviyeAdi(puan) {
    if (puan >= 85) return 'UZMAN';
    if (puan >= 65) return '\u0130LER\u0130';
    if (puan >= 40) return 'ORTA';
    return 'BA\u015ELANGI\u00C7';
  }
  function soruSeviye(r) {
    var s = (r.seviye || 'orta').toString().toLowerCase();
    if (s.indexOf('kolay') >= 0) return 1;
    if (s.indexOf('zor') >= 0) return 3;
    if (s.indexOf('uzman') >= 0 || s.indexOf('ileri') >= 0) return 4;
    return 2;
  }
  function havuz(alanId) {
    var tum = AK.tumSorular();
    if (!alanId) return tum;
    var alan = AK.ALAN.filter(function (a) { return a.id === alanId; })[0];
    if (!alan) return tum;
    return tum.filter(function (s) {
      return alan.bolumler.indexOf(s.b.id) >= 0;
    });
  }
  function karistir(d) {
    var a = d.slice(), i, j, t;
    for (i = a.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  /* adaptif seçim: hedef zorluk = yetenek; kategori çeşitliliği korunur */
  function adaptifSec(h, adet) {
    var secilen = [], kullanilan = {}, yetenek = 2.0, kategoriSayac = {};
    var hav = karistir(h);
    while (secilen.length < adet && hav.length) {
      var enIyi = null, enIyiFark = 99, i;
      for (i = 0; i < hav.length && i < 60; i++) {
        var s = hav[i];
        var kat = (s.r.grup || s.r.ust || '');
        var ceza = (kategoriSayac[kat] || 0) * 0.8;
        var fark = Math.abs(soruSeviye(s.r) - yetenek) + ceza;
        if (fark < enIyiFark) { enIyiFark = fark; enIyi = i; }
      }
      if (enIyi == null) break;
      var sec = hav.splice(enIyi, 1)[0];
      var kat2 = (sec.r.grup || sec.r.ust || '');
      kategoriSayac[kat2] = (kategoriSayac[kat2] || 0) + 1;
      /* son cevaplara göre yetenek güncellemesi cevaplama anında yapılır */
      secilen.push(sec);
    }
    return secilen;
  }

  /* ============================== SINAV ÇEKİRDEĞİ ========================== */
  var S = null;   /* aktif sınav durumu */

  function sinavBaslat(o) {
    S = {
      tur: o.tur || 'sinav', baslik: o.baslik || 'SINAV', alanId: o.alanId || '',
      sorular: o.sorular, i: 0, dogru: 0, cevaplar: [], yetenek: 2.0,
      geriBildirim: o.geriBildirim !== false, baslangic: Date.now(),
      sureDk: o.sureDk || 0, kalan: (o.sureDk || 0) * 60, adaptif: !!o.adaptif,
      hedef: o.hedef || 0
    };
    if (S.sureDk) {
      S.zaman = setInterval(function () {
        S.kalan--;
        var e = document.getElementById('akSayac');
        if (e) e.textContent = sureYazi(S.kalan);
        if (S.kalan <= 0) { clearInterval(S.zaman); S.zaman = null; sinavBitir(); }
      }, 1000);
    }
    soruCiz();
  }
  function sureYazi(sn) {
    if (sn < 0) sn = 0;
    var d = Math.floor(sn / 60), s = sn % 60;
    return ('0' + d).slice(-2) + ':' + ('0' + s).slice(-2);
  }
  function sinavTemizle() { if (S && S.zaman) { clearInterval(S.zaman); S.zaman = null; } }

  function soruCiz() {
    if (!S) return;
    var s = S.sorular[S.i];
    if (!s) { sinavBitir(); return; }
    var r = s.r;
    var yuzde = Math.round(S.i / S.sorular.length * 100);
    var h = '';
    h += '<div class="akIcerikBaslik"><h2>' + kac(S.baslik) + '</h2>'
      + '<span class="akEtiket">' + (S.adaptif ? 'ADAPT\u0130F' : 'SAB\u0130T') + '</span>'
      + (S.sureDk ? '<span class="akEtiket" id="akSayac">' + sureYazi(S.kalan) + '</span>' : '')
      + '<button class="akDug" id="akBitir">\u25A0 SINAVI B\u0130T\u0130R</button></div>';
    h += AK.cubuk(yuzde);
    h += '<div class="akKutu akGenis">';
    h += '<div class="akSatirUst"><span>SORU ' + (S.i + 1) + ' / ' + S.sorular.length + '</span>'
      + '<span>' + kac(r.grup || r.ust || '') + ' \u00B7 ' + SVR[soruSeviye(r)] + '</span>'
      + '<span>\u2714 ' + S.dogru + '</span></div>';
    h += '<div class="akSoru">' + kac(r.ad) + '</div>';
    (r.secenekler || []).forEach(function (sec, k) {
      h += '<button class="akSecenek" data-k="' + k + '"><span class="akHarf">'
        + String.fromCharCode(65 + k) + ')</span><span>' + kac(sec) + '</span></button>';
    });
    h += '<div id="akNedenAlan"></div>';
    h += '</div>';
    ic().innerHTML = h;
    $('#akBitir').onclick = function () { sinavTemizle(); sinavBitir(); };
    $$('.akSecenek', ic()).forEach(function (b) {
      b.onclick = function () { cevapla(parseInt(b.getAttribute('data-k'), 10)); };
    });
  }

  function cevapla(k) {
    var s = S.sorular[S.i], r = s.r;
    if (s._cevap != null) return;
    s._cevap = k;
    var dogruMu = (k === r.dogru);
    s._dogru = dogruMu;
    var sw = soruSeviye(r);

    /* XP */
    AK.xpEkle(dogruMu ? 12 : 3);
    AK.gunlukEkle({ soru: 1, dogru: dogruMu ? 1 : 0 });
    AK.soruKaydet(s.anahtar, dogruMu);
    if (dogruMu) S.dogru++;
    S.cevaplar.push({ anahtar: s.anahtar, ad: r.ad, dogru: dogruMu, secenek: k,
      dogruIndex: r.dogru, metin: r.metin, grup: r.grup || r.ust, zorluk: sw });
    if (dogruMu) S.yetenek = Math.min(4, S.yetenek + (sw <= S.yetenek ? 0.32 : 0.18));
    else S.yetenek = Math.max(1, S.yetenek - 0.5);

    /* boyama + BANA NEDEN */
    $$('.akSecenek', ic()).forEach(function (b) {
      var kk = parseInt(b.getAttribute('data-k'), 10);
      b.disabled = true;
      if (kk === r.dogru) b.classList.add('dogru');
      if (kk === k && !dogruMu) b.classList.add('yanlis');
    });
    var n = $('#akNedenAlan');
    n.innerHTML = '<div class="akNeden"><b>' + (dogruMu ? '\u2714 DO\u011ERU CEVAP' : '\u2718 YANLI\u015E CEVAP')
      + ' \u2014 BANA NEDEN?</b><br>'
      + (r.metin ? kac(r.metin) : 'A\u00E7\u0131klama bu soruda bulunmuyor.')
      + (r.ornek ? '<br><br><b>\u00D6RNEK:</b> <code>' + kac(r.ornek) + '</code>' : '')
      + (!dogruMu ? '<br><br><b>Do\u011Fru cevap:</b> ' + String.fromCharCode(65 + r.dogru) + ') '
        + kac((r.secenekler || [])[r.dogru]) : '')
      + '</div>'
      + '<button class="akDug akBirincil" id="akDevam">'
      + (S.i + 1 < S.sorular.length ? 'SONRAK\u0130 SORU \u2192' : 'SINAVI B\u0130T\u0130R \u2192') + '</button>';
    $('#akDevam').onclick = function () {
      S.i++;
      if (S.adaptif && S.i < S.sorular.length) {
        /* adaptif: yeteneğe uygun yeni soru ekle (havuzdan) */
        var ek = adaptifSec(havuz(S.alanId).filter(function (x) {
          return !S.sorular.some(function (y) { return y.anahtar === x.anahtar; });
        }), 1);
        if (ek.length) S.sorular[S.i] = ek[0];
      }
      if (S.i >= S.sorular.length) { sinavTemizle(); sinavBitir(); }
      else soruCiz();
    };
    if (!S.geriBildirim) setTimeout(function () { $('#akDevam').click(); }, 350);
  }

  function sinavBitir() {
    sinavTemizle();
    var toplam = S.cevaplar.length || 1;
    var skor = Math.round(S.dogru / toplam * 100);
    var kat = {};
    S.cevaplar.forEach(function (c) {
      var k = c.grup || 'Genel';
      kat[k] = kat[k] || { soru: 0, dogru: 0 };
      kat[k].soru++; if (c.dogru) kat[k].dogru++;
    });
    var kayit = {
      t: Date.now(), tur: S.tur, baslik: S.baslik, alanId: S.alanId,
      soru: S.cevaplar.length, dogru: S.dogru, skor: skor,
      seviye: seviyeAdi(skor), dk: Math.round((Date.now() - S.baslangic) / 60000),
      kat: Object.keys(kat).map(function (k) {
        return { ad: k, soru: kat[k].soru, dogru: kat[k].dogru, oran: Math.round(kat[k].dogru / kat[k].soru * 100) };
      }).sort(function (a, b) { return a.oran - b.oran; })
    };
    AK.veri.oturumlar.push(kayit);
    if (S.tur === 'onsinav') AK.veri.onSinav = kayit;
    AK.kaydet();
    var yeniler = AK.rozetKontrol();
    sonucCiz(kayit, yeniler);
  }

  function sonucCiz(k, yeniler) {
    var h = AK.baslik('SONU\u00C7: ' + k.baslik, k.seviye,
      'A\u015Fa\u011F\u0131daki d\u00F6k\u00FCmde her sorunun cevab\u0131, do\u011Frusu ve <b>nedeni</b> var. '
      + 'Bu ekran \u00E7evrimd\u0131\u015F\u0131 \u00E7al\u0131\u015F\u0131r; istedi\u011Fin zaman tekrar bakabilirsin.');
    h += '<div class="akKutular">';
    h += AK.kutu('<h3>SKOR</h3><div class="akBuyuk">' + k.skor + '%</div>'
      + AK.cubuk(k.skor) + '<div class="akKucuk">' + k.dogru + ' do\u011Fru / ' + k.soru + ' soru</div>');
    h += AK.kutu('<h3>SEV\u0130YE</h3><div class="akBuyuk">' + kac(k.seviye) + '</div>'
      + '<div class="akKucuk">s\u00FCre: ' + k.dk + ' dk</div>');
    h += AK.kutu('<h3>R\u00DCTBE / XP</h3><div class="akBuyuk">' + kac(AK.rutbe().ad) + '</div>'
      + '<div class="akKucuk">' + AK.veri.xp + ' XP \u00B7 seri ' + AK.seri() + ' g\u00FCn</div>');
    h += AK.kutu('<h3>KAZANILAN ROZET</h3><div class="akBuyuk">' + yeniler.length + '</div>'
      + '<div class="akKucuk">' + (yeniler.length ? yeniler.map(function (id) {
        var r = AK.ROZET.filter(function (x) { return x.id === id; })[0];
        return r ? r.simge + ' ' + r.ad : id;
      }).join(' \u00B7 ') : 'bu s\u0131navda yeni rozet yok') + '</div>');
    h += '</div>';

    h += '<h3 style="margin:18px 0 8px">KATEGOR\u0130 ANAL\u0130Z\u0130 (zay\u0131ftan g\u00FC\u00E7l\u00FCye)</h3>';
    h += '<div class="akListe"><div class="akSatirUst"><span>#</span><span>KATEGOR\u0130</span>'
      + '<span class="akSag">DO\u011ERU / SORU</span></div>';
    k.kat.forEach(function (x, i) {
      var renk = x.oran >= 70 ? '#00e05a' : (x.oran >= 45 ? '#ffc107' : '#ff5470');
      h += '<div class="akSatir"><span class="akNo">' + (i + 1) + '.</span><span>' + kac(x.ad) + '</span>'
        + '<span class="akSag" style="color:' + renk + '">' + x.dogru + ' / ' + x.soru + ' \u00B7 %' + x.oran + '</span></div>';
    });
    h += '</div>';

    h += '<h3 style="margin:18px 0 8px">SORU SORU D\u00D6K\u00DCM</h3><div class="akListe">';
    S.cevaplar.forEach(function (c, i) {
      h += '<div class="akSatir" style="flex-wrap:wrap"><span class="akNo">' + (i + 1) + '.</span>'
        + '<span style="flex:1 1 260px">' + kac(c.ad) + '</span>'
        + '<span class="akSag" style="color:' + (c.dogru ? '#00e05a' : '#ff5470') + '">'
        + (c.dogru ? '\u2714' : '\u2718 ' + String.fromCharCode(65 + c.dogruIndex) + ') ') + '</span></div>';
      if (!c.dogru) {
        h += '<div class="akSatir" style="border-bottom:1px solid var(--ak-cizgi)"><span class="akNo">\u21B3</span>'
          + '<span style="flex:1 1 100%;color:var(--ak-soluk)">' + kac(c.metin || '') + '</span></div>';
      }
    });
    h += '</div>';
    h += '<div class="akDugSira"><button class="akDug akIkincil" id="akYeniden">\u21BB YEN\u0130DEN SINAV</button>'
      + '<button class="akDug" id="akMenu1">SINAV MERKEZ\u0130NE D\u00D6N</button>'
      + '<button class="akDug akBirincil" id="akSinavGit">\uD83C\uDF93 SERT\u0130F\u0130KA</button></div>';
    ic().innerHTML = h;
    $('#akYeniden').onclick = function () { AK.git(k.tur === 'onsinav' ? 'onsinav' : 'sinav'); };
    $('#akMenu1').onclick = function () { AK.git('sinav'); };
    $('#akSinavGit').onclick = function () { AK.git('sertifika'); };
  }

  /* ============================== ÖN SINAV ================================ */
  AK.modulEkle('onsinav', function () {
    var o = AK.veri.onSinav;
    var h = AK.baslik('\u00D6N SINAV \u2014 SEV\u0130YE TESP\u0130T\u0130', '24 soru',
      'Akademi \u00F6nce seni tan\u0131r. Bu s\u0131nav <b>yapay zek\u00E2 destekli kural motoru</b> ile '
      + '\u00E7al\u0131\u015F\u0131r: do\u011Fru yapt\u0131k\u00E7a sorular zorla\u015F\u0131r, yanl\u0131\u015F yapt\u0131k\u00E7a kolayla\u015F\u0131r. '
      + 'Sonunda ba\u015Flang\u0131\u00E7 seviyen ve zay\u0131f/g\u00FC\u00E7l\u00FC alanlar\u0131n \u00E7\u0131kar.');
    if (o) {
      h += '<div class="akNot akIyi">\u2714 \u00D6n s\u0131nav tamamland\u0131 \u2014 ' +
        AK.trTarih(o.t) + ' \u00B7 skor %' + o.skor + ' \u00B7 seviye <b>' + kac(o.seviye) + '</b>. ' +
        'Yeniden girmek istersen yeni sonu\u00E7 eskisinin yerine ge\u00E7er.</div>';
    }
    h += '<div class="akKutular">';
    h += AK.kutu('<h3>NASIL \u00C7ALI\u015EIR</h3><div class="akKucuk">'
      + '<b>1.</b> 24 soru, s\u00FCre s\u0131n\u0131r\u0131 yok.<br>'
      + '<b>2.</b> Her cevaptan sonra <b>Bana Neden?</b> a\u00E7\u0131klamas\u0131 gelir.<br>'
      + '<b>3.</b> Do\u011Fru cevap +12 XP, yanl\u0131\u015F cevap +3 XP (\u00F6\u011Frenme de say\u0131l\u0131r).<br>'
      + '<b>4.</b> Sonu\u00E7: seviye + kategori analizi + yol haritas\u0131.</div>');
    h += AK.kutu('<h3>SORU HAVUZU</h3><div class="akBuyuk">' + AK.tumSorular().length + '</div>'
      + '<div class="akKucuk">seviyeli soru \u00B7 ' + Object.keys(AK.kategoriHavuzu()).length + ' kategori</div>');
    h += '</div>';
    h += '<div class="akDugSira"><button class="akDug akIkincil" id="akOnBasla">'
      + (o ? '\u21BB YEN\u0130DEN \u00D6N SINAV' : '\u25B6 \u00D6N SINAVI BA\u015ELAT (24 SORU)') + '</button></div>';
    ic().innerHTML = h;
    $('#akOnBasla').onclick = function () {
      var h2 = havuz('');
      if (!h2.length) { AK.not('Soru havuzu bo\u015F \u2014 \u015Fifreli i\u00E7erik a\u00E7\u0131lmam\u0131\u015F olabilir.'); return; }
      sinavBaslat({ tur: 'onsinav', baslik: '\u00D6N SINAV', sorular: adaptifSec(h2, 24), adaptif: true });
    };
  });

  /* ============================ SINAV MERKEZ\u0130 ============================ */
  AK.modulEkle('sinav', function () {
    var h = AK.baslik('SINAV MERKEZ\u0130', 'adaptif',
      'Alan se\u00E7, soru say\u0131s\u0131n\u0131 belirle. Adaptif modda sistem senin seviyene g\u00F6re soru se\u00E7er; '
      + 'her cevaptan sonra <b>Bana Neden?</b> a\u00E7\u0131klamas\u0131 g\u00F6r\u00FCrs\u00FCn.');
    var alanlar = AK.ALAN.filter(function (a) { return havuz(a.id).length > 0; });
    h += '<div class="akKutular">';
    h += AK.kutu('<h3>SINAV AYARLARI</h3>'
      + '<div class="akAlan"><label>Alan</label><select id="akAlan">'
      + '<option value="">T\u00DCM ALANLAR (kar\u0131\u015F\u0131k)</option>'
      + alanlar.map(function (a) {
        return '<option value="' + a.id + '">' + kac(a.ad) + ' (' + havuz(a.id).length + ' soru)</option>';
      }).join('') + '</select></div>'
      + '<div class="akIki">'
      + '<div class="akAlan"><label>Soru say\u0131s\u0131</label><select id="akAdet">'
      + [10, 20, 30, 50].map(function (n) { return '<option value="' + n + '"' + (n === 20 ? ' selected' : '') + '>' + n + ' soru</option>'; }).join('')
      + '</select></div>'
      + '<div class="akAlan"><label>S\u00FCre</label><select id="akSure">'
      + '<option value="0">S\u00FCresiz</option><option value="10">10 dakika</option>'
      + '<option value="20" selected>20 dakika</option><option value="40">40 dakika</option>'
      + '</select></div></div>'
      + '<div class="akAlan"><label>Mod</label><select id="akMod">'
      + '<option value="1" selected>Adaptif (seviyene g\u00F6re)</option>'
      + '<option value="0">Karma (rastgele sabit liste)</option></select></div>'
      + '<div class="akDugSira"><button class="akDug akBirincil" id="akBasla">\u25B6 SINAVA BA\u015ELA</button></div>');
    h += AK.kutu('<h3>GE\u00C7M\u0130\u015E SINAVLAR</h3><div class="akKucuk">toplam <b>' + AK.veri.oturumlar.length
      + '</b> s\u0131nav \u00B7 ortalama <b>%' +
      (AK.veri.oturumlar.length ? Math.round(AK.veri.oturumlar.reduce(function (s, x) { return s + x.skor; }, 0) / AK.veri.oturumlar.length) : 0)
      + '</b></div>'
      + AK.cubuk(AK.veri.oturumlar.length ? Math.round(AK.veri.oturumlar.reduce(function (s, x) { return s + x.skor; }, 0) / AK.veri.oturumlar.length) : 0)
      + '<div class="akKucuk">en iyi: <b>%' + Math.max(0, Math.max.apply(null, AK.veri.oturumlar.map(function (x) { return x.skor; }).concat([0]))) + '</b></div>');
    h += '</div>';
    if (AK.veri.oturumlar.length) {
      h += '<h3 style="margin:16px 0 8px">SINAV KAYITLARI</h3><div class="akListe">'
        + '<div class="akSatirUst"><span>#</span><span>SINAV</span><span class="akSag">SKOR \u00B7 SORU \u00B7 TAR\u0130H</span></div>';
      AK.veri.oturumlar.slice(-12).reverse().forEach(function (o, i) {
        h += '<div class="akSatir"><span class="akNo">' + (i + 1) + '.</span><span style="flex:1 1 200px">'
          + kac(o.baslik || o.tur) + '</span><span class="akSag" style="color:'
          + (o.skor >= 70 ? '#00e05a' : (o.skor >= 45 ? '#ffc107' : '#ff5470')) + '">%' + o.skor
          + ' \u00B7 ' + o.soru + ' soru \u00B7 ' + AK.trTarih(o.t) + '</span></div>';
      });
      h += '</div>';
    }
    ic().innerHTML = h;
    $('#akBasla').onclick = function () {
      var alanId = $('#akAlan').value, adet = parseInt($('#akAdet').value, 10);
      var sure = parseInt($('#akSure').value, 10), adaptif = $('#akMod').value === '1';
      var h2 = havuz(alanId);
      if (!h2.length) { AK.not('Bu alanda soru bulunamad\u0131.', 'kotu'); return; }
      var sorular = adaptif ? adaptifSec(h2, adet) : karistir(h2).slice(0, adet);
      var alanAd = alanId ? AK.ALAN.filter(function (a) { return a.id === alanId; })[0].ad : 'T\u00DCM ALANLAR';
      sinavBaslat({
        tur: 'sinav', baslik: 'SINAV \u00B7 ' + alanAd, alanId: alanId,
        sorular: sorular, adaptif: adaptif, sureDk: sure
      });
    };
  });

  /* ============================ YANLI\u015ELAR DEFTER\u0130 ========================= */
  AK.yanlisListesi = function () {
    var h = [];
    AK.tumSorular().forEach(function (s) {
      var k = AK.veri.soru[s.anahtar];
      if (k && k.y > 0 && !k.d) h.push({ s: s, k: k });
    });
    return h;
  };
  AK.modulEkle('defter', function () {
    var d = AK.yanlisListesi();
    var h = AK.baslik('YANLI\u015ELAR DEFTER\u0130', d.length + ' soru',
      'Yanl\u0131\u015F yapt\u0131\u011F\u0131n her soru buraya d\u00FC\u015Fer. Do\u011Fru \u00E7\u00F6z\u00FCnce defterden d\u00FC\u015Fer ve '
      + '<b>D\u00DCZELTME</b> rozeti ilerler. Sadece yanl\u0131\u015Flara \u00E7al\u0131\u015Fmak, en h\u0131zl\u0131 geli\u015Fme yoludur.');
    if (!d.length) {
      h += '<div class="akNot akIyi">\u2714 \u015Eu an defterde yanl\u0131\u015F soru yok. Bir s\u0131nav \u00E7\u00F6z, yanl\u0131\u015Flar burada birikir.</div>';
    } else {
      h += '<div class="akDugSira"><button class="akDug akBirincil" id="akDefBasla">\u25B6 DEFTER\u0130 \u00C7\u00D6Z ('
        + Math.min(20, d.length) + ' soru)</button></div>';
      h += '<div class="akListe"><div class="akSatirUst"><span>#</span><span>SORU</span>'
        + '<span class="akSag">KATEGOR\u0130 \u00B7 DENEME</span></div>';
      d.slice(0, 60).forEach(function (x, i) {
        h += '<div class="akSatir"><span class="akNo">' + (i + 1) + '.</span>'
          + '<span style="flex:1 1 260px">' + kac(x.s.r.ad) + '</span>'
          + '<span class="akSag">' + kac(x.s.r.grup || '') + ' \u00B7 ' + x.k.y + ' yanl\u0131\u015F</span></div>';
      });
      h += '</div>';
      h += '<div class="akAciklama" style="margin-top:10px">Toplam <b>' + d.length + '</b> soru defterde.</div>';
    }
    ic().innerHTML = h;
    if (d.length) {
      $('#akDefBasla').onclick = function () {
        sinavBaslat({
          tur: 'defter', baslik: 'YANLI\u015ELAR DEFTER\u0130', alanId: '',
          sorular: karistir(d.map(function (x) { return x.s; })).slice(0, 20)
        });
      };
    }
  });

  /* ============================= TEKRAR MOTORU ============================ */
  AK.modulEkle('tekrar', function () {
    var v = AK.vadeliTekrarlar();
    var hazir = [];
    Object.keys(AK.veri.soru).forEach(function (a) {
      var k = AK.veri.soru[a];
      if (k.vade && k.vade <= Date.now()) hazir.push(a);
    });
    var h = AK.baslik('TEKRAR MOTORU', hazir.length + ' vadesi gelen',
      'Aral\u0131kl\u0131 tekrar (\u2192 1, 3, 7, 16, 35, 75 g\u00FCn). Do\u011Fru \u00E7\u00F6zd\u00FCk\u00E7e s\u00FCre uzar, '
      + 'yanl\u0131\u015F yap\u0131nca 1 g\u00FCne d\u00FC\u015Fer \u2014 ezberlemeyi de\u011Fil, hat\u0131rlamay\u0131 sa\u011Flar.');
    h += '<div class="akKutular">' + AK.kutu('<h3>VADES\u0130 GELEN</h3><div class="akBuyuk">' + hazir.length + '</div>'
      + '<div class="akKucuk">\u015Fimdi tekrar edilmeye haz\u0131r soru</div>')
      + AK.kutu('<h3>TAK\u0130PTEK\u0130 SORU</h3><div class="akBuyuk">' + Object.keys(AK.veri.soru).length + '</div>'
        + '<div class="akKucuk">tekrar takvimine kay\u0131tl\u0131</div>') + '</div>';
    if (hazir.length) {
      h += '<div class="akDugSira"><button class="akDug akBirincil" id="akTekrarBasla">\u25B6 TEKRARI BA\u015ELAT ('
        + Math.min(20, hazir.length) + ' soru)</button></div>';
    } else {
      h += '<div class="akNot akUyari">\u015Eu an vadesi gelen tekrar yok. Bir s\u0131nav \u00E7\u00F6zersen tekrar takvimi kurulur.</div>';
    }
    var hepsi = Object.keys(AK.veri.soru).map(function (a) {
      var k = AK.veri.soru[a], s = AK.tumSorular().filter(function (x) { return x.anahtar === a; })[0];
      return { a: a, k: k, s: s };
    }).filter(function (x) { return x.s; }).sort(function (a, b) { return (a.k.vade || 0) - (b.k.vade || 0); });
    if (hepsi.length) {
      h += '<h3 style="margin:16px 0 8px">TEKRAR TAKV\u0130M\u0130</h3><div class="akListe">'
        + '<div class="akSatirUst"><span>#</span><span>SORU</span><span class="akSag">KADEME \u00B7 SIRA</span></div>';
      hepsi.slice(0, 40).forEach(function (x, i) {
        var gun = Math.round((x.k.vade - Date.now()) / 864e5);
        h += '<div class="akSatir"><span class="akNo">' + (i + 1) + '.</span>'
          + '<span style="flex:1 1 240px">' + kac(x.s.r.ad) + '</span>'
          + '<span class="akSag">kademe ' + (x.k.k || 0) + ' \u00B7 '
          + (gun <= 0 ? '<b style="color:#00e05a">\u015Fimdi</b>' : gun + ' g\u00FCn sonra') + '</span></div>';
      });
      h += '</div>';
    }
    ic().innerHTML = h;
    if (hazir.length) {
      $('#akTekrarBasla').onclick = function () {
        var sorular = AK.tumSorular().filter(function (s) { return hazir.indexOf(s.anahtar) >= 0; });
        sinavBaslat({
          tur: 'tekrar', baslik: 'TEKRAR \u00C7ALI\u015EMASI', alanId: '',
          sorular: karistir(sorular).slice(0, 20)
        });
      };
    }
  });

  /* =============================== SERTİFİKA ============================== */
  AK.sertifikaUygun = function () {
    var v = AK.veri;
    var sartlar = [];
    sartlar.push({ ad: 'Siber kimlik kart\u0131 olu\u015Fturuldu', ok: !!v.profil });
    sartlar.push({ ad: '\u00D6n s\u0131nav tamamland\u0131', ok: !!v.onSinav });
    var gecerli = v.oturumlar.filter(function (o) { return o.soru >= 10 && o.skor >= 70; });
    sartlar.push({ ad: 'En az 10 soruluk s\u0131navdan %70+ (ba\u015Far\u0131l\u0131 s\u0131nav: ' + gecerli.length + ')', ok: gecerli.length > 0 });
    sartlar.push({ ad: 'En az 50 soru \u00E7\u00F6z\u00FCld\u00FC (mevcut: ' + AK.toplamSoru() + ')', ok: AK.toplamSoru() >= 50 });
    return { sartlar: sartlar, uygun: sartlar.every(function (s) { return s.ok; }), gecerli: gecerli };
  };

  function sertifikaNo(alanId) {
    var v = AK.veri, s = (v.profil && v.profil.no) ? v.profil.no : 'SB-0000-000';
    var harf = { network: 'NET', linux: 'LNX', python: 'PY', web: 'WEB', blueteam: 'SOC', kripto: 'CRY',
      adli: 'FRN', osint: 'OSN', bulut: 'CLD', ai: 'AIS', ctf: 'CTF', kariyer: 'KAR' };
    return 'USA-' + (harf[alanId] || 'GEN') + '-' + s.replace(/^SB-/, '') + '-' + String(v.sertifikalar.length + 1).padStart(3, '0');
  }

  AK.modulEkle('sertifika', function () {
    var u = AK.sertifikaUygun();
    var h = AK.baslik('SERT\u0130F\u0130KA MERKEZ\u0130', 'kazan \u00B7 indir',
      'Sertifika <b>ger\u00E7ek ba\u015Far\u0131 \u015Fartlar\u0131na</b> ba\u011Fl\u0131d\u0131r: uydurma sertifika yok. '
      + 'Kazand\u0131\u011F\u0131nda PNG olarak indirilir, dijital kasada saklan\u0131r, \u00FCzerinde do\u011Frulama kodu bulunur.');
    h += '<div class="akKutular">';
    h += AK.kutu('<h3>UYGUNLUK \u015EARTLARI</h3>'
      + '<div class="akListe" style="margin-top:6px">'
      + u.sartlar.map(function (s, i) {
        return '<div class="akSatir"><span class="akNo">' + (i + 1) + '.</span>'
          + '<span style="flex:1 1 200px">' + kac(s.ad) + '</span>'
          + '<span class="akSag" style="color:' + (s.ok ? '#00e05a' : '#ff5470') + '">' + (s.ok ? '\u2714' : '\u2718') + '</span></div>';
      }).join('') + '</div>');
    h += AK.kutu('<h3>DURUM</h3><div class="akBuyuk" style="color:' + (u.uygun ? '#00e05a' : '#ffc107') + '">'
      + (u.uygun ? 'HAZIR' : 'EKS\u0130K') + '</div>'
      + '<div class="akKucuk">kazan\u0131lan sertifika: <b>' + AK.veri.sertifikalar.length + '</b></div>');
    h += '</div>';
    var alanlar = AK.ALAN.filter(function (a) { return havuz(a.id).length >= 10; });
    h += '<div class="akAlan" style="margin-top:14px"><label>Program</label><select id="akSertAlan">'
      + '<option value="genel">GENEL S\u0130BER G\u00DCVENL\u0130K AKADEM\u0130S\u0130</option>'
      + alanlar.map(function (a) { return '<option value="' + a.id + '">' + kac(a.ad) + ' SERT\u0130F\u0130KASI</option>'; }).join('')
      + '</select></div>';
    h += '<div class="akDugSira"><button class="akDug akBirincil" id="akSertUret">\uD83C\uDF93 SERT\u0130F\u0130KA \u00DC\u0130RET</button>'
      + '<button class="akDug" id="akSertKasa">\uD83D\uDDC4\uFE0F D\u0130J\u0130TAL KASA</button></div>';
    h += '<div id="akSertOnizleme"></div>';
    h += '<div class="akNot akUyari" style="margin-top:12px"><b>QR\u2019l\u0131 online do\u011Frulama</b> i\u00E7in sunucu gerekir '
      + '(cPanel/PHP) \u2014 o i\u015F <b>00-YAPILAMAYANLAR-KALI-VE-SUNUCU.txt</b> defterinde B8 numaras\u0131yla kay\u0131tl\u0131. '
      + '\u015Eimdilik her sertifikaya <b>benzersiz do\u011Frulama kodu</b> g\u00F6m\u00FCl\u00FCr; kod, sertifika numaras\u0131 ve ad ile birlikte do\u011Frulan\u0131r.</div>';
    ic().innerHTML = h;
    $('#akSertUret').onclick = function () {
      if (!u.uygun) { AK.not('\u015Eartlar tamamlanmadan sertifika \u00FCretilmez. Eksikleri yukar\u0131da \u2718 ile g\u00F6rebilirsin.', 'kotu'); return; }
      sertifikaUret($('#akSertAlan').value);
    };
    $('#akSertKasa').onclick = function () { AK.git('kasa'); };
  });

  function sertifikaUret(alanId) {
    var v = AK.veri, alan = AK.ALAN.filter(function (a) { return a.id === alanId; })[0];
    var program = alan ? alan.ad + ' SERT\u0130F\u0130KASI' : 'GENEL S\u0130BER G\u00DCVENL\u0130K AKADEM\u0130S\u0130';
    var gecerli = v.oturumlar.filter(function (o) { return o.soru >= 10; });
    var enIyi = gecerli.slice().sort(function (a, b) { return b.skor - a.skor; })[0] || { skor: 0, soru: 0 };
    var no = sertifikaNo(alanId);
    var kodHam = [v.profil.ad, no, AK.gun(), enIyi.skor].join('|');
    AK.sha256(kodHam).then(function (hash) {
      var kod = (hash || '').slice(0, 4).toUpperCase() + '-' + (hash || '').slice(4, 8).toUpperCase()
        + '-' + (hash || '').slice(8, 12).toUpperCase();
      var kayit = {
        no: no, kod: kod, program: program, alanId: alanId, t: Date.now(),
        skor: enIyi.skor, seviye: seviyeAdi(enIyi.skor), ad: v.profil.ad, unvan: v.profil.unvan || '',
        rutbe: AK.rutbe().ad, kulup: kodHam
      };
      AK.veri.sertifikalar.push(kayit);
      AK.xpEkle(150);
      AK.kaydet();
      AK.rozetKontrol();
      sertifikaTekCiz(kayit);
    });
  }

  function sertifikaTekCiz(k) {
    var onizleme = document.getElementById('akSertOnizleme');
    if (!onizleme) { AK.git('kasa'); return; }
    onizleme.innerHTML = '<div class="akNot akIyi">\u2714 Sertifika \u00FCretildi: <b>' + kac(k.no)
      + '</b> \u00B7 do\u011Frulama kodu <b>' + kac(k.kod) + '</b></div>'
      + '<canvas class="akSertifika" id="akSertTuval" width="1800" height="1273"></canvas>'
      + '<div class="akDugSira"><button class="akDug akBirincil" id="akSertIndir">\u2B07 PNG \u0130ND\u0130R</button>'
      + '<button class="akDug" id="akSertYaz">\uD83D\uDDA8 YAZDIR</button>'
      + '<button class="akDug" id="akSertKasa2">\uD83D\uDDC4\uFE0F KASAYA G\u0130T</button></div>';
    sertifikaCiz($('#akSertTuval'), k);
    $('#akSertIndir').onclick = function () { indir($('#akSertTuval'), k.no + '.png'); };
    $('#akSertYaz').onclick = function () { yazdir($('#akSertTuval'), k.no); };
    $('#akSertKasa2').onclick = function () { AK.git('kasa'); };
  }

  function sertifikaCiz(c, k) {
    var g = c.getContext('2d'), G = c.width, Y = c.height;
    /* zemin */
    var grd = g.createLinearGradient(0, 0, G, Y);
    grd.addColorStop(0, '#fdfaf1'); grd.addColorStop(.5, '#f7f1e0'); grd.addColorStop(1, '#fbf7ec');
    g.fillStyle = grd; g.fillRect(0, 0, G, Y);
    g.strokeStyle = '#c9a227'; g.lineWidth = 10; g.strokeRect(36, 36, G - 72, Y - 72);
    g.strokeStyle = '#0d2233'; g.lineWidth = 2; g.strokeRect(58, 58, G - 116, Y - 116);
    /* köşe süsleri */
    g.fillStyle = '#c9a227';
    [[36, 36], [G - 176, 36], [36, Y - 176], [G - 176, Y - 176]].forEach(function (p) {
      g.fillRect(p[0], p[1], 140, 12); g.fillRect(p[0], p[1], 12, 140);
    });
    g.textAlign = 'center';
    /* başlık */
    g.fillStyle = '#0d2233';
    g.font = '700 44px "Segoe UI", Tahoma, sans-serif';
    g.fillText('\u00DCSTAD S\u0130BER AKADEM\u0130', G / 2, 168);
    g.font = '600 24px "Segoe UI", Tahoma, sans-serif';
    g.fillStyle = '#7a6a3a';
    g.fillText('Bilgini \u00D6l\u00E7  \u2022  Kendini Geli\u015Ftir  \u2022  Siber D\u00FCnyada Yolunu \u00C7iz', G / 2, 214);
    g.fillStyle = '#0d2233';
    g.font = '700 76px Georgia, "Times New Roman", serif';
    g.fillText('BA\u015EARI SERT\u0130F\u0130KASI', G / 2, 320);
    g.font = '400 26px Georgia, serif'; g.fillStyle = '#5b4a24';
    g.fillText('Bu belge a\u015Fa\u011F\u0131da ad\u0131 yaz\u0131l\u0131 ki\u015Finin', G / 2, 392);
    /* ad */
    g.fillStyle = '#0b1a2a';
    g.font = '700 82px Georgia, "Times New Roman", serif';
    g.fillText((k.ad || '').toUpperCase(), G / 2, 500);
    g.strokeStyle = '#c9a227'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(G / 2 - 420, 526); g.lineTo(G / 2 + 420, 526); g.stroke();
    g.font = '400 26px Georgia, serif'; g.fillStyle = '#5b4a24';
    g.fillText(k.unvan || 'Siber G\u00FCvenlik \u00D6\u011Frencisi', G / 2, 566);
    g.fillText('program\u0131n\u0131 ba\u015Far\u0131yla tamamlayarak bu sertifikay\u0131 kazanm\u0131\u015Ft\u0131r.', G / 2, 616);
    /* program */
    g.fillStyle = '#0d2233';
    g.font = '700 40px "Segoe UI", Tahoma, sans-serif';
    g.fillText(k.program, G / 2, 692);
    /* skor kutuları */
    var kutular = [
      ['SKOR', '%' + k.skor], ['SEV\u0130YE', k.seviye], ['R\u00DCTBE', k.rutbe]
    ];
    var bw = 260, bh = 108, x0 = G / 2 - (bw * 3 + 40 * 2) / 2;
    kutular.forEach(function (b, i) {
      var x = x0 + i * (bw + 40);
      g.fillStyle = 'rgba(13,34,51,.05)'; g.fillRect(x, 736, bw, bh);
      g.strokeStyle = '#c9a227'; g.lineWidth = 2; g.strokeRect(x, 736, bw, bh);
      g.fillStyle = '#7a6a3a'; g.font = '600 20px "Segoe UI", sans-serif';
      g.fillText(b[0], x + bw / 2, 768);
      g.fillStyle = '#0b1a2a'; g.font = '700 34px "Segoe UI", sans-serif';
      g.fillText(b[1], x + bw / 2, 816);
    });
    /* sertifika no + doğrulama kodu */
    g.textAlign = 'left';
    g.fillStyle = '#0d2233'; g.font = '600 24px Consolas, monospace';
    g.fillText('SERT\u0130F\u0130KA NO : ' + k.no, 130, 950);
    g.fillText('DO\u011ERULAMA KODU : ' + k.kod, 130, 992);
    g.fillText('TAR\u0130H : ' + AK.trTarih(k.t), 130, 1034);
    /* doğrulama matrisi (kağıt üzerinde desen; online QR doğrulama sunucu işidir) */
    var m = 18, mb = 12, mx = G - 130 - m * mb, my = 900;
    g.fillStyle = '#ffffff'; g.fillRect(mx - 14, my - 14, m * mb + 28, m * mb + 28);
    g.strokeStyle = '#0d2233'; g.lineWidth = 2; g.strokeRect(mx - 14, my - 14, m * mb + 28, m * mb + 28);
    var tohum = 0; for (var i = 0; i < k.kod.length; i++) tohum = (tohum * 31 + k.kod.charCodeAt(i)) >>> 0;
    for (var yy = 0; yy < mb; yy++) {
      for (var xx = 0; xx < mb; xx++) {
        tohum = (tohum * 1103515245 + 12345) >>> 0;
        if ((tohum >> 16) & 1) { g.fillStyle = '#0d2233'; g.fillRect(mx + xx * m, my + yy * m, m - 1, m - 1); }
      }
    }
    g.fillStyle = '#5b4a24'; g.font = '600 18px "Segoe UI", sans-serif'; g.textAlign = 'center';
    g.fillText('DO\u011ERULAMA MATR\u0130S\u0130', mx + m * mb / 2, my + m * mb + 44);
    /* imza */
    g.strokeStyle = '#0d2233'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(G - 620, 1130); g.lineTo(G - 180, 1130); g.stroke();
    g.textAlign = 'center'; g.fillStyle = '#0b1a2a';
    g.font = '700 30px Georgia, serif';
    g.fillText('\u00DCSTAD KENAN KUZUCU', G - 400, 1116);
    g.font = '400 20px "Segoe UI", sans-serif'; g.fillStyle = '#5b4a24';
    g.fillText('Akademi Kurucusu ve E\u011Fitmeni', G - 400, 1160);
    /* madalyon */
    var img = new Image();
    img.onload = function () {
      g.save(); g.beginPath(); g.arc(230, 1112, 62, 0, Math.PI * 2); g.closePath(); g.clip();
      g.drawImage(img, 168, 1050, 124, 124); g.restore();
      g.beginPath(); g.arc(230, 1112, 62, 0, Math.PI * 2); g.strokeStyle = '#c9a227'; g.lineWidth = 4; g.stroke();
      if (AK._sertSon) AK._sertSon();
    };
    img.onerror = function () { if (AK._sertSon) AK._sertSon(); };
    img.src = 'foto/ustad-kenan.jpg';
    AK._sertSon = function () {
      var e = document.getElementById('akSertTuval');
      if (e && e.getAttribute('data-hazir') !== '1') {
        e.setAttribute('data-hazir', '1');
      }
    };
  }

  function indir(canvas, ad) {
    try {
      var a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = ad;
      document.body.appendChild(a); a.click(); a.remove();
      AK.not('\u2714 \u0130ndirildi: ' + ad, 'iyi');
    } catch (e) { AK.not('\u0130ndirme ba\u015Far\u0131s\u0131z: ' + e.message, 'kotu'); }
  }
  function yazdir(canvas, ad) {
    var w = window.open('', '_blank');
    if (!w) { AK.not('A\u00E7\u0131l\u0131r pencere engellendi.', 'kotu'); return; }
    w.document.write('<html><head><title>' + kac(ad) + '</title></head><body style="margin:0">'
      + '<img src="' + canvas.toDataURL('image/png') + '" style="width:100%">'
      + '<script>window.onload=function(){setTimeout(function(){window.print();},400);}<\/script>'
      + '</body></html>');
    w.document.close();
  }

  /* ============================= DİJİTAL KASA ============================= */
  AK.modulEkle('kasa', function () {
    var v = AK.veri;
    var h = AK.baslik('D\u0130J\u0130TAL KASA & TRANSKR\u0130PT', v.sertifikalar.length + ' belge',
      'Kazand\u0131\u011F\u0131n b\u00FCt\u00FCn belgeler, rozetler ve transkriptin burada. Hepsini \u00E7evrimd\u0131\u015F\u0131 '
      + 'g\u00F6rebilir, PNG indirebilir veya yazd\u0131rabilirsin.');
    h += '<div class="akKutular">';
    h += AK.kutu('<h3>SERT\u0130F\u0130KA</h3><div class="akBuyuk">' + v.sertifikalar.length + '</div>'
      + '<div class="akKucuk">kazan\u0131lan belge</div>');
    h += AK.kutu('<h3>ROZET</h3><div class="akBuyuk">' + Object.keys(v.rozetler).length + ' / ' + AK.ROZET.length
      + '</div>' + AK.cubuk(Object.keys(v.rozetler).length / AK.ROZET.length * 100)
      + '<div class="akKucuk">kazan\u0131lan / toplam</div>');
    h += AK.kutu('<h3>XP / R\u00DCTBE</h3><div class="akBuyuk">' + v.xp + '</div>'
      + '<div class="akKucuk">' + kac(AK.rutbe().ad) + ' \u00B7 seviye ' + AK.seviye().seviye + '</div>');
    h += '</div>';
    if (!v.sertifikalar.length) {
      h += '<div class="akNot akUyari">Hen\u00FCz sertifika yok. <b>S\u0130NAV MERKEZ\u0130</b> \u2192 %70+ al, sonra '
        + '<b>SERT\u0130F\u0130KA</b> mod\u00FCl\u00FCnden \u00FCret.</div>';
    } else {
      h += '<h3 style="margin:16px 0 8px">BELGE AR\u015E\u0130V\u0130</h3><div class="akListe">'
        + '<div class="akSatirUst"><span>#</span><span>PROGRAM</span><span class="akSag">NO \u00B7 KOD \u00B7 TAR\u0130H</span></div>';
      v.sertifikalar.slice().reverse().forEach(function (s, i) {
        h += '<div class="akSatir"><span class="akNo">' + (i + 1) + '.</span>'
          + '<span style="flex:1 1 240px">' + kac(s.program) + '</span>'
          + '<span class="akSag">' + kac(s.no) + ' \u00B7 ' + kac(s.kod) + ' \u00B7 ' + AK.trTarih(s.t) + '</span></div>';
      });
      h += '</div>';
      h += '<div class="akDugSira"><button class="akDug akIkincil" id="akKasaCiz">\uD83D\uDDA8 \u0130LK BELGEY\u0130 \u00C7\u0130Z</button>'
        + '<button class="akDug" id="akTranskript">\uD83D\uDCC4 TRANSKR\u0130PT OLU\u015ETUR</button></div>';
      h += '<div id="akKasaTuvalAlan"></div>';
    }
    /* transkript tablosu */
    var satirlar = AK.ALAN.map(function (a) {
      var m = AK.skillMatris().filter(function (x) { return x.id === a.id; })[0];
      return { ad: a.ad, soru: m.soru, dogru: m.dogru, oran: m.oran };
    });
    h += '<h3 style="margin:18px 0 8px">TRANSKR\u0130PT \u2014 ALAN D\u00D6K\u00DCM\u00DC</h3>';
    h += '<div class="akListe"><div class="akSatirUst"><span>#</span><span>ALAN</span>'
      + '<span class="akSag">DO\u011ERU / SORU \u00B7 USTALIK</span></div>';
    satirlar.forEach(function (s, i) {
      h += '<div class="akSatir"><span class="akNo">' + (i + 1) + '.</span><span>' + kac(s.ad) + '</span>'
        + '<span class="akSag">' + s.dogru + ' / ' + s.soru + ' \u00B7 %' + s.oran + '</span></div>';
    });
    h += '</div>';
    h += '<div class="akAciklama">Belge say\u0131s\u0131: <b>' + v.sertifikalar.length + '</b> \u00B7 '
      + 'rozet: <b>' + Object.keys(v.rozetler).length + '</b> \u00B7 toplam \u00E7\u00F6z\u00FClen soru: <b>'
      + AK.toplamSoru() + '</b> \u00B7 \u00E7al\u0131\u015Fma serisi: <b>' + AK.seri() + ' g\u00FCn</b></div>';
    ic().innerHTML = h;
    if (v.sertifikalar.length) {
      $('#akKasaCiz').onclick = function () {
        var s = v.sertifikalar[v.sertifikalar.length - 1];
        var al = document.getElementById('akKasaTuvalAlan');
        al.innerHTML = '<canvas class="akSertifika" id="akKasaTuval" width="1800" height="1273"></canvas>'
          + '<div class="akDugSira"><button class="akDug akBirincil" id="akKasaIndir">\u2B07 PNG \u0130ND\u0130R</button></div>';
        sertifikaCiz($('#akKasaTuval'), s);
        $('#akKasaIndir').onclick = function () { indir($('#akKasaTuval'), s.no + '.png'); };
      };
      $('#akTranskript').onclick = function () { transkriptYazdir(); };
    }
  });

  function transkriptYazdir() {
    var v = AK.veri;
    var w = window.open('', '_blank');
    if (!w) { AK.not('A\u00E7\u0131l\u0131r pencere engellendi.', 'kotu'); return; }
    var m = AK.skillMatris();
    var h = '<html><head><meta charset="utf-8"><title>Transkript \u2014 ' + kac(v.profil ? v.profil.ad : '') + '</title>'
      + '<style>body{font-family:Georgia,serif;padding:32px;color:#0d2233}'
      + 'h1{font-size:22px;letter-spacing:.1em;margin:0 0 4px}h2{font-size:13px;color:#7a6a3a;margin:0 0 18px;font-weight:400;letter-spacing:.2em}'
      + 'table{border-collapse:collapse;width:100%;font-size:13px}th,td{border:1px solid #c9a227;padding:7px 9px;text-align:left}'
      + 'th{background:#f7f1e0}tr:nth-child(even) td{background:#fdfaf1}.no{font-family:Consolas,monospace;width:36px}'
      + '.ust{border-top:6px double #c9a227;padding-top:10px;margin-top:26px;font-size:12px;color:#5b4a24}</style></head><body>';
    h += '<h1>\u00DCSTAD S\u0130BER AKADEM\u0130 \u2014 \u00D6\u011ERENC\u0130 TRANSKR\u0130PT\u0130</h1>';
    h += '<h2>\u00d6\u011frenci: ' + kac(v.profil ? v.profil.ad : '\u2014') + ' \u00B7 No: '
      + kac(v.profil ? v.profil.no : '\u2014') + ' \u00B7 Tarih: ' + AK.trTarih() + ' \u00B7 R\u00FCtbe: ' + kac(AK.rutbe().ad) + '</h2>';
    h += '<table><tr><th class="no">#</th><th>Alan</th><th>Soru</th><th>Do\u011Fru</th><th>Ustal\u0131k</th></tr>';
    m.forEach(function (a, i) {
      h += '<tr><td class="no">' + (i + 1) + '.</td><td>' + kac(a.ad) + '</td><td>' + a.soru + '</td><td>'
        + a.dogru + '</td><td>%' + a.oran + '</td></tr>';
    });
    h += '</table>';
    if (v.sertifikalar.length) {
      h += '<h2 style="margin-top:22px">KAZANILAN BELGELER</h2><table><tr><th class="no">#</th><th>Program</th><th>Belge No</th><th>Do\u011Frulama Kodu</th><th>Tarih</th></tr>';
      v.sertifikalar.forEach(function (s, i) {
        h += '<tr><td class="no">' + (i + 1) + '.</td><td>' + kac(s.program) + '</td><td>' + kac(s.no) + '</td><td>'
          + kac(s.kod) + '</td><td>' + AK.trTarih(s.t) + '</td></tr>';
      });
      h += '</table>';
    }
    h += '<h2 style="margin-top:22px">ROZETLER</h2><table><tr><th class="no">#</th><th>Rozet</th><th>Kazan\u0131ld\u0131</th></tr>';
    AK.ROZET.forEach(function (r, i) {
      h += '<tr><td class="no">' + (i + 1) + '.</td><td>' + kac(r.ad) + '</td><td>'
        + (v.rozetler[r.id] ? AK.trTarih(v.rozetler[r.id]) : '\u2014') + '</td></tr>';
    });
    h += '</table>';
    h += '<div class="ust">\u00DCSTAD KENAN KUZUCU \u00B7 \u00DCSTAD S\u0130BER AKADEM\u0130 \u00B7 '
      + 'Bilgini \u00D6l\u00E7 \u2022 Kendini Geli\u015Ftir \u2022 Siber D\u00FCnyada Yolunu \u00C7iz</div>';
    h += '<script>window.onload=function(){setTimeout(function(){window.print();},400);}<\/script></body></html>';
    w.document.write(h); w.document.close();
  }

  /* ============================= PORTFÖY & CV ============================= */
  AK.modulEkle('portfoy', function () {
    var v = AK.veri;
    if (!v.profil) {
      ic().innerHTML = AK.baslik('PORTF\u00D6Y & CV') +
        '<div class="akNot akUyari">\u00D6nce <b>S\u0130BER K\u0130ML\u0130K</b> mod\u00FCl\u00FCnden kimlik kart\u0131n\u0131 olu\u015Ftur.</div>';
      return;
    }
    var m = AK.skillMatris();
    var h = AK.baslik('CYBER PORTF\u00D6Y & CV', kac(v.profil.ad));
    h += '<div class="akKutular">';
    h += AK.kutu('<h3>K\u0130ML\u0130K</h3><div class="akKucuk">ad soyad</div><div style="font-size:19px;font-weight:700">'
      + kac(v.profil.ad) + '</div><div class="akKucuk">' + kac(v.profil.unvan || '') + ' \u00B7 '
      + kac(v.profil.no) + '</div>');
    h += AK.kutu('<h3>HEDEF</h3><div style="font-size:17px;font-weight:700">' + kac(v.profil.hedef || '\u2014')
      + '</div><div class="akKucuk">ba\u015Flang\u0131\u00E7 seviyesi: ' + kac(v.onSinav ? v.onSinav.seviye : '\u2014')
      + ' \u00B7 \u015Fimdi: ' + kac(AK.seviye().seviye) + '. seviye / ' + kac(AK.rutbe().ad) + '</div>');
    h += AK.kutu('<h3>SAYILAR</h3><div class="akKucuk">'
      + '\u00E7\u00F6z\u00FClen soru: <b>' + AK.toplamSoru() + '</b><br>'
      + 'do\u011Fru: <b>' + AK.dogruSoru() + '</b><br>'
      + 's\u0131nav: <b>' + v.oturumlar.length + '</b><br>'
      + 'sertifika: <b>' + v.sertifikalar.length + '</b><br>'
      + 'rozet: <b>' + Object.keys(v.rozetler).length + '</b></div>');
    h += '</div>';
    h += '<h3 style="margin:16px 0 8px">BECER\u0130 PROF\u0130L\u0130</h3><div class="akListe">';
    m.forEach(function (a, i) {
      h += '<div class="akSatir"><span class="akNo">' + (i + 1) + '.</span>'
        + '<span style="flex:0 0 190px">' + kac(a.ad) + '</span>'
        + '<span style="flex:1 1 120px">' + AK.cubuk(a.oran, 'linear-gradient(90deg,#37e0ff,#00e05a)') + '</span>'
        + '<span class="akSag">%' + a.oran + '</span></div>';
    });
    h += '</div>';
    h += '<div class="akDugSira"><button class="akDug akIkincil" id="akCvYaz">\uD83D\uDDA8 CV OLARAK YAZDIR</button>'
      + '<button class="akDug" id="akCvIndir">\u2B07 CV METN\u0130N\u0130 \u0130ND\u0130R (.txt)</button></div>';
    ic().innerHTML = h;
    $('#akCvYaz').onclick = cvYazdir;
    $('#akCvIndir').onclick = function () {
      var m2 = AK.skillMatris();
      var t = '\u00DCSTAD S\u0130BER AKADEM\u0130 \u2014 CYBER PORTF\u00D6Y / CV\n'
        + '================================================\n'
        + 'Ad Soyad      : ' + v.profil.ad + '\n'
        + 'Unvan         : ' + (v.profil.unvan || '') + '\n'
        + '\u00D6\u011Frenci No    : ' + v.profil.no + '\n'
        + 'Kariyer Hedefi: ' + (v.profil.hedef || '') + '\n'
        + 'R\u00FCtbe / Seviye: ' + AK.rutbe().ad + ' \u00B7 seviye ' + AK.seviye().seviye + ' \u00B7 ' + v.xp + ' XP\n'
        + '\u00D6n s\u0131nav seviyesi : ' + (v.onSinav ? v.onSinav.seviye + ' (%' + v.onSinav.skor + ')' : '\u2014') + '\n'
        + '------------------------------------------------\nBECER\u0130LER\n';
      m2.forEach(function (a, i) {
        t += '  ' + (i + 1) + '. ' + a.ad.padEnd(24, ' ') + ' %' + a.oran + '  (' + a.dogru + '/' + a.soru + ' soru)\n';
      });
      t += '------------------------------------------------\nBELGELER\n';
      v.sertifikalar.forEach(function (s, i) {
        t += '  ' + (i + 1) + '. ' + s.program + ' \u2014 ' + s.no + ' \u2014 kod: ' + s.kod + ' \u2014 ' + AK.trTarih(s.t) + '\n';
      });
      t += '------------------------------------------------\nROZETLER\n';
      AK.ROZET.forEach(function (r, i) {
        t += '  ' + (i + 1) + '. ' + (v.rozetler[r.id] ? '[\u2714] ' : '[ ] ') + r.ad + ' \u2014 ' + r.kosul + '\n';
      });
      t += '------------------------------------------------\n\u00DCSTAD KENAN KUZUCU \u00B7 \u00DCSTAD S\u0130BER AKADEM\u0130\n';
      var b = new Blob([t], { type: 'text/plain;charset=utf-8' });
      var a2 = document.createElement('a');
      a2.href = URL.createObjectURL(b); a2.download = 'CV-' + v.profil.no + '.txt';
      document.body.appendChild(a2); a2.click(); a2.remove();
      AK.not('\u2714 CV metni indirildi.', 'iyi');
    };
  });

  function cvYazdir() {
    var v = AK.veri, m = AK.skillMatris();
    var w = window.open('', '_blank');
    if (!w) { AK.not('A\u00E7\u0131l\u0131r pencere engellendi.', 'kotu'); return; }
    var h = '<html><head><meta charset="utf-8"><title>CV \u2014 ' + kac(v.profil.ad) + '</title><style>'
      + 'body{font-family:"Segoe UI",Arial,sans-serif;color:#12212f;padding:34px;max-width:820px;margin:auto}'
      + 'h1{margin:0;font-size:26px;letter-spacing:.04em}h2{font-size:13px;letter-spacing:.18em;color:#6b5a24;'
      + 'text-transform:uppercase;border-bottom:2px solid #c9a227;padding-bottom:4px;margin:22px 0 10px}'
      + '.ust{font-size:13px;color:#5b4a24}table{border-collapse:collapse;width:100%;font-size:13px}'
      + 'th,td{border-bottom:1px solid #ddd;padding:6px 4px;text-align:left}.no{width:34px;font-family:Consolas,monospace}'
      + '.bar{height:9px;background:#eee;border-radius:9px;overflow:hidden}.bar i{display:block;height:100%;background:#0b8f43}'
      + '</style></head><body>';
    h += '<h1>' + kac(v.profil.ad) + '</h1><div class="ust">' + kac(v.profil.unvan || 'Siber G\u00FCvenlik \u00D6\u011Frencisi')
      + ' \u00B7 \u00D6\u011Frenci No: ' + kac(v.profil.no) + ' \u00B7 ' + kac(AK.rutbe().ad) + ' \u00B7 ' + v.xp + ' XP</div>';
    h += '<h2>Kariyer Hedefi</h2><div>' + kac(v.profil.hedef || '\u2014') + '</div>';
    h += '<h2>Beceriler</h2><table>';
    m.forEach(function (a, i) {
      h += '<tr><td class="no">' + (i + 1) + '.</td><td style="width:210px">' + kac(a.ad) + '</td>'
        + '<td><div class="bar"><i style="width:' + a.oran + '%"></i></div></td><td style="width:70px">%' + a.oran + '</td></tr>';
    });
    h += '</table>';
    h += '<h2>Belgeler</h2><table><tr><th class="no">#</th><th>Program</th><th>Belge No</th><th>Kod</th><th>Tarih</th></tr>';
    v.sertifikalar.forEach(function (s, i) {
      h += '<tr><td class="no">' + (i + 1) + '.</td><td>' + kac(s.program) + '</td><td>' + kac(s.no)
        + '</td><td>' + kac(s.kod) + '</td><td>' + AK.trTarih(s.t) + '</td></tr>';
    });
    h += '</table>';
    h += '<h2>Rozetler</h2><table><tr><th class="no">#</th><th>Rozet</th><th>Durum</th></tr>';
    AK.ROZET.forEach(function (r, i) {
      h += '<tr><td class="no">' + (i + 1) + '.</td><td>' + kac(r.ad) + '</td><td>'
        + (v.rozetler[r.id] ? '\u2714 ' + AK.trTarih(v.rozetler[r.id]) : '\u2014') + '</td></tr>';
    });
    h += '</table>';
    h += '<h2>\u0130statistik</h2><div>\u00C7\u00F6z\u00FClen soru: <b>' + AK.toplamSoru()
      + '</b> \u00B7 do\u011Fru: <b>' + AK.dogruSoru() + '</b> \u00B7 s\u0131nav: <b>' + v.oturumlar.length
      + '</b> \u00B7 \u00E7al\u0131\u015Fma serisi: <b>' + AK.seri() + ' g\u00FCn</b></div>';
    h += '<h2>Do\u011Frulama</h2><div class="ust">Bu portf\u00F6y \u00DCSTAD S\u0130BER AKADEM\u0130 i\u00E7inde '
      + '\u00E7evrimd\u0131\u015F\u0131 \u00FCretilmi\u015Ftir. Belge do\u011Frulama kodlar\u0131 yukar\u0131daki tabloda yer al\u0131r.</div>';
    h += '<script>window.onload=function(){setTimeout(function(){window.print();},400);}<\/script></body></html>';
    w.document.write(h); w.document.close();
  }

  /* küçük bildirim */
  AK.not = function (metin, tur) {
    var d = document.createElement('div');
    d.className = 'akNot ' + (tur === 'iyi' ? 'akIyi' : tur === 'kotu' ? 'akKotu' : 'akUyari');
    d.textContent = metin;
    d.style.position = 'fixed'; d.style.right = '18px'; d.style.bottom = '18px'; d.style.zIndex = 9700;
    d.style.maxWidth = '380px'; d.style.boxShadow = '0 14px 40px rgba(0,0,0,.45)';
    document.body.appendChild(d);
    setTimeout(function () { d.remove(); }, 4200);
  };
})();
