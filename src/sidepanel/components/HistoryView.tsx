import { useState, useEffect, useMemo } from 'react'
import { useChatStore } from '../store/chatStore'
import { ChatSession } from '@/shared/types'
import { formatTimestamp, groupSessionsByDate } from '@/shared/utils'
import { ArrowLeft, Trash2, Search, Pin, PinOff } from 'lucide-react'
import LoadingIndicator from './LoadingIndicator'
import Fuse from 'fuse.js'

interface HistoryViewProps {
  onBack: () => void
}

export default function HistoryView({ onBack }: HistoryViewProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const { loadSession, deleteSession, loadAllSessions, togglePinSession } = useChatStore()

  useEffect(() => {
    loadSessions()
  }, [])

  const fuse = useMemo(() => {
    if (sessions.length > 0) {
      return new Fuse(sessions, {
        keys: ['title', 'messages.content'],
        threshold: 0.3,
        includeScore: true,
      })
    }
    return null
  }, [sessions])

  const filteredSessions = useMemo(() => {
    if (!searchQuery || !fuse) {
      return sessions
    }
    return fuse.search(searchQuery).map((result) => result.item)
  }, [searchQuery, sessions, fuse])

  const groupedSessions = useMemo(
    () => groupSessionsByDate(filteredSessions),
    [filteredSessions]
  )

  const loadSessions = async () => {
    setLoading(true)
    const allSessions = await loadAllSessions()
    // Sort by pinned status, then by most recent
    allSessions.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return b.updatedAt - a.updatedAt
    })
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

  const handleTogglePin = async (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    await togglePinSession(sessionId)
    await loadSessions()
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4 bg-white dark:bg-gray-900">
        <div className="flex items-center mb-3">
          <button
            onClick={onBack}
            className="mr-2 sm:mr-3 p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors active:scale-95"
            aria-label="뒤로 가기"
          >
            <ArrowLeft size={24} className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
          </button>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">채팅 기록</h1>
        </div>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            size={20}
            strokeWidth={1.5}
          />
          <input
            type="text"
            placeholder="기록 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 transition"
          />
        </div>
      </header>

      {/* Session List */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-4" role="main">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400" role="status">
            <div className="flex flex-col items-center">
              <LoadingIndicator />
              <p className="text-sm mt-2">로딩 중...</p>
            </div>
          </div>
        ) : Object.keys(groupedSessions).length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center px-4">
              <p className="text-base sm:text-lg mb-2">
                {searchQuery ? '검색 결과가 없습니다' : '저장된 채팅이 없습니다'}
              </p>
              <p className="text-xs sm:text-sm">
                {searchQuery ? '다른 검색어로 시도해보세요.' : '새로운 채팅을 시작해보세요!'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedSessions).map(([groupTitle, sessionsInGroup]) => (
              <div key={groupTitle}>
                <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1 mb-2">
                  {groupTitle}
                </h2>
                <ul className="space-y-2" role="list" aria-label={`채팅 세션 목록 - ${groupTitle}`}>
                  {sessionsInGroup.map((session) => (
                    <li key={session.id}>
                      <div
                        onClick={() => handleLoadSession(session.id)}
                        className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 group active:scale-[0.98]"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleLoadSession(session.id)
                          }
                        }}
                        aria-label={`${session.title} 채팅 불러오기`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate flex items-center">
                              {session.isPinned && <Pin size={14} className="mr-2 text-blue-500" />}
                              {session.title}
                            </h3>
                            <div className="flex items-center mt-1 space-x-2 text-xs text-gray-500 dark:text-gray-400">
                              <time dateTime={new Date(session.updatedAt).toISOString()}>
                                {formatTimestamp(session.updatedAt)}
                              </time>
                              <span aria-hidden="true">•</span>
                              <span>{session.messages.length}개 메시지</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={(e) => handleTogglePin(session.id, e)}
                              className="ml-2 p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 sm:group-hover:opacity-100 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex-shrink-0"
                              aria-label={session.isPinned ? `${session.title} 고정 해제` : `${session.title} 고정`}
                              tabIndex={0}
                            >
                              {session.isPinned ? (
                                <PinOff size={20} className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                              ) : (
                                <Pin size={20} className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                              )}
                            </button>
                            <button
                              onClick={(e) => handleDeleteSession(session.id, e)}
                              className="ml-2 p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 sm:group-hover:opacity-100 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex-shrink-0"
                              aria-label={`${session.title} 삭제`}
                              tabIndex={0}
                            >
                              <Trash2 size={20} className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
