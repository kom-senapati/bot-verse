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
      } else {
        chatbot.style.display = "none";
      }
    });
  }
}

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
