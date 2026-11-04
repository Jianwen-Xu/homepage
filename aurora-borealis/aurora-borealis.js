(function (root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AuroraBorealis = factory();
})(this, function () {

  var hasOwn = {}.hasOwnProperty;
  var STYLE_ID = 'ab-styles';
  var TAU = Math.PI * 2;

  /* ------------------------------------------------------------------ */
  /*  STYLES                                                            */
  /* ------------------------------------------------------------------ */

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var css = document.createElement('style');
    css.id = STYLE_ID;
    css.textContent =
      '.ab-canvas{position:absolute;top:0;left:0;width:100%;height:100%;display:block;pointer-events:none;filter:blur(.3px)}' +
      '.ab-stars{position:absolute;top:0;left:0;width:100%;height:75%;pointer-events:none;overflow:hidden}' +
      '.ab-star{position:absolute;width:2px;height:2px;background:#fff;border-radius:50%;animation:abTwinkle var(--dur,3s) ease-in-out infinite;animation-delay:var(--delay,0s)}' +
      '.ab-star.lg{width:3px;height:3px}' +
      '@keyframes abTwinkle{0%,100%{opacity:0.1;transform:scale(0.8)}50%{opacity:1;transform:scale(1.2)}}' +
      '.ab-g-aurora{position:absolute;top:0;left:0;right:0;height:100%;pointer-events:none}' +
      '.ab-mountains{position:absolute;bottom:0;left:0;width:100%;height:20%;pointer-events:none;z-index:2}' +
      '.ab-mountains svg{position:absolute;bottom:0;left:0;width:100%;height:100%}' +
      '.ab-far{fill:#0a1225;opacity:0.6}' +
      '.ab-mid{fill:#080e1a;opacity:0.8}' +
      '.ab-near{fill:#060d1a;opacity:0.95}' +
      '.ab-reflection{position:absolute;bottom:0;left:0;width:100%;height:12%;background:linear-gradient(180deg,transparent 0%,rgba(83,229,166,0.05) 40%,rgba(189,99,193,0.03) 70%,transparent 100%);pointer-events:none}' +
      '.ab.screensaver *{pointer-events:none!important}' +
      '.ab.screensaver .ab-scr-btn,.ab.screensaver .ab-auto-btn,.ab.screensaver .ab-shuffle-btn{pointer-events:auto!important}' +
      '.ab-controls{position:absolute;bottom:1.5rem;right:1.5rem;display:flex;flex-direction:row-reverse;gap:0.5rem;z-index:10;pointer-events:none}' +
      '.ab-controls button{pointer-events:auto;width:2.5rem;height:2.5rem;border-radius:50%;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.6);font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.3s;backdrop-filter:blur(4px);padding:0;line-height:1}' +
      '.ab-controls button:hover{background:rgba(255,255,255,0.15);color:#fff;border-color:rgba(255,255,255,0.4)}' +
      '.ab-auto-btn.active{background:rgba(83,229,166,0.2);border-color:rgba(83,229,166,0.5);color:#76F7A6}' +
      '.ab-auto-btn.active:hover{background:rgba(83,229,166,0.3)}' +
      '.ab-shooting-star{position:fixed;pointer-events:none;z-index:1000;animation:abShoot linear forwards}' +
      '.ab-shooting-star .head{position:absolute;top:-1px;left:0;width:3px;height:3px;background:#fff;border-radius:50%;box-shadow:0 0 4px 2px rgba(255,255,255,0.6)}' +
      '.ab-shooting-star .tail{width:100%;height:2px;background:linear-gradient(90deg,#fff 0%,rgba(255,255,255,0.6) 20%,transparent 100%);border-radius:1px}' +
      '@keyframes abShoot{0%{opacity:1}80%{opacity:1}100%{opacity:0}}';
    document.head.appendChild(css);
  }

  /* ------------------------------------------------------------------ */
  /*  MATH                                                              */
  /* ------------------------------------------------------------------ */

  function hash1(n) {
    var s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return s - Math.floor(s);
  }

  function noise1(x) {
    var i = Math.floor(x);
    var f = x - i;
    var u = f * f * (3 - 2 * f);
    return hash1(i) * (1 - u) + hash1(i + 1) * u;
  }

  function fbm1(x) {
    return noise1(x) * 0.65 + noise1(x * 2.03 + 17.3) * 0.35;
  }

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  function parseHex(hex) {
    var h = String(hex).replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    if (isNaN(n)) return [255, 255, 255];
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function mixRgb(a, b, t) {
    return [
      Math.round(a[0] + (b[0] - a[0]) * t),
      Math.round(a[1] + (b[1] - a[1]) * t),
      Math.round(a[2] + (b[2] - a[2]) * t)
    ];
  }

  function rgba(c, a) {
    return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')';
  }

  /* ------------------------------------------------------------------ */
  /*  SPRITES                                                           */
  /* ------------------------------------------------------------------ */

  function makeSprite(bottom, mid, top) {
    var s = document.createElement('canvas');
    s.width = 48;
    s.height = 256;
    var g = s.getContext('2d');
    var lg = g.createLinearGradient(0, 0, 0, 256);
    lg.addColorStop(0.00, rgba(top, 0));
    lg.addColorStop(0.22, rgba(top, 0.08));
    lg.addColorStop(0.50, rgba(mid, 0.34));
    lg.addColorStop(0.76, rgba(mid, 0.62));
    lg.addColorStop(0.91, rgba(bottom, 0.95));
    lg.addColorStop(0.97, rgba(bottom, 1));
    lg.addColorStop(1.00, rgba(bottom, 0.9));
    g.fillStyle = lg;
    g.fillRect(0, 0, 48, 256);

    // soft horizontal edges so adjacent columns blend into a curtain
    var mg = g.createLinearGradient(0, 0, 48, 0);
    mg.addColorStop(0, 'rgba(0,0,0,0)');
    mg.addColorStop(0.30, 'rgba(0,0,0,0.40)');
    mg.addColorStop(0.50, 'rgba(0,0,0,1)');
    mg.addColorStop(0.70, 'rgba(0,0,0,0.40)');
    mg.addColorStop(1, 'rgba(0,0,0,0)');
    g.globalCompositeOperation = 'destination-in';
    g.fillStyle = mg;
    g.fillRect(0, 0, 48, 256);
    return s;
  }

  /* ------------------------------------------------------------------ */
  /*  DEFAULTS                                                          */
  /* ------------------------------------------------------------------ */

  var DEFAULTS = {
    bands: 3,
    colors: { purple: '#bd63c1', green: '#53e5a6' },
    autoShuffle: false,
    autoInterval: [8000, 14000],
    transitionMode: ['fade-in-out', 'delayed-reveal', 'slow-fade'],
    stars: 80,
    shootingStars: true,
    controls: ['fullscreen', 'shuffle', 'auto']
  };

  // base, amp, height, freq1, freq2, freq3, speed, phase, ray frequency, alpha, body, sprite, edge, halo
  var LAYER_TEMPLATES = [
    { base: 0.62, amp: 0.09, h: 0.50, f1: 0.90, f2: 2.4, f3: 4.2, speed: 0.24, phase: 0.00, slope: 0.18, ray: 240, alpha: 1.00, body: 0.60, sprite: 0, edge: true,  halo: true },
    { base: 0.52, amp: 0.11, h: 0.62, f1: 0.90, f2: 2.4, f3: 3.4, speed: 0.22, phase: 0.20, slope: 0.26, ray: 170, alpha: 0.34, body: 0.26, sprite: 1, edge: false, halo: false },
    { base: 0.70, amp: 0.07, h: 0.32, f1: 0.90, f2: 2.4, f3: 6.2, speed: 0.26, phase: 0.40, slope: -0.04, ray: 310, alpha: 0.16, body: 0.14, sprite: 2, edge: false, halo: false }
  ];

  /* ------------------------------------------------------------------ */
  /*  CONSTRUCTOR                                                       */
  /* ------------------------------------------------------------------ */

  function AuroraBorealis(container, options) {
    if (!(this instanceof AuroraBorealis)) return new AuroraBorealis(container, options);
    this._init(container, options);
  }

  AuroraBorealis.prototype._init = function (container, options) {
    injectStyles();
    this.opts = {};
    var k;
    for (k in DEFAULTS) if (hasOwn.call(DEFAULTS, k)) this.opts[k] = DEFAULTS[k];
    if (options) for (k in options) if (hasOwn.call(options, k)) this.opts[k] = options[k];

    this._el = typeof container === 'string'
      ? document.querySelector(container)
      : container;
    if (!this._el) throw new Error('AuroraBorealis: container not found');

    this._destroyed = false;
    this._autoTimer = null;
    this._starTimer = null;
    this._randomizeLock = false;
    this._screensaver = false;
    this._raf = null;
    this._inView = true;
    this._lastTime = 0;

    this._build();
    this._initRenderer();
    if (this.opts.stars > 0) this._spawnStars();
    if (this.opts.autoShuffle) this.startAuto();
  };

  /* ------------------------------------------------------------------ */
  /*  BUILD DOM                                                         */
  /* ------------------------------------------------------------------ */

  AuroraBorealis.prototype._build = function () {
    var el = this._el;
    el.style.overflow = 'hidden';
    el.style.background = '#0b1a3a';

    var g = document.createElement('div');
    g.className = 'ab-g-aurora';

    var canvas = document.createElement('canvas');
    canvas.className = 'ab-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    g.appendChild(canvas);
    el.appendChild(g);
    this._gAurora = g;
    this._canvas = canvas;
    this._ctx = canvas.getContext('2d');

    var stars = document.createElement('div');
    stars.className = 'ab-stars';
    stars.id = 'ab-stars';
    el.appendChild(stars);
    this._starsEl = stars;

    this._buildMountains(el);

    var ref = document.createElement('div');
    ref.className = 'ab-reflection';
    el.appendChild(ref);

    this._buildControls(el);
  };

  AuroraBorealis.prototype._buildMountains = function (el) {
    var m = document.createElement('div');
    m.className = 'ab-mountains';
    m.innerHTML =
      '<svg viewBox="0 0 1440 320" preserveAspectRatio="none">' +
      '<path class="ab-far" d="M0,280 C200,260 360,210 540,220 C720,230 900,170 1080,180 C1260,190 1380,230 1440,240 L1440,320 L0,320 Z"/>' +
      '<path class="ab-mid" d="M0,290 C240,270 480,230 720,240 C960,250 1200,210 1440,260 L1440,320 L0,320 Z"/>' +
      '<path class="ab-near" d="M0,305 C360,290 720,270 1080,280 C1260,285 1350,290 1440,295 L1440,320 L0,320 Z"/>' +
      '</svg>';
    el.appendChild(m);
  };

  AuroraBorealis.prototype._buildControls = function (el) {
    var ctrls = document.createElement('div');
    ctrls.className = 'ab-controls';
    var controls = this.opts.controls;

    if (controls.indexOf('fullscreen') !== -1) {
      var fsBtn = document.createElement('button');
      fsBtn.className = 'ab-scr-btn';
      fsBtn.title = 'Fullscreen';
      fsBtn.innerHTML = '&#x26F6;';
      fsBtn.addEventListener('click', this._toggleFullscreen.bind(this));
      ctrls.appendChild(fsBtn);
    }

    if (controls.indexOf('shuffle') !== -1) {
      var shBtn = document.createElement('button');
      shBtn.className = 'ab-shuffle-btn';
      shBtn.title = 'Randomize';
      shBtn.innerHTML = '&#x21C4;';
      shBtn.addEventListener('click', this.shuffle.bind(this));
      ctrls.appendChild(shBtn);
    }

    if (controls.indexOf('auto') !== -1) {
      var auBtn = document.createElement('button');
      auBtn.className = 'ab-auto-btn';
      auBtn.title = 'Start auto-shuffle';
      auBtn.innerHTML = '&#x25B6;';
      auBtn.addEventListener('click', this._toggleAuto.bind(this));
      ctrls.appendChild(auBtn);
      this._autoBtn = auBtn;
    }

    el.appendChild(ctrls);
  };

  /* ------------------------------------------------------------------ */
  /*  RENDERER                                                          */
  /* ------------------------------------------------------------------ */

  AuroraBorealis.prototype._initRenderer = function () {
    var ctx = this._ctx;
    if (!ctx) return;

    this._scale = 0.68;
    this._w = 960;
    this._h = 540;

    var green = mixRgb(parseHex(this.opts.colors.green), [70, 255, 120], 0.28);
    var purple = parseHex(this.opts.colors.purple);
    var teal = mixRgb(green, [60, 210, 220], 0.45);
    var violet = mixRgb(purple, [80, 70, 180], 0.35);
    var ice = mixRgb(green, [160, 245, 255], 0.55);

    this._edgeRgb = mixRgb(green, [200, 255, 220], 0.3);
    this._sprites = [
      makeSprite(mixRgb(green, [200, 255, 220], 0.25), teal, violet),
      makeSprite(ice, mixRgb(teal, [70, 150, 255], 0.35), violet),
      makeSprite(mixRgb(green, [220, 255, 230], 0.35), mixRgb(teal, [120, 240, 220], 0.4), mixRgb(violet, purple, 0.4))
    ];

    var count = clamp(this.opts.bands || 3, 1, 3);
    // one main curtain plus at least one echo gives a single band depth
    count = Math.max(2, count);

    this._layers = [];
    for (var i = 0; i < count; i++) {
      var tpl = LAYER_TEMPLATES[i];
      var cur = {};
      for (var k in tpl) if (hasOwn.call(tpl, k)) cur[k] = tpl[k];
      this._layers.push({ cur: cur, tgt: Object.assign({}, cur) });
    }

    this._reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._resize();

    var self = this;
    if (window.ResizeObserver) {
      this._ro = new ResizeObserver(function () { self._resize(); });
      this._ro.observe(this._el);
    }
    this._onResize = function () { self._resize(); };
    window.addEventListener('resize', this._onResize);

    if (window.IntersectionObserver) {
      this._io = new IntersectionObserver(function (entries) {
        self._inView = entries[0].isIntersecting;
      }, { threshold: 0 });
      this._io.observe(this._el);
    }

    if (this._reduced) {
      this._drawAt(14);
    } else {
      this._start = performance.now();
      this._frame = this._frame.bind(this);
      this._raf = requestAnimationFrame(this._frame);
    }
  };

  AuroraBorealis.prototype._resize = function () {
    if (!this._ctx || this._destroyed) return;
    var rect = this._el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    // render below device resolution: the effect is soft, and this keeps
    // per-column drawing affordable on phones and 4K screens alike
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5) * 0.5;
    this._scale = dpr;
    this._w = Math.max(320, Math.round(rect.width * dpr));
    this._h = Math.max(240, Math.round(rect.height * dpr));
    this._canvas.width = this._w;
    this._canvas.height = this._h;
    this._canvas.style.width = '100%';
    this._canvas.style.height = '100%';
    if (this._reduced) this._drawAt(14);
  };

  AuroraBorealis.prototype._frame = function (now) {
    if (this._destroyed) return;
    this._raf = requestAnimationFrame(this._frame);
    if (!this._inView || document.hidden) return;

    var dt = this._lastTime ? Math.min(0.1, (now - this._lastTime) / 1000) : 0.016;
    this._lastTime = now;
    var t = (now - this._start) / 1000;

    // ease live parameters toward their targets so shuffle is a morph,
    // not a cut between two different skies
    var k = 1 - Math.pow(0.0025, dt);
    for (var i = 0; i < this._layers.length; i++) {
      var L = this._layers[i];
      var cur = L.cur, tgt = L.tgt;
      for (var key in cur) {
        if (hasOwn.call(cur, key) && typeof cur[key] === 'number') {
          cur[key] += (tgt[key] - cur[key]) * k;
        }
      }
    }

    this._drawAt(t);
  };

  AuroraBorealis.prototype._drawAt = function (t) {
    var ctx = this._ctx;
    if (!ctx || !this._w || !this._h) return;
    var W = this._w, H = this._h;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    this._drawSky(W, H);

    for (var i = 0; i < this._layers.length; i++) {
      this._drawLayer(this._layers[i].cur, t, W, H);
    }

    this._drawVignette(W, H);
  };

  AuroraBorealis.prototype._drawSky = function (W, H) {
    var ctx = this._ctx;
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#040814');
    g.addColorStop(0.40, '#071326');
    g.addColorStop(0.70, '#0a1c36');
    g.addColorStop(1, '#061020');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    var r = ctx.createRadialGradient(W * 0.5, H * 0.64, 0, W * 0.5, H * 0.64, W * 0.7);
    r.addColorStop(0, 'rgba(40,110,95,.10)');
    r.addColorStop(0.5, 'rgba(20,70,110,.05)');
    r.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = r;
    ctx.fillRect(0, 0, W, H);
  };

  AuroraBorealis.prototype._yAt = function (L, u, phase, H) {
    return H * (L.base
      + L.amp * Math.sin(u * TAU * L.f1 + phase)
      + L.amp * 0.55 * Math.sin(u * TAU * L.f2 - phase * 1.6 + L.phase * 3)
      + L.amp * 0.30 * Math.sin(u * TAU * 3.1 + phase * 0.6 + 2.1)
      + L.slope * (u - 0.5));
  };

  AuroraBorealis.prototype._drawLayer = function (L, t, W, H) {
    var ctx = this._ctx;
    var sp = this._sprites[L.sprite] || this._sprites[0];
    var step = 3;
    var phase = t * L.speed + L.phase;
    var self = this;

    ctx.globalCompositeOperation = 'lighter';

    function pass(halo) {
      if (halo && !L.halo) return;
      var stride = halo ? step * 2 : step;
      for (var x = -stride; x <= W + stride; x += stride) {
        var u = x / W;
        var y0 = self._yAt(L, u, phase, H);
        var hh = H * L.h * (0.68 + 0.32 * noise1(u * L.f3 + L.phase * 10 + t * 0.03))
          * (0.78 + 0.22 * noise1(u * 1.6 + L.phase + t * 0.02));
        var slow = 0.45 + 0.55 * fbm1(u * 2.2 + L.phase * 4 + t * 0.03);
        var bundle = Math.pow(noise1(u * 5.5 + L.phase * 9 + t * 0.05), 2.2);
        var fine = noise1(u * L.ray + L.phase * 30 + t * 0.22);
        var fine2 = noise1(u * L.ray * 1.9 + L.phase * 13 + t * 0.31);
        var intensity = Math.pow(fine * 0.6 + fine2 * 0.4, 2.7);
        var a = L.alpha * slow * (0.22 + 0.78 * intensity) * (0.25 + 0.75 * bundle);

        var w = step * (halo ? 9 : 2.6);
        var top = y0 - hh * (halo ? 0.55 : 1);
        var height = hh * (halo ? 0.75 : 1);
        ctx.globalAlpha = Math.min(1, halo ? a * 0.20 : a);
        ctx.drawImage(sp, x - w / 2, top, w, height);
      }
    }

    pass(true);
    pass(false);
    ctx.globalAlpha = 1;

    if (L.edge) this._drawEdge(L, t, phase, W, H);
  };

  AuroraBorealis.prototype._drawEdge = function (L, t, phase, W, H) {
    var ctx = this._ctx;
    var pts = Math.max(80, Math.round(W / 8));
    var i, u, y;

    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath();
    for (i = 0; i < pts; i++) {
      u = i / (pts - 1);
      y = this._yAt(L, u, phase, H)
        + 1.6 * Math.sin(u * 41 + L.phase * 5)
        + 1.1 * Math.sin(u * 97 + 1.7);
      if (i === 0) ctx.moveTo(u * W, y); else ctx.lineTo(u * W, y);
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    var passes = [[40, 0.07], [18, 0.11], [7, 0.10]];
    for (var p = 0; p < passes.length; p++) {
      var grad = ctx.createLinearGradient(0, 0, W, 0);
      for (var k = 0; k <= 24; k++) {
        var uk = k / 24;
        var n = noise1(uk * 11 + L.phase * 3 + t * 0.22) * 0.7
          + noise1(uk * 37 + L.phase * 9 + t * 0.4) * 0.3;
        var aa = passes[p][1] * L.alpha * (0.25 + 0.9 * n);
        grad.addColorStop(uk, rgba(this._edgeRgb, Math.min(0.6, aa)));
      }
      ctx.lineWidth = passes[p][0] * this._scale;
      ctx.strokeStyle = grad;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  AuroraBorealis.prototype._drawVignette = function (W, H) {
    var ctx = this._ctx;
    var v = ctx.createRadialGradient(W * 0.5, H * 0.48, H * 0.18, W * 0.5, H * 0.5, H * 0.9);
    v.addColorStop(0, 'rgba(0,0,0,0)');
    v.addColorStop(0.65, 'rgba(0,0,0,.06)');
    v.addColorStop(1, 'rgba(0,0,0,.5)');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, W, H);
  };

  /* ------------------------------------------------------------------ */
  /*  STARS                                                             */
  /* ------------------------------------------------------------------ */

  AuroraBorealis.prototype._spawnStars = function () {
    var container = this._starsEl;
    if (!container) return;
    var count = this.opts.stars;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var s = document.createElement('div');
      s.className = 'ab-star' + (Math.random() > 0.85 ? ' lg' : '');
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      s.style.setProperty('--dur', (2 + Math.random() * 4) + 's');
      s.style.setProperty('--delay', (Math.random() * 5) + 's');
      frag.appendChild(s);
    }
    container.appendChild(frag);
  };

  /* ------------------------------------------------------------------ */
  /*  SHOOTING STARS                                                    */
  /* ------------------------------------------------------------------ */

  AuroraBorealis.prototype._spawnShootingStar = function () {
    if (!this.opts.shootingStars) return;
    var el = document.createElement('div');
    el.className = 'ab-shooting-star';
    el.innerHTML = '<div class="head"></div><div class="tail"></div>';
    var angle = -20 + Math.random() * 40;
    var dist = 150 + Math.random() * 200;
    var dur = 0.25 + Math.random() * 0.3;
    el.style.cssText = 'left:' + (Math.random() * 80 + 5) + '%;top:' + (Math.random() * 40 + 2) + '%;width:' + dist + 'px;transform:rotate(' + angle + 'deg);transform-origin:left center;animation-duration:' + dur + 's';
    document.body.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, dur * 1000);
  };

  AuroraBorealis.prototype._startShootingStars = function () {
    var self = this;
    function schedule() {
      self._starTimer = setTimeout(function () {
        self._spawnShootingStar();
        schedule();
      }, 6000 + Math.random() * 9000);
    }
    schedule();
  };

  AuroraBorealis.prototype._stopShootingStars = function () {
    if (this._starTimer) { clearTimeout(this._starTimer); this._starTimer = null; }
  };

  /* ------------------------------------------------------------------ */
  /*  RANDOMIZE                                                         */
  /* ------------------------------------------------------------------ */

  AuroraBorealis.prototype.randomize = function () {
    if (!this._layers) return;
    var r = function (mn, mx) { return mn + Math.random() * (mx - mn); };

    for (var i = 0; i < this._layers.length; i++) {
      var L = this._layers[i];
      var tpl = LAYER_TEMPLATES[i];
      var tgt = L.tgt;
      tgt.base = clamp(tpl.base + r(-0.05, 0.04), 0.38, 0.78);
      tgt.amp = tpl.amp * r(0.65, 1.45);
      tgt.h = clamp(tpl.h * r(0.82, 1.18), 0.24, 0.72);
      tgt.f1 = tpl.f1 * r(0.8, 1.25);
      tgt.f2 = tpl.f2 * r(0.85, 1.15);
      tgt.speed = tpl.speed * r(0.72, 1.35);
      tgt.phase = r(0, TAU);
      tgt.slope = tpl.slope * r(0.6, 1.4);
      tgt.ray = tpl.ray * r(0.8, 1.25);
      tgt.alpha = tpl.alpha * r(0.82, 1.1);
    }
    if (this._reduced) this._drawAt(14);
  };

  AuroraBorealis.prototype._smoothRandomize = function () {
    this.randomize();
  };

  /* ------------------------------------------------------------------ */
  /*  PUBLIC METHODS                                                    */
  /* ------------------------------------------------------------------ */

  AuroraBorealis.prototype.shuffle = function () {
    this.randomize();
  };

  AuroraBorealis.prototype.startAuto = function () {
    if (this._autoTimer) return;
    if (this._autoBtn) {
      this._autoBtn.classList.add('active');
      this._autoBtn.innerHTML = '&#x23F8;';
      this._autoBtn.title = 'Pause auto-shuffle';
    }
    var self = this;
    function tick() {
      self._smoothRandomize();
      self._autoTimer = setTimeout(tick, self.opts.autoInterval[0] + Math.random() * (self.opts.autoInterval[1] - self.opts.autoInterval[0]));
    }
    tick();
  };

  AuroraBorealis.prototype.stopAuto = function () {
    if (this._autoTimer) { clearTimeout(this._autoTimer); this._autoTimer = null; }
    if (this._autoBtn) {
      this._autoBtn.classList.remove('active');
      this._autoBtn.innerHTML = '&#x25B6;';
      this._autoBtn.title = 'Start auto-shuffle';
    }
  };

  AuroraBorealis.prototype._toggleAuto = function () {
    if (this._autoTimer) this.stopAuto(); else this.startAuto();
  };

  AuroraBorealis.prototype.enterFullscreen = function () {
    this._screensaver = true;
    this._el.classList.add('screensaver');
    this._startShootingStars();
    try { document.documentElement.requestFullscreen(); } catch (e) {}
  };

  AuroraBorealis.prototype.exitFullscreen = function () {
    this._screensaver = false;
    this._el.classList.remove('screensaver');
    this._stopShootingStars();
    this.stopAuto();
    try { document.exitFullscreen(); } catch (e) {}
  };

  AuroraBorealis.prototype._toggleFullscreen = function () {
    if (this._screensaver) this.exitFullscreen(); else this.enterFullscreen();
  };

  AuroraBorealis.prototype.destroy = function () {
    this._destroyed = true;
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this._ro) this._ro.disconnect();
    if (this._io) this._io.disconnect();
    if (this._onResize) window.removeEventListener('resize', this._onResize);
    this.stopAuto();
    this._stopShootingStars();
    this._el.innerHTML = '';
  };

  return AuroraBorealis;
});
