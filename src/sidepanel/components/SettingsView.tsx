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

  const saveSettings = async () => {
    setSaving(true)
    try {
      await chrome.runtime.sendMessage({
        type: MessageType.UPDATE_SETTINGS,
        payload: settings,
        timestamp: Date.now(),
      })
      alert('설정이 저장되었습니다.')
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('설정 저장에 실패했습니다.')
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
      alert('모든 데이터가 삭제되었습니다.')
      await loadStorageStats()
    } catch (error) {
      console.error('Failed to clear data:', error)
      alert('데이터 삭제에 실패했습니다.')
    }
  }

  const usagePercent = (storageStats.usage / storageStats.max) * 100

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-3 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">설정</h1>
        </div>
      </div>

      {/* Settings */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Theme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            테마
          </label>
          <select
            value={settings.theme}
            onChange={(e) => setSettings({ ...settings, theme: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="light">라이트</option>
            <option value="dark">다크</option>
            <option value="auto">시스템 설정</option>
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            언어
          </label>
          <select
            value={settings.language}
            onChange={(e) => setSettings({ ...settings, language: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* Storage Stats */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            저장 공간
          </h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">사용 중</span>
                <span className="text-gray-900 dark:text-white">
                  {(storageStats.usage / 1024 / 1024).toFixed(2)} MB / 10 MB
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {storageStats.sessionCount}개의 채팅 세션
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            데이터 관리
          </h2>
          <button
            onClick={clearAllData}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            모든 데이터 삭제
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? '저장 중...' : '설정 저장'}
        </button>
      </div>
    </div>
  )
}
