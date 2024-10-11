function navigate(event, path) {
  event.preventDefault(); // Prevent the default anchor behavior
  history.pushState(null, "", path); // Change the URL without reloading the page
  loadContent(path); // Load the content dynamically
  toggleAnonymousChatbotButton();
}

async function loadContent(path) {
  const appDiv = document.getElementById("main-content"); // Main content area
  const urlMap = {
    "/": "/landing",
    "/dashboard": "/dashboard",
    "/profile": "/profile",
    "/login": "/login",
    "/signup": "/signup",
    "/chatbot": "/chatbot",
    "/anonymous": "/anonymous",
    "/chatbot_hub": "/chatbot_hub",
    "/create_chatbot": "/create_chatbot",
    "/chatbot/:id/update": "/chatbot/{id}/update", // Placeholder for chatbot update
    "/profile/:id": "/profile/{id}",
    "/profile/edit": "/profile/edit",
    "/logout": "/logout",
  };

  let url = urlMap[path] || null;

  // Handle /chatbot/<id>
  const profiletMatch = path.match(/\/profile\/(\d+)/);
  if (profiletMatch) {
    const profileId = profiletMatch[1];
    url = `/profile/${profileId}`; // Update URL for the chatbot page
  }

  // Handle /chatbot/<id>
  const chatbotMatch = path.match(/\/chatbot\/(\d+)/);
  if (chatbotMatch) {
    const chatbotId = chatbotMatch[1];
    url = `/chatbot/${chatbotId}`; // Update URL for the chatbot page
  }

  // Handle /chatbot/<id>/update
  const updateMatch = path.match(/\/chatbot\/(\d+)\/update/);
  if (updateMatch) {
    const chatbotId = updateMatch[1];
    url = `/chatbot/${chatbotId}/update`; // Update URL for the update page
  }

  if (!url) {
    appDiv.innerHTML = "<h1>404 Page is not registered</h1>";
    removeScripts(); // Clean up scripts if path is not found
    return;
  }

  try {
    const response = await fetch(`${url}?full=false`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const content = await response.text(); // Fetch HTML content
    appDiv.innerHTML = content; // Inject HTML into the main content area
    removeScripts(); // Remove existing scripts

    if (!!url.match(/\/chatbot\/(\d+)/)) {
      injectScript(`/static/js/chatbot.js`); // Load the corresponding script
    } else if (!!url.match(/\/profile\/(\d+)/) || url == "/profile/edit") {
      injectScript(`/static/js/profile.js`); // Load the corresponding script
    } else {
      injectScript(`/static/js${url}.js`); // Load the corresponding script
    }
  } catch (error) {
    console.error("Failed to load content:", error);
    appDiv.innerHTML = "<h1>Failed to load content</h1>";
  }
}

function injectScript(src) {
  // Check if the script is already loaded to avoid duplicates
  if (document.querySelector(`script[src="${src}"]`)) return;

  const script = document.createElement("script");
  script.src = src;
  script.async = true; // Load script asynchronously

  script.onload = () => console.log(`${src} loaded successfully.`);
  script.onerror = () => console.error(`Failed to load script: ${src}`);

  document.body.appendChild(script); // Append script to body
}

function removeScripts() {
  const scripts = document.querySelectorAll("script");
  scripts.forEach((script) => {
    if (script.src && script.src.includes("/static/js")) {
      script.parentNode.removeChild(script); // Remove the script from the DOM
    }
  });
}

// Handle back/forward button
window.onpopstate = function () {
  loadContent(window.location.pathname);
};

// Load the initial content
window.onload = function () {
  loadContent(window.location.pathname);
};

var themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
var themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");

// Initialize the theme based on local storage or system preference
function initializeTheme() {
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
    if (themeToggleLightIcon) {
      themeToggleLightIcon.classList.remove("hidden");
    }
  } else {
    if (themeToggleDarkIcon) {
      themeToggleDarkIcon.classList.remove("hidden");
    }
  }
}
// Initialize theme on page load
initializeTheme();

// Prevent showing the button when already on the '/anonymous' route
function toggleAnonymousChatbotButton() {
  const currentPath = window.location.pathname;
  const button = document.getElementById("anonymousChatbotButton");
  if (currentPath === "/anonymous") {
    // Hide the button if the user is on the anonymous page
    if (button) button.style.display = "none";
  } else {
    // Show the button if the user is not on the anonymous page
    if (button) button.style.display = "flex";
  }
}

toggleAnonymousChatbotButton();
