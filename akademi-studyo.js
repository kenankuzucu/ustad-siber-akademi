/* ==========================================================================
   ÜSTAD AKADEMİ — 3D STÜDYO (akademi-studyo.js)
   Eğitim sitesinin (USTAD-SIBER-EGITIM) 3D stüdyosunun BİREBİR kopyası.
   26 sahne · 14 şablon · 12 renk teması · animasyon hızı/yoğunluk/parlaklık/
   kamera takibi/otomatik geçiş · SOLUK · 3D AÇ/KAPAT · RASTGELE.
   S3 motoruna (sahne3d.js) bağlanır; kendi localStorage anahtarları (ak_studyo_*).
   ========================================================================== */
window.AKSTUDYO = (function () {
  var CV = 'sahneTuval';                       // akademinin 3D kanvası
  var AYAR = { hiz: 1, yogunluk: 1, sallanma: true, otoSn: 22 };
  var SUANKI_SABLON = -1, SOLUK = false, ISIMA = 1;
  var kuruldu = false;

  var TEMALAR = [
    ['siber', 'Siber Cyan', '#37e0ff'], ['hacker', 'Hacker Yeşili', '#00e05a'], ['kan', 'Kan Kırmızı', '#e02434'],
    ['mor', 'Ultraviyole', '#b14cff'], ['altin', 'Kali Altın', '#ffc107'], ['acik', 'Aydınlık', '#0a58ca'],
    ['siyah', 'Hacker Siyah', '#8a8f98'], ['hackcam', 'Hacker Camgöbeği', '#00e5ff'], ['hackamber', 'Hacker Amber', '#ffb300'],
    ['hackmor', 'Hacker Mor', '#b14cff'], ['hackkan', 'Hacker Kızıl', '#ff1744'], ['hackbuz', 'Hacker Buz', '#7ee8ff'],
    ['neon', 'Neon Pembe', '#ff00c8'], ['lazer', 'Lazer Kırmızı', '#ff0033'], ['okyanus', 'Okyanus Mavisi', '#0077ff'],
    ['asit', 'Asit Yeşil', '#aaff00'], ['ates', 'Ateş Turuncu', '#ff4400'], ['elmas', 'Elmas Beyaz', '#ffffff']
  ];

  function anaRenk() { try { return getComputedStyle(document.body).getPropertyValue('--ana').trim() || '#37e0ff'; } catch (e) { return '#37e0ff'; } }
  function vurguRenk() { try { return getComputedStyle(document.body).getPropertyValue('--vurgu').trim() || '#b14cff'; } catch (e) { return '#b14cff'; } }
  function $(id) { return document.getElementById(id); }

  function sahneAdi(k) {
    var ad = '', simge = '';
    if (typeof S3 === 'undefined') return '';
    (S3.LISTE || []).forEach(function (s) { if (s.k === k) { ad = s.ad; simge = s.simge; } });
    return simge + ' ' + ad;
  }
  function suankiYaz() {
    var el = $('akStSuanki');
    if (!el) return;
    var t = (SUANKI_SABLON >= 0 && S3.SABLONLAR && S3.SABLONLAR[SUANKI_SABLON] ? 'Şablon: ' + S3.SABLONLAR[SUANKI_SABLON].ad + '  ·  ' : '');
    el.textContent = (typeof S3 !== 'undefined' && S3.aktif) ? t + sahneAdi(S3.aktif()) : '3D hazırlanıyor…';
  }
  function kaydet() {
    try {
      localStorage.setItem('ak_studyo_sahne', S3.aktif());
      localStorage.setItem('ak_studyo_sablon', String(SUANKI_SABLON));
      localStorage.setItem('ak_studyo_ayar', JSON.stringify(AYAR));
      localStorage.setItem('ak_studyo_soluk', SOLUK ? '1' : '0');
      localStorage.setItem('ak_studyo_isima', String(ISIMA));
      localStorage.setItem('ak_studyo_tema', document.body.getAttribute('data-tema') || 'siber');
    } catch (e) {}
  }
  function isimaAyarla(v) {
    var bg = $(CV); if (!bg) return;
    bg.style.filter = (v === 1) ? '' : 'brightness(' + v + ')';
  }
  function solukAyarla(acik) {
    SOLUK = !!acik;
    var bg = $(CV); if (bg) bg.style.opacity = SOLUK ? '0.5' : '1';
  }

  function render() {
    if (typeof S3 === 'undefined') return;
    var aktif = S3.aktif ? S3.aktif() : null;

    // SAHNELER
    var es = $('akStSahne');
    if (es) {
      es.innerHTML = '';
      (S3.LISTE || []).forEach(function (s, k) {
        var b = document.createElement('button');
        b.className = 'stDug' + (s.k === aktif ? ' aktif' : '');
        b.innerHTML = '<span class="s">' + s.simge + '</span><span class="ad">' + (k + 1) + '. ' + s.ad + '</span>';
        b.onclick = function () { sahneSec(s.k); };
        es.appendChild(b);
      });
      var ss = $('akStSahneSayi'); if (ss) ss.textContent = '(' + (S3.LISTE || []).length + ')';
    }
    // ŞABLONLAR
    var eb = $('akStSablon');
    if (eb) {
      eb.innerHTML = '';
      (S3.SABLONLAR || []).forEach(function (sb, k) {
        var b = document.createElement('button');
        b.className = 'stDug' + (k === SUANKI_SABLON ? ' aktif' : '');
        b.innerHTML = '<span class="s">' + sb.simge + '</span><span class="ad">' + sb.ad + '</span>';
        b.onclick = function () { sablonUygula(k); };
        eb.appendChild(b);
      });
      var bs = $('akStSablonSayi'); if (bs) bs.textContent = '(' + (S3.SABLONLAR || []).length + ')';
    }
    var alt = $('akStAlt');
    if (alt) alt.textContent = (S3.LISTE || []).length + ' sahne · ' + (S3.SABLONLAR || []).length + ' hazır şablon · 12 tema · animasyon seçenekleri';
    temaCiz();
    fontCiz();
    secenekCiz();
    suankiYaz();
  }

  function secenekCiz() {
    var el = $('akStSecenek'); if (!el || typeof S3 === 'undefined') return;
    var o = S3.ayarOku ? S3.ayarOku() : {};
    var satirlar = [
      ['hiz', 'ANİMASYON HIZI', [[0.6, 'Yavaş'], [1, 'Normal'], [1.6, 'Hızlı'], [2.6, 'Turbo']], AYAR.hiz],
      ['yogunluk', 'SAHNE YOĞUNLUĞU', [[0.6, 'Az'], [1, 'Normal'], [1.5, 'Çok']], AYAR.yogunluk],
      ['isima', 'IŞIMA / PARLAKLIK', [[0.7, 'Soluk'], [1, 'Normal'], [1.35, 'Parlak']], ISIMA],
      ['sallanma', 'KAMERA TAKİBİ', [[1, 'Açık'], [0, 'Kapalı']], AYAR.sallanma ? 1 : 0],
      ['otoSn', 'OTOMATİK GEÇİŞ', [[12, '12 sn'], [22, '22 sn'], [40, '40 sn']], o.otoSn || AYAR.otoSn]
    ];
    el.innerHTML = '';
    satirlar.forEach(function (r) {
      var d = document.createElement('div'); d.className = 'secGrup';
      var ad = document.createElement('span'); ad.className = 'secAd'; ad.textContent = r[1]; d.appendChild(ad);
      var k = document.createElement('span'); k.className = 'secDugler';
      r[2].forEach(function (x) {
        var b = document.createElement('button');
        b.className = 'secDug' + (x[0] === r[3] ? ' aktif' : '');
        b.textContent = x[1];
        b.onclick = function () { secenekSec(r[0], x[0]); };
        k.appendChild(b);
      });
      d.appendChild(k); el.appendChild(d);
    });
  }
  function secenekSec(ad, deger) {
    if (ad === 'isima') { ISIMA = deger; isimaAyarla(deger); }
    else if (ad === 'sallanma') { AYAR.sallanma = !!deger; S3.ayar({ sallanma: AYAR.sallanma }); }
    else if (ad === 'otoSn') { AYAR.otoSn = deger; S3.ayar({ otoSn: deger }); if (S3.otoDurum()) S3.otoAc(true, deger); }
    else if (ad === 'hiz') { AYAR.hiz = deger; S3.ayar({ hiz: deger }); }
    else if (ad === 'yogunluk') { AYAR.yogunluk = deger; S3.ayar({ yogunluk: deger }); }
    SUANKI_SABLON = -1; kaydet(); render();
  }

  var FONTLAR = [
    ['modern', 'MODERN', 'Segoe UI, system-ui, sans-serif'],
    ['mono', 'MONO', 'Consolas, "Courier New", monospace'],
    ['serif', 'SERİF', 'Georgia, "Times New Roman", serif'],
    ['keskin', 'KESKİN', '"Arial Black", Impact, sans-serif'],
    ['zarif', 'ZARİF', '"Century Gothic", "Trebuchet MS", sans-serif']
  ];
  function fontCiz() {
    var el = $('akFontCubuk'); if (!el) return;
    el.innerHTML = '';
    FONTLAR.forEach(function (f) {
      var b = document.createElement('button');
      b.className = 'secDug' + (fontSecili() === f[0] ? ' aktif' : '');
      b.style.fontFamily = f[2]; b.textContent = f[1];
      b.onclick = function () { fontSec(f[0]); };
      el.appendChild(b);
    });
  }
  function fontSecili() { try { return localStorage.getItem('ak_studyo_font') || 'modern'; } catch (e) { return 'modern'; } }
  function fontSec(k) {
    var f = FONTLAR.filter(function (x) { return x[0] === k; })[0] || FONTLAR[0];
    try { localStorage.setItem('ak_studyo_font', k); } catch (e) {}
    document.documentElement.style.setProperty('--font-ak', f[2]);
    fontCiz();
  }
  function temaCiz() {
    var el = $('akRenkTemaCubuk'); if (!el) return;
    el.innerHTML = '';
    TEMALAR.forEach(function (t) {
      var d = document.createElement('div');
      d.className = 'ak-temaNok' + (document.body.getAttribute('data-tema') === t[0] ? ' aktif' : '');
      d.style.background = t[2]; d.title = t[1];
      d.onclick = function () { temaUygula(t[0]); };
      el.appendChild(d);
    });
  }
  function temaUygula(t) {
    document.body.setAttribute('data-tema', t);
    temaCiz();
    if (typeof S3 !== 'undefined' && S3.hazir()) S3.renkAyarla(anaRenk(), vurguRenk());
    SUANKI_SABLON = -1; kaydet();
  }

  function sahneSec(k) { if (typeof S3 === 'undefined') return; S3.sec(k); SUANKI_SABLON = -1; kaydet(); render(); }
  function rastgeleSahne() { if (typeof S3 === 'undefined') return; S3.rastgele(); SUANKI_SABLON = -1; kaydet(); render(); }

  function sablonUygula(i) {
    if (typeof S3 === 'undefined') return;
    var sb = (S3.SABLONLAR || [])[i]; if (!sb) return;
    SUANKI_SABLON = i;
    document.body.setAttribute('data-tema', sb.tema); temaCiz();
    S3.sec(sb.sahne);
    S3.ayar({ hiz: sb.hiz, yogunluk: sb.yog, sallanma: sb.sallanma });
    AYAR.hiz = sb.hiz; AYAR.yogunluk = sb.yog; AYAR.sallanma = sb.sallanma;
    solukAyarla(!!sb.soluk);
    isimaAyarla(ISIMA);
    if (S3.hazir()) S3.renkAyarla(anaRenk(), vurguRenk());
    kaydet(); render();
  }
  function otoDegistir() {
    if (typeof S3 === 'undefined' || !S3.hazir()) return;
    var acik = !S3.otoDurum();
    S3.otoAc(acik, AYAR.otoSn);
    var b = $('akStOto');
    if (b) { b.className = 'secDug' + (acik ? ' aktif' : ''); b.textContent = acik ? '⟳ OTOMATİK AÇIK' : '⟳ OTOMATİK'; }
    kaydet();
  }
  function uc3dDegistir() {
    if (typeof S3 === 'undefined' || !S3.hazir()) return;
    var acik = !S3.acikMi();
    S3.acKapa(acik);
    var b = $('akSt3d');
    if (b) { b.className = 'secDug' + (acik ? ' aktif' : ''); b.textContent = acik ? '◉ 3D AÇIK' : '○ 3D KAPALI'; }
    var bg = $(CV); if (bg) bg.style.opacity = acik ? (SOLUK ? '0.5' : '1') : '0';
    kaydet();
  }
  function solukDegistir() { solukAyarla(!SOLUK); var b = $('akStSoluk'); if (b) b.className = 'secDug' + (SOLUK ? ' aktif' : ''); kaydet(); }

  function acKapa() {
    var p = $('akStudyo');
    if (!p) return;
    var acik = p.classList.toggle('acik');
    if (acik) render();
  }
  var ustDugEklendi = false;
  function ustDugEkle() {
    if (ustDugEklendi) return;
    var ustSag = document.querySelector('.akUstSag');
    if (!ustSag) { setTimeout(ustDugEkle, 250); return; }
    ustDugEklendi = true;
    var b = document.createElement('button');
    b.className = 'akStudyoDug'; b.id = 'akStudyoDug';
    b.innerHTML = '🎨 3D STÜDYO';
    b.onclick = acKapa;
    var kap = ustSag.querySelector('.akKapat');
    if (kap) ustSag.insertBefore(b, kap); else ustSag.appendChild(b);
  }
  function kapat() { var p = $('akStudyo'); if (p) p.classList.remove('acik'); }

  /* ---- kurulum: düğme + panel HTML enjekte et ---- */
  function kur() {
    if (kuruldu) return; kuruldu = true;

    // stüdyo paneli
    var p = document.createElement('div');
    p.className = 'akStudyo'; p.id = 'akStudyo';
    p.innerHTML =
      '<div class="stUst"><span class="stBaslik">🎨 3D STÜDYO</span>' +
      '<span class="stAlt" id="akStAlt"></span>' +
      '<span class="stAlt" id="akStSuanki" style="color:#2ee6a8"></span>' +
      '<button class="stKapat" onclick="AKSTUDYO.kapat()">✕ KAPAT</button></div>' +
      '<div class="stBolum"><h4>⭐ HAZIR ŞABLONLAR <span id="akStSablonSayi"></span></h4><div class="stIzgara" id="akStSablon"></div></div>' +
      '<div class="stBolum"><h4>🎭 SAHNELER <span id="akStSahneSayi"></span></h4><div class="stIzgara stSahneIzgara" id="akStSahne"></div></div>' +
      '<div class="stBolum"><h4>🎨 RENK TEMALARI</h4><div class="ak-temaCubuk" id="akRenkTemaCubuk"></div></div>' +
      '<div class="stBolum"><h4>🔤 YAZI FONTU</h4><div class="secDugler" id="akFontCubuk"></div></div>' +
      '<div class="stBolum"><h4>⚙️ ANİMASYON SEÇENEKLERİ</h4><div class="stSecenek" id="akStSecenek"></div></div>' +
      '<div class="stBolum"><h4>🔘 HIZLI DÜĞMELER</h4><div class="secDugler">' +
      '<button class="secDug" id="akSt3d" onclick="AKSTUDYO.uc3dDegistir()">◉ 3D AÇIK</button>' +
      '<button class="secDug" id="akStSoluk" onclick="AKSTUDYO.solukDegistir()">◒ SOLUK</button>' +
      '<button class="secDug" id="akStOto" onclick="AKSTUDYO.otoDegistir()">⟳ OTOMATİK</button>' +
      '<button class="secDug" onclick="AKSTUDYO.rastgele()">🎲 RASTGELE</button>' +
      '</div></div>';
    document.body.appendChild(p);

    // üst çubuğa "3D STÜDYO" düğmesi ekle (.akUst girişte dinamik yaratılır → bekle)
    ustDugEkle();

    // kayıtlı ayarları geri yükle
    try {
      var t = localStorage.getItem('ak_studyo_tema'); if (t) document.body.setAttribute('data-tema', t);
      ISIMA = parseFloat(localStorage.getItem('ak_studyo_isima') || '1') || 1;
      SOLUK = localStorage.getItem('ak_studyo_soluk') === '1';
      var a = JSON.parse(localStorage.getItem('ak_studyo_ayar') || 'null');
      if (a) { AYAR.hiz = a.hiz || 1; AYAR.yogunluk = a.yogunluk || 1; AYAR.sallanma = a.sallanma !== false; AYAR.otoSn = a.otoSn || 22; }
      var fk = localStorage.getItem('ak_studyo_font');
      if (fk) { var ff = FONTLAR.filter(function (x) { return x[0] === fk; })[0]; if (ff) document.documentElement.style.setProperty('--font-ak', ff[2]); }
    } catch (e) {}

    render();
  }

  // S3 hazır olunca yeniden çiz (S3.baslat gecikebilir)
  function hazirBekle() {
    if (typeof S3 !== 'undefined' && S3.hazir && S3.hazir()) { render(); isimaAyarla(ISIMA); solukAyarla(SOLUK); return; }
    setTimeout(hazirBekle, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { kur(); hazirBekle(); });
  } else { kur(); hazirBekle(); }

  return {
    acKapa: acKapa, kapat: kapat, render: render,
    uc3dDegistir: uc3dDegistir, solukDegistir: solukDegistir,
    otoDegistir: otoDegistir, rastgele: rastgeleSahne
  };
})();
