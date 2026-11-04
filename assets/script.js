(function () {
  'use strict';

  var STORAGE_KEY = 'homepage-theme';

  // ---- Theme Switcher ----

  function switchTheme(theme) {
    var html = document.documentElement;
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateActiveOption(theme);
    syncAuroraVideo();
  }

  function initThemeSwitcher() {
    var html = document.documentElement;
    var toggle = document.getElementById('nav-theme-toggle');
    var menu = document.getElementById('nav-theme-menu');
    if (!toggle || !menu) return;
    var options = menu.querySelectorAll('.theme-option');

    // Restore saved theme
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved && document.querySelector('[data-theme="' + saved + '"]')) {
      switchTheme(saved);
    }

    // Toggle menu
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = menu.classList.toggle('nav-theme__menu--open');
      toggle.setAttribute('aria-expanded', open);
    });

    // Select theme from nav dropdown
    options.forEach(function (opt) {
      opt.addEventListener('click', function () {
        switchTheme(opt.getAttribute('data-theme'));
        menu.classList.remove('nav-theme__menu--open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!toggle.parentElement.contains(e.target)) {
        menu.classList.remove('nav-theme__menu--open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function updateActiveOption(theme) {
    document.querySelectorAll('.theme-option').forEach(function (opt) {
      opt.classList.toggle('active', opt.getAttribute('data-theme') === theme);
    });
  }

  // ---- Nav scroll effect ----

  function initNav() {
    var nav = document.getElementById('nav-bar');
    var toggle = document.getElementById('nav-toggle');
    var links = document.getElementById('nav-links');
    if (!nav || !toggle || !links) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 60) {
        nav.classList.add('nav-bar--solid');
      } else {
        nav.classList.remove('nav-bar--solid');
      }
    }, { passive: true });

    toggle.addEventListener('click', function () {
      links.classList.toggle('nav-bar__links--open');
      toggle.setAttribute('aria-expanded', links.classList.contains('nav-bar__links--open'));
    });

    document.querySelectorAll('.nav-bar__links a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('nav-bar__links--open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Scroll reveal ----

  function revealAll() {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('reveal--visible');
    });
  }

  function initScrollReveal() {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced || !('IntersectionObserver' in window)) {
      revealAll();
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px 20% 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  // ---- Aurora video ----

  var auroraVideos = [
    document.getElementById('aurora-video'),
    document.getElementById('aurora-video-b')
  ].filter(Boolean);
  var activeVideo = 0;
  var crossfading = false;
  var crossfadeTimer = null;
  var preference = window.matchMedia('(prefers-reduced-motion: reduce)');

  function isAuroraTheme() {
    return document.documentElement.getAttribute('data-theme') === 'aurora';
  }

  function currentVideo() {
    return auroraVideos[activeVideo];
  }

  function otherVideo() {
    return auroraVideos[1 - activeVideo];
  }

  function playVideo(video) {
    if (!video) return;
    var playing = video.play();
    if (playing && playing.catch) playing.catch(function () {});
  }

  function syncAuroraVideo() {
    if (!auroraVideos.length) return;

    if (isAuroraTheme() && !preference.matches) {
      var current = currentVideo();
      var other = otherVideo();

      auroraVideos.forEach(function (video) {
        video.classList.toggle('is-active', video === current);
      });
      playVideo(current);

      // buffer the second stream for the loop crossfade
      if (other && other.readyState === 0) other.load();
    } else {
      if (crossfadeTimer) clearTimeout(crossfadeTimer);
      crossfading = false;
      auroraVideos.forEach(function (video) { video.pause(); });
    }
  }

  function startCrossfade() {
    if (crossfading) return;

    var outgoing = currentVideo();
    var incoming = otherVideo();
    if (!outgoing || !incoming) return;

    crossfading = true;
    try { incoming.currentTime = 0; } catch (e) {}

    // keep the outgoing frame visible underneath, and fade the incoming one
    // in on top; fading both at once would let the background show through
    outgoing.style.zIndex = '1';
    incoming.style.zIndex = '2';
    incoming.classList.add('is-active');
    playVideo(incoming);

    crossfadeTimer = setTimeout(function () {
      outgoing.pause();
      try { outgoing.currentTime = 0; } catch (e) {}
      outgoing.style.transition = 'none';
      outgoing.classList.remove('is-active');
      outgoing.getBoundingClientRect();
      outgoing.style.transition = '';
      activeVideo = 1 - activeVideo;
      crossfading = false;
    }, 1150);
  }

  auroraVideos.forEach(function (video) {
    video.addEventListener('timeupdate', function () {
      if (video !== currentVideo() || crossfading) return;
      if (video.duration && video.currentTime > video.duration - 1.2) {
        startCrossfade();
      }
    });

    video.addEventListener('ended', function () {
      if (video !== currentVideo() || crossfading) return;
      try { video.currentTime = 0; } catch (e) {}
      playVideo(video);
    });
  });

  document.addEventListener('visibilitychange', function () {
    if (!auroraVideos.length) return;
    if (document.hidden) auroraVideos.forEach(function (video) { video.pause(); });
    else syncAuroraVideo();
  });

  // ---- Init ----

  document.addEventListener('DOMContentLoaded', function () {
    initThemeSwitcher();
    initNav();
    initScrollReveal();
    syncAuroraVideo();
    if (preference.addEventListener) preference.addEventListener('change', syncAuroraVideo);
    else if (preference.addListener) preference.addListener(syncAuroraVideo);
  });
})();
