// news-data.js

const newsData = [
    {
        title: "HEVO Unveils Strategy-Asia Supply Chain",
        date: "May 2026",
        desc: "HEVO Unveils Strategy for Commercial Electric Fleets and Advances Toward Scalable Production",
        link: "https://www.prnewswire.com/news-releases/hevo-unveils-wireless-charging-strategy-for-commercial-electric-fleets-and-advances-toward-scalable-production-302761538.html",
        imgText: "HEVO Unveils Strategy-Asia Supply Chain",
        imgStyle: "background: linear-gradient(131deg, #1083a4, #0266cc);",
        isExternal: true
    },
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
function renderNews(containerId, limit = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let htmlContent = "";
    
    // 邏輯：首頁只顯示非 disabled 的前 3 則；Insights 頁面則顯示全部。
    let displayData = limit ? newsData.filter(item => !item.isDisabled).slice(0, limit) : newsData;

    displayData.forEach(item => {
        const isExternal = item.isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
        
        // 判斷是否為不可點擊狀態
        if (item.isDisabled) {
            htmlContent += `
                <div class="insight-card" style="cursor: default; opacity: 0.8;">
                    <div class="insight-img" style="${item.imgStyle}"><span>${item.imgText}</span></div>
                    <div class="insight-body">
                        <span style="font-size: 12px; color: var(--text-light); text-transform: uppercase; font-weight: 600;">${item.date}</span>
                        <h3 class="insight-title">${item.title}</h3>
                        <p class="insight-desc">${item.desc}</p>
                    </div>
                </div>
            `;
        } else {
            htmlContent += `
                <a href="${item.link}" ${isExternal} class="insight-card">
                    <div class="insight-img" style="${item.imgStyle}"><span>${item.imgText}</span></div>
                    <div class="insight-body">
                        <span style="font-size: 12px; color: var(--text-light); text-transform: uppercase; font-weight: 600;">${item.date}</span>
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
