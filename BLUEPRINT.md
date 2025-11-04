# Click AI Architecture Blueprint

**Document Version:** 1.0.0
**Last Updated:** 2025-11-04
**Status:** Design Phase

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Overview](#2-system-overview)
3. [Architecture Patterns](#3-architecture-patterns)
4. [Component Architecture](#4-component-architecture)
5. [Data Flow](#5-data-flow)
6. [Technology Stack](#6-technology-stack)
7. [API Specifications](#7-api-specifications)
8. [Security Architecture](#8-security-architecture)
9. [Performance Optimization](#9-performance-optimization)
10. [Deployment Strategy](#10-deployment-strategy)
11. [Testing Strategy](#11-testing-strategy)
12. [Appendices](#12-appendices)

---

## 1. Executive Summary

### 1.1 Purpose

This document provides a comprehensive architectural blueprint for Click AI, a Chrome/Edge browser extension that integrates AI capabilities into the browsing experience. It serves as the definitive technical reference for developers, architects, and stakeholders.

### 1.2 Scope

The blueprint covers:
- High-level system architecture
- Component design and interactions
- Data flow and state management
- Technology choices and justifications
- Security and performance considerations
- Deployment and testing strategies

### 1.3 Audience

- **Primary:** Development team implementing the extension
- **Secondary:** Technical reviewers, QA engineers, DevOps team
- **Tertiary:** Non-technical stakeholders (for high-level understanding)

---

## 2. System Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Chrome/Edge Browser                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                      Presentation Layer                        │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │  │
│  │  │ Side Panel  │  │  Popover    │  │  Full Mode (Tab)    │  │  │
│  │  │  (React)    │  │  (React)    │  │     (React)         │  │  │
│  │  │             │  │             │  │                     │  │  │
│  │  │ - ChatView  │  │ - DiffView  │  │ - Expanded Chat     │  │  │
│  │  │ - History   │  │ - Actions   │  │ - Same Components   │  │  │
│  │  │ - Settings  │  │             │  │                     │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘  │  │
│  └───────────────────────────┬──────────────────────────────────┘  │
│                               │ chrome.runtime.sendMessage()        │
│  ────────────────────────────┼──────────────────────────────────────
│                               │                                     │
│  ┌───────────────────────────┴──────────────────────────────────┐  │
│  │                    Business Logic Layer                       │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │           Service Worker (Background Script)          │   │  │
│  │  │                                                        │   │  │
│  │  │  ┌─────────────────┐  ┌──────────────────────────┐  │   │  │
│  │  │  │ Message Router  │  │  LLM API Client         │  │   │  │
│  │  │  │                 │  │  - Streaming            │  │   │  │
│  │  │  │ - Route msgs    │  │  - Error handling       │  │   │  │
│  │  │  │ - Validate      │  │  - Retry logic          │  │   │  │
│  │  │  │ - Transform     │  │                          │  │   │  │
│  │  │  └─────────────────┘  └──────────────────────────┘  │   │  │
│  │  │                                                        │   │  │
│  │  │  ┌─────────────────┐  ┌──────────────────────────┐  │   │  │
│  │  │  │ Storage Manager │  │  Update Checker         │  │   │  │
│  │  │  │                 │  │  - GitHub API           │  │   │  │
│  │  │  │ - CRUD ops      │  │  - Version compare      │  │   │  │
│  │  │  │ - Sync/Local    │  │  - Notifications        │  │   │  │
│  │  │  └─────────────────┘  └──────────────────────────┘  │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────┬──────────────────────────────────┘  │
│                               │ chrome.tabs.sendMessage()           │
│  ────────────────────────────┼──────────────────────────────────────
│                               │                                     │
│  ┌───────────────────────────┴──────────────────────────────────┐  │
│  │                     Integration Layer                         │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │              Content Script (Injected)                │   │  │
│  │  │                                                        │   │  │
│  │  │  ┌─────────────────┐  ┌──────────────────────────┐  │   │  │
│  │  │  │ Page Parser     │  │  Popover Renderer       │  │   │  │
│  │  │  │                 │  │                          │  │   │  │
│  │  │  │ - Readability   │  │  - Shadow DOM           │  │   │  │
│  │  │  │ - Metadata      │  │  - React portal         │  │   │  │
│  │  │  │ - Sanitization  │  │  - Positioning          │  │   │  │
│  │  │  └─────────────────┘  └──────────────────────────┘  │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────┬──────────────────────────────────┘  │
│                               │ DOM Access                          │
│  ────────────────────────────┼──────────────────────────────────────
│                               │                                     │
│  ┌───────────────────────────┴──────────────────────────────────┐  │
│  │                        Web Page (DOM)                         │  │
│  │  - HTML Content   - User Interactions   - Text Selection     │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

                              ↕ HTTPS
┌─────────────────────────────────────────────────────────────────────┐
│                        External Services                             │
│  ┌──────────────────────┐         ┌──────────────────────────────┐  │
│  │  LLM API             │         │  GitHub Releases API         │  │
│  │  (OpenAI-compatible) │         │  (Version check)             │  │
│  │  - Chat completion   │         │  - /releases/latest          │  │
│  │  - Streaming         │         │                              │  │
│  └──────────────────────┘         └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

                              ↕ chrome.storage API
┌─────────────────────────────────────────────────────────────────────┐
│                         Browser Storage                              │
│  ┌──────────────────────┐         ┌──────────────────────────────┐  │
│  │  chrome.storage.local│         │  chrome.storage.sync         │  │
│  │  (10MB max)          │         │  (100KB max)                 │  │
│  │  - Chat sessions     │         │  - User settings             │  │
│  │  - Message history   │         │  - Theme preference          │  │
│  │  - Page context      │         │  - Language                  │  │
│  └──────────────────────┘         └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Core Principles

#### 2.2.1 Separation of Concerns
- **Presentation Layer:** UI components (React)
- **Business Logic Layer:** Service Worker (background script)
- **Integration Layer:** Content scripts (DOM access)
- **Data Layer:** Chrome Storage (persistence)

#### 2.2.2 Manifest V3 Compliance
- Service Worker-based background script (no persistent background pages)
- Declarative API usage wherever possible
- Minimal host permissions
- Content Security Policy (CSP) adherence

#### 2.2.3 Privacy by Design
- All data stored locally in browser
- No telemetry or analytics
- LLM API calls only when user initiates
- Sensitive information filtering before sending to LLM

#### 2.2.4 Offline-First for UI
- Chat history accessible offline
- Settings persisted locally
- Graceful degradation when network unavailable

---

## 3. Architecture Patterns

### 3.1 Messaging Architecture (Event-Driven)

#### 3.1.1 Message Types

```typescript
// src/shared/types.ts
enum MessageType {
  // Chat-related
  SEND_CHAT = 'SEND_CHAT',
  CHAT_CHUNK = 'CHAT_CHUNK',
  CHAT_COMPLETE = 'CHAT_COMPLETE',
  CHAT_ERROR = 'CHAT_ERROR',
  CANCEL_CHAT = 'CANCEL_CHAT',

  // Context menu
  CONTEXT_MENU_ACTION = 'CONTEXT_MENU_ACTION',
  SHOW_CONTEXT_RESULT = 'SHOW_CONTEXT_RESULT',

  // Page parsing
  PARSE_PAGE = 'PARSE_PAGE',
  PAGE_PARSED = 'PAGE_PARSED',

  // Storage operations
  SAVE_SESSION = 'SAVE_SESSION',
  LOAD_SESSIONS = 'LOAD_SESSIONS',
  DELETE_SESSION = 'DELETE_SESSION',

  // Settings
  UPDATE_SETTINGS = 'UPDATE_SETTINGS',
  GET_SETTINGS = 'GET_SETTINGS',

  // Update checker
  CHECK_UPDATES = 'CHECK_UPDATES',
  UPDATE_AVAILABLE = 'UPDATE_AVAILABLE',
}

interface Message<T = any> {
  type: MessageType;
  payload: T;
  timestamp: number;
  requestId?: string; // For request-response pattern
}
```

#### 3.1.2 Message Flow Patterns

**Pattern 1: Request-Response (Synchronous)**
```
UI Component → Service Worker → UI Component
       [sendMessage]     [response]
```

**Pattern 2: Event Broadcasting (Asynchronous)**
```
Service Worker → All Listeners
       [sendMessage to all tabs/views]
```

**Pattern 3: Streaming (Long-Running)**
```
UI → Service Worker → UI (chunk) → UI (chunk) → ... → UI (complete)
```

### 3.2 State Management Pattern

#### 3.2.1 Zustand Store Structure

```typescript
// src/sidepanel/store/chatStore.ts
interface ChatStore {
  // State
  currentSession: ChatSession | null;
  messages: Message[];
  isLoading: boolean;
  isChatWithPageEnabled: boolean;
  pageContext: PageContext | null;
  error: string | null;

  // Actions (imperative)
  sendMessage: (content: string) => Promise<void>;
  cancelMessage: () => void;
  loadSession: (sessionId: string) => Promise<void>;
  createNewSession: () => void;
  toggleChatWithPage: () => Promise<void>;
  clearError: () => void;

  // Selectors (derived state)
  getLastUserMessage: () => Message | null;
  getLastAssistantMessage: () => Message | null;
  getTotalMessageCount: () => number;
}
```

#### 3.2.2 State Persistence Strategy

- **React State (UI):** Ephemeral state (input values, UI flags)
- **Zustand Store:** Session state (current chat, messages)
- **chrome.storage.local:** Persistent state (chat history)
- **chrome.storage.sync:** User preferences (theme, language)

**Sync Flow:**
```
User Action → Zustand Store (update) → chrome.storage (auto-save)
                         ↓
                    UI Re-render
```

### 3.3 Error Handling Pattern

#### 3.3.1 Error Hierarchy

```typescript
// src/shared/errors.ts
class ClickAIError extends Error {
  code: string;
  details?: any;
  retryable: boolean;
}

class NetworkError extends ClickAIError {
  code = 'NETWORK_ERROR';
  retryable = true;
}

class APIAuthError extends ClickAIError {
  code = 'API_AUTH_ERROR';
  retryable = false;
}

class TokenLimitError extends ClickAIError {
  code = 'TOKEN_LIMIT_ERROR';
  retryable = false;
}

class StorageQuotaError extends ClickAIError {
  code = 'STORAGE_QUOTA_ERROR';
  retryable = false;
}
```

#### 3.3.2 Error Recovery Strategy

```
Error Occurs → Classify Error → Retryable?
                                     ├─ Yes → Retry with backoff (max 3 attempts)
                                     └─ No → Show user-friendly message + action
```

**User-Facing Error Messages:**
```typescript
const ERROR_MESSAGES = {
  NETWORK_ERROR: "Unable to connect to AI. Please check your internet connection.",
  API_AUTH_ERROR: "Invalid API key. Please contact your administrator.",
  TOKEN_LIMIT_ERROR: "Your message is too long. Please shorten it and try again.",
  STORAGE_QUOTA_ERROR: "Storage full. Please delete old chats to free up space.",
};
```

---

## 4. Component Architecture

### 4.1 Service Worker Architecture

#### 4.1.1 Lifecycle Management

```typescript
// src/background/index.ts
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // First install: Initialize default settings
    initializeSettings();
    showWelcomeNotification();
  } else if (details.reason === 'update') {
    // Update: Run migration if needed
    runDataMigration(details.previousVersion);
  }

  // Register context menus
  setupContextMenus();
});

chrome.runtime.onStartup.addListener(() => {
  // Browser startup: Restore state
  restoreState();

  // Start update checker alarm
  chrome.alarms.create('updateCheck', { periodInMinutes: 1440 }); // 24 hours
});

// Keepalive mechanism (prevent SW termination)
let keepAliveInterval: NodeJS.Timeout;
function startKeepalive() {
  keepAliveInterval = setInterval(() => {
    chrome.runtime.getPlatformInfo(); // Dummy call to keep SW alive
  }, 20000); // Every 20 seconds
}
```

#### 4.1.2 Message Router

```typescript
// src/background/message-router.ts
class MessageRouter {
  private handlers: Map<MessageType, MessageHandler> = new Map();

  register(type: MessageType, handler: MessageHandler) {
    this.handlers.set(type, handler);
  }

  async handle(message: Message, sender: chrome.runtime.MessageSender) {
    const handler = this.handlers.get(message.type);

    if (!handler) {
      throw new Error(`No handler for message type: ${message.type}`);
    }

    try {
      const result = await handler(message.payload, sender);
      return { success: true, data: result };
    } catch (error) {
      console.error(`Error handling message ${message.type}:`, error);
      return { success: false, error: error.message };
    }
  }
}

// Register handlers
const router = new MessageRouter();
router.register(MessageType.SEND_CHAT, handleSendChat);
router.register(MessageType.PARSE_PAGE, handleParsePage);
router.register(MessageType.SAVE_SESSION, handleSaveSession);
// ... more handlers

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  router.handle(message, sender).then(sendResponse);
  return true; // Keep channel open for async response
});
```

### 4.2 LLM API Client Architecture

#### 4.2.1 Streaming Implementation

```typescript
// src/background/llm-client.ts
class LLMClient {
  private endpoint: string;
  private apiKey: string;
  private model: string;
  private abortController: AbortController | null = null;

  constructor() {
    this.endpoint = import.meta.env.VITE_LLM_ENDPOINT;
    this.apiKey = import.meta.env.VITE_LLM_API_KEY;
    this.model = import.meta.env.VITE_LLM_MODEL;
  }

  async *streamChat(messages: Message[]): AsyncGenerator<string> {
    this.abortController = new AbortController();

    const response = await fetch(`${this.endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        stream: true,
        temperature: 0.7,
      }),
      signal: this.abortController.signal,
    });

    if (!response.ok) {
      throw new APIAuthError(`API error: ${response.status}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch (e) {
            console.warn('Failed to parse SSE line:', line);
          }
        }
      }
    }
  }

  cancel() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}
```

#### 4.2.2 Retry Logic with Exponential Backoff

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (!error.retryable || attempt === maxRetries - 1) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
      console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Max retries exceeded');
}
```

### 4.3 Storage Manager Architecture

#### 4.3.1 Storage Abstraction Layer

```typescript
// src/background/storage.ts
class StorageManager {
  // Chat session operations (chrome.storage.local)
  async saveChatSession(session: ChatSession): Promise<void> {
    const key = `session_${session.id}`;
    await chrome.storage.local.set({ [key]: session });
  }

  async loadChatSessions(): Promise<ChatSession[]> {
    const items = await chrome.storage.local.get(null);
    const sessions: ChatSession[] = [];

    for (const [key, value] of Object.entries(items)) {
      if (key.startsWith('session_')) {
        sessions.push(value as ChatSession);
      }
    }

    return sessions.sort((a, b) => b.updatedAt - a.updatedAt);
  }

  async deleteChatSession(id: string): Promise<void> {
    const key = `session_${id}`;
    await chrome.storage.local.remove(key);
  }

  async getChatSession(id: string): Promise<ChatSession | null> {
    const key = `session_${id}`;
    const result = await chrome.storage.local.get(key);
    return result[key] || null;
  }

  // Settings operations (chrome.storage.sync)
  async saveSettings(settings: UserSettings): Promise<void> {
    await chrome.storage.sync.set({ settings });
  }

  async loadSettings(): Promise<UserSettings> {
    const result = await chrome.storage.sync.get('settings');
    return result.settings || DEFAULT_SETTINGS;
  }

  // Utility methods
  async getStorageUsage(): Promise<number> {
    return await chrome.storage.local.getBytesInUse();
  }

  async clearAllSessions(): Promise<void> {
    const items = await chrome.storage.local.get(null);
    const sessionKeys = Object.keys(items).filter(k => k.startsWith('session_'));
    await chrome.storage.local.remove(sessionKeys);
  }
}
```

#### 4.3.2 Data Compression (for large sessions)

```typescript
import LZString from 'lz-string';

function compressSession(session: ChatSession): string {
  const json = JSON.stringify(session);
  return LZString.compress(json);
}

function decompressSession(compressed: string): ChatSession {
  const json = LZString.decompress(compressed);
  return JSON.parse(json);
}
```

### 4.4 Content Script Architecture

#### 4.4.1 Page Parser

```typescript
// src/content/parser.ts
import { Readability } from '@mozilla/readability';

class PageParser {
  private sensitivePatterns = [
    /\b\d{16}\b/, // Credit card numbers
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Emails
  ];

  parsePageContent(): string {
    // Try Readability.js first
    const documentClone = document.cloneNode(true) as Document;
    const reader = new Readability(documentClone);
    const article = reader.parse();

    if (article && article.textContent.length > 100) {
      return this.sanitize(article.textContent);
    }

    // Fallback: Extract from <article> or <main>
    const main = document.querySelector('article, main');
    if (main) {
      return this.sanitize(main.innerText);
    }

    // Last resort: body text
    return this.sanitize(document.body.innerText);
  }

  getPageMetadata(): PageMetadata {
    return {
      title: document.title,
      url: window.location.href,
      publishDate: this.extractPublishDate(),
    };
  }

  private sanitize(text: string): string {
    // Remove excessive whitespace
    text = text.replace(/\s+/g, ' ').trim();

    // Filter sensitive info
    for (const pattern of this.sensitivePatterns) {
      text = text.replace(pattern, '[REDACTED]');
    }

    return text;
  }

  private extractPublishDate(): string | undefined {
    // Try common meta tags
    const metaDate = document.querySelector('meta[property="article:published_time"]');
    if (metaDate) {
      return metaDate.getAttribute('content') || undefined;
    }

    // Try <time> element
    const timeElement = document.querySelector('time[datetime]');
    if (timeElement) {
      return timeElement.getAttribute('datetime') || undefined;
    }

    return undefined;
  }
}
```

#### 4.4.2 Popover Renderer (Shadow DOM)

```typescript
// src/content/popover.tsx
class PopoverRenderer {
  private shadowRoot: ShadowRoot | null = null;
  private container: HTMLDivElement | null = null;

  show(result: ContextMenuResult) {
    // Create container
    this.container = document.createElement('div');
    this.container.id = 'click-ai-popover';
    document.body.appendChild(this.container);

    // Create shadow root for style isolation
    this.shadowRoot = this.container.attachShadow({ mode: 'open' });

    // Inject styles
    const style = document.createElement('style');
    style.textContent = popoverStyles;
    this.shadowRoot.appendChild(style);

    // Create React root and render
    const root = document.createElement('div');
    this.shadowRoot.appendChild(root);

    ReactDOM.render(
      <PopoverContent result={result} onClose={() => this.hide()} />,
      root
    );

    // Position popover
    this.position();
  }

  hide() {
    if (this.container) {
      this.container.remove();
      this.container = null;
      this.shadowRoot = null;
    }
  }

  private position() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    if (!this.container) return;

    // Position above selection (or below if not enough space)
    const popoverHeight = 400;
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;

    if (spaceAbove > popoverHeight || spaceAbove > spaceBelow) {
      // Show above
      this.container.style.top = `${window.scrollY + rect.top - popoverHeight - 10}px`;
    } else {
      // Show below
      this.container.style.top = `${window.scrollY + rect.bottom + 10}px`;
    }

    // Center horizontally
    const popoverWidth = 600;
    let left = rect.left + rect.width / 2 - popoverWidth / 2;
    left = Math.max(10, Math.min(left, window.innerWidth - popoverWidth - 10));
    this.container.style.left = `${left}px`;
  }
}
```

### 4.5 React Component Architecture

#### 4.5.1 Component Hierarchy

```
App
├── Header
│   ├── Logo
│   ├── NewChatButton
│   ├── HistoryButton
│   ├── SettingsButton
│   └── FullModeButton
├── Router (state-based)
│   ├── ChatView
│   │   ├── MessageList
│   │   │   ├── UserMessage
│   │   │   └── AssistantMessage
│   │   │       ├── MarkdownRenderer
│   │   │       │   └── CodeBlock
│   │   │       └── CopyButton
│   │   ├── ChatInput
│   │   │   ├── Textarea
│   │   │   ├── SendButton
│   │   │   └── ChatWithPageToggle
│   │   └── LoadingIndicator
│   ├── HistoryView
│   │   ├── SessionList
│   │   │   └── SessionItem
│   │   └── EmptyState
│   └── SettingsView
│       ├── ThemeSelector
│       ├── LanguageSelector
│       └── DataManagement
└── Toast (notifications)
```

#### 4.5.2 Component Pattern (Smart vs. Dumb)

**Smart Components (Connected to Store):**
```typescript
// src/sidepanel/components/ChatView.tsx
export function ChatView() {
  const { messages, isLoading, sendMessage } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom on new message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-view">
      <MessageList messages={messages} />
      <div ref={messagesEndRef} />
      {isLoading && <LoadingIndicator />}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
```

**Dumb Components (Presentational):**
```typescript
// src/sidepanel/components/UserMessage.tsx
interface UserMessageProps {
  content: string;
  timestamp: number;
}

export function UserMessage({ content, timestamp }: UserMessageProps) {
  return (
    <div className="user-message">
      <div className="message-content">{content}</div>
      <div className="message-timestamp">{formatTimestamp(timestamp)}</div>
    </div>
  );
}
```

---

## 5. Data Flow

### 5.1 Chat Message Flow (Detailed)

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. User Input                                                        │
│    User types message in ChatInput and presses Enter                │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 2. Client-Side Validation                                           │
│    - Check message not empty                                        │
│    - Check message length < 10,000 chars                            │
│    - Show error if invalid                                          │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 3. Update UI State (Optimistic)                                     │
│    chatStore.messages.push({                                        │
│      role: 'user', content: userInput, timestamp: Date.now()        │
│    })                                                                │
│    chatStore.isLoading = true                                       │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 4. Send to Service Worker                                           │
│    chrome.runtime.sendMessage({                                     │
│      type: 'SEND_CHAT',                                             │
│      payload: { messages: chatStore.messages, sessionId: ... }      │
│    })                                                                │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 5. Service Worker Processes                                         │
│    - Validate request                                               │
│    - Add system prompt (with page context if enabled)               │
│    - Check token count                                              │
│    - Call LLM API (streamChat)                                      │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 6. Stream Response Chunks                                           │
│    For each chunk from LLM:                                         │
│      chrome.runtime.sendMessage({                                   │
│        type: 'CHAT_CHUNK',                                          │
│        payload: { sessionId, chunk }                                │
│      })                                                              │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 7. UI Updates (Real-Time)                                           │
│    On receiving chunk:                                              │
│      - If first chunk: Create new assistant message                 │
│      - Else: Append chunk to existing message                       │
│      - Re-render MessageList (React auto-updates)                   │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 8. Stream Complete                                                  │
│    chrome.runtime.sendMessage({                                     │
│      type: 'CHAT_COMPLETE',                                         │
│      payload: { sessionId }                                         │
│    })                                                                │
│    chatStore.isLoading = false                                      │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 9. Auto-Save to Storage                                             │
│    storageManager.saveChatSession(chatStore.currentSession)         │
│    → chrome.storage.local.set(...)                                  │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 Context Menu Flow (Detailed)

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. User Selects Text                                                │
│    User highlights text on webpage                                  │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 2. Right-Click & Menu Selection                                     │
│    User right-clicks → "Click AI" → "Fix Grammar"                   │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 3. Context Menu Click Handler (Service Worker)                      │
│    chrome.contextMenus.onClicked.addListener((info, tab) => {       │
│      const selectedText = info.selectionText;                       │
│      const action = info.menuItemId; // 'grammar', 'translate', etc.│
│    })                                                                │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 4. Call LLM API (Non-Streaming)                                     │
│    const result = await llmClient.correctGrammar(selectedText);     │
│    // Or translate(), refineExpression()                            │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 5. Compute Diff                                                     │
│    import { diff_match_patch } from 'diff-match-patch';             │
│    const dmp = new diff_match_patch();                              │
│    const diffs = dmp.diff_main(selectedText, result);               │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 6. Send Result to Content Script                                    │
│    chrome.tabs.sendMessage(tab.id, {                                │
│      type: 'SHOW_CONTEXT_RESULT',                                   │
│      payload: { original: selectedText, result, diffs, type }       │
│    })                                                                │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 7. Content Script Receives & Renders Popover                        │
│    PopoverRenderer.show(payload);                                   │
│    - Create Shadow DOM                                              │
│    - Inject React popover                                           │
│    - Position near selection                                        │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 8. User Interactions                                                │
│    - "Copy" button: navigator.clipboard.writeText(result)           │
│    - "Edit in Sidebar": Open sidebar with pre-filled text           │
│    - Close (X, ESC, click outside): PopoverRenderer.hide()          │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.3 Chat with Page Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. User Toggles "Chat with Page" ON                                 │
│    chatStore.toggleChatWithPage()                                   │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 2. Request Page Parse                                               │
│    chrome.tabs.sendMessage(activeTab.id, {                          │
│      type: 'PARSE_PAGE'                                             │
│    })                                                                │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 3. Content Script Parses Page                                       │
│    const parser = new PageParser();                                 │
│    const content = parser.parsePageContent();                       │
│    const metadata = parser.getPageMetadata();                       │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 4. Return Parsed Content                                            │
│    sendResponse({                                                   │
│      success: true,                                                 │
│      data: { content, metadata }                                    │
│    })                                                                │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 5. Store Page Context                                               │
│    chatStore.pageContext = { content, metadata };                   │
│    chatStore.isChatWithPageEnabled = true;                          │
│    Show toast: "Page content analyzed"                              │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 6. User Sends Message                                               │
│    (Same as normal chat, but with added context)                    │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 7. Construct LLM Request with Page Context                          │
│    messages = [                                                     │
│      {                                                               │
│        role: 'system',                                              │
│        content: `Page Title: ${metadata.title}                      │
│                  URL: ${metadata.url}                               │
│                  Content: ${content}`                               │
│      },                                                              │
│      ...chatStore.messages                                          │
│    ]                                                                 │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 8. Token Management                                                 │
│    totalTokens = countTokens(messages);                             │
│    if (totalTokens > MAX_TOKENS) {                                  │
│      content = truncateToTokenLimit(content, ...);                  │
│      Show warning: "Page too long, using excerpts"                  │
│    }                                                                 │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 9. Send to LLM & Stream Response                                    │
│    (Same as normal chat flow)                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. Technology Stack

### 6.1 Core Technologies

| Layer | Technology | Version | Justification |
|-------|------------|---------|---------------|
| **Framework** | React | 18.2+ | - Component-based architecture<br>- Large ecosystem<br>- Excellent TypeScript support<br>- Virtual DOM for efficient updates |
| **Language** | TypeScript | 5.0+ | - Type safety reduces runtime errors<br>- Better IDE support (autocomplete, refactoring)<br>- Self-documenting code<br>- Easier to maintain large codebase |
| **Build Tool** | Vite | 4.0+ | - 10-100x faster than Webpack<br>- Native ESM support<br>- Excellent HMR (Hot Module Replacement)<br>- Simple configuration<br>- Plugin for Chrome Extensions ([@crxjs/vite-plugin](https://github.com/crxjs/chrome-extension-tools)) |
| **State Management** | Zustand | 4.3+ | - Minimal boilerplate (vs Redux)<br>- Hook-based API (idiomatic React)<br>- No Context Provider hell<br>- 1KB gzipped<br>- Built-in dev tools |
| **Styling** | TailwindCSS | 3.3+ | - Utility-first = faster development<br>- Consistent design system<br>- Tiny production bundles (tree-shaking)<br>- No CSS naming conflicts<br>- Dark mode built-in |

### 6.2 Key Libraries

| Library | Purpose | Why This Choice? |
|---------|---------|------------------|
| **react-markdown** | Markdown rendering | - Most popular React markdown renderer<br>- GFM support via plugins<br>- Customizable components |
| **remark-gfm** | GitHub Flavored Markdown | - Tables, strikethrough, task lists<br>- Official remark plugin |
| **prism-react-renderer** | Code syntax highlighting | - Lightweight (vs highlight.js)<br>- React-friendly<br>- 100+ language grammars<br>- Theme customization |
| **diff-match-patch** | Text diffing | - Google's battle-tested algorithm<br>- Used in Google Docs<br>- Accurate word-level diffs |
| **@mozilla/readability** | Page content extraction | - Mozilla's Firefox Reader View algorithm<br>- Excellent accuracy across sites<br>- Actively maintained |
| **gpt-3-encoder** | Token counting | - Accurate BPE tokenization<br>- Matches OpenAI's tokenizer<br>- Critical for context limits |
| **uuid** | UUID generation | - RFC4122 compliant<br>- Cryptographically strong<br>- Industry standard |
| **date-fns** | Date formatting | - Modular (tree-shakeable)<br>- Simpler API than Moment.js<br>- i18n support |

### 6.3 Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Static code analysis, enforce code style |
| **@typescript-eslint/eslint-plugin** | TypeScript-specific linting rules |
| **eslint-config-airbnb-typescript** | Airbnb's style guide (widely adopted) |
| **Prettier** | Opinionated code formatter |
| **Husky** | Git hooks (pre-commit, pre-push) |
| **lint-staged** | Run linters only on staged files (fast) |
| **Jest** | Unit testing framework |
| **React Testing Library** | Component testing |
| **Playwright** | E2E testing for Chrome extensions |

### 6.4 Chrome Extension APIs Used

| API | Purpose | Manifest Permission |
|-----|---------|---------------------|
| **chrome.sidePanel** | Sidebar UI | `"sidePanel"` |
| **chrome.contextMenus** | Right-click menus | `"contextMenus"` |
| **chrome.storage.local** | Chat history (10MB) | `"storage"` |
| **chrome.storage.sync** | User settings (100KB) | `"storage"` |
| **chrome.tabs** | Query/send messages to tabs | `"activeTab"` |
| **chrome.scripting** | Inject content scripts | `"scripting"` |
| **chrome.runtime** | Messaging, lifecycle | (always available) |
| **chrome.alarms** | Periodic tasks (update check) | `"alarms"` |
| **chrome.i18n** | Internationalization | (always available) |

---

## 7. API Specifications

### 7.1 Internal Message API

All messages follow this schema:

```typescript
interface Message<T = any> {
  type: MessageType;
  payload: T;
  timestamp: number;
  requestId?: string;
}
```

#### 7.1.1 Chat Messages

**SEND_CHAT (UI → Service Worker)**
```typescript
{
  type: 'SEND_CHAT',
  payload: {
    messages: Message[],
    sessionId: string,
    options?: {
      temperature?: number,
      maxTokens?: number
    }
  }
}
```

**CHAT_CHUNK (Service Worker → UI)**
```typescript
{
  type: 'CHAT_CHUNK',
  payload: {
    sessionId: string,
    chunk: string
  }
}
```

**CHAT_COMPLETE (Service Worker → UI)**
```typescript
{
  type: 'CHAT_COMPLETE',
  payload: {
    sessionId: string,
    totalTokens?: number
  }
}
```

**CHAT_ERROR (Service Worker → UI)**
```typescript
{
  type: 'CHAT_ERROR',
  payload: {
    sessionId: string,
    error: {
      code: string,
      message: string,
      retryable: boolean
    }
  }
}
```

#### 7.1.2 Context Menu Messages

**CONTEXT_MENU_ACTION (Service Worker → Content Script)**
```typescript
{
  type: 'CONTEXT_MENU_ACTION',
  payload: {
    action: 'grammar' | 'translate' | 'refine',
    text: string
  }
}
```

**SHOW_CONTEXT_RESULT (Service Worker → Content Script)**
```typescript
{
  type: 'SHOW_CONTEXT_RESULT',
  payload: {
    original: string,
    result: string,
    diffs: DiffChunk[],
    type: 'grammar' | 'translate' | 'refine'
  }
}
```

### 7.2 LLM API Specification

**Endpoint:** `POST /v1/chat/completions`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {API_KEY}
```

**Request Body:**
```json
{
  "model": "gpt-4",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"}
  ],
  "stream": true,
  "temperature": 0.7,
  "max_tokens": 2000
}
```

**Response (Streaming):**
```
data: {"id":"1","object":"chat.completion.chunk","choices":[{"delta":{"role":"assistant","content":"Hello"}}]}

data: {"id":"1","object":"chat.completion.chunk","choices":[{"delta":{"content":"!"}}]}

data: [DONE]
```

**Error Response:**
```json
{
  "error": {
    "message": "Invalid API key",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}
```

### 7.3 GitHub API Specification

**Endpoint:** `GET /repos/:owner/:repo/releases/latest`

**Response:**
```json
{
  "tag_name": "v1.2.0",
  "name": "Version 1.2.0",
  "body": "## Changes\n- New feature\n- Bug fix",
  "published_at": "2025-01-15T10:00:00Z",
  "assets": [
    {
      "name": "click-ai-v1.2.0.zip",
      "browser_download_url": "https://github.com/.../click-ai-v1.2.0.zip"
    }
  ]
}
```

---

## 8. Security Architecture

### 8.1 Threat Model

| Threat | Impact | Mitigation |
|--------|--------|------------|
| **API Key Exposure** | High - Unauthorized LLM usage | - Store in environment variables<br>- Never commit to repo<br>- Build-time injection only |
| **XSS via LLM Response** | High - Code execution in UI | - Sanitize all markdown rendering<br>- Use `react-markdown` (safe by default)<br>- CSP headers |
| **Sensitive Data Leakage** | High - Privacy breach | - Filter passwords, credit cards before LLM<br>- Regex-based detection<br>- User warnings |
| **Malicious Page Injection** | Medium - Content script compromise | - Shadow DOM for style isolation<br>- Strict CSP<br>- No eval() or inline scripts |
| **Storage Quota DoS** | Low - Extension becomes unusable | - Monitor storage usage<br>- Auto-cleanup old chats<br>- User warnings |

### 8.2 Security Controls

#### 8.2.1 Content Security Policy

```json
// manifest.json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'none'; connect-src https://api.openai.com"
  }
}
```

#### 8.2.2 Sensitive Information Filter

```typescript
// src/content/parser.ts
const SENSITIVE_PATTERNS = [
  { name: 'Credit Card', regex: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g },
  { name: 'SSN', regex: /\b\d{3}-\d{2}-\d{4}\b/g },
  { name: 'Email', regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g },
  { name: 'Phone', regex: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g },
];

function filterSensitiveInfo(text: string): { filtered: string; detected: string[] } {
  let filtered = text;
  const detected: string[] = [];

  for (const { name, regex } of SENSITIVE_PATTERNS) {
    if (regex.test(text)) {
      detected.push(name);
      filtered = filtered.replace(regex, '[REDACTED]');
    }
  }

  return { filtered, detected };
}
```

#### 8.2.3 API Key Protection

```typescript
// vite.config.ts
export default defineConfig({
  define: {
    'import.meta.env.VITE_LLM_API_KEY': JSON.stringify(process.env.VITE_LLM_API_KEY),
  },
  build: {
    minify: true, // Obfuscate in production
    sourcemap: false, // No source maps in production (hides env vars)
  },
});
```

### 8.3 Privacy Design

1. **No External Telemetry:** Zero analytics or error reporting to external services
2. **Local-Only Storage:** All chat history stays in `chrome.storage.local`
3. **Explicit Consent:** "Chat with Page" requires user toggle (not automatic)
4. **Data Portability:** Export/import chat history as JSON
5. **Right to Deletion:** "Clear All Chats" button in settings

---

## 9. Performance Optimization

### 9.1 Performance Targets

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Sidebar Load Time** | < 500ms | `performance.now()` from open to first render |
| **LLM First Token Time (TTFT)** | < 2s | Network waterfall in DevTools |
| **Page Parsing Time** | < 3s | `console.time()` around `parsePageContent()` |
| **Message Render Time** | < 16ms (60 FPS) | React DevTools Profiler |
| **Extension Memory Usage** | < 100MB | `chrome://extensions` memory inspector |
| **Bundle Size (total)** | < 2MB | Vite build output |

### 9.2 Optimization Strategies

#### 9.2.1 Code Splitting

```typescript
// src/sidepanel/App.tsx
const ChatView = lazy(() => import('./components/ChatView'));
const HistoryView = lazy(() => import('./components/HistoryView'));
const SettingsView = lazy(() => import('./components/SettingsView'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {currentView === 'chat' && <ChatView />}
      {currentView === 'history' && <HistoryView />}
      {currentView === 'settings' && <SettingsView />}
    </Suspense>
  );
}
```

#### 9.2.2 React Memoization

```typescript
// Memoize expensive components
const MessageList = memo(({ messages }: { messages: Message[] }) => {
  return (
    <div>
      {messages.map(msg => (
        <MessageItem key={msg.id} message={msg} />
      ))}
    </div>
  );
}, (prev, next) => prev.messages.length === next.messages.length);

// Memoize expensive computations
const formattedMessages = useMemo(() => {
  return messages.map(m => ({
    ...m,
    formattedTime: formatTimestamp(m.timestamp)
  }));
}, [messages]);
```

#### 9.2.3 Virtual Scrolling (for long chat history)

```typescript
// Use react-window for large message lists
import { VariableSizeList } from 'react-window';

function MessageList({ messages }: { messages: Message[] }) {
  return (
    <VariableSizeList
      height={600}
      itemCount={messages.length}
      itemSize={index => messages[index].content.length > 100 ? 150 : 80}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <MessageItem message={messages[index]} />
        </div>
      )}
    </VariableSizeList>
  );
}
```

#### 9.2.4 Service Worker Keepalive

```typescript
// Prevent SW termination during long-running operations
let keepAliveInterval: NodeJS.Timeout | null = null;

function startKeepalive() {
  if (keepAliveInterval) return;
  keepAliveInterval = setInterval(() => {
    chrome.runtime.getPlatformInfo(); // Dummy call
  }, 20000); // Every 20 seconds
}

function stopKeepalive() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }
}

// Use during LLM streaming
async function* streamChat(messages: Message[]) {
  startKeepalive();
  try {
    // ... streaming logic
  } finally {
    stopKeepalive();
  }
}
```

---

## 10. Deployment Strategy

### 10.1 Build Pipeline

```bash
# .github/workflows/release.yml (CI/CD)
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build extension
        env:
          VITE_LLM_ENDPOINT: ${{ secrets.LLM_ENDPOINT }}
          VITE_LLM_API_KEY: ${{ secrets.LLM_API_KEY }}
          VITE_LLM_MODEL: ${{ secrets.LLM_MODEL }}
          VITE_GITHUB_REPO: ${{ github.repository }}
        run: npm run build

      - name: Create ZIP
        run: cd dist && zip -r ../click-ai-${{ github.ref_name }}.zip .

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          files: click-ai-${{ github.ref_name }}.zip
          body_path: CHANGELOG.md
```

### 10.2 Version Management

**Semantic Versioning (SemVer):**
- **Major (X.0.0):** Breaking changes (rare for extensions)
- **Minor (1.X.0):** New features (e.g., RAG, voice input)
- **Patch (1.0.X):** Bug fixes, minor improvements

**Version Bumping:**
```bash
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.1 → 1.1.0
npm version major  # 1.1.0 → 2.0.0
git push --tags
```

### 10.3 Update Mechanism

```typescript
// src/background/update-checker.ts
chrome.alarms.create('updateCheck', { periodInMinutes: 1440 }); // 24 hours

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== 'updateCheck') return;

  const repo = import.meta.env.VITE_GITHUB_REPO;
  const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
  const release = await response.json();

  const currentVersion = chrome.runtime.getManifest().version;
  const latestVersion = release.tag_name.replace('v', '');

  if (compareVersions(latestVersion, currentVersion) > 0) {
    // New version available
    chrome.action.setBadgeText({ text: 'NEW' });
    chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });

    // Notify sidebar (if open)
    chrome.runtime.sendMessage({
      type: 'UPDATE_AVAILABLE',
      payload: { version: latestVersion, url: release.html_url }
    });
  }
});
```

---

## 11. Testing Strategy

### 11.1 Test Pyramid

```
        ┌─────────────────┐
        │   E2E Tests     │  ← 5% (Playwright)
        │   (5 tests)     │
        ├─────────────────┤
        │ Integration     │  ← 15% (Jest + React Testing Library)
        │ Tests (20)      │
        ├─────────────────┤
        │  Unit Tests     │  ← 80% (Jest)
        │  (100+)         │
        └─────────────────┘
```

### 11.2 Unit Test Examples

```typescript
// src/shared/utils.test.ts
describe('generateUUID', () => {
  it('should generate a valid UUID v4', () => {
    const uuid = generateUUID();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('should generate unique UUIDs', () => {
    const uuid1 = generateUUID();
    const uuid2 = generateUUID();
    expect(uuid1).not.toBe(uuid2);
  });
});

// src/background/storage.test.ts
describe('StorageManager', () => {
  let storageManager: StorageManager;

  beforeEach(() => {
    chrome.storage.local.get.mockClear();
    chrome.storage.local.set.mockClear();
    storageManager = new StorageManager();
  });

  it('should save chat session to chrome.storage.local', async () => {
    const session: ChatSession = {
      id: 'test-123',
      title: 'Test Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await storageManager.saveChatSession(session);

    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      'session_test-123': session
    });
  });
});
```

### 11.3 Integration Test Example

```typescript
// src/sidepanel/components/ChatView.test.tsx
describe('ChatView Integration', () => {
  it('should send message and receive response', async () => {
    const mockSendMessage = jest.fn().mockResolvedValue(undefined);
    jest.spyOn(chatStore, 'sendMessage').mockImplementation(mockSendMessage);

    render(<ChatView />);

    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByLabelText('Send message');

    // Type message
    await userEvent.type(input, 'Hello AI!');
    await userEvent.click(sendButton);

    // Verify message sent
    expect(mockSendMessage).toHaveBeenCalledWith('Hello AI!');

    // Verify message appears in UI
    await waitFor(() => {
      expect(screen.getByText('Hello AI!')).toBeInTheDocument();
    });
  });
});
```

### 11.4 E2E Test Example (Playwright)

```typescript
// tests/e2e/chat.spec.ts
import { test, expect } from './fixtures/extension';

test('should open sidebar and send message', async ({ page, extensionId }) => {
  // Navigate to any page
  await page.goto('https://example.com');

  // Click extension icon (open sidebar)
  await page.click(`#extension-icon-${extensionId}`);

  // Wait for sidebar to open
  const sidebar = await page.waitForSelector('#click-ai-sidebar');
  expect(sidebar).toBeTruthy();

  // Type message
  const input = await sidebar.$('textarea');
  await input.type('What is 2+2?');

  // Send message
  const sendButton = await sidebar.$('button[aria-label="Send message"]');
  await sendButton.click();

  // Wait for AI response
  await page.waitForSelector('.assistant-message', { timeout: 10000 });

  // Verify response contains answer
  const response = await page.textContent('.assistant-message');
  expect(response).toContain('4');
});
```

---

## 12. Appendices

### 12.1 Glossary

| Term | Definition |
|------|------------|
| **Manifest V3** | Latest Chrome Extension API version (replaces V2) |
| **Service Worker** | Event-driven background script (replaces persistent background pages) |
| **Content Script** | JavaScript injected into web pages (has DOM access) |
| **Side Panel** | Chrome's sidebar API (new in Chrome 109) |
| **SSE** | Server-Sent Events (HTTP streaming protocol) |
| **RAG** | Retrieval-Augmented Generation (vector search + LLM) |
| **BPE** | Byte Pair Encoding (tokenization algorithm for LLMs) |
| **CSP** | Content Security Policy (security header) |
| **HMR** | Hot Module Replacement (live code updates in dev) |

### 12.2 References

1. **Chrome Extension Documentation:**
   - [Manifest V3 Overview](https://developer.chrome.com/docs/extensions/mv3/intro/)
   - [Side Panel API](https://developer.chrome.com/docs/extensions/reference/sidePanel/)
   - [Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)

2. **LLM APIs:**
   - [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
   - [OpenAI Streaming Guide](https://platform.openai.com/docs/api-reference/streaming)

3. **Libraries:**
   - [React Documentation](https://react.dev/)
   - [Zustand Docs](https://github.com/pmndrs/zustand)
   - [TailwindCSS Docs](https://tailwindcss.com/docs)
   - [react-markdown](https://github.com/remarkjs/react-markdown)
   - [Readability.js](https://github.com/mozilla/readability)

4. **Testing:**
   - [Jest Documentation](https://jestjs.io/)
   - [React Testing Library](https://testing-library.com/react)
   - [Playwright](https://playwright.dev/)

### 12.3 Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-04 | Claude Code | Initial architecture blueprint |

### 12.4 Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Architect** | TBD | _______ | ____ |
| **Tech Lead** | TBD | _______ | ____ |
| **Security** | TBD | _______ | ____ |
| **QA Lead** | TBD | _______ | ____ |

---

**Document Status:** Draft
**Next Review Date:** Start of Milestone 1 (Week 1)
**Contact:** [GitHub Issues](https://github.com/username/click-ai/issues)
