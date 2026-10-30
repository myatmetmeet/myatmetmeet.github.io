
/* =================================
   ENFPATH NAVIGATION
================================= */

const menu = document.querySelector(".site-nav");
const toggle = document.querySelector(".menu-toggle");
const links = document.querySelectorAll(".menu-panel a");

if (menu && toggle) {

  // 현재 페이지 메뉴 강조
  const currentPage =
    location.pathname.split("/").pop() || "index.html";

  links.forEach(link => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });

  // PC 마우스 접근
  menu.addEventListener("mouseenter", () => {
    toggle.setAttribute("aria-expanded", "true");
  });

  menu.addEventListener("mouseleave", () => {
    if (!menu.classList.contains("is-open")) {
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // 모바일 터치 지원
  if (window.matchMedia("(hover: none)").matches) {
    toggle.addEventListener("click", () => {
      const opened = menu.classList.toggle("is-open");

      toggle.setAttribute("aria-expanded", opened);
    });
  }

  // 메뉴를 선택하면 닫기
  links.forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // ESC 키로 메뉴 닫기
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.blur();
    }
  });
}
