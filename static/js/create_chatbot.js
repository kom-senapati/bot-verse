


document
  .getElementById("create-chatbot")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(document.getElementById("create-chatbot")); // Collect form data

    try {
      const response = await fetch("/api/create_chatbot", {
        method: "POST",
        body: formData,
      });

      const data = await response.json(); // Assuming the server responds with JSON

      if (!response.ok) {
        throw new Error(data.message);
      }

      if (data.success) {
        // Handle success (e.g., redirect to dashboard or show a success message)
        navigate(event, "/dashboard"); // Navigate to the main page or another page
      } else {
        // Handle errors returned by the server
        document.getElementById("login-error").textContent =
          data.message || "An error occurred.";
      }
    } catch (error) {
      console.error("login failed:", error);
      document.getElementById("login-error").textContent = error.message;
    }
  });
