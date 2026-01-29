/**
 * Cloudflare Worker: Tweet Spider (Smart Filter Version)
 * * 环境变量:
 * - API_ENDPOINT: API Worker 的地址
 * - API_SECRET: 密码
 * * 必须绑定的 KV Namespace:
 * - DB (绑定到与 API 相同的 TWEET_DB)
 */

export default {
  async scheduled(event, env, ctx) {
    await checkAllSources(env);
  },
  
  // 调试入口
  async fetch(request, env) {
    const results = await checkAllSources(env);
    return new Response(JSON.stringify(results, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function checkAllSources(env) {
  // 1. 先从数据库读取上一次抓取的“最新推文”
  // 注意：这里我们直接读取 'latest' 键，无需经过 API
  let lastSavedContent = "";
  try {
    const lastData = await env.DB.get('latest', { type: 'json' });
    if (lastData && lastData.content) {
      lastSavedContent = lastData.content;
    }
  } catch (e) {
    console.log("KV Read Error (First run?):", e);
  }

  const sources = [
    {
      name: 'Twitter/X',
      url: 'https://rsshub.app/twitter/user/elonmusk.json', 
    },
    {
      name: 'Bilibili',
      url: 'https://rsshub.app/bilibili/user/dynamic/4067954.json',
    }
  ];

  const logs = [];

  for (const source of sources) {
    try {
      const response = await fetch(source.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Worker; TweetSpider)' }
      });
      
      if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
      
      const rawData = await response.json();
      const latestItem = parseRSSHub(rawData);

      if (latestItem) {
        // === 核心筛选逻辑 ===
        // 如果抓取到的内容 == 数据库里存的内容，直接跳过！
        if (latestItem.content === lastSavedContent) {
          logs.push({ source: source.name, status: 'skipped', reason: 'Same as DB' });
          // 因为我们只关心最新的，如果最新的源没变，且我们假设源是按顺序排的，
          // 那就可以认为没有更新，直接结束循环 (break)
          // break; 
          continue; 
        }

        // 内容不同，说明有新推文 -> 调用 API 更新
        const updateRes = await pushToApi(env, latestItem.content);
        
        logs.push({ source: source.name, status: 'updated', new_content: latestItem.content });
        
        // 更新成功后，为了防止后续的源（旧数据）覆盖新数据，应该立即停止
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
  
  let content = item.content_text || item.content_html || item.description || "";
  content = content.replace(/<[^>]+>/g, "").trim();
  content = content.replace(/\n\s*\n/g, "\n"); // 去除多余空行

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
      always_on: 0 
    })
  });
  return await res.json();
}