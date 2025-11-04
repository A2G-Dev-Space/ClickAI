import { useState, useEffect } from 'react'
import { useChatStore } from '../store/chatStore'
import { ChatSession } from '@/shared/types'
import { formatTimestamp } from '@/shared/utils'

interface HistoryViewProps {
  onBack: () => void
}

export default function HistoryView({ onBack }: HistoryViewProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)
  const { loadSession, deleteSession, loadAllSessions } = useChatStore()

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    setLoading(true)
    const allSessions = await loadAllSessions()
    setSessions(allSessions)
    setLoading(false)
  }

  const handleLoadSession = async (sessionId: string) => {
    await loadSession(sessionId)
    onBack()
  }

  const handleDeleteSession = async (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation()

    if (confirm('이 채팅을 삭제하시겠습니까?')) {
      await deleteSession(sessionId)
      await loadSessions()
    }
  }

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
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">채팅 기록</h1>
        </div>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p>로딩 중...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <p className="text-lg mb-2">저장된 채팅이 없습니다</p>
              <p className="text-sm">새로운 채팅을 시작해보세요!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleLoadSession(session.id)}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {session.title}
                    </h3>
                    <div className="flex items-center mt-1 space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{formatTimestamp(session.updatedAt)}</span>
                      <span>•</span>
                      <span>{session.messages.length}개 메시지</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    className="ml-2 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
