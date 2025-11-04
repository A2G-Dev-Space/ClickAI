import { ChatMessage } from '@/shared/types'
import { formatTimestamp } from '@/shared/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useState } from 'react'

interface AssistantMessageProps {
  message: ChatMessage
}

export default function AssistantMessage({ message }: AssistantMessageProps) {
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
    <div className="flex justify-start animate-fade-in" role="article" aria-label="AI 응답">
      <div className="max-w-[85%] sm:max-w-[80%] md:max-w-[75%]">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-3 py-2 sm:px-4 shadow-sm hover:shadow-md transition-all duration-200">
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
        <div className="flex items-center justify-between mt-1 px-1">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <time dateTime={new Date(message.timestamp).toISOString()}>
              {formatTimestamp(message.timestamp)}
            </time>
          </div>
          <button
            onClick={handleCopy}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 ml-2 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={copied ? '복사 완료' : '메시지 복사'}
          >
            {copied ? '✓ 복사됨' : '복사'}
          </button>
        </div>
      </div>
    </div>
  )
}
