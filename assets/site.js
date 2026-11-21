/* 开工台 · 站点共享脚本：页脚年份 + 移动端菜单 */
(function () {
  'use strict';

  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var header = document.querySelector('.site-header');
      var open = header.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* 移动端点击菜单项后收起 */
  document.querySelectorAll('.nav a').forEach(function (a) {
    a.addEventListener('click', function () {
      var header = document.querySelector('.site-header');
      if (header) header.classList.remove('open');
    });
  });
})();