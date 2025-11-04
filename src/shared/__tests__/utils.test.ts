import {
  generateUUID,
  formatTimestamp,
  withRetry,
  sleep,
  truncateString,
  safeJsonParse,
  compareVersions,
  debounce,
  throttle,
} from '../utils'

describe('Utils', () => {
  describe('generateUUID', () => {
    it('should generate a valid UUID v4', () => {
      const uuid = generateUUID()
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      expect(uuid).toMatch(uuidRegex)
    })

    it('should generate unique UUIDs', () => {
      const uuid1 = generateUUID()
      const uuid2 = generateUUID()
      expect(uuid1).not.toBe(uuid2)
    })
  })

  describe('formatTimestamp', () => {
    it('should format recent timestamp as "방금 전"', () => {
      const now = Date.now()
      expect(formatTimestamp(now)).toBe('방금 전')
    })

    it('should format timestamp from 30 seconds ago', () => {
      const thirtySecondsAgo = Date.now() - 30000
      const formatted = formatTimestamp(thirtySecondsAgo)
      // 30초는 1분 미만이므로 '방금 전'으로 표시됨
      expect(formatted).toBe('방금 전')
    })

    it('should format timestamp from 5 minutes ago', () => {
      const fiveMinutesAgo = Date.now() - 5 * 60000
      expect(formatTimestamp(fiveMinutesAgo)).toBe('5분 전')
    })

    it('should format timestamp from 2 hours ago', () => {
      const twoHoursAgo = Date.now() - 2 * 3600000
      expect(formatTimestamp(twoHoursAgo)).toBe('2시간 전')
    })

    it('should format timestamp from 3 days ago', () => {
      const threeDaysAgo = Date.now() - 3 * 86400000
      expect(formatTimestamp(threeDaysAgo)).toBe('3일 전')
    })

    it('should format old timestamp as date string', () => {
      const oldDate = new Date('2024-01-01').getTime()
      const formatted = formatTimestamp(oldDate)
      expect(formatted).toContain('2024')
      expect(formatted).toContain('1')
    })
  })

  describe('withRetry', () => {
    it('should succeed on first try', async () => {
      const fn = jest.fn().mockResolvedValue('success')
      const result = await withRetry(fn, 3, 100)
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should retry on failure and eventually succeed', async () => {
      jest.useRealTimers()
      const { NetworkError } = await import('../errors')
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new NetworkError('fail'))
        .mockRejectedValueOnce(new NetworkError('fail'))
        .mockResolvedValue('success')

      const result = await withRetry(fn, 3, 10)
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(3)
      jest.useFakeTimers()
    })

    it('should throw error after max retries', async () => {
      jest.useRealTimers()
      const { NetworkError } = await import('../errors')
      const fn = jest.fn().mockRejectedValue(new NetworkError('fail'))

      await expect(withRetry(fn, 3, 10)).rejects.toThrow('fail')
      expect(fn).toHaveBeenCalledTimes(3)
      jest.useFakeTimers()
    })
  })

  describe('sleep', () => {
    it('should resolve after specified time', async () => {
      jest.useRealTimers()
      const start = Date.now()
      await sleep(100)
      const elapsed = Date.now() - start
      expect(elapsed).toBeGreaterThanOrEqual(90)
      jest.useFakeTimers()
    })
  })

  describe('truncateString', () => {
    it('should not truncate short strings', () => {
      const text = 'short'
      expect(truncateString(text, 10)).toBe('short')
    })

    it('should truncate long strings', () => {
      const text = 'this is a very long string'
      const truncated = truncateString(text, 10)
      expect(truncated.length).toBe(10)
      expect(truncated).toContain('...')
    })

    it('should handle exact length', () => {
      const text = 'exact'
      expect(truncateString(text, 5)).toBe('exact')
    })
  })

  describe('safeJsonParse', () => {
    it('should parse valid JSON', () => {
      const json = '{"key": "value"}'
      expect(safeJsonParse(json)).toEqual({ key: 'value' })
    })

    it('should return default value for invalid JSON', () => {
      const invalid = '{invalid json}'
      const defaultValue = { error: true }
      expect(safeJsonParse(invalid, defaultValue)).toEqual(defaultValue)
    })

    it('should return default value for invalid JSON without explicit default', () => {
      const invalid = 'not json'
      const result = safeJsonParse(invalid, null)
      expect(result).toBeNull()
    })
  })

  describe('compareVersions', () => {
    it('should return 0 for equal versions', () => {
      expect(compareVersions('1.0.0', '1.0.0')).toBe(0)
    })

    it('should return 1 when first version is greater', () => {
      expect(compareVersions('2.0.0', '1.0.0')).toBe(1)
      expect(compareVersions('1.1.0', '1.0.0')).toBe(1)
      expect(compareVersions('1.0.1', '1.0.0')).toBe(1)
    })

    it('should return -1 when first version is smaller', () => {
      expect(compareVersions('1.0.0', '2.0.0')).toBe(-1)
      expect(compareVersions('1.0.0', '1.1.0')).toBe(-1)
      expect(compareVersions('1.0.0', '1.0.1')).toBe(-1)
    })

    it('should handle different version lengths', () => {
      expect(compareVersions('1.0', '1.0.0')).toBe(0)
      expect(compareVersions('1', '1.0.0')).toBe(0)
    })
  })

  describe('debounce', () => {
    jest.useFakeTimers()

    it('should delay function execution', () => {
      const fn = jest.fn()
      const debounced = debounce(fn, 100)

      debounced()
      expect(fn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should reset timer on multiple calls', () => {
      const fn = jest.fn()
      const debounced = debounce(fn, 100)

      debounced()
      jest.advanceTimersByTime(50)
      debounced()
      jest.advanceTimersByTime(50)
      expect(fn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(50)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    afterEach(() => {
      jest.clearAllTimers()
    })
  })

  describe('throttle', () => {
    jest.useFakeTimers()

    it('should execute immediately and then throttle', () => {
      const fn = jest.fn()
      const throttled = throttle(fn, 100)

      throttled()
      expect(fn).toHaveBeenCalledTimes(1)

      throttled()
      expect(fn).toHaveBeenCalledTimes(1)

      jest.advanceTimersByTime(100)
      throttled()
      expect(fn).toHaveBeenCalledTimes(2)
    })

    afterEach(() => {
      jest.clearAllTimers()
    })
  })
})
