// SPDX-License-Identifier: GPL-3.0-or-later
document.addEventListener('DOMContentLoaded', () => {
    const up = document.getElementById('up');

    if (!up) return;

    const handleScroll = () => {
        const threshold = window.innerHeight;

        if (window.scrollY > threshold) {
            up.classList.add('show');
        } else {
            up.classList.remove('show');
        }
    };

    window.addEventListener('scroll', handleScroll);

    up.addEventListener('click', (e) => {
        e.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    });
        

});