var messageForm = document.getElementById("prompt-form");
var queryInput = document.getElementById("prompt");
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

function scrollToBottom() {
  const imagesContainer = document.getElementById("imagesContainer");
  setTimeout(() => {
    imagesContainer.scrollTop = imagesContainer.scrollHeight;
  }, 100); // Timeout to ensure the DOM update happens first
}

async function generateImage(event) {
  event.preventDefault(); // Prevent the default form submission

  const formData = new FormData(messageForm); // Collect form data

  try {
    const response = await fetch(`/api/create_image`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json(); // Assuming the server responds with JSON

    if (!response.ok) {
      throw new Error(data.message);
    }

    if (data.success) {
      loadContent("/imagine");
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

messageForm.addEventListener("submit", generateImage);

// Download button event listener
document.addEventListener("click", function (event) {
  if (event.target.closest(".download-btn")) {
    var downloadBtn = event.target.closest(".download-btn");
    var imageUrl = downloadBtn.getAttribute("data-url");

    // Create a temporary anchor element to download the image
    var a = document.createElement("a");
    a.href = imageUrl;
    a.download = imageUrl.split("/").pop(); // Extract the filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
});
