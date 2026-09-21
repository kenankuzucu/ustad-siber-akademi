/* ==========================================================================
   ÜSTAD SİBER AKADEMİ — ÇEKİRDEK (akademi.js)
   Kabuk · öğrenci deposu · Siber Kimlik Kartı · XP/rütbe/rozet · modül yönlendirme
   Çevrimdışı çalışır. Mevcut siteye dokunmaz; V (soru/içerik) varsa onu kullanır.
   ========================================================================== */
(function () {
  'use strict';

  var AK = (window.AK = window.AK || {});
  AK.surum = '1.0';

  /* veri köprüsü: mevcut site V (EGITIM_VERI) yükler; test/dış sayfalarda da çalışsın */
  if (!window.V && window.EGITIM_VERI) { window.V = window.EGITIM_VERI; }
  AK.icerikYok = false;

  /* ------------------------------- sabitler ------------------------------- */
  AK.RENK = {
    kimlik: '#ffc107', onsinav: '#37e0ff', beyin: '#b14cff', skill: '#00e05a',
    sinav: '#ff5470', defter: '#ff8f00', tekrar: '#ff6ec7', karne: '#2f7bff',
    sertifika: '#d4af37', kasa: '#00e5ff', portfoy: '#7cffb2', takip: '#ff9f1a'
  };

  AK.MODUL = [
    { id: 'kimlik',    simge: '\uD83E\uDEAA', ad: 'S\u0130BER K\u0130ML\u0130K',        alt: 'kimlik kart\u0131' },
    { id: 'onsinav',   simge: '\uD83E\uDDED', ad: '\u00D6N SINAV',                      alt: 'seviye tespiti' },
    { id: 'beyin',     simge: '\uD83E\uDDE0', ad: 'AKADEM\u0130 BEYN\u0130',            alt: 'bug\u00FCn ne yapmal\u0131y\u0131m?' },
    { id: 'skill',     simge: '\uD83C\uDF33', ad: 'BECER\u0130 A\u011EACI',             alt: 'skill tree + radar' },
    { id: 'sinav',     simge: '\uD83C\uDFAF', ad: 'SINAV MERKEZ\u0130',                 alt: 'adaptif s\u0131nav' },
    { id: 'defter',    simge: '\uD83D\uDCD5', ad: 'YANLI\u015ELAR DEFTER\u0130',        alt: '' },
    { id: 'tekrar',    simge: '\uD83D\uDD01', ad: 'TEKRAR MOTORU',                      alt: 'aral\u0131kl\u0131 tekrar' },
    { id: 'karne',     simge: '\uD83D\uDCCA', ad: 'KARNE & ANAL\u0130T\u0130K',         alt: 'geli\u015Fim' },
    { id: 'sertifika', simge: '\uD83C\uDF93', ad: 'SERT\u0130F\u0130KA',                alt: 'kazan ve indir' },
    { id: 'kasa',      simge: '\uD83D\uDDC4\uFE0F', ad: 'D\u0130J\u0130TAL KASA',       alt: 'transkript' },
    { id: 'portfoy',   simge: '\uD83D\uDCBC', ad: 'PORTF\u00D6Y & CV',                  alt: '' },
    { id: 'takip',     simge: '\uD83C\uDFD7\uFE0F', ad: 'PROJE TAK\u0130P',             alt: '144 konu' }
  ];

  AK.RUTBE = [
    { ad: 'G\u00D6ZC\u00DC',          xp: 0 },
    { ad: 'N\u00D6BET\u00C7\u0130',   xp: 250 },
    { ad: 'ANAL\u0130ST',             xp: 750 },
    { ad: 'KIDEML\u0130 ANAL\u0130ST', xp: 1600 },
    { ad: 'MUHAFIZ',                  xp: 3000 },
    { ad: 'KOMUTAN YARDIMCISI',       xp: 5000 },
    { ad: 'KOMUTAN',                  xp: 8000 },
    { ad: 'BA\u015E KOMUTAN',         xp: 12000 }
  ];

  AK.ROZET = [
    { id: 'ilk_adim',   simge: '\uD83D\uDC63', ad: '\u0130LK ADIM',        kosul: 'Kimlik kart\u0131n\u0131 olu\u015Ftur' },
    { id: 'kesif',      simge: '\uD83E\uDDED', ad: 'KE\u015E\u0130F',       kosul: '\u00D6n s\u0131nav\u0131 tamamla' },
    { id: 'ilk_dogru',  simge: '\u2705',       ad: '\u0130LK DO\u011ERU',   kosul: '10 do\u011Fru cevap' },
    { id: 'yuz_soru',   simge: '\uD83D\uDCAF', ad: 'Y\u00DCZ SORU',        kosul: '100 soru \u00E7\u00F6z' },
    { id: 'kusursuz',   simge: '\uD83C\uDFC6', ad: 'KUSURSUZ',             kosul: 'Bir s\u0131navdan tam puan' },
    { id: 'seri_3',     simge: '\uD83D\uDD25', ad: '3 G\u00DCN SER\u0130',  kosul: '3 g\u00FCn \u00FCst \u00FCste \u00E7al\u0131\u015F' },
    { id: 'seri_7',     simge: '\uD83D\uDD25', ad: '7 G\u00DCN SER\u0130',  kosul: '7 g\u00FCn \u00FCst \u00FCste \u00E7al\u0131\u015F' },
    { id: 'okur',       simge: '\uD83D\uDCD6', ad: 'OKUR',                 kosul: '5 b\u00F6l\u00FCm\u00FC tamamen oku' },
    { id: 'defterci',   simge: '\uD83D\uDCD5', ad: 'DEFTERC\u0130',        kosul: 'Yanl\u0131\u015Flar\u0131n\u0131 tekrar \u00E7\u00F6z' },
    { id: 'duzeltme',   simge: '\uD83D\uDD01', ad: 'D\u00DCZELTME',        kosul: 'Yanl\u0131\u015F\u0131n\u0131 sonradan do\u011Fru yap' },
    { id: 'uzman',      simge: '\uD83C\uDF96\uFE0F', ad: 'UZMAN',           kosul: 'Bir alanda %85 ustal\u0131k' },
    { id: 'rutbe_5',    simge: '\u2694\uFE0F', ad: 'MUHAFIZ',               kosul: '3000 XP' },
    { id: 'sertifika_1', simge: '\uD83C\uDF93', ad: '\u0130LK SERT\u0130F\u0130KA', kosul: 'Bir program sertifikas\u0131 kazan' },
    { id: 'sinav_10',   simge: '\uD83D\uDCC8', ad: '10 SINAV',              kosul: '10 s\u0131nav tamamla' }
  ];

  AK.ALAN = [
    { id: 'network',  ad: 'A\u011E G\u00DCVENL\u0130\u011E\u0130',  bolumler: ['agguvenlik', 'portlar', 'ad', 'filtreler'] },
    { id: 'linux',    ad: 'L\u0130NUX G\u00DCVENL\u0130\u011E\u0130', bolumler: ['komutlar', 'kurulum', 'rehber', 'sertlestirme', 'teksatir', 'hatalar'] },
    { id: 'python',   ad: 'PYTHON',                bolumler: ['python'] },
    { id: 'web',      ad: 'WEB G\u00DCVENL\u0130\u011E\u0130',      bolumler: ['web', 'araclar', 'cve'] },
    { id: 'blueteam', ad: 'BLUE TEAM / SOC',       bolumler: ['savunma', 'denetim', 'hatalar'] },
    { id: 'kripto',   ad: 'KR\u0130PTOGRAF\u0130', bolumler: ['kripto', 'parola'] },
    { id: 'adli',     ad: 'ADL\u0130 B\u0130L\u0130\u015E\u0130M',  bolumler: ['adli', 'vakalar'] },
    { id: 'osint',    ad: 'OSINT',                 bolumler: ['osint', 'anonimlik'] },
    { id: 'bulut',    ad: 'BULUT G\u00DCVENL\u0130\u011E\u0130',    bolumler: ['bulut'] },
    { id: 'ai',       ad: 'AI G\u00DCVENL\u0130\u011E\u0130',       bolumler: ['ai'] },
    { id: 'ctf',      ad: 'CTF / LAB',             bolumler: ['test', 'lablar', 'dallar', 'eglence', 'senaryolar'] },
    { id: 'kariyer',  ad: 'KAR\u0130YER',          bolumler: ['kariyer', 'sertifika', 'hukuk', 'haberler', 'harita', 'ipuclari'] }
  ];

  /* -------------------------------- yardımcı ------------------------------ */
  function $(s, k) { return (k || document).querySelector(s); }
  function $$(s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); }
  function kac(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  AK.kac = kac;
  AK.$ = $;
  AK.$$ = $$;

  AK.gun = function (t) {
    var d = t ? new Date(t) : new Date();
    var a = d.getFullYear(), y = ('0' + (d.getMonth() + 1)).slice(-2), g = ('0' + d.getDate()).slice(-2);
    return a + '-' + y + '-' + g;
  };
  AK.trTarih = function (t) {
    var d = t ? new Date(t) : new Date();
    var ay = ['Ocak', '\u015Eubat', 'Mart', 'Nisan', 'May\u0131s', 'Haziran', 'Temmuz',
      'A\u011Fustos', 'Eyl\u00FCl', 'Ekim', 'Kas\u0131m', 'Aral\u0131k'];
    return d.getDate() + ' ' + ay[d.getMonth()] + ' ' + d.getFullYear();
  };
  AK.sha256 = function (s) {
    if (!(window.crypto && crypto.subtle)) return Promise.resolve(basitHash(s));
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)).then(function (b) {
      return Array.prototype.map.call(new Uint8Array(b), function (x) {
        return ('0' + x.toString(16)).slice(-2);
      }).join('');
    })['catch'](function () { return basitHash(s); });
  };
  function basitHash(s) {
    var h1 = 0x811c9dc5, h2 = 0x01000193, i;
    for (i = 0; i < s.length; i++) { h1 = (h1 ^ s.charCodeAt(i)) * 16777619 >>> 0; }
    for (i = s.length - 1; i >= 0; i--) { h2 = (h2 + s.charCodeAt(i) * (i + 7)) >>> 0; }
    return (h1.toString(16) + h2.toString(16)).padEnd(16, '0');
  }

  /* --------------------------------- depo --------------------------------- */
  var ANAHTAR = 'ustad-akademi-sitesi-v1';
  AK.ANAHTAR = ANAHTAR;
  AK.veri = null;

  AK.yukle = function () {
    var d = null;
    try { d = JSON.parse(localStorage.getItem(ANAHTAR) || 'null'); } catch (e) { d = null; }
    if (!d || typeof d !== 'object') d = {};
    d.profil = d.profil || null;
    d.xp = d.xp || 0;
    d.gunluk = d.gunluk || {};        /* 'YYYY-AA-GG' -> {soru, dogru, dk} */
    d.soru = d.soru || {};            /* soru anahtarı -> {d:dogru, t:tarih, k:tekrar kademesi, y:yanlış sayısı} */
    d.sertifikalar = d.sertifikalar || [];
    d.rozetler = d.rozetler || {};
    d.oturumlar = d.oturumlar || [];  /* {t, tur, soru, dogru, skor, seviye} */
    d.onSinav = d.onSinav || null;
    d.mesajGecmis = d.mesajGecmis || [];
    d.ayarlar = d.ayarlar || { tema: 'zumrut' };
    d.sayac = d.sayac || 0;
    d.okuma = d.okuma || {};
    AK.veri = d;
    return d;
  };
  AK.kaydet = function () {
    try { localStorage.setItem(ANAHTAR, JSON.stringify(AK.veri)); } catch (e) {}
  };
  AK.sifirla = function () {
    AK.veri = null;
    try { localStorage.removeItem(ANAHTAR); } catch (e) {}
    AK.yukle();
    AK.ciz();
  };

  /* ------------------------------- rütbe / XP ----------------------------- */
  AK.rutbe = function () {
    var xp = AK.veri.xp, r = AK.RUTBE[0], i;
    for (i = 0; i < AK.RUTBE.length; i++) { if (xp >= AK.RUTBE[i].xp) r = AK.RUTBE[i]; }
    var sonraki = null;
    for (i = 0; i < AK.RUTBE.length; i++) { if (AK.RUTBE[i].xp > xp) { sonraki = AK.RUTBE[i]; break; } }
    return { ad: r.ad, xp: xp, sonraki: sonraki };
  };
  AK.xpEkle = function (n, sebep) {
    AK.veri.xp += n;
    AK.gunlukEkle({ xp: n });
    AK.rozetKontrol();
    AK.kaydet();
    AK.disCubukGuncelle();
    return n;
  };
  AK.seviye = function () {
    /* 1-10 seviye: XP eşikleri */
    var esik = [0, 120, 320, 620, 1050, 1650, 2450, 3500, 4900, 6800];
    var s = 1, i;
    for (i = 0; i < esik.length; i++) { if (AK.veri.xp >= esik[i]) s = i + 1; }
    var ust = esik[s] != null ? esik[s] : null;
    var alt = esik[s - 1];
    return { seviye: s, alt: alt, ust: ust, yuzde: ust ? Math.round((AK.veri.xp - alt) / (ust - alt) * 100) : 100 };
  };

  AK.gunlukEkle = function (o) {
    var g = AK.gun();
    var x = AK.veri.gunluk[g] = AK.veri.gunluk[g] || { soru: 0, dogru: 0, dk: 0, xp: 0 };
    Object.keys(o).forEach(function (k) { x[k] = (x[k] || 0) + o[k]; });
  };
  AK.seri = function () {
    var n = 0, d = new Date(), ilk = true;
    for (var tur = 0; tur < 400; tur++) {
      var g = AK.gun(d.getTime());
      var x = AK.veri.gunluk[g];
      var dolu = !!(x && (x.soru || x.dk || x.xp));
      if (dolu) n++;
      else if (!ilk) break;          /* dün boşsa seri orada biter */
      else if (g !== AK.gun()) break; /* bugün hiç çalışılmadıysa seri 0 */
      ilk = false;
      d = new Date(d.getTime() - 864e5);
    }
    return n;
  };

  AK.rozetKazan = function (id) {
    if (AK.veri.rozetler[id]) return false;
    AK.veri.rozetler[id] = Date.now();
    AK.kaydet();
    return true;
  };
  AK.toplamSoru = function () {
    var s = 0;
    Object.keys(AK.veri.soru).forEach(function (k) { s += AK.veri.soru[k].c || 1; });
    return s;
  };
  AK.dogruSoru = function () {
    var s = 0;
    Object.keys(AK.veri.soru).forEach(function (k) { if (AK.veri.soru[k].d) s++; });
    return s;
  };
  AK.rozetKontrol = function () {
    var v = AK.veri, yeni = [];
    function ver(id, kosul) { if (kosul && !v.rozetler[id]) { AK.rozetKazan(id); yeni.push(id); } }
    ver('ilk_adim', !!v.profil);
    ver('kesif', !!v.onSinav);
    ver('ilk_dogru', AK.dogruSoru() >= 10);
    ver('yuz_soru', AK.toplamSoru() >= 100);
    ver('seri_3', AK.seri() >= 3);
    ver('seri_7', AK.seri() >= 7);
    ver('rutbe_5', v.xp >= 3000);
    ver('sinav_10', v.oturumlar.length >= 10);
    ver('okur', Object.keys(v.okuma).length >= 5);
    ver('uzman', AK.skillMatris().some(function (a) { return a.oran >= 85 && a.soru >= 8; }));
    ver('sertifika_1', v.sertifikalar.length >= 1);
    if (v.oturumlar.some(function (o) { return o.soru >= 10 && o.dogru === o.soru; })) ver('kusursuz', true);
    if (Object.keys(v.soru).some(function (k) { return v.soru[k].duzeltme; })) ver('duzeltme', true);
    if (Object.keys(v.soru).some(function (k) { return v.soru[k].d && v.soru[k].y > 0; })) ver('defterci', true);
    return yeni;
  };

  /* --------------------------- beceri matrisi ----------------------------- */
  AK.kategoriHavuzu = function () {
    if (AK._kat) return AK._kat;
    var kat = {};
    if (window.V && V.bolumler) {
      V.bolumler.forEach(function (b) {
        (b.kayitlar || []).forEach(function (r, i) {
          if (!r || r.tip !== 'soru' && !r.secenekler) return;
          if (!r.secenekler) return;
          var k = r.grup || r.ust || b.ad;
          kat[k] = kat[k] || { ad: k, sorular: [], bolum: b };
          kat[k].sorular.push({ r: r, b: b, i: i, anahtar: b.id + '#' + i });
        });
      });
    }
    AK._kat = kat;
    return kat;
  };
  AK.tumSorular = function () {
    var h = [];
    Object.keys(AK.kategoriHavuzu()).forEach(function (k) {
      h = h.concat(AK.kategoriHavuzu()[k].sorular);
    });
    return h;
  };
  AK.skillMatris = function () {
    var v = AK.veri;
    return AK.ALAN.map(function (a) {
      var soru = 0, dogru = 0, okuma = 0, kap = 0;
      a.bolumler.forEach(function (bid) {
        var b = window.V && V.bolumler ? V.bolumler.filter(function (x) { return x.id === bid; })[0] : null;
        if (!b) return;
        kap += (b.kayitlar || []).length;
        var oku = v.oku ? v.oku : null;
      });
      /* soru geçmişinden alan puanı */
      Object.keys(v.soru).forEach(function (anahtar) {
        var kayit = v.soru[anahtar];
        var bid = anahtar.split('#')[0];
        if (a.bolumler.indexOf(bid) < 0) return;
        soru += 1;
        if (kayit.d) dogru += 1;
      });
      /* okuma katkısı */
      var okunan = 0, toplam = 0;
      if (window.OGR && OGR.oku) {
        a.bolumler.forEach(function (bid) {
          var b = V.bolumler.filter(function (x) { return x.id === bid; })[0];
          if (!b) return;
          (b.kayitlar || []).forEach(function (r, i) {
            toplam++;
            if (OGR.oku[bid + '#' + i]) okunan++;
          });
        });
      }
      var oranSoru = soru >= 5 ? Math.round(dogru / soru * 100) : null;
      var oranOkuma = toplam ? Math.round(okunan / toplam * 100) : 0;
      var oran = oranSoru == null ? Math.round(oranOkuma * 0.55) : Math.round(oranSoru * 0.78 + oranOkuma * 0.22);
      return {
        id: a.id, ad: a.ad, soru: soru, dogru: dogru, oran: Math.min(100, oran),
        oranSoru: oranSoru, okuma: oranOkuma, icerikVar: kap > 0, icerik: kap
      };
    });
  };

  /* ---------------------------------- XP bar ------------------------------ */
  AK.disCubukGuncelle = function () {
    var d = document.getElementById('akDisXp');
    if (!d) return;
    var s = AK.seviye();
    d.innerHTML = '<b>' + kac(AK.rutbe().ad) + '</b> \u00B7 ' + AK.veri.xp + ' XP \u00B7 LV ' + s.seviye;
  };

  /* ================================ KABUK ================================ */
  AK.kur = function () {
    if (document.getElementById('akPerde')) return;
    var p = document.createElement('div');
    p.id = 'akPerde';
    p.className = 'akPerde';
    p.setAttribute('data-ak-tema', (AK.veri.ayarlar && AK.veri.ayarlar.tema) || 'karargah');
    p.innerHTML = ''
      + '<div class="akUst">'
      + '  <span class="akMadalyon"><img src="foto/ustad-kenan.jpg" alt="Kenan Kuzucu"></span>'
      + '  <div class="akBaslik">'
      + '    <span class="akAd">\u00DCSTAD KENAN KUZUCU</span>'
      + '    <span class="akAlt">Siber Akademi \u00B7 Komuta Kat\u0131</span>'
      + '  </div>'
      + '  <div class="akUstSag">'
      + '    <span class="akNot" style="margin:0;padding:6px 10px" id="akDisXp">\u2014</span>'
      + '    <span class="akTemaCubuk" id="akTemaCubuk"></span>'
      + '    <button class="akDug" id="akTemaGec" title="A\u00E7\u0131k/koyu tema aras\u0131nda ge\u00E7">\u25D1 TEMA</button>'
      + '    <button class="akDug akKapat" id="akKapat">\u2715 AKADEM\u0130DEN \u00C7IK</button>'
      + '  </div>'
      + '</div>'
      + '<div class="akGovde">'
      + '  <div class="akMenu" id="akMenu"></div>'
      + '  <div class="akIcerik" id="akIcerik"></div>'
      + '</div>';
    document.body.appendChild(p);
    AK.perde = p;
    AK.icerik = $('#akIcerik', p);
    AK.menu = $('#akMenu', p);
    $('#akKapat', p).onclick = AK.kapat;
    $('#akTemaGec', p).onclick = AK.temaGec;
    AK.menuCiz();
    AK.temaCubukCiz();
    AK.disCubukGuncelle();
  };

  AK.ac = function (modul) {
    document.body.setAttribute('data-ak-perde', 'acik');
    AK.perde.classList.add('acik');
    AK.git(modul || AK.sonModul || 'kimlik');
  };
  AK.kapat = function () {
    document.body.removeAttribute('data-ak-perde');
    AK.perde.classList.remove('acik');
    /* açılış ekranını geri getir (yoksa "çıkıyorum" ama ekran boş kalır) */
    try {
      if (window.GIRIS_AC) { window.GIRIS_AC(); }
      else { var g = document.getElementById('giris'); if (g) g.classList.remove('gizli'); }
    } catch (e) {}
    var yg = document.getElementById('yuzenGir'); if (yg) yg.classList.remove('gizli');
  };
  AK.temaCubukCiz = function () {
    var s = $('#akTemaCubuk'); if (!s) return;
    var liste = [
      { id: 'akademi', renk: 'linear-gradient(135deg,#150810,#d4af37)' },
      { id: 'karargah', renk: 'linear-gradient(135deg,#05121c,#37e0ff)' },
      { id: 'gece', renk: 'linear-gradient(135deg,#120b22,#b14cff)' },
      { id: 'zumrut', renk: 'linear-gradient(135deg,#04201a,#00e05a)' },
      { id: 'krem', renk: 'linear-gradient(135deg,#f7f1e3,#c9a227)' },
      { id: 'gul', renk: 'linear-gradient(135deg,#fdf1f0,#ff5470)' },
      { id: 'buz', renk: 'linear-gradient(135deg,#eef5fb,#2f7bff)' },
      { id: 'okyanus', renk: 'linear-gradient(135deg,#001026,#0077ff)' },
      { id: 'mor', renk: 'linear-gradient(135deg,#0a0016,#c04dff)' },
      { id: 'kan', renk: 'linear-gradient(135deg,#100002,#ff2038)' },
      { id: 'altin', renk: 'linear-gradient(135deg,#0c0700,#ffd21a)' },
      { id: 'neon', renk: 'linear-gradient(135deg,#0c0010,#ff00c8)' },
      { id: 'siyah', renk: 'linear-gradient(135deg,#000000,#9fe8b8)' }
    ];
    s.innerHTML = liste.map(function (t) {
      return '<span class="akTemaNokta' + (AK.veri.ayarlar.tema === t.id ? ' sec' : '') +
        '" data-t="' + t.id + '" style="background:' + t.renk + '" title="' + t.id + '"></span>';
    }).join('');
    $$('.akTemaNokta', s).forEach(function (n) {
      n.onclick = function () { AK.temaSec(n.getAttribute('data-t')); };
    });
  };
  AK.temaSec = function (t) {
    AK.veri.ayarlar.tema = t; AK.kaydet();
    AK.perde.setAttribute('data-ak-tema', t);
    AK.temaCubukCiz();
  };
  AK.temaGec = function () {
    var sira = ['zumrut', 'akademi', 'karargah', 'gece', 'krem', 'gul', 'buz', 'okyanus', 'mor', 'kan', 'altin', 'neon', 'siyah'];
    var i = sira.indexOf(AK.veri.ayarlar.tema);
    AK.temaSec(sira[(i + 1) % sira.length]);
  };

  AK.menuCiz = function () {
    var m = AK.menu || $('#akMenu');
    m.innerHTML = '<div class="akMenuBaslik">Akademi Mod\u00FClleri</div>' +
      AK.MODUL.map(function (x) {
        return '<button class="akMenuDug" data-m="' + x.id + '" style="--ak-renk:' + AK.RENK[x.id] + '">'
          + '<span class="akSimge">' + x.simge + '</span><span>' + x.ad + '</span>'
          + '<span class="akMenuSayi" data-s="' + x.id + '"></span></button>';
      }).join('');
    $$('.akMenuDug', m).forEach(function (b) {
      b.onclick = function () { AK.git(b.getAttribute('data-m')); };
    });
    AK.menuSayilari();
  };
  AK.menuSayilari = function () {
    var v = AK.veri;
    var s = {
      kimlik: v.profil ? 1 : 0, onsinav: v.onSinav ? 1 : 0,
      defter: Object.keys(v.soru).filter(function (k) { return v.soru[k].y > 0 && !v.soru[k].d; }).length,
      tekrar: AK.vadeliTekrarlar().length, sertifika: v.sertifikalar.length,
      kasa: v.sertifikalar.length, sinav: v.oturumlar.length,
      karne: AK.toplamSoru()
    };
    Object.keys(s).forEach(function (k) {
      var e = $('[data-s="' + k + '"]');
      if (e) e.textContent = s[k] ? s[k] : '';
    });
  };

  AK.git = function (id) {
    AK.sonModul = id;
    $$('.akMenuDug').forEach(function (b) {
      b.classList.toggle('aktif', b.getAttribute('data-m') === id);
    });
    var renk = AK.RENK[id] || '#2ee6a8';
    AK.icerik.style.setProperty('--ak-renk', renk);
    $$('.akMenuDug').forEach(function (b) {
      var c = AK.RENK[b.getAttribute('data-m')];
      b.style.setProperty('--ak-renk', c);
    });
    if (!AK.cizici[id]) {
      AK.icerik.innerHTML = '<div class="akNot akUyari">Bu mod\u00FCl hen\u00FCz y\u00FCklenmedi.</div>';
      return;
    }
    AK.icerik.innerHTML = '';
    try { AK.cizici[id](); } catch (e) {
      AK.icerik.innerHTML = '<div class="akNot akKotu">Mod\u00FCl \u00E7izilemedi: ' + kac(e.message) + '</div>';
    }
    AK.menuSayilari();
    AK.icerik.scrollTop = 0;
    AK.icerik.setAttribute('data-m', id);
  };
  AK.cizici = {};
  AK.modulEkle = function (id, fn) { AK.cizici[id] = fn; };

  /* başlık yardımcıları */
  AK.baslik = function (baslik, etiket, aciklama) {
    var id = AK.icerik.getAttribute('data-m');
    var m = AK.MODUL.filter(function (x) { return x.id === id; })[0] || { simge: '', ad: baslik };
    return '<div class="akIcerikBaslik"><h2>' + m.simge + ' ' + kac(baslik) + '</h2>'
      + (etiket ? '<span class="akEtiket">' + kac(etiket) + '</span>' : '') + '</div>'
      + (aciklama ? '<p class="akAciklama">' + aciklama + '</p>' : '');
  };
  AK.kutu = function (s) { return '<div class="akKutu">' + s + '</div>'; };
  AK.cubuk = function (yuzde, renk) {
    return '<div class="akCubuk"><i style="width:' + Math.max(0, Math.min(100, yuzde)) + '%;'
      + (renk ? 'background:' + renk : '') + '"></i></div>';
  };

  /* ---------------------------- aralıklı tekrar --------------------------- */
  AK.VADE = [1, 3, 7, 16, 35, 75];   /* gün */
  AK.soruAnahtar = function (b, i) { return b.id + '#' + i; };
  AK.soruKaydet = function (anahtar, dogruMu) {
    var v = AK.veri, k = v.soru[anahtar] = v.soru[anahtar] || { c: 0, y: 0, d: false, k: 0 };
    k.c += 1;
    if (dogruMu) {
      if (k.y > 0 && !k.d) k.duzeltme = Date.now();
      k.d = true; k.k = Math.min(AK.VADE.length, (k.k || 0) + 1); k.son = Date.now();
      k.vade = Date.now() + AK.VADE[Math.min(k.k, AK.VADE.length - 1)] * 864e5;
    } else {
      k.d = false; k.y += 1; k.k = 0; k.son = Date.now(); k.vade = Date.now() + 864e5;
    }
    AK.kaydet();
  };
  AK.vadeliTekrarlar = function () {
    var h = [], now = Date.now();
    Object.keys(AK.veri.soru).forEach(function (a) {
      var k = AK.veri.soru[a];
      if (!k.d && k.vade && k.vade <= now) h.push(a);
      else if (k.d && k.vade && k.vade <= now) h.push(a);
    });
    return h;
  };

  /* ------------------------------ dış entegrasyon ------------------------- */
  AK.dugmeEkle = function () {
    if (document.getElementById('akDug')) return;
    var bar = document.querySelector('.sahneBar') || document.querySelector('.baslik');
    if (!bar) return;
    var b = document.createElement('button');
    b.id = 'akDug';
    b.className = 'studyoDug';
    b.innerHTML = '\uD83C\uDF93 <span>AKADEM\u0130</span>';
    b.title = '\u00DCSTAD S\u0130BER AKADEM\u0130 \u2014 kimlik kart\u0131, \u00F6n s\u0131nav, AI beyin, sertifika';
    b.onclick = function () { AK.ac(); };
    var ilk = bar.querySelector('#kurDug');
    if (ilk && ilk.nextSibling) bar.insertBefore(b, ilk.nextSibling); else bar.appendChild(b);
  };

  AK.basla = function () {
    AK.yukle();
    AK.kur();
    AK.dugmeEkle();
    /* okuma verisini mevcut siteden al (OGR) */
    try { AK.okuAktar(); } catch (e) {}
    AK.disCubukGuncelle();
  };

  AK.okuAktar = function () {
    if (!window.OGR || !OGR.oku) return;
    var v = AK.veri, degisti = false;
    Object.keys(OGR.oku).forEach(function (k) {
      if (OGR.oku[k] && !v.okuma[k]) { v.okuma[k] = 1; degisti = true; }
    });
    if (degisti) { AK.kaydet(); AK.rozetKontrol(); }
  };

  /* EKLENTİ GÜVENCESİ: depo, bu dosya yüklenirken hemen kurulur; böylece
     sonradan gelen eklenti modülleri (AK.veri'ye erişenler) hata vermez. */
  try { if (!AK.veri) AK.yukle(); } catch (e) {}

  /* otomatik başlat: uygulama.js yüklendikten sonra */
  var hazeTurus = 0;
  function hazir() {
    if (hazeTurus++ > 60) return;                     /* veri yoksa (giriş yapılmadıysa) bekle, sonsuz dönme */
    if (typeof window.V === 'undefined' || !window.V) { setTimeout(hazir, 400); return; }
    AK.basla();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(hazir, 60); });
  } else { setTimeout(hazir, 60); }
  /* uygulama.js DOMContentLoaded olayını elle gönderdiği için ek güvence */
  document.addEventListener('DOMContentLoaded', function () { setTimeout(hazir, 60); });

  window.AKADEMI_AC = function () { AK.yukle(); AK.kur(); AK.dugmeEkle(); AK.ac(); };
})();
