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

    var bands = [
      { wrap: document.querySelector('.aurora-wrap--center'), inner: document.querySelector('.aurora--center'), idx: 0 },
      { wrap: document.querySelector('.aurora-wrap--left'), inner: document.querySelector('.aurora--left'), idx: 1 },
      { wrap: document.querySelector('.aurora-wrap--right'), inner: document.querySelector('.aurora--right'), idx: 2 }
    ];

    // Level 3: randomly hide 0-1 bands
    var hideCount = Math.random() > 0.6 ? 1 : 0;
    var hiddenIdx = -1;
    if (hideCount) hiddenIdx = Math.floor(Math.random() * 3);

    for (var i = 0; i < bands.length; i++) {
      var wrap = bands[i].wrap;
      var inner = bands[i].inner;
      if (!wrap || !inner) continue;

      var isHidden = (hideCount && bands[i].idx === hiddenIdx);
      wrap.style.display = isHidden ? 'none' : '';
      if (isHidden) continue;

      // Level 1: wide position ranges
      if (bands[i].idx === 0) {
        wrap.style.left = r(-5, 15) + '%';
        wrap.style.top = r(-25, 5) + '%';
        wrap.style.width = r(50, 110) + '%';
        wrap.style.height = r(50, 100) + '%';
      } else if (bands[i].idx === 1) {
        wrap.style.left = r(-18, 8) + '%';
        wrap.style.top = r(-10, 30) + '%';
        wrap.style.width = r(12, 45) + '%';
        wrap.style.height = r(40, 100) + '%';
      } else {
        wrap.style.right = r(-10, 15) + '%';
        wrap.style.top = r(-5, 35) + '%';
        wrap.style.width = r(10, 40) + '%';
        wrap.style.height = r(40, 95) + '%';
      }

      wrap.style.transform = 'rotate(' + r(-15, 15).toFixed(1) + 'deg)';
      wrap.style.mixBlendMode = pick(['color-dodge', 'screen', 'overlay']);

      // Level 2: random morphology
      var brBase = r(8, 65).toFixed(0);
      inner.style.borderRadius = (Math.random() > 0.4 ? '50% 50% ' : '0 0 ') + brBase + '% ' + brBase + '%';

      var gY = Math.random() > 0.4 ? '85%' : '15%';
      inner.style.background = 'radial-gradient(ellipse at 50% ' + gY + ', transparent 25%, #bd63c1 38%, #53e5a6 50%, transparent 68%)';

      var sX = r(0.6, 2.4).toFixed(2);
      var sY = r(0.35, 1.15).toFixed(2);
      inner.style.transform = 'scaleX(' + sX + ') scaleY(' + sY + ')';

      inner.style.opacity = r(0.2, 0.95).toFixed(2);
    }
  }

  // ---- Screensaver toggle ----

  function initScreensaver() {
    var btn = document.getElementById('screen-btn');
    if (!btn) return;

    var shuffleBtn = document.getElementById('shuffle-btn');
    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', randomizeAurora);
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
      for (var i = 0; i < wraps.length; i++) {
        wraps[i].style.left = '';
        wraps[i].style.right = '';
        wraps[i].style.top = '';
        wraps[i].style.width = '';
        wraps[i].style.height = '';
        wraps[i].style.transform = '';
        wraps[i].style.display = '';
        wraps[i].style.mixBlendMode = '';
      }
      for (var j = 0; j < inners.length; j++) {
        inners[j].style.borderRadius = '';
        inners[j].style.background = '';
        inners[j].style.transform = '';
        inners[j].style.opacity = '';
      }
    }

    function enter() {
      clearAuroraStyles();
      document.body.classList.add('screensaver');
      btn.querySelector('i').className = 'fas fa-compress';
      startShootingStars();
      try { document.documentElement.requestFullscreen(); } catch (e) {}
    }

    function exit() {
      document.body.classList.remove('screensaver');
      btn.querySelector('i').className = 'fas fa-expand';
      stopShootingStars();
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
