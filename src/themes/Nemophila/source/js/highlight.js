document.addEventListener('DOMContentLoaded', ()=>{

    // 获取全部代码块
    const highlights = document.querySelectorAll('.article-content figure.highlight');

    highlights.forEach(figure => {

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
            <div class="code-copy">
                <img src="/ico/article/copy.svg" alt="Copy" class="copy-icon no-lazy no-title">
            </div>
        `;

        figure.insertBefore(header, figure.firstChild);

        // 复制功能
        const copyBtn = header.querySelector('.code-copy');
        copyBtn.addEventListener('click', () => {
            const codeContainer = figure.querySelector('td.code') || figure.querySelector('pre');
            const codeText = codeContainer.innerText;

            // 反馈
            navigator.clipboard.writeText(codeText).then(() => {

                copyBtn.innerHTML = '<img src="/ico/article/check.svg" alt="Copied" class="copy-icon no-lazy no-title">';

                setTimeout(() => {
                    copyBtn.innerHTML = '<img src="/ico/article/copy.svg" alt="Copy" class="copy-icon no-lazy no-title">';
                }, 2000);

            });
        
        });



    });



});