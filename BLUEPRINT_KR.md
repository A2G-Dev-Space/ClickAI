# Click AI 아키텍처 블루프린트

**문서 버전:** 1.0.0
**최종 업데이트:** 2025-11-04
**상태:** 설계 단계

---

## 목차

1. [요약](#1-요약)
2. [시스템 개요](#2-시스템-개요)
3. [아키텍처 패턴](#3-아키텍처-패턴)
4. [컴포넌트 아키텍처](#4-컴포넌트-아키텍처)
5. [데이터 흐름](#5-데이터-흐름)
6. [기술 스택](#6-기술-스택)
7. [API 명세](#7-api-명세)
8. [보안 아키텍처](#8-보안-아키텍처)
9. [성능 최적화](#9-성능-최적화)
10. [배포 전략](#10-배포-전략)
11. [테스트 전략](#11-테스트-전략)
12. [부록](#12-부록)

---

## 1. 요약

### 1.1 목적

이 문서는 Chrome/Edge 브라우저 확장 프로그램인 Click AI의 포괄적인 아키텍처 블루프린트를 제공합니다. 개발자, 아키텍트, 이해관계자를 위한 결정적인 기술 참조 자료로 사용됩니다.

### 1.2 범위

블루프린트가 다루는 내용:
- 고수준 시스템 아키텍처
- 컴포넌트 설계 및 상호작용
- 데이터 흐름 및 상태 관리
- 기술 선택 및 정당화
- 보안 및 성능 고려사항
- 배포 및 테스트 전략

### 1.3 대상 독자

- **주요:** 확장 프로그램을 구현하는 개발 팀
- **부차적:** 기술 검토자, QA 엔지니어, DevOps 팀
- **삼차적:** 비기술 이해관계자(고수준 이해용)

---

## 2. 시스템 개요

### 2.1 고수준 아키텍처

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Chrome/Edge 브라우저                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                      프레젠테이션 레이어                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │  │
│  │  │ 사이드 패널 │  │  팝오버     │  │  전체 모드 (탭)     │  │  │
│  │  │  (React)    │  │  (React)    │  │     (React)         │  │  │
│  │  │             │  │             │  │                     │  │  │
│  │  │ - ChatView  │  │ - DiffView  │  │ - 확장된 채팅       │  │  │
│  │  │ - History   │  │ - Actions   │  │ - 동일 컴포넌트     │  │  │
│  │  │ - Settings  │  │             │  │                     │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘  │  │
│  └───────────────────────────┬──────────────────────────────────┘  │
│                               │ chrome.runtime.sendMessage()        │
│  ────────────────────────────┼──────────────────────────────────────
│                               │                                     │
│  ┌───────────────────────────┴──────────────────────────────────┐  │
│  │                    비즈니스 로직 레이어                        │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │           Service Worker (Background Script)          │   │  │
│  │  │                                                        │   │  │
│  │  │  ┌─────────────────┐  ┌──────────────────────────┐  │   │  │
│  │  │  │ 메시지 라우터   │  │  LLM API 클라이언트     │  │   │  │
│  │  │  │                 │  │  - 스트리밍             │  │   │  │
│  │  │  │ - 메시지 라우팅 │  │  - 오류 처리            │  │   │  │
│  │  │  │ - 유효성 검사   │  │  - 재시도 로직          │  │   │  │
│  │  │  │ - 변환          │  │                          │  │   │  │
│  │  │  └─────────────────┘  └──────────────────────────┘  │   │  │
│  │  │                                                        │   │  │
│  │  │  ┌─────────────────┐  ┌──────────────────────────┐  │   │  │
│  │  │  │ 스토리지 관리자 │  │  업데이트 체커          │  │   │  │
│  │  │  │                 │  │  - GitHub API           │  │   │  │
│  │  │  │ - CRUD 연산     │  │  - 버전 비교            │  │   │  │
│  │  │  │ - Sync/Local    │  │  - 알림                 │  │   │  │
│  │  │  └─────────────────┘  └──────────────────────────┘  │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────┬──────────────────────────────────┘  │
│                               │ chrome.tabs.sendMessage()           │
│  ────────────────────────────┼──────────────────────────────────────
│                               │                                     │
│  ┌───────────────────────────┴──────────────────────────────────┐  │
│  │                     통합 레이어                                │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │              Content Script (주입됨)                  │   │  │
│  │  │                                                        │   │  │
│  │  │  ┌─────────────────┐  ┌──────────────────────────┐  │   │  │
│  │  │  │ 페이지 파서     │  │  팝오버 렌더러          │  │   │  │
│  │  │  │                 │  │                          │  │   │  │
│  │  │  │ - Readability   │  │  - Shadow DOM           │  │   │  │
│  │  │  │ - 메타데이터    │  │  - React 포털           │  │   │  │
│  │  │  │ - 민감정보 제거 │  │  - 위치 지정            │  │   │  │
│  │  │  └─────────────────┘  └──────────────────────────┘  │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────┬──────────────────────────────────┘  │
│                               │ DOM 접근                            │
│  ────────────────────────────┼──────────────────────────────────────
│                               │                                     │
│  ┌───────────────────────────┴──────────────────────────────────┐  │
│  │                        웹 페이지 (DOM)                        │  │
│  │  - HTML 콘텐츠   - 사용자 상호작용   - 텍스트 선택           │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

                              ↕ HTTPS
┌─────────────────────────────────────────────────────────────────────┐
│                        외부 서비스                                   │
│  ┌──────────────────────┐         ┌──────────────────────────────┐  │
│  │  LLM API             │         │  GitHub Releases API         │  │
│  │  (OpenAI 호환)       │         │  (버전 체크)                 │  │
│  │  - 채팅 완성         │         │  - /releases/latest          │  │
│  │  - 스트리밍          │         │                              │  │
│  └──────────────────────┘         └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

                              ↕ chrome.storage API
┌─────────────────────────────────────────────────────────────────────┐
│                         브라우저 스토리지                            │
│  ┌──────────────────────┐         ┌──────────────────────────────┐  │
│  │  chrome.storage.local│         │  chrome.storage.sync         │  │
│  │  (최대 10MB)         │         │  (최대 100KB)                │  │
│  │  - 채팅 세션         │         │  - 사용자 설정               │  │
│  │  - 메시지 기록       │         │  - 테마 설정                 │  │
│  │  - 페이지 컨텍스트   │         │  - 언어                      │  │
│  └──────────────────────┘         └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 핵심 원칙

#### 2.2.1 관심사의 분리
- **프레젠테이션 레이어:** UI 컴포넌트 (React)
- **비즈니스 로직 레이어:** Service Worker (백그라운드 스크립트)
- **통합 레이어:** Content scripts (DOM 접근)
- **데이터 레이어:** Chrome Storage (영속성)

#### 2.2.2 Manifest V3 준수
- Service Worker 기반 백그라운드 스크립트 (지속적인 백그라운드 페이지 없음)
- 가능한 곳에서 선언적 API 사용
- 최소한의 호스트 권한
- Content Security Policy (CSP) 준수

#### 2.2.3 프라이버시 우선 설계
- 모든 데이터는 브라우저에 로컬로 저장
- 원격 분석 또는 분석 없음
- LLM API 호출은 사용자가 시작할 때만
- LLM 전송 전 민감정보 필터링

#### 2.2.4 UI를 위한 오프라인 우선
- 오프라인에서도 채팅 기록 접근 가능
- 설정은 로컬에 저장
- 네트워크 불가 시 우아한 성능 저하

---

## 3. 아키텍처 패턴

### 3.1 메시징 아키텍처 (이벤트 기반)

#### 3.1.1 메시지 타입

```typescript
// src/shared/types.ts
enum MessageType {
  // 채팅 관련
  SEND_CHAT = 'SEND_CHAT',
  CHAT_CHUNK = 'CHAT_CHUNK',
  CHAT_COMPLETE = 'CHAT_COMPLETE',
  CHAT_ERROR = 'CHAT_ERROR',
  CANCEL_CHAT = 'CANCEL_CHAT',

  // 컨텍스트 메뉴
  CONTEXT_MENU_ACTION = 'CONTEXT_MENU_ACTION',
  SHOW_CONTEXT_RESULT = 'SHOW_CONTEXT_RESULT',

  // 페이지 파싱
  PARSE_PAGE = 'PARSE_PAGE',
  PAGE_PARSED = 'PAGE_PARSED',

  // 스토리지 연산
  SAVE_SESSION = 'SAVE_SESSION',
  LOAD_SESSIONS = 'LOAD_SESSIONS',
  DELETE_SESSION = 'DELETE_SESSION',

  // 설정
  UPDATE_SETTINGS = 'UPDATE_SETTINGS',
  GET_SETTINGS = 'GET_SETTINGS',

  // 업데이트 체커
  CHECK_UPDATES = 'CHECK_UPDATES',
  UPDATE_AVAILABLE = 'UPDATE_AVAILABLE',
}

interface Message<T = any> {
  type: MessageType;
  payload: T;
  timestamp: number;
  requestId?: string; // 요청-응답 패턴용
}
```

#### 3.1.2 메시지 흐름 패턴

**패턴 1: 요청-응답 (동기)**
```
UI 컴포넌트 → Service Worker → UI 컴포넌트
       [sendMessage]     [response]
```

**패턴 2: 이벤트 브로드캐스팅 (비동기)**
```
Service Worker → 모든 리스너
       [sendMessage to all tabs/views]
```

**패턴 3: 스트리밍 (장기 실행)**
```
UI → Service Worker → UI (chunk) → UI (chunk) → ... → UI (complete)
```

### 3.2 상태 관리 패턴

#### 3.2.1 Zustand 스토어 구조

```typescript
// src/sidepanel/store/chatStore.ts
interface ChatStore {
  // 상태
  currentSession: ChatSession | null;
  messages: Message[];
  isLoading: boolean;
  isChatWithPageEnabled: boolean;
  pageContext: PageContext | null;
  error: string | null;

  // 액션 (명령형)
  sendMessage: (content: string) => Promise<void>;
  cancelMessage: () => void;
  loadSession: (sessionId: string) => Promise<void>;
  createNewSession: () => void;
  toggleChatWithPage: () => Promise<void>;
  clearError: () => void;

  // 선택자 (파생 상태)
  getLastUserMessage: () => Message | null;
  getLastAssistantMessage: () => Message | null;
  getTotalMessageCount: () => number;
}
```

#### 3.2.2 상태 영속성 전략

- **React State (UI):** 임시 상태 (입력값, UI 플래그)
- **Zustand Store:** 세션 상태 (현재 채팅, 메시지)
- **chrome.storage.local:** 영속 상태 (채팅 기록)
- **chrome.storage.sync:** 사용자 설정 (테마, 언어)

**동기화 흐름:**
```
사용자 액션 → Zustand Store (업데이트) → chrome.storage (자동 저장)
                         ↓
                    UI 재렌더링
```

### 3.3 오류 처리 패턴

#### 3.3.1 오류 계층 구조

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

#### 3.3.2 오류 복구 전략

```
오류 발생 → 오류 분류 → 재시도 가능?
                                     ├─ Yes → 백오프로 재시도 (최대 3회)
                                     └─ No → 사용자 친화적 메시지 + 액션 표시
```

**사용자용 오류 메시지:**
```typescript
const ERROR_MESSAGES = {
  NETWORK_ERROR: "AI에 연결할 수 없습니다. 인터넷 연결을 확인하세요.",
  API_AUTH_ERROR: "잘못된 API 키입니다. 관리자에게 문의하세요.",
  TOKEN_LIMIT_ERROR: "메시지가 너무 깁니다. 짧게 하여 다시 시도하세요.",
  STORAGE_QUOTA_ERROR: "저장공간이 가득 찼습니다. 오래된 채팅을 삭제하세요.",
};
```

---

## 4. 컴포넌트 아키텍처

### 4.1 Service Worker 아키텍처

#### 4.1.1 라이프사이클 관리

```typescript
// src/background/index.ts
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // 첫 설치: 기본 설정 초기화
    initializeSettings();
    showWelcomeNotification();
  } else if (details.reason === 'update') {
    // 업데이트: 필요시 마이그레이션 실행
    runDataMigration(details.previousVersion);
  }

  // 컨텍스트 메뉴 등록
  setupContextMenus();
});

chrome.runtime.onStartup.addListener(() => {
  // 브라우저 시작: 상태 복원
  restoreState();

  // 업데이트 체커 알람 시작
  chrome.alarms.create('updateCheck', { periodInMinutes: 1440 }); // 24시간
});

// Keepalive 메커니즘 (SW 종료 방지)
let keepAliveInterval: NodeJS.Timeout;
function startKeepalive() {
  keepAliveInterval = setInterval(() => {
    chrome.runtime.getPlatformInfo(); // SW 활성 유지용 더미 호출
  }, 20000); // 20초마다
}
```

#### 4.1.2 메시지 라우터

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

// 핸들러 등록
const router = new MessageRouter();
router.register(MessageType.SEND_CHAT, handleSendChat);
router.register(MessageType.PARSE_PAGE, handleParsePage);
router.register(MessageType.SAVE_SESSION, handleSaveSession);
// ... 더 많은 핸들러

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  router.handle(message, sender).then(sendResponse);
  return true; // 비동기 응답을 위해 채널 열어둠
});
```

### 4.2 LLM API 클라이언트 아키텍처

#### 4.2.1 스트리밍 구현

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
      buffer = lines.pop() || ''; // 버퍼에 불완전한 줄 유지

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

#### 4.2.2 지수 백오프 재시도 로직

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

      const delay = baseDelay * Math.pow(2, attempt); // 지수 백오프
      console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Max retries exceeded');
}
```

### 4.3 스토리지 관리자 아키텍처

#### 4.3.1 스토리지 추상화 레이어

```typescript
// src/background/storage.ts
class StorageManager {
  // 채팅 세션 연산 (chrome.storage.local)
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

  // 설정 연산 (chrome.storage.sync)
  async saveSettings(settings: UserSettings): Promise<void> {
    await chrome.storage.sync.set({ settings });
  }

  async loadSettings(): Promise<UserSettings> {
    const result = await chrome.storage.sync.get('settings');
    return result.settings || DEFAULT_SETTINGS;
  }

  // 유틸리티 메소드
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

#### 4.3.2 데이터 압축 (큰 세션용)

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

### 4.4 Content Script 아키텍처

#### 4.4.1 페이지 파서

```typescript
// src/content/parser.ts
import { Readability } from '@mozilla/readability';

class PageParser {
  private sensitivePatterns = [
    /\b\d{16}\b/, // 신용카드 번호
    /\b\d{3}-\d{2}-\d{4}\b/, // 주민등록번호
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // 이메일
  ];

  parsePageContent(): string {
    // 먼저 Readability.js 시도
    const documentClone = document.cloneNode(true) as Document;
    const reader = new Readability(documentClone);
    const article = reader.parse();

    if (article && article.textContent.length > 100) {
      return this.sanitize(article.textContent);
    }

    // 대체: <article> 또는 <main>에서 추출
    const main = document.querySelector('article, main');
    if (main) {
      return this.sanitize(main.innerText);
    }

    // 최후의 수단: body 텍스트
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
    // 과도한 공백 제거
    text = text.replace(/\s+/g, ' ').trim();

    // 민감정보 필터링
    for (const pattern of this.sensitivePatterns) {
      text = text.replace(pattern, '[REDACTED]');
    }

    return text;
  }

  private extractPublishDate(): string | undefined {
    // 일반적인 메타 태그 시도
    const metaDate = document.querySelector('meta[property="article:published_time"]');
    if (metaDate) {
      return metaDate.getAttribute('content') || undefined;
    }

    // <time> 요소 시도
    const timeElement = document.querySelector('time[datetime]');
    if (timeElement) {
      return timeElement.getAttribute('datetime') || undefined;
    }

    return undefined;
  }
}
```

#### 4.4.2 팝오버 렌더러 (Shadow DOM)

```typescript
// src/content/popover.tsx
class PopoverRenderer {
  private shadowRoot: ShadowRoot | null = null;
  private container: HTMLDivElement | null = null;

  show(result: ContextMenuResult) {
    // 컨테이너 생성
    this.container = document.createElement('div');
    this.container.id = 'click-ai-popover';
    document.body.appendChild(this.container);

    // 스타일 격리를 위한 shadow root 생성
    this.shadowRoot = this.container.attachShadow({ mode: 'open' });

    // 스타일 주입
    const style = document.createElement('style');
    style.textContent = popoverStyles;
    this.shadowRoot.appendChild(style);

    // React root 생성 및 렌더링
    const root = document.createElement('div');
    this.shadowRoot.appendChild(root);

    ReactDOM.render(
      <PopoverContent result={result} onClose={() => this.hide()} />,
      root
    );

    // 팝오버 위치 지정
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

    // 선택 영역 위에 위치 (공간 부족 시 아래)
    const popoverHeight = 400;
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;

    if (spaceAbove > popoverHeight || spaceAbove > spaceBelow) {
      // 위에 표시
      this.container.style.top = `${window.scrollY + rect.top - popoverHeight - 10}px`;
    } else {
      // 아래에 표시
      this.container.style.top = `${window.scrollY + rect.bottom + 10}px`;
    }

    // 가로 가운데 정렬
    const popoverWidth = 600;
    let left = rect.left + rect.width / 2 - popoverWidth / 2;
    left = Math.max(10, Math.min(left, window.innerWidth - popoverWidth - 10));
    this.container.style.left = `${left}px`;
  }
}
```

### 4.5 React 컴포넌트 아키텍처

#### 4.5.1 컴포넌트 계층 구조

```
App
├── Header
│   ├── Logo
│   ├── NewChatButton
│   ├── HistoryButton
│   ├── SettingsButton
│   └── FullModeButton
├── Router (상태 기반)
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
└── Toast (알림)
```

#### 4.5.2 컴포넌트 패턴 (스마트 vs. 덤)

**스마트 컴포넌트 (스토어 연결):**
```typescript
// src/sidepanel/components/ChatView.tsx
export function ChatView() {
  const { messages, isLoading, sendMessage } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 새 메시지 시 하단으로 자동 스크롤
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

**덤 컴포넌트 (프레젠테이션):**
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

## 5. 데이터 흐름

### 5.1 채팅 메시지 흐름 (상세)

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. 사용자 입력                                                       │
│    사용자가 ChatInput에 메시지 입력 후 Enter                         │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 2. 클라이언트 측 유효성 검사                                        │
│    - 메시지가 비어있지 않은지 확인                                  │
│    - 메시지 길이 < 10,000자 확인                                    │
│    - 유효하지 않으면 오류 표시                                      │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 3. UI 상태 업데이트 (낙관적)                                        │
│    chatStore.messages.push({                                        │
│      role: 'user', content: userInput, timestamp: Date.now()        │
│    })                                                                │
│    chatStore.isLoading = true                                       │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 4. Service Worker로 전송                                            │
│    chrome.runtime.sendMessage({                                     │
│      type: 'SEND_CHAT',                                             │
│      payload: { messages: chatStore.messages, sessionId: ... }      │
│    })                                                                │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 5. Service Worker 처리                                              │
│    - 요청 유효성 검사                                               │
│    - 시스템 프롬프트 추가 (활성화 시 페이지 컨텍스트 포함)         │
│    - 토큰 수 확인                                                   │
│    - LLM API 호출 (streamChat)                                      │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 6. 응답 청크 스트리밍                                               │
│    LLM의 각 청크마다:                                               │
│      chrome.runtime.sendMessage({                                   │
│        type: 'CHAT_CHUNK',                                          │
│        payload: { sessionId, chunk }                                │
│      })                                                              │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 7. UI 업데이트 (실시간)                                             │
│    청크 수신 시:                                                    │
│      - 첫 청크: 새 어시스턴트 메시지 생성                           │
│      - 나머지: 기존 메시지에 청크 추가                              │
│      - MessageList 재렌더링 (React 자동 업데이트)                   │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 8. 스트림 완료                                                      │
│    chrome.runtime.sendMessage({                                     │
│      type: 'CHAT_COMPLETE',                                         │
│      payload: { sessionId }                                         │
│    })                                                                │
│    chatStore.isLoading = false                                      │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 9. 스토리지에 자동 저장                                             │
│    storageManager.saveChatSession(chatStore.currentSession)         │
│    → chrome.storage.local.set(...)                                  │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 컨텍스트 메뉴 흐름 (상세)

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. 사용자 텍스트 선택                                               │
│    사용자가 웹페이지에서 텍스트 하이라이트                          │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 2. 우클릭 & 메뉴 선택                                               │
│    사용자 우클릭 → "Click AI" → "문법 교정"                         │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 3. 컨텍스트 메뉴 클릭 핸들러 (Service Worker)                       │
│    chrome.contextMenus.onClicked.addListener((info, tab) => {       │
│      const selectedText = info.selectionText;                       │
│      const action = info.menuItemId; // 'grammar', 'translate' 등   │
│    })                                                                │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 4. LLM API 호출 (비스트리밍)                                        │
│    const result = await llmClient.correctGrammar(selectedText);     │
│    // 또는 translate(), refineExpression()                          │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 5. Diff 계산                                                        │
│    import { diff_match_patch } from 'diff-match-patch';             │
│    const dmp = new diff_match_patch();                              │
│    const diffs = dmp.diff_main(selectedText, result);               │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 6. Content Script로 결과 전송                                       │
│    chrome.tabs.sendMessage(tab.id, {                                │
│      type: 'SHOW_CONTEXT_RESULT',                                   │
│      payload: { original: selectedText, result, diffs, type }       │
│    })                                                                │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 7. Content Script 수신 & 팝오버 렌더링                              │
│    PopoverRenderer.show(payload);                                   │
│    - Shadow DOM 생성                                                │
│    - React 팝오버 주입                                              │
│    - 선택 영역 근처에 위치                                          │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 8. 사용자 상호작용                                                  │
│    - "복사" 버튼: navigator.clipboard.writeText(result)             │
│    - "사이드바에서 편집": 미리 채워진 텍스트로 사이드바 열기        │
│    - 닫기 (X, ESC, 바깥 클릭): PopoverRenderer.hide()               │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.3 페이지와 채팅 흐름

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. 사용자가 "페이지와 채팅" ON으로 토글                             │
│    chatStore.toggleChatWithPage()                                   │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 2. 페이지 파싱 요청                                                 │
│    chrome.tabs.sendMessage(activeTab.id, {                          │
│      type: 'PARSE_PAGE'                                             │
│    })                                                                │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 3. Content Script 페이지 파싱                                       │
│    const parser = new PageParser();                                 │
│    const content = parser.parsePageContent();                       │
│    const metadata = parser.getPageMetadata();                       │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 4. 파싱된 콘텐츠 반환                                               │
│    sendResponse({                                                   │
│      success: true,                                                 │
│      data: { content, metadata }                                    │
│    })                                                                │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 5. 페이지 컨텍스트 저장                                             │
│    chatStore.pageContext = { content, metadata };                   │
│    chatStore.isChatWithPageEnabled = true;                          │
│    Toast 표시: "페이지 콘텐츠 분석 완료"                            │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 6. 사용자 메시지 전송                                               │
│    (일반 채팅과 동일, 단 컨텍스트 추가)                             │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 7. 페이지 컨텍스트를 포함한 LLM 요청 구성                           │
│    messages = [                                                     │
│      {                                                               │
│        role: 'system',                                              │
│        content: `페이지 제목: ${metadata.title}                     │
│                  URL: ${metadata.url}                               │
│                  콘텐츠: ${content}`                                │
│      },                                                              │
│      ...chatStore.messages                                          │
│    ]                                                                 │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 8. 토큰 관리                                                        │
│    totalTokens = countTokens(messages);                             │
│    if (totalTokens > MAX_TOKENS) {                                  │
│      content = truncateToTokenLimit(content, ...);                  │
│      경고 표시: "페이지가 너무 깁니다. 발췌 사용 중"                │
│    }                                                                 │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 9. LLM으로 전송 & 응답 스트리밍                                     │
│    (일반 채팅 흐름과 동일)                                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. 기술 스택

### 6.1 핵심 기술

| 레이어 | 기술 | 버전 | 선택 이유 |
|-------|------------|---------|---------------|
| **프레임워크** | React | 18.2+ | - 컴포넌트 기반 아키텍처<br>- 거대한 생태계<br>- 뛰어난 TypeScript 지원<br>- 효율적 업데이트를 위한 Virtual DOM |
| **언어** | TypeScript | 5.0+ | - 타입 안전성으로 런타임 오류 감소<br>- 더 나은 IDE 지원 (자동완성, 리팩토링)<br>- 자체 문서화 코드<br>- 대규모 코드베이스 유지 관리 용이 |
| **빌드 도구** | Vite | 4.0+ | - Webpack보다 10-100배 빠름<br>- 네이티브 ESM 지원<br>- 우수한 HMR (Hot Module Replacement)<br>- 간단한 설정<br>- Chrome Extensions용 플러그인 ([@crxjs/vite-plugin](https://github.com/crxjs/chrome-extension-tools)) |
| **상태 관리** | Zustand | 4.3+ | - 최소한의 보일러플레이트 (vs Redux)<br>- Hook 기반 API (React다운)<br>- Context Provider 지옥 없음<br>- 1KB gzipped<br>- 내장 개발 도구 |
| **스타일링** | TailwindCSS | 3.3+ | - 유틸리티 우선 = 빠른 개발<br>- 일관된 디자인 시스템<br>- 작은 프로덕션 번들 (tree-shaking)<br>- CSS 이름 충돌 없음<br>- 다크 모드 내장 |

### 6.2 주요 라이브러리

| 라이브러리 | 목적 | 선택 이유 |
|---------|---------|------------------|
| **react-markdown** | 마크다운 렌더링 | - 가장 인기 있는 React 마크다운 렌더러<br>- 플러그인을 통한 GFM 지원<br>- 커스터마이징 가능한 컴포넌트 |
| **remark-gfm** | GitHub Flavored Markdown | - 테이블, 취소선, 작업 목록<br>- 공식 remark 플러그인 |
| **prism-react-renderer** | 코드 문법 강조 | - 경량 (vs highlight.js)<br>- React 친화적<br>- 100개 이상의 언어 문법<br>- 테마 커스터마이징 |
| **diff-match-patch** | 텍스트 비교 | - Google의 검증된 알고리즘<br>- Google Docs에 사용됨<br>- 정확한 단어 수준 비교 |
| **@mozilla/readability** | 페이지 콘텐츠 추출 | - Mozilla의 Firefox Reader View 알고리즘<br>- 다양한 사이트에서 뛰어난 정확도<br>- 활발한 유지보수 |
| **gpt-3-encoder** | 토큰 계산 | - 정확한 BPE 토큰화<br>- OpenAI의 토크나이저와 일치<br>- 컨텍스트 제한에 중요 |
| **uuid** | UUID 생성 | - RFC4122 준수<br>- 암호학적으로 강력<br>- 업계 표준 |
| **date-fns** | 날짜 포맷팅 | - 모듈식 (tree-shakeable)<br>- Moment.js보다 간단한 API<br>- i18n 지원 |

### 6.3 개발 도구

| 도구 | 목적 |
|------|---------|
| **ESLint** | 정적 코드 분석, 코드 스타일 강제 |
| **@typescript-eslint/eslint-plugin** | TypeScript 전용 린팅 규칙 |
| **eslint-config-airbnb-typescript** | Airbnb의 스타일 가이드 (널리 채택됨) |
| **Prettier** | 독선적인 코드 포맷터 |
| **Husky** | Git hooks (pre-commit, pre-push) |
| **lint-staged** | staged 파일에만 린터 실행 (빠름) |
| **Jest** | 단위 테스트 프레임워크 |
| **React Testing Library** | 컴포넌트 테스트 |
| **Playwright** | Chrome 확장 프로그램용 E2E 테스트 |

### 6.4 사용된 Chrome Extension API

| API | 목적 | Manifest 권한 |
|-----|---------|---------------------|
| **chrome.sidePanel** | 사이드바 UI | `"sidePanel"` |
| **chrome.contextMenus** | 우클릭 메뉴 | `"contextMenus"` |
| **chrome.storage.local** | 채팅 기록 (10MB) | `"storage"` |
| **chrome.storage.sync** | 사용자 설정 (100KB) | `"storage"` |
| **chrome.tabs** | 탭 쿼리/메시지 전송 | `"activeTab"` |
| **chrome.scripting** | content scripts 주입 | `"scripting"` |
| **chrome.runtime** | 메시징, 라이프사이클 | (항상 사용 가능) |
| **chrome.alarms** | 주기적 작업 (업데이트 체크) | `"alarms"` |
| **chrome.i18n** | 국제화 | (항상 사용 가능) |

---

## 7. API 명세

### 7.1 내부 메시지 API

모든 메시지는 다음 스키마를 따릅니다:

```typescript
interface Message<T = any> {
  type: MessageType;
  payload: T;
  timestamp: number;
  requestId?: string;
}
```

#### 7.1.1 채팅 메시지

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

#### 7.1.2 컨텍스트 메뉴 메시지

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

### 7.2 LLM API 명세

**엔드포인트:** `POST /v1/chat/completions`

**헤더:**
```
Content-Type: application/json
Authorization: Bearer {API_KEY}
```

**요청 본문:**
```json
{
  "model": "gpt-4",
  "messages": [
    {"role": "system", "content": "당신은 유용한 도우미입니다."},
    {"role": "user", "content": "안녕하세요!"}
  ],
  "stream": true,
  "temperature": 0.7,
  "max_tokens": 2000
}
```

**응답 (스트리밍):**
```
data: {"id":"1","object":"chat.completion.chunk","choices":[{"delta":{"role":"assistant","content":"안녕"}}]}

data: {"id":"1","object":"chat.completion.chunk","choices":[{"delta":{"content":"하세요"}}]}

data: [DONE]
```

**오류 응답:**
```json
{
  "error": {
    "message": "Invalid API key",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}
```

### 7.3 GitHub API 명세

**엔드포인트:** `GET /repos/:owner/:repo/releases/latest`

**응답:**
```json
{
  "tag_name": "v1.2.0",
  "name": "Version 1.2.0",
  "body": "## 변경사항\n- 새 기능\n- 버그 수정",
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

## 8. 보안 아키텍처

### 8.1 위협 모델

| 위협 | 영향 | 완화 방안 |
|--------|--------|------------|
| **API 키 노출** | 높음 - 무단 LLM 사용 | - 환경 변수에 저장<br>- 저장소에 커밋 금지<br>- 빌드 시에만 주입 |
| **LLM 응답을 통한 XSS** | 높음 - UI에서 코드 실행 | - 모든 마크다운 렌더링 시 민감정보 제거<br>- `react-markdown` 사용 (기본적으로 안전)<br>- CSP 헤더 |
| **민감 데이터 유출** | 높음 - 프라이버시 침해 | - LLM 전송 전 비밀번호, 신용카드 필터링<br>- 정규식 기반 감지<br>- 사용자 경고 |
| **악의적 페이지 주입** | 중간 - Content script 손상 | - 스타일 격리를 위한 Shadow DOM<br>- 엄격한 CSP<br>- eval() 또는 인라인 스크립트 금지 |
| **스토리지 할당량 DoS** | 낮음 - 확장 프로그램 사용 불가 | - 스토리지 사용량 모니터링<br>- 오래된 채팅 자동 정리<br>- 사용자 경고 |

### 8.2 보안 제어

#### 8.2.1 Content Security Policy

```json
// manifest.json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'none'; connect-src https://api.openai.com"
  }
}
```

#### 8.2.2 민감정보 필터

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

#### 8.2.3 API 키 보호

```typescript
// vite.config.ts
export default defineConfig({
  define: {
    'import.meta.env.VITE_LLM_API_KEY': JSON.stringify(process.env.VITE_LLM_API_KEY),
  },
  build: {
    minify: true, // 프로덕션에서 난독화
    sourcemap: false, // 프로덕션에서 소스맵 없음 (환경 변수 숨김)
  },
});
```

### 8.3 프라이버시 설계

1. **외부 원격 분석 없음:** 외부 서비스에 대한 분석 또는 오류 보고 제로
2. **로컬 전용 스토리지:** 모든 채팅 기록은 `chrome.storage.local`에 보관
3. **명시적 동의:** "페이지와 채팅"은 사용자 토글 필요 (자동 아님)
4. **데이터 이동성:** 채팅 기록을 JSON으로 내보내기/가져오기
5. **삭제 권리:** 설정에 "모든 채팅 지우기" 버튼

---

## 9. 성능 최적화

### 9.1 성능 목표

| 지표 | 목표 | 측정 방법 |
|--------|--------|-------------------|
| **사이드바 로드 시간** | < 500ms | 열기부터 첫 렌더링까지 `performance.now()` |
| **LLM 첫 토큰 시간 (TTFT)** | < 2s | DevTools의 네트워크 워터폴 |
| **페이지 파싱 시간** | < 3s | `parsePageContent()` 주변의 `console.time()` |
| **메시지 렌더링 시간** | < 16ms (60 FPS) | React DevTools Profiler |
| **확장 프로그램 메모리 사용량** | < 100MB | `chrome://extensions` 메모리 검사기 |
| **번들 크기 (총)** | < 2MB | Vite 빌드 출력 |

### 9.2 최적화 전략

#### 9.2.1 코드 분할

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

#### 9.2.2 React 메모이제이션

```typescript
// 비용이 큰 컴포넌트 메모이제이션
const MessageList = memo(({ messages }: { messages: Message[] }) => {
  return (
    <div>
      {messages.map(msg => (
        <MessageItem key={msg.id} message={msg} />
      ))}
    </div>
  );
}, (prev, next) => prev.messages.length === next.messages.length);

// 비용이 큰 계산 메모이제이션
const formattedMessages = useMemo(() => {
  return messages.map(m => ({
    ...m,
    formattedTime: formatTimestamp(m.timestamp)
  }));
}, [messages]);
```

#### 9.2.3 가상 스크롤 (긴 채팅 기록용)

```typescript
// 큰 메시지 목록에 react-window 사용
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
// 장기 실행 작업 중 SW 종료 방지
let keepAliveInterval: NodeJS.Timeout | null = null;

function startKeepalive() {
  if (keepAliveInterval) return;
  keepAliveInterval = setInterval(() => {
    chrome.runtime.getPlatformInfo(); // 더미 호출
  }, 20000); // 20초마다
}

function stopKeepalive() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }
}

// LLM 스트리밍 중 사용
async function* streamChat(messages: Message[]) {
  startKeepalive();
  try {
    // ... 스트리밍 로직
  } finally {
    stopKeepalive();
  }
}
```

---

## 10. 배포 전략

### 10.1 빌드 파이프라인

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

### 10.2 버전 관리

**시맨틱 버저닝 (SemVer):**
- **Major (X.0.0):** 파괴적 변경 (확장 프로그램에서는 드뭄)
- **Minor (1.X.0):** 새 기능 (예: RAG, 음성 입력)
- **Patch (1.0.X):** 버그 수정, 작은 개선

**버전 증가:**
```bash
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.1 → 1.1.0
npm version major  # 1.1.0 → 2.0.0
git push --tags
```

### 10.3 업데이트 메커니즘

```typescript
// src/background/update-checker.ts
chrome.alarms.create('updateCheck', { periodInMinutes: 1440 }); // 24시간

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== 'updateCheck') return;

  const repo = import.meta.env.VITE_GITHUB_REPO;
  const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
  const release = await response.json();

  const currentVersion = chrome.runtime.getManifest().version;
  const latestVersion = release.tag_name.replace('v', '');

  if (compareVersions(latestVersion, currentVersion) > 0) {
    // 새 버전 사용 가능
    chrome.action.setBadgeText({ text: 'NEW' });
    chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });

    // 사이드바에 알림 (열려있을 경우)
    chrome.runtime.sendMessage({
      type: 'UPDATE_AVAILABLE',
      payload: { version: latestVersion, url: release.html_url }
    });
  }
});
```

---

## 11. 테스트 전략

### 11.1 테스트 피라미드

```
        ┌─────────────────┐
        │   E2E 테스트    │  ← 5% (Playwright)
        │   (5개)         │
        ├─────────────────┤
        │ 통합 테스트     │  ← 15% (Jest + React Testing Library)
        │ (20개)          │
        ├─────────────────┤
        │  단위 테스트    │  ← 80% (Jest)
        │  (100개 이상)   │
        └─────────────────┘
```

### 11.2 단위 테스트 예제

```typescript
// src/shared/utils.test.ts
describe('generateUUID', () => {
  it('유효한 UUID v4를 생성해야 함', () => {
    const uuid = generateUUID();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('고유한 UUID를 생성해야 함', () => {
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

  it('채팅 세션을 chrome.storage.local에 저장해야 함', async () => {
    const session: ChatSession = {
      id: 'test-123',
      title: '테스트 채팅',
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

### 11.3 통합 테스트 예제

```typescript
// src/sidepanel/components/ChatView.test.tsx
describe('ChatView 통합', () => {
  it('메시지를 전송하고 응답을 받아야 함', async () => {
    const mockSendMessage = jest.fn().mockResolvedValue(undefined);
    jest.spyOn(chatStore, 'sendMessage').mockImplementation(mockSendMessage);

    render(<ChatView />);

    const input = screen.getByPlaceholderText('메시지를 입력하세요...');
    const sendButton = screen.getByLabelText('메시지 전송');

    // 메시지 입력
    await userEvent.type(input, '안녕하세요 AI!');
    await userEvent.click(sendButton);

    // 메시지 전송 확인
    expect(mockSendMessage).toHaveBeenCalledWith('안녕하세요 AI!');

    // UI에 메시지 표시 확인
    await waitFor(() => {
      expect(screen.getByText('안녕하세요 AI!')).toBeInTheDocument();
    });
  });
});
```

### 11.4 E2E 테스트 예제 (Playwright)

```typescript
// tests/e2e/chat.spec.ts
import { test, expect } from './fixtures/extension';

test('사이드바를 열고 메시지를 전송해야 함', async ({ page, extensionId }) => {
  // 임의의 페이지로 이동
  await page.goto('https://example.com');

  // 확장 프로그램 아이콘 클릭 (사이드바 열기)
  await page.click(`#extension-icon-${extensionId}`);

  // 사이드바 열림 대기
  const sidebar = await page.waitForSelector('#click-ai-sidebar');
  expect(sidebar).toBeTruthy();

  // 메시지 입력
  const input = await sidebar.$('textarea');
  await input.type('2+2는?');

  // 메시지 전송
  const sendButton = await sidebar.$('button[aria-label="메시지 전송"]');
  await sendButton.click();

  // AI 응답 대기
  await page.waitForSelector('.assistant-message', { timeout: 10000 });

  // 응답에 답변이 포함되어 있는지 확인
  const response = await page.textContent('.assistant-message');
  expect(response).toContain('4');
});
```

---

## 12. 부록

### 12.1 용어집

| 용어 | 정의 |
|------|------------|
| **Manifest V3** | 최신 Chrome Extension API 버전 (V2 대체) |
| **Service Worker** | 이벤트 기반 백그라운드 스크립트 (지속적 백그라운드 페이지 대체) |
| **Content Script** | 웹 페이지에 주입되는 JavaScript (DOM 접근 가능) |
| **Side Panel** | Chrome의 사이드바 API (Chrome 109부터 도입) |
| **SSE** | Server-Sent Events (HTTP 스트리밍 프로토콜) |
| **RAG** | Retrieval-Augmented Generation (벡터 검색 + LLM) |
| **BPE** | Byte Pair Encoding (LLM용 토큰화 알고리즘) |
| **CSP** | Content Security Policy (보안 헤더) |
| **HMR** | Hot Module Replacement (개발 중 실시간 코드 업데이트) |

### 12.2 참고 자료

1. **Chrome Extension 문서:**
   - [Manifest V3 개요](https://developer.chrome.com/docs/extensions/mv3/intro/)
   - [Side Panel API](https://developer.chrome.com/docs/extensions/reference/sidePanel/)
   - [Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)

2. **LLM API:**
   - [OpenAI API 레퍼런스](https://platform.openai.com/docs/api-reference)
   - [OpenAI 스트리밍 가이드](https://platform.openai.com/docs/api-reference/streaming)

3. **라이브러리:**
   - [React 문서](https://react.dev/)
   - [Zustand 문서](https://github.com/pmndrs/zustand)
   - [TailwindCSS 문서](https://tailwindcss.com/docs)
   - [react-markdown](https://github.com/remarkjs/react-markdown)
   - [Readability.js](https://github.com/mozilla/readability)

4. **테스트:**
   - [Jest 문서](https://jestjs.io/)
   - [React Testing Library](https://testing-library.com/react)
   - [Playwright](https://playwright.dev/)

### 12.3 변경 이력

| 버전 | 날짜 | 작성자 | 변경사항 |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-04 | Claude Code | 초기 아키텍처 블루프린트 |

### 12.4 승인

| 역할 | 이름 | 서명 | 날짜 |
|------|------|-----------|------|
| **아키텍트** | TBD | _______ | ____ |
| **기술 리드** | TBD | _______ | ____ |
| **보안** | TBD | _______ | ____ |
| **QA 리드** | TBD | _______ | ____ |

---

**문서 상태:** 초안
**다음 검토 날짜:** Milestone 1 시작 (1주차)
**문의:** [GitHub Issues](https://github.com/username/click-ai/issues)
