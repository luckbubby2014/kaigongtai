/* ============================================================
   开工台 · 多语言（中 / EN / 日本語）
   词典以中文原文为键；EN 为全站兜底语言；法律正文以中文为准。
   ============================================================ */
(function () {
  'use strict';

  /* [中文, English, 日本語] */
  var T = [
    /* ---------- 全站导航 / 页脚 ---------- */
    ['产品概览', 'Product Overview', '製品概要'],
    ['使用帮助', 'How to Use', '使い方'],
    ['使用场景', 'Use Cases', '活用シーン'],
    ['模板库', 'Templates', 'テンプレート'],
    ['常见问题', 'FAQ', 'よくある質問'],
    ['更新日志', 'Changelog', '更新履歴'],
    ['菜单', 'Menu', 'メニュー'],
    ['关于', 'About', 'について'],
    ['打开工台', 'Open the app', 'アプリを開く'],
    ['首页', 'Home', 'ホーム'],
    ['产品', 'Product', '製品'],
    ['帮助', 'Help', 'ヘルプ'],
    ['法律', 'Legal', '法務'],
    ['关于本站', 'About this site', 'このサイトについて'],
    ['隐私政策', 'Privacy Policy', 'プライバシーポリシー'],
    ['服务条款', 'Terms of Service', '利用規約'],
    ['免责声明', 'Disclaimer', '免責事項'],
    ['知识产权与侵权投诉', 'IP & Infringement Notices', '知的財産権・侵害申告'],
    ['面向个人创作者的项目推进工具。记住目标，安排下一步，把项目做完。', 'A project-moving tool for individual creators. Set the goal, pick the next step, finish the project.', '個人クリエイターのためのプロジェクト推進ツール。目標を決め、次の一歩を決め、やり切る。'],
    ['本站为独立开发的非官方工具，数据默认保存在访问者自己的浏览器中。使用前请阅读服务条款与免责声明；本工具不构成任何专业建议，亦不对使用结果作出保证。', 'This is an independently built unofficial tool. Your data stays in your own browser by default. Please read the Terms of Service and Disclaimer before use; this tool does not constitute professional advice and guarantees no results.', '本サイトは個人開発の非公式ツールです。データは既定で閲覧者のブラウザに保存されます。ご利用前に利用規約と免責事項をお読みください。専門的助言ではなく、結果を保証するものでもありません。'],
    ['本工具仅供个人计划与记录使用，不保证数据在任何情况下不丢失，请定期使用“导出备份”保存数据。', 'For personal planning and record-keeping only. Data loss cannot be fully prevented; please export backups regularly.', '個人の計画・記録専用です。データ消失を完全には防げません。「バックアップを書き出す」で定期的に保存してください。'],
    ['数据保存在本机浏览器中，不会自动上传。', 'Data stays in this browser and is never uploaded.', 'データはこのブラウザに保存され、アップロードされません。'],
    ['隐私说明', 'Privacy', 'プライバシー'],

    /* ---------- 首页（启动台） ---------- */
    ['给一个人的项目推进工具', 'A project tool for one person', 'ひとりのためのプロジェクトツール'],
    ['打开就知道', 'Open it and you know', '開いた瞬間、'],
    ['下一步做什么。', 'what to do next.', '次の一手がわかる。'],
    ['开工台帮你把手头的项目持续往前推进，而不是再建一堆没人看的待办清单。目标、下一步、参考资料和工作记录都围绕同一个项目放在一起。', 'Kaigongtai keeps your projects moving forward, instead of piling up to-do lists nobody reads. Goal, next step, references and work notes all live around the same project.', '「开工台」は、誰も読まないToDoリストを積み上げるのではなく、手元のプロジェクトを前に進めます。目標・次の一手・参考資料・作業記録をひとつのプロジェクトにまとめます。'],
    ['开始使用', 'Get started', '始める'],
    ['看看怎么用', 'See how it works', '使い方を見る'],
    ['语言', 'Language', '言語'],
    ['风格', 'Style', 'スタイル'],
    ['纸感米色', 'Paper', 'ペーパー'],
    ['暗夜', 'Night', 'ナイト'],
    ['青灰', 'Mist', 'ミスト'],
    ['靛蓝', 'Indigo', 'インディゴ'],
    ['选择会保存在你的浏览器里，下次打开自动生效。', 'Your choices are saved in this browser and apply automatically next time.', '選択はこのブラウザに保存され、次回開くと自動的に適用されます。'],
    ['概览', 'Overview', '概要'],
    ['指南', 'Guide', 'ガイド'],
    ['场景', 'Use Cases', 'シーン'],
    ['模板', 'Templates', 'テンプレート'],
    ['问答', 'FAQ', 'Q&A'],
    ['版本', 'Versions', 'バージョン'],
    ['法律与隐私', 'Legal & Privacy', '法務とプライバシー'],
    ['和待办清单的区别、功能清单、使用示例与产品原则。', 'How it differs from to-do lists, the feature list, a worked example and product principles.', 'ToDoリストとの違い、機能一覧、使用例、製品原則。'],
    ['几分钟上手：建项目、定下一步、记日志、导出备份。', 'Get started in minutes: create a project, set the next step, log progress, export backups.', '数分で使い始められます。プロジェクト作成、次の一手、記録、バックアップ。'],
    ['写作、插画、做网站、备考、搬家、长期副业的具体用法。', 'Concrete uses for writing, illustration, websites, exams, moving and side projects.', '写作・イラスト・Web制作・試験対策・引っ越し・副業での具体的な使い方。'],
    ['五类项目模板，任务已按阶段拆好，一键生成项目。', 'Five project templates with tasks split by phase — create a project in one click.', 'フェーズ別にタスクを仕分けた5つのテンプレート。ワンクリックでプロジェクト作成。'],
    ['数据保存在哪里、要不要注册、如何备份与迁移。', 'Where data lives, whether you need an account, how to back up and migrate.', 'データの保存場所、登録の要否、バックアップと移行方法。'],
    ['版本记录与功能变化，重大更新会在这里说明。', 'Version history and feature changes; major updates are announced here.', 'バージョン履歴と機能変更。重要な更新はここでお知らせします。'],
    ['站点定位、产品原则、制作说明与联系方式。', 'What this site is, product principles, credits and contact info.', 'サイトの位置づけ、製品原則、制作ノート、連絡先。'],
    ['隐私政策、服务条款、免责声明与侵权投诉流程。', 'Privacy Policy, Terms of Service, Disclaimer and infringement process.', 'プライバシーポリシー、利用規約、免責事項、侵害申告の流れ。'],
    ['现在就建一个项目试试。', 'Create a project and try it now.', '今すぐプロジェクトを作ってみる。'],
    ['写清目标，定下一步，剩下的交给一次次开工。', 'Write down the goal, pick the next step, and let the work sessions do the rest.', '目標を書き、次の一手を決め、あとは着手を重ねるだけ。'],

    /* ---------- 产品概览页 ---------- */
    ['和待办清单的区别', 'vs. to-do lists', 'ToDoリストとの違い'],
    ['围绕一个成果组织，而不是把事情越记越多。', 'Organized around an outcome, not an ever-growing list.', 'タスクを増やすのではなく、成果物を中心にまとめる。'],
    ['待办清单记的是“有哪些事”，开工台记住的是“这个项目要交付什么、现在推进到哪、接着做哪一步”。所以它不会越积越多，而是每次打开都能直接开工。', 'A to-do list remembers “what tasks exist”. Kaigongtai remembers “what this project delivers, where it stands, and what to do next”. So it never piles up — every time you open it, you can start working immediately.', 'ToDoリストは「何をするか」を記録します。「开工台」は「何を届けるか、どこまで進んだか、次に何をするか」を記録します。だから溜まらず、開けばすぐ着手できます。'],
    ['下一步永远醒目', 'The next step stays front and center', '次の一手が常に前面に'],
    ['每个项目都必须有一个明确的“下一步”。首页第一眼就告诉你现在该做什么，不用重新翻看整个计划。', 'Every project keeps one clear next step. The home view tells you what to do right now — no need to reread the whole plan.', '各プロジェクトには明確な「次の一手」があります。ホームを開けば今やるべきことがわかり、計画を読み直す必要はありません。'],
    ['资料跟着项目走', 'References travel with the project', '資料はプロジェクトと一緒に'],
    ['参考链接、图片位置、文档都可以挂在项目下，并附一句“为什么收藏”，以后不会再对着链接想不起来用途。', 'Links, image locations and docs live under the project, each with a note on why you saved it — no more mystery links.', 'リンク・画像の場所・文書をプロジェクトに紐づけ、「なぜ保存したか」を添えておく。用途不明のリンクに悩まされません。'],
    ['进度说得清楚', 'Progress that actually says something', '進捗がきちんと語る'],
    ['不是干巴巴的百分比，而是“上次做到哪、卡在哪里”。中断几天回来，也能马上接上。', 'Not a bare percentage, but “where you left off and what blocked you”. Even after days away, you can pick right up.', '単なるパーセントではなく「どこまでやったか、どこで止まったか」。数日あけてもすぐ再開できます。'],
    ['怎么用', 'How it works', '使い方'],
    ['计划一局，做完，再接上。', 'Plan a session, finish it, pick it up again.', 'ひと区切り計画し、やり切り、また続ける。'],
    ['建一个项目', 'Create a project', 'プロジェクトを作る'],
    ['用一句话写清最终要交付什么，例如“发布一个手机上能正常浏览的作品集网站”，再把步骤按阶段拆开。', 'Write in one sentence what you will deliver — e.g. “publish a portfolio site that works on phones” — then split the steps into phases.', '最終的に何を届けるかを一文で書き（例：スマホで見られるポートフォリオを公開）、手順をフェーズに分けます。'],
    ['定下下一步', 'Set the next step', '次の一手を決める'],
    ['从任务里挑出马上能做的一件事作为“下一步”。做完就更新，让项目始终有一个可以立刻开始的动作。', 'Pick one thing you can start right now as the “next step”. Update it after each session so there is always something to begin immediately.', '今すぐできる一つを「次の一手」に。終わるたびに更新し、常にすぐ始められる状態に保ちます。'],
    ['记录然后继续', 'Log it, then continue', '記録して、続ける'],
    ['每次工作结束，用一两句话记下做了什么、卡在哪。下次打开首页，从上次停下的地方接着做。', 'At the end of each session, note in a sentence or two what you did and where you got stuck. Next time, continue from there.', '作業が終わるたびに、やったことと詰まった点を一两句で記録。次に開いたら、そこから再開します。'],
    ['收集箱：先记下来', 'Inbox: capture first', '収集箱：まずメモ'],
    ['想法、链接、临时小事，随手丢进收集箱，不打断当前工作。之后再归入项目、转成任务，或者删掉。', 'Drop ideas, links and little things into the inbox without breaking your flow. Sort them into projects later.', 'アイデア・リンク・雑事は収集箱へ。作業を中断せず、後でプロジェクトに振り分けます。'],
    ['收尾与复盘', 'Wrap up and review', '仕上げと振り返り'],
    ['项目完成时做一次简短收尾：成果是什么、哪些步骤没必要、下次的经验是什么。还能一键复制成新项目的模板。', 'When a project finishes, do a short review: what was delivered, which steps were unnecessary, what you learned. You can also copy it as a template for the next project.', '完了時に短い振り返りを。成果、不要だった手順、次回の教訓を書き、そのまま次のプロジェクトの雛形にコピーできます。'],
    ['使用示例', 'Worked example', '使用例'],
    ['制作个人作品集网站', 'Building a personal portfolio site', '個人ポートフォリオサイトを作る'],
    ['假设你要做一个作品集网站。项目目标：发布一个能在手机上正常浏览的个人作品集。', 'Say you want a portfolio site. The goal: publish a personal portfolio that works well on phones.', 'ポートフォリオサイトを作る場合。目標：スマホで快適に見られるポートフォリオを公開する。'],
    ['准备', 'Preparation', '準備'],
    ['选出 6 个作品 · 整理每个作品的图片和说明 · 写个人介绍初稿', 'Pick 6 works · Gather images and captions for each · Draft your bio', '6作品を選ぶ · 各作品の画像と説明を整理 · 自己紹介の下書き'],
    ['制作', 'Production', '制作'],
    ['确定首页结构 · 制作作品展示页 · 加入联系方式', 'Design the home layout · Build the work pages · Add contact info', 'トップページ構成を決める · 作品ページを作る · 連絡先を追加'],
    ['发布', 'Publish', '公開'],
    ['检查手机端显示 · 修复失效链接 · 发布并记录网址', 'Check mobile display · Fix broken links · Publish and record the URL', 'スマホ表示を確認 · 切れたリンクを修正 · 公開してURLを記録'],
    ['“上次做到：已经整理好 4 个作品的说明。下一步：为 6 个作品各选一张封面图。”', '“Left off: finished captions for 4 works. Next: pick a cover image for each of the 6 works.”', '「ここまで：4作品分の説明を整理。次：6作品それぞれのカバー画像を選ぶ。」'],
    ['开工台首页 · 今天从哪继续', 'Kaigongtai home · Where to continue today', '开工台ホーム · 今日はどこから続ける'],
    ['功能', 'Features', '機能'],
    ['第一版只做真正用得上的几件事。', 'Version one does only the few things that truly help.', '初版がやるのは、本当に役立つことだけ。'],
    ['模块', 'Module', 'モジュール'],
    ['它做什么', 'What it does', 'できること'],
    ['今天从哪继续', 'Where to continue today', '今日はどこから続ける'],
    ['汇总所有进行中项目的下一步和最近进度，打开就知道从哪开始。', 'Collects the next step and latest progress of every active project, so you know where to start.', '進行中プロジェクトの次の一手と直近の進捗を集約。開けば始める場所がわかる。'],
    ['项目', 'Project', 'プロジェクト'],
    ['目标、截止日期、阶段任务、参考资料、工作日志、成果链接，都放在同一个项目里。', 'Goal, deadline, phased tasks, references, work notes and result links — all in one project.', '目標・期限・フェーズ別タスク・参考資料・作業記録・成果リンクをひとつのプロジェクトに。'],
    ['下一步', 'Next step', '次の一手'],
    ['每个项目有一个明确的下一步动作；项目没有下一步时会提醒你补上。', 'Each project has one clear next action; you are reminded when a project lacks one.', '各プロジェクトに明確な次のアクション。無いときは補うよう促します。'],
    ['收集箱', 'Inbox', '収集箱'],
    ['随手记下想法、链接和小事，之后再归入项目或转成任务。', 'Jot down ideas, links and little things, then file them into projects or tasks.', 'アイデア・リンク・雑事を書き留め、後でプロジェクトやタスクへ。'],
    ['工作日志', 'Work notes', '作業記録'],
    ['一两句话记录每次做了什么、遇到什么问题，方便中断后接上。', 'One or two lines on what you did and what blocked you, so you can resume easily.', 'やったことと問題を一两句で記録し、中断後もすぐ再開。'],
    ['导出与导入', 'Export & import', '書き出し・読み込み'],
    ['全部数据可导出为 JSON 备份文件，也可以重新导入，方便迁移和保存。', 'Export everything as a JSON backup and import it again — easy to migrate and keep safe.', '全データをJSONで書き出し・読み込み。移行と保存が簡単。'],
    ['暂不做：团队协作、排行榜、社交动态。它只服务一个人把项目做完。', 'Not in scope: teamwork, leaderboards, social feeds. It serves one person finishing projects.', '対象外：チーム協力、ランキング、SNSフィード。ひとりがプロジェクトを完遂するためのツールです。'],
    ['产品原则', 'Principles', '製品原則'],
    ['打开就能用，数据自己管。', 'Works instantly. Your data stays yours.', '開けば使える。データは自分のもの。'],
    ['不用注册', 'No sign-up', '登録不要'],
    ['打开网页就能创建项目，不要求账号、不发送任何数据到服务器。数据默认保存在你自己的浏览器本地。', 'Create projects the moment the page opens — no account, nothing sent to a server. Data stays in your browser by default.', 'ページを開いたらすぐ作成可能。アカウント不要、サーバー送信なし。データは既定でブラウザ内に保存。'],
    ['可以带走', 'Portable', '持ち運べる'],
    ['支持一键导出全部数据，换电脑或换浏览器时导入即可继续。请定期导出备份，浏览器清理数据可能导致记录丢失。', 'Export everything in one click and import it on another device or browser. Back up regularly — browser cleanup can erase records.', 'ワンクリックで全データを書き出し、別端末で読み込んで継続。ブラウザのデータ消去で失われるため定期的にバックアップを。'],
    ['开工台是独立的个人工具，与任何大模型公司或其产品没有隶属、授权或合作关系。详见 ', 'Kaigongtai is an independent personal tool, unaffiliated with, unlicensed by and unconnected to any AI company or its products. See ', '「开工台」は独立した個人ツールであり、AI企業やその製品とは一切関係ありません。詳細は'],
    ['。', '.', '。'],

    /* ---------- 应用（工作台） ---------- */
    ['新建项目', 'New project', '新規プロジェクト'],
    ['＋ 新建项目', '＋ New project', '＋ 新規プロジェクト'],
    ['从模板开始', 'Start from a template', 'テンプレートから始める'],
    ['项目名称', 'Project name', 'プロジェクト名'],
    ['最终要交付什么？（可选）', 'What will you deliver? (optional)', '最終的に何を届けますか？（任意）'],
    ['创建', 'Create', '作成'],
    ['取消', 'Cancel', 'キャンセル'],
    ['还没有项目，点上方“新建项目”开始。', 'No projects yet. Click “New project” above to start.', 'まだプロジェクトがありません。上の「新規プロジェクト」から始めましょう。'],
    ['开工台只回答一个问题：', 'Kaigongtai answers one question: ', '「开工台」が答えるのは一つだけ：'],
    ['现在接着做哪一步。', 'which step to continue right now.', '今、どの一手を続けるか。'],
    ['如果下面的项目没有下一步，先给它定一个。', 'If a project below has no next step, give it one first.', '下のプロジェクトに次の一手が無いなら、まずそれを決めましょう。'],
    ['还没有下一步', 'No next step yet', '次の手まだ'],
    ['上次进度（{date}）：{text}', 'Last update ({date}): {text}', '前回の進捗（{date}）：{text}'],
    ['还没有工作记录。', 'No work notes yet.', '作業記録はまだありません。'],
    ['打开项目', 'Open project', 'プロジェクトを開く'],
    ['这步做完了', 'Step done', 'この手を完了'],
    ['其他项目', 'Other projects', 'その他のプロジェクト'],
    ['当前没有“进行中”的项目。可以把某个项目改回进行中，或新建一个。', 'No active projects. Set one back to active, or create a new one.', '進行中のプロジェクトがありません。再開するか、新しく作りましょう。'],
    ['快速收集', 'Quick capture', 'クイックメモ'],
    ['想法、链接、临时小事，先记下来，之后再归入项目。', 'Ideas, links and little things — jot them down now, sort them later.', 'アイデア・リンク・雑事はまず記録し、後で振り分けます。'],
    ['例如：参考一下某某网站的导航布局', 'e.g.: look at how that site does navigation', '例：あのサイトのナビ構成を参考にする'],
    ['记下', 'Capture', '記録'],
    ['收集箱里有 {n} 条待整理。', '{n} items waiting in the inbox.', '収集箱に{n}件の未整理があります。'],
    ['去整理 →', 'Sort it →', '整理する →'],
    ['收集箱是空的。', 'The inbox is empty.', '収集箱は空です。'],
    ['复制为新项目', 'Copy as new project', '新規プロジェクトとして複製'],
    ['删除', 'Delete', '削除'],
    ['这个项目还没有', 'This project has no ', 'このプロジェクトにはまだ'],
    ['下一步', 'next step', '次の一手'],
    ['。定一个马上能做的动作，下次打开就能直接开工。', '. Set one concrete action you can start immediately.', 'がありません。今すぐできる具体的な一手を決めましょう。'],
    ['修改', 'Edit', '編集'],
    ['概览标签', 'Overview tab', '概要タブ'],
    ['任务', 'Tasks', 'タスク'],
    ['资料', 'References', '資料'],
    ['日志', 'Notes', '記録'],
    ['复盘', 'Review', '振り返り'],
    ['任务完成', 'Tasks done', 'タスク完了'],
    ['参考资料', 'References', '参考資料'],
    ['截止日期', 'Deadline', '締切'],
    ['项目名称', 'Project name', 'プロジェクト名'],
    ['项目目标（最终要交付什么）', 'Project goal (what you will deliver)', 'プロジェクト目標（最終的に何を届けるか）'],
    ['下一步（马上能做的一个动作）', 'Next step (one action you can start now)', '次の一手（今すぐできる具体的な行動）'],
    ['例如：发布一个能在手机上正常浏览的个人作品集', 'e.g.: publish a portfolio that works on phones', '例：スマホで快適に見られるポートフォリオを公開する'],
    ['例如：为 6 个作品各选一张封面图', 'e.g.: pick a cover image for each of the 6 works', '例：6作品それぞれのカバー画像を選ぶ'],
    ['截止日期（可选）', 'Deadline (optional)', '締切（任意）'],
    ['要做的事', 'What to do', 'やること'],
    ['阶段，如：准备', 'Phase, e.g.: prep', 'フェーズ（例：準備）'],
    ['添加', 'Add', '追加'],
    ['还没有任务。把项目按阶段拆开，例如“准备 / 制作 / 发布”。', 'No tasks yet. Split the project into phases, e.g. “prep / build / publish”.', 'タスクはまだありません。「準備/制作/公開」のようにフェーズで分けましょう。'],
    ['未分阶段', 'No phase', 'フェーズなし'],
    ['卡住了', 'Stuck', '行き詰まり'],
    ['取消卡住', 'Unmark stuck', '行き詰まり解除'],
    ['待办', 'To-do', '未着手'],
    ['进行中', 'In progress', '進行中'],
    ['完成', 'Done', '完了'],
    ['卡住', 'Stuck', '行き詰まり'],
    ['标题，例如：某作品集网站的导航布局', 'Title, e.g.: navigation layout of a portfolio site', 'タイトル（例：ポートフォリオのナビ構成）'],
    ['链接（可选）', 'Link (optional)', 'リンク（任意）'],
    ['为什么收藏 / 放在哪里（可选）', 'Why saved / where it lives (optional)', 'なぜ保存したか・どこにあるか（任意）'],
    ['添加资料', 'Add reference', '資料を追加'],
    ['还没有资料。把参考链接、图片位置、文档放在这里，并写一句“为什么收藏”。', 'No references yet. Put links, image locations and docs here, with a note on why you saved them.', '資料はまだありません。リンク・画像の場所・文書と「なぜ保存したか」をここに。'],
    ['今天做了什么？卡在哪里？', 'What did you do today? What blocked you?', '今日は何をした？どこで詰まった？'],
    ['记一笔', 'Add note', '記録'],
    ['还没有工作记录。每次做完用一两句话记下来，中断后也能马上接上。', 'No notes yet. After each session, write a line or two — you will thank yourself later.', '記録はまだありません。作業のたびに一两句残せば、中断後もすぐ再開できます。'],
    ['成果（最终交付了什么 / 链接）', 'Result (what was delivered / link)', '成果（最終的に届けたもの / リンク）'],
    ['例如：作品集网站已发布，网址是……', 'e.g.: the portfolio is live at …', '例：ポートフォリオを公開しました。URLは…'],
    ['复盘（哪些步骤实际做了？哪些没必要？下次的经验）', 'Review (what you actually did, what was unnecessary, lessons learned)', '振り返り（実際にやった手順・不要だったこと・次回の教訓）'],
    ['例如：提前定封面风格会省很多时间；下次不用做独立的联系页。', 'e.g.: deciding the cover style early saves hours; skip the standalone contact page next time.', '例：カバーの雰囲気を先に決めると時間短縮。次回は連絡専用ページは作らない。'],
    ['项目完成后，在顶部把状态改为“已完成”。它会保留在列表里，也可以“复制为新项目”作为下次的模板。', 'When done, set the status to “Done” at the top. The project stays in your list and can be copied as a template.', '完了したら上のステータスを「完了」に。リストに残るので、次回の雛形として複製もできます。'],
    ['先把想法记下来，之后再归入项目、转成任务，或者删掉。', 'Capture thoughts first; later file them into projects, turn them into tasks, or delete them.', '考えをまず記録し、後でプロジェクトへ・タスク化・削除。'],
    ['想法、链接或小事', 'An idea, link or little thing', 'アイデア・リンク・雑事'],
    ['选择项目…', 'Choose a project…', 'プロジェクトを選ぶ…'],
    ['确定删除这个项目？它的任务、资料和日志都会一起删除。建议先导出备份。', 'Delete this project? Its tasks, references and notes will be deleted too. Exporting a backup first is recommended.', 'このプロジェクトを削除しますか？タスク・資料・記録も一緒に消えます。先にバックアップを推奨。'],
    ['保存失败：浏览器存储空间不足或被禁用。请使用“导出备份”保存数据。', 'Save failed: browser storage is full or disabled. Use “Export backup” to save your data.', '保存に失敗：ブラウザの保存容量が足りないか無効です。「バックアップを書き出す」で保存してください。'],
    ['导入会覆盖当前全部数据，确定继续？建议先导出当前备份。', 'Importing overwrites all current data. Continue? Exporting a backup first is recommended.', '読み込みは現在の全データを上書きします。続行しますか？先にバックアップを推奨。'],
    ['导入完成。', 'Import complete.', '読み込みが完了しました。'],
    ['导入失败：文件格式不正确。', 'Import failed: invalid file format.', '読み込み失敗：ファイル形式が正しくありません。'],
    ['← 今天从哪继续', '← Where to continue today', '← 今日はどこから続ける'],
    ['导出备份', 'Export backup', 'バックアップを書き出す'],
    ['导入', 'Import', '読み込み'],
    ['未命名项目', 'Untitled project', '無題のプロジェクト'],
    ['未命名任务', 'Untitled task', '無題のタスク'],
    ['未命名资料', 'Untitled reference', '無題の資料'],
    ['{name}（副本）', '{name} (copy)', '{name}（コピー）'],
    ['完成下一步：{step}', 'Finished next step: {step}', '次の一手を完了：{step}'],
    [' · 有下一步', ' · has next step', ' · 次の手あり'],
    [' · 缺下一步', ' · no next step', ' · 次の手なし'],
    ['已从模板创建项目。', 'Project created from template.', 'テンプレートからプロジェクトを作成しました。'],

    /* ---------- 二级页标题 / 导语 ---------- */
    ['几分钟上手开工台', 'Get started with Kaigongtai in minutes', '「开工台」を数分で使い始める'],
    ['开工台的用法只有一句话：写清项目目标，定下下一步，每次做完记一笔。', 'One sentence says it all: write a clear goal, set the next step, log after each session.', '使い方は一言：目標を書き、次の一手を決め、やるたびに記録する。'],
    ['常见问题解答', 'Frequently asked questions', 'よくある質問'],
    ['关于账号、数据保存、浏览器兼容和内容使用的常见疑问。', 'Common questions about accounts, data storage, browsers and content use.', 'アカウント・データ保存・ブラウザ対応・コンテンツ利用について。'],
    ['关于开工台', 'About Kaigongtai', '「开工台」について'],
    ['版本记录', 'Version history', 'バージョン履歴'],
    ['开工台会持续小幅迭代。所有更新都不改变使用方式：打开就能继续。', 'Kaigongtai improves in small steps. Updates never change how you use it — open it and continue.', '「开工台」は小さく継続的に改善されます。使い方は変わりません。開いて続けるだけ。'],
    ['它适合什么样的项目？', 'What kinds of projects fit?', 'どんなプロジェクトに向く？'],
    ['一句话判断：凡是“要做几周、有明确交付物、容易半途停住”的事，都适合放进开工台。下面是六个真实用法，每个都给出目标、阶段和下一步的写法。', 'Rule of thumb: anything that takes weeks, has a clear deliverable and tends to stall halfway belongs in Kaigongtai. Here are six real uses with goal, phases and next-step examples.', '目安：数週間かかり、成果物が明確で、途中で止まりやすいものは「开工台」向き。目標・フェーズ・次の一手の例を6つ紹介します。'],
    ['不用从空白开始。', 'Never start from a blank page.', '白紙から始めなくていい。'],
    ['每个模板都是一个完整的项目结构：目标示例、阶段划分和具体任务。点「用这个模板创建项目」，开工台会生成一个可以直接编辑的项目。', 'Each template is a complete project structure: goal example, phases and concrete tasks. Click “Create project from this template” and Kaigongtai generates an editable project.', '各テンプレートは完全なプロジェクト構造（目標例・フェーズ・具体的タスク）。「このテンプレートでプロジェクトを作成」で編集可能なプロジェクトが生成されます。'],

    /* ---------- 文档页提示 ---------- */
    ['本页以下正文目前以中文为准；界面语言切换不影响正文。', 'The content below is currently available in Chinese; the language switch affects the interface only.', '以下の本文は現在中国語のみです。言語切替はインターフェースにのみ反映されます。'],

    /* ---------- 页面标题 ---------- */
    ['开工台 · 把手头的项目持续往前推进', 'Kaigongtai · Keep your projects moving', '开工台 · プロジェクトを前に進める'],
    ['开工台 · 我的工作台', 'Kaigongtai · My workspace', '开工台 · マイワークスペース'],
    ['产品概览 · 开工台', 'Product Overview · Kaigongtai', '製品概要 · 开工台'],
    ['使用帮助 · 开工台', 'How to Use · Kaigongtai', '使い方 · 开工台'],
    ['常见问题 · 开工台', 'FAQ · Kaigongtai', 'よくある質問 · 开工台'],
    ['关于本站 · 开工台', 'About · Kaigongtai', 'このサイトについて · 开工台'],
    ['更新日志 · 开工台', 'Changelog · Kaigongtai', '更新履歴 · 开工台'],
    ['使用场景 · 开工台', 'Use Cases · Kaigongtai', '活用シーン · 开工台'],
    ['模板库 · 开工台', 'Templates · Kaigongtai', 'テンプレート · 开工台'],
    ['隐私政策 · 开工台', 'Privacy Policy · Kaigongtai', 'プライバシーポリシー · 开工台'],
    ['服务条款 · 开工台', 'Terms of Service · Kaigongtai', '利用規約 · 开工台'],
    ['免责声明 · 开工台', 'Disclaimer · Kaigongtai', '免責事項 · 开工台'],

    /* ---------- 帮助页小标题 ---------- */
    ['1. 创建项目', '1. Create a project', '1. プロジェクトを作る'],
    ['2. 把任务按阶段拆开', '2. Split tasks into phases', '2. タスクをフェーズに分ける'],
    ['3. 保存参考资料', '3. Save references', '3. 参考資料を保存'],
    ['4. 记工作日志', '4. Keep work notes', '4. 作業記録をつける'],
    ['5. 用好「今天从哪继续」', '5. Use “Where to continue today”', '5. 「今日はどこから続ける」を使いこなす'],
    ['6. 收集箱怎么用', '6. Using the inbox', '6. 収集箱の使い方'],
    ['7. 完成与复盘', '7. Finish and review', '7. 完了と振り返り'],
    ['8. 导出与导入数据', '8. Export and import data', '8. データの書き出し・読み込み'],
    ['使用小建议', 'Quick tips', '使い方のコツ'],

    /* ---------- FAQ ---------- */
    ['账号与使用', 'Accounts & usage', 'アカウントと利用'],
    ['功能与限制', 'Features & limits', '機能と制限'],
    ['内容与反馈', 'Content & feedback', 'コンテンツとフィードバック'],
    ['需要注册账号吗？', 'Do I need an account?', 'アカウント登録は必要？'],
    ['我的数据保存在哪里？会被上传吗？', 'Where is my data stored? Is it uploaded?', 'データはどこに保存？アップロードされる？'],
    ['换电脑或换浏览器怎么办？', 'What if I switch devices or browsers?', '端末やブラウザを変えたら？'],
    ['清理浏览器数据会丢掉我的记录吗？', 'Can clearing browser data erase my records?', 'ブラウザのデータ消去で記録は消える？'],
    ['支持哪些浏览器？', 'Which browsers are supported?', '対応ブラウザは？'],
    ['它和普通待办清单有什么不同？', 'How is it different from a normal to-do list?', '普通のToDoリストと何が違う？'],
    ['可以多人协作吗？', 'Does it support collaboration?', '多人で共同作業できる？'],
    ['有手机 App 吗？有同步功能吗？', 'Is there a mobile app or sync?', 'スマホアプリや同期はある？'],
    ['在资料里保存的链接、图片版权归谁？', 'Who owns the links and images I save?', '資料に保存したリンクや画像の権利は？'],
    ['发现问题或有建议，怎么联系？', 'How do I report bugs or send suggestions?', '不具合や提案の連絡方法は？'],
    ['本站和 AI 公司或其产品有关系吗？', 'Is this site related to any AI company?', 'このサイトはAI企業・製品と関係ある？'],

    /* ---------- 场景 / 模板 / 关于 / 版本 ---------- */
    ['一、写作与投稿', '1. Writing & publishing', '1. 執筆・投稿'],
    ['二、插画与视觉创作', '2. Illustration & visual work', '2. イラスト・ビジュアル制作'],
    ['三、做网站或小产品', '3. Websites & small products', '3. Webサイト・小規模プロダクト'],
    ['四、备考与学习', '4. Exams & studying', '4. 試験対策・学習'],
    ['五、生活里的大动作', '5. Big life projects', '5. 生活の大型イベント'],
    ['六、长期副业与个人计划', '6. Long-term side projects', '6. 長期的な副業・個人プロジェクト'],
    ['什么时候不该用开工台', 'When NOT to use Kaigongtai', '「开工台」を使わないほうがいいとき'],
    ['个人作品集网站', 'Personal portfolio site', '個人ポートフォリオサイト'],
    ['写一篇深度长文', 'Write a long-form article', '長文記事を書く'],
    ['完成一组插画系列', 'Finish an illustration series', 'イラストシリーズを完成させる'],
    ['备考一门考试', 'Prepare for an exam', '試験対策をする'],
    ['搬家准备', 'Prepare for a move', '引っ越し準備'],
    ['没有合适的模板？', 'No template fits?', '合うテンプレートがない？'],
    ['用这个模板创建项目', 'Create project from this template', 'このテンプレートでプロジェクトを作成'],
    ['看每个场景的具体用法', 'See how each use case works', '各シーンの具体的な使い方'],
    ['看全部 5 个模板（含备考、搬家）', 'See all 5 templates (incl. exams & moving)', '全5テンプレートを見る（試験・引っ越し含む）'],
    ['完整更新记录', 'Full changelog', '完全な更新履歴'],
    ['为什么做这个', 'Why this exists', 'なぜ作ったか'],
    ['制作说明', 'How it is made', '制作ノート'],
    ['维护与联系', 'Maintenance & contact', 'メンテナンスと連絡'],
    ['排版与内容扩充', 'Typography & content upgrades', '排版とコンテンツ拡充'],
    ['第一个版本', 'First release', '最初のバージョン'],
    ['分区与多语言', 'Zoned layout & multilingual support', '分区レイアウトと多言語対応'],
    ['字体与界面翻新', 'Typography & UI refresh', 'タイポグラフィとUI刷新'],
    ['v1.3 · 2026 年 2 月', 'v1.3 · Feb 2026', 'v1.3 · 2026年2月'],
    ['v1.2 · 2026 年 2 月', 'v1.2 · Feb 2026', 'v1.2 · 2026年2月'],
    ['v1.1 · 2026 年 2 月', 'v1.1 · Feb 2026', 'v1.1 · 2026年2月'],
    ['v1.0 · 2026 年 2 月', 'v1.0 · Feb 2026', 'v1.0 · 2026年2月']
  ];

  var lang = 'zh';
  try { lang = localStorage.getItem('kg-lang') || 'zh'; } catch (e) {}
  if (lang !== 'en' && lang !== 'ja') lang = 'zh';

  var MAP = { en: {}, ja: {} };
  T.forEach(function (row) {
    if (row[1]) MAP.en[row[0]] = row[1];
    if (row[2]) MAP.ja[row[0]] = row[2];
  });

  function lookup(key) {
    if (lang === 'zh') return key;
    return MAP[lang][key] || MAP.en[key] || key;
  }

  function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }

  var NORM = { en: {}, ja: {} };
  Object.keys(MAP.en).forEach(function (k) { NORM.en[norm(k)] = MAP.en[k]; });
  Object.keys(MAP.ja).forEach(function (k) { NORM.ja[norm(k)] = MAP.ja[k]; });

  function lookupNorm(key) {
    if (lang === 'zh') return null;
    return NORM[lang][key] || NORM.en[key] || null;
  }

  /* 供 app.js 处理带占位符的复合句 */
  window.KG_t = function (key) { return lookup(key); };
  window.KG_LANG = lang;

  var ATTRS = ['placeholder', 'title', 'aria-label'];

  function walk(root) {
    if (!root || lang === 'zh') return;
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

  /* 启动：语言标记 / 页面标题 / 正文 */
  if (lang !== 'zh') {
    document.documentElement.lang = lang === 'ja' ? 'ja' : 'en';
    var titleOut = lookupNorm(norm(document.title));
    if (titleOut) document.title = titleOut;

    document.addEventListener('DOMContentLoaded', function () {
      walk(document.body);

      /* 长文档页提示 */
      if (document.querySelector('.doc')) {
        var banner = document.createElement('div');
        banner.className = 'notice';
        banner.style.margin = '0';
        banner.style.borderRadius = '0';
        banner.textContent = lookup('本页以下正文目前以中文为准；界面语言切换不影响正文。');
        var doc = document.querySelector('.doc .wrap');
        if (doc) doc.insertBefore(banner, doc.firstChild);
      }
    });
  }

  /* 语言切换按钮状态 */
  document.addEventListener('DOMContentLoaded', function () {
    var group = document.getElementById('lang-switch');
    if (!group) return;
    group.querySelectorAll('[data-lang-set]').forEach(function (btn) {
      btn.classList.toggle('on', btn.getAttribute('data-lang-set') === lang);
      btn.addEventListener('click', function () {
        try { localStorage.setItem('kg-lang', btn.getAttribute('data-lang-set')); } catch (e) {}
        location.reload();
      });
    });
  });
})();