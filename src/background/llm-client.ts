// LLM API Client for Click AI Extension

import { ChatMessage } from '../shared/types'
import { APIAuthError, NetworkError, RateLimitError, TokenLimitError } from '../shared/errors'
import { encode } from 'gpt-3-encoder'

export interface LLMConfig {
  endpoint: string
  apiKey: string
  model: string
  temperature?: number
  maxTokens?: number
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export class LLMClient {
  private config: LLMConfig
  private abortController: AbortController | null = null

  constructor(config?: Partial<LLMConfig>) {
    this.config = {
      endpoint: config?.endpoint || import.meta.env.VITE_LLM_ENDPOINT || '',
      apiKey: config?.apiKey || import.meta.env.VITE_LLM_API_KEY || '',
      model: config?.model || import.meta.env.VITE_LLM_MODEL || 'gpt-4',
      temperature: config?.temperature || 0.7,
      maxTokens: config?.maxTokens || 2000,
    }

    if (!this.config.endpoint || !this.config.apiKey) {
      console.warn('LLM API configuration incomplete')
    }
  }

  /**
   * Stream chat completions from LLM API
   */
  async *streamChat(messages: ChatMessage[]): AsyncGenerator<string> {
    if (!this.config.endpoint || !this.config.apiKey) {
      throw new APIAuthError('LLM API configuration is missing')
    }

    const processedMessages = this.injectSystemInstructions(messages)

    // Check token count
    const tokenCount = this.countTokens(processedMessages)
    console.log(`Request token count: ${tokenCount}`)

    if (tokenCount > 8000) {
      // Conservative limit
      throw new TokenLimitError(
        `Token count (${tokenCount}) exceeds limit. Please shorten your messages.`
      )
    }

    // Create abort controller for cancellation
    this.abortController = new AbortController()

    try {
      const response = await fetch(`${this.config.endpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: processedMessages.map((m) => ({ role: m.role, content: m.content })),
          stream: true,
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
        }),
        signal: this.abortController.signal,
      })

      if (!response.ok) {
        await this.handleErrorResponse(response)
      }

      // Process streaming response
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          console.log('Stream complete')
          break
        }

        // Decode chunk and add to buffer
        buffer += decoder.decode(value, { stream: true })

        // Split buffer by newlines
        const lines = buffer.split('\n')

        // Keep incomplete line in buffer
        buffer = lines.pop() || ''

        // Process each complete line
        for (const line of lines) {
          if (line.trim() === '') continue
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()

            if (data === '[DONE]') {
              return
            }

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content

              if (content) {
                yield content
              }
            } catch (e) {
              console.warn('Failed to parse SSE line:', line)
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Request cancelled')
        return
      }

      if (error instanceof APIAuthError || error instanceof RateLimitError) {
        throw error
      }

      throw new NetworkError('Failed to connect to LLM API', error)
    } finally {
      this.abortController = null
    }
  }

  /**
   * Cancel ongoing stream
   */
  cancel(): void {
    if (this.abortController) {
      console.log('Cancelling LLM request')
      this.abortController.abort()
      this.abortController = null
    }
  }

  /**
   * Count tokens in messages
   */
  countTokens(messages: ChatMessage[]): number {
    const text = messages.map((m) => m.content).join('\n')
    return encode(text).length
  }

  /**
   * Handle error response from API
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    const status = response.status
    let errorMessage = `API error: ${status}`

    try {
      const errorData = await response.json()
      errorMessage = errorData.error?.message || errorMessage
    } catch {
      // Ignore JSON parse errors
    }

    if (status === 401 || status === 403) {
      throw new APIAuthError(errorMessage)
    }

    if (status === 429) {
      throw new RateLimitError(errorMessage)
    }

    if (status >= 500) {
      throw new NetworkError(errorMessage)
    }

    throw new APIAuthError(errorMessage)
  }

  /**
   * Injects system instructions (citations, suggested questions) into the system message.
   */
  private injectSystemInstructions(messages: ChatMessage[]): ChatMessage[] {
    const processedMessages = messages.map((msg) => ({ ...msg })) // Deep copy
    const systemMessage = processedMessages.find((msg) => msg.role === 'system')

    if (!systemMessage) {
      // Should not happen in normal flow, but good to handle
      return processedMessages
    }

    // Instructions for suggested questions
    const suggestedQuestionInstruction = `
---
SUGGESTED QUESTIONS INSTRUCTIONS:
- After your main response, suggest 2-3 relevant follow-up questions the user might have.
- Each suggested question MUST be on a new line and start with the prefix "SUGGESTED_QUESTION:".
- Example:
SUGGESTED_QUESTION: Can you explain this in simpler terms?
SUGGESTED_QUESTION: How does this compare to other methods?
---
`
    systemMessage.content += suggestedQuestionInstruction

    // Instructions for citations (if page context is present)
    if (systemMessage.content.includes('Page Context:')) {
      const citationInstruction = `
---
CITATION INSTRUCTIONS:
- When you use information from the provided page context in your response, you MUST cite the source.
- To cite, find the corresponding reference ID (e.g., [click-ai-ref-0], [click-ai-ref-1], etc.) from the beginning of the text chunk you are referencing.
- Place the citation ID directly after the sentence or statement it supports.
- You can cite multiple sources for a single statement. Example: "This is a statement supported by two sources [click-ai-ref-5][click-ai-ref-12]."
- Do NOT invent sources. Only use the IDs provided in the context.
- Do NOT cite sources for information that is not from the provided context.
---
`
      systemMessage.content += citationInstruction
    }

    return processedMessages
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<LLMConfig>): void {
    this.config = { ...this.config, ...config }
    console.log('LLM configuration updated')
  }
}

// Create singleton instance
export const llmClient = new LLMClient()
