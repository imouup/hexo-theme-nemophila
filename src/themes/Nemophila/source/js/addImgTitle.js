// SPDX-License-Identifier: GPL-3.0-or-later
document.addEventListener('DOMContentLoaded', () => {

    let images = document.querySelectorAll('.article-content img');

    images.forEach((img) => {
        if (img.parentElement.tagName === 'FIGURE') return;
        // if (img.parentElement.tagName === 'FIGURE' || !img.alt) return;
        if (img.classList.contains('no-title')) return;

        let figure = document.createElement('figure');
        figure.className = 'image-container';

        let caption = document.createElement('figcaption');
        caption.className = 'image-caption';
        caption.innerText = img.alt;

        img.parentNode.insertBefore(figure, img);
        figure.appendChild(img);
        figure.appendChild(caption);
    });

});