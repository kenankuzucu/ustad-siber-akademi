/* ==========================================================================
   ÜSTAD AKADEMİ — SİBER KUŞLAR (akademi-kus.js)  ·  PROFESYONEL SÜRÜM
   Ağacın sağında/solunda birbirine bakan 2 gerçekçi siber kuş (kanat katmanları,
   tüy detayı, gaga, göz, kuyruk, pençe). Biri "KALİ", biri "ÜSTAD" etiketli.
   ========================================================================== */
window.AKKUS = (function () {
  var kuruldu = false;

  /* profesyonel kuş SVG'si — kanat katmanları + tüy dokusu + detaylar */
  function kusSVG(id, parlak, orta, koyu, vurgu) {
    return '' +
      '<svg class="kusSvg" viewBox="0 0 132 100" width="104" height="79" aria-hidden="true">' +
        '<defs>' +
          '<linearGradient id="govde' + id + '" x1="0.1" y1="0" x2="0.7" y2="1">' +
            '<stop offset="0%" stop-color="' + parlak + '"/>' +
            '<stop offset="52%" stop-color="' + orta + '"/>' +
            '<stop offset="100%" stop-color="' + koyu + '"/>' +
          '</linearGradient>' +
          '<linearGradient id="kanat' + id + '" x1="0.2" y1="0" x2="0.8" y2="1">' +
            '<stop offset="0%" stop-color="' + vurgu + '"/>' +
            '<stop offset="60%" stop-color="' + orta + '"/>' +
            '<stop offset="100%" stop-color="' + koyu + '"/>' +
          '</linearGradient>' +
          '<linearGradient id="kuyruk' + id + '" x1="1" y1="0" x2="0" y2="0.6">' +
            '<stop offset="0%" stop-color="' + orta + '"/>' +
            '<stop offset="100%" stop-color="' + koyu + '"/>' +
          '</linearGradient>' +
        '</defs>' +

        /* --- arka kanat (gövdenin ardında, süpürülmüş) --- */
        '<path class="kusKanatArka" d="M60,40 C52,24 40,12 24,8 C36,20 50,34 58,44 Z"/>' +

        /* --- kuyruk (uzun, çatal — zarif) --- */
        '<path class="kusKuyruk" d="M44,50 C32,39 18,31 4,27 C18,39 32,50 44,55 Z"/>' +
        '<path class="kusKuyruk" d="M44,52 C30,50 14,50 2,54 C16,56 30,56 44,56 Z"/>' +
        '<path class="kusKuyruk" d="M44,53 C34,59 22,69 12,83 C26,71 38,60 46,57 Z"/>' +

        /* --- gövde (ince, akıcı) + kafa --- */
        '<path class="kusGovde" d="M44,52 C48,40 60,30 76,28 C88,27 98,30 104,35 C110,40 109,47 100,51 C86,58 72,63 60,65 C50,66 45,61 44,52 Z"/>' +

        /* --- taç (baş tepeliği) --- */
        '<path class="kusTac" d="M88,28 C90,19 97,17 101,22 C96,25 92,28 88,28 Z"/>' +

        /* --- gaga (üst + alt) --- */
        '<path class="kusGaga" d="M102,33 L130,40 L102,42 Z"/>' +
        '<path class="kusGagaAlt" d="M102,42 L123,44.5 L102,47 Z"/>' +

        /* --- göz + ışık --- */
        '<circle class="kusGoz" cx="94" cy="36" r="3.1"/>' +
        '<circle class="kusGozIsik" cx="95" cy="34.9" r="1.05"/>' +

        /* --- ön kanat katmanları (süpürülmüş, zarif) --- */
        '<path class="kusKanat1" d="M64,42 C58,24 44,8 20,4 C32,16 46,32 60,46 Z"/>' +
        '<path class="kusKanat2" d="M68,44 C62,30 50,18 30,12 C42,24 54,38 64,48 Z"/>' +
        '<path class="kusKanat3" d="M64,46 C58,36 48,28 34,26 C46,34 56,44 62,50 Z"/>' +

        /* --- tüy çizgileri (doku) --- */
        '<path class="kusTuyCizgi" d="M56,44 C44,28 30,18 16,16"/>' +
        '<path class="kusTuyCizgi" d="M60,46 C50,32 38,24 26,24"/>' +
        '<path class="kusTuyCizgi" d="M46,50 C34,42 22,38 12,40"/>' +

        /* --- pençeler (gövde altında toplu) --- */
        '<path class="kusPençe" d="M70,65 L66,73 M66,73 L61,77 M66,73 L70,77"/>' +
        '<path class="kusPençe" d="M80,64 L78,72 M78,72 L73,76 M78,72 L82,76"/>' +
      '</svg>';
  }

  function kur() {
    if (kuruldu) return;
    var alan = document.querySelector('.agacAlan');
    if (!alan) return;
    kuruldu = true;

    /* sol kuş — KALİ (siber turkuaz), ağaca doğru sağa bakar */
    var kusSol = document.createElement('div');
    kusSol.className = 'siberKus kusSol';
    kusSol.innerHTML =
      '<span class="kusEtiket kalEtiket">KALİ</span>' +
      kusSVG('K', '#9dfff0', '#00e5ff', '#00698f', '#d6fbff');

    /* sağ kuş — ÜSTAD (siber altın), ağaca doğru sola bakar (aynalı) */
    var kusSag = document.createElement('div');
    kusSag.className = 'siberKus kusSag';
    kusSag.innerHTML =
      '<span class="kusEtiket ustEtiket">ÜSTAD KENAN</span>' +
      kusSVG('U', '#fff4c2', '#ffc400', '#8a5a00', '#fff9dd');

    alan.appendChild(kusSol);
    alan.appendChild(kusSag);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', kur);
  } else {
    kur();
  }

  return { kur: kur };
})();
