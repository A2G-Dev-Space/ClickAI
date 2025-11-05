import { useState, KeyboardEvent } from 'react'
import { Send, StopCircle } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  onCancel?: () => void
  disabled?: boolean
  isLoading?: boolean
}

export default function ChatInput({ onSend, onCancel, disabled, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim())
      setInput('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <div className="p-3 sm:p-4">
      <div className="flex items-end space-x-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요... (Shift+Enter로 줄바꿈)"
          disabled={disabled}
          rows={3}
          className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 sm:px-4 text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
          aria-label="채팅 메시지 입력"
        />
        <div className="flex flex-col space-y-2">
          <button
            onClick={isLoading ? handleCancel : handleSend}
            disabled={!isLoading && (disabled || !input.trim())}
            className={`relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ${isLoading ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'}`}
            aria-label={isLoading ? '메시지 전송 중지' : '메시지 전송'}
          >
            <span
              className={`absolute transition-all duration-200 ease-in-out ${!isLoading ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-45'}`}
              aria-hidden="true"
            >
              <Send size={24} className="w-5 h-5 sm:w-6 sm:h-6" />
            </span>
            <span
              className={`absolute transition-all duration-200 ease-in-out ${isLoading ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-45'}`}
              aria-hidden="true"
            >
              <StopCircle size={24} className="w-5 h-5 sm:w-6 sm:h-6" />
            </span>
          </button>
      </div>
    </div>
  )
}
