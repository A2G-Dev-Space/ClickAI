// Storage Manager for Click AI Extension

import { ChatSession, UserSettings } from '../shared/types'
import { StorageQuotaError } from '../shared/errors'

// Default user settings
export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'auto',
  language: 'ko',
}

export class StorageManager {
  private static readonly MAX_STORAGE_BYTES = 10 * 1024 * 1024 // 10MB for local storage
  private static readonly SESSION_KEY_PREFIX = 'session_'
  private static readonly SETTINGS_KEY = 'settings'

  /**
   * Save a chat session to chrome.storage.local
   */
  async saveChatSession(session: ChatSession): Promise<void> {
    const key = `${StorageManager.SESSION_KEY_PREFIX}${session.id}`

    try {
      // Check storage quota before saving
      await this.checkStorageQuota()

      await chrome.storage.local.set({ [key]: session })
      console.log(`Chat session saved: ${session.id}`)
    } catch (error) {
      console.error(`Failed to save chat session ${session.id}:`, error)
      throw error
    }
  }

  /**
   * Load all chat sessions from chrome.storage.local
   */
  async loadChatSessions(): Promise<ChatSession[]> {
    try {
      const items = await chrome.storage.local.get(null)
      const sessions: ChatSession[] = []

      for (const [key, value] of Object.entries(items)) {
        if (key.startsWith(StorageManager.SESSION_KEY_PREFIX)) {
          sessions.push(value as ChatSession)
        }
      }

      // Sort by updatedAt descending (most recent first)
      sessions.sort((a, b) => b.updatedAt - a.updatedAt)

      console.log(`Loaded ${sessions.length} chat sessions`)
      return sessions
    } catch (error) {
      console.error('Failed to load chat sessions:', error)
      return []
    }
  }

  /**
   * Get a specific chat session by ID
   */
  async getChatSession(id: string): Promise<ChatSession | null> {
    const key = `${StorageManager.SESSION_KEY_PREFIX}${id}`

    try {
      const result = await chrome.storage.local.get(key)
      return (result[key] as ChatSession) || null
    } catch (error) {
      console.error(`Failed to get chat session ${id}:`, error)
      return null
    }
  }

  /**
   * Delete a chat session by ID
   */
  async deleteChatSession(id: string): Promise<void> {
    const key = `${StorageManager.SESSION_KEY_PREFIX}${id}`

    try {
      await chrome.storage.local.remove(key)
      console.log(`Chat session deleted: ${id}`)
    } catch (error) {
      console.error(`Failed to delete chat session ${id}:`, error)
      throw error
    }
  }

  /**
   * Clear all chat sessions
   */
  async clearAllSessions(): Promise<void> {
    try {
      const items = await chrome.storage.local.get(null)
      const sessionKeys = Object.keys(items).filter((k) =>
        k.startsWith(StorageManager.SESSION_KEY_PREFIX)
      )

      if (sessionKeys.length === 0) {
        console.log('No sessions to clear')
        return
      }

      await chrome.storage.local.remove(sessionKeys)
      console.log(`Cleared ${sessionKeys.length} chat sessions`)
    } catch (error) {
      console.error('Failed to clear chat sessions:', error)
      throw error
    }
  }

  /**
   * Save user settings to chrome.storage.sync
   */
  async saveSettings(settings: UserSettings): Promise<void> {
    try {
      await chrome.storage.sync.set({ [StorageManager.SETTINGS_KEY]: settings })
      console.log('User settings saved')
    } catch (error) {
      console.error('Failed to save user settings:', error)
      throw error
    }
  }

  /**
   * Load user settings from chrome.storage.sync
   */
  async loadSettings(): Promise<UserSettings> {
    try {
      const result = await chrome.storage.sync.get(StorageManager.SETTINGS_KEY)
      const settings = result[StorageManager.SETTINGS_KEY] as UserSettings

      if (settings) {
        console.log('User settings loaded')
        return settings
      }

      // Return default settings if none exist
      console.log('No user settings found, using defaults')
      return DEFAULT_SETTINGS
    } catch (error) {
      console.error('Failed to load user settings:', error)
      return DEFAULT_SETTINGS
    }
  }

  /**
   * Get current storage usage in bytes
   */
  async getStorageUsage(): Promise<number> {
    try {
      const usage = await chrome.storage.local.getBytesInUse()
      console.log(`Storage usage: ${usage} bytes (${(usage / 1024 / 1024).toFixed(2)} MB)`)
      return usage
    } catch (error) {
      console.error('Failed to get storage usage:', error)
      return 0
    }
  }

  /**
   * Check if storage quota is available
   */
  async checkStorageQuota(): Promise<void> {
    const usage = await this.getStorageUsage()
    const remaining = StorageManager.MAX_STORAGE_BYTES - usage

    if (remaining < 1024 * 1024) {
      // Less than 1MB remaining
      throw new StorageQuotaError(
        `Storage quota low: ${(remaining / 1024).toFixed(2)} KB remaining`
      )
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<{
    usage: number
    max: number
    remaining: number
    sessionCount: number
  }> {
    const usage = await this.getStorageUsage()
    const sessions = await this.loadChatSessions()

    return {
      usage,
      max: StorageManager.MAX_STORAGE_BYTES,
      remaining: StorageManager.MAX_STORAGE_BYTES - usage,
      sessionCount: sessions.length,
    }
  }
}

// Create singleton instance
export const storageManager = new StorageManager()
