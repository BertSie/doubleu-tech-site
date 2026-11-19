// functions/api/contact.js — Cloudflare Pages Function：處理聯絡表單 POST /api/contact
//
// 表單流程：瀏覽器 → /api/contact → 伺服器端驗證 Turnstile → 轉送 Google Form
// 必須在 Cloudflare 設定 Secret：TURNSTILE_SECRET_KEY
//   (Cloudflare Dashboard → Workers & Pages → 此專案 → Settings → Variables and Secrets，設定後要重新部署)
// 必須在 Cloudflare 設定 Secret：GOOGLE_FORM_URL — Google Form 的網址 (填寫頁或預先填入連結皆可)
//   表單網址只存在 Cloudflare，不寫在公開程式碼裡，機器人就無法繞過網站直接灌 Google Form

// 暫用：尚未設定 GOOGLE_FORM_URL 時，先送到舊表單，避免聯絡表單中斷。
// 新表單網址設進 Cloudflare 後，刪掉這個常數和下方的 fallback。
const LEGACY_GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSffelARBEmcZqGrMwYvy4R2h3z-vUEoq-bb9_Pmozz7n_GLGg/formResponse';

// 把任何 Google Form 網址 (viewform / 預先填入連結 / formResponse) 轉成送出用的 formResponse 網址
function toFormResponseUrl(url) {
    const match = String(url || '').match(/\/forms\/(?:u\/\d+\/)?d\/e\/([A-Za-z0-9_-]+)/);
    return match ? `https://docs.google.com/forms/d/e/${match[1]}/formResponse` : null;
}

// 網站欄位 → Google Form 欄位 ID
const FORM_FIELDS = {
    name: 'entry.685019771',
    email: 'entry.98934424',
    subject: 'entry.1262646125',
    message: 'entry.512682809'
};

const MAX_LENGTH = { name: 200, email: 200, subject: 300, message: 5000 };

export async function onRequestPost(context) {
    return handleContact(context.request, context.env);
}

async function handleContact(request, env) {
    let form;
    try {
        form = await request.formData();
    } catch {
        return json({ ok: false, error: 'Invalid request.' }, 400);
    }

    // --- Honeypot：機器人填了隱藏欄位 → 假裝成功，但不轉送 ---
    if (String(form.get('b_website') || '').trim() !== '') {
        return json({ ok: true });
    }

    // --- 欄位檢查 ---
    const values = {};
    for (const key of Object.keys(FORM_FIELDS)) {
        const value = String(form.get(key) || '').trim();
        if (!value || value.length > MAX_LENGTH[key]) {
            return json({ ok: false, error: 'Please fill in all fields.' }, 400);
        }
        values[key] = value;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        return json({ ok: false, error: 'Please enter a valid email address.' }, 400);
    }

    // --- 伺服器設定檢查 ---
    const formResponseUrl = toFormResponseUrl(env.GOOGLE_FORM_URL || LEGACY_GOOGLE_FORM_URL);
    if (!env.TURNSTILE_SECRET_KEY || !formResponseUrl) {
        console.error('TURNSTILE_SECRET_KEY or GOOGLE_FORM_URL is missing or invalid');
        return json({ ok: false, error: 'The contact form is temporarily unavailable. Please try again later.' }, 500);
    }

    // --- Turnstile 伺服器端驗證 ---

    const token = String(form.get('cf-turnstile-response') || '');
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: new URLSearchParams({
            secret: env.TURNSTILE_SECRET_KEY,
            response: token,
            remoteip: request.headers.get('CF-Connecting-IP') || ''
        })
    });
    const outcome = await verifyRes.json().catch(() => ({ success: false }));
    if (!outcome.success) {
        console.error('Turnstile verification failed', outcome['error-codes']);
        return json({ ok: false, error: 'Security verification failed. Please try again.' }, 403);
    }

    // --- 轉送 Google Form ---
    const body = new URLSearchParams();
    for (const [key, entryId] of Object.entries(FORM_FIELDS)) {
        body.set(entryId, values[key]);
    }

    try {
        const googleRes = await fetch(formResponseUrl, { method: 'POST', body, redirect: 'manual' });
        if (googleRes.status >= 400) {
            console.error('Google Form responded with', googleRes.status);
            return json({ ok: false, error: 'Sorry, your message could not be sent. Please try again later.' }, 502);
        }
    } catch (err) {
        console.error('Google Form request failed', err);
        return json({ ok: false, error: 'Sorry, your message could not be sent. Please try again later.' }, 502);
    }

    return json({ ok: true });
}

function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
    });
}
