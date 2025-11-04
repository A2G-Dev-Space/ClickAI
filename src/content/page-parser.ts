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
   * Parse page content using Readability
   */
  parsePageContent(): string {
    try {
      // Clone document for Readability
      const documentClone = document.cloneNode(true) as Document
      const reader = new Readability(documentClone)
      const article = reader.parse()

      if (article && article.textContent && article.textContent.length > 100) {
        return this.sanitize(article.textContent)
      }

      // Fallback: Try <article> or <main> element
      const main = document.querySelector('article, main')
      if (main && main.textContent) {
        return this.sanitize(main.textContent)
      }

      // Last resort: body text
      return this.sanitize(document.body.innerText || '')
    } catch (error) {
      console.error('Page parsing error:', error)
      return this.sanitize(document.body.innerText || '')
    }
  }

  /**
   * Get page metadata
   */
  getPageMetadata(): PageContext {
    return {
      url: window.location.href,
      title: document.title,
      content: this.parsePageContent(),
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
