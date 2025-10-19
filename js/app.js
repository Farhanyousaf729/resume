const navbar = document.querySelector("#nav");
const navBtn = document.querySelector("#nav-btn");
const closeBtn = document.querySelector("#close-btn");
const sidebar = document.querySelector("#sidebar");
const date = document.querySelector("#date");
const themeToggle = document.querySelector('#theme-toggle');
const rootEl = document.documentElement;
const THEME_STORAGE_KEY = 'theme-preference';
// add fixed claa to navbar
window.addEventListener("scroll", function () {
    if (window.pageYOffset > 80) {
        navbar.classList.add("navbar-fixed");
    } else{
        navbar.classList.remove("navbar-fixed");
    }
});
// show sidebar
navBtn.addEventListener("click", function () {
    sidebar.classList.add("show-sidebar");
});
closeBtn.addEventListener("click", function () {
    sidebar.classList.remove("show-sidebar");
});
// set year

const year = new Date().getFullYear();

date.innerHTML = year

// theme handling
function applyTheme(theme) {
  if (theme === 'dark') {
    rootEl.setAttribute('data-theme', 'dark');
  } else {
    rootEl.removeAttribute('data-theme');
  }
  updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
  if (!themeToggle) return;
  const icon = themeToggle.querySelector('i');
  if (!icon) return;
  icon.classList.remove('fa-moon', 'fa-sun', 'fa-regular', 'fa-solid');
  if (theme === 'dark') {
    icon.classList.add('fa-solid', 'fa-sun');
  } else {
    icon.classList.add('fa-regular', 'fa-moon');
  }
}

const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
applyTheme(initialTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = rootEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
  });
}