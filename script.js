document.addEventListener("DOMContentLoaded", () => {
  const projects = [
    { name: "타이머 앱", link: "https://github.com/you/timer-app" },
    { name: "미니 블로그", link: "https://github.com/you/mini-blog" }
  ];

  const list = document.getElementById("project-list");
  list.innerHTML = projects
    .map(p => `<p><a href="${p.link}" target="_blank">${p.name}</a></p>`)
    .join("");
});
