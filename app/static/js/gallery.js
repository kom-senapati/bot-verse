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
