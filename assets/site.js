/* 开工台 · 站点共享脚本：页脚年份 / 移动端菜单 / 界面风格切换 */
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

    function sync() {
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
        sync();
      });
    });

    sync();
  }
})();