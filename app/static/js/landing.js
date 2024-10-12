// add Javascript here for landing page

// Theme Changing logic
var themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
var themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");
var themeToggleBtn = document.getElementById("theme-toggle");

// Toggle the theme
function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  themeToggleDarkIcon.classList.toggle("hidden");
  themeToggleLightIcon.classList.toggle("hidden");

  // Update local storage
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Add event listener for the toggle button
themeToggleBtn.addEventListener("click", toggleTheme);

// Initialize the theme based on local storage or system preference
function initialize() {
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");

    themeToggleLightIcon.classList.remove("hidden");
  } else {
    themeToggleDarkIcon.classList.remove("hidden");
  }
}
// Initialize theme on page load
initialize();
