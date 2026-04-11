// SPDX-License-Identifier: GPL-3.0-or-later
(() => {
    const COPY_ICON_SRC = '/ico/article/copy.svg';
    const CHECK_ICON_SRC = '/ico/article/check.svg';
    let initialized = false;

    // 预热图标，避免首次切换时出现加载延迟
    const preloadCopyIcon = new Image();
    preloadCopyIcon.src = COPY_ICON_SRC;
    const preloadCheckIcon = new Image();
    preloadCheckIcon.src = CHECK_ICON_SRC;

    const copyTextWithFallback = async (text) => {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return;
        }

        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.top = '-9999px';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        const success = document.execCommand('copy');
        document.body.removeChild(textarea);

        if (!success) {
            throw new Error('copy_failed');
        }
    };

    const initCodeHeaders = () => {
        if (initialized) {
            return;
        }

        // 获取全部代码块
        const highlights = document.querySelectorAll('.article-content figure.highlight');
        if (!highlights.length) {
            return;
        }

        initialized = true;

        highlights.forEach(figure => {
            if (figure.querySelector('.code-header')) {
                return;
            }

        // 提取language
        let language = figure.getAttribute('class').split(' ');
        let langName = 'Code';

        language.forEach(lang => {

            if (lang !== 'highlight') {
                langName = lang.replace('language-',''); // 没有toUpperCase()
            
            }
        });

        // 创建代码块header
        const header = document.createElement('div');
        header.className = 'code-header';

        header.innerHTML = `
            <div class="code-lang">
                ${langName}
            </div>
            <div class="code-header-spacer">|</div>
            <button type="button" class="code-copy" aria-label="Copy code">
                <img src="${COPY_ICON_SRC}" alt="Copy" class="copy-icon no-lazy no-title">
            </button>
        `;

        figure.insertBefore(header, figure.firstChild);

        // 复制功能
        const copyBtn = header.querySelector('.code-copy');
        const copyIcon = copyBtn.querySelector('.copy-icon');

        const setCopiedIcon = () => {
            if (!copyIcon) {
                return;
            }

            copyIcon.src = CHECK_ICON_SRC;
            copyIcon.alt = 'Copied';
            setTimeout(() => {
                copyIcon.src = COPY_ICON_SRC;
                copyIcon.alt = 'Copy';
            }, 2000);
        };

        const handleCopy = async (event) => {
            event.preventDefault();
            if (copyBtn.dataset.copying === '1') {
                return;
            }

            const codeContainer = figure.querySelector('td.code') || figure.querySelector('pre');
            if (!codeContainer) {
                return;
            }
            const codeText = codeContainer.textContent || '';

            try {
                copyBtn.dataset.copying = '1';
                await copyTextWithFallback(codeText);
                setCopiedIcon();
            } catch (error) {
                console.warn('Copy failed:', error);
            } finally {
                copyBtn.dataset.copying = '0';
            }
        };

        if ('PointerEvent' in window) {
            copyBtn.addEventListener('pointerup', handleCopy);
        } else {
            copyBtn.addEventListener('click', handleCopy);
        }



        });
    };

    const tryInitCodeHeaders = () => {
        // iOS 在复杂页面里 DOMContentLoaded 可能偏晚，先尝试立即注入
        initCodeHeaders();
    };

    tryInitCodeHeaders();

    if (!initialized) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', tryInitCodeHeaders, { once: true });
        } else {
            requestAnimationFrame(tryInitCodeHeaders);
        }
    }

    // iOS 从 bfcache 恢复时，确保 header 存在
    window.addEventListener('pageshow', tryInitCodeHeaders);
})();