// functions/api/contact.js — Cloudflare Pages Function：處理聯絡表單 POST /api/contact
//
// 表單流程：瀏覽器 → /api/contact → 伺服器端驗證 Turnstile → 轉送 Google Form
// 必須在 Cloudflare 設定 Secret：TURNSTILE_SECRET_KEY
//   (Cloudflare Dashboard → Workers & Pages → 此專案 → Settings → Variables and Secrets，設定後要重新部署)
// 選用 Secret：GOOGLE_FORM_URL — 換成新的 Google Form 時填入，就不必把表單網址寫在公開程式碼裡

const DEFAULT_GOOGLE_FORM_URL = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSffelARBEmcZqGrMwYvy4R2h3z-vUEoq-bb9_Pmozz7n_GLGg/formResponse';

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

// worker.js 也共用這個函式
export async function handleContact(request, env) {
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

    // --- Turnstile 伺服器端驗證 ---
    if (!env.TURNSTILE_SECRET_KEY) {
        console.error('TURNSTILE_SECRET_KEY is not set');
        return json({ ok: false, error: 'The contact form is temporarily unavailable. Please try again later.' }, 500);
    }

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
        const googleRes = await fetch(env.GOOGLE_FORM_URL || DEFAULT_GOOGLE_FORM_URL, { method: 'POST', body, redirect: 'manual' });
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
