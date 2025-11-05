import { ChatMessage } from '@/shared/types'
import { formatTimestamp } from '@/shared/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useState, useMemo } from 'react'
import { Copy, Check } from 'lucide-react'
import AIAvatar from './AIAvatar'
import TypingEffect from './TypingEffect'
import Citation from './Citation'
import SuggestedQuestion from './SuggestedQuestion' // Import the new component

interface AssistantMessageProps {
  message: ChatMessage
  index: number
  isStreaming: boolean
}

export default function AssistantMessage({ message, index, isStreaming }: AssistantMessageProps) {
  const [copied, setCopied] = useState(false)

  const { mainContent, suggestedQuestions } = useMemo(() => {
    const lines = message.content.split('\n')
    const questions: string[] = []
    const content: string[] = []
    const suggestionPrefix = 'SUGGESTED_QUESTION:'

    for (const line of lines) {
      if (line.startsWith(suggestionPrefix)) {
        questions.push(line.substring(suggestionPrefix.length).trim())
      } else {
        content.push(line)
      }
    }
    return { mainContent: content.join('\n').trim(), suggestedQuestions: questions }
  }, [message.content])

  const handleCopy = async () => {
    try {
      // Remove citation markers for clean copy
      const cleanContent = mainContent.replace(/\[click-ai-ref-\d+\]/g, '')
      await navigator.clipboard.writeText(cleanContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const markdownRenderer = (text: string) => {
    // Regex to find citations like [click-ai-ref-12]
    const citationRegex = /\[(click-ai-ref-\d+)\]/g

    return (
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
          // Custom component for citations
          p: ({ children }) => {
            const processedChildren = (Array.isArray(children) ? children : [children]).flatMap(
              (child) => {
                if (typeof child === 'string') {
                  const parts = child.split(citationRegex)
                  return parts.map((part, i) => {
                    if (i % 2 === 1) {
                      // This is a citation ID
                      return <Citation key={i} referenceId={part} />
                    }
                    return part
                  })
                }
                return child
              }
            )
            return <p>{processedChildren}</p>
          },
        }}
      >
        {text}
      </ReactMarkdown>
    )
  }

  return (
    <div
      className="flex items-start space-x-3 sm:space-x-4 animate-fade-in"
      role="article"
      aria-label="AI 응답"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <AIAvatar />
      <div className="flex flex-col gap-2 max-w-[85%] sm:max-w-[80%] md:max-w-[75%]">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 sm:px-4 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            {isStreaming && !mainContent ? (
              <TypingEffect text={message.content || '_생각 중..._'}>
                {(text) => markdownRenderer(text)}
              </TypingEffect>
            ) : (
              markdownRenderer(mainContent || '_생각 중..._')
            )}
          </div>
        </div>

        {!isStreaming && suggestedQuestions.length > 0 && (
          <div className="flex flex-col items-start gap-2 pt-2">
            {suggestedQuestions.map((q, i) => (
              <SuggestedQuestion key={i} question={q} />
            ))}
          </div>
        )}

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
              className={`transition-all duration-200 ${
                copied ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
              }`}
              aria-hidden="true"
            >
              <Copy size={16} strokeWidth={1.5} />
            </span>
            <span
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                copied ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`}
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
