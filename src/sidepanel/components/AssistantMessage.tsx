import { ChatMessage } from '@/shared/types'
import { formatTimestamp } from '@/shared/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface AssistantMessageProps {
  message: ChatMessage
  index: number
}

export default function AssistantMessage({ message, index }: AssistantMessageProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div
      className="flex justify-start animate-fade-in"
      role="article"
      aria-label="AI 응답"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="max-w-[85%] sm:max-w-[80%] md:max-w-[75%]">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-lg px-4 py-3 sm:px-4 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: ({ className, children, ...props }) => {
                  const isBlock = className?.includes('language-')
                  return isBlock ? (
                    <pre className="bg-gray-900 dark:bg-gray-950 rounded p-2 sm:p-3 overflow-x-auto text-xs sm:text-sm">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code
                      className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs sm:text-sm"
                      {...props}
                    >
                      {children}
                    </code>
                  )
                },
              }}
            >
              {message.content || '_생각 중..._'}
            </ReactMarkdown>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 px-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <time dateTime={new Date(message.timestamp).toISOString()}>
              {formatTimestamp(message.timestamp)}
            </time>
          </div>
          <button
            onClick={handleCopy}
            className="relative text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 ml-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={copied ? '복사 완료' : '메시지 복사'}
          >
            <span className="sr-only">{copied ? '복사 완료' : '메시지 복사'}</span>
            <span
              className={`transition-all duration-200 ${copied ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}
              aria-hidden="true"
            >
              <Copy size={16} strokeWidth={1.5} />
            </span>
            <span
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${copied ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
              aria-hidden="true"
            >
              <Check size={16} strokeWidth={1.5} className="text-green-500" />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
