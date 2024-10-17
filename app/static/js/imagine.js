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
  const promptText = formData.get("prompt");
  const imageSrc = `https://image.pollinations.ai/prompt/${promptText}`;

  // Create the new image element dynamically with download button and prompt text
  const newImageHTML = `
    <div class="flex justify-start items-center space-x-2 mb-2">
      <div class="max-w-md bg-white dark:bg-dark dark:text-dark/90 text-gray-900 rounded-xl p-4 drop-shadow-md shadow border border-gray-100 dark:border-darker flex flex-col">
        <img class="rounded-md" src="${imageSrc}" alt="${promptText}">
        <p class="text-center mt-2">${promptText}</p>
        <div class="flex justify-between mt-2">
          <button type="button" class="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 drop-shadow transition duration-200 flex items-center justify-center download-btn" title="Download" data-url="${imageSrc}">
            <i class="fa-solid fa-download"></i>
          </button>
        </div>
      </div>
    </div>`;

  // Append the new image to the container
  document
    .getElementById("imagesContainer")
    .insertAdjacentHTML("beforeend", newImageHTML);

  scrollToBottom();
  // TODO
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
