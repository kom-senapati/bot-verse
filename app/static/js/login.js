document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const loginErrorElement = document.getElementById("login-error");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit);
  }

  // Function to handle form submission
  async function handleLoginSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(loginForm); // Collect form data

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: formData,
      });

      const data = await response.json(); // Assuming the server responds with JSON

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      if (data.success) {
        // Handle success (e.g., redirect to dashboard or show a success message)
        navigateTo("/dashboard"); // Navigate to the main page or another page
      } else {
        // Handle errors returned by the server
        displayError(data.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      displayError(error.message || "An unexpected error occurred.");
    }
  }

  // Function to display errors
  function displayError(message) {
    if (loginErrorElement) {
      loginErrorElement.textContent = message;
    }
  }

  // Function to navigate to another page
  function navigateTo(url) {
    window.location.href = url;
  }

  // Initialize the eye icon functionality on the login form
  initializePasswordVisibilityToggle();
});

// Function to handle password visibility toggle
function initializePasswordVisibilityToggle() {
  const togglePassword = document.querySelector("#toggle-password");
  const passwordInput = document.querySelector("#password");
  const eyeIcon = document.querySelector("#eye-icon");

  if (togglePassword && passwordInput && eyeIcon) {
    togglePassword.addEventListener("click", function () {
      const isPassword = passwordInput.getAttribute("type") === "password";
      passwordInput.setAttribute("type", isPassword ? "text" : "password");
      eyeIcon.textContent = isPassword ? "visibility_off" : "visibility";
    });
  }
}
