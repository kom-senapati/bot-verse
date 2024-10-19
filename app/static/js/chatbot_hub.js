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

// like button
async function likeChatbot(chatbotId) {
  try {
    const response = await fetch(`/api/chatbot/${chatbotId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    const data = await response.json();

    // Update the like count on the frontend
    const likeCountElement = document.getElementById(`like-count-${chatbotId}`);
    likeCountElement.innerText = parseInt(likeCountElement.innerText) + 1;
    console.log(data.message);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

async function reportChatbot(chatbotId) {
  try {
    const response = await fetch(`/api/chatbot/${chatbotId}/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    const data = await response.json();

    // Update the like count on the frontend
    const reportCountElement = document.getElementById(
      `report-count-${chatbotId}`
    );
    reportCountElement.innerText = parseInt(reportCountElement.innerText) + 1;
    console.log(data.message);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}
