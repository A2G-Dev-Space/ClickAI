// Content Script for Click AI Extension

import { popoverRenderer } from './popover-renderer'
import { ContextMenuResult } from '@/background/context-menu-handler'

console.log('Click AI: Content script loaded on', window.location.href)

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Click AI Content: Message received', message.type)

  if (message.type === 'SHOW_CONTEXT_RESULT') {
    const result = message.payload as ContextMenuResult
    popoverRenderer.show(result)
    sendResponse({ success: true })
  } else if (message.type === 'SHOW_CONTEXT_ERROR') {
    console.error('Context menu error:', message.payload.error)
    sendResponse({ success: true })
  } else if (message.type === 'PARSE_PAGE') {
    // Parse page content using Readability (async)
    import('./page-parser').then(({ pageParser }) => {
      const pageData = pageParser.getPageMetadata()

      // Check for sensitive information
      const sensitiveInfo = pageParser.checkForSensitiveInfo(pageData.content)
      if (sensitiveInfo.length > 0) {
        console.warn('Sensitive information detected and redacted:', sensitiveInfo)
      }

      sendResponse({ success: true, data: pageData })
    }).catch((error) => {
      console.error('Page parsing error:', error)
      sendResponse({ success: false, error: error.message })
    })

    return true // Keep channel open for async response
  }

  return true // Keep message channel open
})

// Export for use in other modules (if needed)
export {}
