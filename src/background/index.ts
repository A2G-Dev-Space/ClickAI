// Background Service Worker for Click AI Extension

console.log('Click AI: Background service worker loaded')

// Install event - first install
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Click AI: Extension installed', details.reason)

  if (details.reason === 'install') {
    // First install: Initialize default settings
    console.log('Click AI: First install, initializing...')

    // Set default settings
    chrome.storage.sync.set({
      settings: {
        theme: 'light',
        language: 'ko',
      }
    })

    // Show welcome notification
    console.log('Click AI: Welcome!')
  } else if (details.reason === 'update') {
    // Update: Run migration if needed
    console.log('Click AI: Extension updated from', details.previousVersion)
  }

  // Setup context menus
  setupContextMenus()
})

// Startup event - browser startup
chrome.runtime.onStartup.addListener(() => {
  console.log('Click AI: Browser started')
})

// Setup context menus
function setupContextMenus() {
  // Remove all existing menus first
  chrome.contextMenus.removeAll(() => {
    // Main menu
    chrome.contextMenus.create({
      id: 'click-ai-main',
      title: 'Click AI',
      contexts: ['selection']
    })

    // Submenu items
    chrome.contextMenus.create({
      id: 'click-ai-grammar',
      parentId: 'click-ai-main',
      title: '문법 교정',
      contexts: ['selection']
    })

    chrome.contextMenus.create({
      id: 'click-ai-translate',
      parentId: 'click-ai-main',
      title: '번역',
      contexts: ['selection']
    })

    chrome.contextMenus.create({
      id: 'click-ai-refine',
      parentId: 'click-ai-main',
      title: '표현 다듬기',
      contexts: ['selection']
    })

    console.log('Click AI: Context menus created')
  })
}

// Context menu click handler
chrome.contextMenus.onClicked.addListener((info, _tab) => {
  console.log('Click AI: Context menu clicked', info.menuItemId, info.selectionText)

  // Handle different menu actions
  // This will be implemented in Milestone 4
})

// Message handler
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  console.log('Click AI: Message received', message.type)

  // Message routing will be implemented in Milestone 2

  return true // Keep message channel open for async response
})

// Keep service worker alive during long operations
let keepAliveInterval: NodeJS.Timeout | null = null

function startKeepalive() {
  if (keepAliveInterval) return

  keepAliveInterval = setInterval(() => {
    chrome.runtime.getPlatformInfo() // Dummy call to keep SW alive
  }, 20000) // Every 20 seconds

  console.log('Click AI: Keepalive started')
}

function stopKeepalive() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval)
    keepAliveInterval = null
    console.log('Click AI: Keepalive stopped')
  }
}

// Export for use in other modules (if needed)
export { startKeepalive, stopKeepalive }
