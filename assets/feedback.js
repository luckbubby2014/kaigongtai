/* ============================================================
   开工台 · 留言与评价
   站内评分/留言保存在浏览器本地；可一键跳转 GitHub 公开发表。
   ============================================================ */
(function () {
  'use strict';

  var KEY = 'kg-feedback.v1';
  var REPO_NEW = 'https://github.com/luckbubby2014/kaigongtai/issues/new';

  function t(key) { return window.KG_t ? window.KG_t(key) : key; }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/&#39;/g, "'");
  }

  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY) || '{}');
      return {
        reviews: Array.isArray(d.reviews) ? d.reviews : [],
        messages: Array.isArray(d.messages) ? d.messages : []
      };
    } catch (e) { return { reviews: [], messages: [] }; }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); }
    catch (e) { alert(t('保存失败：浏览器存储不可用。')); }
  }

  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  function todayText() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  var data = load();

  /* ---------- 评分与标签交互 ---------- */

  var stars = document.querySelectorAll('#star-rating [data-star]');
  var currentStars = 0;
  var currentTags = [];

  function paintStars(n) {
    stars.forEach(function (b) {
      b.classList.toggle('lit', Number(b.getAttribute('data-star')) <= n);
    });
  }

  stars.forEach(function (b) {
    b.addEventListener('mouseenter', function () { paintStars(Number(b.getAttribute('data-star'))); });
    b.addEventListener('mouseleave', function () { paintStars(currentStars); });
    b.addEventListener('click', function () {
      currentStars = Number(b.getAttribute('data-star'));
      paintStars(currentStars);
    });
  });

  document.querySelectorAll('#tag-picks [data-tag]').forEach(function (b) {
    b.addEventListener('click', function () {
      var tag = b.getAttribute('data-tag');
      var i = currentTags.indexOf(tag);
      if (i > -1) { currentTags.splice(i, 1); b.classList.remove('on'); }
      else { currentTags.push(tag); b.classList.add('on'); }
    });
  });

  /* ---------- 渲染 ---------- */

  function renderReviews() {
    var box = document.getElementById('review-list');
    if (!data.reviews.length) { box.innerHTML = ''; return; }
    box.innerHTML = data.reviews.slice().reverse().map(function (r) {
      return '<div class="msg-item">' +
        '<div>' + '★'.repeat(r.stars) + '<span style="color:var(--border-strong)">' + '★'.repeat(5 - r.stars) + '</span>' +
        (r.tags.length ? ' <span class="pill" style="margin-left:8px">' + esc(r.tags.join(' · ')) + '</span>' : '') + '</div>' +
        (r.text ? '<div style="margin-top:8px">' + esc(r.text) + '</div>' : '') +
        '<div class="msg-meta">' + esc(r.date) +
        ' · <button class="btn-plain" data-del-review="' + r.id + '" type="button">' + t('删除') + '</button></div>' +
        '</div>';
    }).join('');
  }

  function renderMessages() {
    var box = document.getElementById('message-list');
    if (!data.messages.length) { box.innerHTML = ''; return; }
    box.innerHTML = data.messages.slice().reverse().map(function (m) {
      return '<div class="msg-item">' + esc(m.text) +
        '<div class="msg-meta">' + esc(m.date) +
        ' · <button class="btn-plain" data-del-message="' + m.id + '" type="button">' + t('删除') + '</button></div>' +
        '</div>';
    }).join('');
  }

  function updateGhLinks() {
    var rText = document.getElementById('review-text').value.trim();
    var rTitle = '[评价] ' + (currentStars || 5) + ' 星' + (currentTags.length ? ' · ' + currentTags.join(' / ') : '');
    var rBody = '**评分：** ' + '★'.repeat(currentStars || 5) + '\n' +
      '**印象：** ' + (currentTags.join(' / ') || '—') + '\n\n' +
      (rText || '（在此补充你的评价）') + '\n\n—— 来自开工台网站（luckbubby2014.github.io/kaigongtai/）';

    var mText = document.getElementById('message-text').value.trim();
    var mTitle = '[留言] ' + (mText ? mText.slice(0, 30) : '给开工台说两句');
    var mBody = (mText || '（在此补充你的留言）') + '\n\n—— 来自开工台网站（luckbubby2014.github.io/kaigongtai/）';

    document.getElementById('gh-review').href =
      REPO_NEW + '?title=' + encodeURIComponent(rTitle) + '&body=' + encodeURIComponent(rBody);
    document.getElementById('gh-message').href =
      REPO_NEW + '?title=' + encodeURIComponent(mTitle) + '&body=' + encodeURIComponent(mBody);
  }

  /* ---------- 事件 ---------- */

  document.getElementById('save-review').addEventListener('click', function () {
    if (!currentStars) { alert(t('先给个星级评分吧。')); return; }
    data.reviews.push({
      id: uid(),
      stars: currentStars,
      tags: currentTags.slice(),
      text: document.getElementById('review-text').value.trim(),
      date: todayText()
    });
    save();
    currentStars = 0; currentTags = [];
    paintStars(0);
    document.querySelectorAll('#tag-picks [data-tag]').forEach(function (b) { b.classList.remove('on'); });
    document.getElementById('review-text').value = '';
    renderReviews();
    updateGhLinks();
  });

  document.getElementById('save-message').addEventListener('click', function () {
    var text = document.getElementById('message-text').value.trim();
    if (!text) { alert(t('写点什么再留言吧。')); return; }
    data.messages.push({ id: uid(), text: text, date: todayText() });
    save();
    document.getElementById('message-text').value = '';
    renderMessages();
    updateGhLinks();
  });

  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-del-review],[data-del-message]') : null;
    if (!el) return;
    if (el.hasAttribute('data-del-review')) {
      var rid = el.getAttribute('data-del-review');
      data.reviews = data.reviews.filter(function (r) { return r.id !== rid; });
    } else {
      var mid = el.getAttribute('data-del-message');
      data.messages = data.messages.filter(function (m) { return m.id !== mid; });
    }
    save();
    renderReviews();
    renderMessages();
  });

  ['review-text', 'message-text'].forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener('input', updateGhLinks);
  });

  renderReviews();
  renderMessages();
  updateGhLinks();

  /* 语言切换后重新渲染动态文本 */
  window.addEventListener('kg:render', function () {
    renderReviews();
    renderMessages();
  });

  if (window.KG_localize) window.KG_localize(document.body);
})();