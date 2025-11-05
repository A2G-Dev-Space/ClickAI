import { useState, useEffect } from 'react'
import { UserSettings } from '@/shared/types'
import { MessageType } from '@/shared/types'

interface SettingsViewProps {
  onBack: () => void
}

export default function SettingsView({ onBack }: SettingsViewProps) {
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'auto',
    language: 'ko',
  })
  const [storageStats, setStorageStats] = useState({
    usage: 0,
    max: 10 * 1024 * 1024,
    sessionCount: 0,
  })
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    loadSettings()
    loadStorageStats()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: MessageType.GET_SETTINGS,
        payload: {},
        timestamp: Date.now(),
      })

      if (response.success) {
        setSettings(response.data.settings)
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  const loadStorageStats = async () => {
    try {
      const sessions = await chrome.runtime.sendMessage({
        type: MessageType.LOAD_SESSIONS,
        payload: {},
        timestamp: Date.now(),
      })

      if (sessions.success) {
        const usage = await chrome.storage.local.getBytesInUse()
        setStorageStats({
          usage,
          max: 10 * 1024 * 1024,
          sessionCount: sessions.data.sessions.length,
        })
      }
    } catch (error) {
      console.error('Failed to load storage stats:', error)
    }
  }

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      await chrome.runtime.sendMessage({
        type: MessageType.UPDATE_SETTINGS,
        payload: settings,
        timestamp: Date.now(),
      })
      showNotification('설정이 저장되었습니다.', 'success')
    } catch (error) {
      console.error('Failed to save settings:', error)
      showNotification('설정 저장에 실패했습니다.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const clearAllData = async () => {
    if (!confirm('모든 채팅 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return
    }

    try {
      await chrome.storage.local.clear()
      showNotification('모든 데이터가 삭제되었습니다.', 'success')
      await loadStorageStats()
    } catch (error) {
      console.error('Failed to clear data:', error)
      showNotification('데이터 삭제에 실패했습니다.', 'error')
    }
  }

  const usagePercent = (storageStats.usage / storageStats.max) * 100

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg animate-slide-in ${
            notification.type === 'success'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
          }`}
          role="alert"
          aria-live="polite"
        >
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
      )}

      {/* Header */}
      <header className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4 bg-white dark:bg-gray-900">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-2 sm:mr-3 p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors active:scale-95"
            aria-label="뒤로 가기"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">설정</h1>
        </div>
      </header>

      {/* Settings */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-6" role="main">
        {/* Theme */}
        <section>
          <label htmlFor="theme-select" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            테마
          </label>
          <select
            id="theme-select"
            value={settings.theme}
            onChange={(e) => setSettings({ ...settings, theme: e.target.value as UserSettings['theme'] })}
            className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
          >
            <option value="light">라이트</option>
            <option value="dark">다크</option>
            <option value="auto">시스템 설정</option>
          </select>
        </section>

        {/* Language */}
        <section>
          <label htmlFor="language-select" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            언어
          </label>
          <select
            id="language-select"
            value={settings.language}
            onChange={(e) => setSettings({ ...settings, language: e.target.value as UserSettings['language'] })}
            className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </select>
        </section>

        {/* Storage Stats */}
        <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            저장 공간
          </h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">사용 중</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {(storageStats.usage / 1024 / 1024).toFixed(2)} MB / 10 MB
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2" role="progressbar" aria-valuenow={usagePercent} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    usagePercent > 80 ? 'bg-red-600' : usagePercent > 60 ? 'bg-yellow-600' : 'bg-blue-600'
                  }`}
                  style={{ width: `${Math.min(usagePercent, 100)}%` }}
                />
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {storageStats.sessionCount}개의 채팅 세션
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            데이터 관리
          </h2>
          <button
            onClick={clearAllData}
            className="w-full px-4 py-2 text-sm sm:text-base bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="모든 채팅 데이터 삭제"
          >
            모든 데이터 삭제
          </button>
        </section>
      </main>

      {/* Save Button */}
      <footer className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 bg-white dark:bg-gray-900">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="w-full px-4 py-2 text-sm sm:text-base bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="설정 저장"
        >
          {saving ? '저장 중...' : '설정 저장'}
        </button>
      </footer>
    </div>
  )
}
