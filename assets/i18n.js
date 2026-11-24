/* ============================================================
   开工台 · 多语言翻译引擎
   语言顺序：简体中文 / 繁體中文 / English / 日本語 / Français / Deutsch / Español
   词条格式：[zh, zh-Hant, en, ja, fr, de, es]（见 i18n-data.js / i18n-data2.js）
   缺词回退：当前语言 → 英文 → 中文原文
   ============================================================ */
(function () {
  'use strict';

  var LANGS = ['zh', 'tw', 'en', 'ja', 'fr', 'de', 'es'];
  var COL = { zh: 0, tw: 1, en: 2, ja: 3, fr: 4, de: 5, es: 6 };
  var HTML_LANG = { zh: 'zh-CN', tw: 'zh-Hant', en: 'en', ja: 'ja', fr: 'fr', de: 'de', es: 'es' };

  var lang = 'zh';
  try { lang = localStorage.getItem('kg-lang') || 'zh'; } catch (e) {}
  if (COL[lang] === undefined) lang = 'zh';

  /* 归一化：压缩空白 */
  function norm(s) {
    return String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
  }

  /* 索引（延迟构建，等数据文件加载完） */
  var index = null;

  function build() {
    var rows = (window.KG_ROWS || []).concat(window.KG_ROWS2 || []);
    index = {};
    LANGS.forEach(function (code) { index[code] = {}; });
    rows.forEach(function (row) {
      if (!row || !row[0]) return;
      var key = norm(row[0]);
      LANGS.forEach(function (code, i) {
        if (row[i]) index[code][key] = row[i];
      });
    });
    return index;
  }

  function lookupNorm(key) {
    if (!index) build();
    var n = norm(key);
    return index[lang][n] || index.en[n] || null;
  }

  function lookup(key) {
    return lookupNorm(key) || key;
  }

  /* 供 app.js / feedback.js 处理带占位符的复合句 */
  window.KG_t = function (key) { return lookup(key); };
  window.KG_LANG = lang;
  window.KG_LANGS = LANGS;

  /* ---------- DOM 翻译 ---------- */

  var ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];

  function walk(root) {
    if (!root || lang === 'zh') return;
    if (!index) build();

    var nodes = [];
    (function collect(n) {
      for (var c = n.firstChild; c; c = c.nextSibling) {
        if (c.nodeType === 3) nodes.push(c);
        else if (c.nodeType === 1) collect(c);
      }
    })(root);

    nodes.forEach(function (n) {
      if (n.__orig === undefined) n.__orig = n.nodeValue;
      var out = lookupNorm(norm(n.__orig));
      if (out) n.nodeValue = out;
    });

    var els = [];
    (function collectEl(n) {
      for (var c = n.firstChild; c; c = c.nextSibling) {
        if (c.nodeType === 1) { els.push(c); collectEl(c); }
      }
    })(root);

    els.forEach(function (el) {
      ATTRS.forEach(function (a) {
        if (!el.hasAttribute(a)) return;
        var v = el.getAttribute(a);
        if (el['__orig_' + a] === undefined) el['__orig_' + a] = v;
        var out = lookupNorm(norm(el['__orig_' + a]));
        if (out) el.setAttribute(a, out);
      });
    });
  }

  window.KG_localize = function (root) { walk(root || document.body); };

  /* ---------- 启动 ---------- */

  if (lang !== 'zh') {
    document.documentElement.lang = HTML_LANG[lang] || 'en';
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (lang === 'zh') return;

    var titleOut = lookupNorm(norm(document.title));
    if (titleOut) document.title = titleOut;

    walk(document.body);

    /* 法律正文以中文为准：仅在法律页显示提示条 */
    var path = location.pathname || '';
    if (/privacy|terms|disclaimer/.test(path)) {
      var banner = document.createElement('div');
      banner.className = 'notice';
      banner.style.margin = '0';
      banner.style.borderRadius = '0';
      banner.textContent = lookup('本页以下正文目前以中文为准；界面语言切换不影响正文。');
      var doc = document.querySelector('.doc .wrap');
      if (doc) doc.insertBefore(banner, doc.firstChild);
    }
  });
})();