# Click AI

> Your AI-powered browser companion for enhanced web browsing and content creation.

![Click AI Banner](docs/images/banner.png)

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/username/click-ai/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Chrome](https://img.shields.io/badge/Chrome-109+-yellow.svg)](https://www.google.com/chrome/)
[![Edge](https://img.shields.io/badge/Edge-109+-blue.svg)](https://www.microsoft.com/edge)

[한국어](README_KO.md) | English

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [License](#license)

---

## Overview

**Click AI** is a powerful Chrome/Edge browser extension that seamlessly integrates AI capabilities directly into your browsing experience. With an elegant sidebar chat interface, contextual page analysis, and instant text utilities (grammar correction, translation, expression refinement), Click AI transforms how you interact with web content.

### Why Click AI?

- **Always Available:** Access AI chat from any web page via the sidebar
- **Context-Aware:** Analyze and discuss current web pages with "Chat with Page"
- **Instant Text Tools:** Right-click any selected text for grammar fixes, translations, or style improvements
- **Privacy-First:** All chat history is stored locally in your browser
- **Beautiful UI:** Minimalist design inspired by Google Gemini
- **Dark Mode:** Easy on your eyes with full dark theme support

---

## Features

### 1. Sidebar AI Chat

- **Persistent Chat Interface:** Always accessible from any web page
- **Streaming Responses:** Real-time text generation for immediate feedback
- **Full Mode:** Expand to a dedicated full-screen chat interface
- **Chat History:** All conversations are saved locally and can be resumed anytime
- **Markdown Support:** Rich text rendering with syntax-highlighted code blocks

![Sidebar Chat](docs/images/sidebar-chat.png)

### 2. Context Menu Text Utilities

Right-click any selected text to access powerful AI tools:

#### Grammar Correction
- Automatically detects the language (Korean/English)
- Fixes grammatical errors while preserving meaning
- Shows a clear diff view of changes

#### Translation
- Korean ↔ English automatic translation
- Preserves technical terms with original text in parentheses
- Natural, context-aware translations

#### Expression Refinement
- Improves awkward phrasing and readability
- Maintains original meaning while enhancing professionalism
- Language-specific refinement (keeps Korean as Korean, English as English)

![Context Menu](docs/images/context-menu.png)

### 3. Chat with Page

- **One-Click Page Analysis:** Toggle to include the current page's content in your conversation
- **Smart Parsing:** Extracts main content using Readability.js algorithm
- **Token Management:** Automatically handles long pages to fit within LLM context limits
- **Use Cases:**
  - Summarize lengthy articles
  - Ask questions about documentation
  - Translate entire blog posts
  - Extract specific information from web pages

![Chat with Page](docs/images/chat-with-page.png)

### 4. Beautiful Diff View

- **Git-Style Comparison:** Deleted text in red with strikethrough, added text in green with underline
- **Clear Visualization:** Instantly see what changed between original and AI-improved text
- **Copy & Edit:** One-click copy or send to sidebar for further refinement

![Diff View](docs/images/diff-view.png)

### 5. Chat History Management

- **Automatic Saving:** Every conversation is saved locally
- **Session Management:** Create new chats, view history, and resume previous conversations
- **Smart Titles:** Auto-generated titles based on conversation content
- **Export/Import:** Backup your chat history as JSON files

### 6. Customization

- **Themes:** Light, Dark, or System (follows your OS preference)
- **Languages:** Korean and English UI
- **Adjustable Sidebar:** Drag to resize between 250px - 800px
- **Settings Sync:** Your preferences sync across devices (Chrome/Edge account)

---

## Screenshots

<table>
  <tr>
    <td width="50%">
      <img src="docs/images/screenshot-1.png" alt="Sidebar Chat">
      <p align="center"><em>Sidebar Chat Interface</em></p>
    </td>
    <td width="50%">
      <img src="docs/images/screenshot-2.png" alt="Full Mode">
      <p align="center"><em>Full Mode</em></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="docs/images/screenshot-3.png" alt="Context Menu">
      <p align="center"><em>Context Menu Utilities</em></p>
    </td>
    <td width="50%">
      <img src="docs/images/screenshot-4.png" alt="Dark Mode">
      <p align="center"><em>Dark Mode</em></p>
    </td>
  </tr>
</table>

---

## Installation

### Prerequisites

- **Browser:** Google Chrome (v109+) or Microsoft Edge (v109+)
- **Operating System:** Windows 10/11, macOS 11+, or Linux (Ubuntu 20.04+)
- **Internet Connection:** Required for LLM API calls

### Step-by-Step Installation Guide

#### Method 1: Install from GitHub Releases (Recommended)

1. **Download the Extension**
   - Go to the [Releases Page](https://github.com/username/click-ai/releases/latest)
   - Download the latest `click-ai-vX.X.X.zip` file

2. **Extract the ZIP File**
   - Right-click the downloaded file and select "Extract All..." (Windows) or double-click (macOS)
   - Remember the location of the extracted folder

3. **Open Extension Management Page**
   - **Chrome:** Navigate to `chrome://extensions`
   - **Edge:** Navigate to `edge://extensions`
   - Or click the puzzle icon (🧩) → "Manage Extensions"

4. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

   ![Enable Developer Mode](docs/images/install-step-1.png)

5. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to and select the extracted folder from step 2
   - Click "Select Folder"

6. **Verify Installation**
   - You should see "Click AI" appear in your extensions list
   - The Click AI icon should appear in your browser toolbar

   ![Installed Extension](docs/images/install-step-2.png)

7. **Pin the Extension (Optional)**
   - Click the puzzle icon (🧩) in the toolbar
   - Find "Click AI" and click the pin icon to keep it visible

#### Method 2: Build from Source

See [Development](#development) section below.

### Updating the Extension

When a new version is released:

1. **Download the New Version**
   - Visit the [Releases Page](https://github.com/username/click-ai/releases/latest)
   - Download the latest `click-ai-vX.X.X.zip`

2. **Remove Old Version (Optional)**
   - Go to `chrome://extensions` or `edge://extensions`
   - Find "Click AI" and click "Remove"

3. **Install New Version**
   - Follow the installation steps above

**Tip:** The extension will notify you when a new version is available via a badge on the icon!

---

## Usage

### Getting Started

1. **Open the Sidebar**
   - Click the Click AI icon in your browser toolbar
   - The sidebar will slide open on the right side of your browser

2. **Start Chatting**
   - Type your message in the input box at the bottom
   - Press `Enter` to send (or `Shift+Enter` for a new line)
   - Watch as the AI responds in real-time with streaming text

### Using Context Menu Tools

1. **Select Text**
   - Highlight any text on a web page

2. **Right-Click**
   - Choose "Click AI" from the context menu
   - Select the tool you need:
     - **Grammar Correction:** Fix grammatical errors
     - **Translation:** Translate to/from Korean and English
     - **Expression Refinement:** Improve phrasing and style

3. **Review Results**
   - A popover will appear showing the original and improved text
   - Changes are highlighted in red (deleted) and green (added)
   - Click "Copy" to copy the result to your clipboard
   - Or click "Edit in Sidebar" to continue refining in the chat

### Chat with Page

1. **Enable Chat with Page**
   - Open the sidebar
   - Toggle the "Chat with Page" switch above the input box

2. **Wait for Parsing**
   - The extension will analyze the current page (2-3 seconds)
   - You'll see a notification: "Page content analyzed (approx. X words)"

3. **Ask Questions**
   - Your messages will now include the page content as context
   - Example prompts:
     - "Summarize this article in 3 bullet points"
     - "What are the main arguments in this blog post?"
     - "Translate this page to Korean"
     - "Find all email addresses mentioned"

### Managing Chat History

1. **Create a New Chat**
   - Click the "+" (New Chat) button in the sidebar header
   - Your current conversation will be saved automatically

2. **View History**
   - Click the history icon (📋) in the sidebar header
   - Browse all your past conversations
   - Click any session to resume that conversation

3. **Delete or Export Sessions**
   - Click the "..." menu on any session in the history view
   - Choose "Delete" to remove it or "Export" to save as JSON

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Shift + Enter` | New line in input |
| `Ctrl/Cmd + K` | Open sidebar (configurable) |
| `Esc` | Close popover/modal |

---

## Development

### Prerequisites

- **Node.js:** v18+ (recommend v20 LTS)
- **npm:** v9+ (or pnpm, yarn)
- **Git:** Latest version

### Tech Stack

- **Frontend:** React 18 + TypeScript
- **State Management:** Zustand
- **Styling:** TailwindCSS
- **Build Tool:** Vite
- **Markdown Rendering:** react-markdown + remark-gfm
- **Code Highlighting:** prism-react-renderer
- **Diff Comparison:** diff-match-patch
- **Page Parsing:** @mozilla/readability

### Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/username/click-ai.git
   cd click-ai
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your LLM API credentials:
   ```env
   VITE_LLM_ENDPOINT=https://api.openai.com/v1
   VITE_LLM_API_KEY=sk-your-api-key-here
   VITE_LLM_MODEL=gpt-4
   VITE_GITHUB_REPO=username/click-ai
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

   This will:
   - Start Vite dev server with HMR (Hot Module Replacement)
   - Watch for file changes
   - Output to `dist/` folder

5. **Load Extension in Browser**
   - Open `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist/` folder
   - The extension will auto-reload on code changes!

### Build for Production

```bash
npm run build
```

This will create an optimized production build in `dist/` and generate `click-ai-vX.X.X.zip` for distribution.

### Project Structure

```
click-ai/
├── public/
│   ├── manifest.json          # Chrome Extension Manifest V3
│   ├── icons/                 # Extension icons (16x16, 48x48, 128x128)
│   └── _locales/              # Internationalization
│       ├── en/messages.json
│       └── ko/messages.json
├── src/
│   ├── background/            # Service Worker (background script)
│   │   ├── index.ts           # Main entry point
│   │   ├── llm-client.ts      # LLM API client with streaming
│   │   ├── storage.ts         # Chrome storage abstraction
│   │   └── update-checker.ts  # GitHub release checker
│   ├── content/               # Content scripts (injected into web pages)
│   │   ├── index.ts           # Content script entry
│   │   ├── parser.ts          # Page content parser (Readability)
│   │   ├── popover.tsx        # Context menu result popover
│   │   └── styles.css         # Content script styles
│   ├── sidepanel/             # Sidebar UI
│   │   ├── App.tsx            # Main app component
│   │   ├── components/        # React components
│   │   │   ├── Header.tsx
│   │   │   ├── ChatView.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── HistoryView.tsx
│   │   │   └── SettingsView.tsx
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useChat.ts
│   │   │   └── useStorage.ts
│   │   ├── store/             # Zustand state management
│   │   │   └── chatStore.ts
│   │   └── index.html         # Sidebar HTML entry
│   ├── fullmode/              # Full mode (new tab)
│   │   ├── App.tsx
│   │   └── index.html
│   ├── shared/                # Shared utilities
│   │   ├── types.ts           # TypeScript interfaces
│   │   ├── constants.ts       # Constants
│   │   ├── utils.ts           # Utility functions
│   │   └── i18n.ts            # Internationalization helpers
│   └── styles/
│       └── global.css         # Global styles (Tailwind)
├── tests/
│   ├── unit/                  # Jest unit tests
│   ├── integration/           # Integration tests
│   └── e2e/                   # Playwright E2E tests
├── docs/                      # Documentation and images
├── .env.example               # Example environment variables
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── README.md                  # This file
├── README_KO.md               # Korean README
├── SRS.md                     # Software Requirements Specification
├── BLUEPRINT.md               # Architecture Blueprint
├── TODO.md                    # Development Roadmap
└── CHANGELOG.md               # Version history
```

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with HMR
npm run build            # Production build
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format code with Prettier
npm run type-check       # TypeScript type checking

# Testing
npm run test             # Run all tests
npm run test:unit        # Run unit tests
npm run test:integration # Run integration tests
npm run test:e2e         # Run E2E tests
npm run test:coverage    # Generate coverage report

# Release
npm run release          # Create a new release (bumps version, builds, creates zip)
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# LLM API Configuration
VITE_LLM_ENDPOINT=https://api.openai.com/v1
VITE_LLM_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_LLM_MODEL=gpt-4

# GitHub Configuration (for update checks)
VITE_GITHUB_REPO=username/click-ai

# Development Settings
VITE_DEV_MODE=true
VITE_LOG_LEVEL=debug
```

**Security Note:** Never commit `.env` to version control! Use `.env.example` as a template.

---

## Architecture

For a detailed architecture overview, see [BLUEPRINT.md](BLUEPRINT.md).

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser UI                            │
│  ┌───────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  Side Panel   │  │ Context Menu │  │ Full Mode (Tab) │  │
│  │   (React)     │  │   Popover    │  │     (React)     │  │
│  └───────┬───────┘  └──────┬───────┘  └────────┬────────┘  │
│          │                  │                    │            │
│          └──────────────────┴────────────────────┘            │
│                             ↓                                 │
│                      Service Worker                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  - Message Router                                      │  │
│  │  - LLM API Client (Streaming)                         │  │
│  │  - Storage Manager                                     │  │
│  │  - Update Checker                                      │  │
│  └─────────────────────────┬─────────────────────────────┘  │
│                             ↓                                 │
│                     Content Script                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  - Page Content Parser                                 │  │
│  │  - Context Menu Handler                                │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                             ↕
                      LLM API (OpenAI-compatible)
```

### Key Design Decisions

1. **Manifest V3:** Future-proof extension using Service Workers instead of background pages
2. **React + TypeScript:** Type-safe, component-based UI development
3. **Vite:** Lightning-fast builds and HMR for excellent DX
4. **TailwindCSS:** Utility-first CSS for rapid, consistent styling
5. **Local Storage:** All chat history stored locally for privacy (chrome.storage.local)
6. **Streaming API:** Real-time LLM responses for better UX

---

## Contributing

We welcome contributions! Please follow these guidelines:

### Reporting Issues

- Use the [GitHub Issues](https://github.com/username/click-ai/issues) page
- Provide a clear title and description
- Include steps to reproduce the issue
- Add screenshots if applicable
- Specify your browser version and OS

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes following our code style
4. Add tests for new functionality
5. Ensure all tests pass: `npm run test`
6. Commit with descriptive messages: `git commit -m "feat: add new feature"`
7. Push to your fork: `git push origin feature/my-feature`
8. Open a Pull Request with a clear description

### Code Style

- **TypeScript:** Use strict mode, avoid `any` types
- **React:** Functional components with hooks
- **Naming:**
  - Components: PascalCase (e.g., `ChatView.tsx`)
  - Functions: camelCase (e.g., `handleMessage`)
  - Constants: UPPER_SNAKE_CASE (e.g., `MAX_TOKEN_LIMIT`)
- **Formatting:** Run `npm run format` before committing
- **Linting:** Fix all ESLint warnings

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: restructure code
test: add tests
chore: update dependencies
```

---

## Troubleshooting

### Extension Not Loading

**Problem:** "Load unpacked" fails or extension doesn't appear

**Solutions:**
1. Ensure you've extracted the ZIP file (don't load the ZIP directly)
2. Verify you selected the correct folder containing `manifest.json`
3. Check Developer mode is enabled
4. Try restarting the browser

### API Key Errors

**Problem:** "API key is invalid" or no responses from AI

**Solutions:**
1. Verify your `.env` file has the correct `VITE_LLM_API_KEY`
2. Check the API key hasn't expired
3. Ensure your LLM endpoint is correct (`VITE_LLM_ENDPOINT`)
4. Rebuild the extension after changing `.env`: `npm run build`

### Chat with Page Not Working

**Problem:** "Page content could not be parsed" error

**Solutions:**
1. Some pages have protection against content extraction (e.g., paywalls)
2. Try refreshing the page before toggling "Chat with Page"
3. Check browser console (F12) for detailed error messages
4. Ensure the page has sufficient text content (minimum 100 characters)

### Context Menu Not Appearing

**Problem:** Right-click menu doesn't show "Click AI"

**Solutions:**
1. Reload the extension: Go to `chrome://extensions` → Click reload icon
2. Refresh the web page you're testing on
3. Check if text is actually selected before right-clicking
4. Verify the extension has `contextMenus` permission in `manifest.json`

### Sidebar UI Issues

**Problem:** Sidebar appears blank or doesn't open

**Solutions:**
1. Check browser console for JavaScript errors
2. Disable conflicting extensions temporarily
3. Clear browser cache and reload the extension
4. Ensure your browser meets minimum version requirements (Chrome/Edge 109+)

### Performance Issues

**Problem:** Extension slows down the browser

**Solutions:**
1. Clear old chat history: Settings → Data Management → Delete Old Chats
2. Disable "Chat with Page" when not needed (it parses pages continuously)
3. Check `chrome://extensions` → "Inspect views: service worker" for memory usage
4. Report the issue with details if it persists

### Update Notification Not Working

**Problem:** Extension doesn't notify about new versions

**Solutions:**
1. Verify `VITE_GITHUB_REPO` is set correctly in `.env`
2. Check internet connection (update check requires network)
3. Update check runs every 24 hours; wait or restart the browser
4. Manually check [Releases Page](https://github.com/username/click-ai/releases)

---

## FAQ

### Is my data sent to external servers?

No, all chat history is stored locally in your browser using `chrome.storage.local`. The only external communication is with the LLM API when you send messages. Page content is only sent when you explicitly enable "Chat with Page."

### Does this work offline?

No, Click AI requires an internet connection to communicate with the LLM API. However, you can browse your chat history offline.

### Which LLM models are supported?

Click AI supports any OpenAI-compatible API endpoint. By default, it's configured for OpenAI's GPT models (GPT-3.5, GPT-4), but you can configure it to use:
- Azure OpenAI Service
- Local LLMs with OpenAI-compatible APIs (e.g., LocalAI, Ollama with openai-adapter)
- Other cloud providers (Anthropic Claude, Google PaLM with adapters)

### Can I use this with my own LLM API?

Yes! Just set `VITE_LLM_ENDPOINT` and `VITE_LLM_API_KEY` in your `.env` file before building the extension.

### Why isn't this on the Chrome Web Store?

Click AI is designed for internal/private deployment. Publishing to the Chrome Web Store requires public review and ongoing maintenance. For organizational use, manual distribution via GitHub Releases is more flexible.

### How do I request a new feature?

Open an issue on [GitHub Issues](https://github.com/username/click-ai/issues) with the "feature request" label. Describe your use case and why it would be valuable.

### Can I customize the prompts for context menu tools?

Currently, prompts are hardcoded for consistency. However, we're planning a "Custom Prompts" feature in a future release. Stay tuned or contribute!

### How much does this cost to use?

The extension itself is free and open-source. However, you'll need an LLM API key (e.g., OpenAI), which has usage-based pricing. Check your provider's pricing page for details.

### Does this work on mobile browsers?

No, browser extensions are not supported on mobile Chrome/Edge. This is a limitation of mobile browsers, not Click AI.

### How do I uninstall Click AI?

1. Go to `chrome://extensions` or `edge://extensions`
2. Find "Click AI"
3. Click "Remove"
4. Confirm the uninstallation

Your chat history will be deleted automatically when you uninstall.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Third-Party Licenses

Click AI uses the following open-source libraries:

- [React](https://github.com/facebook/react) - MIT License
- [TypeScript](https://github.com/microsoft/TypeScript) - Apache 2.0 License
- [Vite](https://github.com/vitejs/vite) - MIT License
- [TailwindCSS](https://github.com/tailwindlabs/tailwindcss) - MIT License
- [react-markdown](https://github.com/remarkjs/react-markdown) - MIT License
- [prism-react-renderer](https://github.com/FormidableLabs/prism-react-renderer) - MIT License
- [diff-match-patch](https://github.com/google/diff-match-patch) - Apache 2.0 License
- [Readability.js](https://github.com/mozilla/readability) - Apache 2.0 License
- [Zustand](https://github.com/pmndrs/zustand) - MIT License

Full license texts are available in the `LICENSES/` directory.

---

## Acknowledgments

- Inspired by [Google Gemini](https://gemini.google.com/) for UI/UX design
- [Mozilla Readability](https://github.com/mozilla/readability) for excellent page parsing
- [OpenAI](https://openai.com/) for their powerful LLM APIs
- All contributors and users who provide feedback and suggestions

---

## Contact

- **GitHub Issues:** [https://github.com/username/click-ai/issues](https://github.com/username/click-ai/issues)
- **Email:** contact@example.com
- **Website:** [https://clickai.example.com](https://clickai.example.com)

---

## Roadmap

See [TODO.md](TODO.md) for the full development roadmap. Upcoming features:

- [ ] RAG (Retrieval-Augmented Generation) for better "Chat with Page"
- [ ] Voice input support (Web Speech API)
- [ ] Custom prompt templates
- [ ] Multi-LLM provider support (Claude, PaLM)
- [ ] Browser action keyboard shortcuts
- [ ] Export chat history to Markdown/PDF
- [ ] Collaborative chat sessions (multi-device sync)

---

**Made with ❤️ by the Click AI Team**

**Star ⭐ this repo if you find it useful!**
