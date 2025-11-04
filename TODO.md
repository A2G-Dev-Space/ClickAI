# Click AI Development Roadmap

**Last Updated:** 2025-11-04
**Project Status:** Planning Phase
**Version:** 1.0.0 (Target)

---

## Table of Contents

- [Overview](#overview)
- [Development Phases](#development-phases)
- [Milestone 1: Project Setup](#milestone-1-project-setup-week-1)
- [Milestone 2: Core Infrastructure](#milestone-2-core-infrastructure-week-2)
- [Milestone 3: Sidebar Chat](#milestone-3-sidebar-chat-week-3-4)
- [Milestone 4: Context Menu Features](#milestone-4-context-menu-features-week-5-6)
- [Milestone 5: Chat with Page](#milestone-5-chat-with-page-week-7)
- [Milestone 6: Chat History & Storage](#milestone-6-chat-history--storage-week-8)
- [Milestone 7: UI/UX Polish](#milestone-7-uiux-polish-week-9)
- [Milestone 8: Testing & Quality Assurance](#milestone-8-testing--quality-assurance-week-10)
- [Milestone 9: Documentation & Deployment](#milestone-9-documentation--deployment-week-11)
- [Future Enhancements](#future-enhancements-post-v10)
- [Known Issues & Blockers](#known-issues--blockers)

---

## Overview

This document outlines the complete development roadmap for Click AI v1.0.0. The project is divided into 9 major milestones spanning approximately 11 weeks. Each milestone contains specific tasks, deliverables, and acceptance criteria.

### Key Metrics

- **Total Estimated Time:** 11 weeks (3 months)
- **Total Milestones:** 9
- **Total Tasks:** ~120
- **Target Launch Date:** TBD
- **Team Size:** 1-3 developers

### Priority Levels

- **P0 (Critical):** Must-have for v1.0 launch
- **P1 (High):** Important but can be slightly delayed
- **P2 (Medium):** Nice-to-have, can be deferred to v1.1
- **P3 (Low):** Future enhancement, post-v1.0

---

## Development Phases

```
Phase 1: Foundation (Weeks 1-2)
  ├─ M1: Project Setup
  └─ M2: Core Infrastructure

Phase 2: Core Features (Weeks 3-7)
  ├─ M3: Sidebar Chat
  ├─ M4: Context Menu Features
  └─ M5: Chat with Page

Phase 3: Data & History (Week 8)
  └─ M6: Chat History & Storage

Phase 4: Polish (Week 9)
  └─ M7: UI/UX Polish

Phase 5: Launch (Weeks 10-11)
  ├─ M8: Testing & QA
  └─ M9: Documentation & Deployment
```

---

## Milestone 1: Project Setup (Week 1)

**Goal:** Establish a solid foundation with proper tooling, build system, and project structure.

**Status:** ⬜ Not Started

### Tasks

#### 1.1 Repository Setup
- [ ] **P0** Create GitHub repository with appropriate visibility
- [ ] **P0** Initialize Git with `.gitignore` for Node.js and environment files
- [ ] **P0** Set up branch protection rules for `main` branch
- [ ] **P0** Create initial project structure folders
- [ ] **P1** Add LICENSE file (MIT recommended)
- [ ] **P1** Create CONTRIBUTING.md guidelines

#### 1.2 Development Environment
- [ ] **P0** Install Node.js v20 LTS and npm
- [ ] **P0** Initialize npm project (`package.json`)
- [ ] **P0** Install and configure Vite for Chrome Extension
  - Research: [@crxjs/vite-plugin](https://github.com/crxjs/chrome-extension-tools)
- [ ] **P0** Install React 18 + TypeScript dependencies
- [ ] **P0** Install TailwindCSS and configure `tailwind.config.js`
- [ ] **P0** Set up ESLint with TypeScript rules
  - Config: `@typescript-eslint/eslint-plugin`
  - Extends: `airbnb-typescript`
- [ ] **P0** Set up Prettier for code formatting
- [ ] **P0** Configure Husky for pre-commit hooks (lint + format)
- [ ] **P1** Set up VS Code workspace settings (`.vscode/settings.json`)

#### 1.3 Build Configuration
- [ ] **P0** Create basic `manifest.json` (Manifest V3)
  - Version: 1.0.0
  - Permissions: `sidePanel`, `contextMenus`, `storage`, `activeTab`, `scripting`, `alarms`
- [ ] **P0** Configure Vite build for multiple entry points:
  - Background (Service Worker)
  - Side Panel
  - Content Script
  - Full Mode (optional new tab)
- [ ] **P0** Set up environment variable injection (`.env` support)
- [ ] **P0** Create npm scripts:
  - `dev`: Development mode with HMR
  - `build`: Production build
  - `preview`: Preview production build locally
- [ ] **P1** Add build script to generate `.zip` file for distribution
- [ ] **P1** Configure source maps for development

#### 1.4 Testing Setup (Basic)
- [ ] **P1** Install Jest + React Testing Library
- [ ] **P1** Configure Jest for TypeScript
- [ ] **P1** Add npm test scripts
- [ ] **P2** Set up test coverage reporting

#### 1.5 Documentation
- [ ] **P0** Create detailed README.md (done)
- [ ] **P0** Create SRS.md (done)
- [ ] **P0** Create TODO.md (this file, done)
- [ ] **P0** Create BLUEPRINT.md (architecture doc)
- [ ] **P1** Create `.env.example` template
- [ ] **P1** Create CHANGELOG.md (initial entry)

### Deliverables
- ✅ Fully configured development environment
- ✅ Buildable Chrome extension scaffold (empty but working)
- ✅ All tooling (linting, formatting, testing) configured
- ✅ Complete project documentation

### Acceptance Criteria
- [ ] `npm run dev` starts development server without errors
- [ ] `npm run build` generates a working extension in `dist/`
- [ ] Extension can be loaded in Chrome via "Load unpacked"
- [ ] Extension icon appears in toolbar (even if non-functional)
- [ ] ESLint and Prettier run without errors
- [ ] All documentation files are complete and reviewed

**Estimated Time:** 5-7 days

---

## Milestone 2: Core Infrastructure (Week 2)

**Goal:** Implement foundational modules that all features will depend on.

**Status:** ⬜ Not Started

### Tasks

#### 2.1 Service Worker (Background Script)
- [ ] **P0** Create `src/background/index.ts` entry point
- [ ] **P0** Implement extension lifecycle handlers:
  - `chrome.runtime.onInstalled`: Initial setup
  - `chrome.runtime.onStartup`: Extension startup
- [ ] **P0** Create message router for UI ↔ Background ↔ Content Script communication
  - Message types: `SEND_CHAT`, `CHAT_CHUNK`, `PARSE_PAGE`, etc.
- [ ] **P0** Implement error handling and logging system
- [ ] **P1** Add keepalive mechanism (prevent Service Worker timeout)

#### 2.2 Storage Manager
- [ ] **P0** Create `src/background/storage.ts` module
- [ ] **P0** Implement `chrome.storage.local` wrapper functions:
  - `saveChatSession(session: ChatSession): Promise<void>`
  - `loadChatSessions(): Promise<ChatSession[]>`
  - `deleteChatSession(id: string): Promise<void>`
  - `getChatSession(id: string): Promise<ChatSession | null>`
- [ ] **P0** Implement `chrome.storage.sync` wrapper for user settings:
  - `saveSettings(settings: UserSettings): Promise<void>`
  - `loadSettings(): Promise<UserSettings>`
- [ ] **P0** Add storage quota checking and error handling
- [ ] **P1** Implement data migration logic (for future schema changes)

#### 2.3 LLM API Client
- [ ] **P0** Create `src/background/llm-client.ts` module
- [ ] **P0** Implement environment variable loading:
  - `VITE_LLM_ENDPOINT`
  - `VITE_LLM_API_KEY`
  - `VITE_LLM_MODEL`
- [ ] **P0** Implement streaming chat API:
  - Function: `streamChat(messages: Message[]): AsyncGenerator<string>`
  - Use Fetch API with streaming response
- [ ] **P0** Implement error handling:
  - Network errors (retry logic)
  - Authentication errors
  - Rate limiting (429 status code)
  - Token limit errors (context too long)
- [ ] **P0** Add request cancellation support (AbortController)
- [ ] **P1** Implement token counting utility (using `gpt-3-encoder`)
- [ ] **P1** Add logging for API calls (request/response times)

#### 2.4 Shared Types & Utilities
- [ ] **P0** Define TypeScript interfaces in `src/shared/types.ts`:
  - `ChatSession`, `Message`, `UserSettings`, `ContextMenuResult`
- [ ] **P0** Create constants in `src/shared/constants.ts`:
  - `MAX_TOKEN_LIMIT`, `DEFAULT_SETTINGS`, etc.
- [ ] **P0** Implement utility functions in `src/shared/utils.ts`:
  - `generateUUID()`: UUID v4 generation
  - `formatTimestamp(timestamp: number): string`
  - `truncateText(text: string, maxLength: number): string`
- [ ] **P0** Create i18n helper functions in `src/shared/i18n.ts`:
  - `getMessage(key: string): string` (wrapper for `chrome.i18n.getMessage()`)

#### 2.5 Internationalization
- [ ] **P0** Create `public/_locales/en/messages.json`
- [ ] **P0** Create `public/_locales/ko/messages.json`
- [ ] **P0** Define all UI strings (at least 50+ keys):
  - Button labels, menu items, error messages, tooltips
- [ ] **P1** Add support for runtime language switching

### Deliverables
- ✅ Fully functional Service Worker with message routing
- ✅ Storage manager with CRUD operations
- ✅ LLM API client with streaming support
- ✅ Complete type definitions
- ✅ English and Korean localization files

### Acceptance Criteria
- [ ] Service Worker loads without errors
- [ ] Messages can be sent between UI and background
- [ ] Test data can be saved to and loaded from `chrome.storage`
- [ ] Mock LLM API call returns streaming response
- [ ] All TypeScript interfaces compile without errors
- [ ] Both language files have matching keys

**Estimated Time:** 5-7 days

---

## Milestone 3: Sidebar Chat (Week 3-4)

**Goal:** Implement the core chat interface in the sidebar.

**Status:** ⬜ Not Started

### Tasks

#### 3.1 Side Panel Setup
- [ ] **P0** Register side panel in `manifest.json`:
  ```json
  "side_panel": {
    "default_path": "sidepanel.html"
  }
  ```
- [ ] **P0** Create `src/sidepanel/index.html` entry point
- [ ] **P0** Create `src/sidepanel/App.tsx` root component
- [ ] **P0** Set up React rendering in side panel
- [ ] **P0** Configure Vite to build side panel as separate entry
- [ ] **P0** Implement side panel open/close via extension icon click

#### 3.2 UI Components - Header
- [ ] **P0** Create `src/sidepanel/components/Header.tsx`
  - Logo/branding
  - New Chat button (+)
  - History button (📋)
  - Settings button (⚙️)
  - Full Mode button (🔲)
- [ ] **P0** Implement button click handlers (placeholders)
- [ ] **P1** Add tooltips to all header buttons
- [ ] **P1** Implement header animations (fade-in on load)

#### 3.3 UI Components - Chat View
- [ ] **P0** Create `src/sidepanel/components/ChatView.tsx` (container)
- [ ] **P0** Create `src/sidepanel/components/MessageList.tsx`
  - Render user and assistant messages
  - Auto-scroll to bottom on new messages
  - Support for scrolling history
- [ ] **P0** Create `src/sidepanel/components/UserMessage.tsx`
  - Display user text
  - Timestamp
  - Basic styling
- [ ] **P0** Create `src/sidepanel/components/AssistantMessage.tsx`
  - Display AI response
  - Markdown rendering (`react-markdown`)
  - Copy button
  - Timestamp
- [ ] **P0** Create `src/sidepanel/components/ChatInput.tsx`
  - Multi-line textarea
  - Send button
  - Character counter (optional)
  - Keyboard shortcuts (Enter to send, Shift+Enter for newline)
- [ ] **P0** Create `src/sidepanel/components/LoadingIndicator.tsx`
  - Animated spinner or pulse effect
  - Show while waiting for LLM response

#### 3.4 State Management (Zustand)
- [ ] **P0** Install Zustand: `npm install zustand`
- [ ] **P0** Create `src/sidepanel/store/chatStore.ts`
- [ ] **P0** Define store state:
  ```typescript
  interface ChatStore {
    currentSession: ChatSession | null;
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    sendMessage: (content: string) => Promise<void>;
    clearMessages: () => void;
    // ... more actions
  }
  ```
- [ ] **P0** Implement `sendMessage` action:
  - Add user message to state
  - Send message to background via `chrome.runtime.sendMessage`
  - Listen for streaming chunks
  - Append chunks to assistant message in real-time
- [ ] **P0** Implement error handling in store

#### 3.5 Chat Functionality
- [ ] **P0** Integrate ChatInput with store (call `sendMessage` on submit)
- [ ] **P0** Implement streaming response handling:
  - Create new assistant message on first chunk
  - Append subsequent chunks to the same message
  - Mark message as complete when stream ends
- [ ] **P0** Implement auto-save: Save session after each message
- [ ] **P0** Add loading state management (disable input while loading)
- [ ] **P1** Implement message cancellation (stop button)
- [ ] **P1** Add retry button for failed messages

#### 3.6 Markdown & Code Rendering
- [ ] **P0** Install dependencies:
  - `npm install react-markdown remark-gfm`
  - `npm install prism-react-renderer` (for code highlighting)
- [ ] **P0** Implement `MarkdownRenderer` component
  - Wrap `react-markdown` with custom styling
  - Enable GFM (GitHub Flavored Markdown) via `remark-gfm`
- [ ] **P0** Create `CodeBlock` component
  - Syntax highlighting using Prism
  - Copy button in top-right corner
  - Language label (e.g., "Python")
  - Line numbers (optional)
- [ ] **P1** Style markdown elements (headings, lists, links, blockquotes)

#### 3.7 Copy Functionality
- [ ] **P0** Implement copy-to-clipboard utility:
  - `navigator.clipboard.writeText(text)`
  - Fallback for older browsers (document.execCommand)
- [ ] **P0** Add copy button to each assistant message
- [ ] **P0** Add copy button to each code block
- [ ] **P0** Show visual feedback on copy success (checkmark icon, toast)

#### 3.8 Full Mode (New Tab)
- [ ] **P1** Create `src/fullmode/index.html` and `src/fullmode/App.tsx`
- [ ] **P1** Reuse sidebar chat components (DRY principle)
- [ ] **P1** Implement full mode layout:
  - Centered chat area (max-width: 800px)
  - Larger message bubbles
  - More breathing room
- [ ] **P1** Sync state between sidebar and full mode (use shared storage)
- [ ] **P1** Add "Back to Sidebar" button in full mode header

### Deliverables
- ✅ Fully functional sidebar chat interface
- ✅ Real-time streaming LLM responses
- ✅ Markdown and code rendering
- ✅ Copy-to-clipboard functionality
- ✅ Full mode for expanded chat

### Acceptance Criteria
- [ ] Sidebar opens when extension icon is clicked
- [ ] User can type and send messages
- [ ] AI responses stream in real-time (word by word)
- [ ] Markdown is rendered correctly (bold, italic, lists, code)
- [ ] Code blocks have syntax highlighting and copy button
- [ ] Copy button works for messages and code blocks
- [ ] Full mode opens in a new tab with identical functionality
- [ ] No console errors during normal usage

**Estimated Time:** 10-14 days

---

## Milestone 4: Context Menu Features (Week 5-6)

**Goal:** Implement right-click text utilities (grammar, translation, refinement).

**Status:** ⬜ Not Started

### Tasks

#### 4.1 Context Menu Registration
- [ ] **P0** Register context menus in `src/background/index.ts`:
  - Parent menu: "Click AI"
  - Sub-menu 1: "Fix Grammar"
  - Sub-menu 2: "Translate"
  - Sub-menu 3: "Refine Expression"
- [ ] **P0** Add context menu click handler:
  - Get selected text from active tab
  - Determine which sub-menu was clicked
  - Call appropriate LLM function
- [ ] **P0** Add icons to context menu items (if supported)

#### 4.2 LLM Functions for Context Menu
- [ ] **P0** Implement `correctGrammar(text: string): Promise<string>` in `llm-client.ts`
  - Prompt: "Fix only grammatical errors in the following text. Keep the original language and meaning: [text]"
  - Return corrected text
- [ ] **P0** Implement `translate(text: string): Promise<string>`
  - Detect language (Korean/English) using simple heuristic or library
  - Prompt for KR→EN: "Translate the following Korean text to natural English: [text]"
  - Prompt for EN→KR: "Translate the following English text to natural Korean: [text]"
  - Return translated text
- [ ] **P0** Implement `refineExpression(text: string): Promise<string>`
  - Prompt: "Improve the phrasing and readability of the following text. Maintain the original language and meaning: [text]"
  - Return refined text
- [ ] **P1** Add error handling for all functions (e.g., text too long)

#### 4.3 Content Script - Popover UI
- [ ] **P0** Create `src/content/index.ts` entry point
- [ ] **P0** Inject content script into all pages via `manifest.json`:
  ```json
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"],
    "css": ["content.css"]
  }]
  ```
- [ ] **P0** Create `src/content/popover.tsx` (React component)
- [ ] **P0** Implement Shadow DOM mounting:
  - Create shadow root to isolate styles
  - Render React popover inside shadow DOM
- [ ] **P0** Design popover layout:
  - Header: Feature name ("Grammar Correction", "Translation", etc.), Close button
  - Body: Diff view (original vs. result)
  - Footer: "Copy" button, "Edit in Sidebar" button

#### 4.4 Diff Visualization
- [ ] **P0** Install diff library: `npm install diff-match-patch`
- [ ] **P0** Create `DiffView` component in `src/content/popover.tsx`
- [ ] **P0** Implement word-level diff algorithm:
  - Split text into words
  - Compare original and result
  - Generate diff chunks (added, removed, unchanged)
- [ ] **P0** Render diff with styling:
  - Deleted: Red background, strikethrough
  - Added: Green background, underline
  - Unchanged: Gray text (subtle)
- [ ] **P1** Support dark mode for diff colors

#### 4.5 Popover Positioning
- [ ] **P0** Calculate popover position relative to selected text:
  - Get bounding rect of selection
  - Position popover above or below (avoid viewport overflow)
  - Add arrow/pointer to indicate origin
- [ ] **P0** Implement collision detection:
  - If popover doesn't fit above, show below
  - If popover doesn't fit horizontally, adjust position
- [ ] **P1** Add animation for popover appearance (fade-in + slide-up)

#### 4.6 Popover Interactions
- [ ] **P0** Implement "Copy" button:
  - Copy result text to clipboard
  - Show success feedback (checkmark, toast)
- [ ] **P0** Implement "Edit in Sidebar" button:
  - Open sidebar if not already open
  - Pre-fill input with: "Please further improve: [result text]"
  - Auto-focus input
- [ ] **P0** Implement "Close" button (X in header)
- [ ] **P0** Close popover on ESC key press
- [ ] **P0** Close popover when clicking outside

#### 4.7 Communication Flow
- [ ] **P0** Implement message flow:
  1. User selects text and clicks context menu
  2. Background sends message to content script: `{type: 'SHOW_RESULT', data: {original, result, type}}`
  3. Content script injects and shows popover
  4. User interacts with popover
- [ ] **P0** Handle errors in content script (e.g., failed to inject popover)

### Deliverables
- ✅ Right-click context menu with 3 AI features
- ✅ Inline popover showing diff comparison
- ✅ Copy and "Edit in Sidebar" functionality
- ✅ All features work on any webpage

### Acceptance Criteria
- [ ] Right-clicking selected text shows "Click AI" menu
- [ ] "Fix Grammar" corrects errors and shows diff
- [ ] "Translate" translates KR↔EN correctly
- [ ] "Refine Expression" improves phrasing
- [ ] Popover appears near selected text
- [ ] Diff view clearly highlights changes
- [ ] Copy button works correctly
- [ ] "Edit in Sidebar" opens sidebar with pre-filled text
- [ ] Popover closes properly (X button, ESC, click outside)

**Estimated Time:** 10-14 days

---

## Milestone 5: Chat with Page (Week 7)

**Goal:** Enable AI to read and discuss the current webpage.

**Status:** ⬜ Not Started

### Tasks

#### 5.1 Page Content Parser
- [ ] **P0** Install Readability.js: `npm install @mozilla/readability`
- [ ] **P0** Create `src/content/parser.ts` module
- [ ] **P0** Implement `parsePageContent(): string` function:
  - Use Readability.js to extract main content
  - Fallback to `document.body.innerText` if Readability fails
  - Filter out sensitive elements: `<input type="password">`, `<script>`, `<style>`
- [ ] **P0** Implement `getPageMetadata()` function:
  - Return: `{title: string, url: string, publishDate?: string}`
- [ ] **P0** Add minimum content length check (e.g., 100 characters)
- [ ] **P1** Implement sensitive information filtering:
  - Regex patterns for emails, phone numbers, credit cards
  - Warn user if sensitive data detected

#### 5.2 "Chat with Page" Toggle
- [ ] **P0** Add toggle switch to ChatInput component in sidebar
  - Label: "Chat with Page"
  - Icon: 📄 or 🌐
- [ ] **P0** Store toggle state in Zustand store: `isChatWithPageEnabled: boolean`
- [ ] **P0** When toggled ON:
  - Send message to content script: `{type: 'PARSE_PAGE'}`
  - Content script returns parsed content
  - Store parsed content in state
  - Show toast: "Page content analyzed (approx. X words)"
- [ ] **P0** When toggled OFF:
  - Clear stored page content
  - Show toast: "Chat with Page disabled"

#### 5.3 Token Management
- [ ] **P0** Install token counting library: `npm install gpt-3-encoder`
- [ ] **P0** Implement `countTokens(text: string): number` utility
- [ ] **P0** Implement `truncateToTokenLimit(text: string, maxTokens: number): string`
  - Strategy 1: Keep first 50% + last 50%, discard middle
  - Strategy 2: Keep only paragraphs with highest Readability score
- [ ] **P0** Before sending to LLM:
  - Calculate tokens: user message + page content + system prompt
  - If exceeds model limit (e.g., 8K tokens), truncate page content
  - Show warning: "Page is too long, using main sections only"

#### 5.4 LLM Context Integration
- [ ] **P0** Modify `sendMessage` action in chatStore:
  - If `isChatWithPageEnabled === true`:
    - Prepend system message with page content:
      ```
      System: "You are viewing the following webpage:
      Title: [title]
      URL: [url]
      Content: [parsed content]

      Please answer questions based on this content."
      ```
  - If false: Use default system prompt
- [ ] **P0** Ensure page context is only sent when toggle is ON

#### 5.5 UI Indicators
- [ ] **P1** Show active page info in sidebar header when toggle is ON:
  - Pill badge: "📄 Current page: [Page Title]"
  - Truncate long titles
- [ ] **P1** Add loading indicator during parsing (spinner)
- [ ] **P2** Add warning if page has very little text content

### Deliverables
- ✅ "Chat with Page" toggle in sidebar
- ✅ Page content parsing with Readability.js
- ✅ Token management for long pages
- ✅ AI can answer questions about current webpage

### Acceptance Criteria
- [ ] Toggle switch appears above chat input
- [ ] Toggling ON parses the page within 3 seconds
- [ ] User can ask questions about the page (e.g., "Summarize this article")
- [ ] AI responses reference page content accurately
- [ ] Long pages are truncated gracefully (no token errors)
- [ ] Toggling OFF reverts to normal chat mode
- [ ] Works on various websites (news, docs, blogs)

**Estimated Time:** 5-7 days

---

## Milestone 6: Chat History & Storage (Week 8)

**Goal:** Implement persistent chat history with session management.

**Status:** ⬜ Not Started

### Tasks

#### 6.1 Chat Session Management
- [ ] **P0** Implement `createNewSession()` in chatStore:
  - Generate new UUID for session
  - Save current session to storage (if not empty)
  - Reset messages array
  - Update `currentSession` state
- [ ] **P0** Implement `loadSession(sessionId: string)` in chatStore:
  - Fetch session from storage
  - Load messages into state
  - Set `currentSession`
- [ ] **P0** Implement auto-save on every message:
  - After each user/assistant message, call `storage.saveChatSession()`

#### 6.2 History View UI
- [ ] **P0** Create `src/sidepanel/components/HistoryView.tsx`
- [ ] **P0** Implement layout:
  - Header: "Chat History", Back button
  - List: All saved sessions (sorted by `updatedAt` DESC)
  - Empty state: "No chat history yet"
- [ ] **P0** Create `SessionItem` component:
  - Display: Session title (truncated), date (relative, e.g., "2 hours ago"), message count
  - Actions: Click to open, "..." menu for more options
- [ ] **P0** Implement session list loading:
  - On mount, call `storage.loadChatSessions()`
  - Render sessions in reverse chronological order

#### 6.3 Session Item Actions
- [ ] **P0** Implement "Open Session":
  - Click session item → Load session → Switch to ChatView
- [ ] **P1** Implement "Edit Title":
  - Double-click title → Edit inline
  - Save new title to storage
- [ ] **P1** Implement "Delete Session":
  - Show confirmation dialog: "Delete this chat?"
  - On confirm, call `storage.deleteChatSession(id)`
  - Refresh session list
- [ ] **P2** Implement "Export Session":
  - Convert session to JSON
  - Trigger download as `chat-[date].json`

#### 6.4 Auto-Generated Titles
- [ ] **P0** Implement simple title generation:
  - Default: First user message (first 50 characters)
- [ ] **P2** Implement LLM-based title generation:
  - After 3+ messages, send to LLM: "Summarize this conversation in 5 words or less"
  - Use result as title
  - Run asynchronously (don't block UI)

#### 6.5 Storage Optimization
- [ ] **P1** Implement quota checking:
  - Before saving, check `chrome.storage.local.getBytesInUse()`
  - If approaching 10MB limit, warn user
- [ ] **P1** Implement auto-cleanup:
  - If quota exceeded, delete oldest sessions (after warning)
- [ ] **P2** Implement data compression for large sessions:
  - Use LZ-String library to compress message content
  - Decompress when loading

#### 6.6 Data Export/Import (Settings)
- [ ] **P2** Add "Export All Chats" in Settings:
  - Export all sessions as single JSON file
  - Filename: `click-ai-backup-[date].json`
- [ ] **P2** Add "Import Chats" in Settings:
  - File picker for JSON file
  - Validate JSON structure
  - Merge with existing sessions (skip duplicates)
  - Show import summary (e.g., "10 chats imported")

### Deliverables
- ✅ Persistent chat history stored locally
- ✅ History view with session list
- ✅ Session management (open, delete, edit title)
- ✅ Auto-save on every message

### Acceptance Criteria
- [ ] Chats are automatically saved after each message
- [ ] "New Chat" button creates a new session
- [ ] "History" button shows list of past sessions
- [ ] Clicking a session loads it and switches to chat view
- [ ] Sessions have auto-generated titles (first message)
- [ ] Sessions can be deleted with confirmation
- [ ] All data persists across browser restarts

**Estimated Time:** 5-7 days

---

## Milestone 7: UI/UX Polish (Week 9)

**Goal:** Refine the user interface and add theming, animations, and settings.

**Status:** ⬜ Not Started

### Tasks

#### 7.1 Theme System
- [ ] **P0** Implement CSS variables for theme colors in `src/styles/global.css`:
  ```css
  :root {
    --bg-primary: #ffffff;
    --text-primary: #202124;
    --accent: #1A73E8;
    /* ... more variables */
  }
  [data-theme="dark"] {
    --bg-primary: #202124;
    --text-primary: #E8EAED;
    /* ... dark mode colors */
  }
  ```
- [ ] **P0** Create theme context or store:
  - State: `theme: 'light' | 'dark' | 'system'`
  - Action: `setTheme(theme: string)`
- [ ] **P0** Implement theme application:
  - On theme change, set `data-theme` attribute on `<html>`
  - Persist theme to `chrome.storage.sync`
- [ ] **P0** Detect system theme:
  - Use `window.matchMedia('(prefers-color-scheme: dark)')`
  - Auto-switch if `theme === 'system'`
- [ ] **P0** Add theme selector in Settings:
  - Radio buttons: Light, Dark, System
  - Show preview of each theme (optional)

#### 7.2 Settings View
- [ ] **P0** Create `src/sidepanel/components/SettingsView.tsx`
- [ ] **P0** Implement settings layout:
  - Header: "Settings", Back button
  - Sections:
    - Appearance (Theme, Font Size)
    - Language (Korean, English)
    - Data Management (Export, Import, Clear All)
    - About (Version, GitHub link)
- [ ] **P0** Implement "Theme" setting (see 7.1)
- [ ] **P0** Implement "Language" setting:
  - Dropdown: Korean, English
  - On change, reload UI with new locale
  - Persist to `chrome.storage.sync`
- [ ] **P1** Implement "Font Size" setting:
  - Options: Small, Medium, Large
  - Apply CSS font-size multiplier
- [ ] **P1** Implement "Clear All Chats" button:
  - Show confirmation: "This will delete all chat history. Continue?"
  - On confirm, call `storage.clearAll()`

#### 7.3 Animations & Transitions
- [ ] **P0** Add CSS transitions for interactive elements:
  - Buttons: Background color (150ms)
  - Hover effects: Scale, opacity changes
- [ ] **P0** Add sidebar open/close animation:
  - Slide-in from right (300ms ease-out)
- [ ] **P0** Add message appear animation:
  - Fade-in + slide-up (200ms)
- [ ] **P1** Add loading spinner animation (rotate)
- [ ] **P1** Add smooth scroll animation in message list

#### 7.4 Responsive Design & Sidebar Resizing
- [ ] **P0** Make sidebar width adjustable:
  - Add drag handle on left edge
  - Min width: 250px, Max width: 800px
  - Persist width to `chrome.storage.sync`
- [ ] **P0** Ensure all components are responsive:
  - Test at 250px, 400px, 600px, 800px widths
  - Adjust layouts, font sizes, padding as needed
- [ ] **P1** Add mobile-friendly styles (for future web version)

#### 7.5 Accessibility (A11y)
- [ ] **P0** Add ARIA labels to all interactive elements:
  - Buttons: `aria-label` for icon-only buttons
  - Inputs: `aria-describedby` for helper text
- [ ] **P0** Ensure keyboard navigation works:
  - Tab order is logical
  - All buttons/links are keyboard-accessible
  - Focus styles are visible
- [ ] **P0** Test with screen reader (NVDA or VoiceOver)
- [ ] **P1** Add focus trap in modals/popovers (prevent tabbing outside)
- [ ] **P1** Ensure color contrast meets WCAG AA standards (4.5:1)

#### 7.6 Error & Empty States
- [ ] **P0** Design error state UI for chat:
  - Icon + message: "Failed to send message. [Retry]"
  - Different errors: Network, API key, token limit
- [ ] **P0** Design empty state for new chat:
  - Greeting message: "Hello! How can I help you today?"
  - Example prompts (clickable)
- [ ] **P0** Design empty state for history:
  - Icon + message: "No chat history yet. Start a conversation!"
- [ ] **P1** Add loading skeletons for slow-loading content

#### 7.7 Tooltips & Onboarding
- [ ] **P1** Add tooltips to all header icons (on hover):
  - New Chat, History, Settings, Full Mode
- [ ] **P2** Implement first-time onboarding:
  - On first install, show welcome modal
  - Highlight key features (sidebar, context menu, chat with page)
  - "Don't show again" checkbox

### Deliverables
- ✅ Dark mode and light mode themes
- ✅ Settings view with theme, language, data management
- ✅ Smooth animations and transitions
- ✅ Resizable sidebar
- ✅ Full keyboard navigation and screen reader support

### Acceptance Criteria
- [ ] Dark mode and light mode both look polished
- [ ] Theme switches instantly without flickering
- [ ] Settings are saved and persist across sessions
- [ ] All animations are smooth (60 FPS)
- [ ] Sidebar can be resized by dragging
- [ ] All buttons are keyboard-accessible
- [ ] Error states are clear and actionable

**Estimated Time:** 5-7 days

---

## Milestone 8: Testing & Quality Assurance (Week 10)

**Goal:** Thoroughly test all features and fix bugs.

**Status:** ⬜ Not Started

### Tasks

#### 8.1 Unit Tests
- [ ] **P0** Write tests for utility functions:
  - `src/shared/utils.ts`: `generateUUID()`, `formatTimestamp()`, etc.
  - Target: 80%+ coverage
- [ ] **P0** Write tests for storage manager:
  - `saveChatSession()`, `loadChatSessions()`, `deleteChatSession()`
  - Use mocked `chrome.storage`
- [ ] **P0** Write tests for LLM client:
  - Mock Fetch API responses
  - Test streaming logic, error handling
- [ ] **P1** Write tests for page parser:
  - Test with sample HTML (article, blog, etc.)
  - Ensure Readability.js integration works

#### 8.2 Component Tests (React Testing Library)
- [ ] **P0** Write tests for ChatInput component:
  - Type text → Click send → Verify callback called
  - Shift+Enter adds newline, Enter sends
- [ ] **P0** Write tests for MessageList component:
  - Renders user and assistant messages correctly
  - Auto-scrolls to bottom on new message
- [ ] **P0** Write tests for Header buttons:
  - Click New Chat → Verify action called
  - Click History → Switches to history view
- [ ] **P1** Write tests for HistoryView:
  - Loads sessions from storage
  - Clicking session switches to chat view

#### 8.3 Integration Tests
- [ ] **P0** Test end-to-end chat flow:
  1. Open sidebar
  2. Type message and send
  3. Verify message appears
  4. Wait for AI response
  5. Verify response is streamed and rendered
- [ ] **P0** Test context menu flow:
  1. Select text on page
  2. Right-click → Click "Fix Grammar"
  3. Verify popover appears with result
  4. Click "Copy" → Verify text copied
- [ ] **P0** Test "Chat with Page" flow:
  1. Toggle ON
  2. Verify page parsed
  3. Ask question about page
  4. Verify AI response uses page context
- [ ] **P0** Test chat history flow:
  1. Send messages
  2. Create new chat
  3. Open history
  4. Load previous chat
  5. Verify messages restored

#### 8.4 E2E Tests (Playwright)
- [ ] **P1** Set up Playwright for Chrome Extension testing
- [ ] **P1** Write E2E test: Load extension in Chrome
- [ ] **P1** Write E2E test: Open sidebar and send message
- [ ] **P1** Write E2E test: Use context menu features
- [ ] **P1** Write E2E test: Toggle "Chat with Page"
- [ ] **P1** Write E2E test: Navigate history

#### 8.5 Manual Testing & Bug Fixing
- [ ] **P0** Test on different websites:
  - News sites (CNN, BBC)
  - Documentation sites (MDN, React docs)
  - Blogs (Medium, personal blogs)
  - E-commerce sites (Amazon, eBay)
- [ ] **P0** Test edge cases:
  - Very long text (1000+ words)
  - Special characters, emojis, code snippets
  - Non-English text (Korean, Japanese, etc.)
  - Extremely long pages (100+ paragraphs)
- [ ] **P0** Test performance:
  - Open 50+ tabs with extension enabled
  - Send 100+ messages in a session
  - Measure memory usage
- [ ] **P0** Test error scenarios:
  - Disconnect network mid-message
  - Invalid API key
  - LLM API returns error (500, 429)
- [ ] **P0** Fix all critical (P0) bugs
- [ ] **P1** Fix high priority (P1) bugs

#### 8.6 Cross-Browser Testing
- [ ] **P0** Test on Chrome (latest stable)
- [ ] **P0** Test on Microsoft Edge (latest stable)
- [ ] **P1** Test on Chrome Beta/Dev channels
- [ ] **P2** Test on older Chrome versions (v109-115)

#### 8.7 Accessibility Testing
- [ ] **P0** Test with keyboard-only navigation (no mouse)
- [ ] **P0** Test with screen reader (NVDA on Windows, VoiceOver on Mac)
- [ ] **P1** Test color contrast with Chrome DevTools "Emulate vision deficiencies"

### Deliverables
- ✅ 100+ unit tests (80%+ coverage)
- ✅ 20+ integration tests
- ✅ 5+ E2E tests
- ✅ All critical bugs fixed
- ✅ Tested on Chrome and Edge

### Acceptance Criteria
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] No critical bugs remaining
- [ ] Works on Chrome and Edge without issues
- [ ] Passes keyboard navigation test
- [ ] Passes screen reader test

**Estimated Time:** 5-7 days

---

## Milestone 9: Documentation & Deployment (Week 11)

**Goal:** Finalize documentation, prepare for deployment, and release v1.0.

**Status:** ⬜ Not Started

### Tasks

#### 9.1 Documentation
- [ ] **P0** Finalize README.md:
  - Add screenshots/GIFs
  - Update installation guide with actual steps
  - Add troubleshooting section
- [ ] **P0** Finalize SRS.md (ensure up-to-date)
- [ ] **P0** Finalize BLUEPRINT.md (architecture doc)
- [ ] **P0** Create CHANGELOG.md:
  - Add entry for v1.0.0
  - List all features, bug fixes, known issues
- [ ] **P0** Create installation guide with screenshots:
  - Step-by-step tutorial (PDF or web page)
  - Include visuals for each step
- [ ] **P1** Create user guide (optional):
  - How to use each feature
  - Tips & tricks
  - FAQ

#### 9.2 Build & Packaging
- [ ] **P0** Create production build:
  - Run `npm run build`
  - Verify no errors
  - Test built extension in Chrome (load from `dist/`)
- [ ] **P0** Create `.zip` file for distribution:
  - Filename: `click-ai-v1.0.0.zip`
  - Include only necessary files (no source maps)
- [ ] **P0** Test installation from `.zip`:
  - Extract and load in Chrome
  - Verify all features work
- [ ] **P0** Create `.env.example` file:
  - Include all required environment variables with placeholders
  - Add comments explaining each variable

#### 9.3 GitHub Release
- [ ] **P0** Create GitHub release v1.0.0:
  - Tag: `v1.0.0`
  - Title: "Click AI v1.0.0 - Initial Release"
  - Description: Copy from CHANGELOG.md
  - Attach `click-ai-v1.0.0.zip` as asset
- [ ] **P0** Write detailed release notes:
  - Features
  - Installation instructions (link to guide)
  - Known issues
  - Credits
- [ ] **P1** Add release badges to README (version, license, etc.)

#### 9.4 Update Checker Implementation
- [ ] **P1** Implement update checker in background:
  - Use `chrome.alarms` to check every 24 hours
  - Fetch `https://api.github.com/repos/{owner}/{repo}/releases/latest`
  - Compare `tag_name` with current version from `manifest.json`
- [ ] **P1** Show update notification:
  - If new version available, set badge on extension icon ("NEW")
  - Show banner in sidebar: "New version X.X.X available! [View]"
  - Link to GitHub release page
- [ ] **P1** Add "Check for Updates" button in Settings:
  - Manually trigger update check
  - Show result: "You're up to date" or "Update available"

#### 9.5 Security & Privacy Review
- [ ] **P0** Review code for hardcoded secrets (API keys, tokens)
- [ ] **P0** Ensure `.env` is in `.gitignore`
- [ ] **P0** Review permissions in `manifest.json`:
  - Remove unnecessary permissions
  - Add clear explanations for each permission (in README)
- [ ] **P0** Review data handling:
  - Ensure no data is sent to external servers (except LLM API)
  - Add privacy policy section to README
- [ ] **P1** Run security audit: `npm audit`
  - Fix high/critical vulnerabilities

#### 9.6 Performance Optimization
- [ ] **P0** Minimize bundle size:
  - Check bundle size with `npm run build`
  - Remove unused dependencies
  - Code-split large components
- [ ] **P0** Optimize images/icons:
  - Use SVG where possible
  - Compress PNG icons (TinyPNG)
- [ ] **P1** Lazy-load heavy dependencies (e.g., Readability.js)
- [ ] **P1** Add performance monitoring (log load times)

#### 9.7 Final Testing & QA
- [ ] **P0** Full regression test on all features
- [ ] **P0** Test on clean Chrome profile (no other extensions)
- [ ] **P0** Test on Windows, macOS, and Linux
- [ ] **P0** Verify all documentation is accurate
- [ ] **P0** Check for console errors/warnings in all views

#### 9.8 Launch Preparation
- [ ] **P0** Create announcement post (internal or public):
  - Features overview
  - Installation link
  - Support contacts
- [ ] **P1** Set up issue templates on GitHub:
  - Bug report template
  - Feature request template
- [ ] **P1** Create CONTRIBUTING.md:
  - How to contribute
  - Code style guidelines
  - Pull request process
- [ ] **P2** Create demo video (screencast):
  - Show all major features
  - Upload to YouTube or host internally

### Deliverables
- ✅ Complete documentation (README, SRS, BLUEPRINT, CHANGELOG)
- ✅ Production build (.zip file)
- ✅ GitHub release v1.0.0
- ✅ Installation guide with screenshots
- ✅ Update checker implemented

### Acceptance Criteria
- [ ] `click-ai-v1.0.0.zip` is available on GitHub Releases
- [ ] Installation guide is clear and includes screenshots
- [ ] README.md has all sections complete
- [ ] CHANGELOG.md accurately lists all v1.0 features
- [ ] Extension passes final QA on Chrome and Edge
- [ ] No critical bugs or security issues remain
- [ ] All documentation is proofread and accurate

**Estimated Time:** 5-7 days

---

## Future Enhancements (Post-v1.0)

These features are planned for future releases (v1.1, v1.2, etc.):

### High Priority (v1.1)
- [ ] **RAG for Chat with Page**: Implement vector embeddings and semantic search for better page context handling
- [ ] **Voice Input**: Add Web Speech API integration for voice-to-text
- [ ] **Custom Prompt Templates**: Allow users to create and save custom prompts
- [ ] **Keyboard Shortcuts**: Add configurable keyboard shortcuts (Ctrl+K to open sidebar, etc.)
- [ ] **Export Chat to Markdown/PDF**: Export individual chats as formatted documents

### Medium Priority (v1.2)
- [ ] **Multi-LLM Provider Support**: Add support for Anthropic Claude, Google PaLM, local LLMs
- [ ] **Chat Search**: Search within chat history
- [ ] **Conversation Branching**: Create branches from any message (like ChatGPT)
- [ ] **Code Execution**: Execute code snippets in sandbox (Python, JavaScript)
- [ ] **Image Analysis**: Support for image uploads and analysis (GPT-4V)

### Low Priority (v1.3+)
- [ ] **Collaborative Sessions**: Share chat sessions across devices (sync via cloud)
- [ ] **Browser Action Keyboard Shortcuts**: Define custom global shortcuts
- [ ] **Sidebar Split View**: Show page and chat side-by-side
- [ ] **Plugin System**: Allow community plugins for custom functionality
- [ ] **Offline Mode**: Cache LLM responses for offline access (limited)

---

## Known Issues & Blockers

| Issue | Severity | Status | Resolution |
|-------|----------|--------|------------|
| TBD | - | - | - |

*(This section will be populated during development)*

---

## Progress Tracking

### Completed Milestones
- [ ] M1: Project Setup
- [ ] M2: Core Infrastructure
- [ ] M3: Sidebar Chat
- [ ] M4: Context Menu Features
- [ ] M5: Chat with Page
- [ ] M6: Chat History & Storage
- [ ] M7: UI/UX Polish
- [ ] M8: Testing & QA
- [ ] M9: Documentation & Deployment

### Velocity Tracking
*(To be filled in during development)*

| Week | Milestone | Tasks Completed | Tasks Remaining | Notes |
|------|-----------|-----------------|-----------------|-------|
| 1 | M1 | 0/25 | 25 | - |
| 2 | M2 | 0/20 | 20 | - |
| ... | ... | ... | ... | ... |

---

## Notes & Decisions

*(Log important architectural decisions, tradeoffs, and discussions here)*

- **2025-11-04**: Decided to use Vite instead of Webpack for faster build times
- **2025-11-04**: Chose Zustand over Redux for simpler state management
- **2025-11-04**: Using Readability.js for page parsing instead of custom solution

---

**Last Updated:** 2025-11-04
**Next Review:** Start of M1 (Week 1)
