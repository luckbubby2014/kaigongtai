/* ============================================================
   开工台 · 应用逻辑
   数据默认保存在浏览器 localStorage，不发送到任何服务器。
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'kaigongtai.v1';

  /* ---------- 状态 ---------- */

  var state = load();
  var currentView = { kind: 'today', projectId: null };
  var currentTab = 'overview';
  var projectFilter = 'all';
  var creating = false;

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyState();
      return normalizeState(JSON.parse(raw));
    } catch (e) {
      return emptyState();
    }
  }

  /* 数据清洗：容忍旧版/损坏/手改过的数据，避免渲染崩溃 */
  function normalizeState(s) {
    if (!s || typeof s !== 'object') return emptyState();
    if (!Array.isArray(s.projects)) s.projects = [];
    if (!Array.isArray(s.inbox)) s.inbox = [];

    s.projects = s.projects.filter(function (p) { return p && typeof p === 'object'; }).map(function (p) {
      return {
        id: typeof p.id === 'string' && p.id ? p.id : uid(),
        name: String(p.name || '未命名项目'),
        goal: String(p.goal || ''),
        status: ['active', 'paused', 'done'].indexOf(p.status) > -1 ? p.status : 'active',
        due: String(p.due || ''),
        next: String(p.next || ''),
        result: String(p.result || ''),
        review: String(p.review || ''),
        fromTemplate: typeof p.fromTemplate === 'string' ? p.fromTemplate : '',
        tasks: (Array.isArray(p.tasks) ? p.tasks : []).filter(function (t) { return t && typeof t === 'object'; }).map(function (t) {
          return {
            id: typeof t.id === 'string' && t.id ? t.id : uid(),
            text: String(t.text || '').trim() || '未命名任务',
            stage: String(t.stage || ''),
            status: ['todo', 'doing', 'done', 'stuck'].indexOf(t.status) > -1 ? t.status : 'todo'
          };
        }),
        materials: (Array.isArray(p.materials) ? p.materials : []).filter(function (m) { return m && typeof m === 'object'; }).map(function (m) {
          return {
            id: typeof m.id === 'string' && m.id ? m.id : uid(),
            title: String(m.title || m.url || '未命名资料'),
            url: safeUrl(m.url),
            note: String(m.note || '')
          };
        }),
        logs: (Array.isArray(p.logs) ? p.logs : []).filter(function (l) { return l && typeof l === 'object'; }).map(function (l) {
          return { id: typeof l.id === 'string' && l.id ? l.id : uid(), date: String(l.date || ''), text: String(l.text || '') };
        }),
        createdAt: p.createdAt || new Date().toISOString(),
        updatedAt: p.updatedAt || new Date().toISOString()
      };
    });

    s.inbox = s.inbox.filter(function (i) { return i && typeof i === 'object'; }).map(function (i) {
      return { id: typeof i.id === 'string' && i.id ? i.id : uid(), text: String(i.text || ''), date: String(i.date || '') };
    });

    return s;
  }

  /* 只允许 http(s) 链接，过滤 javascript: 等伪协议 */
  function safeUrl(u) {
    u = String(u || '').trim();
    return /^https?:\/\//i.test(u) ? u : '';
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      alert(tr('保存失败：浏览器存储空间不足或被禁用。请使用“导出备份”保存数据。'));
    }
  }

  function emptyState() {
    return { version: 1, projects: [], inbox: [] };
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  /* 文案翻译：i18n.js 未加载时原样返回 */
  function tr(key) {
    return window.KG_t ? window.KG_t(key) : key;
  }

  function today() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  /* 连续开工天数（按工作日志日期计算） */
  function streakDays() {
    var dates = {};
    state.projects.forEach(function (p) {
      (p.logs || []).forEach(function (l) { if (l.date) dates[l.date] = 1; });
    });
    if (!Object.keys(dates).length) return 0;
    var d = new Date();
    if (!dates[today()]) d.setDate(d.getDate() - 1);
    var n = 0;
    while (true) {
      var k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      if (!dates[k]) break;
      n++;
      d.setDate(d.getDate() - 1);
    }
    return n;
  }

  /* 完成庆祝：小彩点迸发 */
  function burst(x, y) {
    if (typeof document.createElement !== 'function') return;
    var colors = ['#c96442', '#e0a33c', '#5c7a4e', '#4b6db3', '#e08b68'];
    for (var i = 0; i < 12; i++) {
      var s = document.createElement('span');
      s.className = 'burst';
      var a = (Math.PI * 2 * i) / 12 + Math.random() * 0.5;
      var d = 60 + Math.random() * 80;
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      s.style.background = colors[i % colors.length];
      s.style.setProperty('--dx', Math.cos(a) * d + 'px');
      s.style.setProperty('--dy', (Math.sin(a) * d - 40) + 'px');
      document.body.appendChild(s);
      (function (node) {
        setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, 950);
      })(s);
    }
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function getProject(id) {
    for (var i = 0; i < state.projects.length; i++) {
      if (state.projects[i].id === id) return state.projects[i];
    }
    return null;
  }

  function touch(p) {
    p.updatedAt = new Date().toISOString();
  }

  var STATUS_LABEL = { active: '进行中', paused: '暂停中', done: '已完成' };
  var TASK_LABEL = { todo: '待办', doing: '进行中', done: '完成', stuck: '卡住' };

  /* ---------- 渲染 ---------- */

  var mainEl = document.getElementById('app-main');

  function render() {
    renderSidebar();
    if (currentView.kind === 'project' && getProject(currentView.projectId)) {
      renderProject(getProject(currentView.projectId));
    } else if (currentView.kind === 'inbox') {
      renderInbox();
    } else {
      renderToday();
    }
  }

  function renderSidebar() {
    var listEl = document.getElementById('project-list');
    var projects = state.projects.filter(function (p) {
      return projectFilter === 'all' || p.status === projectFilter;
    });

    if (!projects.length) {
      listEl.innerHTML = '<p class="small muted" style="padding:6px 4px">还没有项目，点上方“新建项目”开始。</p>';
    } else {
      listEl.innerHTML = projects.map(function (p) {
        var on = currentView.kind === 'project' && currentView.projectId === p.id ? ' on' : '';
        return '<button class="project-item' + on + '" data-action="open-project" data-id="' + p.id + '" type="button">' +
          '<span class="pname">' + esc(p.name || '未命名项目') + '</span>' +
          '<span class="pmeta">' + tr(STATUS_LABEL[p.status]) + (p.next ? tr(' · 有下一步') : tr(' · 缺下一步')) + '</span>' +
          '</button>';
      }).join('');
    }

    document.getElementById('inbox-count').textContent = state.inbox.length ? '(' + state.inbox.length + ')' : '';

    var slot = document.getElementById('create-slot');
    if (slot) {
      slot.innerHTML = creating
        ? '<form data-action="new-project" class="create-form" style="display:grid;gap:8px;margin-bottom:12px">' +
          '<input type="text" name="name" placeholder="项目名称" autocomplete="off">' +
          '<input type="text" name="goal" placeholder="最终要交付什么？（可选）" autocomplete="off">' +
          '<div style="display:flex;gap:6px">' +
          '<button class="btn btn-small" type="submit">创建</button>' +
          '<button class="btn-plain" type="button" data-action="cancel-create">取消</button></div></form>'
        : '';
    }

    var filters = document.querySelectorAll('#project-filters .filter-chip');
    filters.forEach(function (btn) {
      btn.classList.toggle('on', btn.getAttribute('data-filter') === projectFilter);
    });
  }

  /* ----- 今天从哪继续 ----- */

  function renderToday() {
    var active = state.projects.filter(function (p) { return p.status === 'active'; });
    var others = state.projects.filter(function (p) { return p.status !== 'active'; });

    var hour = new Date().getHours();
    var hello = hour < 6 ? tr('夜深了') : (hour < 12 ? tr('早上好') : (hour < 18 ? tr('下午好') : tr('晚上好')));
    var doneToday = 0;
    state.projects.forEach(function (p) {
      (p.logs || []).forEach(function (l) { if (l.date === today()) doneToday++; });
    });

    var html = '<div class="greeting">' +
      '<div class="hello">' + hello + '，' + tr('今天从哪继续') + '。</div>' +
      '<div class="stat-row">' +
      '<div class="stat"><div class="n">' + doneToday + '</div><div class="l">' + tr('今日完成') + '</div></div>' +
      '<div class="stat"><div class="n">' + streakDays() + '</div><div class="l">' + tr('连续开工天数') + '</div></div>' +
      '<div class="stat"><div class="n">' + active.length + '</div><div class="l">' + tr('进行中项目') + '</div></div>' +
      '</div></div>';

    if (!state.projects.length) {
      html += '<div class="empty"><p>还没有项目。先创建一个，写清最终要交付什么。</p>' +
        '<button class="btn btn-small" data-action="new-project" type="button">＋ 新建项目</button></div>';
    } else {
      html += '<div class="notice">开工台只回答一个问题：<strong>现在接着做哪一步。</strong>如果下面的项目没有下一步，先给它定一个。</div>';

      html += active.map(function (p) {
        var lastLog = p.logs && p.logs.length ? p.logs[p.logs.length - 1] : null;
        return '<div class="next-card">' +
          '<div class="label">' + esc(p.name || '未命名项目') + '</div>' +
          '<div class="value">' + (p.next ? esc(p.next) : '还没有下一步') + '</div>' +
          (lastLog ? '<div class="muted small">' + tr('上次进度（{date}）：{text}').replace('{date}', esc(lastLog.date)).replace('{text}', esc(lastLog.text)) + '</div>' : '<div class="muted small">' + tr('还没有工作记录。') + '</div>') +
          '<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">' +
          '<button class="btn btn-small" data-action="open-project" data-id="' + p.id + '" type="button">打开项目</button>' +
          (p.next ? '<button class="btn btn-ghost btn-small" data-action="finish-next" data-id="' + p.id + '" type="button">这步做完了</button>' : '') +
          '</div></div>';
      }).join('');

      if (!active.length) {
        html += '<div class="empty"><p>当前没有“进行中”的项目。可以把某个项目改回进行中，或新建一个。</p></div>';
      }

      if (others.length) {
        html += '<h3 class="mt-40">其他项目</h3><div class="project-list">' + others.map(function (p) {
          return '<button class="project-item" data-action="open-project" data-id="' + p.id + '" type="button">' +
            '<span class="pname">' + esc(p.name || '未命名项目') + '</span>' +
            '<span class="pmeta">' + tr(STATUS_LABEL[p.status]) + '</span></button>';
        }).join('') + '</div>';
      }
    }

    /* 快速收集 */
    html += '<h3 class="mt-40">快速收集</h3>' +
      '<p class="muted small">想法、链接、临时小事，先记下来，之后再归入项目。</p>' +
      '<form data-action="add-inbox" style="display:flex;gap:8px;margin-bottom:12px">' +
      '<input type="text" name="text" placeholder="例如：参考一下某某网站的导航布局" autocomplete="off">' +
      '<button class="btn btn-small" type="submit">记下</button></form>' +
      (state.inbox.length
        ? '<p class="small muted">' + tr('收集箱里有 {n} 条待整理。').replace('{n}', state.inbox.length) + ' <button class="btn-plain" data-action="open-inbox" type="button">' + tr('去整理 →') + '</button></p>'
        : '<p class="small muted">收集箱是空的。</p>');

    mainEl.innerHTML = html;
  }

  /* ----- 项目页 ----- */

  function renderProject(p) {
    var totalTasks = (p.tasks || []).length;
    var doneTasks = (p.tasks || []).filter(function (x) { return x.status === 'done'; }).length;
    var pct = totalTasks ? Math.round(doneTasks / totalTasks * 100) : 0;

    var html = '<div class="app-toolbar">' +
      '<h2 class="mb-0" style="flex:1;min-width:200px">' + esc(p.name || '未命名项目') + '</h2>' +
      '<select data-action="set-status" style="width:auto">' +
      Object.keys(STATUS_LABEL).map(function (k) {
        return '<option value="' + k + '"' + (p.status === k ? ' selected' : '') + '>' + STATUS_LABEL[k] + '</option>';
      }).join('') +
      '</select>' +
      '<button class="btn-plain" data-action="copy-project" data-id="' + p.id + '" type="button">复制为新项目</button>' +
      '<button class="btn-plain" data-action="delete-project" data-id="' + p.id + '" type="button" style="color:var(--danger)">' + tr('删除') + '</button>' +
      '</div>' +
      '<div class="progress-wrap" title="' + tr('任务进度') + '"><div class="progress-bar"><i style="width:' + pct + '%"></i></div><span class="progress-num">' + pct + '%</span></div>';

    if (!p.next) {
      html += '<div class="notice">这个项目还没有<strong>下一步</strong>。定一个马上能做的动作，下次打开就能直接开工。</div>';
    } else {
      html += '<div class="next-card">' +
        '<div class="label">下一步</div>' +
        '<div class="value">' + esc(p.next) + '</div>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
        '<button class="btn btn-small" data-action="finish-next" data-id="' + p.id + '" type="button">这步做完了</button>' +
        '<button class="btn-ghost btn-small" data-action="edit-next" type="button">修改</button>' +
        '</div></div>';
    }

    html += '<div class="app-tabs">' +
      ['overview:概览', 'tasks:任务', 'materials:资料', 'logs:日志', 'review:复盘'].map(function (pair) {
        var kv = pair.split(':');
        return '<button class="app-tab' + (currentTab === kv[0] ? ' on' : '') + '" data-action="tab" data-tab="' + kv[0] + '" type="button">' + kv[1] + '</button>';
      }).join('') + '</div>';

    if (currentTab === 'overview') {
      html += '<div class="stat-row">' +
        '<div class="stat"><div class="n">' + doneTasks + '/' + (p.tasks || []).length + '</div><div class="l">任务完成</div></div>' +
        '<div class="stat"><div class="n">' + (p.materials || []).length + '</div><div class="l">参考资料</div></div>' +
        '<div class="stat"><div class="n">' + (p.logs || []).length + '</div><div class="l">工作日志</div></div>' +
        (p.due ? '<div class="stat"><div class="n" style="font-size:18px">' + esc(p.due) + '</div><div class="l">截止日期</div></div>' : '') +
        '</div>' +
        '<div class="field"><label>项目名称</label><input type="text" data-action="set-field" data-field="name" value="' + esc(p.name) + '"></div>' +
        '<div class="field"><label>项目目标（最终要交付什么）</label><textarea data-action="set-field" data-field="goal" placeholder="例如：发布一个能在手机上正常浏览的个人作品集">' + esc(p.goal) + '</textarea></div>' +
        '<div class="field"><label>下一步（马上能做的一个动作）</label><input type="text" data-action="set-field" data-field="next" value="' + esc(p.next) + '" placeholder="例如：为 6 个作品各选一张封面图"></div>' +
        '<div class="field"><label>截止日期（可选）</label><input type="date" data-action="set-field" data-field="due" value="' + esc(p.due) + '"></div>';
    }

    if (currentTab === 'tasks') {
      html += '<form data-action="add-task" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px">' +
        '<input type="text" name="text" placeholder="要做的事" style="flex:1;min-width:180px" autocomplete="off">' +
        '<input type="text" name="stage" placeholder="阶段，如：准备" style="width:120px" autocomplete="off">' +
        '<button class="btn btn-small" type="submit">添加</button></form>';

      if (!(p.tasks || []).length) {
        html += '<div class="empty">还没有任务。把项目按阶段拆开，例如“准备 / 制作 / 发布”。</div>';
      } else {
        var stages = [];
        p.tasks.forEach(function (t) {
          var s = t.stage || '未分阶段';
          if (stages.indexOf(s) === -1) stages.push(s);
        });
        stages.forEach(function (stage) {
          html += '<h3>' + esc(stage) + '</h3>';
          html += p.tasks.filter(function (t) { return (t.stage || '未分阶段') === stage; }).map(function (t) {
            var cls = t.status === 'done' ? ' done' : (t.status === 'stuck' ? ' stuck' : '');
            return '<div class="task-row' + cls + '">' +
              '<span class="status-chip ' + t.status + '" data-action="cycle-task" data-id="' + t.id + '" title="点击切换状态">' + tr(TASK_LABEL[t.status]) + '</span>' +
              '<span class="task-text" data-action="cycle-task" data-id="' + t.id + '">' + esc(t.text) + '</span>' +
              '<span class="row-actions">' +
              '<button class="btn-plain" data-action="toggle-stuck" data-id="' + t.id + '" type="button">' + (t.status === 'stuck' ? '取消卡住' : '卡住了') + '</button>' +
              '<button class="btn-plain" data-action="delete-task" data-id="' + t.id + '" type="button">删除</button>' +
              '</span></div>';
          }).join('');
        });
      }
    }

    if (currentTab === 'materials') {
      html += '<form data-action="add-material" style="display:grid;gap:10px;margin-bottom:18px">' +
        '<input type="text" name="title" placeholder="标题，例如：某作品集网站的导航布局" autocomplete="off">' +
        '<input type="url" name="url" placeholder="链接（可选）">' +
        '<input type="text" name="note" placeholder="为什么收藏 / 放在哪里（可选）" autocomplete="off">' +
        '<div><button class="btn btn-small" type="submit">添加资料</button></div></form>';

      if (!(p.materials || []).length) {
        html += '<div class="empty">还没有资料。把参考链接、图片位置、文档放在这里，并写一句“为什么收藏”。</div>';
      } else {
        html += p.materials.map(function (m) {
          return '<div class="material-row">' +
            '<div>' + (m.url ? '<a href="' + esc(m.url) + '" target="_blank" rel="noopener noreferrer">' + esc(m.title || m.url) + '</a>' : '<strong>' + esc(m.title) + '</strong>') + '</div>' +
            (m.note ? '<div class="muted small">' + esc(m.note) + '</div>' : '') +
            '<div class="row-actions" style="margin-top:6px"><button class="btn-plain" data-action="delete-material" data-id="' + m.id + '" type="button">删除</button></div>' +
            '</div>';
        }).join('');
      }
    }

    if (currentTab === 'logs') {
      html += '<form data-action="add-log" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px">' +
        '<input type="text" name="text" placeholder="今天做了什么？卡在哪里？" style="flex:1;min-width:220px" autocomplete="off">' +
        '<button class="btn btn-small" type="submit">记一笔</button></form>';

      if (!(p.logs || []).length) {
        html += '<div class="empty">还没有工作记录。每次做完用一两句话记下来，中断后也能马上接上。</div>';
      } else {
        html += p.logs.slice().reverse().map(function (l) {
          return '<div class="log-row"><span class="date">' + esc(l.date) + '</span>' + esc(l.text) +
            ' <button class="btn-plain" data-action="delete-log" data-id="' + l.id + '" type="button" style="float:right">删除</button></div>';
        }).join('');
      }
    }

    if (currentTab === 'review') {
      html += '<div class="field"><label>成果（最终交付了什么 / 链接）</label><textarea data-action="set-field" data-field="result" placeholder="例如：作品集网站已发布，网址是……">' + esc(p.result) + '</textarea></div>' +
        '<div class="field"><label>复盘（哪些步骤实际做了？哪些没必要？下次的经验）</label><textarea data-action="set-field" data-field="review" placeholder="例如：提前定封面风格会省很多时间；下次不用做独立的联系页。">' + esc(p.review) + '</textarea></div>' +
        '<p class="muted small">项目完成后，在顶部把状态改为“已完成”。它会保留在列表里，也可以“复制为新项目”作为下次的模板。</p>';
    }

    mainEl.innerHTML = html;
  }

  /* ----- 收集箱 ----- */

  function renderInbox() {
    var html = '<div class="app-toolbar"><h2 class="mb-0" style="flex:1">收集箱</h2>' +
      '<button class="btn-plain" data-action="go-today" type="button">← 今天从哪继续</button></div>';

    html += '<p class="muted small">先把想法记下来，之后再归入项目、转成任务，或者删掉。</p>' +
      '<form data-action="add-inbox" style="display:flex;gap:8px;margin-bottom:18px">' +
      '<input type="text" name="text" placeholder="想法、链接或小事" autocomplete="off">' +
      '<button class="btn btn-small" type="submit">记下</button></form>';

    if (!state.inbox.length) {
      html += '<div class="empty">收集箱是空的。</div>';
    } else {
      var options = '<option value="">选择项目…</option>' + state.projects.map(function (p) {
        return '<option value="' + p.id + '">' + esc(p.name || '未命名项目') + '</option>';
      }).join('');

      html += state.inbox.slice().reverse().map(function (item) {
        return '<div class="inbox-row">' +
          '<span class="text">' + esc(item.text) + '<br><span class="small muted">' + esc(item.date) + '</span></span>' +
          '<select data-action="inbox-to-task" data-id="' + item.id + '" style="width:auto">' + options + '</select>' +
          '<span class="row-actions"><button class="btn-plain" data-action="delete-inbox" data-id="' + item.id + '" type="button">删除</button></span>' +
          '</div>';
      }).join('');
    }

    mainEl.innerHTML = html;
  }

  /* ---------- 事件 ---------- */

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action]');
    if (!el) return;
    var action = el.getAttribute('data-action');
    var id = el.getAttribute('data-id');

    switch (action) {
      case 'new-project':
        creating = true;
        renderSidebar();
        var createInput = document.querySelector('#create-slot input[name="name"]');
        if (createInput) createInput.focus();
        break;
      case 'cancel-create':
        creating = false;
        renderSidebar();
        break;
      case 'open-project':
        currentView = { kind: 'project', projectId: id };
        currentTab = 'overview';
        render();
        window.scrollTo(0, 0);
        break;
      case 'open-inbox':
        currentView = { kind: 'inbox', projectId: null };
        render();
        break;
      case 'go-today':
        currentView = { kind: 'today', projectId: null };
        render();
        break;
      case 'tab':
        currentTab = el.getAttribute('data-tab');
        render();
        break;
      case 'cycle-task': {
        var p1 = getProject(currentView.projectId);
        var t1 = findTask(p1, id);
        if (t1) {
          var nextStatus = t1.status === 'todo' ? 'doing' : (t1.status === 'doing' ? 'done' : 'todo');
          if (nextStatus === 'done' && el.getBoundingClientRect) {
            var r1 = el.getBoundingClientRect();
            burst(r1.left + r1.width / 2, r1.top + r1.height / 2);
          }
          t1.status = nextStatus;
          touch(p1); save(); render();
        }
        break;
      }
      case 'toggle-stuck': {
        var p2 = getProject(currentView.projectId);
        var t2 = findTask(p2, id);
        if (t2) {
          t2.status = t2.status === 'stuck' ? 'todo' : 'stuck';
          touch(p2); save(); render();
        }
        break;
      }
      case 'delete-task': {
        var p3 = getProject(currentView.projectId);
        p3.tasks = p3.tasks.filter(function (t) { return t.id !== id; });
        touch(p3); save(); render();
        break;
      }
      case 'delete-material': {
        var p4 = getProject(currentView.projectId);
        p4.materials = p4.materials.filter(function (m) { return m.id !== id; });
        touch(p4); save(); render();
        break;
      }
      case 'delete-log': {
        var p5 = getProject(currentView.projectId);
        p5.logs = p5.logs.filter(function (l) { return l.id !== id; });
        touch(p5); save(); render();
        break;
      }
      case 'finish-next': {
        var p6 = getProject(id || currentView.projectId);
        if (p6 && p6.next) {
          if (el.getBoundingClientRect) {
            var r2 = el.getBoundingClientRect();
            burst(r2.left + r2.width / 2, r2.top + r2.height / 2);
          }
          p6.logs.push({ id: uid(), date: today(), text: tr('完成下一步：{step}').replace('{step}', p6.next) });
          p6.next = '';
          touch(p6); save(); render();
        }
        break;
      }
      case 'edit-next': {
        if (currentTab !== 'overview') {
          currentTab = 'overview';
          render();
        }
        var input = mainEl.querySelector('[data-field="next"]');
        if (input) { input.focus(); input.select(); }
        break;
      }
      case 'copy-project': {
        var src = getProject(id);
        if (src) {
          var copy = JSON.parse(JSON.stringify(src));
          copy.id = uid();
          copy.name = tr('{name}（副本）').replace('{name}', src.name);
          copy.status = 'active';
          copy.logs = [];
          copy.result = '';
          copy.review = '';
          copy.tasks.forEach(function (t) { t.id = uid(); t.status = 'todo'; });
          copy.createdAt = copy.updatedAt = new Date().toISOString();
          state.projects.push(copy);
          save();
          currentView = { kind: 'project', projectId: copy.id };
          render();
        }
        break;
      }
      case 'delete-project': {
        if (confirm(tr('确定删除这个项目？它的任务、资料和日志都会一起删除。建议先导出备份。'))) {
          state.projects = state.projects.filter(function (p) { return p.id !== id; });
          save();
          currentView = { kind: 'today', projectId: null };
          render();
        }
        break;
      }
      case 'delete-inbox': {
        state.inbox = state.inbox.filter(function (i) { return i.id !== id; });
        save(); render();
        break;
      }
    }
  });

  function findTask(p, id) {
    if (!p) return null;
    for (var i = 0; i < p.tasks.length; i++) {
      if (p.tasks[i].id === id) return p.tasks[i];
    }
    return null;
  }

  /* 新建项目 */
  document.getElementById('btn-new-project').addEventListener('click', function () {
    creating = true;
    renderSidebar();
    var createInput = document.querySelector('#create-slot input[name="name"]');
    if (createInput) createInput.focus();
  });

  function createProject(name, goal) {
    var p = {
      id: uid(),
      name: name || '未命名项目',
      goal: goal || '',
      status: 'active',
      due: '',
      next: '',
      result: '',
      review: '',
      fromTemplate: '',
      tasks: [],
      materials: [],
      logs: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    state.projects.push(p);
    save();
    currentView = { kind: 'project', projectId: p.id };
    currentTab = 'overview';
    render();
  }

  /* 表单提交 */
  document.addEventListener('submit', function (e) {
    var form = e.target.closest('[data-action]');
    if (!form) return;
    e.preventDefault();
    var action = form.getAttribute('data-action');
    var fd = new FormData(form);
    var p = getProject(currentView.projectId);

    if (action === 'new-project') {
      var pname = String(fd.get('name') || '').trim();
      if (!pname) return;
      creating = false;
      createProject(pname, String(fd.get('goal') || '').trim());
      return;
    }

    if (action === 'add-task') {
      var text = String(fd.get('text') || '').trim();
      if (!text || !p) return;
      p.tasks.push({ id: uid(), text: text, stage: String(fd.get('stage') || '').trim(), status: 'todo' });
    }

    if (action === 'add-material') {
      if (!p) return;
      var title = String(fd.get('title') || '').trim();
      var url = safeUrl(fd.get('url'));
      if (!title && !url) return;
      p.materials.push({ id: uid(), title: title || url, url: url, note: String(fd.get('note') || '').trim() });
    }

    if (action === 'add-log') {
      var logText = String(fd.get('text') || '').trim();
      if (!logText || !p) return;
      p.logs.push({ id: uid(), date: today(), text: logText });
    }

    if (action === 'add-inbox') {
      var inboxText = String(fd.get('text') || '').trim();
      if (!inboxText) return;
      state.inbox.push({ id: uid(), text: inboxText, date: today() });
    }

    touch(p || state);
    save();
    render();
  });

  /* 字段修改 */
  document.addEventListener('change', function (e) {
    var el = e.target.closest('[data-action]');
    if (!el) return;
    var action = el.getAttribute('data-action');
    var p = getProject(currentView.projectId);

    if (action === 'set-field' && p) {
      p[el.getAttribute('data-field')] = el.value;
      touch(p); save(); render();
    }

    if (action === 'set-status' && p) {
      p.status = el.value;
      touch(p); save(); render();
    }

    if (action === 'inbox-to-task') {
      var target = getProject(el.value);
      var item = null;
      for (var i = 0; i < state.inbox.length; i++) {
        if (state.inbox[i].id === el.getAttribute('data-id')) item = state.inbox[i];
      }
      if (target && item) {
        target.tasks.push({ id: uid(), text: item.text, stage: '', status: 'todo' });
        state.inbox = state.inbox.filter(function (x) { return x.id !== item.id; });
        touch(target); save(); render();
      }
    }
  });

  /* 侧栏筛选与跳转 */
  document.getElementById('project-filters').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-filter]');
    if (!btn) return;
    projectFilter = btn.getAttribute('data-filter');
    renderSidebar();
  });

  document.getElementById('btn-inbox').addEventListener('click', function () {
    currentView = { kind: 'inbox', projectId: null };
    render();
    window.scrollTo(0, 0);
  });

  document.getElementById('btn-today').addEventListener('click', function () {
    currentView = { kind: 'today', projectId: null };
    render();
    window.scrollTo(0, 0);
  });

  /* 导出 / 导入 */
  document.getElementById('btn-export').addEventListener('click', function () {
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '开工台备份-' + today() + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  });

  document.getElementById('btn-import').addEventListener('click', function () {
    document.getElementById('import-file').click();
  });

  document.getElementById('import-file').addEventListener('change', function (e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        if (!data || typeof data !== 'object' || !Array.isArray(data.projects)) throw new Error('bad');
        if (!confirm(tr('导入会覆盖当前全部数据，确定继续？建议先导出当前备份。'))) return;
        state = normalizeState(data);
        save();
        currentView = { kind: 'today', projectId: null };
        render();
        alert(tr('导入完成。'));
      } catch (err) {
        alert(tr('导入失败：文件格式不正确。'));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  /* ---------- 模板库：app.html?tpl=xxx 一键创建项目 ---------- */

  var TEMPLATES = {
    portfolio: {
      name: '个人作品集网站',
      goal: '发布一个能在手机上正常浏览的个人作品集',
      next: '为 6 个作品各选一张封面图',
      tasks: [
        ['准备', '选出 6 个作品'], ['准备', '整理每个作品的图片和说明'], ['准备', '写个人介绍初稿'],
        ['制作', '确定首页结构'], ['制作', '制作作品展示页'], ['制作', '加入联系方式'],
        ['发布', '检查手机端显示'], ['发布', '修复失效链接'], ['发布', '发布并记录网址']
      ]
    },
    article: {
      name: '写一篇深度长文',
      goal: '完成并发布一篇 3000 字以上的长文',
      next: '列出文章的三个核心观点',
      tasks: [
        ['选题', '确定主题与目标读者'], ['选题', '收集 5 个有价值的参考资料'], ['选题', '列出三个核心观点'],
        ['写作', '写出提纲'], ['写作', '完成初稿（先写完再改）'], ['写作', '放一天再修改'],
        ['发布', '校对两遍'], ['发布', '配图与排版'], ['发布', '发布并记录链接']
      ]
    },
    illustration: {
      name: '完成一组插画系列',
      goal: '完成并发布一组 6 张的主题插画',
      next: '画出第一张的草图',
      tasks: [
        ['构思', '确定主题与色调'], ['构思', '收集参考图'], ['构思', '列出 6 个画面'],
        ['绘制', '完成 6 张草图'], ['绘制', '勾线稿'], ['绘制', '上色与调整'],
        ['发布', '统一导出尺寸'], ['发布', '整理发布文案'], ['发布', '发布并记录']
      ]
    },
    exam: {
      name: '备考一门考试',
      goal: '通过考试并达到目标分数',
      next: '做一套真题摸底',
      tasks: [
        ['摸底', '做一套真题'], ['摸底', '整理错题类型'], ['摸底', '制定周计划'],
        ['强化', '每周完成固定量的真题'], ['强化', '专项突破薄弱项'], ['强化', '整理错题本'],
        ['冲刺', '模考 2 次'], ['冲刺', '调整作息'], ['冲刺', '准备考试日物品清单']
      ]
    },
    move: {
      name: '搬家准备',
      goal: '完成搬家，一周内在新家正常生活',
      next: '列出所有房间的物品清单',
      tasks: [
        ['计划', '定搬家日期'], ['计划', '列物品清单'], ['计划', '预约搬家公司'],
        ['打包', '打包非日常用品'], ['打包', '每个箱子贴标签'], ['打包', '准备搬家日急救箱'],
        ['入住', '检查水电燃气网络'], ['入住', '归位整理'], ['入住', '处理多余物品']
      ]
    },
    podcast: {
      name: '播客节目上线',
      goal: '做出并发布第一期播客节目',
      next: '写出第一期的三个话题提纲',
      tasks: [
        ['选题', '确定节目定位与名字'], ['选题', '写出第一期的三个话题提纲'], ['选题', '列出 5 位想邀请的嘉宾'],
        ['录制', '准备录音设备与环境'], ['录制', '完成第一期录制'], ['录制', '剪辑并加片头音乐'],
        ['发布', '选一个发布平台'], ['发布', '上传并写节目简介'], ['发布', '发布并记录链接']
      ]
    },
    skill: {
      name: '学习一项新技能',
      goal: '用 8 周入门并做出一个小作品',
      next: '报名入门课或买好教材',
      tasks: [
        ['准备', '选定要学的技能与目标水平'], ['准备', '找 3 个优质入门资源'], ['准备', '制定每周学习计划'],
        ['练习', '每周固定练习时间'], ['练习', '完成 3 个小练习'], ['练习', '做一个小作品'],
        ['巩固', '总结常见错误清单'], ['巩固', '向懂的人请教一次'], ['巩固', '整理学习笔记并公开']
      ]
    },
    room: {
      name: '房间改造',
      goal: '把房间改造成舒服好用的样子',
      next: '量好房间尺寸并画出平面图',
      tasks: [
        ['规划', '量好房间尺寸并画出平面图'], ['规划', '收集灵感图并定风格'], ['规划', '列出预算与采购清单'],
        ['执行', '清理与断舍离'], ['执行', '改造收纳与灯光'], ['执行', '摆放与装饰'],
        ['收尾', '拍照记录改造前后'], ['收尾', '调整不满意的小地方'], ['收尾', '列出下次改造清单']
      ]
    }
  };

  (function applyTemplate() {
    var m = /[?&]tpl=([\w-]+)/.exec(location.search || '');
    if (!m) return;
    var tpl = TEMPLATES[m[1]];
    if (!tpl) return;
    var exists = state.projects.some(function (p) { return p.fromTemplate === m[1]; });
    if (exists) return;
    var p = {
      id: uid(), name: tpl.name, goal: tpl.goal, status: 'active', due: '',
      next: tpl.next, result: '', review: '', fromTemplate: m[1],
      tasks: tpl.tasks.map(function (t) { return { id: uid(), text: t[1], stage: t[0], status: 'todo' }; }),
      materials: [], logs: [],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    state.projects.push(p);
    save();
    currentView = { kind: 'project', projectId: p.id };
    currentTab = 'overview';
  })();

  /* 启动 */
  render();
  if (window.KG_localize) window.KG_localize(document.body);

})();