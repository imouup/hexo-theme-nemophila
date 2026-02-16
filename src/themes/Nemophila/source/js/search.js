// SPDX-License-Identifier: GPL-3.0-or-later
document.addEventListener('DOMContentLoaded', () => {

    // 搜索栏
    const searchInput = document.querySelector('.search-input-field');
    const searchBtn = document.querySelector('.search-input-btn');
    const loadingText = document.querySelector('.search-result-loading');

    // 拉取content.json
    let content = [];

    const fetchContent = async () => {

        try {
            const rawData = await fetch('/content.json');
            const jsonData = await rawData.json();
            
            content = jsonData.posts || [];
            console.log('Successfully fetch /content.json')
        } catch (error) {
            console.log('Error: ',error);
            if (loadingText) {
                loadingText.style.opacity = 1;
                loadingText.textContent = '数据加载失败，请刷新页面重试~';
            }
        }

        console.log('搜索测试：',search('a'));

    }

    fetchContent();

    // 搜索函数
    const search = (inputStr) => {
        
        if (!inputStr || !inputStr.trim()) {
            return [];
        }

         
         const lowerInputStrArray = inputStr.trim().toLowerCase().split(/\s+/);

         const resultList = content.filter((post)=>{
            const title = (post.title || '').toLowerCase();
            const text = (post.text || post.excerpt || '').toLowerCase();

            const isAllMatch = lowerInputStrArray.every((keyword)=>{

                // 使用indexOf()扫描
                const foundTitle = title.indexOf(keyword) > -1;
                const foundText = text.indexOf(keyword) > -1;

                if (foundTitle || foundText) {
                    return true;
                } else {
                    return false;
                }
            });

            return isAllMatch;

         });

         return resultList;

    }

    // 监听搜索事件
    if (searchBtn) {

        searchBtn.addEventListener('click', ()=>{
            
            if (loadingText) {
                loadingText.style.opacity = 1;
                loadingText.textContent = 'Loading...';
            }

            const userInput = searchInput.value;
            const resultList = search(userInput);
            

            if (window.setSearchResult) {
                window.setSearchResult(resultList);
                if (loadingText) {
                    loadingText.style.opacity = 0;
                }
            }

        });

    }

    // 监听回车事件
    if (searchInput) {
        searchInput.addEventListener('keypress', (event)=>{
            if (event.key === 'Enter') {
                event.preventDefault();
                searchBtn.click();
            }
        });

    }

   
    



});