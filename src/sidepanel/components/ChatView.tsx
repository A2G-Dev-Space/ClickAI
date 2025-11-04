import { useEffect, useRef } from 'react'
import { useChatStore } from '../store/chatStore'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import LoadingIndicator from './LoadingIndicator'
import ChatWithPageToggle from './ChatWithPageToggle'
import Header from './Header'

interface ChatViewProps {
  onShowHistory: () => void
  onShowSettings: () => void
}

export default function ChatView({ onShowHistory, onShowSettings }: ChatViewProps) {
  const { messages, isLoading, error, sendMessage, cancelMessage, clearError } = useChatStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <Header onShowHistory={onShowHistory} onShowSettings={onShowSettings} />

      {/* Chat with Page Toggle */}
      <ChatWithPageToggle />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <p className="text-lg mb-2">안녕하세요! 👋</p>
              <p className="text-sm">무엇을 도와드릴까요?</p>
            </div>
          </div>
        ) : (
          <MessageList messages={messages} />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error display */}
      {error && (
        <div className="flex-shrink-0 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800 p-4">
          <div className="flex items-start">
            <div className="flex-1">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="ml-4 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex-shrink-0 p-2 border-t border-gray-200 dark:border-gray-700">
          <LoadingIndicator />
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
        <ChatInput
          onSend={sendMessage}
          onCancel={cancelMessage}
          disabled={isLoading}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
