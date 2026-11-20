// مولّد رمز QR صغير بدون أي مكتبة: وضع البايتات، مستوى التصحيح M، الإصدارات ١ إلى ٢٠.
// الخوارزمية هي المعيار نفسه (ISO 18004): ترميز، ريد-سولومون، توزيع، ثم اختيار أفضل قناع.
const QR = (() => {
  const ECC = [0, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26];   // بايتات التصحيح لكل مجموعة
  const BLK = [0, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16];                // عدد المجموعات
  const rawModules = (v) => {
    let r = (16 * v + 128) * v + 64;
    if (v >= 2) { const n = Math.floor(v / 7) + 2; r -= (25 * n - 10) * n - 55; if (v >= 7) r -= 36; }
    return r;
  };
  const dataCodewords = (v) => Math.floor(rawModules(v) / 8) - ECC[v] * BLK[v];

  // حساب الحقل GF(256)
  const EXP = new Uint8Array(512), LOG = new Uint8Array(256);
  (() => { let x = 1; for (let i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 256) x ^= 0x11D; } for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255]; })();
  const mul = (a, b) => (a && b ? EXP[LOG[a] + LOG[b]] : 0);
  function rsDivisor(deg) {
    const r = new Uint8Array(deg); r[deg - 1] = 1; let root = 1;
    for (let i = 0; i < deg; i++) {
      for (let j = 0; j < deg; j++) { r[j] = mul(r[j], root); if (j + 1 < deg) r[j] ^= r[j + 1]; }
      root = mul(root, 2);
    }
    return r;
  }
  function rsRemainder(data, div) {
    const r = new Uint8Array(div.length);
    for (const b of data) {
      const f = b ^ r[0]; r.copyWithin(0, 1); r[r.length - 1] = 0;
      for (let i = 0; i < r.length; i++) r[i] ^= mul(div[i], f);
    }
    return r;
  }
  const MASK = [
    (x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, (x, y) => x % 3 === 0, (x, y) => (x + y) % 3 === 0,
    (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => (x * y) % 2 + (x * y) % 3 === 0,
    (x, y) => ((x * y) % 2 + (x * y) % 3) % 2 === 0, (x, y) => ((x + y) % 2 + (x * y) % 3) % 2 === 0,
  ];

  function make(bytes) {
    // أصغر إصدار يكفي
    let v = 1;
    for (; ; v++) {
      if (v > 20) throw new Error('النص أطول من سعة الرمز');
      if (4 + (v < 10 ? 8 : 16) + bytes.length * 8 <= dataCodewords(v) * 8) break;
    }
    const cap = dataCodewords(v), bits = [];
    const put = (val, len) => { for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
    put(4, 4); put(bytes.length, v < 10 ? 8 : 16); for (const b of bytes) put(b, 8);
    put(0, Math.min(4, cap * 8 - bits.length)); put(0, (8 - bits.length % 8) % 8);
    for (let pad = 0xEC; bits.length < cap * 8; pad ^= 0xEC ^ 0x11) put(pad, 8);
    const data = new Uint8Array(cap); bits.forEach((b, i) => { data[i >>> 3] |= b << (7 - (i & 7)); });

    // تقسيم إلى مجموعات وإضافة التصحيح ثم التداخل
    const nb = BLK[v], el = ECC[v], raw = Math.floor(rawModules(v) / 8), nShort = nb - raw % nb, sl = Math.floor(raw / nb), div = rsDivisor(el), blocks = [];
    for (let i = 0, k = 0; i < nb; i++) { const dl = sl - el + (i < nShort ? 0 : 1), d = data.subarray(k, k + dl); k += dl; blocks.push([d, rsRemainder(d, div)]); }
    const out = [];
    for (let i = 0; i <= sl - el; i++) for (let j = 0; j < nb; j++) if (i < blocks[j][0].length) out.push(blocks[j][0][i]);
    for (let i = 0; i < el; i++) for (const b of blocks) out.push(b[1][i]);

    // المصفوفة والأنماط الثابتة
    const n = 17 + 4 * v, M = [], F = [];
    for (let y = 0; y < n; y++) { M.push(new Uint8Array(n)); F.push(new Uint8Array(n)); }
    const set = (x, y, d) => { M[y][x] = d ? 1 : 0; F[y][x] = 1; };
    for (let i = 0; i < n; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
    const finder = (cx, cy) => {
      for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
        const d = Math.max(Math.abs(dx), Math.abs(dy)), x = cx + dx, y = cy + dy;
        if (x >= 0 && x < n && y >= 0 && y < n) set(x, y, d !== 2 && d !== 4);
      }
    };
    finder(3, 3); finder(n - 4, 3); finder(3, n - 4);
    const al = [];
    if (v > 1) { const na = Math.floor(v / 7) + 2, step = Math.ceil((v * 4 + 4) / (na * 2 - 2)) * 2; al.push(6); for (let p = n - 7; al.length < na; p -= step) al.splice(1, 0, p); }
    for (let i = 0; i < al.length; i++) for (let j = 0; j < al.length; j++) {
      if ((i === 0 && j === 0) || (i === 0 && j === al.length - 1) || (i === al.length - 1 && j === 0)) continue;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(al[i] + dx, al[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }
    const format = (mask) => {
      let r = mask; for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537);
      const b = ((mask << 10) | r) ^ 0x5412, bit = (i) => ((b >>> i) & 1) === 1;
      for (let i = 0; i <= 5; i++) set(8, i, bit(i));
      set(8, 7, bit(6)); set(8, 8, bit(7)); set(7, 8, bit(8));
      for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
      for (let i = 0; i < 8; i++) set(n - 1 - i, 8, bit(i));
      for (let i = 8; i < 15; i++) set(8, n - 15 + i, bit(i));
      set(8, n - 8, true);
    };
    format(0);
    if (v >= 7) {
      let r = v; for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1F25);
      const b = (v << 12) | r;
      for (let i = 0; i < 18; i++) { const bt = ((b >>> i) & 1) === 1, a = n - 11 + i % 3, c = Math.floor(i / 3); set(a, c, bt); set(c, a, bt); }
    }
    // وضع البيانات بالمسار المتعرّج
    let k = 0;
    for (let right = n - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vert = 0; vert < n; vert++) for (let j = 0; j < 2; j++) {
        const x = right - j, up = ((right + 1) & 2) === 0, y = up ? n - 1 - vert : vert;
        if (!F[y][x] && k < out.length * 8) { M[y][x] = (out[k >>> 3] >>> (7 - (k & 7))) & 1; k++; }
      }
    }
    // اختيار القناع الأقل عقوبة
    const apply = (m) => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!F[y][x] && MASK[m](x, y)) M[y][x] ^= 1; };
    const penalty = () => {
      let p = 0;
      const line = (arr) => {
        let run = 1;
        for (let i = 1; i <= n; i++) { if (i < n && arr[i] === arr[i - 1]) run++; else { if (run >= 5) p += run - 2; run = 1; } }
        const s = arr.join(''); let q = -1;
        while ((q = s.indexOf('10111010000', q + 1)) >= 0) p += 40;
        q = -1; while ((q = s.indexOf('00001011101', q + 1)) >= 0) p += 40;
      };
      for (let y = 0; y < n; y++) line(Array.from(M[y]));
      for (let x = 0; x < n; x++) { const c = []; for (let y = 0; y < n; y++) c.push(M[y][x]); line(c); }
      for (let y = 0; y < n - 1; y++) for (let x = 0; x < n - 1; x++) { const c = M[y][x]; if (c === M[y][x + 1] && c === M[y + 1][x] && c === M[y + 1][x + 1]) p += 3; }
      let dark = 0; for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) dark += M[y][x];
      p += (Math.ceil(Math.abs(dark * 20 - n * n * 10) / (n * n)) - 1) * 10;
      return p;
    };
    let best = 0, bp = Infinity;
    for (let m = 0; m < 8; m++) { apply(m); format(m); const p = penalty(); if (p < bp) { bp = p; best = m; } apply(m); }
    apply(best); format(best);
    return { size: n, version: v, mask: best, get: (x, y) => M[y][x] === 1 };
  }

  // الرمز كمسار SVG (مع هامش أبيض ٤ خانات حوله)
  function svg(text, quiet = 4) {
    const q = make(new TextEncoder().encode(text)), n = q.size; let d = '';
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (q.get(x, y)) d += `M${x + quiet} ${y + quiet}h1v1h-1z`;
    const s = n + quiet * 2;
    return { size: s, version: q.version, path: d, markup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" shape-rendering="crispEdges" role="img"><rect width="${s}" height="${s}" fill="#fff"/><path d="${d}" fill="#000"/></svg>` };
  }
  return { make, svg };
})();
if (typeof module !== 'undefined') module.exports = QR;
