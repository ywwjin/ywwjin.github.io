const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const NOTION_API_KEY = process.env.NOTION_API_KEY;
// 블로그 전용 DB가 준비되면 NOTION_BLOG_DATASOURCE_ID로 교체, 그 전까진 기존 projects DB를 재사용
const DATASOURCE_ID = process.env.NOTION_BLOG_DATASOURCE_ID || process.env.NOTION_DATASOURCE_ID;

if (!NOTION_API_KEY || !DATASOURCE_ID) {
  console.error('❌ NOTION_API_KEY / NOTION_BLOG_DATASOURCE_ID(or NOTION_DATASOURCE_ID) 환경변수가 필요합니다.');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_API_KEY });

const escapeHTML = (text) => String(text).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

const slugify = (title, id) => {
  const base = String(title)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-');
  return base ? `${base}-${id.slice(0, 8)}` : id;
};

const getText = (richTextArray) => {
  if (!richTextArray || richTextArray.length === 0) return '';
  return richTextArray.map((t) => {
    let content = escapeHTML(t.plain_text);
    if (t.href) content = `<a href="${t.href}" target="_blank">${content}</a>`;
    if (t.annotations.bold) content = `<b>${content}</b>`;
    if (t.annotations.italic) content = `<i>${content}</i>`;
    if (t.annotations.code) content = `<code>${content}</code>`;
    if (t.annotations.color !== 'default') content = `<span style="color:${t.annotations.color}">${content}</span>`;
    return content;
  }).join('');
};

const blocksToHTML = async (blocks) => {
  let html = '';
  for (const block of blocks) {
    switch (block.type) {
      case 'paragraph':
        html += `<p>${getText(block.paragraph.rich_text)}</p>`;
        break;
      case 'heading_1':
        html += `<h2>${getText(block.heading_1.rich_text)}</h2>`;
        break;
      case 'heading_2':
        html += `<h3>${getText(block.heading_2.rich_text)}</h3>`;
        break;
      case 'heading_3':
        html += `<h4>${getText(block.heading_3.rich_text)}</h4>`;
        break;
      case 'bulleted_list_item':
        html += `<li>${getText(block.bulleted_list_item.rich_text)}</li>`;
        break;
      case 'numbered_list_item':
        html += `<li style="list-style-type:decimal;">${getText(block.numbered_list_item.rich_text)}</li>`;
        break;
      case 'image': {
        const src = block.image.type === 'external' ? block.image.external.url : block.image.file.url;
        const caption = block.image.caption.length > 0 ? block.image.caption[0].plain_text : '';
        html += `<figure><img src="${src}" alt="${escapeHTML(caption)}">${caption ? `<figcaption>${escapeHTML(caption)}</figcaption>` : ''}</figure>`;
        break;
      }
      case 'code':
        html += `<pre><code>${getText(block.code.rich_text)}</code></pre>`;
        break;
      case 'quote':
        html += `<blockquote>${getText(block.quote.rich_text)}</blockquote>`;
        break;
      default:
        console.log(`⚠️ 변환하지 않은 블록 타입: ${block.type}`);
        break;
    }
  }
  return html;
};

const postTemplate = ({ title, date, tags, bodyHTML }) => `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHTML(title)}</title>
    <meta name="description" content="${escapeHTML(title)}">
    <link rel="stylesheet" href="../../CSS/style.css">
    <style>
        body { overflow-y: auto; background-image: none; background: #f9f9f9; }
        .detail-wrapper { max-width: 800px; margin: 60px auto; padding: 40px; background: white; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); min-height: 80vh; }
        .post-meta { text-align: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 1px solid #eee; }
        .post-meta h1 { font-size: 2.2rem; margin-bottom: 10px; }
        .post-meta .date { color: #888; margin-bottom: 15px; }
        .tag-container { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
        .tag { background: #f1f3f5; color: #495057; padding: 6px 12px; border-radius: 20px; font-size: 0.9rem; font-weight: 600; }
        .content-body { line-height: 1.8; font-size: 1.1rem; color: #333; }
        .content-body img { max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0; }
    </style>
</head>
<body>
    <header></header>
    <div class="detail-wrapper">
        <div class="post-meta">
            <h1>${escapeHTML(title)}</h1>
            <p class="date">${escapeHTML(date)}</p>
            <div class="tag-container">${tags.map((t) => `<span class="tag">${escapeHTML(t)}</span>`).join('')}</div>
        </div>
        <div class="content-body">${bodyHTML}</div>
    </div>
    <script src="../../JS/header.js" data-root="../../"></script>
</body>
</html>
`;

const indexTemplate = (posts) => `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog</title>
    <link rel="stylesheet" href="../CSS/style.css">
    <style>
        body { overflow-y: auto; background-image: none; background: #f9f9f9; }
        .detail-wrapper { max-width: 800px; margin: 60px auto; padding: 40px; background: white; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); min-height: 80vh; }
        .post-list { list-style: none; padding: 0; }
        .post-list li { padding: 18px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: baseline; }
        .post-list a { text-decoration: none; color: #333; font-size: 1.2rem; font-weight: 600; }
        .post-list a:hover { color: #007BFF; }
        .post-list .date { color: #888; font-size: 0.9rem; }
        .empty { color: #888; text-align: center; padding: 40px 0; }
    </style>
</head>
<body>
    <header></header>
    <div class="detail-wrapper">
        <h1>Blog</h1>
        ${posts.length === 0 ? '<p class="empty">아직 글이 없습니다.</p>' : `
        <ul class="post-list">
            ${posts.map((p) => `<li><a href="posts/${p.slug}.html">${escapeHTML(p.title)}</a><span class="date">${escapeHTML(p.date)}</span></li>`).join('')}
        </ul>`}
    </div>
    <script src="../JS/header.js" data-root="../"></script>
</body>
</html>
`;

async function main() {
  console.log('🔄 노션에서 블로그 글 가져오는 중...');
  const response = await notion.dataSources.query({
    data_source_id: DATASOURCE_ID,
    sorts: [{ property: 'Date', direction: 'descending' }],
  });
  console.log(`✅ ${response.results.length}개 항목 발견.`);

  const posts = [];
  fs.mkdirSync('blog/posts', { recursive: true });

  for (const page of response.results) {
    const title = page.properties.Name?.title?.[0]?.plain_text || '제목 없음';
    const tags = (page.properties.Tags?.multi_select || []).map((t) => t.name);
    const date = page.properties.Date?.date?.start
      || page.properties.Date?.rich_text?.[0]?.plain_text
      || '';
    const slug = slugify(title, page.id.replace(/-/g, ''));

    let bodyHTML = '';
    try {
      const blockChildren = await notion.blocks.children.list({ block_id: page.id });
      bodyHTML = await blocksToHTML(blockChildren.results);
    } catch (err) {
      console.log(`${title} 본문 변환 실패:`, err.message);
    }

    fs.writeFileSync(path.join('blog/posts', `${slug}.html`), postTemplate({
      title, date, tags, bodyHTML,
    }));
    posts.push({ title, date, slug });
  }

  fs.writeFileSync('blog/index.html', indexTemplate(posts));
  console.log(`✅ 완료: blog/index.html + blog/posts/*.html (${posts.length}개)`);
}

main().catch((err) => {
  console.error('❌ 블로그 빌드 실패:', err.message);
  process.exit(1);
});
