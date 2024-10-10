var synth = window.speechSynthesis;
var voiceSelect = document.getElementById("voice-selection");
var form = document.getElementById("voice-form");
var successMessage = document.getElementById("success-message");
var previewButton = document.getElementById("preview-button");

var voices = [];
var savedVoice = localStorage.getItem("preferredVoice");

// Populate voices when they are loaded (may not be available immediately)
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = populateVoiceList;
}

if (form) {
  // Save the selected voice to localStorage when the form is submitted
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const selectedVoice = voiceSelect.value;

    // Save the selected voice to localStorage
    localStorage.setItem("preferredVoice", selectedVoice);

    // Display success message
    successMessage.textContent = `Voice preference saved successfully!`;
    successMessage.classList.remove("hidden");

    // Hide success message after a few seconds
    setTimeout(() => {
      successMessage.classList.add("hidden");
    }, 3000); // Adjust duration as needed
  });
}

if (previewButton) {
  // Function to preview speech
  previewButton.addEventListener("click", function () {
    const utterance = new SpeechSynthesisUtterance("Hello World");
    const selectedVoiceName = voiceSelect.value;
    const selectedVoice = voices.find(
      (voice) => voice.name === selectedVoiceName
    );

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    synth.speak(utterance);
  });
}

if (form) {
  // Populate voice options
  function populateVoiceList() {
    voices = synth.getVoices();

    voiceSelect.innerHTML = ""; // Clear current options

    voices.forEach((voice) => {
      const option = document.createElement("option");
      option.textContent = `${voice.name} (${voice.lang})`;
      option.value = voice.name;

      if (savedVoice && voice.name === savedVoice) {
        option.selected = true; // Preselect the saved voice
      }

      voiceSelect.appendChild(option);
    });
  }

  // Call the function to populate the voice list on page load
  populateVoiceList();
}

/**
 *
 *
 * NOW FOR EDIT PROFILE
 */

var editForm = document.getElementById("edit-profile-form");

async function handleProfileEdit(event) {
  try {
    event.preventDefault(); // Prevent the default form submission
    const formData = new FormData(editForm); // Get the form data
    const response = await fetch("/api/profile/edit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    if (data.success) {
      navigate(event, "/profile");
    } else {
      // Handle errors returned by the server
      document.getElementById("profile-edit-error").textContent =
        data.message || "An error occurred.";
    }
  } catch (error) {
    console.error("login failed:", error);
    document.getElementById("profile-edit-error").textContent = error.message;
  }
}

if (editForm) {
  editForm.addEventListener("submit", handleProfileEdit);
}

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
