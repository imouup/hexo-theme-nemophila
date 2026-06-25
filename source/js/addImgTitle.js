// SPDX-License-Identifier: GPL-3.0-or-later
document.addEventListener('DOMContentLoaded', () => {

    let images = document.querySelectorAll('.article-content img');

    // Markdown 渲染器可能会把连续的图片行输出成同一个 <p>，里面包含
    // <img>、<br>、空白文本，以及下一个 <img>。如果之后直接把图片包成
    // <figure>，就会得到非法结构：<p><figure>...</figure></p>。
    // 这个函数用于识别“只有图片和换行”的段落，确认可以安全拆成独立 figure，
    // 同时避免影响普通文字段落。
    function isImageOnlyParagraph(paragraph) {
        return Array.from(paragraph.childNodes).every((node) => {
            // 忽略渲染器生成的缩进、换行等空白文本节点。
            if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim() === '';

            // 只要出现非元素节点，或者元素不是图片/换行，就说明这个段落里有真实内容，
            // 需要保留原来的正文排版。
            if (node.nodeType !== Node.ELEMENT_NODE) return false;
            return node.tagName === 'IMG' || node.tagName === 'BR';
        });
    }

    // 创建文章图片使用的带标题 figure。这里移动原始 img 节点，
    // 可以保留 Hexo 或插件已经添加的属性，例如 lazyload class、src/data-src、
    // alt 文本和加载状态。
    function createFigure(img) {
        let figure = document.createElement('figure');
        figure.className = 'image-container';

        let caption = document.createElement('figcaption');
        caption.className = 'image-caption';
        caption.innerText = img.alt;

        figure.appendChild(img);
        figure.appendChild(caption);

        return figure;
    }

    images.forEach((img) => {
        // 已经手写或渲染成 figure 的图片不再重复处理。
        if (img.parentElement.tagName === 'FIGURE') return;
        // if (img.parentElement.tagName === 'FIGURE' || !img.alt) return;

        // 允许作者通过 no-title class 对单张图片关闭自动标题/包装。
        if (img.classList.contains('no-title')) return;

        let parent = img.parentElement;

        // createFigure() 会立即把 img 移动到新的 figure 里，所以要先记住
        // 原本的下一个兄弟节点。这样处理非纯图片段落时，figure 仍能插回图片原位。
        let next = img.nextSibling;
        let figure = createFigure(img);

        if (parent.tagName === 'P' && isImageOnlyParagraph(parent)) {
            // 对于纯图片段落，把每个 figure 放到段落外面，而不是塞进 <p> 内部。
            // 渲染器生成的 <br> 会留在旧段落里，因此不会继续夹在图片之间。
            parent.parentNode.insertBefore(figure, parent);

            // 当原段落里的图片都被移出后，删除这个只剩空白/<br> 的段落。
            if (!parent.querySelector('img')) parent.remove();
            return;
        }

        // 混合内容段落走兜底逻辑：把 figure 放回图片原来的位置，
        // 不重排周围的文字内容。
        parent.insertBefore(figure, next);
    });

});
