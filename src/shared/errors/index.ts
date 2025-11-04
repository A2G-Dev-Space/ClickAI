// Error handling system for Click AI Extension

export class ClickAIError extends Error {
  code: string
  details?: any
  retryable: boolean

  constructor(message: string, code: string, retryable = false, details?: any) {
    super(message)
    this.name = 'ClickAIError'
    this.code = code
    this.retryable = retryable
    this.details = details

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ClickAIError)
    }
  }
}

export class NetworkError extends ClickAIError {
  constructor(message = 'Network connection failed', details?: any) {
    super(message, 'NETWORK_ERROR', true, details)
    this.name = 'NetworkError'
  }
}

export class APIAuthError extends ClickAIError {
  constructor(message = 'API authentication failed', details?: any) {
    super(message, 'API_AUTH_ERROR', false, details)
    this.name = 'APIAuthError'
  }
}

export class TokenLimitError extends ClickAIError {
  constructor(message = 'Token limit exceeded', details?: any) {
    super(message, 'TOKEN_LIMIT_ERROR', false, details)
    this.name = 'TokenLimitError'
  }
}

export class StorageQuotaError extends ClickAIError {
  constructor(message = 'Storage quota exceeded', details?: any) {
    super(message, 'STORAGE_QUOTA_ERROR', false, details)
    this.name = 'StorageQuotaError'
  }
}

export class RateLimitError extends ClickAIError {
  constructor(message = 'Rate limit exceeded', details?: any) {
    super(message, 'RATE_LIMIT_ERROR', true, details)
    this.name = 'RateLimitError'
  }
}

// Error messages for user display
export const ERROR_MESSAGES: Record<string, string> = {
  NETWORK_ERROR: 'AI에 연결할 수 없습니다. 인터넷 연결을 확인하세요.',
  API_AUTH_ERROR: 'API 인증에 실패했습니다. 설정을 확인하세요.',
  TOKEN_LIMIT_ERROR: '메시지가 너무 깁니다. 짧게 줄여서 다시 시도하세요.',
  STORAGE_QUOTA_ERROR: '저장 공간이 부족합니다. 오래된 채팅을 삭제하세요.',
  RATE_LIMIT_ERROR: 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도하세요.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다. 다시 시도하세요.',
}

// Get user-friendly error message
export function getUserErrorMessage(error: Error | ClickAIError): string {
  if (error instanceof ClickAIError) {
    return ERROR_MESSAGES[error.code] || ERROR_MESSAGES.UNKNOWN_ERROR
  }
  return ERROR_MESSAGES.UNKNOWN_ERROR
}
