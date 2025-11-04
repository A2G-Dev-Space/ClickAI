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
    <div role="dialog" aria-labelledby="popover-title" aria-describedby="popover-content">
      <header className="popover-header">
        <h2 id="popover-title" className="popover-title">{getTitle()}</h2>
        <button
          onClick={onClose}
          className="close-button"
          aria-label="팝오버 닫기"
          type="button"
        >
          ✕
        </button>
      </header>

      <div id="popover-content" className="popover-content" role="region">
        {showDiff ? renderDiff() : <div className="result-text">{result.result}</div>}
      </div>

      <footer className="popover-actions">
        <button
          onClick={() => setShowDiff(!showDiff)}
          className="action-button secondary"
          aria-pressed={showDiff}
          type="button"
        >
          {showDiff ? '결과 보기' : '차이 보기'}
        </button>
        <button
          onClick={handleCopy}
          className="action-button primary"
          aria-label={copied ? '복사 완료' : '클립보드에 복사'}
          type="button"
        >
          {copied ? '✓ 복사됨' : '복사'}
        </button>
      </footer>
    </div>
  )
}
