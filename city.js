(() => {
  if (customElements.get('dot-field')) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TAU = Math.PI * 2;
  const lerp = (a, b, f) => a + (b - a) * f;
  const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
  const mkLayer = (w, h, dpr) => { const c = document.createElement('canvas'); c.width = w * dpr; c.height = h * dpr; const x = c.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineJoin = 'round'; x.lineCap = 'round'; return [c, x]; };
  function isoFit(w, h, b) {
    const [x0, x1, y0, y1, zm] = b, zn = b[5] || 0, umin = (x0 - y1) * 0.866, umax = (x1 - y0) * 0.866, vmin = (x0 + y0) * 0.5 - zm, vmax = (x1 + y1) * 0.5 - zn;
    const s = Math.min(0.94 * w / (umax - umin), 0.9 * h / (vmax - vmin)), cx = w / 2 - s * (umin + umax) / 2, cy = h / 2 - s * (vmin + vmax) / 2;
    return { s, P: (x, y, z = 0) => [cx + (x - y) * 0.866 * s, cy + ((x + y) * 0.5 - z) * s] };
  }
  function isoGrid(x, P, s, col) {
    const step = s < 10 ? 2 : 1; x.strokeStyle = rgba(col, 0.07); x.lineWidth = 1; x.beginPath();
    for (let k = -80; k <= 80; k += step) { let a = P(k, -80), b = P(k, 80); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); a = P(-80, k); b = P(80, k); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); }
    x.stroke();
  }
  function poly(x, pts, close) { x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) x.lineTo(pts[i][0], pts[i][1]); if (close) x.closePath(); }
  function face(x, pts) { poly(x, pts, true); x.fill(); x.stroke(); }
  function line3(x, P, a, b) { const p = P(...a), q = P(...b); x.moveTo(p[0], p[1]); x.lineTo(q[0], q[1]); }
  function box(x, P, X, Y, Z, W, D, H, floors) {
    face(x, [P(X, Y + D, Z), P(X + W, Y + D, Z), P(X + W, Y + D, Z + H), P(X, Y + D, Z + H)]);
    face(x, [P(X + W, Y, Z), P(X + W, Y + D, Z), P(X + W, Y + D, Z + H), P(X + W, Y, Z + H)]);
    face(x, [P(X, Y, Z + H), P(X + W, Y, Z + H), P(X + W, Y + D, Z + H), P(X, Y + D, Z + H)]);
    if (floors) { const sv = x.strokeStyle; x.strokeStyle = x.dim; x.beginPath(); for (let k = floors; k < H - 0.05; k += floors) { line3(x, P, [X, Y + D, Z + k], [X + W, Y + D, Z + k]); line3(x, P, [X + W, Y, Z + k], [X + W, Y + D, Z + k]); } x.stroke(); x.strokeStyle = sv; }
  }
  function setupLayers(el, w, h) {
    const col = el.col(), [U, u] = mkLayer(w, h, el.dpr), [O, o] = mkLayer(w, h, el.dpr);
    o.fillStyle = '#000'; o.strokeStyle = rgba(col, 0.6); o.dim = rgba(col, 0.2); o.lineWidth = 1;
    const items = [];
    return { col, U, u, O, o, items, add: (k, f) => items.push({ k, f }), flush: () => { items.sort((a, b) => a.k - b.k).forEach(i => i.f()); } };
  }
  function isoDraw(t, st) {
    const { ctx, w, h } = this, col = this.col();
    ctx.clearRect(0, 0, w, h); ctx.globalAlpha = 1; ctx.drawImage(st.U, 0, 0, w, h);
    ctx.fillStyle = ctx.strokeStyle = col;
    for (const g of st.mid || []) drawBeads(ctx, g, t);
    if (st.midDyn) st.midDyn(ctx, t);
    ctx.globalAlpha = 1; ctx.drawImage(st.O, 0, 0, w, h);
    ctx.fillStyle = ctx.strokeStyle = col;
    for (const g of st.top || []) drawBeads(ctx, g, t);
    ctx.globalAlpha = 1; if (st.dyn) st.dyn(ctx, t);
  }
  function tree(x, P, s, X, Y) { x.beginPath(); line3(x, P, [X, Y, 0], [X, Y, 0.35]); x.stroke(); const c = P(X, Y, 0.55); x.beginPath(); x.arc(c[0], c[1], 0.22 * s, 0, TAU); x.fill(); x.stroke(); }
  function cityPlan(L, P, s, I, J, pt, bs, opt = {}) {
    const u = L.u, roofs = [], hm = opt.hmul || 1;
    u.strokeStyle = rgba(L.col, 0.16); u.lineWidth = 1;
    for (let i = 0; i < I; i++) for (let j = 0; j < J; j++) {
      const bx = i * pt, by = j * pt, kind = opt.kind ? opt.kind(i, j) : (Math.random() < 0.1 ? 'park' : 'build');
      poly(u, [P(bx, by), P(bx + bs, by), P(bx + bs, by + bs), P(bx, by + bs)], true); u.stroke();
      if (kind === 'park') { for (let q = 0; q < 6; q++) { const tx = bx + 0.3 + Math.random() * (bs - 0.6), ty = by + 0.3 + Math.random() * (bs - 0.6); L.add(tx + ty, () => tree(L.o, P, s, tx, ty)); } continue; }
      if (kind === 'empty') continue;
      if (Math.random() < 0.45) { const hh = (1.4 + Math.random() ** 2 * 3.4) * hm; roofs.push([bx + bs / 2, by + bs / 2, hh]); L.add(bx + by + bs, () => box(L.o, P, bx + 0.15, by + 0.15, 0, bs - 0.3, bs - 0.3, hh, 0.35)); }
      else for (let q = 0; q < 4; q++) { const x = bx + (q % 2) * bs / 2 + 0.1, y = by + (q >> 1) * bs / 2 + 0.1, hh = (0.5 + Math.random() * 1.2) * hm; roofs.push([x + bs / 4 - 0.1, y + bs / 4 - 0.1, hh]); L.add(x + y + bs / 2, () => box(L.o, P, x, y, 0, bs / 2 - 0.2, bs / 2 - 0.2, hh, 0.35)); }
    }
    return roofs;
  }
  function mkStreets(I, J, pt, ok) { return { I, J, pt, ok, X: i => i * pt - 0.45, nb: (i, j) => [[i + 1, j], [i - 1, j], [i, j + 1], [i, j - 1]].filter(([a, b]) => a >= 0 && b >= 0 && a <= I && b <= J) }; }
  function nbOk(G, w, a) { return G.nb(...a).filter(q => !G.ok || G.ok(w.type, a, q)); }
  function spawnW(G, type, sp, lane) {
    for (let k = 0; k < 50; k++) { const a = [Math.floor(Math.random() * (G.I + 1)), Math.floor(Math.random() * (G.J + 1))], w = { a, f: Math.random(), sp, lane, type }, nb = nbOk(G, w, a); if (nb.length) { w.b = nb[Math.floor(Math.random() * nb.length)]; return w; } }
    return { a: [0, 0], b: [1, 0], f: 0, sp, lane, type };
  }
  function stepW(G, w, choose) {
    w.f += w.sp; if (w.f < 1) return;
    w.f -= 1; const prev = w.a; w.a = w.b;
    let nb = nbOk(G, w, w.a); const fwd = nb.filter(q => q[0] !== prev[0] || q[1] !== prev[1]); if (fwd.length) nb = fwd;
    w.b = (choose && nb.length ? choose(w, nb) : nb[Math.floor(Math.random() * nb.length)]) || prev;
  }
  function posW(G, w, f = w.f) { const ax = G.X(w.a[0]), ay = G.X(w.a[1]), bx = G.X(w.b[0]), by = G.X(w.b[1]); let dx = bx - ax, dy = by - ay; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l; return [lerp(ax, bx, f) - dy * w.lane, lerp(ay, by, f) + dx * w.lane]; }
  function drawPeds(ctx, G, W, P, z, r, alpha) { ctx.globalAlpha = alpha; ctx.beginPath(); for (const w of W) { const [x, y] = posW(G, w), q = P(x, y, z); ctx.moveTo(q[0] + r, q[1]); ctx.arc(q[0], q[1], r, 0, TAU); } ctx.fill(); }

  const SC = {};

  SC.isogrid = {
    init(w, h) {
      const [U, u] = mkLayer(w, h, this.dpr), S = +this.getAttribute('cell') || 44, k = Math.tan(Math.PI / 6), span = w * k + h;
      u.strokeStyle = rgba(this.col(), +this.getAttribute('alpha') || 0.08); u.lineWidth = 1; u.beginPath();
      for (let c = -span; c <= span; c += S) { u.moveTo(0, c); u.lineTo(w, c + w * k); u.moveTo(0, c + w * k); u.lineTo(w, c); }
      u.stroke();
      return { U, static: true };
    },
    draw(t, st) { const { ctx, w, h } = this; ctx.clearRect(0, 0, w, h); ctx.globalAlpha = 1; ctx.drawImage(st.U, 0, 0, w, h); }
  };

  SC.u_gather = {
    init(w, h) {
      const I = 6, J = 6, pt = 2.9, { s, P } = isoFit(w, h, [-1, I * pt, -1, J * pt, 4.4]), L = setupLayers(this, w, h);
      if (!this.hasAttribute('nogrid')) isoGrid(L.u, P, s, L.col);
      const plaza = (i, j) => (i === 2 || i === 3) && (j === 2 || j === 3);
      cityPlan(L, P, s, I, J, pt, 2, { hmul: 0.8, kind: (i, j) => plaza(i, j) ? 'empty' : 'build' });
      const c0 = 3 * pt - 0.45; L.u.strokeStyle = rgba(L.col, 0.2); L.u.beginPath(); const cc = P(c0, c0); L.u.ellipse(cc[0], cc[1], 2.4 * s * 1.22, 2.4 * s * 0.71, 0, 0, TAU); L.u.stroke();
      for (let k = 0; k < 16; k++) { const a = k / 16 * TAU, x = c0 + Math.cos(a) * 3.6, y = c0 + Math.sin(a) * 3.6; L.add(x + y, () => tree(L.o, P, s, x, y)); }
      L.flush();
      const G = mkStreets(I, J, pt), W = Array.from({ length: Math.round(w * h / 1100) }, () => spawnW(G, 'p', 0.004 + Math.random() * 0.004, (Math.random() - 0.5) * 0.8));
      return {
        U: L.U, O: L.O,
        midDyn: (ctx, t) => {
          const pull = Math.sin(t * 0.00022);
          const choose = (a, nb) => { if (Math.random() > Math.abs(pull) * 0.85) return nb[Math.floor(Math.random() * nb.length)]; const d = q => Math.hypot(q[0] - 3, q[1] - 3); return nb.slice().sort((p, q) => pull > 0 ? d(p) - d(q) : d(q) - d(p))[0]; };
          for (const a of W) stepW(G, a, choose);
          drawPeds(ctx, G, W, P, 0.02, Math.max(0.9, s * 0.05), 0.8);
        }
      };
    },
    draw: isoDraw
  };


  class DotField extends HTMLElement {
    static get observedAttributes() { return ['mode', 'color', 'cell', 'alpha']; }
    constructor() {
      super();
      this.c = document.createElement('canvas');
      this.c.style.cssText = 'display:block;width:100%;height:100%';
      this.ctx = this.c.getContext('2d');
      this.vis = true; this.last = 0;
    }
    col() { return this.getAttribute('color') || '#a7a9a0'; }
    connectedCallback() {
      Object.assign(this.style, { display: 'block', position: 'absolute', inset: '0', width: '100%', height: '100%' });
      if (this.parentElement && getComputedStyle(this.parentElement).position === 'static') this.parentElement.style.position = 'absolute', this.parentElement.style.inset = '0';
      this.setAttribute('aria-hidden', 'true');
      this.appendChild(this.c);
      this.ro = new ResizeObserver(() => this.build()); this.ro.observe(this); if (this.parentElement) this.ro.observe(this.parentElement);
      this.io = new IntersectionObserver(e => { this.vis = e[0].isIntersecting; if (!this.sc) this.build(); if (this.vis) this.loop(); });
      this.io.observe(this);
      requestAnimationFrame(() => this.build()); setTimeout(() => this.build(), 300); setTimeout(() => this.build(), 1200);
    }
    disconnectedCallback() { this.ro && this.ro.disconnect(); this.io && this.io.disconnect(); cancelAnimationFrame(this.raf); this.raf = 0; }
    attributeChangedCallback() { if (this.isConnected) { this.w = 0; this.build(); } }
    build() {
      const w = this.clientWidth, h = this.clientHeight;
      if (!w || !h) { if (this.isConnected && !this.retry) { this.retry = 1; requestAnimationFrame(() => { this.retry = 0; this.build(); }); } return; }
      if (w === this.w && h === this.h && this.sc) return;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      this.mode = this.getAttribute('mode') || 'isogrid';
      this.w = w; this.h = h; this.dpr = dpr;
      const S = SC[this.mode]; if (!S) return;
      try { this.sc = S.init.call(this, w, h); } catch (e) { console.error('dot-field', e); return; }
      this.c.width = w * dpr; this.c.height = h * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.draw(performance.now());
      this.loop();
    }
    draw(t) { if (this.sc) SC[this.mode].draw.call(this, t, this.sc); }
    loop() {
      if (reduce || this.raf || !this.sc || this.sc.static) return;
      const step = t => {
        this.raf = 0;
        if (!this.vis || !this.isConnected) return;
        if (t - this.last > 33) { this.last = t; this.draw(t); }
        this.raf = requestAnimationFrame(step);
      };
      this.raf = requestAnimationFrame(step);
    }
  }
  customElements.define('dot-field', DotField);
})();
