// index.html / aboutme.html의 header와 동일한 nav를 렌더링 (blog 페이지 전용, 카드 레이아웃 로직은 포함하지 않음)
function loadHeader(rootPath) {
  const headerHTML = `
    <div class="header">
        <h2>Yourname</h2>
        <nav>
            <a href="${rootPath}index.html">Home</a>
            <a href="${rootPath}aboutme.html">About Me</a>
            <a href="${rootPath}blog/index.html">Blog</a>
        </nav>
    </div>
  `;
  const headerEl = document.querySelector("header");
  if (!headerEl) {
    return;
  }
  headerEl.innerHTML = headerHTML;
}

// currentScript는 스크립트 실행 시점에만 유효하므로 DOMContentLoaded 콜백 밖에서 미리 읽어둠
const __headerScriptEl = document.currentScript;

document.addEventListener("DOMContentLoaded", () => {
  const rootPath = __headerScriptEl?.dataset?.root || "";
  loadHeader(rootPath);
});
