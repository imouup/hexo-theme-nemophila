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

        targetLink = document.querySelector(`.toc-link[href="#${CSS.escape(id)}"]`);

        

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