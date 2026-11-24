/* ============================================================
   开工台 · 站点共享脚本
   悬浮页头 / 移动菜单 / 滑动切换器（语言·界面风格） / 滚动渐显
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 页脚年份 ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- 悬浮页头 ---------- */
  var header = document.querySelector('.site-header');

  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', (window.pageYOffset || document.documentElement.scrollTop || 0) > 8);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 移动端菜单 ---------- */
  var toggle = document.querySelector('.nav-toggle');

  function closeMenu() {
    if (!header || !toggle) return;
    header.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && header) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.nav a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('click', function (e) {
      if (header.classList.contains('open') && !header.contains(e.target)) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- 滑动切换器（语言 / 界面风格） ---------- */

  var LANGS = ['zh', 'tw', 'en', 'ja', 'fr', 'de', 'es'];
  var THEMES = ['paper', 'night', 'mist', 'indigo'];

  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  var lang = read('kg-lang') || 'zh';
  var theme = read('kg-theme') || 'paper';

  function syncSlider(attr, list, value) {
    var idx = Math.max(0, list.indexOf(value));
    document.querySelectorAll('.slider').forEach(function (slider) {
      var stops = slider.querySelectorAll('[data-' + attr + ']');
      if (!stops.length) return;
      slider.style.setProperty('--count', stops.length);
      slider.style.setProperty('--idx', idx);
      Array.prototype.forEach.call(stops, function (b, i) {
        b.classList.toggle('on', i === idx);
      });
    });
  }

  function applyTheme(next) {
    theme = THEMES.indexOf(next) > -1 ? next : 'paper';
    if (theme === 'paper') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', theme);
    store('kg-theme', theme === 'paper' ? '' : theme);
    syncSlider('theme-set', THEMES, theme);
  }

  function applyLang(next) {
    if (LANGS.indexOf(next) < 0 || next === lang) return;
    store('kg-lang', next);
    location.reload();
  }

  /* 初始状态 */
  applyTheme(theme);
  syncSlider('lang-set', LANGS, lang);

  /* 点击 / 键盘 */
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-theme-set],[data-lang-set]') : null;
    if (!t) return;
    if (t.hasAttribute('data-theme-set')) applyTheme(t.getAttribute('data-theme-set'));
    else applyLang(t.getAttribute('data-lang-set'));
  });

  /* 拖动滑块 */
  function initSliderDrag(slider) {
    var stops = slider.querySelectorAll('[data-theme-set],[data-lang-set]');
    if (!stops.length) return;
    var isTheme = stops[0].hasAttribute('data-theme-set');
    var list = isTheme ? THEMES : LANGS;

    function idxFromX(clientX) {
      var rect = slider.getBoundingClientRect();
      var inner = rect.width - 6;
      var w = inner / stops.length;
      var i = Math.round((clientX - rect.left - 3 - w / 2) / w);
      return Math.min(stops.length - 1, Math.max(0, i));
    }

    var dragging = false;

    slider.addEventListener('pointerdown', function (e) {
      dragging = true;
      if (slider.setPointerCapture && e.pointerId !== undefined) {
        try { slider.setPointerCapture(e.pointerId); } catch (err) {}
      }
      slider.style.setProperty('--idx', idxFromX(e.clientX));
    });

    slider.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      slider.style.setProperty('--idx', idxFromX(e.clientX));
    });

    slider.addEventListener('pointerup', function (e) {
      if (!dragging) return;
      dragging = false;
      var i = idxFromX(e.clientX);
      if (isTheme) applyTheme(THEMES[i]);
      else applyLang(LANGS[i]);
    });

    slider.addEventListener('pointercancel', function () {
      dragging = false;
      syncSlider(isTheme ? 'theme-set' : 'lang-set', list, isTheme ? theme : lang);
    });

    /* 键盘：左右方向键 */
    slider.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      var current = (isTheme ? theme : lang);
      var i = Math.max(0, list.indexOf(current));
      i = e.key === 'ArrowLeft' ? Math.max(0, i - 1) : Math.min(list.length - 1, i + 1);
      e.preventDefault();
      if (isTheme) applyTheme(THEMES[i]); else applyLang(LANGS[i]);
    });
  }

  document.querySelectorAll('.slider').forEach(initSliderDrag);

  /* ---------- 滚动渐显 ---------- */

  var revealSelector = [
    '.section-head', '.card', '.zone-card', '.mock', '.quote',
    '.table', '.timeline-item', '.doc .callout', '.doc h2',
    '.page-hero', '.footer-grid', '.shot', '.step', '.gh-card',
    '.rating-box', '.message-box', '.stat-row', '.trend-bars', '.faq'
  ].join(',');

  var targets = document.querySelectorAll(revealSelector);

  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }

  var groups = new Map();
  targets.forEach(function (el) {
    if (el.classList.contains('reveal') || el.classList.contains('shot')) return;
    var parent = el.parentNode;
    var idx = groups.get(parent) || 0;
    el.style.transitionDelay = Math.min(idx * 70, 420) + 'ms';
    groups.set(parent, idx + 1);
    el.classList.add('reveal');
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view', 'in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });

  targets.forEach(function (el) { io.observe(el); });
})();