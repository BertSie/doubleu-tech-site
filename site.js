// site.js — 全站共用：手機選單、團隊彈窗、聯絡表單

(function () {
    // --- 動態內容：新聞 (news-data.js) 與觀點文章 (perspectives-data.js) ---
    // 放在這裡而不是寫在 HTML 裡，讓 Content-Security-Policy 可以禁止所有行內腳本
    if (typeof renderNews === 'function') {
        renderNews('home-news-container', 3);
        renderNews('page-news-container');
    }
    if (typeof renderPerspectives === 'function') {
        renderPerspectives('perspectives-container');
    }
    if (typeof renderArticle === 'function' && document.getElementById('article-body')) {
        renderArticle();
    }

    // --- 手機選單 ---
    const toggle = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (toggle && navMenu) {
        const setMenuOpen = (open) => {
            navMenu.classList.toggle('active', open);
            toggle.setAttribute('aria-expanded', String(open));
        };
        toggle.addEventListener('click', () => setMenuOpen(!navMenu.classList.contains('active')));
        // 點選連結後自動收起選單
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setMenuOpen(false));
        });
        // 點選單外面或按 Esc 也收起
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !toggle.contains(e.target)) setMenuOpen(false);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                setMenuOpen(false);
                toggle.focus();
            }
        });
    }

    // --- 團隊彈窗 (About 頁) ---
    let lastFocused = null;

    function openModal(modal) {
        lastFocused = document.activeElement;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // 禁止背景滾動
        modal.querySelector('.close').focus();
    }

    function closeModal(modal) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // 恢復背景滾動
        if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll('[data-modal]').forEach(trigger => {
        const modal = document.getElementById(trigger.dataset.modal);
        if (!modal) return;
        trigger.addEventListener('click', () => openModal(modal));
        // 鍵盤 Enter / 空白鍵也能開啟
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(modal);
            }
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        // 點擊外部或 × 關閉
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.closest('.close')) closeModal(modal);
        });
    });

    // Esc 關閉；Tab 鍵只在彈窗內循環
    document.addEventListener('keydown', (e) => {
        const openOne = document.querySelector('.modal.open');
        if (!openOne) return;
        if (e.key === 'Escape') {
            closeModal(openOne);
            return;
        }
        if (e.key === 'Tab') {
            const focusables = openOne.querySelectorAll('button, a[href]');
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    // --- 聯絡表單 (首頁) ---
    // 送到 /api/contact，由 functions/api/contact.js 在伺服器端驗證 Turnstile 後再轉送 Google Form
    const form = document.getElementById('contactForm');
    if (!form) return;

    const submitBtn = document.getElementById('submitBtn');
    const status = document.getElementById('formStatus');
    const btnLabel = submitBtn.textContent;

    function showStatus(message, type) {
        status.textContent = message;
        status.className = 'form-status form-full' + (type ? ' ' + type : '');
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = new FormData(form);
        if (!data.get('cf-turnstile-response')) {
            showStatus('Please complete the security verification.', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        showStatus('', '');

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });
            const result = await res.json().catch(() => ({}));

            if (res.ok && result.ok) {
                form.reset();
                showStatus('Thank you! Your message has been sent. We will get back to you shortly.', 'success');
            } else {
                showStatus(result.error || 'Sorry, your message could not be sent. Please try again later.', 'error');
            }
        } catch (err) {
            showStatus('Network error. Please check your connection and try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = btnLabel;
            // Turnstile token 只能用一次，送出後重置
            if (window.turnstile) window.turnstile.reset();
        }
    });
})();
