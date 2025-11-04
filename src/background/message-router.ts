// Message Router for Click AI Extension

import { Message, MessageType } from '../shared/types'

type MessageHandler = (payload: any, sender: chrome.runtime.MessageSender) => Promise<any>

export class MessageRouter {
  private handlers: Map<MessageType, MessageHandler> = new Map()

  /**
   * Register a message handler for a specific message type
   */
  register(type: MessageType, handler: MessageHandler): void {
    if (this.handlers.has(type)) {
      console.warn(`Message handler for ${type} is being overwritten`)
    }
    this.handlers.set(type, handler)
    console.log(`Message handler registered for ${type}`)
  }

  /**
   * Unregister a message handler
   */
  unregister(type: MessageType): void {
    this.handlers.delete(type)
    console.log(`Message handler unregistered for ${type}`)
  }

  /**
   * Handle incoming message
   */
  async handle(message: Message, sender: chrome.runtime.MessageSender): Promise<any> {
    console.log(`MessageRouter: Handling message type ${message.type}`, {
      from: sender.tab?.id || 'extension',
      timestamp: message.timestamp,
    })

    const handler = this.handlers.get(message.type)

    if (!handler) {
      const error = `No handler registered for message type: ${message.type}`
      console.error(error)
      return {
        success: false,
        error: error,
      }
    }

    try {
      const result = await handler(message.payload, sender)
      return {
        success: true,
        data: result,
      }
    } catch (error) {
      console.error(`Error handling message ${message.type}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any).code || 'UNKNOWN_ERROR',
      }
    }
  }

  /**
   * Get all registered message types
   */
  getRegisteredTypes(): MessageType[] {
    return Array.from(this.handlers.keys())
  }
}

// Create singleton instance
export const messageRouter = new MessageRouter()

// Setup message listener
export function setupMessageListener(): void {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Validate message structure
    if (!message || typeof message.type !== 'string') {
      console.error('Invalid message received:', message)
      sendResponse({ success: false, error: 'Invalid message format' })
      return false
    }

    // Handle message
    messageRouter
      .handle(message as Message, sender)
      .then(sendResponse)
      .catch((error) => {
        console.error('Message handling failed:', error)
        sendResponse({
          success: false,
          error: error.message || 'Message handling failed',
        })
      })

    // Return true to indicate we will send response asynchronously
    return true
  })

  console.log('Message listener set up successfully')
}
