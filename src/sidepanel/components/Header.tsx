import { useChatStore } from '../store/chatStore'
import { PlusSquare, History, Settings } from 'lucide-react'

interface HeaderProps {
  onShowHistory: () => void
  onShowSettings: () => void
}

export default function Header({ onShowHistory, onShowSettings }: HeaderProps) {
  const createNewSession = useChatStore((state) => state.createNewSession)

  return (
    <header className="sticky top-0 z-10 flex-shrink-0 border-b border-gray-200/80 dark:border-gray-700/50 p-3 sm:p-4 bg-white/80 dark:bg-gray-900/70 backdrop-blur-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
          Click AI
        </h1>
        <nav className="flex items-center space-x-1 sm:space-x-2" aria-label="주요 네비게이션">
          <button
            onClick={createNewSession}
            className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors active:scale-95"
            title="새 채팅"
            aria-label="새 채팅 시작"
          >
            <PlusSquare size={24} className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
          </button>
          <button
            onClick={onShowHistory}
            className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors active:scale-95"
            title="채팅 기록"
            aria-label="채팅 기록 보기"
          >
            <History size={24} className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
          </button>
          <button
            onClick={onShowSettings}
            className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors active:scale-95"
            title="설정"
            aria-label="설정 열기"
          >
            <Settings size={24} className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
          </button>
        </nav>
      </div>
    </header>
  )
}
