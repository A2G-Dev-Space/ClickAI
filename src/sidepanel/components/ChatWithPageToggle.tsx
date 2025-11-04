import { useChatStore } from '../store/chatStore'

export default function ChatWithPageToggle() {
  const { isChatWithPageEnabled, pageContext, toggleChatWithPage, error } = useChatStore()

  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <label
            htmlFor="chat-with-page"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            페이지와 채팅
          </label>
          {isChatWithPageEnabled && pageContext && (
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
              ({pageContext.title})
            </span>
          )}
        </div>
        {error && isChatWithPageEnabled && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">페이지 파싱 실패</p>
        )}
      </div>
      <button
        id="chat-with-page"
        onClick={toggleChatWithPage}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          isChatWithPageEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isChatWithPageEnabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
