import {
  ClickAIError,
  NetworkError,
  APIAuthError,
  TokenLimitError,
  StorageQuotaError,
  RateLimitError,
  getUserErrorMessage,
  ERROR_MESSAGES,
} from '../errors'

describe('Errors', () => {
  describe('ClickAIError', () => {
    it('should create error with code and message', () => {
      const error = new ClickAIError('Test message', 'TEST_ERROR')
      expect(error.code).toBe('TEST_ERROR')
      expect(error.message).toBe('Test message')
      expect(error.retryable).toBe(false)
      expect(error.details).toBeUndefined()
    })

    it('should accept retryable and details', () => {
      const details = { foo: 'bar' }
      const error = new ClickAIError('Message', 'TEST', true, details)
      expect(error.retryable).toBe(true)
      expect(error.details).toEqual(details)
    })

    it('should be instance of Error', () => {
      const error = new ClickAIError('Message', 'TEST')
      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(ClickAIError)
    })
  })

  describe('NetworkError', () => {
    it('should create network error', () => {
      const error = new NetworkError('Connection failed')
      expect(error.code).toBe('NETWORK_ERROR')
      expect(error.message).toBe('Connection failed')
      expect(error.retryable).toBe(true)
      expect(error).toBeInstanceOf(ClickAIError)
    })

    it('should accept details', () => {
      const details = { url: 'https://api.example.com' }
      const error = new NetworkError('Timeout', details)
      expect(error.details).toEqual(details)
    })
  })

  describe('APIAuthError', () => {
    it('should create auth error', () => {
      const error = new APIAuthError('Invalid API key')
      expect(error.code).toBe('API_AUTH_ERROR')
      expect(error.message).toBe('Invalid API key')
      expect(error.retryable).toBe(false)
      expect(error).toBeInstanceOf(ClickAIError)
    })
  })

  describe('TokenLimitError', () => {
    it('should create token limit error', () => {
      const error = new TokenLimitError('Token limit exceeded')
      expect(error.code).toBe('TOKEN_LIMIT_ERROR')
      expect(error.message).toBe('Token limit exceeded')
      expect(error.retryable).toBe(false)
    })
  })

  describe('StorageQuotaError', () => {
    it('should create storage quota error', () => {
      const error = new StorageQuotaError('Storage full')
      expect(error.code).toBe('STORAGE_QUOTA_ERROR')
      expect(error.message).toBe('Storage full')
      expect(error.retryable).toBe(false)
    })
  })

  describe('RateLimitError', () => {
    it('should create rate limit error', () => {
      const error = new RateLimitError('Rate limit exceeded')
      expect(error.code).toBe('RATE_LIMIT_ERROR')
      expect(error.message).toBe('Rate limit exceeded')
      expect(error.retryable).toBe(true)
    })
  })

  describe('getUserErrorMessage', () => {
    it('should return message for known error code', () => {
      const error = new NetworkError('Technical message')
      const userMessage = getUserErrorMessage(error)
      expect(userMessage).toBe(ERROR_MESSAGES.NETWORK_ERROR)
    })

    it('should return generic message for unknown error', () => {
      const error = new Error('Unknown error')
      const userMessage = getUserErrorMessage(error)
      expect(userMessage).toBe(ERROR_MESSAGES.UNKNOWN_ERROR)
    })

    it('should handle ClickAIError with custom code', () => {
      const error = new ClickAIError('Custom message', 'CUSTOM_CODE')
      const userMessage = getUserErrorMessage(error)
      expect(userMessage).toBe(ERROR_MESSAGES.UNKNOWN_ERROR)
    })

    it('should return correct messages for all error types', () => {
      const errors = [
        { error: new NetworkError('msg'), expected: ERROR_MESSAGES.NETWORK_ERROR },
        { error: new APIAuthError('msg'), expected: ERROR_MESSAGES.API_AUTH_ERROR },
        { error: new TokenLimitError('msg'), expected: ERROR_MESSAGES.TOKEN_LIMIT_ERROR },
        { error: new StorageQuotaError('msg'), expected: ERROR_MESSAGES.STORAGE_QUOTA_ERROR },
        { error: new RateLimitError('msg'), expected: ERROR_MESSAGES.RATE_LIMIT_ERROR },
      ]

      errors.forEach(({ error, expected }) => {
        expect(getUserErrorMessage(error)).toBe(expected)
      })
    })
  })

  describe('ERROR_MESSAGES', () => {
    it('should have Korean messages', () => {
      expect(ERROR_MESSAGES.NETWORK_ERROR).toContain('연결')
      expect(ERROR_MESSAGES.API_AUTH_ERROR).toContain('API')
      expect(ERROR_MESSAGES.TOKEN_LIMIT_ERROR).toContain('메시지')
      expect(ERROR_MESSAGES.STORAGE_QUOTA_ERROR).toContain('저장')
      expect(ERROR_MESSAGES.RATE_LIMIT_ERROR).toContain('요청')
      expect(ERROR_MESSAGES.UNKNOWN_ERROR).toContain('오류')
    })
  })
})
