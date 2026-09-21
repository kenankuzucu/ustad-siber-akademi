/* ==========================================================================
   ÜSTAD SİBER AKADEMİ — SİBER KİMLİK KARTI (akademi-kimlik.js)
   Öğrenci kaydı · benzersiz öğrenci numarası · doğrulama kodu
   Ön/arka yüz 3D kart · kartı PNG indirme / yazdırma
   ========================================================================== */
(function () {
  'use strict';
  var AK = window.AK;
  if (!AK) return;
  var kac = AK.kac, $ = AK.$, $$ = AK.$$, ic = function () { return document.getElementById('akIcerik'); };

  var KARIYER = [
    'SOC Analisti / Blue Team', 'A\u011F G\u00FCvenli\u011Fi Uzman\u0131', 'S\u0131zma Testi (Pentest) Uzman\u0131',
    'Adli Bili\u015Fim Uzman\u0131', 'Bulut G\u00FCvenli\u011Fi Uzman\u0131', 'AI G\u00FCvenli\u011Fi Uzman\u0131',
    'OSINT / \u0130stihbarat Analisti', 'Hen\u00FCz karar vermedim'
  ];
  var HEDEFLER = ['G\u00FCnl\u00FCk 10 soru', 'G\u00FCnl\u00FCk 20 soru', 'G\u00FCnl\u00FCk 40 soru', 'Haftada 100 soru'];

  function monogram(ad) {
    var p = (ad || '?').trim().split(/\s+/);
    var a = (p[0] || '?')[0] || '?';
    var b = (p.length > 1 ? p[p.length - 1][0] : '') || '';
    return (a + b).toUpperCase();
  }

  function yeniNo() {
    var v = AK.veri;
    v.sayac = (v.sayac || 0) + 1;
    var yil = new Date().getFullYear();
    return 'SB-' + yil + '-' + String(v.sayac).padStart(3, '0');
  }

  /* ------------------------------- form ekranı ---------------------------- */
  function formCiz(profil) {
    var p = profil || {};
    var h = AK.baslik('S\u0130BER K\u0130ML\u0130K KARTI', profil ? 'd\u00FCzenle' : 'ilk ad\u0131m',
      'Akademi seni tan\u0131mak i\u00E7in bu kart\u0131 kullan\u0131r. Bilgiler <b>yaln\u0131zca bu cihazda</b> saklan\u0131r '
      + '(taray\u0131c\u0131 deposu) \u2014 sunucuya gitmez. Kart\u0131n \u00FCzerinde benzersiz \u00F6\u011Frenci numaras\u0131 ve do\u011Frulama kodu bulunur.');
    h += '<div class="akKutular"><div class="akKutu akGenis">';
    h += '<div class="akIki">'
      + '<div class="akAlan"><label>Ad Soyad</label><input id="akAd" maxlength="40" value="' + kac(p.ad || '') + '" placeholder="Ad\u0131n\u0131z Soyad\u0131n\u0131z"></div>'
      + '<div class="akAlan"><label>Unvan</label><input id="akUnvan" maxlength="46" value="' + kac(p.unvan || 'Siber G\u00FCvenlik \u00D6\u011Frencisi') + '"></div>'
      + '</div>'
      + '<div class="akIki">'
      + '<div class="akAlan"><label>Kariyer Hedefi</label><select id="akHedef">'
      + KARIYER.map(function (k) { return '<option' + (p.hedef === k ? ' selected' : '') + '>' + kac(k) + '</option>'; }).join('')
      + '</select></div>'
      + '<div class="akAlan"><label>\u00C7al\u0131\u015Fma Hedefi</label><select id="akHedef2">'
      + HEDEFLER.map(function (k) { return '<option' + (p.calisma === k ? ' selected' : '') + '>' + kac(k) + '</option>'; }).join('')
      + '</select></div>'
      + '</div>'
      + '<div class="akAlan"><label>Kendini nas\u0131l tan\u0131mlars\u0131n? (nihai seviyeyi \u00F6n s\u0131nav ve AI belirler)</label>'
      + '<select id="akBeyan">'
      + ['Yeni ba\u015Fl\u0131yorum', 'Temelim var', 'Orta seviyeyim', 'Kendimi ileri g\u00F6r\u00FCyorum']
        .map(function (k) { return '<option' + (p.beyan === k ? ' selected' : '') + '>' + kac(k) + '</option>'; }).join('')
      + '</select></div>';
    h += '<div class="akDugSira"><button class="akDug akBirincil" id="akKaydet">'
      + (profil ? '\u2714 DE\u011E\u0130\u015E\u0130KL\u0130\u011E\u0130 KAYDET' : '\uD83E\uDEAA K\u0130ML\u0130K KARTIMI OLU\u015ETUR') + '</button>'
      + (profil ? '<button class="akDug" id="akVazgec">VAZGE\u00C7</button>' : '') + '</div>';
    h += '</div></div>';
    ic().innerHTML = h;
    $('#akKaydet').onclick = function () {
      var ad = $('#akAd').value.trim();
      if (ad.length < 3) { AK.not('Ad soyad en az 3 harf olmal\u0131.', 'kotu'); return; }
      var v = AK.veri;
      var yeni = {
        ad: ad, unvan: $('#akUnvan').value.trim(), hedef: $('#akHedef').value,
        calisma: $('#akHedef2').value, beyan: $('#akBeyan').value,
        no: v.profil ? v.profil.no : yeniNo(),
        t: v.profil ? v.profil.t : Date.now()
      };
      if (!v.profil) AK.xpEkle(50);
      v.profil = yeni;
      AK.sha256([yeni.ad, yeni.no, yeni.t].join('|')).then(function (hash) {
        yeni.kod = (hash || '').slice(0, 4).toUpperCase() + '-' + (hash || '').slice(4, 8).toUpperCase()
          + '-' + (hash || '').slice(8, 12).toUpperCase();
        AK.kaydet();
        var yeniRozet = AK.rozetKontrol();
        AK.menuSayilari();
        AK.not('\u2714 Kimlik olu\u015Fturuldu: ' + yeni.no + (yeniRozet.length ? ' \u00B7 rozet: ' + yeniRozet.length : ''), 'iyi');
        AK.git('kimlik');
      });
    };
    if (profil && $('#akVazgec')) $('#akVazgec').onclick = function () { AK.git('kimlik'); };
  }

  /* ------------------------------- kart ekranı ---------------------------- */
  function kartCiz() {
    var v = AK.veri, p = v.profil;
    var s = AK.seviye(), r = AK.rutbe();
    var m = AK.skillMatris();
    var enIyi = m.slice().sort(function (a, b) { return b.oran - a.oran; })[0];
    var h = AK.baslik('S\u0130BER K\u0130ML\u0130K KARTI', p.no,
      'Karta dokun: arka y\u00FCz\u00FCne d\u00F6ner. Arka y\u00FCzde hedef, seviye, do\u011Frulama kodu ve rozet say\u0131s\u0131 var.');
    h += '<div class="akKartSahne"><div class="akKimlik" id="akKart">';
    /* ön yüz */
    h += '<div class="akKimlikYuz">'
      + '<div class="akKkUst">\u00DCSTAD S\u0130BER AKADEM\u0130<span class="akKkArm">\u00D6\u011ERENC\u0130 K\u0130ML\u0130K KARTI</span></div>'
      + '<div class="akKkOrta">'
      + '<canvas class="akKkFoto" id="akMonogram" width="168" height="168"></canvas>'
      + '<div class="akKkAlan"><b>' + kac(p.ad.toUpperCase()) + '</b>'
      + '<span>' + kac(p.unvan || 'Siber G\u00FCvenlik \u00D6\u011Frencisi') + '</span>'
      + '<span>' + kac(p.hedef || '\u2014') + '</span></div>'
      + '</div>'
      + '<div class="akKkAlt">'
      + '<span>NO <b>' + kac(p.no) + '</b></span>'
      + '<span>SEV\u0130YE <b>' + s.seviye + '</b></span>'
      + '<span>R\u00DCTBE <b>' + kac(r.ad) + '</b></span>'
      + '<span>XP <b>' + v.xp + '</b></span>'
      + '</div>'
      + '<div class="akKkSerit"></div>'
      + '</div>';
    /* arka yüz */
    h += '<div class="akKimlikYuz akArka">'
      + '<div class="akKkUst">DO\u011ERULAMA<span class="akKkArm">' + kac(p.kod || '') + '</span></div>'
      + '<div class="akKkOrta">'
      + '<canvas id="akMatris" width="240" height="240" style="width:120px;height:120px;background:#fff;border-radius:10px;padding:5px"></canvas>'
      + '<div class="akKkAlan"><span>K\u0130ML\u0130K OLU\u015ETURMA</span><b>' + AK.trTarih(p.t) + '</b>'
      + '<span>\u00C7\u00F6z\u00FClen soru: <b>' + AK.toplamSoru() + '</b> \u00B7 Do\u011Fru: <b>' + AK.dogruSoru() + '</b></span>'
      + '<span>Rozet: <b>' + Object.keys(v.rozetler).length + '/' + AK.ROZET.length + '</b> \u00B7 En g\u00FC\u00E7l\u00FC alan: <b>'
      + kac(enIyi && enIyi.soru ? enIyi.ad : '\u2014') + '</b></span>'
      + '<span>Seri: <b>' + AK.seri() + ' g\u00FCn</b> \u00B7 \u00D6n s\u0131nav: <b>'
      + kac(v.onSinav ? v.onSinav.seviye + ' (%' + v.onSinav.skor + ')' : 'hen\u00FCz yok') + '</b></span></div>'
      + '</div>'
      + '<div class="akKkSerit"></div>'
      + '<div class="akKkAlt" style="font-size:10.5px">Bu kart \u00E7evrimd\u0131\u015F\u0131 \u00FCretildi \u00B7 bilgiler yaln\u0131zca bu cihazda \u00B7 '
      + '\u00DCSTAD KENAN KUZUCU \u00B7 S\u0130BER AKADEM\u0130</div>'
      + '</div>';
    h += '</div></div>';
    h += '<div class="akDugSira" style="justify-content:center">'
      + '<button class="akDug akIkincil" id="akKartIndir">\u2B07 KARTI PNG \u0130ND\u0130R</button>'
      + '<button class="akDug" id="akKartYaz">\uD83D\uDDA8 YAZDIR</button>'
      + '<button class="akDug" id="akKartDuzenle">\u270E B\u0130LG\u0130LER\u0130 D\u00DCZENLE</button>'
      + '<button class="akDug akBirincil" id="akKartOnSinav">\uD83E\uDDED \u00D6N SINAVA G\u0130T</button>'
      + '<button class="akDug akKapat" id="akKartSil">\uD83D\uDDD1\uFE0F K\u0130ML\u0130\u011E\u0130 SIFIRLA</button>'
      + '</div>';
    h += '<div class="akNot akUyari" style="margin-top:14px"><b>Gizlilik:</b> Bu kimlik kart\u0131 ve t\u00FCm \u00E7al\u0131\u015Fma verilerin '
      + 'bu cihazda kal\u0131r. \u00C7ok kullan\u0131c\u0131l\u0131 (sunuculu) s\u00FCr\u00FCmde kart, veritaban\u0131na ba\u011Flan\u0131r '
      + '\u2014 o i\u015F <b>KAL\u0130-VE-SUNUCU</b> defterinde B1 numaras\u0131yla kay\u0131tl\u0131.</div>';
    ic().innerHTML = h;

    $$('#akKart').forEach(function (k) {
      k.onclick = function (e) {
        if (e.target.closest('button')) return;
        k.classList.toggle('arka');
      };
    });
    monogramCiz($('#akMonogram'), p.ad);
    matrisCiz($('#akMatris'), p.kod || p.no);
    $('#akKartDuzenle').onclick = function () { formCiz(p); };
    $('#akKartOnSinav').onclick = function () { AK.git('onsinav'); };
    $('#akKartIndir').onclick = function () { kartPng(p); };
    $('#akKartYaz').onclick = function () { kartPng(p, true); };
    $('#akKartSil').onclick = function () {
      if (!confirm('\u00DCSTAD S\u0130BER AKADEM\u0130: b\u00FCt\u00FCn \u00F6\u011Frenci verisi (kimlik, XP, rozet, sertifika, ge\u00E7mi\u015F) silinecek. Emin misin?')) return;
      AK.sifirla();
      AK.not('B\u00FCt\u00FCn veriler s\u0131f\u0131rland\u0131.', 'uyari');
    };
  }

  function monogramCiz(c, ad) {
    var g = c.getContext('2d'), s = c.width;
    var grd = g.createLinearGradient(0, 0, s, s);
    grd.addColorStop(0, '#ffd968'); grd.addColorStop(.5, '#ff9f1a'); grd.addColorStop(1, '#37e0ff');
    g.fillStyle = grd; g.fillRect(0, 0, s, s);
    g.fillStyle = 'rgba(6,16,28,.62)'; g.fillRect(6, 6, s - 12, s - 12);
    g.fillStyle = '#ffd968'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '700 ' + Math.round(s * 0.44) + 'px Georgia, serif';
    g.fillText(monogram(ad), s / 2, s / 2 + 2);
  }

  function matrisCiz(c, tohumMetin) {
    var g = c.getContext('2d'), n = 12, mb = c.width / n;
    g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
    var tohum = 0, i;
    for (i = 0; i < tohumMetin.length; i++) tohum = (tohum * 31 + tohumMetin.charCodeAt(i)) >>> 0;
    g.fillStyle = '#0d2233';
    for (var y = 0; y < n; y++) {
      for (var x = 0; x < n; x++) {
        tohum = (tohum * 1103515245 + 12345) >>> 0;
        if ((tohum >> 16) & 1) g.fillRect(x * mb, y * mb, mb - 1, mb - 1);
      }
    }
  }

  /* ------------------------------ kart görseli ---------------------------- */
  function kartPng(p, yazdirMi) {
    var v = AK.veri, s = AK.seviye();
    var c = document.createElement('canvas');
    c.width = 1200; c.height = 760;
    var g = c.getContext('2d');
    var grd = g.createLinearGradient(0, 0, c.width, c.height);
    grd.addColorStop(0, '#0a1a2b'); grd.addColorStop(.55, '#122a45'); grd.addColorStop(1, '#060d16');
    g.fillStyle = grd; g.fillRect(0, 0, c.width, c.height);
    /* süs */
    g.strokeStyle = 'rgba(255,217,104,.8)'; g.lineWidth = 4;
    g.strokeRect(24, 24, c.width - 48, c.height - 48);
    g.fillStyle = '#ffd968'; g.font = '700 30px "Segoe UI", sans-serif';
    g.fillText('\u00DCSTAD S\u0130BER AKADEM\u0130', 60, 100);
    g.fillStyle = '#9fd8ff'; g.font = '400 20px "Segoe UI", sans-serif';
    g.textAlign = 'right'; g.fillText('\u00D6\u011ERENC\u0130 K\u0130ML\u0130K KARTI', c.width - 60, 100);
    g.textAlign = 'left';
    /* monogram */
    var mg = g.createLinearGradient(70, 150, 290, 370);
    mg.addColorStop(0, '#ffd968'); mg.addColorStop(.5, '#ff9f1a'); mg.addColorStop(1, '#37e0ff');
    g.fillStyle = mg; g.fillRect(70, 160, 220, 220);
    g.fillStyle = 'rgba(6,16,28,.62)'; g.fillRect(80, 170, 200, 200);
    g.fillStyle = '#ffd968'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '700 96px Georgia, serif';
    g.fillText(monogram(p.ad), 180, 274);
    g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    /* ad */
    g.fillStyle = '#ffffff'; g.font = '700 54px "Segoe UI", sans-serif';
    g.fillText(p.ad.toUpperCase(), 340, 240);
    g.fillStyle = '#a9c4dd'; g.font = '400 24px "Segoe UI", sans-serif';
    g.fillText(p.unvan || 'Siber G\u00FCvenlik \u00D6\u011Frencisi', 340, 285);
    g.fillStyle = '#ffd968'; g.font = '600 26px "Segoe UI", sans-serif';
    g.fillText(p.hedef || '\u2014', 340, 330);
    /* alt bilgiler */
    g.fillStyle = '#cfe6ff'; g.font = '600 26px Consolas, monospace';
    g.fillText('NO : ' + p.no, 70, 470);
    g.fillText('SEV\u0130YE : ' + s.seviye + '   \u00B7   R\u00DCTBE : ' + AK.rutbe().ad + '   \u00B7   XP : ' + v.xp, 70, 515);
    g.fillText('DO\u011ERULAMA KODU : ' + (p.kod || ''), 70, 560);
    g.fillText('TAR\u0130H : ' + AK.trTarih(p.t), 70, 605);
    g.fillStyle = '#9fd8ff'; g.font = '400 20px "Segoe UI", sans-serif';
    g.fillText('\u00C7\u00F6z\u00FClen soru: ' + AK.toplamSoru() + '  \u00B7  Do\u011Fru: ' + AK.dogruSoru()
      + '  \u00B7  Rozet: ' + Object.keys(v.rozetler).length + '/' + AK.ROZET.length
      + '  \u00B7  Seri: ' + AK.seri() + ' g\u00FCn', 70, 645);
    /* matris */
    var mc = document.createElement('canvas'); mc.width = 240; mc.height = 240;
    matrisCiz(mc, p.kod || p.no);
    g.fillStyle = '#fff'; g.fillRect(c.width - 330, 430, 260, 260);
    g.drawImage(mc, c.width - 320, 440, 240, 240);
    g.fillStyle = '#ffd968'; g.font = '600 18px "Segoe UI", sans-serif'; g.textAlign = 'center';
    g.fillText('DO\u011ERULAMA MATR\u0130S\u0130', c.width - 200, 715);
    /* şerit */
    var sg = g.createLinearGradient(60, 685, c.width - 60, 685);
    sg.addColorStop(0, '#ffd968'); sg.addColorStop(.4, '#ff9f1a');
    sg.addColorStop(.7, '#b14cff'); sg.addColorStop(1, '#37e0ff');
    g.fillStyle = sg; g.fillRect(60, 690, c.width - 120, 10);

    if (yazdirMi) {
      var w = window.open('', '_blank');
      if (!w) { AK.not('A\u00E7\u0131l\u0131r pencere engellendi.', 'kotu'); return; }
      w.document.write('<html><head><meta charset="utf-8"><title>' + kac(p.no) + '</title></head>'
        + '<body style="margin:0"><img src="' + c.toDataURL('image/png') + '" style="width:100%">'
        + '<script>window.onload=function(){setTimeout(function(){window.print();},400);}<\/script></body></html>');
      w.document.close();
      return;
    }
    var a = document.createElement('a');
    a.href = c.toDataURL('image/png');
    a.download = 'KIMLIK-' + p.no + '.png';
    document.body.appendChild(a); a.click(); a.remove();
    AK.not('\u2714 Kimlik kart\u0131 indirildi: KIMLIK-' + p.no + '.png', 'iyi');
  }

  AK.modulEkle('kimlik', function () {
    if (!AK.veri.profil) formCiz(null); else kartCiz();
  });
})();
