// news-data.js — 首頁與 Insights 頁「News」新聞卡片的資料
//
// ===== 欄位說明 =====
// title       標題
// date        顯示日期 (例如 'DEC 2026')；新的放最上面
// desc        一句話摘要
// link        原始新聞稿網址 (外部連結)；沒有就寫 '#'
// isExternal  link 是外部網址時填 true
// 卡片上方的圖 (二選一)：
//   image     照片路徑，例如 'assets/images/news/2026-12-example/cover.jpg' (建議 1200×630)
//   imageAlt  照片說明 (給看不到圖的人與 Google)
//   或 imgText + imgStyle  沒有照片時顯示的文字色塊
// 若要把整篇新聞稿放在自己網站上 (選填)：
//   slug      網址代號，英文小寫、數字和 -，網址會是 perspective.html?n=這個代號
//   body      內文，寫法和 perspectives-data.js 一樣 (Markdown)
//             內文插圖：獨立一行寫 ![圖片說明](assets/images/news/資料夾/圖檔.jpg)
//   有 body 時卡片會連到站內頁面，頁尾自動附上 link 原文連結。
//
// 草稿與範本放在 Google 雲端硬碟「網站投稿」資料夾，詳見裡面的「使用說明.md」。

const newsData = [

    {
        title: "AOI Awarded $20.9M Texas Semiconductor Innovation Fund Grant",
        date: "APRIL 2026",
        desc: "Grant to advance semiconductor manufacturing in Sugar Land, Texas.",
        link: "https://investors.ao-inc.com/news-releases/news-release-details/aoi-awarded-209m-texas-semiconductor-innovation-fund-grant",
        imgText: "AOI Awarded $20.9M From TSIF",
        imgStyle: "background: linear-gradient(135deg, #003366, #0066cc);",
        isExternal: true
    },
    {
        title: "AlixLabs to Demonstrate APS™ on 300mm UMC Wafers",
        date: "APRIL 2025",
        desc: "Demonstration at the 2025 CMC Conference.",
        link: "https://www.alixlabs.com/2025/04/10/alixlabs-to-demonstrate-aps-on-300-millimeter-umc-wafers-at-the-2025-cmc-conference/",
        imgText: "ALIXLABS & UMC",
        imgStyle: "background:#cc272f;",
        isExternal: true
    },
    {
        title: "KULR Awarded $6.7M by Texas Space Commission",
        date: "APRIL 2025",
        desc: "Funding to advance the cold temperature battery platform.",
        link: "https://kulr.ai/kulr-awarded-6-7m-by-texas-space-commission-to-advance-cold-temperature-kulr-one-space-battery-platform/",
        imgText: "KULR Awarded $6.7M from TSC",
        imgStyle: "background:linear-gradient(135deg,#1073a4,#E0C7F0);",
        isExternal: true
    },
    {
        title: "Beammwave and Alpha Networks Agreement",
        date: "NOV 2024",
        desc: "Joint pre-study for next-generation Fixed Wireless Access products.",
        link: "https://beammwave.com/press-release/beammwave-and-alpha-networks-enters-into-an-agreement-to-do-a-joint-pre-study-for-the-next-generation-fixed-wireless-access-products/",
        imgText: "BEAMMWAVE & ALPHANETWORKS",
        imgStyle: "background:#812b77;",
        isExternal: true
    },
    {
        title: "Future Strategic Initiatives",
        date: "IN THE PIPELINE",
        desc: "We are actively cultivating new partnerships across semiconductor and IoT value chains.",
        link: "#", 
        imgText: "COMING SOON",
        imgStyle: "background:#eee; color:#999;",
        isExternal: false,
        isDisabled: true 
    }
];

/**
 * 渲染新聞卡片
 * @param {string} containerId - 容器的 ID (例如 'home-news-container' 或 'all-news-container')
 * @param {number} limit - 顯示數量 (null 則顯示全部)
 */
function newsEsc(str) {
    return String(str == null ? '' : str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// 卡片上方：有照片用照片，沒有就用文字色塊
function newsVisual(item) {
    if (item.image) {
        return `<div class="insight-img has-photo"><img src="${newsEsc(item.image)}" alt="${newsEsc(item.imageAlt || item.title)}" loading="lazy"></div>`;
    }
    return `<div class="insight-img" style="${item.imgStyle || ''}"><span>${item.imgText || ''}</span></div>`;
}

function renderNews(containerId, limit = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let htmlContent = "";

    // 邏輯：首頁只顯示非 disabled 的前 3 則；Insights 頁面則顯示全部。
    let displayData = limit ? newsData.filter(item => !item.isDisabled).slice(0, limit) : newsData;

    displayData.forEach(item => {
        // 有站內全文 (slug + body) 就連到站內頁面，否則連到原始新聞稿
        const onSite = item.slug && item.body;
        const href = onSite ? `perspective.html?n=${encodeURIComponent(item.slug)}` : item.link;
        const isExternal = !onSite && item.isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';

        // 判斷是否為不可點擊狀態
        if (item.isDisabled) {
            htmlContent += `
                <div class="insight-card" style="cursor: default; opacity: 0.8;">
                    ${newsVisual(item)}
                    <div class="insight-body">
                        <span class="insight-date">${item.date}</span>
                        <h3 class="insight-title">${item.title}</h3>
                        <p class="insight-desc">${item.desc}</p>
                    </div>
                </div>
            `;
        } else {
            htmlContent += `
                <a href="${newsEsc(href)}" ${isExternal} class="insight-card">
                    ${newsVisual(item)}
                    <div class="insight-body">
                        <span class="insight-date">${item.date}</span>
                        <h3 class="insight-title">${item.title}</h3>
                        <p class="insight-desc">${item.desc}</p>
                        <span class="read-more-btn">Read Article &rarr;</span>
                    </div>
                </a>
            `;
        }
    });

    container.innerHTML = htmlContent;
}
