if (window.location.pathname.includes("update")) {
  async function updateChatbot(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(document.getElementById("update-chatbot")); // Collect form data

    try {
      const response = await fetch(
        document.getElementById("update-chatbot").action,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json(); // Assuming the server responds with JSON

      if (!response.ok) {
        throw new Error(data.message);
      }

      if (data.success) {
        // Handle success (e.g., redirect to dashboard or show a success message)
        navigate(event, "/dashboard"); // Navigate to the main page or another page
      } else {
        // Handle errors returned by the server
        document.getElementById("update-chatbot-error").textContent =
          data.message || "An error occurred.";
      }
    } catch (error) {
      console.error("update failed:", error);
      document.getElementById("update-chatbot-error").textContent =
        error.message;
    }
  }

  if (document.getElementById("update-chatbot")) {
    document
      .getElementById("update-chatbot")
      .addEventListener("submit", updateChatbot);
  }
} else {
  var messageForm = document.getElementById("message-form");
  var queryInput = document.getElementById("query");
  var startRecordBtn = document.getElementById("start-record");
  var stopRecordBtn = document.getElementById("stop-record");
  var recognition;

  if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = function () {
      startRecordBtn.classList.add("hidden");
      stopRecordBtn.classList.remove("hidden");
    };

    recognition.onend = function () {
      startRecordBtn.classList.remove("hidden");
      stopRecordBtn.classList.add("hidden");
    };

    recognition.onresult = function (event) {
      var transcript = event.results[event.resultIndex][0].transcript;
      queryInput.value = transcript;
    };
    recognition.onerror = function (event) {
      console.log(event);
    };

    startRecordBtn.addEventListener("click", function () {
      recognition.start();
    });

    stopRecordBtn.addEventListener("click", function () {
      recognition.stop();
    });
  } else {
    console.log("Speech recognition not supported in this browser.");
  }

  var synth = window.speechSynthesis;
  var currentUtterance = null; // Track the current utterance
  var isSpeaking = false; // Flag to track if speech is active

  function speakResponse(response, btn) {
    if (isSpeaking) {
      // If speech is active, stop it
      synth.cancel();
      isSpeaking = false;
      btn.innerHTML = '<i class="fa-solid fa-volume-up"></i>'; // Change button icon to play
    } else {
      // If no speech is active, start speaking
      currentUtterance = new SpeechSynthesisUtterance(response);
      // Retrieve the preferred voice from localStorage
      var savedVoice = localStorage.getItem("preferredVoice");
      var voices = synth.getVoices();
      var selectedVoice = voices.find((voice) => voice.name === savedVoice);
      if (selectedVoice) {
        currentUtterance.voice = selectedVoice; // Use the saved voice
      } else {
        currentUtterance.lang = "en-US"; // Fallback language
      }

      synth.speak(currentUtterance);
      isSpeaking = true;
      btn.innerHTML = '<i class="fa-solid fa-stop"></i>'; // Change button icon to stop

      currentUtterance.onend = function () {
        // When speech ends, reset the button and state
        isSpeaking = false;
        btn.innerHTML = '<i class="fa-solid fa-volume-up"></i>'; // Change button icon to play
      };
    }
  }

  var speakButtons = document.querySelectorAll(".speak-btn");

  speakButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var responseElement =
        btn.previousElementSibling.querySelector(".chat-response");
      var responseText = responseElement.getAttribute("data-response");

      if (responseText) {
        speakResponse(responseText, btn);
      }
    });
  });

  function scrollToBottom() {
    var chatContainer = document.getElementById("chatContainer");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  async function sendMessage(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(messageForm); // Collect form data

    try {
      const response = await fetch(`/api/chatbot/${formData.get("id")}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json(); // Assuming the server responds with JSON

      if (!response.ok) {
        throw new Error(data.message);
      }

      if (data.success) {
        loadContent(`/chatbot/${formData.get("id")}`);
        setTimeout(scrollToBottom, 100);
      } else {
        // Handle errors returned by the server
        document.getElementById("error").textContent =
          data.message || "An error occurred.";
      }
    } catch (error) {
      console.error("failed:", error);
      document.getElementById("error").textContent = error.message;
    }
  }

  // Populate voices when they are loaded
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = () => {
      // Call it again to ensure the voices are loaded properly
      var savedVoice = localStorage.getItem("preferredVoice");
      var voices = synth.getVoices();
      if (savedVoice) {
        var selectedVoice = voices.find((voice) => voice.name === savedVoice);
        if (selectedVoice) {
          // Optionally, you can do something with the selected voice here
        }
      }
    };
  }

  messageForm.addEventListener("submit", sendMessage);
}
