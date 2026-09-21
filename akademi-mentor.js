/* ==========================================================================
   ÜSTAD AKADEMİ SİTESİ — AI ÖĞRETMEN & MENTOR (akademi-mentor.js)
   Master liste: 24 (ders yönetimi + ders içi quiz) · 27 (eksik konu + hatırlatma) ·
   29 (günlük/haftalık plan) · 41 (AI öğretmen/soru-cevap/açıklama) ·
   42 (sesli öğretmen) · 99-100 (AI mentor, kişisel tavsiye)
   Çevrimdışı kural motoru — internet/API gerekmez. Veri: 44 bölüm · 3.871 kayıt.
   ========================================================================== */
(function () {
  'use strict';
  if (!window.AK) return;
  var AK = window.AK, kac = AK.kac;

  AK.MODUL.push({ id: 'mentor', simge: '\uD83C\uDF93', ad: 'AI \u00D6\u011ERETMEN & MENTOR', alt: 'dersler + soru-cevap + sesli' });
  AK.RENK.mentor = '#b07bff';

  function bolumler() { return (window.V && window.V.bolumler) || []; }
  function alanBolumleri(alanId) {
    var a = (AK.ALAN || []).filter(function (x) { return x.id === alanId; })[0];
    if (!a) return [];
    var bs = bolumler();
    return bs.filter(function (b) { return (a.bolumler || []).indexOf(b.id) >= 0; });
  }
  function alanAdi(id) {
    var a = (AK.ALAN || []).filter(function (x) { return x.id === id; })[0];
    return a ? a.ad : id;
  }

  /* ---------------------- 41: AI ÖĞRETMEN (kural motoru) ------------------ */
  function kayitAra(kelime, limit) {
    var sonuc = [], bs = bolumler(), i, j, k, r, metin, puan;
    var kk = kelime.toLowerCase().split(/\s+/).filter(function (x) { return x.length > 2; });
    if (!kk.length) kk = [kelime.toLowerCase()];
    for (i = 0; i < bs.length; i++) {
      var kayitlar = bs[i].kayitlar || [];
      for (j = 0; j < kayitlar.length; j++) {
        r = kayitlar[j];
        metin = ((r.ad || '') + ' ' + (r.metin || '') + ' ' + (r.ornek || '') + ' ' + (r.ust || '') + ' ' + (r.grup || '')).toLowerCase();
        puan = 0;
        for (k = 0; k < kk.length; k++) {
          if (metin.indexOf(kk[k]) >= 0) puan += (r.ad || '').toLowerCase().indexOf(kk[k]) >= 0 ? 3 : 1;
        }
        if (puan > 0) sonuc.push({ puan: puan, bolum: bs[i].ad, bolumId: bs[i].id, ad: r.ad, metin: r.metin, ornek: r.ornek });
      }
    }
    sonuc.sort(function (a, b) { return b.puan - a.puan; });
    return sonuc.slice(0, limit || 5);
  }

  function ogretmenCevap(soru) {
    var s = soru.toLowerCase();
    var bulunan = kayitAra(soru, 5);
    var s = '';
    /* niyet tespiti */
    if (/neden|niçin|nicin/.test(s)) {
      s += '<div class="akBasari">\uD83E\uDDE0 Kural motoru: "neden" sorusu tespit edildi \u2014 a\u00E7\u0131klama modu.</div>';
    }
    if (/port|portu/.test(s)) s += '<div class="akNot akBilgi">\u0130pucu: port sorular\u0131nda servis\u2013port e\u015Fle\u015Ftirmesi kritik (22 SSH, 23 Telnet, 80 HTTP, 443 HTTPS, 3306 MySQL, 3389 RDP).</div>';
    if (/nasıl|nasil|adım|adim/.test(s)) s += '<div class="akNot akBilgi">\u0130pucu: "nas\u0131l" sorular\u0131nda s\u0131ra \u00F6nemlidir: ke\u015Fif \u2192 analiz \u2192 uygulama \u2192 do\u011Frulama \u2192 rapor.</div>';
    if (!bulunan.length) {
      s += '<div class="akNot akUyari">K\u00FCt\u00FCphanede tam e\u015Fle\u015Fme yok. Farkl\u0131 bir kelimeyle sor (ör. "nmap", "parola", "log", "SQL"). '
        + 'K\u00FCt\u00FCphanede ' + bolumler().length + ' b\u00F6l\u00FCm ve ' + (AK.tumSorular ? AK.tumSorular().length : 0) + ' soru var.</div>';
      return s;
    }
    s += '<div class="akEtiket">// K\u00DCT\u00DCPHANEDEN ' + bulunan.length + ' E\u015ELE\u015EME</div>';
    bulunan.forEach(function (b) {
      s += '<div class="akKutu" style="margin-bottom:8px"><div class="akEtiket">' + kac(b.bolum) + '</div>'
        + '<b>' + kac(b.ad || '') + '</b>'
        + (b.metin ? '<div style="font-size:13.2px;line-height:1.65;margin-top:4px">' + kac(b.metin) + '</div>' : '')
        + (b.ornek ? '<div class="akMono" style="font-size:12.4px;margin-top:4px">\u00D6rnek: ' + kac(b.ornek) + '</div>' : '')
        + '</div>';
    });
    return s;
  }

  /* ------------------------- 42: sesli öğretmen -------------------------- */
  var SES = { acik: false, hiz: 1 };
  function sesliOku(metin) {
    if (!('speechSynthesis' in window)) { AK.not('Bu taray\u0131c\u0131da sesli okuma yok.', 'uyari'); return; }
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(metin);
      u.lang = 'tr-TR'; u.rate = SES.hiz; u.pitch = 1;
      window.speechSynthesis.speak(u);
      SES.acik = true;
    } catch (e) { AK.not('Sesli okuma ba\u015Flat\u0131lamad\u0131.', 'uyari'); }
  }
  function sesDurdur() { try { window.speechSynthesis.cancel(); SES.acik = false; } catch (e) {} }

  /* --------------------------- 24: dersler ------------------------------- */
  function dersListesi() {
    var s = '<div class="akEtiket">// 24. MADDE \u2014 DERSLER (12 ALAN)</div>';
    (AK.ALAN || []).forEach(function (a) {
      var bs = alanBolumleri(a.id);
      if (!bs.length) return;
      var okundu = bs.filter(function (b) { return AK.veri.okuma[b.id]; }).length;
      s += '<div class="akKutu" style="margin-bottom:8px;border-left:4px solid ' + (AK.RENK[a.id] || '#2ee6a8') + '">'
        + '<div style="display:flex;gap:8px;align-items:center"><b style="flex:1">' + kac(a.ad) + '</b>'
        + '<span class="akSoluk">' + okundu + '/' + bs.length + ' ders</span>'
        + '<button class="akDug" data-dersalan="' + a.id + '">DERSLER\u0130 A\u00C7</button></div></div>';
    });
    return s;
  }

  function dersIcerik(b) {
    var kayitlar = (b.kayitlar || []).slice(0, 14);
    var s = AK.baslik(b.ad, 'ders', 'Bu ders kütüphanedeki ' + (b.kayitlar || []).length + ' kay\u0131ttan derlendi.');
    s += '<div class="akDugSira"><button class="akDug" id="dersSes">\uD83D\uDD0A DERS\u0130 D\u0130NLE</button>'
      + '<button class="akDug" id="dersSesDur">\u23F9 DURDUR</button>'
      + '<button class="akDug" id="dersQuiz">\uD83C\uDFAF DERS \u0130\u00C7\u0130 QUIZ</button></div>';
    s += '<div id="dersMetin">';
    kayitlar.forEach(function (r, i) {
      s += '<div class="akKutu" style="margin:8px 0"><div class="akEtiket">' + (i + 1) + ' \u00B7 ' + kac(r.ust || r.grup || '') + '</div>'
        + '<b>' + kac(r.ad || '') + '</b>'
        + (r.metin ? '<div style="font-size:13.4px;line-height:1.7;margin-top:5px">' + kac(r.metin) + '</div>' : '')
        + (r.ornek ? '<div class="akMono" style="font-size:12.6px;margin-top:5px;color:#9fe8ff">' + kac(r.ornek) + '</div>' : '')
        + '</div>';
    });
    s += '</div>';
    return s;
  }

  /* ders içi quiz — havuzdan bu bölümün soruları */
  function dersQuiz(b, geriFn) {
    var tum = AK.tumSorular ? AK.tumSorular() : [];
    var havuz = tum.filter(function (q) { return q.bolumId === b.id || q.bolum === b.ad; });
    if (havuz.length < 3) havuz = tum;
    havuz = havuz.sort(function () { return Math.random() - 0.5; }).slice(0, 5);
    var ic = AK.icerik, i = 0, dogru = 0;
    function ciz() {
      if (i >= havuz.length) {
        AK.veri.okuma[b.id] = 1;
        AK.kaydet();
        ic.innerHTML = AK.baslik(b.ad + ' \u2014 DERS QUIZ\u0130', 'bitti', '');
        ic.innerHTML += AK.kutu('<div style="font-size:16px">Do\u011Fru: <b>' + dogru + '/' + havuz.length + '</b></div>'
          + AK.cubuk(dogru / havuz.length * 100, AK.RENK.mentor));
        AK.xpEkle(dogru * 10, 'Ders quizi: ' + b.ad);
        if (AK.gorevKontrol) AK.gorevKontrol();
        ic.innerHTML += '<div class="akDugSira"><button class="akDug" id="dqGeri">\u2190 GER\u0130</button></div>';
        AK.$('#dqGeri').onclick = geriFn;
        return;
      }
      var q = havuz[i];
      ic.innerHTML = AK.baslik(b.ad + ' \u2014 DERS QUIZ\u0130', (i + 1) + '/' + havuz.length, 'Ders içi pekiştirme');
      ic.innerHTML += AK.kutu('<div style="font-size:14px;font-weight:700">' + kac(q.soru || q.s || '') + '</div>'
        + '<div class="akDugSira" style="flex-direction:column;align-items:stretch">'
        + (q.secenekler || q.c || []).map(function (x, k) {
          return '<button class="akDug" style="text-align:left" data-q="' + k + '">' + kac(x) + '</button>';
        }).join('') + '</div>');
      var dogrusu = (q.dogru != null ? q.dogru : (q.d != null ? q.d : 0));
      AK.$$('[data-q]').forEach(function (btn) {
        btn.onclick = function () {
          var ok = parseInt(btn.getAttribute('data-q'), 10) === dogrusu;
          if (ok) dogru++;
          AK.not(ok ? '\u2705 Do\u011Fru.' : '\u274C Yanl\u0131\u015F.', ok ? 'iyi' : 'kotu');
          i++; ciz();
        };
      });
    }
    ciz();
  }

  /* --------------------- 27/29: eksik konu, hatırlatma, plan -------------- */
  function planCiz() {
    var sm = AK.skillMatris ? AK.skillMatris() : [];
    var sirali = sm.slice().sort(function (a, b) { return (a.yuzde || 0) - (b.yuzde || 0); });
    var zayif = sirali.slice(0, 3);
    var vadeli = AK.vadeliTekrarlar();
    var g = AK.gun();
    var s = '<div class="akEtiket">// 29. MADDE \u2014 K\u0130\u015E\u0130SEL \u00C7ALI\u015EMA PLANI</div>';
    s += '<div class="akKutu"><table class="akTablo"><tr><th>G\u00FCn</th><th>Plan</th></tr>';
    var gunler = ['Bug\u00FCn', 'Yar\u0131n', '3. g\u00FCn', '4. g\u00FCn', '5. g\u00FCn', '6. g\u00FCn', '7. g\u00FCn'];
    gunler.forEach(function (gn, i) {
      var alan = zayif[i % Math.max(1, zayif.length)];
      var isler = [];
      if (i === 0) isler.push('Vadesi gelen ' + vadeli.length + ' tekrar\u0131 bitir');
      isler.push((i % 2 === 0 ? '20' : '15') + ' soru: ' + (alan ? alan.ad : 'genel'));
      if (i % 3 === 1) isler.push('1 laboratuvar senaryosu');
      if (i % 3 === 2) isler.push('1 vaka dosyas\u0131 + 1 mini oyun');
      if (i === 6) isler.push('Haftal\u0131k karne kontrol\u00FC');
      s += '<tr><td>' + gn + '</td><td>' + kac(isler.join(' \u00B7 ')) + '</td></tr>';
    });
    s += '</table></div>';

    s += '<div class="akEtiket">// 27. MADDE \u2014 EKS\u0130K KONU & AKILLI HATIRLATMA</div>';
    s += '<div class="akKutu">';
    if (!sm.length) s += '<div class="akSoluk">\u00D6nce \u00F6n s\u0131nava gir; eksik analizi ondan sonra \u00E7\u0131kar.</div>';
    zayif.forEach(function (a) {
      s += '<div class="akGorevSatir">\u26A0\uFE0F ' + kac(a.ad) + ' \u2014 ustal\u0131k %' + Math.round(a.yuzde || 0)
        + ' <span class="akSoluk">(\u00F6neri: ' + (AK.RENK[a.id] ? 'bu alandan 20 soru \u00E7\u00F6z' : '20 soru') + ')</span></div>';
    });
    if (vadeli.length) {
      s += '<div style="margin-top:8px"><b>Bug\u00FCn tekrar edilecek sorular:</b> ' + vadeli.length + ' adet</div>';
      s += '<div class="akSoluk">Aral\u0131kl\u0131 tekrar takvimi: 1 \u2192 3 \u2192 7 \u2192 16 \u2192 35 \u2192 75 g\u00FCn</div>';
    } else {
      s += '<div class="akSoluk" style="margin-top:8px">Bug\u00FCn vadesi gelen tekrar yok \u2014 yeni soru \u00E7\u00F6zerek kuyruk olu\u015Ftur.</div>';
    }
    s += '</div>';
    return s;
  }

  /* --------------------- 99/100: mentor tavsiyesi ------------------------- */
  function mentorTavsiye() {
    var v = AK.veri;
    var sm = AK.skillMatris ? AK.skillMatris() : [];
    var sirali = sm.slice().sort(function (a, b) { return (b.yuzde || 0) - (a.yuzde || 0); });
    var enIyi = sirali[0], enZayif = sirali[sirali.length - 1];
    var hedef = AK.hedef ? AK.hedef() : null;
    var satirlar = [];

    if (!v.profil) satirlar.push('Hen\u00FCz kimlik kart\u0131n yok \u2014 ilk ad\u0131m bu (Siber Kimlik).');
    if (!v.hedef) satirlar.push('Hedefini se\u00E7medin; hedef se\u00E7ilince b\u00FCt\u00FCn \u00F6neriler ki\u015Fiselle\u015Fir.');
    if (!v.onSinav) satirlar.push('\u00D6n s\u0131nav\u0131 vermedin; seviyeni \u00F6l\u00E7meden plan \u00E7\u0131kmaz.');

    if (v.xp > 0) satirlar.push('Bug\u00FCne kadar ' + v.xp + ' XP toplad\u0131n, seviye ' + (AK.seviye ? AK.seviye() : '-') + '.');
    if (enIyi && enIyi.yuzde) satirlar.push('En g\u00FC\u00E7l\u00FC alan\u0131n: ' + enIyi.ad + ' (%' + Math.round(enIyi.yuzde) + '). Bunu kariyerine dayanak yapabilirsin.');
    if (enZayif && (enZayif.yuzde || 0) < 60) satirlar.push('En \u00E7ok eksi\u011Fin: ' + enZayif.ad + ' \u2014 bu hafta ona a\u011F\u0131rl\u0131k ver.');

    var yanlis = AK.yanlisListesi ? AK.yanlisListesi() : [];
    if (yanlis.length) satirlar.push('Yanl\u0131\u015Flar defterinde ' + yanlis.length + ' soru var; ilk 5\u2019ini bug\u00FCn kapat.');

    if (hedef) satirlar.push('Hedefin "' + hedef.ad + '" \u2014 bu yol ' + hedef.alanlar.map(alanAdi).join(', ') + ' alanlar\u0131n\u0131 ister.');

    var g = AK.gun();
    var bugun = (v.gunluk && v.gunluk[g]) ? v.gunluk[g] : { soru: 0, dogru: 0 };
    satirlar.push('Bug\u00FCnk\u00FC durum: ' + (bugun.soru || 0) + ' soru, ' + (bugun.dogru || 0) + ' do\u011Fru.');

    var s = '<div class="akEtiket">// 99-100. MADDE \u2014 SANA \u00D6ZEL TAVS\u0130YE</div>';
    s += '<div class="akKutu">' + satirlar.map(function (t) { return '<div class="akGorevSatir">\uD83E\uDDE0 ' + kac(t) + '</div>'; }).join('') + '</div>';
    return s;
  }

  /* ------------------------------- çizim --------------------------------- */
  AK.modulEkle('mentor', function () {
    var ic = AK.icerik;
    ic.innerHTML = AK.baslik('AI \u00D6\u011ERETMEN & MENTOR', '\u00E7evrimd\u0131\u015F\u0131',
      'K\u00FCt\u00FCphanedeki ' + bolumler().length + ' b\u00F6l\u00FCm ve t\u00FCm kay\u0131tlar \u00FCzerinde \u00E7al\u0131\u015Fan kural motoru. \u0130nternet/anahtar gerekmez.');

    /* mentor tavsiyesi */
    ic.innerHTML += mentorTavsiye();
    ic.innerHTML += '<div style="height:10px"></div>';

    /* soru-cevap */
    ic.innerHTML += AK.kutu('<div class="akEtiket">// 41. MADDE \u2014 AI \u00D6\u011ERETMENE SOR</div>'
      + '<div class="akDugSira"><input id="aiSoru" class="akGirdi" style="flex:1;padding:10px" placeholder="ör. nmap ne i\u015Fe yarar? | parola g\u00FCvenli\u011Fi | log analizi nas\u0131l yap\u0131l\u0131r">'
      + '<button class="akDug" id="aiSor">SOR</button></div>'
      + '<div id="aiCevap" style="margin-top:10px"></div>');
    AK.$('#aiSor').onclick = function () {
      var q = AK.$('#aiSoru').value || '';
      if (!q.trim()) return;
      AK.veri.aiSoruSayisi = (AK.veri.aiSoruSayisi || 0) + 1; AK.kaydet();
      AK.$('#aiCevap').innerHTML = ogretmenCevap(q);
      AK.xpEkle(2, 'AI \u00F6\u011Fretmene soru');
    };
    AK.$('#aiSoru').addEventListener('keydown', function (e) { if (e.key === 'Enter') AK.$('#aiSor').click(); });

    ic.innerHTML += '<div style="height:10px"></div>';

    /* sesli öğretmen */
    ic.innerHTML += AK.kutu('<div class="akEtiket">// 42. MADDE \u2014 SESL\u0130 \u00D6\u011ERETMEN</div>'
      + '<div class="akDugSira"><button class="akDug" id="sesOku">\uD83D\uDD0A SON CEVABI D\u0130NLE</button>'
      + '<button class="akDug" id="sesDur">\u23F9 DURDUR</button>'
      + '<button class="akDug" data-hiz="0.8">YAVA\u015E</button>'
      + '<button class="akDug" data-hiz="1">NORMAL</button>'
      + '<button class="akDug" data-hiz="1.3">HIZLI</button></div>'
      + '<div class="akSoluk" style="margin-top:6px">Taray\u0131c\u0131n\u0131n T\u00FCrk\u00E7e sesi kullan\u0131l\u0131r (telefonda da \u00E7al\u0131\u015F\u0131r).</div>');
    AK.$('#sesOku').onclick = function () {
      var c = AK.$('#aiCevap');
      var metin = (c && c.textContent ? c.textContent : '').trim();
      if (!metin) metin = 'Merhaba Usta. Bir soru yaz, ben de kütüphaneden cevaplayayım.';
      sesliOku(metin.slice(0, 1200));
    };
    AK.$('#sesDur').onclick = sesDurdur;
    AK.$$('[data-hiz]').forEach(function (b) {
      b.onclick = function () { SES.hiz = parseFloat(b.getAttribute('data-hiz')); AK.not('Okuma h\u0131z\u0131: ' + SES.hiz + 'x', 'bilgi'); };
    });

    ic.innerHTML += '<div style="height:10px"></div>';
    ic.innerHTML += planCiz();
    ic.innerHTML += '<div style="height:10px"></div>';
    ic.innerHTML += dersListesi();

    AK.$$('[data-dersalan]').forEach(function (b) {
      b.onclick = function () {
        var id = b.getAttribute('data-dersalan');
        var bs = alanBolumleri(id);
        var alanAd = alanAdi(id);
        ic.innerHTML = AK.baslik(alanAd + ' \u2014 DERS L\u0130STES\u0130', bs.length + ' ders', 'Bir ders a\u00E7; sonunda ders i\u00E7i quiz var.');
        bs.forEach(function (x, i) {
          ic.innerHTML += '<div class="akKutu" style="margin-bottom:8px"><div style="display:flex;gap:8px;align-items:center">'
            + '<b style="flex:1">' + (i + 1) + '. ' + kac(x.ad) + '</b>'
            + (AK.veri.okuma[x.id] ? '<span class="akEtiket">\u2705 okundu</span>' : '')
            + '<button class="akDug" data-ders="' + x.id + '">DERS\u0130 A\u00C7</button></div></div>';
        });
        ic.innerHTML += '<div class="akDugSira"><button class="akDug" id="mentorGeri">\u2190 GER\u0130</button></div>';
        AK.$('#mentorGeri').onclick = function () { AK.git('mentor'); };
        AK.$$('[data-ders]').forEach(function (b2) {
          b2.onclick = function () {
            var bid = b2.getAttribute('data-ders');
            var bol = bs.filter(function (y) { return y.id === bid; })[0];
            var eskiIcerik = AK.icerik.innerHTML;
            ic.innerHTML = dersIcerik(bol);
            AK.$('#dersSes').onclick = function () {
              var m = AK.$('#dersMetin');
              sesliOku((m ? m.textContent : '').slice(0, 1500));
            };
            AK.$('#dersSesDur').onclick = sesDurdur;
            AK.$('#dersQuiz').onclick = function () {
              dersQuiz(bol, function () { ic.innerHTML = eskiIcerik; baglaDers(); });
            };
            AK.veri.okuma[bol.id] = 1;
            AK.xpEkle(10, 'Ders okundu: ' + bol.ad);
            AK.kaydet();
            if (AK.gorevKontrol) AK.gorevKontrol();
          };
        });
        function baglaDers() {
          AK.$$('[data-ders]').forEach(function (b3) {
            b3.onclick = function () {
              var bd = bs.filter(function (y) { return y.id === b3.getAttribute('data-ders'); })[0];
              ic.innerHTML = dersIcerik(bd);
              AK.$('#dersSes').onclick = function () { sesliOku((AK.$('#dersMetin') || { textContent: '' }).textContent.slice(0, 1500)); };
              AK.$('#dersSesDur').onclick = sesDurdur;
              AK.$('#dersQuiz').onclick = function () { dersQuiz(bd, function () { AK.git('mentor'); }); };
            };
          });
        }
      };
    });
  });
})();
