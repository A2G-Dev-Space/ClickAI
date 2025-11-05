import { render, screen } from '@testing-library/react'
import UserMessage from '../UserMessage'
import type { ChatMessage } from '@/shared/types'

describe('UserMessage', () => {
  const mockMessage: ChatMessage = {
    id: '123',
    role: 'user',
    content: 'Hello, AI!',
    timestamp: Date.now(),
  }

  it('should render message content', () => {
    render(<UserMessage message={mockMessage} />)
    expect(screen.getByText('Hello, AI!')).toBeInTheDocument()
  })

  it('should have correct styling classes', () => {
    const { container } = render(<UserMessage message={mockMessage} />)
    const messageContainer = container.querySelector('.bg-primary-600')
    expect(messageContainer).toBeInTheDocument()
    expect(messageContainer).toHaveClass('text-white')
  })

  it('should preserve whitespace in content', () => {
    const messageWithWhitespace: ChatMessage = {
      ...mockMessage,
      content: 'Line 1\nLine 2\nLine 3',
    }
    const { container } = render(<UserMessage message={messageWithWhitespace} />)
    const content = container.querySelector('.whitespace-pre-wrap')
    expect(content).toBeInTheDocument()
    expect(content?.textContent).toBe('Line 1\nLine 2\nLine 3')
  })

  it('should display timestamp', () => {
    render(<UserMessage message={mockMessage} />)
    // formatTimestamp will return '방금 전' for a recent timestamp
    expect(screen.getByText(/방금 전|초 전|분 전/)).toBeInTheDocument()
  })
})
