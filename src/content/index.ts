// Content Script for Click AI Extension

import { popoverRenderer } from './popover-renderer'
import { ContextMenuResult } from '@/shared/types'

console.log('Click AI: Content script loaded on', window.location.href)

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Click AI Content: Message received', message.type, message.payload)

  if (message.type === 'SHOW_CONTEXT_RESULT') {
    // This message type is now dual-purpose
    if (message.payload.referenceId) {
      handleHighlight(message.payload.referenceId)
    } else {
      const result = message.payload as ContextMenuResult
      popoverRenderer.show(result)
    }
    sendResponse({ success: true })
  } else if (message.type === 'SHOW_CONTEXT_ERROR') {
    console.error('Context menu error:', message.payload.error)
    sendResponse({ success: true })
  } else if (message.type === 'PARSE_PAGE') {
    // Parse page content using Readability (async)
    import('./page-parser')
      .then(({ pageParser }) => {
        const pageData = pageParser.getPageMetadata()

        // Check for sensitive information
        const sensitiveInfo = pageParser.checkForSensitiveInfo(pageData.content)
        if (sensitiveInfo.length > 0) {
          console.warn('Sensitive information detected and redacted:', sensitiveInfo)
        }

        sendResponse({ success: true, data: pageData })
      })
      .catch((error) => {
        console.error('Page parsing error:', error)
        sendResponse({ success: false, error: error.message })
      })

    return true // Keep channel open for async response
  }

  return true // Keep message channel open
})

function handleHighlight(referenceId: string) {
  const element = document.querySelector(`[data-click-ai-ref-id="${referenceId}"]`)
  if (element) {
    console.log('Highlighting element:', element)
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })

    // Apply a temporary highlight style
    const originalStyle = (element as HTMLElement).style.backgroundColor
    ;(element as HTMLElement).style.transition = 'background-color 0.5s ease'
    ;(element as HTMLElement).style.backgroundColor = 'rgba(255, 255, 0, 0.5)' // Yellow highlight

    setTimeout(() => {
      ;(element as HTMLElement).style.backgroundColor = originalStyle
      setTimeout(() => {
        ;(element as HTMLElement).style.transition = ''
      }, 500)
    }, 2000) // Highlight for 2 seconds
  } else {
    console.warn(`Element with reference ID ${referenceId} not found.`)
  }
}

// Export for use in other modules (if needed)
export {}
