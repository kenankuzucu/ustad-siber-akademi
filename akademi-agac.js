/* ==========================================================================
   ÜSTAD AKADEMİ — SİBER AĞAÇ v2 (akademi-agac.js)
   PROFESYONEL ağaç: sabit tohumlu, kavisli dallar, yuvarlak taç, kabuk dokusu,
   neon ışıltı. Düşen yapraklarda siber kod (tam belirgin). Günlük azim sözü.
   ========================================================================== */
window.AKAGAC = (function () {
  var kodlar = ['0x7F', 'nmap', 'sudo', 'root@kali', 'SHA-256', 'AES-256', 'TCP/443', 'SQL',
    'XSS', 'RSA-4096', 'curl', 'git push', 'DNS', 'SSH', 'wireshark', 'iptables',
    'metasploit', 'python3', 'while(1)', '&&', '||', '$', '#!/bin/bash', 'SELECT *',
    'ping -c 4', 'traceroute', 'john', 'hashcat', 'base64', 'chmod 755', '0xDEAD'];
  var sozler = [
    'Başarı, her gün tekrarlanan küçük çabaların toplamıdır.',
    'Vazgeçmek en kolay yoldur; asıl güç azimle devam etmektir.',
    'Bir hacker, dün yapamadığını bugün yeniden dener.',
    'Köklerin ne kadar derin olursa, fırtına seni o kadar zor söker.',
    'Bilgi, çalışanın elinde kılıç; çalışmayanın elinde paslı bir bıçaktır.',
    'Düşmek değil, kalkmamak kaybettirir.',
    'Her ustalık, bir zamanlar acemi olan birinin sabrıdır.',
    'Karanlıkta bile öğrenmeye devam et; ışık emekle gelir.',
    'Bugün attığın küçük adım, yarının büyük sıçramasıdır.',
    'Sabır acıdır ama meyvesi tatlıdır.',
    'Kod yazmayı öğrenmek, konuşmayı öğrenmek gibidir; önce harfler, sonra cümleler.',
    'Yetenek başlangıçtır; azim bitiş çizgisini getirir.'
  ];

  var kuruldu = false;
  function $(id) { return document.getElementById(id); }

  /* sabit tohumlu rastgele (deterministik → dengeli, profesyonel ağaç) */
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /* ---- PROFESYONEL AĞAÇ ---- */
  function agacCiz(cv) {
    var c = cv.getContext('2d');
    var W = cv.width, H = cv.height;
    c.clearRect(0, 0, W, H);
    var R = mulberry32(20240922);

    // taç çevresi aura
    var aura = c.createRadialGradient(W / 2, H * 0.30, 16, W / 2, H * 0.30, 170);
    aura.addColorStop(0, 'rgba(43,240,160,.20)');
    aura.addColorStop(.5, 'rgba(43,240,160,.07)');
    aura.addColorStop(1, 'rgba(43,240,160,0)');
    c.fillStyle = aura; c.fillRect(0, 0, W, H);

    // zemin kök ışığı
    var zemin = c.createRadialGradient(W / 2, H - 4, 8, W / 2, H - 4, 120);
    zemin.addColorStop(0, 'rgba(224,154,63,.30)');
    zemin.addColorStop(1, 'rgba(224,154,63,0)');
    c.fillStyle = zemin; c.fillRect(W / 2 - 120, H - 128, 240, 128);

    // ---- dallar: kavisli (quadratic) + kontrollü açı ----
    function dal(x1, y1, aci, uz, kalin, d, egr) {
      if (d <= 0 || uz < 1.6) return;
      var x2 = x1 + Math.cos(aci) * uz;
      var y2 = y1 + Math.sin(aci) * uz;
      var cx = x1 + Math.cos(aci + egr) * uz * 0.5;
      var cy = y1 + Math.sin(aci + egr) * uz * 0.5;

      var g = c.createLinearGradient(x1, y1, x2, y2);
      if (d >= 7) { g.addColorStop(0, '#33200f'); g.addColorStop(1, '#4a2f18'); }
      else if (d >= 5) { g.addColorStop(0, '#4a2f18'); g.addColorStop(1, '#6b4420'); }
      else if (d >= 3) { g.addColorStop(0, '#6b4420'); g.addColorStop(1, '#5c7a30'); }
      else { g.addColorStop(0, '#4a7028'); g.addColorStop(1, '#2a7032'); }

      c.lineCap = 'round';
      c.strokeStyle = g;
      c.lineWidth = kalin;
      c.shadowColor = d >= 4 ? 'rgba(224,154,63,.5)' : 'rgba(43,240,160,.5)';
      c.shadowBlur = d >= 6 ? 6 : 3;
      c.beginPath(); c.moveTo(x1, y1); c.quadraticCurveTo(cx, cy, x2, y2); c.stroke();

      // kabuk dokusu (ana gövdede)
      if (d >= 6 && kalin > 2.5) {
        c.shadowBlur = 0; c.strokeStyle = 'rgba(0,0,0,.22)'; c.lineWidth = 0.7;
        c.beginPath(); c.moveTo(x1 + (R() - .5) * kalin * .5, y1 + 2);
        c.quadraticCurveTo(cx + (R() - .5) * kalin * .5, cy, x2 + (R() - .5) * kalin * .5, y2); c.stroke();
      }

      // çocuk dallar (kontrollü, dengeli)
      var cocuk = d >= 6 ? 3 : (d >= 4 ? 2 : (R() < .55 ? 2 : 1));
      if (cocuk === 1) {
        dal(x2, y2, aci + (R() - .5) * .5, uz * .76, kalin * .7, d - 1, (R() - .5) * .55);
      } else {
        for (var i = 0; i < cocuk; i++) {
          var yay = (i / (cocuk - 1) - .5) * 1.15;
          var a2 = aci + yay + (R() - .5) * .22;
          dal(x2, y2, a2, uz * (.72 + R() * .08), kalin * .72, d - 1, (R() - .5) * .6);
        }
      }
    }

    // gövde
    dal(W / 2, H - 2, -Math.PI / 2, 56, 17, 9, 0);
    // iki ana yan gövde
    dal(W / 2, H - 30, -Math.PI / 2 - 0.62, 38, 11, 8, -.15);
    dal(W / 2, H - 30, -Math.PI / 2 + 0.62, 38, 11, 8, .15);

    // kök kabarıklığı
    var kkok = c.createRadialGradient(W / 2, H - 2, 2, W / 2, H - 2, 26);
    kkok.addColorStop(0, 'rgba(80,52,26,.95)'); kkok.addColorStop(1, 'rgba(80,52,26,0)');
    c.fillStyle = kkok;
    c.beginPath(); c.arc(W / 2, H - 2, 26, 0, 6.283); c.fill();

    // ---- YUVARLAK TAÇ (canopy): yumuşak katmanlı daireler ----
    var tx = W / 2, ty = H * 0.30;
    var tacKatmanlar = [
      [0, 0, 82, 'rgba(43,240,160,.10)'],
      [-36, -14, 54, 'rgba(43,240,160,.12)'],
      [36, -14, 54, 'rgba(43,240,160,.12)'],
      [0, -28, 50, 'rgba(0,255,140,.13)'],
      [-22, 16, 42, 'rgba(43,240,160,.11)'],
      [22, 16, 42, 'rgba(43,240,160,.11)']
    ];
    tacKatmanlar.forEach(function (t) {
      var gr = c.createRadialGradient(tx + t[0], ty + t[1], 4, tx + t[0], ty + t[1], t[2]);
      gr.addColorStop(0, t[3]);
      gr.addColorStop(1, 'rgba(43,240,160,0)');
      c.fillStyle = gr;
      c.beginPath(); c.arc(tx + t[0], ty + t[1], t[2], 0, 6.283); c.fill();
    });

    // ---- taç içinde parlayan yaprak noktaları ----
    c.shadowColor = 'rgba(43,240,160,.9)';
    c.shadowBlur = 10;
    for (var n = 0; n < 240; n++) {
      var a = R() * 6.283;
      var r = Math.sqrt(R()) * 82;
      var px = tx + Math.cos(a) * r;
      var py = ty + Math.sin(a) * r * 0.82;
      var renkler = ['rgba(43,240,160,.9)', 'rgba(0,255,140,.85)', 'rgba(168,240,255,.7)', 'rgba(224,154,63,.6)'];
      c.fillStyle = renkler[Math.floor(R() * renkler.length)];
      c.beginPath(); c.arc(px, py, 1.2 + R() * 1.8, 0, 6.283); c.fill();
    }
    c.shadowBlur = 0;
  }

  /* ---- düşen kod yaprakları (gerçek yaprak görünümü) ---- */
  var yaprakRenkleri = [
    'linear-gradient(135deg, #20e382 0%, #00c853 50%, #009624 100%)',
    'linear-gradient(135deg, #35f0a0 0%, #12b45c 50%, #0a7a38 100%)',
    'linear-gradient(135deg, #a8e05f 0%, #6bbf3a 50%, #3d8a1f 100%)',
    'linear-gradient(135deg, #ffd968 0%, #e0a91f 50%, #a87a10 100%)'
  ];

  function yaprakAt(alan) {
    if (!alan) return;
    var s = document.createElement('span');
    s.className = 'agacYaprak';
    s.textContent = kodlar[Math.floor(Math.random() * kodlar.length)];
    s.style.setProperty('--yaprakRenk', yaprakRenkleri[Math.floor(Math.random() * yaprakRenkleri.length)]);
    s.style.left = (12 + Math.random() * 76) + '%';
    s.style.setProperty('--kay', (Math.random() * 70 - 35) + 'px');
    s.style.setProperty('--don', (Math.random() * 540 - 270) + 'deg');
    s.style.animationDuration = (5.5 + Math.random() * 3) + 's';
    alan.appendChild(s);
    setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 9500);
  }

  /* ---- günlük azim sözü ---- */
  function sozBaslat(el) {
    if (!el) return;
    var gun = Math.floor(Date.now() / 86400000);
    var i = 0;
    function goster() {
      var s = sozler[(gun + i) % sozler.length];
      el.style.opacity = '0';
      setTimeout(function () { el.innerHTML = '\u275D ' + s + ' \u275E'; el.style.opacity = '1'; }, 500);
      i++;
    }
    goster();
    setInterval(goster, 14000);
  }

  /* ---- kurulum ---- */
  function kur() {
    if (kuruldu) return; kuruldu = true;
    var sag = document.querySelector('.brifSag');
    if (!sag) return;

    var kutu = document.createElement('div');
    kutu.className = 'agacKutu';
    kutu.innerHTML =
      '<div class="agacEtiket">// SİBER AĞAÇ · BİLGİ BÜYÜR</div>' +
      '<div class="agacAlan"><canvas id="agacTuval" width="520" height="300"></canvas></div>' +
      '<div class="agacSoz" id="agacSoz"></div>';
    sag.insertBefore(kutu, sag.firstChild);

    setTimeout(function () { var cv = $('agacTuval'); if (cv) agacCiz(cv); }, 120);

    var alan = kutu.querySelector('.agacAlan');
    var periyot = 600;
    function damla() {
      if (!document.body.contains(kutu)) return;
      yaprakAt(alan);
      setTimeout(damla, periyot);
      periyot = 500 + Math.random() * 450;
    }
    setTimeout(damla, 900);

    sozBaslat($('agacSoz'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', kur);
  } else { kur(); }

  return { kur: kur };
})();
