# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned Features
- E2E tests with Playwright
- Chrome Web Store deployment
- Icon assets (16x16, 48x48, 128x128)
- Keyboard shortcuts customization
- Export/import chat history
- More language support

## [1.0.0] - 2025-01-04

### Added

#### Core Features (Milestones 1-7)
- **Sidebar AI Chat**: Elegant chat interface with streaming LLM responses
  - Real-time markdown rendering with syntax highlighting
  - Copy-to-clipboard functionality for assistant messages
  - Auto-scroll to latest message
  - Loading indicators and error handling

- **Context Menu Tools**: Right-click text utilities
  - Grammar correction with AI
  - Auto-detect translation (Korean ↔ English)
  - Text refinement for better expression
  - Git-style diff view (using diff-match-patch)

- **Chat with Page**: Analyze web page content
  - One-click toggle to include page context
  - Mozilla Readability integration for clean content extraction
  - Automatic sensitive information filtering
  - Token counting and content length management

- **Chat History Management**
  - Auto-save conversations to chrome.storage.local
  - View, load, and delete past sessions
  - Smart session titles based on content
  - Storage statistics and quota monitoring

- **Settings & Customization**
  - Theme selector (Light/Dark/Auto)
  - Language selector (Korean/English)
  - Storage management with clear data option
  - Settings sync via chrome.storage.sync

#### UI/UX Enhancements
- Dark mode support with smooth transitions
- Custom animations (fadeIn, slideIn) for messages
- Responsive design for various screen sizes
- Custom scrollbar styling
- Empty states for better user experience
- Shadow effects and hover states

#### Technical Infrastructure
- **Project Setup (Milestone 1)**
  - React 18 + TypeScript 5.0+
  - Vite 7 + @crxjs/vite-plugin for Chrome Extension
  - TailwindCSS 3 with typography plugin
  - ESLint and Prettier configuration
  - Chrome Extension Manifest V3

- **Core Infrastructure (Milestone 2)**
  - Custom error hierarchy (ClickAIError, NetworkError, APIAuthError, etc.)
  - Utility functions (generateUUID, formatTimestamp, withRetry, etc.)
  - MessageRouter for chrome.runtime message handling
  - StorageManager for chrome.storage operations
  - LLM Client with streaming support

- **State Management (Milestone 3)**
  - Zustand for React state management
  - Persistent chat sessions
  - Message streaming with chrome.runtime.onMessage

- **Testing (Milestone 8)**
  - Jest configuration with TypeScript and jsdom
  - 39 unit tests for utilities and error handling
  - 17 integration tests for React components
  - All 56 tests passing with good coverage
  - Mock setup for Chrome APIs and react-markdown

#### Developer Experience
- Hot Module Replacement (HMR) in development
- TypeScript strict mode with path aliases (@/*)
- Comprehensive error messages (Korean)
- Well-documented codebase
- Git commit history with detailed messages

### Documentation
- Comprehensive README with installation guide
- Software Requirements Specification (SRS.md)
- Architecture Blueprint (BLUEPRINT.md)
- Development roadmap (TODO.md)
- Korean and English documentation
- CHANGELOG.md (this file)

### Fixed
- TailwindCSS v4 PostCSS compatibility issues
- TypeScript unused parameter errors
- TypeScript import.meta.env errors
- react-markdown inline prop compatibility
- Async/await in Chrome message listeners
- Jest ESM module transformation issues

### Known Issues
- Node.js version warnings (v22.3.0 vs v22.12+ required) - non-blocking
- gpt-3-encoder browser compatibility warnings - expected behavior

[Unreleased]: https://github.com/A2G-Dev-Space/ClickAI/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/A2G-Dev-Space/ClickAI/releases/tag/v1.0.0
