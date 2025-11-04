// Content Script for Click AI Extension

console.log('Click AI: Content script loaded on', window.location.href)

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  console.log('Click AI Content: Message received', message.type)

  // Message handling will be implemented in later milestones

  return true // Keep message channel open
})

// Export for use in other modules (if needed)
export {}
