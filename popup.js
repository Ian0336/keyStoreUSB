const showBtn = document.getElementById("showBtn");

showBtn.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { message: "show" },
      function (response) {
        console.log(response);
      }
    );
  });
});
