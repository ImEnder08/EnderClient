'use strict';

/* ═══════════════════════════════════════════
   MOTORE DEI COSMETICI di Ender Client (per lo showcase del sito)
   Preso dal guardaroba del launcher (ender-client/wardrobe.js): stesso
   catalogo, stesse texture generate (traduzione di CosmeticTextures.java)
   e stessi modelli 3D (CosmeticModels.java e i modelli dei pet).
   Se cambi i cosmetici nel launcher, ricopia qui la parte fino a texIds.
   Spazio dei modelli: quello della mod (blocchi, y in giu', davanti = -z,
   origine al collo); un gruppo con scala (16, -16, -16) lo porta in quello
   di skinview3d (pixel, y in su, davanti = +z, origine al collo).
═══════════════════════════════════════════ */
const EnderCosmetics = (() => {
  // Skin usata dal pet "Mini te" (quella del visitatore, se la sceglie).
  const W = { skinUrl: null };
  // File incorporati da js/assets-inline.js (funziona anche da file://), altrimenti il percorso normale.
  const A = (path) => (window.ENDER_ASSETS && window.ENDER_ASSETS[path]) || path;
  const loadJson = async (path) => {
    const inline = window.ENDER_ASSETS && window.ENDER_ASSETS[path];
    return inline && typeof inline === 'object' ? inline : (await fetch(path)).json();
  };
  // ─── catalogo (Cosmetic.java: gli id non cambiano mai) ───
  const SLOTS = [
    { id: 'cape', label: 'Mantelli' }, { id: 'wings', label: 'Ali' }, { id: 'head', label: 'Testa' },
    { id: 'bandana', label: 'Bandane' }, { id: 'pet', label: 'Pet' }, { id: 'extra', label: 'Extra' },
  ];
  const C = (id, slot, label, description, color) => ({ id, slot, label, description, color });
  const CATALOG = [
    C('hacker', 'cape', 'Hacker', 'Pioggia di 0 e 1 che scorre', 0x2BFF6A),
    C('galaxy', 'cape', 'Galassia', 'Nebulose e stelle in movimento', 0x8A5CFF),
    C('ender', 'cape', 'Ender', 'Il logo di Ender Client', 0x7B2CFF),
    C('flames', 'cape', 'Fiamme', 'Fuoco che sale dal fondo', 0xFF7A1A),
    C('aurora', 'cape', 'Aurora', 'Aurora boreale che ondeggia', 0x3CFFC8),
    C('white_flames', 'cape', 'Fiamme bianche', 'Fuoco bianco su fondo nero', 0xE8E8E8),
    C('purple_flames', 'cape', 'Fiamme viola', 'Fuoco viola su fondo nero', 0xB04CFF),
    C('red_galaxy', 'cape', 'Galassia rossa', 'Nebulose rosse e stelle in movimento', 0xFF3A4A),
    C('andromeda', 'cape', 'Andromeda', 'Galassia a spirale in alta definizione', 0x6C8CFF),
    C('neworder', 'cape', 'NewOrder', 'Galassia bianca col logo NewOrder', 0xE6E8F2),
    C('cosmic_wings', 'wings', 'Ali cosmiche', "L'universo dentro le piume", 0x9A6CFF),
    C('angel_wings', 'wings', "Ali d'angelo", 'Piume bianche', 0xF4F1EA),
    C('demon_wings', 'wings', 'Ali oscure', 'Piume nere dai bordi rossi', 0xC0182E),
    C('galaxy_bat_wings', 'wings', 'Ali galattiche', "Ali da pipistrello con l'universo dentro", 0x8A5CFF),
    C('red_bat_wings', 'wings', 'Ali galattiche rosse', 'Ali da pipistrello con una galassia rossa', 0xFF3A4A),
    C('black_bat_wings', 'wings', 'Ali nere', 'Ali da pipistrello nere', 0x3A3A48),
    C('neworder_bat_wings', 'wings', 'Ali NewOrder', 'Ali da pipistrello con la galassia bianca', 0xE6E8F2),
    C('halo', 'head', 'Aureola', 'Anello dorato che fluttua', 0xFFD45A),
    C('ender_halo', 'head', 'Aureola Ender', 'Anello viola che fluttua', 0xA66CFF),
    C('horns', 'head', 'Corna', 'Corna da demone con la punta accesa', 0xE0283A),
    C('crown', 'head', 'Corona', "Corona d'oro con le gemme", 0xFFC233),
    C('neworder_halo', 'head', 'Aureola NewOrder', 'Anello bianco che fluttua', 0xF2F4FF),
    C('white_flames_bandana', 'bandana', 'Fiamme bianche', 'Bandana nera col fuoco bianco', 0xE8E8E8),
    C('purple_flames_bandana', 'bandana', 'Fiamme viola', 'Bandana nera col fuoco viola', 0xB04CFF),
    C('galaxy_bandana', 'bandana', 'Galassia', "Bandana con l'universo", 0x8A5CFF),
    C('red_galaxy_bandana', 'bandana', 'Galassia rossa', 'Bandana con una galassia rossa', 0xFF3A4A),
    C('neworder_bandana', 'bandana', 'NewOrder', 'Galassia bianca col logo NewOrder davanti', 0xE6E8F2),
    C('dog', 'pet', 'Cagnolino', 'Ti segue, si siede quando sei fermo e gioca', 0xD98B3A),
    C('dragon', 'pet', 'Draghetto', 'Ti vola accanto e ogni tanto ti gira attorno', 0x6A4C8C),
    C('cat', 'pet', 'Gattino', 'Un gatto nero che ti cammina accanto', 0x2A2A30),
    C('snow_fox', 'pet', 'Volpe bianca', 'Una volpina delle nevi che ti segue saltellando', 0xEDEFF5),
    C('mini_me', 'pet', 'Mini te', 'Un peluche con la tua skin che ti segue', 0x6FA8DC),
    C('orbit', 'extra', 'Orbita', 'Cristalli che ti girano attorno', 0xB46CFF),
    C('magic_circle', 'extra', 'Cerchio magico', 'Un cerchio di rune che gira sotto i tuoi piedi', 0xA070FF),
    C('sparkles', 'extra', 'Scintille', 'Scintille che ti salgono attorno a spirale', 0xFFD45A),
    C('demon_tail', 'extra', 'Coda da demone', 'Una coda che ondeggia, con la punta a cuore', 0xB0182E),
  ];
  const byId = (id) => CATALOG.find((c) => c.id === id);

  // ═══════════════════════════════════════════ colori e numeri (come CosmeticTextures.java)

  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  function smooth(e0, e1, x) { const t = clamp01((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t); }
  function argb(r, g, b) {
    const c = (v) => Math.max(0, Math.min(255, v | 0));
    return (0xFF000000 | (c(r) << 16) | (c(g) << 8) | c(b)) >>> 0;
  }
  function lerp(from, to, t) {
    t = clamp01(t);
    const ch = (s) => (((from >>> s) & 0xFF) + (((to >>> s) & 0xFF) - ((from >>> s) & 0xFF)) * t) | 0;
    return ((ch(24) << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0)) >>> 0;
  }
  const floorMod = (a, n) => ((a % n) + n) % n;

  // java.util.Random (stessi numeri della mod per stelle e rune).
  class JavaRandom {
    constructor(seed) { this.seed = (BigInt(seed) ^ 0x5DEECE66Dn) & ((1n << 48n) - 1n); }
    next(bits) {
      this.seed = (this.seed * 0x5DEECE66Dn + 0xBn) & ((1n << 48n) - 1n);
      return Number(BigInt.asIntN(32, this.seed >> BigInt(48 - bits)));
    }
    nextInt(bound) {
      if ((bound & -bound) === bound) return Number((BigInt(bound) * BigInt(this.next(31))) >> 31n);
      let bits; let val;
      do { bits = this.next(31); val = bits % bound; } while (((bits - val + (bound - 1)) | 0) < 0);
      return val;
    }
    nextFloat() { return this.next(24) / (1 << 24); }
  }

  // Immagine ARGB (come NativeImage): data[y * w + x].
  class Img {
    constructor(w, h) { this.w = w; this.h = h; this.data = new Uint32Array(w * h); }
    set(x, y, c) { if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.data[y * this.w + x] = c >>> 0; }
    get(x, y) { return (x >= 0 && y >= 0 && x < this.w && y < this.h) ? this.data[y * this.w + x] : 0; }
  }

  function hash(x, y, seed) {
    let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 1442695041)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h ^= h >>> 16;
    return (h & 0xFFFFFF) / 0xFFFFFF;
  }
  function valueNoise(x, y, period, seed) {
    const x0 = Math.floor(x); const y0 = Math.floor(y);
    const fx = x - x0; const fy = y - y0;
    const sx = fx * fx * (3 - 2 * fx); const sy = fy * fy * (3 - 2 * fy);
    const v00 = hash(floorMod(x0, period), floorMod(y0, period), seed);
    const v10 = hash(floorMod(x0 + 1, period), floorMod(y0, period), seed);
    const v01 = hash(floorMod(x0, period), floorMod(y0 + 1, period), seed);
    const v11 = hash(floorMod(x0 + 1, period), floorMod(y0 + 1, period), seed);
    const top = v00 + (v10 - v00) * sx;
    const bottom = v01 + (v11 - v01) * sx;
    return top + (bottom - top) * sy;
  }

  // ─── universo condiviso (nebulose + stelle che scorrono) ───
  const Universe = (() => {
    const SIZE = 256;
    const STARS = 320;
    let nebula = null;
    const FRAME = new Uint32Array(SIZE * SIZE);
    let frameTick = -1e9;
    const sx = []; const sy = []; const bright = []; const phase = []; const speed = []; const tint = [];
    function fbm(px, py, seed) {
      let sum = 0; let amp = 1; let total = 0;
      for (let o = 0; o < 5; o++) {
        const period = 4 << o;
        sum += amp * valueNoise(px * period / SIZE, py * period / SIZE, period, seed + o * 101);
        total += amp; amp *= 0.5;
      }
      return sum / total;
    }
    function build() {
      nebula = new Uint32Array(SIZE * SIZE);
      for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
          const purple = smooth(0.42, 0.78, fbm(x, y, 11));
          const pink = smooth(0.55, 0.86, fbm(x, y, 29)) * 0.75;
          const blue = smooth(0.46, 0.82, fbm(x, y, 47)) * 0.65;
          const dust = 0.55 + 0.45 * smooth(0.3, 0.7, fbm(x, y, 83));
          nebula[y * SIZE + x] = argb((6 + 118 * purple + 190 * pink + 18 * blue) * dust, (3 + 28 * purple + 36 * pink + 80 * blue) * dust,
            (20 + 215 * purple + 160 * pink + 225 * blue) * dust) & 0xFFFFFF;
        }
      }
      const r = new JavaRandom(1234);
      for (let i = 0; i < STARS; i++) {
        const near = i % 4 === 0;
        sx[i] = r.nextFloat() * SIZE; sy[i] = r.nextFloat() * SIZE;
        bright[i] = near ? 0.65 + r.nextFloat() * 0.35 : 0.25 + r.nextFloat() * 0.45;
        phase[i] = r.nextFloat() * 6.28;
        speed[i] = near ? 0.40 : 0.15;
        const k = r.nextInt(4);
        tint[i] = k === 0 ? 0xC8D8FF : k === 1 ? 0xFFD8F4 : 0xFFFFFF;
      }
    }
    function addLight(x, y, t, k) {
      const i = (y & (SIZE - 1)) * SIZE + (x & (SIZE - 1));
      const c = FRAME[i];
      FRAME[i] = argb(((c >> 16) & 0xFF) + ((t >> 16) & 0xFF) * k, ((c >> 8) & 0xFF) + ((t >> 8) & 0xFF) * k, (c & 0xFF) + (t & 0xFF) * k) & 0xFFFFFF;
    }
    function frame(tick) {
      if (!nebula) build();
      if (frameTick === tick) return FRAME;
      frameTick = tick;
      const shift = (tick / 5) | 0;
      for (let y = 0; y < SIZE; y++) {
        const src = ((y + ((shift / 2) | 0)) & (SIZE - 1)) * SIZE;
        const dst = y * SIZE;
        for (let x = 0; x < SIZE; x++) FRAME[dst + x] = nebula[src + ((x + shift) & (SIZE - 1))];
      }
      for (let i = 0; i < STARS; i++) {
        const x = floorMod((sx[i] - tick * speed[i]) | 0, SIZE);
        const y = floorMod((sy[i] - tick * speed[i] * 0.5) | 0, SIZE);
        const k = bright[i] * (0.6 + 0.4 * Math.sin(phase[i] + tick * 0.12 * (1 + i % 3)));
        addLight(x, y, tint[i], k);
        if (bright[i] > 0.85) {
          addLight(x + 1, y, tint[i], k * 0.45); addLight(x - 1, y, tint[i], k * 0.45);
          addLight(x, y + 1, tint[i], k * 0.45); addLight(x, y - 1, tint[i], k * 0.45);
        }
      }
      return FRAME;
    }
    return { SIZE, frame, get nebula() { if (!nebula) build(); return nebula; } };
  })();

  const capeAreaW = (img) => (46 * img.w / 64) | 0;
  const capeAreaH = (img) => (22 * img.w / 64) | 0;
  function redShift(rgb) {
    return argb(rgb & 0xFF, ((rgb >> 8) & 0xFF) * 0.55, ((rgb >> 16) & 0xFF) * 0.5) & 0xFFFFFF;
  }
  // NewOrder: la galassia viola diventa bianca e argento.
  function whiteShift(rgb) {
    const l = ((rgb >> 16) & 0xFF) * 0.30 + ((rgb >> 8) & 0xFF) * 0.59 + (rgb & 0xFF) * 0.11;
    const v = Math.min(255, l * 1.5);
    return argb(v * 0.95, v * 0.97, v) & 0xFFFFFF;
  }

  // ═══════════════════════════════════════════ texture (pittori)

  function hackerRain() {
    const D = [['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'], ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.']]
      .map((rows) => rows.map((r) => [...r].map((ch) => ch === '#')));
    const CW = 6; const CH = 9;
    let cols; let rows; let head; let spd; let trail; let digits;
    const reset = (c, anywhere) => {
      head[c] = anywhere ? Math.random() * rows * 1.5 - rows * 0.5 : -Math.random() * rows * 0.6;
      spd[c] = 0.16 + Math.random() * 0.30;
      trail[c] = 5 + Math.floor(Math.random() * 10);
    };
    return (img) => {
      const w = capeAreaW(img); const h = capeAreaH(img);
      if (!head) {
        cols = (w / CW) | 0; rows = ((h / CH) | 0) + 1;
        head = new Float32Array(cols); spd = new Float32Array(cols); trail = new Int32Array(cols);
        digits = new Uint8Array(cols * rows);
        for (let c = 0; c < cols; c++) reset(c, true);
        for (let i = 0; i < digits.length; i++) digits[i] = Math.random() < 0.5 ? 1 : 0;
      }
      for (let c = 0; c < cols; c++) { head[c] += spd[c]; if (head[c] - trail[c] > rows) reset(c, false); }
      for (let i = (digits.length / 40) | 0; i > 0; i--) digits[Math.floor(Math.random() * digits.length)] ^= 1;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) img.set(x, y, 0xFF020A05);
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const d = head[c] - r;
          const color = d >= 0 && d < 1 ? 0xFFE6FFEA : d >= 1 && d < trail[c] ? lerp(0xFF0C3A1A, 0xFF2BFF6A, Math.pow(1 - (d - 1) / trail[c], 1.6)) : 0xFF0C3A1A;
          const g = D[digits[c * rows + r]];
          const x0 = c * CW; const y0 = r * CH + 1;
          for (let gy = 0; gy < g.length; gy++) {
            const py = y0 + gy;
            if (py >= h) break;
            for (let gx = 0; gx < g[gy].length; gx++) if (g[gy][gx]) img.set(x0 + gx, py, color);
          }
        }
      }
      return true;
    };
  }

  function galaxy(red, band, white) {
    return (img, tick) => {
      const w = band ? img.w : capeAreaW(img); const h = band ? img.h : capeAreaH(img);
      const f = Universe.frame(tick);
      // Alta risoluzione: l'universo si legge piu' piano (stessa galassia, piu' definita).
      const k = Math.max(1, (img.w / (band ? 256 : 512)) | 0);
      for (let y = 0; y < h; y++) {
        const row = (((y / k) | 0) & 255) * 256;
        for (let x = 0; x < w; x++) {
          const c = f[row + (((x / k) | 0) & 255)];
          img.set(x, y, 0xFF000000 | (white ? whiteShift(c) : red ? redShift(c) : c));
        }
      }
      return true;
    };
  }

  // ─── logo NewOrder (solo la parte bianca), rimpicciolito una volta per grandezza ───
  let newOrderLogo = null;
  let newOrderReady = false;
  const newOrderScaled = new Map();
  function loadNewOrderLogo() {
    if (newOrderLogo) return newOrderLogo;
    newOrderLogo = new Promise((resolve) => {
      const im = new Image();
      im.onload = () => {
        const cv = document.createElement('canvas'); cv.width = im.width; cv.height = im.height;
        const ctx = cv.getContext('2d'); ctx.drawImage(im, 0, 0);
        const data = ctx.getImageData(0, 0, im.width, im.height).data;
        const alpha = new Float32Array(im.width * im.height);
        for (let i = 0; i < alpha.length; i++) alpha[i] = data[i * 4 + 3] / 255;
        newOrderReady = { w: im.width, h: im.height, alpha };
        resolve(newOrderReady);
      };
      im.onerror = () => resolve(null);
      im.src = A('assets/cosmetic/neworder_logo.png');
    });
    return newOrderLogo;
  }
  function stampNewOrder(img, cx, cy, width) {
    const src = newOrderReady;
    if (!src || width <= 0) return;
    let scaled = newOrderScaled.get(width);
    if (!scaled) {
      const ht = Math.max(1, Math.round(width * src.h / src.w));
      const out = new Float32Array(width * ht); const step = src.w / width;
      for (let ty = 0; ty < ht; ty++) {
        for (let tx = 0; tx < width; tx++) {
          let sum = 0; let count = 0;
          for (let sy = (ty * step) | 0; sy < Math.min(src.h, ((ty + 1) * step | 0) + 1); sy++) {
            for (let sx = (tx * step) | 0; sx < Math.min(src.w, ((tx + 1) * step | 0) + 1); sx++) { sum += src.alpha[sy * src.w + sx]; count++; }
          }
          out[ty * width + tx] = count ? smooth(0.22, 0.62, sum / count) : 0;
        }
      }
      scaled = { h: ht, a: out };
      newOrderScaled.set(width, scaled);
    }
    const left = cx - (width >> 1); const top = cy - (scaled.h >> 1);
    for (let y = 0; y < scaled.h; y++) {
      for (let x = 0; x < width; x++) {
        const a = scaled.a[y * width + x];
        if (a > 0.01) img.set(left + x, top + y, lerp(img.get(left + x, top + y), 0xFFFFFFFF, a));
      }
    }
  }
  function newOrder(band) {
    const sky = galaxy(false, true, true);
    loadNewOrderLogo();
    return (img, tick) => {
      if (band) {
        sky(img, tick);
        const logoH = Math.round(img.h * 0.86);
        if (newOrderReady) stampNewOrder(img, img.w >> 3, img.h >> 1, Math.round(logoH * newOrderReady.w / newOrderReady.h));
      } else {
        const w = capeAreaW(img); const h = capeAreaH(img); const f = Universe.frame(tick);
        const k = Math.max(1, (img.w / 512) | 0);
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) img.set(x, y, 0xFF000000 | whiteShift(f[(((y / k) | 0) & 255) * 256 + (((x / k) | 0) & 255)]));
        const s = (img.w / 64) | 0;
        stampNewOrder(img, s + 5 * s, s + ((16 * s * 9 / 20) | 0), (10 * s * 17 / 20) | 0);
      }
      return true;
    };
  }

  let hubLogo = null;
  function loadLogo() {
    if (hubLogo) return hubLogo;
    hubLogo = new Promise((resolve) => {
      const im = new Image();
      im.onload = () => {
        const cv = document.createElement('canvas'); cv.width = im.width; cv.height = im.height;
        const ctx = cv.getContext('2d'); ctx.drawImage(im, 0, 0);
        resolve({ w: im.width, h: im.height, data: ctx.getImageData(0, 0, im.width, im.height).data });
      };
      im.onerror = () => resolve(null);
      im.src = A('assets/cosmetic/hub_logo.png');
    });
    return hubLogo;
  }

  function enderCape(img, logo) {
    const s = (img.w / 64) | 0; const w = capeAreaW(img); const h = capeAreaH(img);
    const fx = s; const fy = s; const fw = 10 * s; const fh = 16 * s;
    for (let y = 0; y < h; y++) {
      const t = clamp01((y - fy) / fh);
      const base = lerp(0xFF3A1384, 0xFF0C0424, smooth(0, 1, t));
      for (let x = 0; x < w; x++) {
        const sheen = Math.max(0, Math.cos((x + y * 0.6) / (14 * s)) - 0.6) * 0.25;
        img.set(x, y, lerp(base, 0xFF8E5CFF, sheen));
      }
    }
    for (let y = fy + ((fh * 3 / 4) | 0); y < fy + fh; y++) {
      const k = (y - (fy + ((fh * 3 / 4) | 0))) / (fh / 4);
      for (let x = fx; x < fx + fw; x++) img.set(x, y, lerp(img.get(x, y), 0xFF7B2CFF, k * k * 0.55));
    }
    const inset = (s * 3 / 4) | 0; const line = Math.max(1, (s / 4) | 0);
    for (let y = fy + inset; y < fy + fh - inset; y++) {
      for (let x = fx + inset; x < fx + fw - inset; x++) {
        const edge = x < fx + inset + line || x >= fx + fw - inset - line || y < fy + inset + line || y >= fy + fh - inset - line;
        if (edge) img.set(x, y, lerp(img.get(x, y), 0xFFB48CFF, 0.75));
      }
    }
    if (!logo) return true;
    const size = (fw * 7 / 10) | 0; const cx = fx + ((fw / 2) | 0); const cy = fy + ((fh * 2 / 5) | 0);
    const step = logo.w / size; const left = cx - ((size / 2) | 0); const top = cy - ((size / 2) | 0);
    for (let ty = 0; ty < size; ty++) {
      for (let tx = 0; tx < size; tx++) {
        let a = 0; let r = 0; let g = 0; let b = 0; let count = 0;
        for (let sy = (ty * step) | 0; sy < ((ty + 1) * step) | 0; sy++) {
          for (let sx2 = (tx * step) | 0; sx2 < ((tx + 1) * step) | 0; sx2++) {
            const i = (sy * logo.w + sx2) * 4;
            const pa = logo.data[i + 3] / 255;
            a += pa; r += logo.data[i] * pa; g += logo.data[i + 1] * pa; b += logo.data[i + 2] * pa; count++;
          }
        }
        if (!count || a <= 0) continue;
        const color = lerp(argb(r / a, g / a, b / a), 0xFFFFFFFF, 0.35);
        img.set(left + tx, top + ty, lerp(img.get(left + tx, top + ty), color, a / count));
      }
    }
    return true;
  }

  function flames(tones) {
    return (img, tick) => {
      if (tick % 2 !== 0) return false;
      const s = (img.w / 64) | 0; const w = capeAreaW(img); const h = capeAreaH(img);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const elytra = x >= 22 * s;
          const bottom = (elytra ? 22 : 17) * s;
          const height = (bottom - y) / ((elytra ? 21 : 16) * s);
          const n = 0.55 * valueNoise(x * 0.40, y * 0.085 + tick * 0.12, 64, 7) + 0.30 * valueNoise(x * 0.8, y * 0.18 + tick * 0.24, 64, 19)
            + 0.15 * valueNoise(x * 1.6, y * 0.36 + tick * 0.45, 64, 31);
          const f = 1.15 - height * 1.55 + 1.05 * (n - 0.5);
          const tone = f < 0.15 ? 0 : f < 0.30 ? 1 : f < 0.47 ? 2 : f < 0.66 ? 3 : 4;
          img.set(x, y, 0xFF000000 | tones[tone]);
        }
      }
      return true;
    };
  }
  const FLAMES = { orange: [0x140404, 0x6A1206, 0xC2410C, 0xF59E0B, 0xFFF1B0], white: [0x080809, 0x26262A, 0x5C5C62, 0xA8A8B0, 0xECECF0],
    purple: [0x07030D, 0x2A0855, 0x6A1FC0, 0xB45CFF, 0xF0D8FF] };

  function smoke(tones) {
    let painted = false;
    return (img, tick) => {
      if (painted && tick % 2 !== 0) return false;
      painted = true;
      const CELL = 4; const cols = img.w / CELL; const rows = img.h / CELL; const t = tick * 0.03;
      const a = 8 / cols; const b = 16 / cols;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const n = 0.65 * valueNoise(c * a + t, r * 0.4 - t * 0.5, 8, 911) + 0.35 * valueNoise(c * b - t * 0.8, r * 0.8 + t * 0.3, 16, 373);
          const color = 0xFF000000 | tones[n < 0.40 ? 0 : n < 0.52 ? 1 : n < 0.63 ? 2 : 3];
          for (let y = 0; y < CELL; y++) for (let x = 0; x < CELL; x++) img.set(c * CELL + x, r * CELL + y, color);
        }
      }
      return true;
    };
  }

  function andromeda(img) {
    const s = (img.w / 64) | 0; const w = capeAreaW(img); const h = capeAreaH(img);
    const neb = Universe.nebula;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const c = neb[(((y / 2) | 0) & 255) * 256 + (((x / 2) | 0) & 255)];
        img.set(x, y, argb(((c >> 16) & 0xFF) * 0.35, ((c >> 8) & 0xFF) * 0.35, (c & 0xFF) * 0.45));
      }
    }
    const cx = 6 * s; const cy = 8.5 * s; const radius = 4.6 * s; const tilt = 32 * Math.PI / 180;
    const cos = Math.cos(tilt); const sin = Math.sin(tilt);
    for (let y = (cy - radius * 1.6) | 0; y < cy + radius * 1.6; y++) {
      for (let x = (cx - radius * 1.6) | 0; x < cx + radius * 1.6; x++) {
        if (x < 0 || y < 0 || x >= w || y >= h) continue;
        const dx = x - cx; const dy = y - cy;
        const gx = (dx * cos + dy * sin) / radius; const gy = (-dx * sin + dy * cos) / radius / 0.42;
        const r = Math.sqrt(gx * gx + gy * gy);
        if (r > 1.5) continue;
        const theta = Math.atan2(gy, gx);
        const phase = theta - 2.2 * Math.log(r + 0.05);
        let arm = Math.pow(0.5 + 0.5 * Math.cos(2 * phase), 5) * Math.exp(-r * 1.6) * smooth(0.06, 0.25, r);
        const dust = Math.pow(0.5 + 0.5 * Math.cos(2 * phase + 0.9), 8) * Math.exp(-r * 2.0) * smooth(0.1, 0.3, r);
        let core = Math.exp(-r * r * 16); let halo = Math.exp(-r * 2.4) * 0.3;
        let knots = arm * smooth(0.6, 0.85, valueNoise(x * 0.08, y * 0.08, 64, 57));
        const base = img.get(x, y); const dark = 1 - 0.55 * dust; const fade = 1 - smooth(1.05, 1.5, r);
        core *= fade; arm *= fade; halo *= fade; knots *= fade;
        img.set(x, y, argb((((base >> 16) & 0xFF) + 255 * core * 1.3 + 150 * arm + 170 * halo + 255 * knots * 0.8) * dark,
          (((base >> 8) & 0xFF) + 236 * core * 1.3 + 180 * arm + 150 * halo + 110 * knots * 0.8) * dark,
          ((base & 0xFF) + 205 * core * 1.3 + 255 * arm + 255 * halo + 200 * knots * 0.8) * dark));
      }
    }
    const rnd = new JavaRandom(42);
    for (let i = 0; i < 520; i++) {
      const x = rnd.nextInt(w); const y = rnd.nextInt(h); const k = 0.3 + rnd.nextFloat() * 0.7;
      const star = rnd.nextInt(5) === 0 ? 0xFFD8E4FF : 0xFFFFFFFF;
      img.set(x, y, lerp(img.get(x, y), star, k));
      if (k > 0.9) for (const [ox, oy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) img.set(x + ox, y + oy, lerp(img.get(x + ox, y + oy), star, 0.45));
    }
    return true;
  }

  function magicCircle(img) {
    const size = img.w; const c = size / 2; const seg = [];
    for (let t = 0; t < 2; t++) {
      for (let k = 0; k < 3; k++) {
        const a0 = Math.PI * 2 * k / 3 + t * Math.PI / 3 - Math.PI / 2; const a1 = Math.PI * 2 * (k + 1) / 3 + t * Math.PI / 3 - Math.PI / 2;
        seg.push([Math.cos(a0) * 0.6, Math.sin(a0) * 0.6, Math.cos(a1) * 0.6, Math.sin(a1) * 0.6]);
      }
    }
    const rnd = new JavaRandom(3);
    for (let k = 0; k < 16; k++) {
      const a = Math.PI * 2 * k / 16; const cx = Math.cos(a) * 0.77; const cy = Math.sin(a) * 0.77;
      const strokes = 2 + rnd.nextInt(2);
      for (let s = 0; s < strokes; s++) {
        const x0 = (rnd.nextFloat() - 0.5) * 0.09; const y0 = (rnd.nextFloat() - 0.5) * 0.09;
        const x1 = (rnd.nextFloat() - 0.5) * 0.09; const y1 = (rnd.nextFloat() - 0.5) * 0.09;
        const ca = Math.cos(a); const sa = Math.sin(a);
        seg.push([cx + x0 * ca - y0 * sa, cy + x0 * sa + y0 * ca, cx + x1 * ca - y1 * sa, cy + x1 * sa + y1 * ca]);
      }
    }
    for (let py = 0; py < size; py++) {
      for (let px = 0; px < size; px++) {
        const x = (px + 0.5 - c) / c; const y = (py + 0.5 - c) / c; const r = Math.sqrt(x * x + y * y);
        let d = Math.min(Math.abs(r - 0.95), Math.abs(r - 0.88), Math.abs(r - 0.62));
        for (const s of seg) {
          const dx = s[2] - s[0]; const dy = s[3] - s[1];
          const t = clamp01(((x - s[0]) * dx + (y - s[1]) * dy) / (dx * dx + dy * dy));
          d = Math.min(d, Math.hypot(x - (s[0] + t * dx), y - (s[1] + t * dy)));
        }
        const v = r > 1 ? 0 : Math.min(1, 1 - smooth(0.008, 0.022, d) + Math.exp(-d * 28) * 0.45);
        img.set(px, py, ((Math.round(v * 255) << 24) | 0xFFFFFF) >>> 0);
      }
    }
    return true;
  }

  function aurora() {
    const rnd = new JavaRandom(7);
    const stars = [];
    for (let i = 0; i < 60; i++) { const sx2 = rnd.nextInt(184); const sy2 = rnd.nextInt(88); stars.push([sx2, sy2]); }
    const COLORS = [0x3CFF9A, 0x2AD8FF, 0xB45CFF];
    return (img, tick) => {
      if (tick % 2 !== 0) return false;
      const s = (img.w / 64) | 0; const w = capeAreaW(img); const h = capeAreaH(img); const t = tick;
      const center = [0, 0, 0]; const width = [0, 0, 0]; const rays = [0, 0, 0];
      for (let x = 0; x < w; x++) {
        for (let k = 0; k < 3; k++) {
          center[k] = s * (5 + 3.2 * k) + 1.8 * s * Math.sin(x * 0.045 / s * 4 + t * 0.035 * (k + 1) + k) + 0.8 * s * Math.sin(x * 0.11 / s * 4 - t * 0.06);
          width[k] = s * (2.4 + 0.9 * Math.sin(x * 0.03 + t * 0.02 + k));
          rays[k] = 0.65 + 0.35 * Math.sin(x * 0.6 / s * 4 + k * 2 + t * 0.05);
        }
        for (let y = 0; y < h; y++) {
          const sky = y / h;
          let r = 2 + 6 * sky; let g = 4 + 14 * sky; let b = 26 + 30 * sky;
          for (let k = 0; k < 3; k++) {
            const d = (y - center[k]) / width[k];
            let f = d >= 0 ? Math.max(0, 1 - d * d * 3) : Math.pow(Math.max(0, 1 + d * 0.32), 2);
            f *= rays[k] * 0.85;
            const c = COLORS[k];
            r += ((c >> 16) & 0xFF) * f; g += ((c >> 8) & 0xFF) * f; b += (c & 0xFF) * f;
          }
          img.set(x, y, argb(r, g, b));
        }
      }
      for (const [sx2, sy2] of stars) {
        const x = (sx2 * w / 184) | 0; const y = (sy2 * h / 88) | 0;
        const tw = (120 + 100 * Math.sin(tick * 0.15 + x * 7 + y)) | 0;
        img.set(x, y, lerp(img.get(x, y), 0xFFFFFFFF, tw / 255));
      }
      return true;
    };
  }

  // ─── ali (maschere calcolate una volta) ───
  const WingMask = (() => {
    const SIZE = 256; const FEATHERS = 13;
    let shade = null; let edge; let shaft; let inside;
    const arm = (s) => { const a = (1 - s) * (1 - s); const b = 2 * (1 - s) * s; const c = s * s; return [a * 0.03 + b * 0.30 + c * 0.72, a * 0.33 + b * 0.02 + c * 0.11]; };
    function ensure() {
      if (shade) return;
      const sh = new Float32Array(SIZE * SIZE).fill(-1); const ed = new Float32Array(SIZE * SIZE); const st = new Uint8Array(SIZE * SIZE);
      const armTop = new Float32Array(SIZE).fill(NaN);
      for (let i = 0; i <= 4000; i++) {
        const p = arm(i / 4000); const col = (p[0] * SIZE) | 0;
        if (col >= 0 && col < SIZE && (Number.isNaN(armTop[col]) || p[1] < armTop[col])) armTop[col] = p[1];
      }
      const base = []; const dir = []; const len = []; const half = [];
      for (let i = 0; i < FEATHERS; i++) {
        const t = i / (FEATHERS - 1); const p = arm(0.04 + 0.94 * t);
        base[i] = [p[0], p[1] + 0.05 + 0.03 * (1 - t)];
        const angle = (4 + 46 * Math.pow(t, 1.15)) * Math.PI / 180;
        dir[i] = [Math.sin(angle), Math.cos(angle)];
        len[i] = 0.58 + 0.10 * Math.sin(Math.PI * t) - 0.20 * t * t;
        half[i] = 0.050 + 0.018 * Math.sin(Math.PI * t);
      }
      for (let py = 0; py < SIZE; py++) {
        for (let px = 0; px < SIZE; px++) {
          const u = (px + 0.5) / SIZE; const v = (py + 0.5) / SIZE; const index = py * SIZE + px;
          for (let i = 0; i < FEATHERS; i++) {
            const rx = u - base[i][0]; const ry = v - base[i][1];
            const along = rx * dir[i][0] + ry * dir[i][1]; const perp = Math.abs(rx * dir[i][1] - ry * dir[i][0]);
            const tf = along / len[i];
            if (tf < -0.02 || tf > 1) continue;
            const profile = tf < 0.65 ? 1 : Math.sqrt(Math.max(0, 1 - Math.pow((tf - 0.65) / 0.35, 2)));
            const radius = half[i] * profile;
            if (perp >= radius) continue;
            const e = 1 - perp / radius;
            sh[index] = (0.62 + 0.38 * smooth(0, 0.55, e)) * (0.92 + 0.08 * (1 - tf));
            ed[index] = 1 - e;
            st[index] = perp < 0.0045 && tf > 0.03 && tf < 0.85 ? 1 : 0;
          }
          const top = armTop[px];
          if (!Number.isNaN(top) && u >= 0.03 && u <= 0.72) {
            const k = (u - 0.03) / 0.69;
            const thick = 0.13 * (1 - 0.55 * k) * (1 - smooth(0.78, 1, k)) + 0.001;
            const depth = (v - top) / thick;
            const cell = u * 22 - Math.floor(u * 22);
            const limit = 0.80 + 0.20 * Math.sqrt(Math.max(0, 1 - Math.pow(2 * cell - 1, 2)));
            if (v >= top - 0.004 && depth <= limit) {
              const leading = v - top < 0.012;
              sh[index] = leading ? 1.08 : 0.80 + 0.20 * (1 - depth);
              ed[index] = leading ? 0 : smooth(0.6, 1, depth / limit);
              st[index] = 0;
            }
          }
        }
      }
      const list = [];
      for (let i = 0; i < sh.length; i++) if (sh[i] >= 0) list.push(i);
      shade = sh; edge = ed; shaft = st; inside = Uint32Array.from(list);
    }
    return { SIZE, ensure, get shade() { return shade; }, get edge() { return edge; }, get shaft() { return shaft; }, get inside() { return inside; } };
  })();

  function wing(style) {
    return (img, tick) => {
      WingMask.ensure();
      const f = style === 'cosmic' ? Universe.frame(tick) : null; const size = 256;
      for (const index of WingMask.inside) {
        const x = index % size; const y = (index / size) | 0;
        const sh = WingMask.shade[index]; const ed = WingMask.edge[index]; const st = WingMask.shaft[index];
        let color;
        if (style === 'cosmic') {
          const space = f[index]; const k = 0.55 + 0.6 * Math.min(1, sh); const glow = smooth(0.72, 1, ed) * 0.6;
          let r = ((space >> 16) & 0xFF) * k + 0xB0 * glow + (st ? 40 : 0);
          let g = ((space >> 8) & 0xFF) * k + 0x7C * glow + (st ? 70 : 0);
          let b = (space & 0xFF) * k + 0xFF * glow + (st ? 90 : 0);
          if (sh > 1) { r += 50; g += 40; b += 70; }
          color = argb(r, g, b);
        } else if (style === 'angel') {
          let feather = lerp(0xFFB9C0CE, 0xFFFFFFFF, Math.min(1, sh));
          feather = lerp(feather, 0xFFFFF1DA, 0.25 * (1 - x / size));
          color = st ? lerp(feather, 0xFFFFFFFF, 0.6) : feather;
        } else {
          let feather = lerp(0xFF0E0406, 0xFF2E0C14, Math.min(1, sh));
          feather = lerp(feather, 0xFFD01A2A, smooth(0.65, 1, ed) * 0.85);
          color = st ? lerp(feather, 0xFFFF3A3A, 0.35) : feather;
        }
        img.set(x, y, color);
      }
      return true;
    };
  }

  const BatMask = (() => {
    const SIZE = 256;
    const ROOT_TOP = [0.03, 0.36]; const WRIST = [0.42, 0.16]; const TIP = [0.99, 0.04]; const F1 = [0.84, 0.50]; const F2 = [0.60, 0.64]; const ROOT_BOTTOM = [0.05, 0.62];
    let kind = null; let edge; let inside;
    const inTri = (px, py, a, b, c) => {
      const d1 = (px - b[0]) * (a[1] - b[1]) - (a[0] - b[0]) * (py - b[1]);
      const d2 = (px - c[0]) * (b[1] - c[1]) - (b[0] - c[0]) * (py - c[1]);
      const d3 = (px - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (py - a[1]);
      return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
    };
    const distSeg = (px, py, a, b) => {
      const dx = b[0] - a[0]; const dy = b[1] - a[1];
      const t = clamp01(((px - a[0]) * dx + (py - a[1]) * dy) / (dx * dx + dy * dy));
      return Math.hypot(px - (a[0] + t * dx), py - (a[1] + t * dy));
    };
    const cut = (a, b, depth) => {
      const mx = (a[0] + b[0]) / 2; const my = (a[1] + b[1]) / 2; const dx = b[0] - a[0]; const dy = b[1] - a[1];
      const length = Math.hypot(dx, dy); let nx = -dy / length; let ny = dx / length;
      if (nx * (mx - WRIST[0]) + ny * (my - WRIST[1]) < 0) { nx = -nx; ny = -ny; }
      const radius = (length * length / 4 + depth * depth) / (2 * depth);
      return [mx + nx * (radius - depth), my + ny * (radius - depth), radius];
    };
    function ensure() {
      if (kind) return;
      const tris = [[ROOT_TOP, WRIST, ROOT_BOTTOM], [WRIST, F2, ROOT_BOTTOM], [WRIST, F1, F2], [WRIST, TIP, F1]];
      const cuts = [cut(TIP, F1, 0.07), cut(F1, F2, 0.06), cut(F2, ROOT_BOTTOM, 0.08)];
      const bones = [[ROOT_TOP, WRIST], [WRIST, TIP], [WRIST, F1], [WRIST, F2]]; const bw = [0.016, 0.012, 0.008, 0.008];
      const claw = [[WRIST[0] - 0.035, WRIST[1] + 0.005], [WRIST[0] + 0.005, WRIST[1] - 0.075], [WRIST[0] + 0.03, WRIST[1] + 0.005]];
      const k = new Uint8Array(SIZE * SIZE); const e = new Float32Array(SIZE * SIZE); const list = [];
      for (let py = 0; py < SIZE; py++) {
        for (let px = 0; px < SIZE; px++) {
          const u = (px + 0.5) / SIZE; const v = (py + 0.5) / SIZE; const index = py * SIZE + px;
          let membrane = tris.some((t) => inTri(u, v, t[0], t[1], t[2]));
          let near = 1;
          for (const c of cuts) { const d = Math.hypot(u - c[0], v - c[1]); if (d < c[2]) membrane = false; near = Math.min(near, Math.abs(d - c[2])); }
          let kk = membrane ? 1 : 0;
          for (let b = 0; b < bones.length; b++) if (distSeg(u, v, bones[b][0], bones[b][1]) < bw[b]) kk = 2;
          if (inTri(u, v, claw[0], claw[1], claw[2])) kk = 3;
          k[index] = kk;
          near = Math.min(near, distSeg(u, v, WRIST, TIP) * 0.8);
          e[index] = 1 - Math.min(1, near / 0.03);
          if (kk) list.push(index);
        }
      }
      kind = k; edge = e; inside = Uint32Array.from(list);
    }
    return { ensure, get kind() { return kind; }, get edge() { return edge; }, get inside() { return inside; } };
  })();

  function batWing(style) {
    return (img, tick) => {
      BatMask.ensure();
      const f = style === 'black' ? null : Universe.frame(tick);
      for (const index of BatMask.inside) {
        const x = index % 256; const y = (index / 256) | 0; const kind = BatMask.kind[index]; const ed = BatMask.edge[index];
        let color;
        if (style !== 'black') {
          let space = f[index];
          if (style === 'red') space = redShift(space);
          if (style === 'white') space = whiteShift(space);
          const glow = style === 'red' ? 0xFFFF4A5A : style === 'white' ? 0xFFE8EEFF : 0xFFA070FF;
          const membrane = lerp(0xFF000000 | space, glow, smooth(0.35, 1, ed) * 0.75);
          const bone = style === 'red' ? 0xFFFFB4B4 : style === 'white' ? 0xFFFFFFFF : 0xFFD2B4FF;
          const claw = style === 'red' ? 0xFFFFE0E0 : style === 'white' ? 0xFFFFFFFF : 0xFFEEE4FF;
          color = kind === 2 ? lerp(membrane, bone, 0.6) : kind === 3 ? claw : membrane;
        } else {
          color = kind === 2 ? 0xFF2E2E38 : kind === 3 ? 0xFF5C5C68 : lerp(lerp(0xFF0A0A0E, 0xFF1A1A22, y / 256), 0xFF3C3C4C, smooth(0.5, 1, ed) * 0.8);
        }
        img.set(x, y, color);
      }
      return true;
    };
  }

  // ─── registro: una texture (canvas) per cosmetico, aggiornata 20 volte al secondo se animata ───
  const TEX = new Map();
  function texSpec(id) {
    switch (id) {
      case 'hacker': return [512, 256, hackerRain(), true];
      case 'galaxy': return [256, 128, galaxy(false, false), true];
      case 'red_galaxy': return [256, 128, galaxy(true, false), true];
      case 'ender': return [512, 256, (img) => { enderCape(img, null); loadLogo().then((logo) => { if (logo) { enderCape(img, logo); flush(TEX.get('ender')); } }); return true; }, false];
      case 'andromeda': return [512, 256, andromeda, false];
      case 'flames': return [128, 64, flames(FLAMES.orange), true];
      case 'white_flames': return [128, 64, flames(FLAMES.white), true];
      case 'purple_flames': return [128, 64, flames(FLAMES.purple), true];
      case 'aurora': return [256, 128, aurora(), true];
      case 'white_flames_bandana': return [256, 32, smoke([0x0E0E10, 0x48484E, 0xA6A6AE, 0xF4F4F6]), true];
      case 'purple_flames_bandana': return [256, 32, smoke([0x0B0612, 0x3A0F6E, 0x9A4CFF, 0xF0DCFF]), true];
      case 'galaxy_bandana': return [256, 32, galaxy(false, true), true];
      case 'red_galaxy_bandana': return [256, 32, galaxy(true, true), true];
      case 'cosmic_wings': return [256, 256, wing('cosmic'), true];
      case 'angel_wings': return [256, 256, wing('angel'), false];
      case 'demon_wings': return [256, 256, wing('demon'), false];
      case 'galaxy_bat_wings': return [256, 256, batWing('galaxy'), true];
      case 'red_bat_wings': return [256, 256, batWing('red'), true];
      case 'black_bat_wings': return [256, 256, batWing('black'), false];
      case 'neworder_bat_wings': return [256, 256, batWing('white'), true];
      case 'neworder': return [1024, 512, newOrder(false), true];
      case 'neworder_bandana': return [1024, 128, newOrder(true), true];
      case 'magic_circle': return [128, 128, magicCircle, false];
      default: return null;
    }
  }
  function flush(t) {
    const id = t.ctx.createImageData(t.img.w, t.img.h);
    const out = new Uint32Array(id.data.buffer);
    const src = t.img.data;
    // ARGB -> RGBA (memoria little endian: ABGR).
    for (let i = 0; i < src.length; i++) {
      const c = src[i];
      out[i] = ((c & 0xFF000000) | ((c & 0xFF) << 16) | (c & 0xFF00) | ((c >>> 16) & 0xFF)) >>> 0;
    }
    t.ctx.putImageData(id, 0, 0);
    t.version++;
    if (t.three) t.three.needsUpdate = true;
  }
  function texture(id) {
    if (TEX.has(id)) return TEX.get(id);
    const spec = texSpec(id);
    if (!spec) return null;
    const [w, h, paint, animated] = spec;
    const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
    const t = { id, img: new Img(w, h), canvas, ctx: canvas.getContext('2d'), paint, animated, version: 0, three: null, lastTick: -1 };
    TEX.set(id, t);
    paint(t.img, 0);
    flush(t);
    return t;
  }
  function threeTexture(id) {
    const t = texture(id);
    if (!t || typeof THREE === 'undefined') return null;
    if (!t.three) {
      t.three = new THREE.CanvasTexture(t.canvas);
      t.three.magFilter = THREE.NearestFilter;
      t.three.minFilter = THREE.LinearMipmapLinearFilter;
      t.three.colorSpace = THREE.SRGBColorSpace;
      t.three.flipY = false;
    }
    return t.three;
  }
  // Ridipinge le texture animate in uso (20 tick al secondo, come in gioco).
  function tickTextures(tick, ids) {
    for (const id of ids) {
      const t = texture(id);
      if (!t || !t.animated || t.lastTick === tick) continue;
      t.lastTick = tick;
      if (t.paint(t.img, tick)) flush(t);
    }
  }

  // ═══════════════════════════════════════════ modelli 3D

  // Geometria da quadrati (come quad() della mod): posizioni, normali e colori per vertice.
  class Mesh {
    constructor() { this.pos = []; this.nor = []; this.col = []; this.uv = []; }
    quad(p, color, n, uv) {
      const [nx, ny, nz] = n || [0, 1, 0];
      const len = Math.hypot(nx, ny, nz) || 1;
      const r = ((color >> 16) & 0xFF) / 255; const g = ((color >> 8) & 0xFF) / 255; const b = (color & 0xFF) / 255; const a = ((color >>> 24) & 0xFF) / 255;
      const uvs = uv || [[0, 0], [1, 0], [1, 1], [0, 1]];
      for (const i of [0, 1, 2, 0, 2, 3]) {
        this.pos.push(...p[i]); this.nor.push(nx / len, ny / len, nz / len); this.col.push(r, g, b, a); this.uv.push(...uvs[i]);
      }
      return this;
    }
    build(material) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
      geo.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 4));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
      return new THREE.Mesh(geo, material);
    }
  }
  const lit = () => new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.85, metalness: 0.05 });
  const unlit = () => new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });
  const glowMat = () => new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const deg = (d) => d * Math.PI / 180;
  const lerpC = (from, to, t) => lerp(from, to, t);

  // Nello spazio della mod: un gruppo che porta blocchi/y in giu'/davanti -z nei pixel di skinview3d.
  function mcSpace() {
    const g = new THREE.Group();
    g.scale.set(16, -16, -16);
    return g;
  }

  // ─── ali ───
  function flapCurve(phase, active = 0.62) {
    const p = phase - Math.floor(phase);
    if (p >= active) return 0;
    const s = Math.sin(Math.PI * p / active);
    return s * s;
  }
  function buildWings(id) {
    const bat = id.includes('bat');
    const shape = bat ? { length: 0.82, wrist: 0.42 } : { length: 0.95, wrist: 0.45 };
    const glowing = id === 'cosmic_wings' || id === 'galaxy_bat_wings' || id === 'red_bat_wings' || id === 'neworder_bat_wings';
    const map = threeTexture(id);
    const material = glowing ? new THREE.MeshBasicMaterial({ map, alphaTest: 0.1, side: THREE.DoubleSide })
      : new THREE.MeshStandardMaterial({ map, alphaTest: 0.1, side: THREE.DoubleSide, roughness: 0.9 });
    const root = mcSpace();
    const sides = [];
    const quad = (side, width, depth, u0, u1) => {
      const x1 = side * width; const front = -0.30 * depth; const back = 0.70 * depth;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, front, x1, 0, front, x1, 0, back, 0, 0, front, x1, 0, back, 0, 0, back], 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute([u0, 0, u1, 0, u1, 1, u0, 0, u1, 1, u0, 1], 2));
      geo.computeVertexNormals();
      return new THREE.Mesh(geo, material);
    };
    const innerLength = shape.length * shape.wrist;
    for (const side of [-1, 1]) {
      const inner = new THREE.Group();
      inner.position.set(side * 0.12, 0.05, 0.15);
      inner.rotation.order = 'YZX';
      inner.add(quad(side, innerLength, shape.length, 0, shape.wrist));
      const outer = new THREE.Group();
      outer.position.set(side * innerLength, 0, 0);
      outer.add(quad(side, shape.length - innerLength, shape.length, shape.wrist, 1));
      inner.add(outer);
      root.add(inner);
      sides.push({ side, inner, outer });
    }
    let phase = 0;
    // Ali da pipistrello: battito piu' basso e molto piu' raro (come in gioco).
    const period = bat ? 42 * 2.25 : 42;
    const active = bat ? 0.3 : 0.62;
    const high = bat ? 40 : 72;
    root.userData.update = (age, dt) => {
      phase += dt / period;
      const up = flapCurve(phase, active); const lag = flapCurve(phase - 0.06 * active / 0.62, active);
      const rest = 2.5 * Math.sin(phase * Math.PI * 4) * (1 - up);
      const innerA = 10 + (high - 10) * up + rest;
      const outerA = -18 + (high + 4 + 18) * lag - innerA;
      const sweep = 12; const droop = 22 - 12 * up;
      for (const { side, inner, outer } of sides) {
        inner.rotation.set(deg(-droop), deg(-side * sweep), deg(-side * innerA));
        outer.rotation.set(0, 0, deg(-side * outerA));
      }
    };
    return root;
  }

  // ─── testa ───
  function buildHalo(core, glow) {
    const root = mcSpace();
    const g = new THREE.Group();
    g.position.set(0, -0.66, 0.03);
    g.rotation.x = deg(-10);
    root.add(g);
    const radius = 0.25; const half = 0.014; const height = 0.011; const segments = 40;
    const solid = new Mesh(); const edge = lerp(0xFF000000 | (core & 0xFFFFFF), 0xFF000000, 0.15);
    const glowMesh = new Mesh();
    for (let s = 0; s < segments; s++) {
      const a0 = Math.PI * 2 * s / segments; const a1 = Math.PI * 2 * (s + 1) / segments;
      const c0 = Math.cos(a0); const s0 = Math.sin(a0); const c1 = Math.cos(a1); const s1 = Math.sin(a1);
      const ri = radius - half; const ro = radius + half;
      solid.quad([[c0 * ri, -height, s0 * ri], [c0 * ro, -height, s0 * ro], [c1 * ro, -height, s1 * ro], [c1 * ri, -height, s1 * ri]], core, [0, -1, 0]);
      solid.quad([[c0 * ri, height, s0 * ri], [c1 * ri, height, s1 * ri], [c1 * ro, height, s1 * ro], [c0 * ro, height, s0 * ro]], edge, [0, 1, 0]);
      solid.quad([[c0 * ro, -height, s0 * ro], [c0 * ro, height, s0 * ro], [c1 * ro, height, s1 * ro], [c1 * ro, -height, s1 * ro]], edge, [(c0 + c1) / 2, 0, (s0 + s1) / 2]);
      solid.quad([[c0 * ri, -height, s0 * ri], [c1 * ri, -height, s1 * ri], [c1 * ri, height, s1 * ri], [c0 * ri, height, s0 * ri]], edge, [-(c0 + c1) / 2, 0, -(s0 + s1) / 2]);
      const radii = [radius - 0.09, radius, radius + 0.09];
      const colors = [glow & 0xFFFFFF, ((110 << 24) | (glow & 0xFFFFFF)) >>> 0, glow & 0xFFFFFF];
      for (let band = 0; band < 2; band++) {
        const r0 = radii[band]; const r1 = radii[band + 1];
        glowMesh.pos.push(...[c0 * r0, 0, s0 * r0, c1 * r0, 0, s1 * r0, c1 * r1, 0, s1 * r1, c0 * r0, 0, s0 * r0, c1 * r1, 0, s1 * r1, c0 * r1, 0, s0 * r1]);
        const cA = colors[band]; const cB = colors[band + 1];
        for (const c of [cA, cA, cB, cA, cB, cB]) glowMesh.col.push(((c >> 16) & 0xFF) / 255, ((c >> 8) & 0xFF) / 255, (c & 0xFF) / 255, ((c >>> 24) & 0xFF) / 255);
        for (let i = 0; i < 6; i++) { glowMesh.nor.push(0, 1, 0); glowMesh.uv.push(0, 0); }
      }
    }
    g.add(solid.build(unlit()));
    g.add(glowMesh.build(glowMat()));
    root.userData.update = (age) => { g.position.y = -0.66 + 0.025 * Math.sin(age * 0.09); };
    return root;
  }

  function buildHorns() {
    const root = mcSpace(); const mesh = new Mesh(); const glowMesh = new Mesh();
    const L = 10; const R = 8;
    for (const side of [-1, 1]) {
      const pts = []; const cols = [];
      for (let j = 0; j <= L; j++) {
        const t = j / L;
        const center = new THREE.Vector3(side * (0.17 + 0.07 * t + 0.03 * t * t), -0.46 - 0.20 * t + 0.02 * t * t, -0.06 + 0.12 * t * t);
        const tangent = new THREE.Vector3(side * (0.07 + 0.06 * t), -0.20 + 0.04 * t, 0.24 * t).normalize();
        const b1 = tangent.clone().cross(new THREE.Vector3(1, 0, 0)).normalize();
        const b2 = tangent.clone().cross(b1).normalize();
        const radius = 0.055 * (1 - t) + 0.006;
        const ring = [];
        for (let k = 0; k < R; k++) {
          const a = Math.PI * 2 * k / R;
          ring.push(b1.clone().multiplyScalar(Math.cos(a)).add(b2.clone().multiplyScalar(Math.sin(a))).multiplyScalar(radius).add(center));
        }
        pts.push(ring);
        const glowing = smooth(0.55, 1, t);
        cols.push(lerpC(lerpC(0xFF2A070C, 0xFF7A1220, t), 0xFFFF5A3A, glowing));
      }
      for (let j = 0; j < L; j++) {
        for (let k = 0; k < R; k++) {
          const k1 = (k + 1) % R;
          const p = [pts[j][k], pts[j][k1], pts[j + 1][k1], pts[j + 1][k]].map((v) => [v.x, v.y, v.z]);
          const n = pts[j][k].clone().sub(pts[j][k1].clone().add(pts[j][k]).multiplyScalar(0.5)).toArray();
          (j >= L * 0.6 ? glowMesh : mesh).quad(p, cols[j], n);
        }
      }
    }
    root.add(mesh.build(lit()));
    root.add(glowMesh.build(unlit()));
    return root;
  }

  function buildCrown() {
    const root = mcSpace(); const mesh = new Mesh(); const gems = new Mesh();
    const radius = 0.21; const bottom = -0.535; const top = bottom - 0.07; const spike = top - 0.09;
    const colors = [0xFFE0213A, 0xFF2A7BFF, 0xFF9B4CFF, 0xFF22D27A];
    for (let k = 0; k < 8; k++) {
      const a0 = Math.PI * 2 * k / 8 + Math.PI / 8; const a1 = Math.PI * 2 * (k + 1) / 8 + Math.PI / 8;
      const x0 = Math.cos(a0) * radius; const z0 = Math.sin(a0) * radius; const x1 = Math.cos(a1) * radius; const z1 = Math.sin(a1) * radius;
      const nx = (Math.cos(a0) + Math.cos(a1)) / 2; const nz = (Math.sin(a0) + Math.sin(a1)) / 2; const mx = (x0 + x1) / 2; const mz = (z0 + z1) / 2;
      mesh.quad([[x0, bottom, z0], [x1, bottom, z1], [x1, top, z1], [x0, top, z0]], 0xFFD39A22, [nx, 0, nz]);
      mesh.quad([[x0, top, z0], [x1, top, z1], [mx * 0.97, spike, mz * 0.97], [mx * 0.97, spike, mz * 0.97]], 0xFFF2C243, [nx, -0.3, nz]);
      const g = 0.022; const gy = (bottom + top) / 2; const ox = nx * 0.006; const oz = nz * 0.006; const tx = -nz * g; const tz = nx * g;
      gems.quad([[mx + ox - tx, gy + g, mz + oz - tz], [mx + ox + tx, gy + g, mz + oz + tz], [mx + ox + tx, gy - g, mz + oz + tz], [mx + ox - tx, gy - g, mz + oz - tz]],
        colors[k % 4], [nx, 0, nz]);
    }
    root.add(mesh.build(new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.35, metalness: 0.6 })));
    root.add(gems.build(unlit()));
    return root;
  }

  // ─── bandana ───
  function buildBandana(id) {
    const root = mcSpace();
    const tilt = new THREE.Group();
    tilt.position.set(0, -0.37, 0);
    tilt.rotation.x = deg(-5);
    const inner = new THREE.Group();
    inner.position.set(0, 0.37, 0);
    tilt.add(inner);
    root.add(tilt);
    const map = threeTexture(id);
    const mat = new THREE.MeshBasicMaterial({ map, side: THREE.DoubleSide });
    const m = new Mesh();
    const out = 0.30; const ins = 0.265; const top = -0.465; const bottom = -0.275;
    const around = [[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]];
    for (let i = 0; i < 4; i++) {
      const [ax, az] = around[i]; const [bx, bz] = around[i + 1]; const u0 = i * 0.25; const u1 = u0 + 0.25;
      m.quad([[ax * out, top, az * out], [bx * out, top, bz * out], [bx * out, bottom, bz * out], [ax * out, bottom, az * out]], 0xFFFFFFFF, [(ax + bx) / 2, 0, (az + bz) / 2], [[u0, 0], [u1, 0], [u1, 1], [u0, 1]]);
      m.quad([[bx * ins, top, bz * ins], [ax * ins, top, az * ins], [ax * ins, bottom, az * ins], [bx * ins, bottom, bz * ins]], 0xFFFFFFFF, [-(ax + bx) / 2, 0, -(az + bz) / 2], [[u1, 0], [u0, 0], [u0, 1], [u1, 1]]);
      m.quad([[ax * ins, top, az * ins], [bx * ins, top, bz * ins], [bx * out, top, bz * out], [ax * out, top, az * out]], 0xFFFFFFFF, [0, -1, 0], [[u0, 0], [u1, 0], [u1, 0.12], [u0, 0.12]]);
      m.quad([[ax * out, bottom, az * out], [bx * out, bottom, bz * out], [bx * ins, bottom, bz * ins], [ax * ins, bottom, az * ins]], 0xFFFFFFFF, [0, 1, 0], [[u0, 0.88], [u1, 0.88], [u1, 1], [u0, 1]]);
    }
    const box = (mesh, x0, y0, z0, x1, y1, z1, u0, v0, u1, v1) => {
      const uv = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
      mesh.quad([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], 0xFFFFFFFF, [0, 0, -1], uv);
      mesh.quad([[x1, y0, z1], [x0, y0, z1], [x0, y1, z1], [x1, y1, z1]], 0xFFFFFFFF, [0, 0, 1], uv);
      mesh.quad([[x0, y0, z1], [x0, y0, z0], [x0, y1, z0], [x0, y1, z1]], 0xFFFFFFFF, [-1, 0, 0], uv);
      mesh.quad([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], 0xFFFFFFFF, [1, 0, 0], uv);
      mesh.quad([[x0, y0, z1], [x1, y0, z1], [x1, y0, z0], [x0, y0, z0]], 0xFFFFFFFF, [0, -1, 0], uv);
      mesh.quad([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], 0xFFFFFFFF, [0, 1, 0], uv);
    };
    const ky = -0.37;
    box(m, -0.05, ky - 0.05, out - 0.005, 0.05, ky + 0.05, out + 0.05, 0.6, 0.2, 0.65, 0.8);
    inner.add(m.build(mat));
    const tails = [];
    for (let tail = 0; tail < 2; tail++) {
      const g1 = new THREE.Group();
      g1.position.set(tail === 0 ? 0.025 : -0.025, ky + 0.02, out + 0.04);
      g1.rotation.order = 'ZXY';
      const a = new Mesh(); box(a, -0.035, 0, -0.01, 0.035, 0.13, 0.01, 0.62, 0, 0.66, 1);
      g1.add(a.build(mat));
      const g2 = new THREE.Group(); g2.position.set(0, 0.13, 0);
      const b = new Mesh(); box(b, -0.03, 0, -0.01, 0.03, 0.12, 0.01, 0.66, 0, 0.70, 1);
      g2.add(b.build(mat)); g1.add(g2); inner.add(g1);
      tails.push({ tail, g1, g2 });
    }
    let phase = 0;
    root.userData.update = (age, dt) => {
      phase += dt * 0.16;
      for (const { tail, g1, g2 } of tails) {
        const flutter = Math.sin(phase + tail * 1.7);
        g1.rotation.set(0.35 + 0.12 * flutter, 0, -(tail === 0 ? 0.28 : -0.28));
        g2.rotation.x = 0.25 + 0.2 * flutter;
      }
    };
    return root;
  }

  // ─── extra ───
  const OCTA = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
  const OCTA_FACES = [[0, 2, 4], [4, 2, 1], [1, 2, 5], [5, 2, 0], [4, 3, 0], [1, 3, 4], [5, 3, 1], [0, 3, 5]];
  function octahedron(size, color, glow) {
    const m = new Mesh();
    OCTA_FACES.forEach((f, i) => {
      const [a, b, c] = f.map((k) => OCTA[k].map((v) => v * size));
      if (glow) {
        const cA = color; const cE = color & 0xFFFFFF;
        m.pos.push(...a, ...b, ...c);
        for (const col of [cA, cE, cE]) m.col.push(((col >> 16) & 0xFF) / 255, ((col >> 8) & 0xFF) / 255, (col & 0xFF) / 255, ((col >>> 24) & 0xFF) / 255);
        for (let k = 0; k < 3; k++) { m.nor.push(0, 1, 0); m.uv.push(0, 0); }
      } else {
        const n = [a[0] + b[0] + c[0], a[1] + b[1] + c[1], a[2] + b[2] + c[2]];
        m.quad([a, b, c, c], i % 2 === 0 ? color : lerp(color, 0xFFFFFFFF, 0.35), n);
      }
    });
    return m.build(glow ? glowMat() : unlit());
  }

  function buildOrbit() {
    const root = mcSpace(); const COLORS = [0xFFB46CFF, 0xFF5CE1FF, 0xFFFF6CD8];
    const items = COLORS.map((c) => {
      const g = new THREE.Group(); g.rotation.order = 'YXZ';
      g.add(octahedron(0.075, c, false)); g.add(octahedron(0.16, ((55 << 24) | (c & 0xFFFFFF)) >>> 0, true));
      root.add(g); return g;
    });
    root.userData.update = (age) => {
      items.forEach((g, k) => {
        const a = age * 0.06 + k * Math.PI * 2 / 3;
        g.position.set(Math.cos(a) * 0.75, 0.40 + 0.18 * Math.sin(age * 0.05 + k * 2.1), Math.sin(a) * 0.75);
        g.rotation.set(deg(20), age * 0.10 + k, 0);
      });
    };
    return root;
  }

  function buildMagicCircle() {
    const root = mcSpace(); const map = threeTexture('magic_circle');
    const rings = [[0.95, 0.9, 0xB070FF], [0.55, -1.6, 0x5CE1FF]].map(([r, speed, color]) => {
      const mat = new THREE.MeshBasicMaterial({ map, color, transparent: true, depthWrite: false, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2 * r, 2 * r), mat);
      mesh.rotation.x = -Math.PI / 2;
      const g = new THREE.Group(); g.position.y = 1.49; g.add(mesh); root.add(g);
      return { g, mat, speed };
    });
    root.userData.update = (age) => {
      const pulse = 0.75 + 0.25 * Math.sin(age * 0.08);
      for (const r of rings) { r.g.rotation.y = deg(age * r.speed); r.mat.opacity = (220 * pulse) / 255; }
    };
    return root;
  }

  function buildSparkles() {
    const root = mcSpace(); const COLORS = [0xFFFFD45A, 0xFFB46CFF, 0xFFFFFFFF, 0xFF5CE1FF];
    const items = [];
    for (let i = 0; i < 16; i++) {
      const c = COLORS[i % 4];
      const g = new THREE.Group();
      const solid = octahedron(0.028, c, false); const glow = octahedron(0.08, ((70 << 24) | (c & 0xFFFFFF)) >>> 0, true);
      g.add(solid, glow); root.add(g); items.push(g);
    }
    root.userData.update = (age) => {
      items.forEach((g, i) => {
        const life = ((age / 70) + i / 16) % 1; const fade = Math.sin(life * Math.PI);
        const angle = i * 2.4 + life * 5; const radius = 0.45 + 0.2 * Math.sin(i * 1.7);
        g.position.set(Math.cos(angle) * radius, 1.45 - life * 1.85, Math.sin(angle) * radius);
        g.rotation.y = age * 0.2 + i;
        g.scale.setScalar(Math.max(0.001, fade));
      });
    };
    return root;
  }

  function buildTail() {
    const root = mcSpace();
    const base = new THREE.Group(); base.position.set(0, 0.66, 0.13); base.rotation.x = deg(55); root.add(base);
    const segs = []; let parent = base;
    for (let i = 0; i < 10; i++) {
      const t = i / 10; const half = 0.032 * (1 - t * 0.65);
      const g = new THREE.Group(); g.rotation.order = 'YXZ';
      const m = new Mesh(); const c = lerp(0xFF4A0A12, 0xFF120406, t);
      const x0 = -half; const y0 = -half; const z0 = 0; const x1 = half; const y1 = half; const z1 = 0.069;
      m.quad([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], c, [0, -1, 0]);
      m.quad([[x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0]], c, [0, 1, 0]);
      m.quad([[x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [x1, y0, z0]], c, [0, 0, -1]);
      m.quad([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], c, [0, 0, 1]);
      m.quad([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], c, [-1, 0, 0]);
      m.quad([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], c, [1, 0, 0]);
      g.add(m.build(lit()));
      const next = new THREE.Group(); next.position.z = 0.065; g.add(next);
      parent.add(g); segs.push(g); parent = next;
    }
    const heart = new Mesh(); const h = 0.05; const hc = 0xFFE0283A;
    heart.quad([[-h, 0, 0], [0, 0, -0.01], [h, 0, 0], [0, 0, h * 1.6]], hc, [0, -1, 0]);
    const lobe = (x0, x1) => {
      const y0 = -0.008; const y1 = 0.008; const z0 = -0.01; const z1 = h * 0.8;
      heart.quad([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], hc, [0, -1, 0]);
      heart.quad([[x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0]], hc, [0, 1, 0]);
      heart.quad([[x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [x1, y0, z0]], hc, [0, 0, -1]);
      heart.quad([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], hc, [0, 0, 1]);
    };
    lobe(-h, -0.005); lobe(0.005, h);
    parent.add(heart.build(unlit()));
    root.userData.update = (age) => {
      segs.forEach((g, i) => g.rotation.set(deg(-11 - 5 * Math.sin(age * 0.09 - i * 0.4)), deg(12 * Math.sin(age * 0.12 - i * 0.5)), 0));
    };
    return root;
  }

  // ─── pet (modelli Blockbench come CosmeticModel.java) ───
  const PETS = {
    dog: { model: 'dog', scale: 0.7 / 16, center: [7.6, -3.0, 7.5] },
    dragon: { model: 'baby_dragon', scale: 0.62 / 16, center: [4.0, 3.5, 1.5] },
    // Il gatto ora cammina a terra: il modello "in piedi".
    cat: { model: 'cat_walk', texture: 'cat', scale: 0.7 / 16, center: [7.6, -2.27, 8.9] },
    snow_fox: { model: 'snow_fox', scale: 0.8 / 16, center: [8.0, -0.45, 7.6] },
    // Il peluche usa la tua skin (stesso schema 64x64); senza, quella di default.
    mini_me: { model: 'mini_me', scale: 1.0 / 16, center: [8.0, 0.17, 7.4], skin: true },
  };
  const petCache = new Map();
  function loadPet(key) {
    if (PETS[key].skin) key = `${key}|${W.skinUrl || ''}`;
    if (petCache.has(key)) return petCache.get(key);
    const petKey = key.split('|')[0];
    const p = (async () => {
      const def = PETS[petKey];
      const json = await loadJson(`assets/cosmetic/${def.model}.json`);
      const texUrl = def.skin ? (W.skinUrl || A(`assets/cosmetic/${def.model}_default.png`)) : A(`assets/cosmetic/${def.texture || def.model}.png`);
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');
      let tex = await new Promise((resolve) => loader.load(texUrl, resolve, undefined, () => resolve(null)));
      if (!tex && def.skin) tex = await new Promise((resolve) => loader.load(A(`assets/cosmetic/${def.model}_default.png`), resolve, undefined, () => resolve(null)));
      if (tex) { tex.magFilter = THREE.NearestFilter; tex.minFilter = THREE.NearestFilter; tex.colorSpace = THREE.SRGBColorSpace; tex.flipY = false; }
      const pos = []; const uv = []; const nor = [];
      const corners = (d, f, t) => {
        const [x0, y0, z0] = f; const [x1, y1, z1] = t;
        return {
          north: [[x1, y1, z0], [x0, y1, z0], [x0, y0, z0], [x1, y0, z0]], south: [[x0, y1, z1], [x1, y1, z1], [x1, y0, z1], [x0, y0, z1]],
          west: [[x0, y1, z0], [x0, y1, z1], [x0, y0, z1], [x0, y0, z0]], east: [[x1, y1, z1], [x1, y1, z0], [x1, y0, z0], [x1, y0, z1]],
          up: [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], down: [[x0, y0, z1], [x1, y0, z1], [x1, y0, z0], [x0, y0, z0]],
        }[d];
      };
      const rot = (p, r) => {
        if (!r) return p;
        const a = deg(r.angle); const c = Math.cos(a); const s = Math.sin(a);
        let [x, y, z] = [p[0] - r.origin[0], p[1] - r.origin[1], p[2] - r.origin[2]];
        if (r.axis === 'x') { const ny = y * c - z * s; z = y * s + z * c; y = ny; } else if (r.axis === 'y') { const nx = x * c + z * s; z = -x * s + z * c; x = nx; } else { const nx = x * c - y * s; y = x * s + y * c; x = nx; }
        return [x + r.origin[0], y + r.origin[1], z + r.origin[2]];
      };
      for (const el of json.elements) {
        for (const [d, face] of Object.entries(el.faces || {})) {
          const cs = corners(d, el.from, el.to);
          if (!cs) continue;
          const box = face.uv || [0, 0, 16, 16];
          const turns = (((face.rotation || 0) / 90) % 4 + 4) % 4;
          const uvc = [[box[0], box[1]], [box[2], box[1]], [box[2], box[3]], [box[0], box[3]]];
          const p = cs.map((c) => rot(c, el.rotation));
          const order = [0, 3, 2, 1];
          const v = order.map((i) => p[i]); const t = order.map((i) => uvc[(i + turns) % 4].map((x) => x / 16));
          const a = new THREE.Vector3(...v[1]).sub(new THREE.Vector3(...v[0]));
          const b = new THREE.Vector3(...v[3]).sub(new THREE.Vector3(...v[0]));
          const n = a.cross(b).normalize();
          for (const i of [0, 1, 2, 0, 2, 3]) { pos.push(...v[i]); uv.push(...t[i]); nor.push(n.x, n.y, n.z); }
        }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
      return { geo, mat: new THREE.MeshStandardMaterial({ map: tex, alphaTest: 0.1, side: THREE.DoubleSide, roughness: 1 }) };
    })().catch((e) => {
      // Non resta in cache: la prossima volta si riprova (es. rete che ha perso la richiesta).
      console.warn('[Guardaroba] pet non caricato', e);
      petCache.delete(key);
      return null;
    });
    petCache.set(key, p);
    return p;
  }
  // Pet nello spazio "y in su" del suo modello, gia' scalato e centrato.
  function petObject(key) {
    const def = PETS[key];
    const g = new THREE.Group(); g.scale.setScalar(def.scale);
    const inner = new THREE.Group(); inner.position.set(-def.center[0], -def.center[1], -def.center[2]); g.add(inner);
    loadPet(key).then((m) => { if (m) inner.add(new THREE.Mesh(m.geo, m.mat)); });
    return { g, inner };
  }
  function buildPet(id) {
    const root = mcSpace();
    const holder = new THREE.Group(); holder.scale.set(-1, -1, 1); root.add(holder);
    const { g, inner } = petObject(id);
    holder.add(g);
    if (id === 'dragon') {
      root.userData.update = (age) => { holder.position.set(-0.85, 1.5 - 1.55 + 0.05 * Math.sin(age * 0.05), 0.1); inner.position.y = -PETS.dragon.center[1] + Math.sin(age * 0.32 - 1.2) * 0.6; };
    } else if (id === 'dog' || id === 'snow_fox' || id === 'mini_me' || id === 'cat') {
      // Un po' piu' vicino che in gioco: nell'anteprima si vede tutto.
      holder.position.set(0.72, 1.5, 0.2);
      holder.rotation.y = deg(-20);
      root.userData.update = (age) => { g.position.y = 0.012 * Math.sin(age * 0.12); };
    } else {
      holder.position.set(0.36, 0, 0.02);
      root.userData.update = (age) => { g.scale.set(PETS.cat.scale, PETS.cat.scale * (1 + 0.02 * Math.sin(age * 0.1)), PETS.cat.scale); };
    }
    return root;
  }

  function build3D(c) {
    if (typeof THREE === 'undefined') return null;
    switch (c.slot) {
      case 'wings': return { obj: buildWings(c.id), attach: 'body' };
      case 'head':
        if (c.id === 'halo') return { obj: buildHalo(0xFFFFE07A, 0xFFFFC23A), attach: 'head' };
        if (c.id === 'ender_halo') return { obj: buildHalo(0xFFD2B4FF, 0xFF8A4CFF), attach: 'head' };
        if (c.id === 'horns') return { obj: buildHorns(), attach: 'head' };
        if (c.id === 'neworder_halo') return { obj: buildHalo(0xFFF8F9FF, 0xFFC8D4FF), attach: 'head' };
        return { obj: buildCrown(), attach: 'head' };
      case 'bandana': return { obj: buildBandana(c.id), attach: 'head' };
      case 'pet': return { obj: buildPet(c.id), attach: 'root' };
      case 'extra':
        if (c.id === 'orbit') return { obj: buildOrbit(), attach: 'root' };
        if (c.id === 'magic_circle') return { obj: buildMagicCircle(), attach: 'root' };
        if (c.id === 'sparkles') return { obj: buildSparkles(), attach: 'root' };
        return { obj: buildTail(), attach: 'body' };
      default: return null;
    }
  }

  // Texture animate di un cosmetico (per ridipingerle).
  const texIds = (id) => (texSpec(id) ? [id] : []);

  return {
    SLOTS, CATALOG, byId, texture, threeTexture, tickTextures, build3D, texIds, loadPet,
    // Nuova skin per il Mini te: il modello si ricarica con la texture giusta.
    setSkinUrl(url) {
      W.skinUrl = url;
      for (const key of [...petCache.keys()]) if (key.startsWith('mini_me')) petCache.delete(key);
    },
  };
})();
