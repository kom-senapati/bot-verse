var themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
var themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");

// Initialize the theme based on local storage or system preference
function initializeTheme() {
    if (
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
        document.body.classList.add("dark");
        themeToggleLightIcon.classList.remove("hidden");
    } else {
        themeToggleDarkIcon.classList.remove("hidden");
    }
}

// Toggle the theme and icons when the button is clicked
document.getElementById("theme-toggle").addEventListener("click", function () {
    document.body.classList.toggle("dark");

    // Toggle icons visibility
    if (themeToggleLightIcon.classList.contains("hidden")) {
        themeToggleLightIcon.classList.remove("hidden");
        themeToggleDarkIcon.classList.add("hidden");
        localStorage.setItem("theme", "dark"); // Store theme preference
    } else {
        themeToggleLightIcon.classList.add("hidden");
        themeToggleDarkIcon.classList.remove("hidden");
        localStorage.setItem("theme", "light"); // Store theme preference
    }
});

// Initialize theme on page load
initializeTheme();