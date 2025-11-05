import { useChatStore } from '../store/chatStore'

export default function ChatWithPageToggle() {
  const { isChatWithPageEnabled, pageContext, toggleChatWithPage, error } = useChatStore()

  return (
    <div className="flex items-center justify-between p-2.5 sm:p-3 border-b border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-transparent">
      <div className="flex-1 min-w-0 mr-3">
        <div className="flex items-center space-x-2">
          <label
            htmlFor="chat-with-page"
            className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer whitespace-nowrap"
          >
            페이지와 채팅
          </label>
          {isChatWithPageEnabled && pageContext && (
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px] sm:max-w-[200px] md:max-w-xs">
              ({pageContext.title})
            </span>
          )}
        </div>
        {error && isChatWithPageEnabled && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1" role="alert">
            페이지 파싱 실패
          </p>
        )}
      </div>
      <button
        id="chat-with-page"
        onClick={toggleChatWithPage}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          isChatWithPageEnabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
        role="switch"
        aria-checked={isChatWithPageEnabled}
        aria-label="페이지와 채팅 토글"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
            isChatWithPageEnabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
