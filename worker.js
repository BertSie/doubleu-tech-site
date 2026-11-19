// worker.js — 若改用 Cloudflare Workers 部署時的入口：提供靜態網站，並處理聯絡表單 /api/contact
//
// 目前網站部署在 Cloudflare Pages，Pages 會直接使用 functions/api/contact.js，不會執行這個檔案。
// 表單邏輯集中在 functions/api/contact.js，兩種部署方式共用。

import { handleContact } from './functions/api/contact.js';

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === '/api/contact') {
            if (request.method !== 'POST') {
                return new Response(JSON.stringify({ ok: false, error: 'Method not allowed.' }), {
                    status: 405,
                    headers: { 'Content-Type': 'application/json; charset=utf-8' }
                });
            }
            return handleContact(request, env);
        }

        // 其他路徑交給靜態檔案 (找不到時回傳 404.html)
        return env.ASSETS.fetch(request);
    }
};
