// header 고정
function loadHeader() {
  const headerHTML = `
    <div class="header">
        <h2>Yourname</h2>
        <nav>
            <a href="index.html">Home</a>
            <a href="aboutme.html">About Me</a>
        </nav>
    </div>
  `;
  //document.querySelector("header").innerHTML = headerHTML;
  const headerEl = document.querySelector("header");
  if (!headerEl) {
    return;
  }
  headerEl.innerHTML = headerHTML;
}

document.addEventListener("DOMContentLoaded", async () => {
  loadHeader();
  //const allCards = document.querySelectorAll(".card");
  let globalZIndex = 100;
  let activeFilters = new Set();

  function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', 
    '"': '&quot;', "'": '&#39;'
  }[c]));
}


  // 2. 프로젝트 데이터 불러오기 및 카드 생성
  async function initProjects() {
    try {
      // JSON 파일 읽기
      const res = await fetch('projects.json');
      if (!res.ok) throw new Error("JSON 파일 없음");
      const projects = await res.json();
      
      const main = document.querySelector('main');

      // (선택) 기존 하드코딩된 프로젝트 카드가 있다면 제거
      //document.querySelectorAll('.card.random.projects').forEach(el => el.remove());

      // 데이터 기반으로 카드 생성
      projects.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card random projects';
        
        // 상세 페이지 링크 생성 (?id=노션ID)
        const detailLink = `project_detail.html?id=${p.id}`;

        card.innerHTML = `
            <img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.title)}" onerror="this.src='https://via.placeholder.com/200x150?text=No+Image'">
            <a class="card-name card-link" href="${detailLink}">
                <span>${escapeHTML(p.title)}</span>
            </a>
            <span class="card-name" style="opacity: 0.4; font-size: 0.8rem; margin-top:5px; display:block;">${escapeHTML(p.date)}</span>
        `;
        
        // main 태그 안에 추가
        main.appendChild(card);
      });

    } catch (err) {
      console.log("⚠️ 프로젝트 데이터를 불러올 수 없습니다 (로컬 환경이거나 파일 없음):", err);
    }

    // 카드 생성이 끝나면 배치 로직 실행!
    layoutCards();
    attachDragEvents();
  
  }

  //배치 및 재배치 함수(화면 크기 바뀔때마다 호출)
  function layoutCards(){
      const randomCards = document.querySelectorAll(".random");
      const header = document.querySelector("header");
      const footer = document.querySelector("footer");
      const filter = document.querySelector(".card-filter");
      const headerHeight = header? header.offsetHeight : 0;
      const footerHeight = footer? footer.offsetHeight : 0;
      const filterHeight = filter? filter.offsetHeight : 0;
      // 랜덤 배치
    const placedElements = []; //배치된 요소 저장

    const fixedCards = document.querySelectorAll(".fixed");

    //고정카드 위치 먼저 가져오기 & 저장
    fixedCards.forEach(card => {
      placedElements.push({
        left: card.offsetLeft,
        top: card.offsetTop,
        width: card.offsetWidth,
        height: card.offsetHeight,
        area: card.offsetWidth * card.offsetHeight
      });
    });

    // 랜덤 카드 배치
    randomCards.forEach(card => {
      const width = card.offsetWidth || 250;
      const height = card.offsetHeight || 200;
      const myarea = width * height;

      const safeY = headerHeight + filterHeight + 40
      const usableWidth = window.innerWidth - width - 20;
      const usableHeight = window.innerHeight - headerHeight - footerHeight - filterHeight - height - 100;
      
      let x,y;
      let isTooMuchOverlap = true;
      let attempts = 0;
      const maxAttempts = 40;

      while(isTooMuchOverlap && attempts < maxAttempts){
        isTooMuchOverlap = false;
        attempts++;

        // 랜덤 좌표 생성
        x = Math.random() * usableWidth;
        y = headerHeight + filterHeight + Math.random() * usableHeight;

        //오버랩 계산하기
        for (const placed of placedElements){
          // 두 사각형이 겹치는 영역의 크기 계산
          // 기준이 되는 랜덤카드 x,y
          const startX = Math.max(x, placed.left); //왼쪽씩 비교
          const endX = Math.min(x + width, placed.left + placed.width); //오른쪽씩 비교
          const startY = Math.max(y, placed.top);
          const endY = Math.min(y + height, placed.top + placed.height);

          // 겹치는 길이 계산
          const overlapWidth = endX - startX;
          const overlapHeight = endY - startY;

          // 실제 겹치는 것인지 확인
          if (overlapWidth > 0 && overlapHeight > 0){
            const overlapArea = overlapHeight * overlapWidth;
            if (overlapArea > 0.45 * myarea){
              isTooMuchOverlap = true;
              break;
            }
          }
        }
      }
      card.style.left = x + "px";
      card.style.top = y + "px";

      if(activeFilters.size === 0){
        card.style.display = "block";
      } else {
        const matches = [...activeFilters].some(f => card.classList.contains(f));
        card.style.display = matches ? "block" : "none";
      }
      const rotate = (Math.random() * 30) - 15;
      card.style.transform = `rotate(${rotate}deg)`;

      // 확정된 위치 배열에 저장
      placedElements.push({
        left: x,
        top: y,
        width: width,
        height: height,
        area: myarea
      });
    });
  }
  
  // 드래그 기능 (PC + 모바일, .dragging class 적용)
  function attachDragEvents() {
    const allCards = document.querySelectorAll(".card");

    allCards.forEach(card => {
    let offsetX = 0, offsetY = 0, isDown = false, isDragging = false;

    const start = (e) => {
      isDragging = false;
      isDown = true;
      globalZIndex++;
      card.style.zIndex = globalZIndex;
      card.classList.add("dragging"); // 드래그 스타일
      const evt = e.touches ? e.touches[0] : e;
      offsetX = evt.clientX - card.offsetLeft;
      offsetY = evt.clientY - card.offsetTop;
    };

    const move = (e) => {
      if (!isDown) return;
      isDragging = true;
      e.preventDefault(); //터치 스크롤 방지
      const evt = e.touches ? e.touches[0] : e;
      card.style.left = (evt.clientX - offsetX) + "px";
      card.style.top = (evt.clientY - offsetY) + "px";
    };

    const end = () => {
      if (isDown) {
        isDown = false;
        isDragging = false;
        card.classList.remove("dragging"); // 드래그 스타일 해제
      }
    };

    // PC
    card.addEventListener("mousedown", start);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);

    // 모바일
    card.addEventListener("touchstart", start, { passive: false });
    document.addEventListener("touchmove", move, { passive: false });
    document.addEventListener("touchend", end);
  });
  }

  await initProjects();

    

  //화면 크기 변경 감지(resize observer)
  let resizeTimer;
  window.addEventListener('resize', () =>{
    clearTimeout(resizeTimer);
    //사용자가 손을 떼고 0.2초 뒤에 한 번 실행
    resizeTimer = setTimeout(() => {
      layoutCards();
    }, 200);
  });

  // 필터 기능 ///
  //button click
    const buttons = document.querySelectorAll('.card-filter button');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        const cards = document.querySelectorAll('.card'); //동적 카드 포함


        //filter toggle
        // 있으면 빼고, 없으면 추가
        if (activeFilters.has(filter)){
          activeFilters.delete(filter);
          btn.classList.remove('active');
        } else {
          activeFilters.add(filter);
          btn.classList.add('active');
        }

        //필터가 없으면 모두 보이기
        if (activeFilters.size === 0) {
          cards.forEach(card => {
            card.style.display = 'block';
          });
          return;
        }

        //필터가 있으면 카드들 필터링
        cards.forEach(card => {
          //card 클래스 중 activefilters 중 하나라도 포함되는지 체크
          const matches = [...activeFilters].some(f => card.classList.contains(f));
          card.style.display = matches ? 'block' : 'none';
        });
    });
  });
});