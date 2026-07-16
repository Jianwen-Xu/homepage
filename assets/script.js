(function () {
  // ---- Nav scroll effect ----

  function initNav() {
    var nav = document.getElementById('nav-bar');
    var toggle = document.getElementById('nav-toggle');
    var links = document.getElementById('nav-links');

    window.addEventListener('scroll', function () {
      if (window.scrollY > 80) {
        nav.classList.add('nav-bar--solid');
      } else {
        nav.classList.remove('nav-bar--solid');
      }
    });

    toggle.addEventListener('click', function () {
      links.classList.toggle('nav-bar__links--open');
      var isOpen = links.classList.contains('nav-bar__links--open');
      toggle.setAttribute('aria-expanded', isOpen);
    });

    document.querySelectorAll('.nav-bar__links a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('nav-bar__links--open');
      });
    });
  }

  // ---- Smooth scroll for anchor links ----

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ---- Generate stars with random twinkling ----

  function initStars() {
    var container = document.getElementById('hero-stars');
    if (!container) return;

    var count = 80;
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < count; i++) {
      var star = document.createElement('div');
      star.className = 'star' + (Math.random() > 0.85 ? ' star--large' : '');
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.setProperty('--dur', (2 + Math.random() * 4) + 's');
      star.style.setProperty('--delay', (Math.random() * 5) + 's');
      fragment.appendChild(star);
    }

    container.appendChild(fragment);
  }

  // ---- Shooting star ----

  function spawnShootingStar() {
    var star = document.createElement('div');
    star.className = 'shooting-star';

    var head = document.createElement('div');
    head.className = 'shooting-star__head';
    star.appendChild(head);

    var tail = document.createElement('div');
    tail.className = 'shooting-star__tail';
    star.appendChild(tail);

    var angle = -20 + Math.random() * 40;
    var dist = 150 + Math.random() * 200;
    var dur = 0.25 + Math.random() * 0.3;
    var x = Math.random() * 80 + 5;
    var y = Math.random() * 40 + 2;

    star.style.left = x + '%';
    star.style.top = y + '%';
    star.style.width = dist + 'px';
    star.style.animationDuration = dur + 's';
    star.style.transform = 'rotate(' + angle + 'deg)';
    star.style.transformOrigin = 'left center';

    document.body.appendChild(star);

    setTimeout(function () {
      if (star.parentNode) star.parentNode.removeChild(star);
    }, dur * 1000);
  }

  // ---- Aurora turbulence ----

  function initAurora() {
    var turbulence = document.getElementById('turbulence');
    if (!turbulence) return;

    var rad = Math.PI / 180;
    var frames = 0;

    function animate() {
      frames += 0.5;

      turbulence.setAttributeNS(null, 'baseFrequency',
        (0.005 + 0.0025 * Math.cos(frames * rad)) + ' ' +
        (0.005 + 0.0025 * Math.sin(frames * rad))
      );

      requestAnimationFrame(animate);
    }

    animate();
  }

  // ---- Randomize aurora layout ----

  function randomizeAurora() {
    var r = function(min, max) { return min + Math.random() * (max - min); };
    var pick = function(arr) { return arr[Math.floor(Math.random() * arr.length)]; };

    var wraps = {
      center: document.querySelector('.aurora-wrap--center'),
      left: document.querySelector('.aurora-wrap--left'),
      right: document.querySelector('.aurora-wrap--right')
    };
    var inners = {
      center: document.querySelector('.aurora--center'),
      left: document.querySelector('.aurora--left'),
      right: document.querySelector('.aurora--right')
    };

    // Hide left and right, show center with giant size
    wraps.left.style.display = 'none';
    wraps.right.style.display = 'none';
    inners.left.style.borderRadius = inners.left.style.background = inners.left.style.transform = inners.left.style.clipPath = '';
    inners.right.style.borderRadius = inners.right.style.background = inners.right.style.transform = inners.right.style.clipPath = '';

    wraps.center.style.display = '';
    wraps.center.style.left = r(-15, 5) + '%';
    wraps.center.style.top = r(-25, 5) + '%';
    wraps.center.style.width = r(100, 150) + '%';
    wraps.center.style.height = r(85, 110) + '%';
    wraps.center.style.transform = 'rotate(' + r(-12, 12).toFixed(1) + 'deg)';
    wraps.left.style.transform = wraps.right.style.transform = '';

    var c = inners.center;

    // Smooth outer shape
    c.style.clipPath = '';
    c.style.borderRadius = Math.random() > 0.4 ? '0 0 ' + r(15, 50).toFixed(0) + '% ' + r(15, 50).toFixed(0) + '%' : '50% 50% ' + r(10, 40).toFixed(0) + '% ' + r(10, 40).toFixed(0) + '%';

    // Inner scale
    c.style.transform = 'scaleX(' + r(1.0, 2.5).toFixed(2) + ') scaleY(' + r(0.5, 1.1).toFixed(2) + ')';

    // Build background: purple base + green shapes on top
    function greenGrad(x, y, sx, sy) {
      return 'radial-gradient(ellipse ' + (sx || '80%') + ' ' + (sy || '50%') + ' at ' + x + '% ' + y + '%, transparent 20%, #53e5a6 35%, transparent 60%)';
    }

    var greens = [];
    var shape = pick(['arc', 'curtain', 'rays', 'twisted', 'patches']);

    switch (shape) {
      case 'arc':
        greens.push(greenGrad(50, r(80, 95), r(85, 100) + '%', r(30, 45) + '%'));
        break;

      case 'curtain':
        greens.push(greenGrad(r(25, 40), r(70, 85), r(30, 45) + '%', r(45, 60) + '%'));
        greens.push(greenGrad(r(60, 75), r(65, 80), r(25, 40) + '%', r(40, 55) + '%'));
        break;

      case 'rays':
        var nRays = 3 + Math.floor(Math.random() * 2);
        for (var i = 0; i < nRays; i++) {
          var rx = 15 + (70 / (nRays - 1)) * i + r(-5, 5);
          var ry = r(55, 70);
          var ys = r(45, 65) + '%';
          greens.push(greenGrad(rx, ry, r(12, 20) + '%', ys));
        }
        break;

      case 'twisted':
        greens.push(greenGrad(r(15, 25), r(75, 85), r(40, 55) + '%', r(35, 50) + '%'));
        greens.push(greenGrad(r(45, 55), r(55, 70), r(50, 65) + '%', r(40, 55) + '%'));
        greens.push(greenGrad(r(75, 85), r(35, 50), r(35, 50) + '%', r(45, 60) + '%'));
        break;

      case 'patches':
        var nP = 3 + Math.floor(Math.random() * 3);
        for (var i = 0; i < nP; i++) {
          greens.push(greenGrad(r(15, 85), r(30, 85), r(20, 45) + '%', r(20, 45) + '%'));
        }
        break;
    }

    // Purple base (always below green)
    var purpleBase = 'radial-gradient(ellipse 100% 80% at 50% 85%, #bd63c1 0%, transparent 50%)';
    greens.unshift(purpleBase);
    c.style.background = greens.join(', ');
  }

  // ---- Smooth randomize (temp overlay + fade) ----

  var randomizeLock = false;

  function smoothRandomize() {
    if (randomizeLock) return;
    randomizeLock = true;

    var wrap = document.querySelector('.aurora-wrap--center');
    var inner = document.querySelector('.aurora--center');
    var parent = wrap && wrap.parentNode;
    if (!wrap || !inner || !parent) { randomizeLock = false; return; }

    // Create temp overlay showing current appearance
    var temp = document.createElement('div');
    temp.className = 'aurora-temp';
    temp.style.cssText = wrap.style.cssText;
    var cssProps = ['left', 'right', 'top', 'width', 'height', 'transform', 'display', 'opacity'];
    for (var i = 0; i < cssProps.length; i++) {
      temp.style[cssProps[i]] = window.getComputedStyle(wrap)[cssProps[i]];
    }
    // Inner appearance
    var innerCss = ['background', 'borderRadius', 'transform', 'opacity'];
    for (var j = 0; j < innerCss.length; j++) {
      temp.style[innerCss[j]] = window.getComputedStyle(inner)[innerCss[j]];
    }
    temp.style.opacity = '1';

    parent.insertBefore(temp, wrap);

    // Apply new random styles to center
    randomizeAurora();

    // Fade out temp to reveal new
    requestAnimationFrame(function () {
      temp.style.transition = 'opacity 0.8s ease';
      temp.style.opacity = '0';

      setTimeout(function () {
        if (temp.parentNode) temp.parentNode.removeChild(temp);
        randomizeLock = false;
      }, 850);
    });
  }

  // ---- Screensaver toggle ----

  function initScreensaver() {
    var btn = document.getElementById('screen-btn');
    if (!btn) return;

    var shuffleBtn = document.getElementById('shuffle-btn');
    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', smoothRandomize);
    }

    var autoBtn = document.getElementById('auto-btn');
    var autoTimer = null;

    function startAutoShuffle() {
      if (autoTimer) return;
      autoBtn.classList.add('active');
      function tick() {
        smoothRandomize();
        autoTimer = setTimeout(tick, 4000 + Math.random() * 4000);
      }
      tick();
    }

    function stopAutoShuffle() {
      if (autoTimer) {
        clearTimeout(autoTimer);
        autoTimer = null;
      }
      autoBtn.classList.remove('active');
    }

    if (autoBtn) {
      autoBtn.addEventListener('click', function () {
        if (autoBtn.classList.contains('active')) {
          stopAutoShuffle();
        } else {
          startAutoShuffle();
        }
      });
    }

    var starTimer = null;

    function startShootingStars() {
      if (starTimer) return;
      function schedule() {
        starTimer = setTimeout(function () {
          spawnShootingStar();
          schedule();
        }, 6000 + Math.random() * 9000);
      }
      schedule();
    }

    function stopShootingStars() {
      if (starTimer) {
        clearTimeout(starTimer);
        starTimer = null;
      }
    }

    function clearAuroraStyles() {
      var wraps = document.querySelectorAll('.aurora-wrap');
      var inners = document.querySelectorAll('.aurora');
      var temps = document.querySelectorAll('.aurora-temp');
      for (var k = 0; k < temps.length; k++) {
        if (temps[k].parentNode) temps[k].parentNode.removeChild(temps[k]);
      }
      for (var i = 0; i < wraps.length; i++) {
        wraps[i].style.left = '';
        wraps[i].style.right = '';
        wraps[i].style.top = '';
        wraps[i].style.width = '';
        wraps[i].style.height = '';
        wraps[i].style.transform = '';
        wraps[i].style.display = '';
        wraps[i].style.mixBlendMode = '';
        wraps[i].style.opacity = '';
        wraps[i].style.transition = '';
      }
      for (var j = 0; j < inners.length; j++) {
        inners[j].style.borderRadius = '';
        inners[j].style.background = '';
        inners[j].style.transform = '';
        inners[j].style.opacity = '';
        inners[j].style.clipPath = '';
      }
    }

    function enter() {
      randomizeLock = false;
      clearAuroraStyles();
      stopAutoShuffle();
      document.body.classList.add('screensaver');
      btn.querySelector('i').className = 'fas fa-compress';
      startShootingStars();
      try { document.documentElement.requestFullscreen(); } catch (e) {}
    }

    function exit() {
      randomizeLock = false;
      document.body.classList.remove('screensaver');
      btn.querySelector('i').className = 'fas fa-expand';
      stopShootingStars();
      stopAutoShuffle();
      clearAuroraStyles();
      try { document.exitFullscreen(); } catch (e) {}
    }

    function toggle() {
      if (document.body.classList.contains('screensaver')) {
        exit();
      } else {
        enter();
      }
    }

    btn.addEventListener('click', toggle);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('screensaver')) {
        exit();
      }
    });
  }

  // ---- Init ----

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initSmoothScroll();
    initStars();
    initAurora();
    initScreensaver();
  });
})();
