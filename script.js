document.addEventListener("DOMContentLoaded", () => {
  const randomCards = document.querySelectorAll(".random");
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  const headerHeight = header? header.offsetHeight : 0;
  const footerHeight = footer? footer.offsetHeight : 0;

  // 랜덤 배치
  randomCards.forEach(card => {
    const usableWidth = window.innerWidth - 220;
    const usableHeight = window.innerHeight - headerHeight - footerHeight - 50;
    const x = Math.random() * usableWidth;
    const y = headerHeight + Math.random() * usableHeight;
    card.style.left = x + "px";
    card.style.top = y + "px";
  });

  // 드래그 기능 (PC + 모바일, .dragging class 적용)
  randomCards.forEach(card => {
    let offsetX = 0, offsetY = 0, isDown = false, isDragging = false;

    const start = (e) => {
      isDragging = true;
      isDown = true;
      card.classList.add("dragging"); // 드래그 스타일
      const evt = e.touches ? e.touches[0] : e;
      offsetX = evt.clientX - card.offsetLeft;
      offsetY = evt.clientY - card.offsetTop;
      card.style.zIndex = 999; // 가장 위에 보이도록 함
    };

    const move = (e) => {
      if (!isDown && !isDragging) return;
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