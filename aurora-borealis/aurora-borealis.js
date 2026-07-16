(function (root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AuroraBorealis = factory();
})(this, function () {

  var hasOwn = {}.hasOwnProperty;
  var STYLE_ID = 'ab-styles';

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var css = document.createElement('style');
    css.id = STYLE_ID;
    css.textContent =
      '.ab-stars{position:absolute;top:0;left:0;width:100%;height:75%;pointer-events:none;overflow:hidden}' +
      '.ab-star{position:absolute;width:2px;height:2px;background:#fff;border-radius:50%;animation:abTwinkle var(--dur,3s) ease-in-out infinite;animation-delay:var(--delay,0s)}' +
      '.ab-star.lg{width:3px;height:3px}' +
      '@keyframes abTwinkle{0%,100%{opacity:0.1;transform:scale(0.8)}50%{opacity:1;transform:scale(1.2)}}' +
      '.ab-g-aurora{position:absolute;top:0;left:0;right:0;height:100%;pointer-events:none}' +
      '.ab-wrap{position:absolute;mix-blend-mode:color-dodge}' +
      '.ab-band{width:100%;height:100%;filter:url(#ab-wave)}' +
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
      '.ab-shooting-star{position:fixed;pointer-events:none;z-index:1000;animation:abShoot linear forwards}' +
      '.ab-shooting-star .head{position:absolute;top:-1px;left:0;width:3px;height:3px;background:#fff;border-radius:50%;box-shadow:0 0 4px 2px rgba(255,255,255,0.6)}' +
      '.ab-shooting-star .tail{width:100%;height:2px;background:linear-gradient(90deg,#fff 0%,rgba(255,255,255,0.6) 20%,transparent 100%);border-radius:1px}' +
      '@keyframes abShoot{0%{opacity:1}80%{opacity:1}100%{opacity:0}}';
    document.head.appendChild(css);
  }

  var DEFAULTS = {
    bands: 3,
    colors: { purple: '#bd63c1', green: '#53e5a6' },
    shapes: ['arc', 'curtain', 'rays', 'twisted', 'patches'],
    autoShuffle: false,
    autoInterval: [8000, 14000],
    transitionMode: ['fade-in-out', 'delayed-reveal', 'slow-fade'],
    stars: 80,
    shootingStars: true,
    controls: ['fullscreen', 'shuffle', 'auto']
  };

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
    this._turbulenceFrames = 0;

    this._build();
    this._startTurbulence();
    if (this.opts.stars > 0) this._spawnStars();
    if (this.opts.autoShuffle) this.startAuto();
  };

  /* ------------------------------------------------------------------ */
  /*  BUILD DOM                                                         */
  /* ------------------------------------------------------------------ */

  AuroraBorealis.prototype._build = function () {
    var el = this._el;
    var opts = this.opts;
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.style.background = '#0b1a3a';

    // SVG filter
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:absolute;width:0;height:0';
    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    var filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'ab-wave');
    var turb = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
    turb.setAttribute('id', 'ab-turbulence');
    turb.setAttribute('baseFrequency', '0.005 0.005');
    turb.setAttribute('numOctaves', '2');
    turb.setAttribute('result', 'noise');
    turb.setAttribute('seed', '10');
    var disp = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
    disp.setAttribute('in2', 'noise');
    disp.setAttribute('in', 'SourceGraphic');
    disp.setAttribute('scale', '30');
    filter.appendChild(turb);
    filter.appendChild(disp);
    defs.appendChild(filter);
    svg.appendChild(defs);
    el.appendChild(svg);
    this._turbEl = turb;

    // Aurora container
    var g = document.createElement('div');
    g.className = 'ab-g-aurora';
    this._gAurora = g;

    var bands = [];
    var positions = [
      { cls: 'center', left: 0, top: -10, width: 90, height: 95 },
      { cls: 'left', left: -10, top: 0, width: 28, height: 100 },
      { cls: 'right', right: -3, top: 18, width: 25, height: 80 }
    ];

    if (opts.bands < 3) positions = positions.slice(0, opts.bands);

    for (var i = 0; i < positions.length; i++) {
      var p = positions[i];
      var wrap = document.createElement('div');
      wrap.className = 'ab-wrap ab-wrap-' + p.cls;
      wrap.style.cssText = (p.left !== undefined ? 'left:' + p.left + '%;' : '') +
        (p.right !== undefined ? 'right:' + p.right + '%;' : '') +
        'top:' + p.top + '%;width:' + p.width + '%;height:' + p.height + '%;';

      var band = document.createElement('div');
      band.className = 'ab-band ab-band-' + p.cls;
      wrap.appendChild(band);
      g.appendChild(wrap);
      bands.push({ wrap: wrap, band: band, cls: p.cls });
    }

    el.appendChild(g);
    this._bands = bands;

    // Stars
    var stars = document.createElement('div');
    stars.className = 'ab-stars';
    stars.id = 'ab-stars';
    el.appendChild(stars);
    this._starsEl = stars;

    // Mountains
    this._buildMountains(el);

    // Reflection
    var ref = document.createElement('div');
    ref.className = 'ab-reflection';
    el.appendChild(ref);

    // Controls
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
      auBtn.title = 'Auto';
      auBtn.innerHTML = '&#x21BB;';
      auBtn.addEventListener('click', this._toggleAuto.bind(this));
      ctrls.appendChild(auBtn);
      this._autoBtn = auBtn;
    }

    el.appendChild(ctrls);
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
  /*  SHOOTING STARS                                                     */
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
    var self = this;
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
  /*  TURBULENCE ANIMATION                                               */
  /* ------------------------------------------------------------------ */

  AuroraBorealis.prototype._startTurbulence = function () {
    if (!this._turbEl) return;
    var self = this;
    var rad = Math.PI / 180;
    function anim() {
      if (self._destroyed) return;
      self._turbulenceFrames += 0.5;
      self._turbEl.setAttributeNS(null, 'baseFrequency',
        (0.005 + 0.0025 * Math.cos(self._turbulenceFrames * rad)) + ' ' +
        (0.005 + 0.0025 * Math.sin(self._turbulenceFrames * rad)));
      requestAnimationFrame(anim);
    }
    anim();
  };

  /* ------------------------------------------------------------------ */
  /*  RANDOMIZE                                                         */
  /* ------------------------------------------------------------------ */

  AuroraBorealis.prototype.randomize = function () {
    var bands = this._bands;
    if (!bands || bands.length === 0) return;
    var r = function (mn, mx) { return mn + Math.random() * (mx - mn); };
    var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
    var c = this.opts.colors;

    // Hide all bands first, then show center
    for (var i = 0; i < bands.length; i++) {
      bands[i].wrap.style.display = 'none';
    }

    // Find center band
    var center = null;
    for (var i = 0; i < bands.length; i++) {
      if (bands[i].cls === 'center') { center = bands[i]; break; }
    }
    // If no center, use last band as center
    if (!center) center = bands[bands.length - 1];

    center.wrap.style.display = '';
    center.band.style.display = '';
    center.wrap.style.cssText = 'left:' + r(-15, 5) + '%;top:' + r(-25, 5) + '%;width:' + r(100, 150) + '%;height:' + r(85, 110) + '%;';
    center.wrap.style.transform = 'rotate(' + r(-12, 12).toFixed(1) + 'deg)';

    var gY = Math.random() > 0.5 ? '85%' : '15%';
    center.band.style.background = 'radial-gradient(ellipse at 50% ' + gY + ', transparent 25%, ' + c.green + ' 38%, ' + c.purple + ' 50%, transparent 68%)';
    center.band.style.transform = 'scaleX(' + r(1.0, 2.5).toFixed(2) + ') scaleY(' + r(0.5, 1.1).toFixed(2) + ')';
    center.band.style.clipPath = '';

    var shape = pick(this.opts.shapes);
    center.band.style.borderRadius = '';

    switch (shape) {
      case 'arc':
        center.band.style.borderRadius = '50% 50% ' + r(15, 50).toFixed(0) + '% ' + r(15, 50).toFixed(0) + '%';
        break;
      case 'curtain':
        var br = r(20, 60).toFixed(0);
        center.band.style.borderRadius = '0 0 ' + br + '% ' + br + '%';
        break;
      case 'rays':
        center.band.style.borderRadius = '50% 50% ' + r(5, 15).toFixed(0) + '% ' + r(5, 15).toFixed(0) + '%';
        break;
      case 'twisted':
        center.band.style.borderRadius = '0 ' + r(30, 70).toFixed(0) + '% ' + r(30, 70).toFixed(0) + '% 0';
        break;
      case 'patches':
        center.band.style.borderRadius = '50%';
        break;
    }
  };

  /* ------------------------------------------------------------------ */
  /*  SMOOTH FADE TRANSITION                                             */
  /* ------------------------------------------------------------------ */

  AuroraBorealis.prototype._smoothRandomize = function () {
    if (this._randomizeLock || this._destroyed) return;
    this._randomizeLock = true;

    var wrap = this._getCenterWrap();
    if (!wrap) { this._randomizeLock = false; return; }

    var r = function (mn, mx) { return mn + Math.random() * (mx - mn); };
    var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
    var self = this;

    function release() { self._randomizeLock = false; }

    var mode = pick(this.opts.transitionMode);
    var fadeOut, gap, fadeIn;

    switch (mode) {
      case 'fade-in-out':
        fadeOut = 1.0; gap = 0; fadeIn = 1.2; break;
      case 'delayed-reveal':
        fadeOut = 0.8; gap = r(1, 3); fadeIn = 1.2; break;
      case 'slow-fade':
        fadeOut = 2.0; gap = 0; fadeIn = 2.0; break;
    }

    wrap.style.transition = 'opacity ' + fadeOut + 's ease';
    wrap.style.opacity = '0';

    setTimeout(function () {
      self.randomize();

      function show() {
        wrap.style.transition = 'opacity ' + fadeIn + 's ease';
        wrap.style.opacity = '';
        setTimeout(function () { wrap.style.transition = ''; release(); }, fadeIn * 1000 + 50);
      }

      if (gap > 0) setTimeout(show, gap * 1000); else show();
    }, fadeOut * 1000 + 50);
  };

  AuroraBorealis.prototype._getCenterWrap = function () {
    for (var i = 0; i < this._bands.length; i++) {
      if (this._bands[i].cls === 'center') return this._bands[i].wrap;
    }
    return null;
  };

  AuroraBorealis.prototype._getCenterBand = function () {
    for (var i = 0; i < this._bands.length; i++) {
      if (this._bands[i].cls === 'center') return this._bands[i].band;
    }
    return null;
  };

  /* ------------------------------------------------------------------ */
  /*  PUBLIC METHODS                                                     */
  /* ------------------------------------------------------------------ */

  AuroraBorealis.prototype.shuffle = function () {
    this.randomize();
  };

  AuroraBorealis.prototype.startAuto = function () {
    if (this._autoTimer) return;
    if (this._autoBtn) this._autoBtn.classList.add('active');
    var self = this;
    function tick() {
      self._smoothRandomize();
      self._autoTimer = setTimeout(tick, self.opts.autoInterval[0] + Math.random() * (self.opts.autoInterval[1] - self.opts.autoInterval[0]));
    }
    tick();
  };

  AuroraBorealis.prototype.stopAuto = function () {
    if (this._autoTimer) { clearTimeout(this._autoTimer); this._autoTimer = null; }
    if (this._autoBtn) this._autoBtn.classList.remove('active');
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
    this.stopAuto();
    this._stopShootingStars();
    this._el.innerHTML = '';
  };

  return AuroraBorealis;
});
