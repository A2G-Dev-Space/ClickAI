// Zustand store for chat state management

import { create } from 'zustand'
import { ChatSession, ChatMessage, PageContext, Message, MessageType } from '@/shared/types'
import { generateUUID } from '@/shared/utils'

interface ChatStore {
  // State
  currentSession: ChatSession | null
  messages: ChatMessage[]
  isLoading: boolean
  isChatWithPageEnabled: boolean
  pageContext: PageContext | null
  error: string | null

  // Actions
  sendMessage: (content: string) => Promise<void>
  cancelMessage: () => void
  createNewSession: () => void
  loadSession: (sessionId: string) => Promise<void>
  loadAllSessions: () => Promise<ChatSession[]>
  deleteSession: (sessionId: string) => Promise<void>
  toggleChatWithPage: () => Promise<void>
  clearError: () => void
  addMessageChunk: (messageId: string, chunk: string) => void
  completeMessage: (messageId: string) => void
  setError: (error: string) => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // Initial state
  currentSession: null,
  messages: [],
  isLoading: false,
  isChatWithPageEnabled: false,
  pageContext: null,
  error: null,

  // Create new chat session
  createNewSession: () => {
    const newSession: ChatSession = {
      id: generateUUID(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    set({
      currentSession: newSession,
      messages: [],
      pageContext: null,
      isChatWithPageEnabled: false,
      error: null,
    })

    console.log('New session created:', newSession.id)
  },

  // Load existing session
  loadSession: async (sessionId: string) => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: MessageType.LOAD_SESSIONS,
        payload: {},
        timestamp: Date.now(),
      })

      if (response.success) {
        const session = response.data.sessions.find((s: ChatSession) => s.id === sessionId)

        if (session) {
          set({
            currentSession: session,
            messages: session.messages,
            pageContext: session.pageContext,
            error: null,
          })
          console.log('Session loaded:', sessionId)
        }
      }
    } catch (error) {
      console.error('Failed to load session:', error)
      set({ error: 'Failed to load session' })
    }
  },

  // Load all sessions
  loadAllSessions: async () => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: MessageType.LOAD_SESSIONS,
        payload: {},
        timestamp: Date.now(),
      })

      if (response.success) {
        return response.data.sessions
      }
      return []
    } catch (error) {
      console.error('Failed to load sessions:', error)
      return []
    }
  },

  // Delete session
  deleteSession: async (sessionId: string) => {
    try {
      await chrome.runtime.sendMessage({
        type: MessageType.DELETE_SESSION,
        payload: { sessionId },
        timestamp: Date.now(),
      })

      // If current session was deleted, create new one
      const currentSession = get().currentSession
      if (currentSession?.id === sessionId) {
        get().createNewSession()
      }
    } catch (error) {
      console.error('Failed to delete session:', error)
      set({ error: 'Failed to delete session' })
    }
  },

  // Send message
  sendMessage: async (content: string) => {
    const state = get()
    let session = state.currentSession

    // Create new session if none exists
    if (!session) {
      get().createNewSession()
      session = get().currentSession!
    }

    // Create user message
    const userMessage: ChatMessage = {
      id: generateUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }

    // Add user message to state
    const newMessages = [...state.messages, userMessage]
    set({ messages: newMessages, isLoading: true, error: null })

    // Update session title if first message
    if (session.messages.length === 0) {
      session.title = content.substring(0, 50) + (content.length > 50 ? '...' : '')
    }

    // Create assistant message placeholder
    const assistantMessage: ChatMessage = {
      id: generateUUID(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }

    set({ messages: [...newMessages, assistantMessage] })

    try {
      // Setup listener for chunks
      const messageListener = (message: Message) => {
        if (message.type === MessageType.CHAT_CHUNK) {
          get().addMessageChunk(assistantMessage.id, message.payload.chunk)
        } else if (message.type === MessageType.CHAT_COMPLETE) {
          get().completeMessage(assistantMessage.id)
        } else if (message.type === MessageType.CHAT_ERROR) {
          get().setError(message.payload.error)
        }
      }

      chrome.runtime.onMessage.addListener(messageListener)

      // Send message to background
      const response = await chrome.runtime.sendMessage({
        type: MessageType.SEND_CHAT,
        payload: {
          messages: [...newMessages, assistantMessage],
          sessionId: session.id,
        },
        timestamp: Date.now(),
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to send message')
      }

      // Update session
      session.messages = get().messages
      session.updatedAt = Date.now()

      // Save session
      await chrome.runtime.sendMessage({
        type: MessageType.SAVE_SESSION,
        payload: session,
        timestamp: Date.now(),
      })

      // Remove listener
      chrome.runtime.onMessage.removeListener(messageListener)
    } catch (error) {
      console.error('Send message error:', error)
      set({
        error: error instanceof Error ? error.message : 'Failed to send message',
        isLoading: false,
      })
    }
  },

  // Cancel ongoing message
  cancelMessage: () => {
    chrome.runtime.sendMessage({
      type: MessageType.CANCEL_CHAT,
      payload: {},
      timestamp: Date.now(),
    })

    set({ isLoading: false })
  },

  // Add chunk to streaming message
  addMessageChunk: (messageId: string, chunk: string) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, content: msg.content + chunk } : msg
      ),
    }))
  },

  // Complete streaming message
  completeMessage: (messageId: string) => {
    set({ isLoading: false })
    console.log('Message completed:', messageId)
  },

  // Set error
  setError: (error: string) => {
    set({ error, isLoading: false })
  },

  // Clear error
  clearError: () => {
    set({ error: null })
  },

  // Toggle chat with page
  toggleChatWithPage: async () => {
    const state = get()
    const newValue = !state.isChatWithPageEnabled

    if (newValue) {
      // Parse current page
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

        if (tab.id) {
          const response = await chrome.tabs.sendMessage(tab.id, {
            type: MessageType.PARSE_PAGE,
            payload: {},
            timestamp: Date.now(),
          })

          if (response.success) {
            set({
              pageContext: response.data,
              isChatWithPageEnabled: true,
            })
            console.log('Page context loaded')
          }
        }
      } catch (error) {
        console.error('Failed to parse page:', error)
        set({ error: 'Failed to parse page content' })
      }
    } else {
      set({
        isChatWithPageEnabled: false,
        pageContext: null,
      })
    }
  },
}))
