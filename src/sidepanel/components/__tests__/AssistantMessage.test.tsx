import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AssistantMessage from '../AssistantMessage'
import type { ChatMessage } from '@/shared/types'

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
})

describe('AssistantMessage', () => {
  const mockMessage: ChatMessage = {
    id: '123',
    role: 'assistant',
    content: 'Hello! How can I help you?',
    timestamp: Date.now(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render message content', () => {
    render(<AssistantMessage message={mockMessage} />)
    expect(screen.getByText('Hello! How can I help you?')).toBeInTheDocument()
  })

  it('should render markdown content', () => {
    const markdownMessage: ChatMessage = {
      ...mockMessage,
      content: '**Bold** and *italic* text',
    }
    render(<AssistantMessage message={markdownMessage} />)
    expect(screen.getByText(/Bold/)).toBeInTheDocument()
    expect(screen.getByText(/italic/)).toBeInTheDocument()
  })

  it('should show thinking indicator for empty content', () => {
    const emptyMessage: ChatMessage = {
      ...mockMessage,
      content: '',
    }
    render(<AssistantMessage message={emptyMessage} />)
    // The markdown renderer shows it with underscores
    expect(screen.getByText('_생각 중..._')).toBeInTheDocument()
  })

  it('should handle copy button click', async () => {
    render(<AssistantMessage message={mockMessage} />)

    const copyButton = screen.getByRole('button', { name: /복사/ })
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockMessage.content)
      expect(screen.getByRole('button', { name: /복사됨/ })).toBeInTheDocument()
    })
  })

  it('should reset copy button text after 2 seconds', async () => {
    jest.useFakeTimers()
    render(<AssistantMessage message={mockMessage} />)

    const copyButton = screen.getByRole('button', { name: /복사/ })
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /복사됨/ })).toBeInTheDocument()
    })

    jest.advanceTimersByTime(2000)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^복사$/ })).toBeInTheDocument()
    })

    jest.useRealTimers()
  })

  it('should display timestamp', () => {
    render(<AssistantMessage message={mockMessage} />)
    expect(screen.getByText(/방금 전|초 전|분 전/)).toBeInTheDocument()
  })
})
