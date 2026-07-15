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

  // ---- Screensaver toggle ----

  function initScreensaver() {
    var btn = document.getElementById('screen-btn');
    if (!btn) return;

    function enter() {
      document.body.classList.add('screensaver');
      btn.querySelector('i').className = 'fas fa-compress';
      try { document.documentElement.requestFullscreen(); } catch (e) {}
    }

    function exit() {
      document.body.classList.remove('screensaver');
      btn.querySelector('i').className = 'fas fa-expand';
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

  // ---- Aurora animation (turbulence + drift) ----

  function initAurora() {
    var turbulence = document.getElementById('turbulence');
    var bands = [
      { el: document.querySelector('.aurora--center'), x: 0, speed: 0.08, limit: 12, base: 'scaleX(1.7) scaleY(0.65)' },
      { el: document.querySelector('.aurora--left'), x: 0, speed: 0.06, limit: 10, base: 'scaleX(1.4) scaleY(0.65)' },
      { el: document.querySelector('.aurora--right'), x: 0, speed: -0.07, limit: -8, base: 'scaleX(1.3) scaleY(0.7)' }
    ];
    if (!turbulence) return;

    var frames = 0;
    var rad = Math.PI / 180;

    function animate() {
      frames += 0.5;
      turbulence.setAttributeNS(null, 'baseFrequency',
        (0.005 + 0.0025 * Math.cos(frames * rad)) + ' ' +
        (0.005 + 0.0025 * Math.sin(frames * rad))
      );

      for (var i = 0; i < bands.length; i++) {
        var b = bands[i];
        if (!b.el) continue;
        b.x += b.speed;
        if (b.speed > 0 && b.x > b.limit) b.x = -b.limit;
        if (b.speed < 0 && b.x < b.limit) b.x = -b.limit;
        b.el.style.transform = b.base + ' translate3d(' + b.x + 'px, 0, 0)';
      }

      requestAnimationFrame(animate);
    }

    animate();
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
