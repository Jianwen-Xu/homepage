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
    var dist = 200 + Math.random() * 300;
    var dur = 0.6 + Math.random() * 0.8;
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

  // ---- Aurora animation (turbulence + screensaver drift + morph) ----

  function initAurora() {
    var turbulence = document.getElementById('turbulence');
    if (!turbulence) return;

    var wraps = document.querySelectorAll('.aurora-wrap');
    var inners = document.querySelectorAll('.aurora');

    var drift = { center: 0, left: 0, right: 0 };
    var phase = 0;
    var wasScreensaver = false;
    var rad = Math.PI / 180;
    var frames = 0;

    var config = [
      { cls: 'aurora-wrap--center', speed: 0.12, limit: 15, idx: 0, opacity: 0.85, freq: 0.015, scaleBaseX: 1.7, scaleBaseY: 0.8 },
      { cls: 'aurora-wrap--left', speed: 0.15, limit: 12, idx: 1, opacity: 0.45, freq: 0.02, scaleBaseX: 1.35, scaleBaseY: 0.7 },
      { cls: 'aurora-wrap--right', speed: -0.1, limit: -10, idx: 2, opacity: 0.5, freq: 0.018, scaleBaseX: 1.3, scaleBaseY: 0.9 }
    ];

    function animate() {
      frames += 0.5;

      turbulence.setAttributeNS(null, 'baseFrequency',
        (0.005 + 0.0025 * Math.cos(frames * rad)) + ' ' +
        (0.005 + 0.0025 * Math.sin(frames * rad))
      );

      var isScreen = document.body.classList.contains('screensaver');

      if (isScreen) {
        phase += 0.02;
        wasScreensaver = true;

        for (var i = 0; i < config.length; i++) {
          var c = config[i];
          var wrap = wraps[c.idx];
          var inner = inners[c.idx];
          if (!wrap || !inner) continue;

          if (c.cls === 'aurora-wrap--center') drift.center += c.speed;
          else if (c.cls === 'aurora-wrap--left') drift.left += c.speed;
          else if (c.cls === 'aurora-wrap--right') drift.right += c.speed;

          var off = 0;
          if (c.cls === 'aurora-wrap--center') {
            if (drift.center > c.limit) drift.center = -c.limit;
            off = drift.center;
          } else if (c.cls === 'aurora-wrap--left') {
            if (drift.left > c.limit) drift.left = -c.limit;
            off = drift.left;
          } else if (c.cls === 'aurora-wrap--right') {
            if (drift.right < c.limit) drift.right = -c.limit;
            off = drift.right;
          }

          wrap.style.transform = 'translate3d(' + off + 'px, 0, 0)';

          var p = phase + i * 2.1;
          var breathe = 1 + 0.04 * Math.sin(p * c.freq * 60);
          inner.style.transform = 'scaleX(' + (c.scaleBaseX * breathe) + ') scaleY(' + (c.scaleBaseY * breathe) + ')';
          inner.style.opacity = c.opacity + 0.12 * Math.sin(p * c.freq * 40);
        }
      } else if (wasScreensaver) {
        for (var j = 0; j < wraps.length; j++) {
          if (wraps[j]) wraps[j].style.transform = '';
          if (inners[j]) {
            inners[j].style.transform = '';
            inners[j].style.opacity = '';
          }
        }
        drift.center = 0;
        drift.left = 0;
        drift.right = 0;
        wasScreensaver = false;
      }

      requestAnimationFrame(animate);
    }

    animate();
  }

  // ---- Screensaver toggle ----

  function initScreensaver() {
    var btn = document.getElementById('screen-btn');
    if (!btn) return;

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

    function enter() {
      document.body.classList.add('screensaver');
      btn.querySelector('i').className = 'fas fa-compress';
      startShootingStars();
      try { document.documentElement.requestFullscreen(); } catch (e) {}
    }

    function exit() {
      document.body.classList.remove('screensaver');
      btn.querySelector('i').className = 'fas fa-expand';
      stopShootingStars();
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
