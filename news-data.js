// news-data.js

// 這裡是所有新聞的資料庫
const newsData = [
    {
        title: "AlixLabs to Demonstrate APS™ on 300mm UMC Wafers",
        date: "APRIL 2025",
        desc: "Demonstration at the 2025 CMC Conference.",
        link: "https://www.alixlabs.com/", // 替換成實際連結
        imgText: "ALIXLABS & UMC",
        imgColor: "#cc272f"
    },
    {
        title: "KULR Awarded $6.7M by Texas Space Commission",
        date: "APRIL 2025",
        desc: "Funding to advance the cold temperature battery platform.",
        link: "https://kulr.ai/", // 替換成實際連結
        imgText: "KULR Awarded $6.7M",
        imgColor: "linear-gradient(135deg,#1073a4,#E0C7F0)"
    },
    {
        title: "Beammwave and Alpha Networks Agreement",
        date: "NOV 2024",
        desc: "Joint pre-study for next-generation Fixed Wireless Access.",
        link: "https://beammwave.com/", // 替換成實際連結
        imgText: "BEAMMWAVE & ALPHA",
        imgColor: "#812b77"
    }
    // 未來要新增新聞，只要複製上面的格式，貼在這裡即可
];

// 渲染新聞的函式
function renderNews(containerId, limit) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let htmlContent = "";
    
    // 決定要顯示幾篇 (如果有設定 limit 就只顯示前幾篇，沒有就顯示全部)
    const displayData = limit ? newsData.slice(0, limit) : newsData;

    displayData.forEach(item => {
        htmlContent += `
            <a href="${item.link}" target="_blank" class="insight-card">
                <div class="insight-img" style="background:${item.imgColor};"><span>${item.imgText}</span></div>
                <div class="insight-body">
                    <span class="insight-date">${item.date}</span>
                    <h4 class="insight-title">${item.title}</h4>
                    <p class="insight-desc">${item.desc}</p>
                    <span class="read-more-btn">Read Article &rarr;</span>
                </div>
            </a>
        `;
    });

    container.innerHTML = htmlContent;
}
