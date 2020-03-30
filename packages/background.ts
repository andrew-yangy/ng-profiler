const connections = {};

chrome.runtime.onConnect.addListener(function (port) {
  const extensionListener = function (message, sender) {
    // other message handling
  };
  connections[port.name] = port;
  console.log(port);
  // Listen to messages sent from the DevTools page
  port.onMessage.addListener(extensionListener);

  port.onDisconnect.addListener(function(port) {
    console.log(port, 'disconnect');
    port.onMessage.removeListener(extensionListener);
    delete connections[port.name];
  });
});

// Receive message from content script and relay to the devTools page for the
// current tab
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Messages from content scripts should have sender.tab set
  if (sender.tab) {
    const tabId = sender.tab.id;
    console.log(connections, tabId);
    if (tabId in connections) {
      connections[tabId].postMessage(request);
    } else {
      console.log("Tab not found in connection list.");
    }
  } else {
    console.log("sender.tab not defined.");
  }
  return true;
});