import { ChatMessage } from '@/shared/types'
import UserMessage from './UserMessage'
import AssistantMessage from './AssistantMessage'

interface MessageListProps {
  messages: ChatMessage[]
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-3 sm:space-y-4" role="log" aria-label="채팅 메시지 목록">
      {messages.map((message, index) =>
        message.role === 'user' ? (
          <UserMessage key={message.id} message={message} index={index} />
        ) : (
          <AssistantMessage key={message.id} message={message} index={index} />
        )
      )}
    </div>
  )
}
