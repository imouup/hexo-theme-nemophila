document.addEventListener('DOMContentLoaded', () => {

    const headers = document.querySelectorAll('.article-content h1, .article-content h2, .article-content h3, .article-content h4, .article-content h5, .article-content h6');
    const tocLinks = document.querySelectorAll('.toc-link');

    if (headers.length === 0 || tocLinks.length === 0) {
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '-70px 0px -60% 0px',
        threshold: 0

    }

    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const href = link.getAttribute('href');
            const targetId = decodeURIComponent(href.substring(1));
            const targetHeader = document.getElementById(targetId);

            if (targetHeader) {
                // 计算滚动位置，减去顶部导航栏高度
                const headerOffset = 80;
                const elementPosition = targetHeader.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                // 执行平滑滚动
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                
            }
        });
    });

    const observer = new IntersectionObserver((entries) => {
        
        const visibleEntries = entries.filter(entry => entry.isIntersecting);

        if (visibleEntries.length > 0) {
            visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
            const topMostEntry = visibleEntries[0];
            activateTocLink(topMostEntry.target.id);

        }

    }, observerOptions);

    headers.forEach(header => {
        observer.observe(header);
    });

    const activateTocLink = (id) => {

        let targetLink = document.querySelector(`.toc-link[href="#${encodeURIComponent(id)}"]`);


        

        if (targetLink) {
            tocLinks.forEach(link => link.classList.remove('active'));

            targetLink.classList.add('active');

            let parent = targetLink.parentElement;
            while (parent && parent.id !== 'toc-wrapper') {
                if (parent.classList.contains('toc-item')) {
                    parent.classList.add('active')

                }
                parent = parent.parentElement;
            
            }

        }


    };


});