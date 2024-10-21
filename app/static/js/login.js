document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(document.getElementById("login-form")); // Collect form data

    try {
      const response = await fetch("/api/login?type=session", {
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

function initializePasswordToggle() {
  const togglePassword = document.querySelector("#toggle-password");
  const passwordInput = document.querySelector("#password");
  const eyeIcon = document.querySelector("#eye-icon");

  if (togglePassword) {
    togglePassword.addEventListener("click", function () {
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      eyeIcon.textContent =
        type === "password" ? "visibility" : "visibility_off";
    });
  }
}

// Initialize the eye icon functionality on the login form
initializePasswordToggle();
