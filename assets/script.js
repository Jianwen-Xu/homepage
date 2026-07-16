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
    inners.left.style.borderRadius = inners.left.style.background = inners.left.style.transform = '';
    inners.right.style.borderRadius = inners.right.style.background = inners.right.style.transform = '';

    wraps.center.style.display = '';
    wraps.center.style.left = r(-10, 10) + '%';
    wraps.center.style.top = r(-20, 10) + '%';
    wraps.center.style.width = r(80, 130) + '%';
    wraps.center.style.height = r(70, 100) + '%';
    wraps.center.style.transform = 'rotate(' + r(-12, 12).toFixed(1) + 'deg)';
    wraps.left.style.transform = wraps.right.style.transform = '';

    var c = inners.center;
    var brBase = r(10, 60).toFixed(0);
    c.style.borderRadius = (Math.random() > 0.5 ? '50% 50% ' : '0 0 ') + brBase + '% ' + brBase + '%';
    var gY = Math.random() > 0.5 ? '85%' : '15%';
    c.style.background = 'radial-gradient(ellipse at 50% ' + gY + ', transparent 25%, #bd63c1 38%, #53e5a6 50%, transparent 68%)';
    c.style.transform = 'scaleX(' + r(0.8, 2.0).toFixed(2) + ') scaleY(' + r(0.4, 1.0).toFixed(2) + ')';
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
