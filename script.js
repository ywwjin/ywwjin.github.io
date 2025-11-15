document.addEventListener("DOMContentLoaded", () => {
  const randomCards = document.querySelectorAll(".random");
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  const headerHeight = header? header.offsetHeight : 0;
  const footerHeight = footer? footer.offsetHeight : 0;

  // 랜덤 배치
  randomCards.forEach(card => {
    const usableWidth = window.innerWidth - 220;
    const usableHeight = window.innerHeight - headerHeight - footerHeight - 20;
    const x = Math.random() * usableWidth;
    const y = headerHeight + Math.random() * usableHeight;
    card.style.left = x + "px";
    card.style.top = y + "px";
  });

  // 드래그 기능 (PC + 모바일, .dragging class 적용)
  randomCards.forEach(card => {
    let offsetX = 0, offsetY = 0, isDown = false;

    const start = (e) => {
      isDown = true;
      card.classList.add("dragging"); // 드래그 스타일
      const evt = e.touches ? e.touches[0] : e;
      offsetX = evt.clientX - card.offsetLeft;
      offsetY = evt.clientY - card.offsetTop;
      card.style.zIndex = 999; // 가장 위에 보이도록 함
    };

    const move = (e) => {
      if (!isDown) return;
      const evt = e.touches ? e.touches[0] : e;
      card.style.left = (evt.clientX - offsetX) + "px";
      card.style.top = (evt.clientY - offsetY) + "px";
    };

    const end = () => {
      if (isDown) {
        isDown = false;
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
});
