const { Client } = require('@notionhq/client');
const fs = require('fs');
require('dotenv').config();

// --- 🔍 디버깅: 키가 잘 로드되었는지 확인 ---
console.log("-----------------------------------------");
console.log("환경변수 로드 상태 점검:");
if (!process.env.NOTION_API_KEY) {
  console.error("❌ 오류: NOTION_API_KEY가 없습니다. .env 파일을 확인하세요.");
} else {
  console.log("✅ API Key");
}

if (!process.env.NOTION_DATASOURCE_ID) {
  console.error("❌ 오류: NOTION_DATASOURCE_ID 없습니다. .env 파일을 확인하세요.");
} else {
  console.log("✅ Database ID");
}
console.log("-----------------------------------------");

// 키가 없으면 바로 종료
if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATASOURCE_ID) {
  process.exit(1);
}
// ---------------------------------------------

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const datasourceId = process.env.NOTION_DATASOURCE_ID;

const blocksToHTML = async (blocks) => {
  let html = '';
  for (const block of blocks) {
    //텍스트 내용 추출 함수
    const getText = (richTextArray) => {
      if (!richTextArray || richTextArray.length === 0) return '';
      return richTextArray.map(t => {
        let content = t.plain_text;
        //링크 처리
        if (t.href) content = `<a href="${t.href}" target="_blank" style="color:#007BFF; text-decoration:underline;">${content}</a>`;
        // 스타일 처리
        if (t.annotations.bold) content = `<b>${content}</b>`;
        if (t.annotations.italic) content = `<i>${content}</i>`;
        if (t.annotations.code) content = `<code style="background:#eee; padding:2px 4px; border-radius:3px;">${content}</code>`;
        if (t.annotations.color !== 'default') content = `<span style="color:${t.annotations.color}">${content}</span>`;
        return content;
      }).join('');
    }
    // 블록 타입별 HTML 변환
    switch (block.type) {
      case 'paragraph':
        html += `<p style="margin-bottom:1rem; min-height:1rem;">${getText(block.paragraph.rich_text)}</p>`;
        break;
      case 'heading_1':
        html += `<h2 style="margin-top:2rem; margin-bottom:1rem; font-size:1.8rem;">${getText(block.heading_1.rich_text)}</h2>`;
        break;
      case 'heading_2':
        html += `<h3 style="margin-top:1.5rem; margin-bottom:0.8rem; font-size:1.5rem;">${getText(block.heading_2.rich_text)}</h3>`;
        break;
      case 'heading_3':
        html += `<h4 style="margin-top:1.2rem; margin-bottom:0.5rem; font-size:1.2rem;">${getText(block.heading_3.rich_text)}</h4>`;
        break;
      case 'bulleted_list_item':
        html += `<li style="margin-left:1.5rem;">${getText(block.bulleted_list_item.rich_text)}</li>`;
        break;
      case 'numbered_list_item':
        html += `<li style="margin-left:1.5rem; list-style-type:decimal;">${getText(block.numbered_list_item.rich_text)}</li>`;
        break;
      case 'image':
        const src = block.image.type === 'external' ? block.image.external.url : block.image.file.url;
        const caption = block.image.caption.length > 0 ? block.image.caption[0].plain_text : "";
        html += `
          <figure style="margin: 20px 0;">
            <img src="${src}" alt="${caption}" style="max-width:100%; border-radius:8px;">
            ${caption ? `<figcaption style="color:#888; font-size:0.9rem; text-align:center;">${caption}</figcaption>` : ''}
          </figure>`;
        break;
      case 'code':
        html += `
          <pre style="background:#f4f4f4; padding:15px; border-radius:8px; overflow-x:auto; font-family:monospace;">
            <code>${getText(block.code.rich_text)}</code>
          </pre>`;
        break;
      case 'quote':
        html += `<blockquote style="border-left:4px solid #ccc; padding-left:15px; color:#555; margin: 15px 0;">${getText(block.quote.rich_text)}</blockquote>`;
        break;
      default:
        console.log(`⚠️ 변환하지 않은 블록 타입: ${block.type}`);
        break;
    }
  }
  return html;
};


async function getProjects() {
  console.log("🔄 노션 데이터 가져오는 중...");
  try {
    // 1. get project pages from the datasource
    const response = await notion.dataSources.query({
      data_source_id: datasourceId,
      sorts: [
        {
          property: 'Name',
          direction: 'ascending', 
        },
      ],
    });

    console.log('✅ 데이터 소스에서 페이지 불러오기 성공, 총 ' + response.results.length + '개 항목 발견.');

    // 2. 각 페이지의 블록 데이터도 함께 가져오기
    const projects = await Promise.all(response.results.map(async (page) => {
      // 1. 제목 (Title)
      const name = page.properties.Name.title[0]?.plain_text || "제목 없음";
      
      // 2. 태그 (Multi-select)
      const tags = page.properties.Tags.multi_select.map((tag) => tag.name);
      
      // 3. 설명 (Rich text)
      const desc = page.properties.Description.rich_text[0]?.plain_text || "설명이 없습니다.";
      
      // 4. 날짜 (Rich text 또는 Date 속성일 수 있음. 일단 Rich text로 가정)
      // 만약 노션 속성 종류가 'Date'라면: page.properties.Date.date.start
      const date = page.properties.Date.rich_text?.[0]?.plain_text || 
                   page.properties.Date.date?.start || ""; 
      
      // 5. 깃허브 링크 (URL)
      const github = page.properties.Github.url || "#";
      
      // 6. 이미지 (Cover)
      let image = "images/default.jpg"; 
      if (page.cover) {
          image = page.cover.type === 'external' ? page.cover.external.url : page.cover.file.url;
      }

      let contentHTML = "";
      try {
        //자식 블록 가져오기 API 호출
        const blockData = await notion.blocks.retrieve({ block_id: page.id });
        const blockChildren = await notion.blocks.children.list({ block_id: page.id });
        contentHTML = await blocksToHTML(blockChildren.results);

      } catch (err) {
        console.log(`${name} 본문 변환 실패:`, err.message);
      }


      return {
        id: page.id,
        title: name,
        tags: tags,
        description: desc,
        date: date,
        github: github,
        image: image,
        content: contentHTML
      };
    }));



    const jsonContent = JSON.stringify(projects, null, 2);
    fs.writeFileSync('projects.json', jsonContent);
    
    console.log(`✅ 성공! 총 ${projects.length}개의 프로젝트를 가져와서 'projects.json'으로 저장했습니다.`);

  } catch (error) {
    console.error("❌ 노션 API 에러 발생:");
    console.error(error.message); // 에러 메시지만 깔끔하게 출력
    if (error.code === 'object_not_found') {
        console.error("👉 힌트: Database ID가 틀렸거나, 노션 데이터베이스에 '통합(Connections)' 연결이 안 되어있을 수 있습니다.");
    }
    if (error.code === 'unauthorized') {
        console.error("👉 힌트: API Key가 틀렸습니다.");
    }
  }
}

getProjects();