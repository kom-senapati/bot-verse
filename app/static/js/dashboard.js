document
  .getElementById("chatbot-search")
  .addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    filterChatbots(document.getElementById("system-chatbots"), searchTerm);
    filterChatbots(document.getElementById("user-chatbots"), searchTerm);
  });

function filterChatbots(container, searchTerm) {
  if (container) {
    const chatbots = container.getElementsByClassName("chatbot-card");
    Array.from(chatbots).forEach(function (chatbot) {
      const name = chatbot.querySelector("h3").textContent.toLowerCase();
      const description = chatbot.querySelector("p").textContent.toLowerCase();
      if (name.includes(searchTerm) || description.includes(searchTerm)) {
        chatbot.style.display = "";
        chatbot.classList.remove("hidden");
      } else {
        chatbot.style.display = "none";
        chatbot.classList.add("hidden");
      }
    });
  }
}

// LOAD MORE BUTTON
/* SORRY @Ayushjhawar8 if you are reading these changes are removed in conflict
   So I am adding them for you Broo
*/
var viewMoreButton = document.getElementById("view-more-button");
var viewLessButton = document.getElementById("view-less-button");
var chatbots = document.querySelectorAll("#system-chatbots .chatbot-card");

viewMoreButton.addEventListener("click", function () {
  chatbots.forEach(function (chatbot) {
    chatbot.classList.remove("hidden");
  });
  viewMoreButton.classList.add("hidden");
  viewLessButton.classList.remove("hidden");
});

viewLessButton.addEventListener("click", function () {
  chatbots.forEach(function (chatbot, index) {
    if (index > 2) {
      chatbot.classList.add("hidden");
    }
  });
  viewLessButton.classList.add("hidden");
  viewMoreButton.classList.remove("hidden");
});

async function handlePublish(event) {
  event.preventDefault(); // Prevent the default form submission
  var form = event.target; // Get the form that triggered the event
  var formData = new FormData(form); // Collect form data
  var response = await fetch(form.action, {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    var result = await response.json(); // Parse the JSON response

    // Optionally update the UI or reload the content
    loadContent(window.location.pathname); // Reload current content if needed
  } else {
    console.error("Failed to publish/unpublish chatbot:", response.statusText);
  }
}

async function deleteChatbot(event) {
  event.preventDefault(); // Prevent the default form submission
  let confirmation = confirm("Are you sure you want to delete this chatbot?");
  if (!confirmation) return;

  try {
    var form = event.target; // Get the form that triggered the event
    const response = await fetch(form.action, { method: "POST" });

    if (response.ok) {
      const result = await response.json(); // Parse the JSON response

      // Optionally update the UI or reload the content
      loadContent(window.location.pathname); // Reload current content if needed
    } else {
      console.error("Failed delete chatbot:", response.statusText);
    }
  } catch (error) {
    console.error("delete failed:", error);
  }
}

// Attach event listeners to all publish forms
document.querySelectorAll('[id^="publish-form-"]').forEach((form) => {
  form.addEventListener("submit", handlePublish);
});

// Attach event listeners to all delete forms
document.querySelectorAll('[id^="delete-chatbot-form-"]').forEach((form) => {
  form.addEventListener("submit", deleteChatbot);
});

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

// Welcome messages
// Fetch welcome data from the API
fetch("/api/welcome")
  .then((response) => response.json())
  .then((data) => {
    // Update Chatbot of the Day
    document.getElementById("chatbot-name").textContent =
      data.chatbot_of_the_day.name;
    document.getElementById("chatbot-description").textContent =
      data.chatbot_of_the_day.prompt;

    // Update Image of the Day
    document.getElementById("image-description").textContent =
      data.image_of_the_day.prompt;
    document.getElementById(
      "image-of-the-day"
    ).src = `https://image.pollinations.ai/prompt/${data.image_of_the_day.prompt}`;
    document.getElementById("image-title").textContent =
      data.image_of_the_day.title;

    // Update Message of the Day
    document.getElementById("message-of-the-day").textContent =
      data.quote_of_the_day;

    // Update Tip of the Day
    document.getElementById("tip-of-the-day").innerText = data.tip;
  })
  .catch((error) => {
    console.error("Error fetching welcome data:", error);
  });
