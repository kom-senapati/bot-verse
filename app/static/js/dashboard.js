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
  const formData = new FormData(document.getElementById("publish-form")); // Collect form data
  const response = await fetch(document.getElementById("publish-form").action, {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    const result = await response.json(); // Parse the JSON response

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
    console.log(document.getElementById("delete-chatbot-form").action);
    const response = await fetch(
      document.getElementById("delete-chatbot-form").action,
      { method: "POST" }
    );

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

if (document.getElementById("delete-chatbot-form")) {
  document
    .getElementById("delete-chatbot-form")
    .addEventListener("submit", deleteChatbot);
}

if (document.getElementById("publish-form")) {
  document
    .getElementById("publish-form")
    .addEventListener("submit", handlePublish);
}
