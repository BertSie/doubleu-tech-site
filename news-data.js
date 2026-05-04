// news-data.js

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

function renderNews(containerId, limit = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let htmlContent = "";
    // 如果有 limit (首頁)，過濾掉 isDisabled；如果是全部 (Insights 頁)，顯示全部
    let displayData = limit ? newsData.filter(item => !item.isDisabled).slice(0, limit) : newsData;

    displayData.forEach(item => {
        const targetAttr = item.isExternal ? 'target="_blank"' : '';
        const hrefAttr = item.isDisabled ? 'javascript:void(0)' : `href="${item.link}"`;
        const tagType = item.isDisabled ? 'div' : 'a';
        const btnText = item.isDisabled ? '' : '<span class="read-more-btn">Read Article &rarr;</span>';

        htmlContent += `
            <${tagType} ${hrefAttr} ${targetAttr} class="insight-card">
                <div class="insight-img" style="${item.imgStyle}"><span>${item.imgText}</span></div>
                <div class="insight-body">
                    <span class="insight-date">${item.date}</span>
                    <h3 class="insight-title">${item.title}</h3>
                    <p class="insight-desc">${item.desc}</p>
                    ${btnText}
                </div>
            </${tagType}>
        `;
    });

    container.innerHTML = htmlContent;
}
