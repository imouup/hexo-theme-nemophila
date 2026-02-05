'use strict';

// 注册过滤器
hexo.extend.filter.register('after_render:html', (str, data) =>{

    const config = hexo.theme.config.lazyload; // 读取主题配置
    // 未启用则直接返回原始字符串
    if (!config || !config.enable) {
        return str;
    }

    const loadingImage = (config && config.loading_img) ? config.loading_img : '/images/yachiyo_loading_640.webp';
    const className = 'lazyload'; // 懒加载图片带有的类名

    const ignoreKeywords = [
        '/ico/',      // 排除图标
        '/icon/',     
        'logo',       // 排除Logo
        'avatar',     // 排除头像
        'loading',    // 排除占位图自己
        '.svg'        // 排除svg
    ];
    
    return str.replace(/<img(\s[^>]*)?src\s*=\s*"([^"]*)"([^>]*)>/gi, (match, prefix, src, suffix) => {

        prefix = prefix || ' ';
        suffix = suffix || '';

        if (ignoreKeywords.some(keyword => src.includes(keyword))) {
            return match; // 返回原始的<img>标签
        }

        if ((prefix + suffix).includes('no-lazy')) {
            return match; 
        }

        if (src === loadingImage) {
            return match;
        }

        let newTag = match;

        newTag = newTag.replace(
            /src\s*=\s*["']([^"']+)["']/i, 
            `src="${loadingImage}" data-src="${src}"`
        );

        if (/class\s*=\s*["']/.test(newTag)) {
            newTag = newTag.replace(/(class\s*=\s*["'])/i, `$1${className} `);
        } else {
            if (newTag.endsWith('/>')) {
                newTag = newTag.replace(/\s*\/>$/, ` class="${className}">`); 
            } else {
                newTag = newTag.replace(/\s*>$/, ` class="${className}">`);
            }
        }

        return newTag;
    });

});