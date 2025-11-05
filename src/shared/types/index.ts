// Shared TypeScript types for Click AI Extension

export enum MessageType {
  // Chat-related
  SEND_CHAT = 'SEND_CHAT',
  CHAT_CHUNK = 'CHAT_CHUNK',
  CHAT_COMPLETE = 'CHAT_COMPLETE',
  CHAT_ERROR = 'CHAT_ERROR',
  CANCEL_CHAT = 'CANCEL_CHAT',

  // Context menu
  CONTEXT_MENU_ACTION = 'CONTEXT_MENU_ACTION',
  SHOW_CONTEXT_RESULT = 'SHOW_CONTEXT_RESULT',

  // Page parsing
  PARSE_PAGE = 'PARSE_PAGE',
  PAGE_PARSED = 'PAGE_PARSED',

  // Storage operations
  SAVE_SESSION = 'SAVE_SESSION',
  LOAD_SESSIONS = 'LOAD_SESSIONS',
  DELETE_SESSION = 'DELETE_SESSION',
  SUMMARIZE_SESSION = 'SUMMARIZE_SESSION',

  // Settings
  UPDATE_SETTINGS = 'UPDATE_SETTINGS',
  GET_SETTINGS = 'GET_SETTINGS',

  // Update checker
  CHECK_UPDATES = 'CHECK_UPDATES',
  UPDATE_AVAILABLE = 'UPDATE_AVAILABLE',
}

export interface Message<T = any> {
  type: MessageType
  payload: T
  timestamp: number
  requestId?: string // For request-response pattern
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
  pageContext?: PageContext
}

export interface PageContext {
  url: string
  title: string
  content: string
  publishDate?: string
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto'
  language: 'ko' | 'en'
  llmEndpoint?: string
  llmApiKey?: string
  llmModel?: string
}

export interface ContextMenuResult {
  original: string
  result: string
  type: 'grammar' | 'translate' | 'refine'
}
