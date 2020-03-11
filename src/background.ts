chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(request);
    if (request.message === "open_new_tab") {
      chrome.tabs.create({"url": request.url});
    }
  }
);