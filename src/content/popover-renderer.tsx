// Popover Renderer for Click AI Extension

import ReactDOM from 'react-dom/client'
import { ContextMenuResult } from '@/background/context-menu-handler'
import PopoverContent from './components/PopoverContent'

export class PopoverRenderer {
  private container: HTMLDivElement | null = null
  private shadowRoot: ShadowRoot | null = null
  private root: any = null

  show(result: ContextMenuResult) {
    // Clean up existing popover
    this.hide()

    // Create container
    this.container = document.createElement('div')
    this.container.id = 'click-ai-popover'
    this.container.style.position = 'fixed'
    this.container.style.zIndex = '2147483647' // Maximum z-index
    document.body.appendChild(this.container)

    // Create shadow root for style isolation
    this.shadowRoot = this.container.attachShadow({ mode: 'open' })

    // Create style element
    const style = document.createElement('style')
    style.textContent = this.getStyles()
    this.shadowRoot.appendChild(style)

    // Create React root container
    const reactRoot = document.createElement('div')
    this.shadowRoot.appendChild(reactRoot)

    // Render React component
    this.root = ReactDOM.createRoot(reactRoot)
    this.root.render(<PopoverContent result={result} onClose={() => this.hide()} />)

    // Position popover
    this.position()

    // Add click outside listener
    document.addEventListener('click', this.handleClickOutside)

    // Add escape key listener
    document.addEventListener('keydown', this.handleEscape)
  }

  hide() {
    if (this.root) {
      this.root.unmount()
      this.root = null
    }

    if (this.container) {
      this.container.remove()
      this.container = null
      this.shadowRoot = null
    }

    document.removeEventListener('click', this.handleClickOutside)
    document.removeEventListener('keydown', this.handleEscape)
  }

  private position() {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0 || !this.container) return

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    const popoverWidth = 600
    const popoverHeight = 400

    // Calculate position
    const spaceAbove = rect.top
    const spaceBelow = window.innerHeight - rect.bottom

    // Vertical position
    if (spaceAbove > popoverHeight || spaceAbove > spaceBelow) {
      // Show above
      this.container.style.top = `${window.scrollY + rect.top - popoverHeight - 10}px`
    } else {
      // Show below
      this.container.style.top = `${window.scrollY + rect.bottom + 10}px`
    }

    // Horizontal position (centered)
    let left = rect.left + rect.width / 2 - popoverWidth / 2
    left = Math.max(10, Math.min(left, window.innerWidth - popoverWidth - 10))
    this.container.style.left = `${left}px`
  }

  private handleClickOutside = (event: MouseEvent) => {
    if (this.container && !this.container.contains(event.target as Node)) {
      this.hide()
    }
  }

  private handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.hide()
    }
  }

  private getStyles(): string {
    return `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      div {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        padding: 16px;
        max-width: 600px;
        max-height: 400px;
        overflow: auto;
      }

      .popover-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #e5e7eb;
      }

      .popover-title {
        font-size: 16px;
        font-weight: 600;
        color: #111827;
      }

      .close-button {
        background: none;
        border: none;
        font-size: 20px;
        color: #6b7280;
        cursor: pointer;
        padding: 4px 8px;
      }

      .close-button:hover {
        color: #111827;
      }

      .popover-content {
        margin-bottom: 16px;
      }

      .result-text {
        font-size: 14px;
        line-height: 1.6;
        color: #374151;
        white-space: pre-wrap;
        word-break: break-word;
      }

      .diff-view {
        font-size: 14px;
        line-height: 1.6;
        font-family: 'Courier New', monospace;
      }

      .diff-delete {
        background-color: #fee;
        text-decoration: line-through;
        color: #c00;
      }

      .diff-insert {
        background-color: #efe;
        color: #080;
      }

      .diff-equal {
        color: #374151;
      }

      .popover-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }

      .action-button {
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .action-button.primary {
        background-color: #2563eb;
        color: white;
      }

      .action-button.primary:hover {
        background-color: #1d4ed8;
      }

      .action-button.secondary {
        background-color: #f3f4f6;
        color: #374151;
      }

      .action-button.secondary:hover {
        background-color: #e5e7eb;
      }
    `
  }
}

// Create singleton instance
export const popoverRenderer = new PopoverRenderer()
