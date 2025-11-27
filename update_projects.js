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

async function getProjects() {
  console.log("🔄 노션 데이터 가져오는 중...");
  try {
    const response = await notion.dataSources.query({
      data_source_id: datasourceId,
      sorts: [
        {
          property: 'Name',
          direction: 'ascending', 
        },
      ],
    });

    const projects = response.results.map((page) => {
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

      return {
        id: page.id, 
        title: name,
        tags: tags,
        description: desc,
        date: date,
        github: github,
        image: image
      };
    });

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