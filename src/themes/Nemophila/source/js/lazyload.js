// SPDX-License-Identifier: GPL-3.0-or-later
document.addEventListener('DOMContentLoaded', () => {

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // 只要露出 10% 就触发
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const img = entry.target;
                const dataSrc = img.getAttribute('data-src');
                let realSrc;
                if (dataSrc && (dataSrc.startsWith('http') || dataSrc.startsWith('https') || dataSrc.startsWith('//'))) {
                    realSrc = dataSrc;
                } else {
                    if (dataSrc && dataSrc.startsWith('/')) {
                        realSrc = window.origin + '/' + dataSrc.replace('/','');
                    } else {
                        realSrc = window.origin + '/' + dataSrc;
                    }
                }

                if(realSrc) {
                    const tempimg = new Image();
                    tempimg.src = realSrc;
                    tempimg.onload = () => {
                        img.src = realSrc;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded'); 
                    }

                    tempimg.onerror = () => {
                        console.error('Image failed to load:', realSrc);
                    }

                }
                observer.unobserve(img); // 取消监听
            }})}, observerOptions);

    
    window.observeImages = () => {
        const images = document.querySelectorAll('img.lazyload:not(.loaded)');
        images.forEach(img => imageObserver.observe(img)); // 监听新图片
    }       
    

    // 初始监听
    window.observeImages();

});