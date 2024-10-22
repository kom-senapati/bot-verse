document
  .getElementById("signup-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm password").value;
    if (password !== confirmPassword) {
      document.getElementById("signup-error").textContent = "Passwords do not match!";
      return; // Stop form submission if passwords don't match
    }
    const formData = new FormData(document
      .getElementById("signup-form")); // Collect form data

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        body: formData,
      });

      const data = await response.json(); // Assuming the server responds with JSON

      if (!response.ok) {
        throw new Error(data.message);
      }

      if (data.success) {
        // Handle success (e.g., redirect to login page or show a success message)
        navigate(event, "/login"); // Navigate to the login page or another page
      } else {
        // Handle errors returned by the server
        document.getElementById("signup-error").textContent =
          data.message || "An error occurred.";
      }
    } catch (error) {
      console.error("Signup failed:", error);
      document.getElementById("signup-error").textContent = error.message;
    }
  });
