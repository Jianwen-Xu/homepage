(function () {
  'use strict';

  var STORAGE_KEY = 'homepage-theme';

  // ---- Theme Switcher ----

  function initThemeSwitcher() {
    var html = document.documentElement;
    var toggle = document.getElementById('nav-theme-toggle');
    var menu = document.getElementById('nav-theme-menu');
    var options = menu.querySelectorAll('.theme-option');

    // Restore saved theme
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved && document.querySelector('[data-theme="' + saved + '"]')) {
      html.setAttribute('data-theme', saved);
      updateActiveOption(saved);
    }

    // Toggle menu
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = menu.classList.toggle('nav-theme__menu--open');
      toggle.setAttribute('aria-expanded', open);
    });

    // Select theme
    options.forEach(function (opt) {
      opt.addEventListener('click', function () {
        var theme = opt.getAttribute('data-theme');
        html.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
        updateActiveOption(theme);
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
    var options = document.querySelectorAll('.theme-option');
    options.forEach(function (opt) {
      opt.classList.toggle('active', opt.getAttribute('data-theme') === theme);
    });
  }

  // ---- Nav scroll effect ----

  function initNav() {
    var nav = document.getElementById('nav-bar');
    var toggle = document.getElementById('nav-toggle');
    var links = document.getElementById('nav-links');

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

  function initScrollReveal() {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  // ---- Init ----

  document.addEventListener('DOMContentLoaded', function () {
    initThemeSwitcher();
    initNav();
    initScrollReveal();
    new AuroraBorealis('#ab-container', {
      bands: 1,
      stars: 80,
      autoShuffle: true,
      shootingStars: false,
      controls: ['fullscreen', 'shuffle', 'auto']
    });
  });
})();
