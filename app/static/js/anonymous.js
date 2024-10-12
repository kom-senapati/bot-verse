// Function to retrieve previous chats in the desired format
function getPreviousChats() {
  const chats = []; // Initialize an array to hold previous chats

  // Select all messages (both user and assistant) that have the correct classes
  const allMessages = document.querySelectorAll(
    ".flex.justify-end .max-w-xs, .flex.justify-start .max-w-md"
  );

  // Iterate through all messages
  allMessages.forEach((message) => {
    // Determine the role based on the message's parent class
    const isUserMessage = message.classList.contains("max-w-xs");
    const content = message.textContent.trim(); // Get the content of the message

    // Push the chat object to the array with the correct role
    chats.push({
      role: isUserMessage ? "user" : "assistant",
      content,
    });
  });

  return chats; // Return the array of previous chats
}

// Function to send a message to the anonymous chatbot
async function sendAnonymousMessage(event) {
  event.preventDefault(); // Prevent the default form submission

  const messageForm = document.getElementById("anonymous-message-form"); // Get the form element
  const formData = new FormData(messageForm); // Collect form data
  const userQuery = formData.get("query");

  // Get previous chats in the desired format and append them to form data
  const prevChats = getPreviousChats();
  formData.append("prev", JSON.stringify(prevChats));
  console.log(prevChats);

  try {
    const updatedChats = [...prevChats, { role: "user", content: userQuery }];
    const response = await fetch("/api/anonymous", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "An error occurred."); // Handle non-200 responses
    }

    const data = await response.json(); // Assuming the server responds with JSON

    if (data.success) {
      // Construct the updated chats array
      // Prepare the updated chats list

      // Add the assistant's response
      updatedChats.push({ role: "assistant", content: data.response });
      updateChatUI(updatedChats); // Update the chat UI with the new messages
      setTimeout(scrollToBottom, 100); // Scroll to the bottom of the chat
    } else {
      // Handle errors returned by the server
      document.getElementById("error").textContent =
        data.error || "An error occurred.";
    }
  } catch (error) {
    console.error("Failed:", error);
    document.getElementById("error").textContent = error.message; // Display error message
  }
}

// Function to update the chat UI with new messages
function updateChatUI(updatedChats) {
  const chatContainer = document.getElementById("chatContainer"); // Update the ID to match your container
  chatContainer.innerHTML = ""; // Clear current chat

  if (updatedChats.length === 0) {
    // If there are no chats, show a message
    chatContainer.innerHTML = `<p class="text-center text-gray-500">No messages for this chatbot yet.</p>`;
    return;
  }

  updatedChats.forEach((chat) => {
    // Append user message
    if (chat.role === "user") {
      // Use === for comparison
      const userMessage = `
        <div class="flex justify-end">
          <div class="max-w-xs bg-blue-500 text-white rounded-xl p-4 drop-shadow shadow">
            <p class="text-sm">${chat.content}</p>
          </div>
        </div>`;
      chatContainer.insertAdjacentHTML("beforeend", userMessage);
    }

    // Append assistant response
    if (chat.role === "assistant") {
      // Check if the role is assistant
      const assistantResponse = `
        <div class="flex justify-start items-center space-x-2 mb-2">
          <div class="max-w-md bg-white dark:bg-dark dark:text-dark/90 text-gray-900 rounded-xl p-4 drop-shadow-md shadow border border-gray-100 dark:border-darker flex flex-col">
            <p class="text-sm chat-response flex-1">
              ${chat.content} <!-- Use markdown rendering if necessary -->
            </p>
          </div>
        </div>`;
      chatContainer.insertAdjacentHTML("beforeend", assistantResponse);
    }
  });

  // Scroll to the bottom after updating the chat
  scrollToBottom();
}

// Scroll to the bottom of the chat container
function scrollToBottom() {
  const chatContainer = document.getElementById("chatContainer");
  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom
  } else {
    console.error("chatContainer not found");
  }
}

// Event listener for the message form submission
document
  .getElementById("anonymous-message-form")
  .addEventListener("submit", sendAnonymousMessage);
