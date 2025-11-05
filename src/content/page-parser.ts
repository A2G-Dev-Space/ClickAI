// Page Parser for Click AI Extension

import { Readability } from '@mozilla/readability'
import { PageContext } from '@/shared/types'

export class PageParser {
  private sensitivePatterns = [
    { name: 'Credit Card', regex: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g },
    { name: 'SSN', regex: /\b\d{3}-\d{2}-\d{4}\b/g },
    { name: 'Email', regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g },
    { name: 'Phone', regex: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g },
    { name: 'Korean RRN', regex: /\b\d{6}-\d{7}\b/g },
  ]

  /**
   * Parse page content using Readability and inject IDs for citations
   */
  parsePageContent(): { id: string; text: string }[] {
    try {
      const documentClone = document.cloneNode(true) as Document
      const reader = new Readability(documentClone)
      const article = reader.parse()

      if (!article || !article.content) {
        return this.fallbackParse()
      }

      const contentDiv = document.createElement('div')
      contentDiv.innerHTML = article.content

      const chunks: { id: string; text: string }[] = []
      let chunkIndex = 0

      // Select paragraphs, list items, and headers as potential chunks
      const elements = contentDiv.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6')

      elements.forEach((el) => {
        const text = this.sanitize(el.textContent || '')
        if (text.length > 20) { // Only include chunks with meaningful content
          const id = `click-ai-ref-${chunkIndex++}`
          chunks.push({ id, text })

          // Find the corresponding element in the actual DOM to add the ID
          // This is a simplification; a more robust solution might involve more complex DOM traversal
          const originalEl = this.findOriginalElement(el)
          if (originalEl) {
            originalEl.setAttribute('data-click-ai-ref-id', id)
          }
        }
      })

      return chunks
    } catch (error) {
      console.error('Page parsing error:', error)
      return this.fallbackParse()
    }
  }

  /**
   * Fallback parsing method if Readability fails
   */
  private fallbackParse(): { id: string; text: string }[] {
    const chunks: { id: string; text: string }[] = []
    const bodyText = this.sanitize(document.body.innerText || '')
    if (bodyText.length > 100) {
      // Simple split by newline, could be improved
      const paragraphs = bodyText.split('\n').filter(p => p.length > 20)
      paragraphs.forEach((p, i) => {
        chunks.push({ id: `click-ai-ref-fallback-${i}`, text: p })
      })
    }
    return chunks
  }

  /**
   * Tries to find the original DOM element corresponding to a cloned element.
   * This is a challenging task and this implementation is a best-effort approach.
   */
  private findOriginalElement(clonedEl: Element): Element | null {
    // Strategy 1: Use a unique selector if possible
    let selector = ''
    if (clonedEl.id) {
      selector = `#${clonedEl.id}`
    } else if (clonedEl.className) {
      // Create a selector from classes, hoping it's specific enough
      const classes = clonedEl.className.trim().split(/\s+/).join('.')
      selector = `${clonedEl.tagName.toLowerCase()}.${classes}`
    } else {
      selector = clonedEl.tagName.toLowerCase()
    }

    // Add text content to selector for more specificity
    const textSelector = `:contains("${(clonedEl.textContent || '').trim().substring(0, 20)}")`

    try {
      const candidates = document.querySelectorAll(selector + textSelector)
      // If we find exactly one match, it's likely the correct one.
      if (candidates.length === 1) {
        return candidates[0]
      }
      // If multiple, we can't be sure, so we don't add the ID to avoid errors.
    } catch (e) {
      // Invalid selector, etc.
    }
    return null
  }

  /**
   * Get page metadata
   */
  getPageMetadata(): PageContext {
    const contentChunks = this.parsePageContent()
    const content = contentChunks.map(c => `[${c.id}] ${c.text}`).join('\n\n')

    return {
      url: window.location.href,
      title: document.title,
      content: content, // Now it's a string with IDs
      publishDate: this.extractPublishDate(),
    }
  }

  /**
   * Sanitize text (remove sensitive info and excessive whitespace)
   */
  private sanitize(text: string): string {
    // Remove excessive whitespace
    text = text.replace(/\s+/g, ' ').trim()

    // Filter sensitive information
    for (const { regex } of this.sensitivePatterns) {
      text = text.replace(regex, '[REDACTED]')
    }

    // Limit length (max 10000 chars for token management)
    if (text.length > 10000) {
      text = text.substring(0, 10000) + '...'
    }

    return text
  }

  /**
   * Extract publish date from page
   */
  private extractPublishDate(): string | undefined {
    // Try common meta tags
    const metaDate = document.querySelector(
      'meta[property="article:published_time"], meta[name="publish_date"], meta[name="date"]'
    )
    if (metaDate) {
      const content = metaDate.getAttribute('content')
      if (content) return content
    }

    // Try <time> element
    const timeElement = document.querySelector('time[datetime]')
    if (timeElement) {
      const datetime = timeElement.getAttribute('datetime')
      if (datetime) return datetime
    }

    // Try JSON-LD
    try {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]')
      for (const script of Array.from(scripts)) {
        const data = JSON.parse(script.textContent || '{}')
        if (data.datePublished) {
          return data.datePublished
        }
      }
    } catch (e) {
      // Ignore JSON parsing errors
    }

    return undefined
  }

  /**
   * Check if sensitive information was detected
   */
  checkForSensitiveInfo(text: string): string[] {
    const detected: string[] = []

    for (const { name, regex } of this.sensitivePatterns) {
      if (regex.test(text)) {
        detected.push(name)
      }
    }

    return detected
  }
}

// Create singleton instance
export const pageParser = new PageParser()
