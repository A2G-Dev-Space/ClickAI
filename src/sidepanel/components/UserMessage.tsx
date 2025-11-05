import { ChatMessage } from '@/shared/types'
import { formatTimestamp } from '@/shared/utils'
import UserAvatar from './UserAvatar'

interface UserMessageProps {
  message: ChatMessage
  index: number
}

export default function UserMessage({ message, index }: UserMessageProps) {
  return (
    <div
      className="flex items-start justify-end space-x-3 sm:space-x-4 animate-fade-in"
      role="article"
      aria-label="사용자 메시지"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="max-w-[85%] sm:max-w-[80%] md:max-w-[75%]">
        <div className="bg-primary-600 text-white rounded-2xl rounded-tr-none px-4 py-3 sm:px-4 shadow-sm hover:shadow-md transition-all duration-200">
          <p className="text-sm sm:text-base whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </p>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right px-2">
          <time dateTime={new Date(message.timestamp).toISOString()}>
            {formatTimestamp(message.timestamp)}
          </time>
        </div>
      </div>
      <UserAvatar />
    </div>
  )
}
