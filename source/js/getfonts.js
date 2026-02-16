(() => {
    let tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let isMainland = (tz === 'Asia/Shanghai' || tz === 'Asia/Chongqing' || tz === 'Asia/Urumqi');
    
    let cssDomain = isMainland ? 'https://fonts.font.im' : 'https://fonts.googleapis.com';
    let fontDomain = isMainland ? 'https://fonts.font.im' : 'https://fonts.gstatic.com';

    let preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = cssDomain;
    document.head.appendChild(preconnect1);

    let preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = fontDomain;
    preconnect2.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect2);

    let fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = cssDomain + '/css2?family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@400;500;600;700&display=swap';
    document.head.appendChild(fontLink);
})();