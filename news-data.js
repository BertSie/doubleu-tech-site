// news-data.js

// --- 這裡是新聞資料設定區 (由新到舊排列) ---
const newsData = [
    {
        title: "AOI Awarded $20.9M Texas Semiconductor Innovation Fund Grant",
        date: "APRIL 2026",
        desc: "Grant to advance semiconductor manufacturing in Sugar Land, Texas.",
        link: "https://investors.ao-inc.com/news-releases/news-release-details/aoi-awarded-209m-texas-semiconductor-innovation-fund-grant",
        imgText: "AOI & TEXAS GRANT",
        imgStyle: "background: linear-gradient(135deg, #003366, #0066cc);", // 科技感藍色漸層
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

// --- 這是產生 HTML 的程式邏輯 (不需要修改) ---
// ... 保持原本檔案下方的 renderNews 函數內容不變 ...
