/**
 * Cloudflare Worker: Tweet Spider (Cron Job)
 * * 环境变量:
 * - API_ENDPOINT: 上一个 Worker 的完整地址，例如 https://api.xxx.workers.dev/update
 * - API_SECRET: 与 API Worker 设置的一致的密码
 */

export default {
  // Cron 触发入口
  async scheduled(event, env, ctx) {
    await checkAllSources(env);
  },
  
  // 浏览器手动触发入口 (方便调试)
  async fetch(request, env) {
    const results = await checkAllSources(env);
    return new Response(JSON.stringify(results, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function checkAllSources(env) {
  // 定义订阅源
  // 使用 RSSHub 将各种社交媒体转为 JSON 格式
  const sources = [
    {
      name: 'Twitter/X',
      // 请替换可用的 RSSHub 实例。此处仅为示例格式。
      url: 'https://rsshub.app/twitter/user/elonmusk.json', 
    },
    {
      name: 'Bilibili',
      // 替换为你关注的 B站 UID
      url: 'https://rsshub.app/bilibili/user/dynamic/4067954.json',
    }
  ];

  const logs = [];

  for (const source of sources) {
    try {
      // 1. 获取数据
      const response = await fetch(source.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Worker; TweetSpider)' }
      });
      
      if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
      
      const rawData = await response.json();
      
      // 2. 解析出最新一条 (适配 RSSHub JSON schema)
      const latestItem = parseRSSHub(rawData);

      if (latestItem) {
        // 3. 发送给 API (always_on = 0)
        const updateRes = await pushToApi(env, latestItem.content);
        
        logs.push({ source: source.name, status: 'pushed', api_response: updateRes });
        
        // 策略：只要抓到一个有效源就结束，避免旧内容覆盖新内容
        // 也可以根据你的需求去掉 break，让最后一个源拥有最高优先级
        if (updateRes.msg && updateRes.msg.includes('Success')) {
             break; 
        }
      }
    } catch (e) {
      logs.push({ source: source.name, error: e.message });
    }
  }
  return logs;
}

function parseRSSHub(data) {
  if (!data || !data.items || data.items.length === 0) return null;
  const item = data.items[0];
  
  // 提取正文，优先使用纯文本，如果只有 HTML 则需要正则清洗
  let content = item.content_text || item.content_html || item.description || "";
  
  // 简单的数据清洗：去除 HTML 标签
  content = content.replace(/<[^>]+>/g, "").trim();
  // 去除多余换行
  content = content.replace(/\n\s*\n/g, "\n");

  if (!content) return null;

  return { content };
}

async function pushToApi(env, content) {
  const res = await fetch(env.API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': env.API_SECRET
    },
    body: JSON.stringify({
      content: content,
      always_on: 0 // 爬虫只负责普通更新
    })
  });
  return await res.json();
}