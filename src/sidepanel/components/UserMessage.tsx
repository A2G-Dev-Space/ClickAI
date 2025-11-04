import { ChatMessage } from '@/shared/types'
import { formatTimestamp } from '@/shared/utils'

interface UserMessageProps {
  message: ChatMessage
}

export default function UserMessage({ message }: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%]">
        <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2">
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
    </div>
  )
}
