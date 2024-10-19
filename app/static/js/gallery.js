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

async function likeImage(imageId) {
  try {
    const response = await fetch(`/api/image/${imageId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    const data = await response.json();

    // Update the like count on the frontend
    const likeCountElement = document.getElementById(`like-count-${imageId}`);
    likeCountElement.innerText = parseInt(likeCountElement.innerText) + 1;
    console.log(data.message);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

async function reportImage(imageId) {
  try {
    const response = await fetch(`/api/image/${imageId}/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    const data = await response.json();

    // Update the like count on the frontend
    const reportCountElement = document.getElementById(
      `report-count-${imageId}`
    );
    reportCountElement.innerText = parseInt(reportCountElement.innerText) + 1;
    console.log(data.message);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}
