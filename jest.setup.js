require('@testing-library/jest-dom')

// Mock chrome API
global.chrome = {
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
    getURL: jest.fn((path) => `chrome-extension://fake-id/${path}`),
  },
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn(),
      getBytesInUse: jest.fn(),
    },
    sync: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn(),
      getBytesInUse: jest.fn(),
    },
  },
  contextMenus: {
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    removeAll: jest.fn(),
  },
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn(),
  },
  sidePanel: {
    open: jest.fn(),
    setOptions: jest.fn(),
  },
}

// Mock fetch
global.fetch = jest.fn()

// Mock AbortController
global.AbortController = class AbortController {
  signal = {}
  abort() {}
}
