/* 开工台 · 站点共享脚本：页脚年份 / 移动端菜单 / 界面风格 / 滚动动画 */
(function () {
  'use strict';

  /* 页脚年份 */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* 移动端菜单 */
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var header = document.querySelector('.site-header');
      var open = header.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        var header = document.querySelector('.site-header');
        if (header) header.classList.remove('open');
      });
    });
  }

  /* 界面风格切换 */
  var themeGroup = document.getElementById('theme-switch');
  if (themeGroup) {
    var current = document.documentElement.getAttribute('data-theme') || 'paper';

    function syncTheme() {
      themeGroup.querySelectorAll('[data-theme-set]').forEach(function (btn) {
        btn.classList.toggle('on', btn.getAttribute('data-theme-set') === current);
      });
    }

    themeGroup.querySelectorAll('[data-theme-set]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        current = btn.getAttribute('data-theme-set');
        if (current === 'paper') document.documentElement.removeAttribute('data-theme');
        else document.documentElement.setAttribute('data-theme', current);
        try { localStorage.setItem('kg-theme', current === 'paper' ? '' : current); } catch (e) {}
        syncTheme();
      });
    });

    syncTheme();
  }

  /* 滚动渐显：自动给主要块级元素打标并观察 */
  var revealSelector = [
    '.section-head', '.card', '.zone-card', '.mock', '.quote',
    '.table', '.timeline-item', '.doc .callout', '.doc h2',
    '.page-hero', '.footer-grid'
  ].join(',');

  var targets = document.querySelectorAll(revealSelector);

  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }

  /* 同一容器内的元素依次渐显 */
  var groups = new Map();
  targets.forEach(function (el) {
    var parent = el.parentNode;
    var idx = groups.get(parent) || 0;
    el.style.transitionDelay = Math.min(idx * 80, 400) + 'ms';
    groups.set(parent, idx + 1);
    el.classList.add('reveal');
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  targets.forEach(function (el) { io.observe(el); });
})();