import { useState } from 'react'
import { ContextMenuResult } from '@/background/context-menu-handler'

interface PopoverContentProps {
  result: ContextMenuResult
  onClose: () => void
}

export default function PopoverContent({ result, onClose }: PopoverContentProps) {
  const [showDiff, setShowDiff] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const getTitle = () => {
    switch (result.type) {
      case 'grammar':
        return '문법 교정'
      case 'translate':
        return '번역'
      case 'refine':
        return '표현 다듬기'
      default:
        return 'Click AI'
    }
  }

  const renderDiff = () => {
    return (
      <div className="diff-view">
        {result.diffs.map((diff, index) => {
          const [type, text] = diff
          if (type === -1) {
            return (
              <span key={index} className="diff-delete">
                {text}
              </span>
            )
          } else if (type === 1) {
            return (
              <span key={index} className="diff-insert">
                {text}
              </span>
            )
          } else {
            return (
              <span key={index} className="diff-equal">
                {text}
              </span>
            )
          }
        })}
      </div>
    )
  }

  return (
    <div>
      <div className="popover-header">
        <div className="popover-title">{getTitle()}</div>
        <button onClick={onClose} className="close-button">
          ✕
        </button>
      </div>

      <div className="popover-content">
        {showDiff ? renderDiff() : <div className="result-text">{result.result}</div>}
      </div>

      <div className="popover-actions">
        <button onClick={() => setShowDiff(!showDiff)} className="action-button secondary">
          {showDiff ? '결과 보기' : '차이 보기'}
        </button>
        <button onClick={handleCopy} className="action-button primary">
          {copied ? '✓ 복사됨' : '복사'}
        </button>
      </div>
    </div>
  )
}
