document.addEventListener("DOMContentLoaded", () => {
  const randomCards = document.querySelectorAll(".random");
  const allCards = document.querySelectorAll(".card");
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

    const usableWidth = window.innerWidth - width - 20;
    const usableHeight = window.innerHeight - headerHeight - footerHeight - filterHeight - height - 20;
    
    let x,y;
    let isTooMuchOverlap = true;
    let attempts = 0;
    const maxAttempts = 20;

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
          if (overlapArea > 0.5 * myarea){
            isTooMuchOverlap = true;
            break;
          }
        }
      }
    }
    card.style.left = x + "px";
    card.style.top = y + "px";

    // 확정된 위치 배열에 저장
    placedElements.push({
      left: x,
      top: y,
      width: width,
      height: height,
      area: myarea
    });
  });

  // 드래그 기능 (PC + 모바일, .dragging class 적용)
  allCards.forEach(card => {
    let offsetX = 0, offsetY = 0, isDown = false, isDragging = false;

    const start = (e) => {
      isDragging = false;
      isDown = true;
      card.classList.add("dragging"); // 드래그 스타일
      const evt = e.touches ? e.touches[0] : e;
      offsetX = evt.clientX - card.offsetLeft;
      offsetY = evt.clientY - card.offsetTop;
      card.style.zIndex = 9999; // 가장 위에 보이도록 함
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

  // 필터 기능 ///
  //button click
    const buttons = document.querySelectorAll('.card-filter button');
    const cards = document.querySelectorAll('.card');

    let activeFilters = new Set();

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

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