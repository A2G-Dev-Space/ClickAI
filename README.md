# Click AI

> 웹 브라우징과 콘텐츠 작성을 향상시키는 AI 기반 브라우저 확장 프로그램

![Click AI 배너](docs/images/banner.png)

[![버전](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/username/click-ai/releases)
[![라이선스](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Chrome](https://img.shields.io/badge/Chrome-109+-yellow.svg)](https://www.google.com/chrome/)
[![Edge](https://img.shields.io/badge/Edge-109+-blue.svg)](https://www.microsoft.com/edge)

한국어 | [English](README.md)

---

## 목차

- [개요](#개요)
- [주요 기능](#주요-기능)
- [스크린샷](#스크린샷)
- [설치 방법](#설치-방법)
- [사용 방법](#사용-방법)
- [개발 가이드](#개발-가이드)
- [아키텍처](#아키텍처)
- [기여하기](#기여하기)
- [문제 해결](#문제-해결)
- [자주 묻는 질문](#자주-묻는-질문)
- [라이선스](#라이선스)

---

## 개요

**Click AI**는 Chrome/Edge 브라우저에 AI 기능을 완벽하게 통합하는 강력한 확장 프로그램입니다. 우아한 사이드바 채팅 인터페이스, 상황 인식 페이지 분석, 즉각적인 텍스트 유틸리티(문법 교정, 번역, 표현 개선)를 통해 웹 콘텐츠와의 상호작용 방식을 혁신합니다.

### Click AI를 선택해야 하는 이유

- **항상 사용 가능:** 모든 웹 페이지에서 사이드바를 통해 AI 채팅 접근
- **상황 인식:** "Chat with Page" 기능으로 현재 웹 페이지 분석 및 토론
- **즉각적인 텍스트 도구:** 선택한 텍스트를 우클릭하여 문법 수정, 번역, 스타일 개선
- **프라이버시 우선:** 모든 채팅 기록이 브라우저에 로컬로 저장됨
- **아름다운 UI:** Google Gemini에서 영감을 받은 미니멀 디자인
- **다크 모드:** 완전한 다크 테마 지원으로 눈의 피로 감소

---

## 주요 기능

### 1. 사이드바 AI 채팅

- **지속적인 채팅 인터페이스:** 모든 웹 페이지에서 항상 접근 가능
- **스트리밍 응답:** 실시간 텍스트 생성으로 즉각적인 피드백
- **풀 모드:** 전용 전체 화면 채팅 인터페이스로 확장
- **채팅 기록:** 모든 대화가 로컬에 저장되며 언제든지 재개 가능
- **마크다운 지원:** 구문 강조 코드 블록을 포함한 풍부한 텍스트 렌더링

![사이드바 채팅](docs/images/sidebar-chat.png)

### 2. 컨텍스트 메뉴 텍스트 유틸리티

선택한 텍스트를 우클릭하여 강력한 AI 도구에 접근하세요:

#### 문법 교정
- 언어 자동 감지 (한국어/영어)
- 의미를 보존하면서 문법 오류 수정
- 변경 사항의 명확한 차이 보기

#### 번역
- 한국어 ↔ 영어 자동 번역
- 원문을 괄호 안에 표시하여 전문 용어 보존
- 자연스럽고 문맥을 고려한 번역

#### 표현 다듬기
- 어색한 표현 및 가독성 개선
- 전문성을 높이면서 원래 의미 유지
- 언어별 다듬기 (한국어는 한국어로, 영어는 영어로 유지)

![컨텍스트 메뉴](docs/images/context-menu.png)

### 3. Chat with Page

- **원클릭 페이지 분석:** 토글하여 현재 페이지 내용을 대화에 포함
- **스마트 파싱:** Readability.js 알고리즘을 사용한 주요 콘텐츠 추출
- **토큰 관리:** LLM 컨텍스트 제한 내에 맞도록 긴 페이지 자동 처리
- **사용 사례:**
  - 긴 기사 요약
  - 문서에 대한 질문
  - 전체 블로그 게시물 번역
  - 웹 페이지에서 특정 정보 추출

![Chat with Page](docs/images/chat-with-page.png)

### 4. 아름다운 차이 보기

- **Git 스타일 비교:** 삭제된 텍스트는 빨간색 취소선, 추가된 텍스트는 녹색 밑줄
- **명확한 시각화:** 원본과 AI 개선 텍스트 간의 변경 사항을 즉시 확인
- **복사 및 편집:** 원클릭 복사 또는 추가 개선을 위해 사이드바로 전송

![차이 보기](docs/images/diff-view.png)

### 5. 채팅 기록 관리

- **자동 저장:** 모든 대화가 로컬에 저장됨
- **세션 관리:** 새 채팅 생성, 기록 보기, 이전 대화 재개
- **스마트 제목:** 대화 내용을 기반으로 자동 생성된 제목
- **내보내기/가져오기:** 채팅 기록을 JSON 파일로 백업

### 6. 사용자 정의

- **테마:** 라이트, 다크 또는 시스템 (OS 설정 따름)
- **언어:** 한국어 및 영어 UI
- **조절 가능한 사이드바:** 250px - 800px 사이로 드래그하여 크기 조절
- **설정 동기화:** Chrome/Edge 계정을 통해 기기 간 설정 동기화

---

## 스크린샷

<table>
  <tr>
    <td width="50%">
      <img src="docs/images/screenshot-1.png" alt="사이드바 채팅">
      <p align="center"><em>사이드바 채팅 인터페이스</em></p>
    </td>
    <td width="50%">
      <img src="docs/images/screenshot-2.png" alt="풀 모드">
      <p align="center"><em>풀 모드</em></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="docs/images/screenshot-3.png" alt="컨텍스트 메뉴">
      <p align="center"><em>컨텍스트 메뉴 유틸리티</em></p>
    </td>
    <td width="50%">
      <img src="docs/images/screenshot-4.png" alt="다크 모드">
      <p align="center"><em>다크 모드</em></p>
    </td>
  </tr>
</table>

---

## 설치 방법

### 사전 요구사항

- **브라우저:** Google Chrome (v109+) 또는 Microsoft Edge (v109+)
- **운영 체제:** Windows 10/11, macOS 11+ 또는 Linux (Ubuntu 20.04+)
- **인터넷 연결:** LLM API 호출에 필요

### 단계별 설치 가이드

#### 방법 1: GitHub 릴리즈에서 설치 (권장)

1. **확장 프로그램 다운로드**
   - [릴리즈 페이지](https://github.com/username/click-ai/releases/latest)로 이동
   - 최신 `click-ai-vX.X.X.zip` 파일 다운로드

2. **ZIP 파일 압축 해제**
   - 다운로드한 파일을 우클릭하고 "모두 압축 풀기..." 선택 (Windows) 또는 더블 클릭 (macOS)
   - 압축 해제된 폴더의 위치 기억

3. **확장 프로그램 관리 페이지 열기**
   - **Chrome:** `chrome://extensions`로 이동
   - **Edge:** `edge://extensions`로 이동
   - 또는 퍼즐 아이콘 (🧩) → "확장 프로그램 관리" 클릭

4. **개발자 모드 활성화**
   - 오른쪽 상단의 "개발자 모드" 스위치 토글

   ![개발자 모드 활성화](docs/images/install-step-1.png)

5. **확장 프로그램 로드**
   - "압축해제된 확장 프로그램을 로드합니다" 버튼 클릭
   - 2단계에서 압축 해제한 폴더로 이동하여 선택
   - "폴더 선택" 클릭

6. **설치 확인**
   - 확장 프로그램 목록에 "Click AI"가 표시되어야 함
   - 브라우저 툴바에 Click AI 아이콘이 표시되어야 함

   ![설치된 확장 프로그램](docs/images/install-step-2.png)

7. **확장 프로그램 고정 (선택사항)**
   - 툴바의 퍼즐 아이콘 (🧩) 클릭
   - "Click AI"를 찾아 고정 아이콘을 클릭하여 표시 유지

#### 방법 2: 소스에서 빌드

아래 [개발 가이드](#개발-가이드) 섹션 참조

### 확장 프로그램 업데이트

새 버전이 출시되면:

1. **새 버전 다운로드**
   - [릴리즈 페이지](https://github.com/username/click-ai/releases/latest) 방문
   - 최신 `click-ai-vX.X.X.zip` 다운로드

2. **이전 버전 제거 (선택사항)**
   - `chrome://extensions` 또는 `edge://extensions`로 이동
   - "Click AI"를 찾아 "제거" 클릭

3. **새 버전 설치**
   - 위의 설치 단계를 따름

**팁:** 확장 프로그램은 아이콘에 배지를 통해 새 버전이 있음을 알려줍니다!

---

## 사용 방법

### 시작하기

1. **사이드바 열기**
   - 브라우저 툴바에서 Click AI 아이콘 클릭
   - 사이드바가 브라우저 오른쪽에서 슬라이드로 열림

2. **채팅 시작**
   - 하단의 입력 상자에 메시지 입력
   - `Enter`를 눌러 전송 (또는 `Shift+Enter`로 줄바꿈)
   - AI가 스트리밍 텍스트로 실시간 응답하는 것을 확인

### 컨텍스트 메뉴 도구 사용

1. **텍스트 선택**
   - 웹 페이지에서 텍스트 강조 표시

2. **우클릭**
   - 컨텍스트 메뉴에서 "Click AI" 선택
   - 필요한 도구 선택:
     - **문법 교정:** 문법 오류 수정
     - **번역:** 한국어/영어 간 번역
     - **표현 다듬기:** 표현 및 스타일 개선

3. **결과 확인**
   - 원본 및 개선된 텍스트를 보여주는 팝오버가 표시됨
   - 변경 사항이 빨간색(삭제)과 녹색(추가)으로 강조 표시됨
   - "복사"를 클릭하여 결과를 클립보드에 복사
   - 또는 "사이드바에서 편집"을 클릭하여 채팅에서 계속 다듬기

### Chat with Page

1. **Chat with Page 활성화**
   - 사이드바 열기
   - 입력 상자 위의 "Chat with Page" 스위치 토글

2. **파싱 대기**
   - 확장 프로그램이 현재 페이지를 분석 (2-3초)
   - 알림 표시: "페이지 콘텐츠 분석됨 (약 X단어)"

3. **질문하기**
   - 이제 메시지에 페이지 내용이 컨텍스트로 포함됨
   - 예시 프롬프트:
     - "이 기사를 3개의 요점으로 요약해줘"
     - "이 블로그 게시물의 주요 논점은 무엇인가요?"
     - "이 페이지를 한국어로 번역해줘"
     - "언급된 모든 이메일 주소를 찾아줘"

### 채팅 기록 관리

1. **새 채팅 만들기**
   - 사이드바 헤더에서 "+" (새 채팅) 버튼 클릭
   - 현재 대화가 자동으로 저장됨

2. **기록 보기**
   - 사이드바 헤더에서 기록 아이콘 (📋) 클릭
   - 모든 과거 대화 탐색
   - 세션을 클릭하여 해당 대화 재개

3. **세션 삭제 또는 내보내기**
   - 기록 보기에서 세션의 "..." 메뉴 클릭
   - "삭제"를 선택하여 제거하거나 "내보내기"를 선택하여 JSON으로 저장

### 키보드 단축키

| 단축키 | 동작 |
|----------|--------|
| `Enter` | 메시지 전송 |
| `Shift + Enter` | 입력에서 줄바꿈 |
| `Ctrl/Cmd + K` | 사이드바 열기 (설정 가능) |
| `Esc` | 팝오버/모달 닫기 |

---

## 개발 가이드

### 사전 요구사항

- **Node.js:** v18+ (v20 LTS 권장)
- **npm:** v9+ (또는 pnpm, yarn)
- **Git:** 최신 버전

### 기술 스택

- **프론트엔드:** React 18 + TypeScript
- **상태 관리:** Zustand
- **스타일링:** TailwindCSS
- **빌드 도구:** Vite
- **마크다운 렌더링:** react-markdown + remark-gfm
- **코드 강조:** prism-react-renderer
- **차이 비교:** diff-match-patch
- **페이지 파싱:** @mozilla/readability

### 시작하기

1. **저장소 복제**
   ```bash
   git clone https://github.com/username/click-ai.git
   cd click-ai
   ```

2. **종속성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   ```bash
   cp .env.example .env
   ```

   `.env`를 편집하고 LLM API 자격 증명 추가:
   ```env
   VITE_LLM_ENDPOINT=https://api.openai.com/v1
   VITE_LLM_API_KEY=sk-your-api-key-here
   VITE_LLM_MODEL=gpt-4
   VITE_GITHUB_REPO=username/click-ai
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```

   다음이 수행됩니다:
   - HMR(Hot Module Replacement)로 Vite 개발 서버 시작
   - 파일 변경 감시
   - `dist/` 폴더로 출력

5. **브라우저에서 확장 프로그램 로드**
   - `chrome://extensions` 열기
   - "개발자 모드" 활성화
   - "압축해제된 확장 프로그램을 로드합니다" 클릭
   - `dist/` 폴더 선택
   - 코드 변경 시 확장 프로그램이 자동으로 다시 로드됩니다!

### 프로덕션 빌드

```bash
npm run build
```

이것은 `dist/`에 최적화된 프로덕션 빌드를 생성하고 배포용 `click-ai-vX.X.X.zip`을 생성합니다.

### 프로젝트 구조

```
click-ai/
├── public/
│   ├── manifest.json          # Chrome Extension Manifest V3
│   ├── icons/                 # 확장 프로그램 아이콘 (16x16, 48x48, 128x128)
│   └── _locales/              # 국제화
│       ├── en/messages.json
│       └── ko/messages.json
├── src/
│   ├── background/            # Service Worker (백그라운드 스크립트)
│   │   ├── index.ts           # 주 진입점
│   │   ├── llm-client.ts      # 스트리밍 LLM API 클라이언트
│   │   ├── storage.ts         # Chrome 스토리지 추상화
│   │   └── update-checker.ts  # GitHub 릴리즈 체커
│   ├── content/               # 콘텐츠 스크립트 (웹 페이지에 주입)
│   │   ├── index.ts           # 콘텐츠 스크립트 진입점
│   │   ├── parser.ts          # 페이지 콘텐츠 파서 (Readability)
│   │   ├── popover.tsx        # 컨텍스트 메뉴 결과 팝오버
│   │   └── styles.css         # 콘텐츠 스크립트 스타일
│   ├── sidepanel/             # 사이드바 UI
│   │   ├── App.tsx            # 메인 앱 컴포넌트
│   │   ├── components/        # React 컴포넌트
│   │   │   ├── Header.tsx
│   │   │   ├── ChatView.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── HistoryView.tsx
│   │   │   └── SettingsView.tsx
│   │   ├── hooks/             # 커스텀 React 훅
│   │   │   ├── useChat.ts
│   │   │   └── useStorage.ts
│   │   ├── store/             # Zustand 상태 관리
│   │   │   └── chatStore.ts
│   │   └── index.html         # 사이드바 HTML 진입점
│   ├── fullmode/              # 풀 모드 (새 탭)
│   │   ├── App.tsx
│   │   └── index.html
│   ├── shared/                # 공유 유틸리티
│   │   ├── types.ts           # TypeScript 인터페이스
│   │   ├── constants.ts       # 상수
│   │   ├── utils.ts           # 유틸리티 함수
│   │   └── i18n.ts            # 국제화 헬퍼
│   └── styles/
│       └── global.css         # 전역 스타일 (Tailwind)
├── tests/
│   ├── unit/                  # Jest 단위 테스트
│   ├── integration/           # 통합 테스트
│   └── e2e/                   # Playwright E2E 테스트
├── docs/                      # 문서 및 이미지
├── .env.example               # 환경 변수 예시
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts             # Vite 구성
├── tailwind.config.js         # Tailwind CSS 구성
├── README.md                  # 영문 README
├── README_KO.md               # 이 파일
├── SRS.md                     # 소프트웨어 요구 명세서
├── BLUEPRINT.md               # 아키텍처 블루프린트
├── TODO.md                    # 개발 로드맵
└── CHANGELOG.md               # 버전 히스토리
```

### 사용 가능한 스크립트

```bash
# 개발
npm run dev              # HMR로 개발 서버 시작
npm run build            # 프로덕션 빌드
npm run preview          # 프로덕션 빌드 미리보기

# 코드 품질
npm run lint             # ESLint 실행
npm run lint:fix         # ESLint 오류 수정
npm run format           # Prettier로 코드 포맷

# 테스트
npm test                 # Jest로 모든 테스트 실행 (56 tests passing)
npm run test:watch       # 감시 모드로 테스트 실행
npm run test:coverage    # 커버리지 보고서와 함께 테스트 실행
```

### 환경 변수

루트 디렉토리에 `.env` 파일 생성:

```env
# LLM API 구성
VITE_LLM_ENDPOINT=https://api.openai.com/v1
VITE_LLM_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_LLM_MODEL=gpt-4

# GitHub 구성 (업데이트 확인용)
VITE_GITHUB_REPO=username/click-ai

# 개발 설정
VITE_DEV_MODE=true
VITE_LOG_LEVEL=debug
```

**보안 참고:** `.env`를 절대로 버전 관리에 커밋하지 마세요! `.env.example`을 템플릿으로 사용하세요.

---

## 아키텍처

자세한 아키텍처 개요는 [BLUEPRINT.md](BLUEPRINT.md)를 참조하세요.

### 상위 개요

```
┌─────────────────────────────────────────────────────────────┐
│                        브라우저 UI                           │
│  ┌───────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  사이드 패널  │  │ 컨텍스트 메뉴│  │  풀 모드 (탭)   │  │
│  │   (React)     │  │   팝오버     │  │     (React)     │  │
│  └───────┬───────┘  └──────┬───────┘  └────────┬────────┘  │
│          │                  │                    │            │
│          └──────────────────┴────────────────────┘            │
│                             ↓                                 │
│                      Service Worker                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  - 메시지 라우터                                       │  │
│  │  - LLM API 클라이언트 (스트리밍)                      │  │
│  │  - 스토리지 관리자                                     │  │
│  │  - 업데이트 체커                                       │  │
│  └─────────────────────────┬─────────────────────────────┘  │
│                             ↓                                 │
│                     Content Script                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  - 페이지 콘텐츠 파서                                  │  │
│  │  - 컨텍스트 메뉴 핸들러                                │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                             ↕
                      LLM API (OpenAI 호환)
```

### 주요 설계 결정

1. **Manifest V3:** 백그라운드 페이지 대신 Service Worker를 사용하는 미래 지향적 확장 프로그램
2. **React + TypeScript:** 타입 안전, 컴포넌트 기반 UI 개발
3. **Vite:** 번개처럼 빠른 빌드 및 우수한 개발자 경험을 위한 HMR
4. **TailwindCSS:** 빠르고 일관된 스타일링을 위한 유틸리티 우선 CSS
5. **로컬 스토리지:** 프라이버시를 위해 모든 채팅 기록을 로컬에 저장 (chrome.storage.local)
6. **스트리밍 API:** 더 나은 UX를 위한 실시간 LLM 응답

---

## 기여하기

기여를 환영합니다! 다음 가이드라인을 따라주세요:

### 이슈 보고

- [GitHub Issues](https://github.com/username/click-ai/issues) 페이지 사용
- 명확한 제목과 설명 제공
- 문제 재현 단계 포함
- 해당되는 경우 스크린샷 추가
- 브라우저 버전 및 OS 명시

### Pull Request

1. 저장소 포크
2. 기능 브랜치 생성: `git checkout -b feature/my-feature`
3. 코드 스타일을 따라 변경 사항 작성
4. 새로운 기능에 대한 테스트 추가
5. 모든 테스트 통과 확인: `npm run test`
6. 설명적인 메시지로 커밋: `git commit -m "feat: add new feature"`
7. 포크에 푸시: `git push origin feature/my-feature`
8. 명확한 설명과 함께 Pull Request 열기

### 코드 스타일

- **TypeScript:** 엄격 모드 사용, `any` 타입 피하기
- **React:** 훅을 사용하는 함수형 컴포넌트
- **네이밍:**
  - 컴포넌트: PascalCase (예: `ChatView.tsx`)
  - 함수: camelCase (예: `handleMessage`)
  - 상수: UPPER_SNAKE_CASE (예: `MAX_TOKEN_LIMIT`)
- **포맷팅:** 커밋 전에 `npm run format` 실행
- **린팅:** 모든 ESLint 경고 수정

### 커밋 메시지 규칙

[Conventional Commits](https://www.conventionalcommits.org/)을 따릅니다:

```
feat: 새 기능 추가
fix: 버그 해결
docs: 문서 업데이트
style: 코드 포맷
refactor: 코드 재구조화
test: 테스트 추가
chore: 종속성 업데이트
```

---

## 문제 해결

### 확장 프로그램이 로드되지 않음

**문제:** "압축 해제된 확장 프로그램 로드" 실패 또는 확장 프로그램이 표시되지 않음

**해결 방법:**
1. ZIP 파일을 압축 해제했는지 확인 (ZIP을 직접 로드하지 마세요)
2. `manifest.json`이 포함된 올바른 폴더를 선택했는지 확인
3. 개발자 모드가 활성화되어 있는지 확인
4. 브라우저 재시작 시도

### API 키 오류

**문제:** "API 키가 유효하지 않음" 또는 AI 응답 없음

**해결 방법:**
1. `.env` 파일에 올바른 `VITE_LLM_API_KEY`가 있는지 확인
2. API 키가 만료되지 않았는지 확인
3. LLM 엔드포인트가 올바른지 확인 (`VITE_LLM_ENDPOINT`)
4. `.env` 변경 후 확장 프로그램 재빌드: `npm run build`

### Chat with Page가 작동하지 않음

**문제:** "페이지 콘텐츠를 파싱할 수 없습니다" 오류

**해결 방법:**
1. 일부 페이지는 콘텐츠 추출에 대한 보호 기능이 있음 (예: 페이월)
2. "Chat with Page" 토글 전에 페이지 새로고침 시도
3. 브라우저 콘솔(F12)에서 자세한 오류 메시지 확인
4. 페이지에 충분한 텍스트 콘텐츠가 있는지 확인 (최소 100자)

### 컨텍스트 메뉴가 표시되지 않음

**문제:** 우클릭 메뉴에 "Click AI"가 표시되지 않음

**해결 방법:**
1. 확장 프로그램 다시 로드: `chrome://extensions`로 이동 → 새로고침 아이콘 클릭
2. 테스트 중인 웹 페이지 새로고침
3. 우클릭하기 전에 텍스트가 실제로 선택되었는지 확인
4. `manifest.json`에서 확장 프로그램에 `contextMenus` 권한이 있는지 확인

### 사이드바 UI 문제

**문제:** 사이드바가 비어 있거나 열리지 않음

**해결 방법:**
1. 브라우저 콘솔에서 JavaScript 오류 확인
2. 충돌하는 확장 프로그램을 일시적으로 비활성화
3. 브라우저 캐시를 지우고 확장 프로그램 다시 로드
4. 브라우저가 최소 버전 요구사항을 충족하는지 확인 (Chrome/Edge 109+)

### 성능 문제

**문제:** 확장 프로그램이 브라우저를 느리게 함

**해결 방법:**
1. 오래된 채팅 기록 삭제: 설정 → 데이터 관리 → 오래된 채팅 삭제
2. 필요하지 않을 때 "Chat with Page" 비활성화 (페이지를 지속적으로 파싱함)
3. `chrome://extensions` → "보기: service worker"에서 메모리 사용량 확인
4. 세부 정보와 함께 문제를 보고하세요

### 업데이트 알림이 작동하지 않음

**문제:** 확장 프로그램이 새 버전을 알리지 않음

**해결 방법:**
1. `.env`에서 `VITE_GITHUB_REPO`가 올바르게 설정되었는지 확인
2. 인터넷 연결 확인 (업데이트 확인에 네트워크 필요)
3. 업데이트 확인은 24시간마다 실행됨; 대기하거나 브라우저 재시작
4. [릴리즈 페이지](https://github.com/username/click-ai/releases) 수동 확인

---

## 자주 묻는 질문

### 내 데이터가 외부 서버로 전송되나요?

아니요, 모든 채팅 기록은 `chrome.storage.local`을 사용하여 브라우저에 로컬로 저장됩니다. 외부 통신은 메시지를 보낼 때 LLM API와만 이루어집니다. 페이지 내용은 "Chat with Page"를 명시적으로 활성화할 때만 전송됩니다.

### 오프라인에서 작동하나요?

아니요, Click AI는 LLM API와 통신하기 위해 인터넷 연결이 필요합니다. 그러나 채팅 기록은 오프라인에서도 탐색할 수 있습니다.

### 어떤 LLM 모델이 지원되나요?

Click AI는 OpenAI 호환 API 엔드포인트를 지원합니다. 기본적으로 OpenAI의 GPT 모델(GPT-3.5, GPT-4)로 구성되어 있지만 다음과 같이 구성할 수 있습니다:
- Azure OpenAI Service
- OpenAI 호환 API를 사용하는 로컬 LLM (예: LocalAI, openai-adapter가 있는 Ollama)
- 기타 클라우드 제공업체 (어댑터가 있는 Anthropic Claude, Google PaLM)

### 자체 LLM API로 사용할 수 있나요?

예! 확장 프로그램을 빌드하기 전에 `.env` 파일에서 `VITE_LLM_ENDPOINT` 및 `VITE_LLM_API_KEY`를 설정하면 됩니다.

### Chrome 웹 스토어에 없는 이유는 무엇인가요?

Click AI는 내부/비공개 배포용으로 설계되었습니다. Chrome 웹 스토어에 게시하려면 공개 검토 및 지속적인 유지 관리가 필요합니다. 조직 사용을 위해 GitHub 릴리즈를 통한 수동 배포가 더 유연합니다.

### 새 기능을 어떻게 요청하나요?

"기능 요청" 레이블로 [GitHub Issues](https://github.com/username/click-ai/issues)에 이슈를 열어주세요. 사용 사례와 가치가 있는 이유를 설명해 주세요.

### 컨텍스트 메뉴 도구의 프롬프트를 사용자 정의할 수 있나요?

현재 프롬프트는 일관성을 위해 하드코딩되어 있습니다. 그러나 향후 릴리즈에서 "사용자 정의 프롬프트" 기능을 계획하고 있습니다. 계속 지켜봐 주시거나 기여해 주세요!

### 사용 비용은 얼마인가요?

확장 프로그램 자체는 무료이며 오픈 소스입니다. 그러나 사용량 기반 가격이 있는 LLM API 키(예: OpenAI)가 필요합니다. 자세한 내용은 제공업체의 가격 페이지를 확인하세요.

### 모바일 브라우저에서 작동하나요?

아니요, 모바일 Chrome/Edge에서는 브라우저 확장 프로그램이 지원되지 않습니다. 이것은 Click AI가 아닌 모바일 브라우저의 제한 사항입니다.

### Click AI를 제거하려면 어떻게 하나요?

1. `chrome://extensions` 또는 `edge://extensions`로 이동
2. "Click AI" 찾기
3. "제거" 클릭
4. 제거 확인

제거 시 채팅 기록이 자동으로 삭제됩니다.

---

## 라이선스

이 프로젝트는 MIT 라이선스에 따라 라이선스가 부여됩니다 - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

### 타사 라이선스

Click AI는 다음 오픈 소스 라이브러리를 사용합니다:

- [React](https://github.com/facebook/react) - MIT 라이선스
- [TypeScript](https://github.com/microsoft/TypeScript) - Apache 2.0 라이선스
- [Vite](https://github.com/vitejs/vite) - MIT 라이선스
- [TailwindCSS](https://github.com/tailwindlabs/tailwindcss) - MIT 라이선스
- [react-markdown](https://github.com/remarkjs/react-markdown) - MIT 라이선스
- [prism-react-renderer](https://github.com/FormidableLabs/prism-react-renderer) - MIT 라이선스
- [diff-match-patch](https://github.com/google/diff-match-patch) - Apache 2.0 라이선스
- [Readability.js](https://github.com/mozilla/readability) - Apache 2.0 라이선스
- [Zustand](https://github.com/pmndrs/zustand) - MIT 라이선스

전체 라이선스 텍스트는 `LICENSES/` 디렉토리에서 확인할 수 있습니다.

---

## 감사의 말

- UI/UX 디자인은 [Google Gemini](https://gemini.google.com/)에서 영감을 받았습니다
- 우수한 페이지 파싱을 위한 [Mozilla Readability](https://github.com/mozilla/readability)
- 강력한 LLM API를 제공하는 [OpenAI](https://openai.com/)
- 피드백과 제안을 제공하는 모든 기여자와 사용자

---

## 연락처

- **GitHub Issues:** [https://github.com/username/click-ai/issues](https://github.com/username/click-ai/issues)
- **이메일:** contact@example.com
- **웹사이트:** [https://clickai.example.com](https://clickai.example.com)

---

## 로드맵

전체 개발 로드맵은 [TODO.md](TODO.md)를 참조하세요. 예정된 기능:

- [ ] 더 나은 "Chat with Page"를 위한 RAG (Retrieval-Augmented Generation)
- [ ] 음성 입력 지원 (Web Speech API)
- [ ] 사용자 정의 프롬프트 템플릿
- [ ] 멀티 LLM 제공업체 지원 (Claude, PaLM)
- [ ] 브라우저 액션 키보드 단축키
- [ ] Markdown/PDF로 채팅 기록 내보내기
- [ ] 협업 채팅 세션 (다중 기기 동기화)

---

**Click AI 팀이 ❤️를 담아 제작했습니다**

**유용하다면 이 저장소에 ⭐ 스타를 눌러주세요!**
