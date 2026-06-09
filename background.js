// Listens for GitHub's dynamic URL transitions at the browser level
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  // Ensure we are only looking at GitHub pull requests
  if (details.url && details.url.includes("github.com") && details.url.includes("/pull/")) {

    // Inject a tiny trigger message to the content script on that specific tab
    chrome.tabs.sendMessage(details.tabId, { action: "RE_SCAN_GITHUB_LAYOUT" })
      .catch(() => { /* Silence exceptions for uninitialized tabs */ });
  }
});