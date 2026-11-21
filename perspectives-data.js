// perspectives-data.js — Insights 頁「Perspectives 觀點文章」的資料
//
// ===== 如何新增一篇文章 =====
// 1. 複製下面「範本」那一段 { ... }，貼到 perspectivesData 陣列的最上面 (新文章放最前面)
// 2. 填寫欄位：
//    slug       文章網址代號，只能用英文小寫、數字和 - (例如 'taiwan-odm-supply-chain')
//               文章網址會是 perspective.html?a=這個代號
//    title      標題
//    date       發布日期，格式 'YYYY-MM-DD'
//    category   分類 (例如 'Market Entry'、'Trade Shows'、'Semiconductor')
//    author     作者
//    summary    一到兩句摘要 (會顯示在列表卡片和 Google 搜尋結果)
//    published  true = 公開；false = 草稿，網站上看不到
//    body       內文，用簡單的 Markdown 寫：
//                 ## 大標題        ### 小標題
//                 - 項目符號       1. 編號清單
//                 **粗體**         *斜體*
//                 [連結文字](https://網址)
//                 ![圖片說明](assets/images/perspectives/圖片檔名.jpg)
//                 > 引言
//               段落之間空一行。內文前後的 ` 符號不要刪掉，內文裡也不要用 ` 這個符號。
// 3. 存檔後上傳到 GitHub，網站就會自動更新
//
// ===== 範本 (複製這段) =====
// {
//     slug: 'your-article-slug',
//     title: 'Your Article Title',
//     date: '2026-12-01',
//     category: 'Market Entry',
//     author: 'Bert Sie',
//     summary: 'One or two sentences about what readers will learn.',
//     published: true,
//     body: `
// ## First heading
//
// Your first paragraph.
//
// - First point
// - Second point
// `
// },

const perspectivesData = [
    // 新文章貼在這裡
];

// ---------- 以下為顯示用程式，一般不需要修改 ----------

function getPublishedPerspectives() {
    return perspectivesData
        .filter(item => item.published !== false)
        .sort((a, b) => b.date.localeCompare(a.date));
}

function formatPerspectiveDate(dateStr) {
    const [y, m] = dateStr.split('-').map(Number);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[m - 1]} ${y}`;
}

function readingMinutes(text) {
    return Math.max(1, Math.round(text.trim().split(/\s+/).length / 220));
}

function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// 只允許 http(s)、mailto 和站內相對路徑，避免 javascript: 之類的連結
function safeUrl(url) {
    return /^(https?:\/\/|mailto:|\/|\.\/|assets\/|[a-z0-9-]+\.html)/i.test(url) ? url : '#';
}

// 簡易 Markdown → HTML
function markdownToHtml(md) {
    const inline = (s) => escapeHtml(s)
        .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, src) => `<img src="${safeUrl(src)}" alt="${alt}" loading="lazy">`)
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, text, href) => {
            const url = safeUrl(href);
            const external = /^https?:\/\//i.test(url);
            return `<a href="${url}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`;
        })
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');

    let html = '';
    let para = [];
    let list = null;

    const flushPara = () => {
        if (para.length) { html += `<p>${inline(para.join(' '))}</p>`; para = []; }
    };
    const closeList = () => {
        if (list) { html += `</${list}>`; list = null; }
    };

    for (const raw of md.replace(/\r/g, '').trim().split('\n')) {
        const line = raw.trim();
        let m;

        if (!line) { flushPara(); closeList(); continue; }

        if ((m = line.match(/^(#{2,3})\s+(.*)/))) {
            flushPara(); closeList();
            const tag = m[1].length === 2 ? 'h2' : 'h3';
            html += `<${tag}>${inline(m[2])}</${tag}>`;
            continue;
        }

        if ((m = line.match(/^>\s?(.*)/))) {
            flushPara(); closeList();
            html += `<blockquote>${inline(m[1])}</blockquote>`;
            continue;
        }

        const ul = line.match(/^[-*]\s+(.*)/);
        const ol = line.match(/^\d+\.\s+(.*)/);
        if (ul || ol) {
            flushPara();
            const type = ul ? 'ul' : 'ol';
            if (list !== type) { closeList(); html += `<${type}>`; list = type; }
            html += `<li>${inline((ul || ol)[1])}</li>`;
            continue;
        }

        closeList();
        para.push(line);
    }
    flushPara();
    closeList();
    return html;
}

// Insights 頁：文章卡片列表
function renderPerspectives(containerId, limit = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let items = getPublishedPerspectives();
    if (limit) items = items.slice(0, limit);

    if (!items.length) {
        container.innerHTML = `
            <div class="persp-empty">
                <strong>First article coming soon</strong>
                Practical perspectives on entering Taiwan's tech supply chain — published monthly.
            </div>`;
        return;
    }

    container.innerHTML = '<div class="persp-grid">' + items.map(item => `
        <a href="perspective.html?a=${encodeURIComponent(item.slug)}" class="persp-card">
            <div class="persp-meta">${escapeHtml(item.category)} <span>· ${formatPerspectiveDate(item.date)}</span></div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.summary)}</p>
            <span class="read-more-btn">Read article &rarr;</span>
        </a>`).join('') + '</div>';
}

// 文章頁：依網址 ?a=slug 顯示文章
function renderArticle() {
    const slug = new URLSearchParams(location.search).get('a');
    const item = getPublishedPerspectives().find(p => p.slug === slug);
    const hero = document.getElementById('article-hero');
    const body = document.getElementById('article-body');

    if (!item) {
        document.title = 'Article not found | Double U';
        hero.innerHTML = `
            <span class="sub-title">Perspectives</span>
            <h1>Article not found</h1>
            <p class="summary">This article may have moved. <a href="insights.html#perspectives" class="read-more-btn">See all perspectives &rarr;</a></p>`;
        body.innerHTML = '';
        return;
    }

    document.title = `${item.title} | Double U Perspectives`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', item.summary);

    hero.innerHTML = `
        <a href="insights.html#perspectives" class="read-more-btn">&larr; All perspectives</a>
        <div class="persp-meta" style="margin-top: 25px;">${escapeHtml(item.category)} <span>· ${formatPerspectiveDate(item.date)}</span></div>
        <h1>${escapeHtml(item.title)}</h1>
        <p class="summary">${escapeHtml(item.summary)}</p>
        <p class="article-byline">By <strong>${escapeHtml(item.author || 'Double U')}</strong> · ${readingMinutes(item.body)} min read</p>`;
    body.innerHTML = markdownToHtml(item.body);
}
