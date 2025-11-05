// Background Service Worker for Click AI Extension

import { setupMessageListener, messageRouter } from './message-router'
import { storageManager, DEFAULT_SETTINGS } from './storage'
import { llmClient } from './llm-client'
import { MessageType } from '../shared/types'
import { generateUUID } from '../shared/utils'

console.log('Click AI: Background service worker loaded')

// Initialize on startup
async function initialize() {
  // Setup message listener
  setupMessageListener()

  // Register message handlers
  registerMessageHandlers()

  console.log('Click AI: Initialization complete')
}

// Install event - first install
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('Click AI: Extension installed', details.reason)

  if (details.reason === 'install') {
    // First install: Initialize default settings
    console.log('Click AI: First install, initializing...')

    // Set default settings
    await storageManager.saveSettings(DEFAULT_SETTINGS)

    // Show welcome notification
    console.log('Click AI: Welcome!')
  } else if (details.reason === 'update') {
    // Update: Run migration if needed
    console.log('Click AI: Extension updated from', details.previousVersion)
  }

  // Setup context menus
  setupContextMenus()

  // Initialize
  await initialize()
})

// Startup event - browser startup
chrome.runtime.onStartup.addListener(async () => {
  console.log('Click AI: Browser started')
  await initialize()
})

// Setup context menus
function setupContextMenus() {
  // Remove all existing menus first
  chrome.contextMenus.removeAll(() => {
    // Main menu
    chrome.contextMenus.create({
      id: 'click-ai-main',
      title: 'Click AI',
      contexts: ['selection'],
    })

    // Submenu items
    chrome.contextMenus.create({
      id: 'click-ai-grammar',
      parentId: 'click-ai-main',
      title: '문법 교정',
      contexts: ['selection'],
    })

    chrome.contextMenus.create({
      id: 'click-ai-translate',
      parentId: 'click-ai-main',
      title: '번역',
      contexts: ['selection'],
    })

    chrome.contextMenus.create({
      id: 'click-ai-refine',
      parentId: 'click-ai-main',
      title: '표현 다듬기',
      contexts: ['selection'],
    })

    console.log('Click AI: Context menus created')
  })
}

// Register message handlers
function registerMessageHandlers() {
  // Storage operations
  messageRouter.register(MessageType.SAVE_SESSION, async (payload) => {
    await storageManager.saveChatSession(payload)
    return { success: true }
  })

  messageRouter.register(MessageType.LOAD_SESSIONS, async () => {
    const sessions = await storageManager.loadChatSessions()
    return { sessions }
  })

  messageRouter.register(MessageType.DELETE_SESSION, async (payload) => {
    await storageManager.deleteChatSession(payload.sessionId)
    return { success: true }
  })

  // Session summarization
  messageRouter.register(MessageType.SUMMARIZE_SESSION, async (payload) => {
    const { messages } = payload
    const summary = await llmClient.summarize(messages)
    return { summary }
  })

  // Settings operations
  messageRouter.register(MessageType.GET_SETTINGS, async () => {
    const settings = await storageManager.loadSettings()
    return { settings }
  })

  messageRouter.register(MessageType.UPDATE_SETTINGS, async (payload) => {
    await storageManager.saveSettings(payload)
    return { success: true }
  })

  // Chat operations
  messageRouter.register(MessageType.SEND_CHAT, async (payload, sender) => {
    const { messages, sessionId } = payload

    console.log(`Processing chat for session ${sessionId}`)

    // Start streaming
    const messageId = generateUUID()

    try {
      let fullResponse = ''

      for await (const chunk of llmClient.streamChat(messages)) {
        fullResponse += chunk

        // Send chunk to requesting client
        if (sender.tab?.id) {
          chrome.tabs.sendMessage(sender.tab.id, {
            type: MessageType.CHAT_CHUNK,
            payload: { sessionId, messageId, chunk },
            timestamp: Date.now(),
          })
        }
      }

      // Send completion message
      if (sender.tab?.id) {
        chrome.tabs.sendMessage(sender.tab.id, {
          type: MessageType.CHAT_COMPLETE,
          payload: { sessionId, messageId },
          timestamp: Date.now(),
        })
      }

      return { success: true, messageId, response: fullResponse }
    } catch (error) {
      console.error('Chat error:', error)

      // Send error message
      if (sender.tab?.id) {
        chrome.tabs.sendMessage(sender.tab.id, {
          type: MessageType.CHAT_ERROR,
          payload: {
            sessionId,
            messageId,
            error: error instanceof Error ? error.message : 'Unknown error',
          },
          timestamp: Date.now(),
        })
      }

      throw error
    }
  })

  messageRouter.register(MessageType.CANCEL_CHAT, async () => {
    llmClient.cancel()
    return { success: true }
  })

  console.log('Message handlers registered:', messageRouter.getRegisteredTypes().length)
}

// Context menu click handler
import { handleContextMenuClick } from './context-menu-handler'

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log('Click AI: Context menu clicked', info.menuItemId, info.selectionText)

  if (info.selectionText && tab?.id) {
    await handleContextMenuClick(info.menuItemId as string, info.selectionText, tab.id)
  }
})

// Keep service worker alive during long operations
let keepAliveInterval: NodeJS.Timeout | null = null

export function startKeepalive() {
  if (keepAliveInterval) return

  keepAliveInterval = setInterval(() => {
    chrome.runtime.getPlatformInfo() // Dummy call to keep SW alive
  }, 20000) // Every 20 seconds

  console.log('Click AI: Keepalive started')
}

export function stopKeepalive() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval)
    keepAliveInterval = null
    console.log('Click AI: Keepalive stopped')
  }
}

// Start initialization
initialize()
