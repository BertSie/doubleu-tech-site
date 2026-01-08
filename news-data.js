// news-data.js

// --- 這裡是新聞資料設定區 (由新到舊排列) ---
const newsData = [
    {
        title: "AlixLabs to Demonstrate APS™ on 300mm UMC Wafers",
        date: "APRIL 2025",
        desc: "Demonstration at the 2025 CMC Conference.",
        link: "https://www.alixlabs.com/2025/04/10/alixlabs-to-demonstrate-aps-on-300-millimeter-umc-wafers-at-the-2025-cmc-conference/",
        imgText: "ALIXLABS & UMC",
        imgStyle: "background:#cc272f;", // 這裡設定圖片背景色
        isExternal: true // 是否為外部連結 (會開新視窗)
    },
    {
        title: "KULR Awarded $6.7M by Texas Space Commission",
        date: "APRIL 2025",
        desc: "Funding to advance the cold temperature battery platform.",
        link: "https://kulr.ai/kulr-awarded-6-7m-by-texas-space-commission-to-advance-cold-temperature-kulr-one-space-battery-platform/",
        imgText: "KULR Awarded $6.7M",
        imgStyle: "background:linear-gradient(135deg,#1073a4,#E0C7F0);",
        isExternal: true
    },
    {
        title: "Beammwave and Alpha Networks Agreement",
        date: "NOV 2024",
        desc: "Joint pre-study for next-generation Fixed Wireless Access products.",
        link: "https://beammwave.com/press-release/beammwave-and-alpha-networks-enters-into-an-agreement-to-do-a-joint-pre-study-for-the-next-generation-fixed-wireless-access-products/",
        imgText: "BEAMMWAVE & ALPHA",
        imgStyle: "background:#812b77;",
        isExternal: true
    },
    // 下面這個是 "Coming Soon" 的特殊卡片
    {
        title: "Future Strategic Initiatives",
        date: "IN THE PIPELINE",
        desc: "We are actively cultivating new partnerships across semiconductor and IoT value chains.",
        link: "#", 
        imgText: "COMING SOON",
        imgStyle: "background:#eee; color:#999;",
        isExternal: false,
        isDisabled: true // 特殊標記：讓這張卡片不能點擊
    }
];

// --- 這是產生 HTML 的程式邏輯 (不需要修改) ---
function renderNews(containerId, limit) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let htmlContent = "";
    
    // 如果有設定 limit (例如首頁 limit=3)，就過濾掉 "Coming Soon" (isDisabled) 的卡片，只顯示最新的新聞
    // 如果沒有 limit (Insights 頁面)，就顯示全部
    let displayData = newsData;

    if (limit) {
        // 首頁模式：過濾掉 disabled 的項目，只取前幾篇
        displayData = newsData.filter(item => !item.isDisabled).slice(0, limit);
    }

    displayData.forEach(item => {
        // 判斷是否為特殊卡片 (Coming Soon)
        const customStyle = item.isDisabled ? 'cursor: default; opacity: 0.8;' : '';
        const targetAttr = item.isExternal ? 'target="_blank"' : '';
        const btnText = item.isDisabled ? '' : '<span class="read-more-btn">Read Article &rarr;</span>';
        
        // 生成 HTML
        // 注意：如果是 Disabled，我們把 href 拿掉或設為 javascript:void(0)
        const hrefAttr = item.isDisabled ? '' : `href="${item.link}"`;
        const tagType = item.isDisabled ? 'div' : 'a'; // 如果不能點，就用 div，可以點就用 a

        htmlContent += `
            <${tagType} ${hrefAttr} ${targetAttr} class="insight-card" style="${customStyle}">
                <div class="insight-img" style="${item.imgStyle}"><span>${item.imgText}</span></div>
                <div class="insight-body">
                    <span class="insight-date">${item.date}</span>
                    <h4 class="insight-title">${item.title}</h4>
                    <p class="insight-desc">${item.desc}</p>
                    ${btnText}
                </div>
            </${tagType}>
        `;
    });

    container.innerHTML = htmlContent;
}
