# 소프트웨어 요구 명세서 (SRS): Click AI

**문서 버전:** 1.0.0
**작성일:** 2025-11-04
**프로젝트명:** Click AI (클릭 AI)
**대상 플랫폼:** Google Chrome (Manifest V3), Microsoft Edge (Chromium)

---

## 목차

1. [개요](#1-개요)
2. [전체 시스템 설명](#2-전체-시스템-설명)
3. [세부 요구사항](#3-세부-요구사항)
4. [시스템 아키텍처](#4-시스템-아키텍처)
5. [데이터 모델](#5-데이터-모델)
6. [인터페이스 요구사항](#6-인터페이스-요구사항)
7. [품질 속성](#7-품질-속성)
8. [제약사항](#8-제약사항)
9. [부록](#9-부록)

---

## 1. 개요

### 1.1. 프로젝트 목적

본 문서는 'Click AI' 크롬/Edge 브라우저 익스텐션 개발에 필요한 기능 및 비기능적 요구사항을 정의한다. Click AI는 브라우저 사이드바에 통합된 AI 챗봇, 페이지 컨텍스트 분석, 그리고 선택된 텍스트에 대한 즉각적인 AI 기반 유틸리티(문법 교정, 번역, 표현 다듬기)를 제공하여 사용자의 웹 브라우징 및 콘텐츠 작성 경험을 향상시키는 것을 목적으로 한다.

### 1.2. 프로젝트 범위

**핵심 기능:**
- 사이드바 AI 채팅 (Sidebar Chat)
- 페이지 컨텍스트 채팅 (Chat with Page)
- 컨텍스트 메뉴(우클릭)를 통한 텍스트 AI 기능 3종
  - 문법 교정 (Grammar Correction)
  - 번역 (Translation)
  - 표현 다듬기 (Expression Refinement)

**플랫폼:**
- Google Chrome (Manifest V3)
- Microsoft Edge (Chromium)

**LLM 연동:**
- 환경 변수(Environment)에 설정된 고정 OpenAI 호환 엔드포인트 사용

**배포:**
- 사내 배포를 위한 GitHub 릴리즈 기반 .zip 파일 배포 (스토어 사용 안 함)

### 1.3. 주요 용어 정의

| 용어 | 정의 |
|------|------|
| **LLM** | 거대 언어 모델 (Large Language Model) |
| **사이드바 (Side Panel)** | 브라우저 측면에 고정되어 표시되는 익스텐션 UI 영역 |
| **컨텍스트 메뉴** | 페이지 내에서 텍스트를 드래그하고 우클릭 시 나타나는 메뉴 |
| **Chat with Page** | 현재 활성화된 웹 페이지의 텍스트 콘텐츠를 AI의 컨텍스트로 활용하는 기능 |
| **Service Worker** | Manifest V3에서 백그라운드 스크립트를 대체하는 이벤트 기반 스크립트 |
| **Content Script** | 웹 페이지의 DOM에 접근하여 실행되는 스크립트 |
| **Streaming Response** | LLM 응답이 생성되는 대로 실시간으로 표시되는 기능 |
| **RAG** | Retrieval-Augmented Generation, 벡터 검색 기반 컨텍스트 증강 생성 |

### 1.4. 참조 문서

- [Chrome Extension Manifest V3 Documentation](https://developer.chrome.com/docs/extensions/mv3/)
- [Chrome Side Panel API](https://developer.chrome.com/docs/extensions/reference/sidePanel/)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [MDN Web Docs - Browser Extensions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)

---

## 2. 전체 시스템 설명

### 2.1. 제품 특징

1. **통합 채팅**
   - 사이드바를 통해 언제든지 AI와 대화
   - '풀 모드'로 전환하여 더 넓은 화면에서 집중적으로 사용
   - 스트리밍 응답으로 실시간 피드백 제공

2. **페이지 문맥 인식**
   - 'Chat with Page' 기능을 통해 현재 웹 페이지 내용을 기반으로 질문
   - 페이지 요약, 특정 정보 추출, 번역 등 다양한 작업 수행
   - 스마트 청킹(Chunking)으로 토큰 제한 문제 해결

3. **인라인(In-line) 텍스트 도구**
   - 텍스트 선택 및 우클릭만으로 즉시 사용 가능
   - Git Diff 스타일의 변경사항 시각화
   - 원본과 결과물의 명확한 비교 UI

4. **사용자 맞춤 설정**
   - 다크/라이트 테마 지원
   - 다국어(한/영) 인터페이스
   - 기기 간 설정 동기화 (chrome.storage.sync)

5. **데이터 보존**
   - 모든 채팅 기록 로컬 저장
   - 세션 관리 및 이어하기 기능
   - 데이터 내보내기/가져오기 기능

### 2.2. 사용자 분류

| 사용자 유형 | 설명 | 주요 사용 시나리오 |
|-------------|------|-------------------|
| **일반 사용자** | 웹 서핑 중 정보 요약, 번역 필요 | - 외국어 문서 빠른 이해<br>- 긴 글 요약<br>- 간단한 질문 |
| **콘텐츠 작성자** | 문서 작성 및 편집 작업 수행 | - 이메일 작성 시 문법 검사<br>- 보고서 표현 개선<br>- 다국어 번역 |
| **개발자** | 기술 문서 읽기 및 코드 작성 | - API 문서 분석<br>- 코드 설명 생성<br>- 에러 메시지 해석 |
| **연구자** | 논문 및 학술 자료 분석 | - 논문 요약<br>- 전문 용어 해석<br>- 참고문헌 정리 |

### 2.3. 운영 환경

**지원 브라우저:**
- Google Chrome (버전 109 이상, Manifest V3 지원)
- Microsoft Edge (버전 109 이상, Chromium 기반)

**지원 운영체제:**
- Windows 10/11
- macOS 11 (Big Sur) 이상
- Linux (Ubuntu 20.04 LTS 이상)

**네트워크 요구사항:**
- 인터넷 연결 필수 (LLM API 호출을 위해)
- 최소 대역폭: 1 Mbps (스트리밍 응답을 위해 권장: 5 Mbps 이상)

**시스템 요구사항:**
- RAM: 최소 4GB (권장 8GB 이상)
- 디스크 공간: 50MB (익스텐션 + 채팅 기록)

### 2.4. 설계 및 구현 제약사항

1. **LLM 엔드포인트**
   - `process.env` 또는 빌드 시 주입되는 환경 변수에 정의된 고정 엔드포인트만 사용
   - API 키 및 엔드포인트가 코드에 하드코딩되어서는 안 됨
   - 환경 변수:
     - `VITE_LLM_ENDPOINT`: LLM API 엔드포인트 URL
     - `VITE_LLM_API_KEY`: API 인증 키
     - `VITE_LLM_MODEL`: 사용할 모델명 (예: gpt-4, gpt-3.5-turbo)
     - `VITE_GITHUB_REPO`: 업데이트 확인용 GitHub 리포지토리 (예: username/click-ai)

2. **Chrome Manifest V3 준수**
   - Service Worker 기반 백그라운드 스크립트
   - `chrome.scripting` API를 통한 Content Script 주입
   - Host Permissions 최소화 원칙
   - CSP (Content Security Policy) 준수

3. **배포 방식**
   - Chrome/Edge 웹 스토어를 통하지 않음
   - 자동 업데이트 불가능
   - GitHub 릴리즈를 통한 버전 관리
   - 수동 설치 및 업데이트 가이드 필수

4. **데이터 저장 제한**
   - `chrome.storage.local`: 최대 10MB (채팅 기록)
   - `chrome.storage.sync`: 최대 100KB (사용자 설정)
   - IndexedDB 사용 가능 (무제한, 향후 확장을 위해)

5. **성능 제약**
   - Content Script는 페이지 로드 성능에 영향을 주지 않아야 함
   - Service Worker는 30초 이상 유휴 시 종료될 수 있음
   - 모든 장기 실행 작업은 비동기로 처리

---

## 3. 세부 요구사항

### 3.1. 기능 요구사항 (Functional Requirements)

#### FR-1: 사이드바 채팅 (Sidebar Chat)

**FR-1.1: 사이드바 열기/닫기**
- **우선순위:** 필수 (P0)
- **설명:** 익스텐션 아이콘 클릭 시 브라우저 측면(Side Panel)에 채팅 UI가 열리거나 닫혀야 한다.
- **수용 기준:**
  - 아이콘 클릭 시 500ms 이내에 사이드바가 표시되어야 함
  - 사이드바는 브라우저의 오른쪽에 300px-600px 너비로 표시
  - 사용자가 사이드바 너비를 드래그로 조정할 수 있어야 함 (최소 250px, 최대 800px)
  - 사이드바가 열린 상태는 탭 간 전환 시에도 유지되어야 함

**FR-1.2: UI 디자인**
- **우선순위:** 필수 (P0)
- **설명:** 채팅 UI는 Gemini와 유사한 미니멀하고 직관적인 디자인을 지향한다.
- **수용 기준:**
  - 헤더: 로고, 새 채팅 버튼, 기록 버튼, 설정 버튼, 풀 모드 버튼
  - 본문: 메시지 목록 (스크롤 가능)
  - 하단: 입력창 (멀티라인 지원, Shift+Enter로 줄바꿈, Enter로 전송)
  - 입력창 옆에 전송 버튼 (아이콘)
  - 로딩 상태 표시 (스피너 또는 펄스 애니메이션)

**FR-1.3: 풀 모드**
- **우선순위:** 높음 (P1)
- **설명:** 사이드바 헤더에 '풀 모드' 아이콘을 제공하며, 클릭 시 더 넓은 채팅 전용 화면을 제공한다.
- **수용 기준:**
  - 풀 모드는 새 탭으로 열림
  - 풀 모드에서도 동일한 채팅 세션을 공유해야 함 (실시간 동기화)
  - 풀 모드는 최소 800px 너비의 중앙 정렬된 채팅 UI를 제공
  - 풀 모드에서 사이드바 모드로 전환 가능한 버튼 제공

**FR-1.4: 메시지 전송**
- **우선순위:** 필수 (P0)
- **설명:** 채팅 입력창은 사용자의 입력을 받아 LLM 엔드포인트로 전송해야 한다.
- **수용 기준:**
  - 입력창이 비어있을 때 전송 버튼 비활성화
  - 전송 중에는 입력창 비활성화 및 전송 버튼을 정지 아이콘으로 변경
  - 정지 버튼 클릭 시 스트리밍 중단 가능
  - 네트워크 오류 시 재시도 버튼 표시
  - 최대 입력 길이: 10,000자 (카운터 표시)

**FR-1.5: 스트리밍 응답**
- **우선순위:** 높음 (P1)
- **설명:** LLM 응답은 스트리밍(Streaming)을 지원하여, 텍스트가 생성되는 대로 실시간으로 표시되어야 한다.
- **수용 기준:**
  - Server-Sent Events (SSE) 또는 Fetch API를 통한 스트리밍 구현
  - 응답이 생성되는 동안 타이핑 효과로 실시간 표시
  - 스트리밍 중 사용자가 스크롤을 내렸을 경우 자동 스크롤 중지
  - 스트리밍 완료 시 '복사' 버튼 활성화
  - 스트리밍 오류 시 부분 응답이라도 표시 후 오류 메시지 추가

---

#### FR-2: 컨텍스트 메뉴 기능 (Context Menu Utilities)

**FR-2.1: 컨텍스트 메뉴 표시**
- **우선순위:** 필수 (P0)
- **설명:** 페이지 내 텍스트를 드래그하고 우클릭 시, "Click AI"라는 상위 컨텍스트 메뉴가 표시되어야 한다.
- **수용 기준:**
  - 텍스트 선택 시에만 "Click AI" 메뉴 항목 표시
  - 메뉴 항목에 익스텐션 아이콘 표시
  - 3개의 하위 메뉴 항목이 명확히 구분되어야 함
  - 메뉴 표시는 100ms 이내에 반응

**FR-2.2: 하위 메뉴 기능**
- **우선순위:** 필수 (P0)
- **설명:** "Click AI" 하위 메뉴로 3가지 기능을 제공한다.

**FR-2.2.1: 문법 교정 (Grammar Correction)**
- **수용 기준:**
  - 선택된 텍스트의 원본 언어를 자동 감지 (한국어/영어)
  - 감지된 언어로 문법 오류만 교정 (의미 변경 최소화)
  - 최대 처리 가능 텍스트: 5,000자
  - 프롬프트 예시: "다음 텍스트의 문법 오류만 교정해주세요. 원본 언어를 유지하고 의미를 변경하지 마세요: [텍스트]"

**FR-2.2.2: 번역 (Translation)**
- **수용 기준:**
  - 한국어 → 영어, 영어 → 한국어 자동 변환
  - 언어 감지 실패 시 기본값: 영어로 번역
  - 전문 용어는 원문을 괄호 안에 병기
  - 최대 처리 가능 텍스트: 10,000자
  - 프롬프트 예시: "다음 텍스트를 [한국어/영어]로 번역해주세요. 자연스러운 표현을 사용하되 전문 용어는 원문을 괄호 안에 표시하세요: [텍스트]"

**FR-2.2.3: 표현 다듬기 (Expression Refinement)**
- **수용 기준:**
  - 문맥상 어색한 표현을 자연스럽게 개선
  - 원본 언어 유지 (한국어 → 한국어, 영어 → 영어)
  - 의미는 유지하되 가독성과 전문성 향상
  - 최대 처리 가능 텍스트: 5,000자
  - 프롬프트 예시: "다음 텍스트의 표현을 더 자연스럽고 전문적으로 다듬어주세요. 의미는 유지하되 어색한 표현을 개선하세요: [텍스트]"

**FR-2.3: 결과 UI (인라인 팝오버)**
- **우선순위:** 필수 (P0)
- **설명:** 기능 실행 시, 선택한 텍스트 근처에 인라인 팝오버(Popover)로 결과를 표시한다.
- **수용 기준:**
  - 팝오버는 선택된 텍스트 바로 위 또는 아래에 표시 (화면 경계 고려)
  - 팝오버 크기: 최소 300px × 200px, 최대 600px × 400px
  - 팝오버 외부 클릭 시 자동 닫힘
  - ESC 키로 닫기 가능
  - 팝오버에는 다음 요소 포함:
    - 헤더: 기능명, 닫기 버튼
    - 본문: 원본과 결과 비교 영역 (Diff 뷰)
    - 하단: '복사' 버튼, '사이드바에서 편집' 버튼

**FR-2.4: Diff 강조 (변경사항 시각화)**
- **우선순위:** 높음 (P1)
- **설명:** 원본과 결과물의 차이를 Git Diff 스타일로 시각화한다.
- **수용 기준:**
  - 삭제된 텍스트: 빨간색 배경, 취소선
  - 추가된 텍스트: 초록색 배경, 밑줄
  - 변경되지 않은 텍스트: 회색 처리
  - 단어 단위 비교 (문자 단위는 너무 세밀함)
  - 라이브러리 추천: `diff-match-patch` 또는 `react-diff-viewer`
  - 다크 모드에서도 명확히 구분 가능한 색상 사용

**FR-2.5: 복사 기능**
- **우선순위:** 필수 (P0)
- **설명:** 결과물을 클립보드로 복사할 수 있는 버튼을 제공한다.
- **수용 기준:**
  - '복사' 버튼 클릭 시 결과 텍스트만 클립보드에 복사
  - 복사 성공 시 버튼 텍스트가 '복사됨!' (2초간) → '복사'로 변경
  - 복사 실패 시 오류 토스트 메시지 표시
  - 키보드 단축키: Ctrl+C (또는 Cmd+C)

**FR-2.6: 사이드바 연동**
- **우선순위:** 중간 (P2)
- **설명:** 팝오버에서 '사이드바에서 편집' 버튼 클릭 시 사이드바 채팅에 결과를 전달한다.
- **수용 기준:**
  - 사이드바가 자동으로 열림
  - 입력창에 "다음 텍스트를 더 개선해주세요: [결과 텍스트]" 형식으로 자동 입력
  - 사용자가 추가 수정 요청 가능

---

#### FR-3: 페이지 컨텍스트 채팅 (Chat with Page)

**FR-3.1: 기능 활성화**
- **우선순위:** 필수 (P0)
- **설명:** 사이드바 채팅 UI 내에 'Chat with Page' 토글 버튼을 제공한다.
- **수용 기준:**
  - 입력창 위에 토글 스위치 및 라벨 표시
  - 토글 활성화 시 아이콘 및 색상 변경으로 상태 표시
  - 활성화 시 현재 페이지 제목을 사이드바 헤더에 표시
  - 비활성화 시 일반 채팅 모드로 전환

**FR-3.2: 페이지 콘텐츠 파싱**
- **우선순위:** 필수 (P0)
- **설명:** 현재 활성화된 탭의 DOM에서 주요 텍스트 콘텐츠를 파싱한다.
- **수용 기준:**
  - Content Script를 통해 페이지 DOM 접근
  - 파싱 우선순위:
    1. `<article>`, `<main>` 태그 내 텍스트
    2. Readability.js 알고리즘 적용 (본문 추출)
    3. `document.body.innerText` 폴백
  - 제외 대상: `<script>`, `<style>`, `<nav>`, `<footer>`, `<aside>`
  - 최소 텍스트 길이: 100자 (너무 짧으면 "페이지 콘텐츠가 부족합니다" 경고)
  - 파싱 성공 시 토스트 메시지: "페이지 콘텐츠를 분석했습니다 (약 X단어)"

**FR-3.3: 컨텍스트 전송**
- **우선순위:** 필수 (P0)
- **설명:** 사용자 메시지 전송 시, 파싱된 페이지 콘텐츠를 LLM 요청의 시스템 메시지 또는 컨텍스트로 함께 전송한다.
- **수용 기준:**
  - LLM API 요청 형식:
    ```json
    {
      "messages": [
        {
          "role": "system",
          "content": "다음은 사용자가 현재 보고 있는 웹 페이지의 내용입니다:\n\n[페이지 콘텐츠]\n\n위 내용을 참고하여 사용자의 질문에 답변하세요."
        },
        {
          "role": "user",
          "content": "[사용자 질문]"
        }
      ]
    }
    ```
  - 페이지 메타데이터도 포함: 제목, URL, 작성일(가능한 경우)

**FR-3.4: 토큰 제한 처리**
- **우선순위:** 필수 (P0)
- **설명:** 페이지 콘텐츠가 LLM의 최대 컨텍스트 토큰 길이를 초과하지 않도록 전처리한다.
- **수용 기준:**
  - 최대 토큰 수: 모델에 따라 동적 설정 (예: GPT-4: 8,000 토큰, GPT-3.5: 4,000 토큰)
  - 토큰 계산 라이브러리: `tiktoken` 또는 `gpt-3-encoder`
  - 초과 시 처리 전략:
    1. **전략 1 (우선):** 문단별로 쪼개고 앞부분 + 뒷부분 유지, 중간 생략
    2. **전략 2:** Readability 점수가 높은 문단만 선택
    3. **전략 3:** 전체 요약 후 요약본 전송
  - 사용자에게 "페이지가 너무 깁니다. 주요 내용만 전송합니다." 경고 표시

**FR-3.5: RAG (향후 고도화)**
- **우선순위:** 낮음 (P3, 추후 구현)
- **설명:** 벡터 임베딩 기반 검색으로 관련 문단만 추출하여 전송한다.
- **수용 기준:**
  - 페이지 콘텐츠를 문단별로 쪼개어 임베딩 생성
  - `chrome.storage.local` 또는 IndexedDB에 벡터 저장
  - 사용자 질문에 대한 코사인 유사도 계산
  - 상위 3-5개 관련 문단만 LLM 컨텍스트로 전송
  - 벡터 임베딩 모델: OpenAI `text-embedding-ada-002` 또는 로컬 경량 모델

---

#### FR-4: 채팅 편의 기능

**FR-4.1: 메시지 복사**
- **우선순위:** 필수 (P0)
- **설명:** LLM이 생성한 모든 답변 메시지에 '복사' 버튼을 제공한다.
- **수용 기준:**
  - 각 AI 메시지 블록의 우측 상단에 복사 아이콘 표시
  - 호버 시 아이콘 표시, 기본 상태에서는 반투명
  - 클릭 시 메시지 전체를 마크다운 형식으로 복사
  - 복사 성공 시 체크 아이콘으로 변경 (2초간)

**FR-4.2: 마크다운 렌더링**
- **우선순위:** 필수 (P0)
- **설명:** LLM 응답 내의 마크다운 문법을 올바르게 렌더링한다.
- **수용 기준:**
  - 지원 요소: 헤더(#), 굵은 글씨(**), 기울임(*), 목록(-, 1.), 링크, 인라인 코드(`), 코드 블록(```)
  - 라이브러리 추천: `react-markdown` + `remark-gfm` (GitHub Flavored Markdown)
  - 링크는 새 탭에서 열림 (`target="_blank"`)
  - 이미지는 지연 로딩 (lazy loading)

**FR-4.3: 코드 블록**
- **우선순위:** 필수 (P0)
- **설명:** 코드 블록은 별도의 UI 컴포넌트로 스타일링하고 전용 복사 버튼을 제공한다.
- **수용 기준:**
  - 코드 블록 스타일: 어두운 배경, 고정폭 글꼴, 라인 넘버 표시
  - 문법 하이라이팅 지원 (라이브러리: `prism-react-renderer` 또는 `highlight.js`)
  - 언어 감지 자동화 (예: ```python → Python 하이라이팅)
  - 코드 블록 우측 상단에 전용 '복사' 버튼
  - 복사 시 코드만 복사 (라인 넘버 제외)

**FR-4.4: 메시지 재생성**
- **우선순위:** 중간 (P2)
- **설명:** AI 응답이 만족스럽지 않을 경우 재생성을 요청할 수 있다.
- **수용 기준:**
  - 각 AI 메시지 하단에 '재생성' 버튼 표시
  - 클릭 시 동일한 프롬프트로 새로운 응답 생성
  - 이전 응답은 채팅 기록에 보존 (히스토리로 이동 가능)

**FR-4.5: 음성 입력**
- **우선순위:** 낮음 (P3, 추후 구현)
- **설명:** Web Speech API를 사용한 음성 입력 지원
- **수용 기준:**
  - 입력창 옆에 마이크 아이콘 버튼
  - 클릭 시 음성 인식 시작 (브라우저 권한 요청)
  - 인식된 텍스트를 실시간으로 입력창에 표시
  - 지원 언어: 한국어, 영어

---

#### FR-5: 채팅 기록 (Chat History)

**FR-5.1: 새 채팅**
- **우선순위:** 필수 (P0)
- **설명:** 사이드바 헤더에 '새 채팅'(+) 버튼을 제공한다.
- **수용 기준:**
  - 클릭 시 현재 채팅을 저장하고 새 세션 시작
  - 새 세션에는 고유 UUID 할당
  - 현재 채팅이 비어있을 경우 경고 없이 즉시 새 채팅 시작
  - 저장되지 않은 변경사항 경고 (옵션)

**FR-5.2: 기록 보기**
- **우선순위:** 필수 (P0)
- **설명:** 사이드바 헤더에 '기록'(History) 버튼을 제공한다.
- **수용 기준:**
  - 클릭 시 채팅 목록 뷰로 전환
  - 목록은 최신순으로 정렬
  - 각 항목에 표시: 제목(첫 메시지 기반), 날짜, 메시지 개수
  - 항목 클릭 시 해당 채팅 세션으로 이동
  - 빈 상태 UI: "아직 채팅 기록이 없습니다."

**FR-5.3: 세션 제목 자동 생성**
- **우선순위:** 중간 (P2)
- **설명:** 각 채팅 세션에 의미 있는 제목을 자동으로 생성한다.
- **수용 기준:**
  - 기본값: 첫 번째 사용자 메시지의 첫 50자
  - 고급 옵션: LLM에 요약 요청 (예: "다음 대화의 제목을 5단어 이내로 생성하세요: [대화]")
  - 사용자가 제목을 직접 수정 가능 (더블 클릭)

**FR-5.4: 데이터 저장**
- **우선순위:** 필수 (P0)
- **설명:** 모든 채팅 기록을 `chrome.storage.local`에 영구 저장한다.
- **수용 기준:**
  - 저장 데이터 구조:
    ```typescript
    interface ChatSession {
      id: string;                    // UUID
      title: string;                 // 세션 제목
      messages: Message[];           // 메시지 배열
      createdAt: number;             // 생성 시간 (Unix timestamp)
      updatedAt: number;             // 마지막 수정 시간
      metadata?: {
        pageUrl?: string;            // Chat with Page 사용 시 페이지 URL
        pageTitle?: string;          // 페이지 제목
      };
    }

    interface Message {
      id: string;                    // 메시지 UUID
      role: 'user' | 'assistant';    // 역할
      content: string;               // 메시지 내용
      timestamp: number;             // 전송 시간
    }
    ```
  - 저장 시점: 메시지 전송 직후 (자동 저장)
  - 오류 처리: 저장 실패 시 재시도 (최대 3회)

**FR-5.5: 세션 이어하기**
- **우선순위:** 필수 (P0)
- **설명:** 기록에서 선택한 세션을 불러와 이어서 대화할 수 있다.
- **수용 기준:**
  - 세션 선택 시 모든 메시지 복원
  - 새 메시지는 기존 세션에 추가
  - LLM에는 전체 대화 히스토리 전송 (컨텍스트 유지)

**FR-5.6: 세션 관리**
- **우선순위:** 중간 (P2)
- **설명:** 개별 세션을 삭제하거나 내보낼 수 있다.
- **수용 기준:**
  - 각 세션 항목에 '...' 메뉴 버튼
  - 메뉴 옵션: '제목 수정', '내보내기 (JSON)', '삭제'
  - 삭제 시 확인 대화상자 표시
  - '모두 삭제' 옵션 (설정 메뉴)

**FR-5.7: 데이터 내보내기/가져오기**
- **우선순위:** 낮음 (P3)
- **설명:** 전체 채팅 기록을 JSON 파일로 내보내거나 가져올 수 있다.
- **수용 기준:**
  - 설정 메뉴에 '데이터 내보내기', '데이터 가져오기' 버튼
  - 내보내기: 모든 세션을 단일 JSON 파일로 다운로드
  - 가져오기: JSON 파일 업로드 시 기존 데이터와 병합 (중복 제거)

---

#### FR-6: 업데이트 알림 (Update Notification)

**FR-6.1: 버전 확인**
- **우선순위:** 중간 (P2)
- **설명:** 익스텐션은 주기적으로 GitHub 릴리즈를 확인하여 새 버전을 감지한다.
- **수용 기준:**
  - 확인 주기: 24시간마다 (Service Worker에서 `chrome.alarms` API 사용)
  - GitHub API 엔드포인트: `https://api.github.com/repos/{owner}/{repo}/releases/latest`
  - 환경 변수에서 리포지토리 정보 가져오기: `VITE_GITHUB_REPO`
  - 네트워크 오류 시 조용히 실패 (오류 로그만 기록)

**FR-6.2: 알림 표시**
- **우선순위:** 중간 (P2)
- **설명:** 새 버전 감지 시 사용자에게 시각적 알림을 제공한다.
- **수용 기준:**
  - 익스텐션 아이콘에 빨간색 뱃지 표시 (예: "NEW")
  - 사이드바 헤더에 업데이트 배너 표시: "새 버전 X.X.X이 출시되었습니다! [업데이트]"
  - 배너 클릭 시 GitHub 릴리즈 페이지로 리디렉션
  - 알림은 사용자가 명시적으로 닫을 때까지 유지

**FR-6.3: 릴리즈 노트**
- **우선순위:** 낮음 (P3)
- **설명:** 새 버전의 변경사항을 팝업으로 표시한다.
- **수용 기준:**
  - GitHub 릴리즈의 `body` (마크다운)를 파싱하여 표시
  - 팝업에는 버전 번호, 릴리즈 날짜, 변경사항 포함
  - '업데이트 방법' 링크 제공 (README의 설치 가이드로 연결)

---

### 3.2. 비기능 요구사항 (Non-Functional Requirements)

#### NFR-1: 성능 (Performance)

**NFR-1.1: UI 반응 속도**
- **측정 기준:** 사이드바 및 컨텍스트 메뉴 UI는 500ms 이내에 즉각적으로 반응해야 한다.
- **테스트 방법:** Chrome DevTools Performance 탭에서 측정
- **최적화 전략:**
  - 컴포넌트 코드 스플리팅 (Dynamic Import)
  - 이미지 및 아이콘 최적화 (SVG 사용)
  - React.memo, useMemo, useCallback 활용

**NFR-1.2: 페이지 파싱 성능**
- **측정 기준:** 'Chat with Page'의 페이지 파싱은 3초 이내에 완료되어야 하며, 사용자 UI를 차단하지 않아야 한다.
- **최적화 전략:**
  - Web Worker를 통한 백그라운드 파싱
  - Readability.js 실행은 별도 스레드
  - 파싱 중 로딩 인디케이터 표시

**NFR-1.3: 메모리 사용량**
- **측정 기준:** 익스텐션의 메모리 사용량은 100MB 이하여야 한다.
- **테스트 방법:** `chrome://extensions` → 'Inspect views: service worker' → Memory 탭
- **최적화 전략:**
  - 채팅 기록 캐싱 제한 (최근 50개 세션만 메모리 유지)
  - 이미지 및 코드 블록 지연 로딩
  - 사용하지 않는 Content Script 언로드

**NFR-1.4: LLM 응답 시간**
- **측정 기준:** LLM 첫 토큰 응답 시간(TTFT)은 2초 이내여야 한다.
- **주의사항:** 이는 주로 LLM 서버 성능에 의존하므로, 익스텐션 레벨에서는 스트리밍 UI로 체감 속도를 향상시킨다.

---

#### NFR-2: UI/UX (Design)

**NFR-2.1: 디자인 시스템**
- **기준:** 전체 UI는 'Google Gemini' 스타일을 벤치마킹하여 설계한다.
- **핵심 원칙:**
  - **미니멀리즘:** 불필요한 요소 제거, 여백 충분히 확보
  - **일관성:** 버튼, 아이콘, 타이포그래피가 일관된 스타일
  - **접근성:** WCAG 2.1 AA 기준 준수 (색상 대비 4.5:1 이상)
  - **반응형:** 사이드바 너비 변경 시에도 레이아웃 유지
- **컬러 팔레트:**
  - 라이트 모드: 배경(#FFFFFF), 텍스트(#202124), 강조(#1A73E8)
  - 다크 모드: 배경(#202124), 텍스트(#E8EAED), 강조(#8AB4F8)

**NFR-2.2: 테마 지원**
- **기준:** 라이트 모드와 다크 모드를 모두 지원한다.
- **구현:**
  - CSS 변수를 사용한 테마 전환
  - `prefers-color-scheme` 미디어 쿼리로 시스템 설정 감지
  - 사용자 설정 메뉴에서 수동 선택 가능 (라이트/다크/시스템)
  - 설정은 `chrome.storage.sync`에 저장하여 기기 간 동기화

**NFR-2.3: 애니메이션**
- **기준:** 부드러운 전환 효과로 사용자 경험 향상
- **적용 위치:**
  - 사이드바 열기/닫기: 슬라이드 애니메이션 (300ms)
  - 메시지 등장: 페이드인 + 슬라이드업 (200ms)
  - 버튼 호버: 배경색 전환 (150ms)
  - 로딩 스피너: 회전 애니메이션
- **제약:** 애니메이션으로 인한 성능 저하 최소화 (`will-change` 속성 활용)

**NFR-2.4: 접근성 (Accessibility)**
- **기준:** WCAG 2.1 AA 수준 준수
- **요구사항:**
  - 키보드 내비게이션 완전 지원 (Tab, Enter, ESC)
  - 스크린 리더 호환 (ARIA 라벨 사용)
  - 포커스 표시 명확히 (아웃라인 스타일)
  - 색맹 사용자 고려 (색상만으로 정보 전달 금지)

---

#### NFR-3: 현지화 (Localization)

**NFR-3.1: 다국어 지원**
- **기준:** 한국어와 영어를 완전히 지원한다.
- **구현:**
  - Chrome Extension의 `_locales/` 폴더 구조 사용
  - 모든 UI 문자열은 `chrome.i18n.getMessage()` API로 가져오기
  - 날짜/시간 포맷도 로케일에 맞게 표시 (`Intl.DateTimeFormat`)

**NFR-3.2: 언어 전환**
- **기준:** 사용자가 설정에서 언어를 수동으로 변경할 수 있다.
- **구현:**
  - 기본값: 브라우저 언어 설정 따름 (`chrome.i18n.getUILanguage()`)
  - 설정 메뉴에 언어 선택 드롭다운 (한국어/English)
  - 변경 시 즉시 적용 (페이지 새로고침 불필요)

**NFR-3.3: RTL 지원 (추후)**
- **우선순위:** 낮음 (P3)
- **설명:** 아랍어, 히브리어 등 RTL 언어 지원 (향후 확장 시)

---

#### NFR-4: 저장소 (Storage)

**NFR-4.1: 채팅 기록 저장**
- **저장소:** `chrome.storage.local` (최대 10MB)
- **데이터 관리:**
  - 자동 저장: 메시지 전송 시마다
  - 용량 초과 시: 가장 오래된 세션부터 자동 삭제 (경고 메시지 표시)
  - 압축: 대용량 세션은 JSON 압축 (LZ-String 라이브러리)

**NFR-4.2: 사용자 설정 저장**
- **저장소:** `chrome.storage.sync` (최대 100KB)
- **저장 항목:**
  - 테마 설정 (light/dark/system)
  - 언어 설정 (ko/en/auto)
  - 사이드바 너비
  - 기타 UI 설정 (폰트 크기 등)
- **동기화:** Chrome/Edge 계정으로 로그인 시 자동 동기화

**NFR-4.3: 캐시 관리**
- **저장소:** 메모리 (Service Worker) + `chrome.storage.local`
- **캐시 대상:**
  - 최근 채팅 세션 (최근 10개)
  - 페이지 파싱 결과 (동일 페이지 재방문 시 재사용, 5분 TTL)
- **캐시 무효화:** 페이지 새로고침 또는 URL 변경 시

---

#### NFR-5: 보안 (Security)

**NFR-5.1: API 키 보호**
- **기준:** LLM 엔드포인트 및 API 키는 빌드 시점에 주입되며, 소스 코드나 빌드 파일에 평문 노출 금지
- **구현:**
  - `.env` 파일에 API 키 저장 (`.gitignore`에 추가)
  - Vite의 `import.meta.env`를 통해 런타임에 접근
  - 빌드된 파일에서는 난독화된 형태로만 존재
  - Service Worker에서만 API 호출 (Content Script에서는 메시지 전달만)

**NFR-5.2: 민감 정보 필터링**
- **기준:** 'Chat with Page' 사용 시 민감 정보가 LLM으로 전송되지 않도록 필터링
- **필터링 대상:**
  - `<input type="password">` 값
  - `autocomplete="cc-number"` (신용카드 번호)
  - 정규식 패턴: 이메일, 전화번호, 주민등록번호 등
- **경고:** 민감 정보 감지 시 사용자에게 경고 메시지 표시

**NFR-5.3: CSP (Content Security Policy)**
- **기준:** Manifest V3 CSP 규칙 준수
- **설정:**
  - `script-src 'self'` (인라인 스크립트 금지)
  - `object-src 'none'`
  - `connect-src` 에 LLM 엔드포인트만 허용

**NFR-5.4: 권한 최소화**
- **기준:** Manifest에서 필요한 최소한의 권한만 요청
- **요청 권한:**
  - `sidePanel`: 사이드바 사용
  - `contextMenus`: 우클릭 메뉴
  - `storage`: 데이터 저장
  - `activeTab`: 현재 탭 접근 (Chat with Page)
  - `scripting`: Content Script 주입
  - `alarms`: 주기적 업데이트 확인
- **호스트 권한:** `<all_urls>` 대신 특정 패턴만 요청 (불가피한 경우 사용자 동의 후 요청)

---

#### NFR-6: 신뢰성 (Reliability)

**NFR-6.1: 오류 처리**
- **기준:** 모든 예상 가능한 오류 상황에 대해 사용자 친화적 메시지 제공
- **오류 시나리오:**
  - 네트워크 오류: "인터넷 연결을 확인해주세요."
  - API 인증 실패: "API 키가 올바르지 않습니다. 관리자에게 문의하세요."
  - 토큰 제한 초과: "메시지가 너무 깁니다. 짧게 나눠서 보내주세요."
  - 저장소 용량 초과: "채팅 기록 저장 공간이 부족합니다. 오래된 채팅을 삭제해주세요."
- **로깅:** 모든 오류는 Service Worker 콘솔에 자세히 기록 (디버깅용)

**NFR-6.2: 재시도 로직**
- **기준:** 네트워크 오류 시 자동 재시도 (최대 3회, 지수 백오프)
- **적용 대상:**
  - LLM API 호출
  - 데이터 저장 (`chrome.storage` API)
  - 업데이트 확인

**NFR-6.3: 서비스 워커 안정성**
- **기준:** Service Worker가 예기치 않게 종료되더라도 데이터 손실 없음
- **구현:**
  - 중요 데이터는 즉시 `chrome.storage`에 저장
  - Service Worker 재시작 시 상태 복구 로직
  - 장기 실행 작업은 `chrome.alarms`로 관리

---

#### NFR-7: 유지보수성 (Maintainability)

**NFR-7.1: 코드 품질**
- **기준:** 깨끗하고 일관된 코드 스타일 유지
- **도구:**
  - ESLint (airbnb-typescript 설정)
  - Prettier (코드 포매팅)
  - Husky (pre-commit hook)
- **주석:** 복잡한 로직에는 JSDoc 주석 추가

**NFR-7.2: 테스트**
- **기준:** 핵심 기능에 대한 자동화 테스트 작성
- **테스트 종류:**
  - 단위 테스트 (Jest + React Testing Library): 컴포넌트, 유틸 함수
  - 통합 테스트: LLM API 호출 모킹, 저장소 읽기/쓰기
  - E2E 테스트 (Playwright): 사이드바 열기, 메시지 전송, 기록 확인
- **커버리지 목표:** 70% 이상

**NFR-7.3: 문서화**
- **기준:** 모든 주요 컴포넌트와 API에 대한 문서 작성
- **문서 종류:**
  - README.md: 프로젝트 개요, 설치 방법
  - ARCHITECTURE.md: 시스템 아키텍처
  - API.md: 내부 API 명세
  - CHANGELOG.md: 버전별 변경사항

---

#### NFR-8: 확장성 (Scalability)

**NFR-8.1: 플러그인 아키텍처 (향후)**
- **우선순위:** 낮음 (P3)
- **설명:** 사용자가 커스텀 프롬프트나 기능을 추가할 수 있는 플러그인 시스템
- **예시:**
  - 커스텀 컨텍스트 메뉴 항목 추가
  - 사전 정의된 프롬프트 템플릿 (예: "코드 리뷰", "이메일 작성")

**NFR-8.2: 멀티 LLM 지원 (향후)**
- **우선순위:** 낮음 (P3)
- **설명:** OpenAI 외에 다른 LLM 제공자도 지원 (Anthropic Claude, Google PaLM 등)
- **구현:** 추상화 레이어를 통해 LLM 제공자 쉽게 교체 가능

---

## 4. 시스템 아키텍처

### 4.1. 전체 구조 (High-Level Architecture)

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser UI                            │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  Side Panel   │  │ Context Menu │  │ Full Mode (Tab) │  │
│  │   (React)     │  │   Popover    │  │     (React)     │  │
│  └───────┬───────┘  └──────┬───────┘  └────────┬────────┘  │
│          │                  │                    │            │
│          └──────────────────┴────────────────────┘            │
│                             ↓                                 │
├─────────────────────────────────────────────────────────────┤
│                      Service Worker                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  - Message Router                                      │  │
│  │  - LLM API Client (Streaming)                         │  │
│  │  - Storage Manager                                     │  │
│  │  - Update Checker (chrome.alarms)                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                             ↓                                 │
├─────────────────────────────────────────────────────────────┤
│                     Content Script                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  - Page Content Parser (Readability.js)               │  │
│  │  - Context Menu Handler                                │  │
│  │  - Text Selection Listener                             │  │
│  └───────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                      Web Page (DOM)                          │
└─────────────────────────────────────────────────────────────┘

                             ↕

┌─────────────────────────────────────────────────────────────┐
│                      External APIs                           │
│  ┌──────────────────┐         ┌──────────────────────────┐  │
│  │  LLM API         │         │  GitHub Releases API     │  │
│  │  (OpenAI-compat) │         │  (Version Check)         │  │
│  └──────────────────┘         └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 4.2. 컴포넌트 구조 (Component Architecture)

#### 4.2.1. Service Worker (Background)

**역할:**
- 익스텐션의 백그라운드 로직 처리
- LLM API 통신 (API 키 보호를 위해 여기서만 호출)
- 메시지 라우팅 (UI ↔ Content Script)
- 주기적 업데이트 확인

**주요 모듈:**
```typescript
// src/background/index.ts
- setupContextMenus()       // 컨텍스트 메뉴 등록
- handleMessage()            // 메시지 라우터
- checkForUpdates()          // 업데이트 확인

// src/background/llm-client.ts
- streamChat()               // 스트리밍 채팅 API 호출
- correctGrammar()           // 문법 교정
- translate()                // 번역
- refineExpression()         // 표현 다듬기

// src/background/storage.ts
- saveChatSession()          // 채팅 세션 저장
- loadChatSessions()         // 모든 세션 로드
- deleteChatSession()        // 세션 삭제
```

#### 4.2.2. Side Panel (UI)

**역할:**
- 메인 채팅 인터페이스
- 채팅 기록 관리
- 설정 UI

**컴포넌트 트리:**
```
SidePanel
├── Header
│   ├── Logo
│   ├── NewChatButton
│   ├── HistoryButton
│   ├── SettingsButton
│   └── FullModeButton
├── ChatView
│   ├── MessageList
│   │   ├── UserMessage
│   │   └── AssistantMessage
│   │       ├── MarkdownRenderer
│   │       ├── CodeBlock
│   │       └── CopyButton
│   ├── ChatInput
│   │   ├── TextArea
│   │   ├── SendButton
│   │   └── ChatWithPageToggle
│   └── LoadingIndicator
├── HistoryView
│   ├── SessionList
│   │   └── SessionItem
│   └── EmptyState
└── SettingsView
    ├── ThemeSelector
    ├── LanguageSelector
    └── DataManagement
```

#### 4.2.3. Content Script

**역할:**
- 웹 페이지 DOM 접근
- 페이지 콘텐츠 파싱
- 컨텍스트 메뉴 결과 팝오버 표시

**주요 기능:**
```typescript
// src/content/parser.ts
- parsePageContent()         // Readability.js 기반 파싱
- filterSensitiveInfo()      // 민감 정보 필터링
- chunkContent()             // 토큰 제한 대응 청킹

// src/content/popover.ts
- showResultPopover()        // 컨텍스트 메뉴 결과 표시
- renderDiff()               // Git Diff 스타일 비교 UI
```

#### 4.2.4. Context Menu Popover

**역할:**
- 컨텍스트 메뉴 기능 결과 표시
- 원본/결과 비교 UI
- 복사 및 추가 편집 기능

**컴포넌트:**
```
ContextPopover
├── Header
│   ├── Title (문법 교정 / 번역 / 표현 다듬기)
│   └── CloseButton
├── DiffView
│   ├── OriginalText (원본)
│   └── ResultText (결과, Diff 강조)
└── Footer
    ├── CopyButton
    └── EditInSidebarButton
```

### 4.3. 데이터 흐름 (Data Flow)

#### 4.3.1. 채팅 메시지 전송 흐름

```
1. User Input (Side Panel)
   ↓
2. Send Message Event
   ↓
3. chrome.runtime.sendMessage({ type: 'SEND_CHAT', content: '...' })
   ↓
4. Service Worker: handleMessage()
   ↓
5. LLM API Call (Streaming)
   ↓
6. Stream Response → chrome.runtime.sendMessage({ type: 'CHAT_CHUNK', chunk: '...' })
   ↓
7. Side Panel: Append Chunk to UI
   ↓
8. Stream Complete → Save to chrome.storage.local
```

#### 4.3.2. Chat with Page 흐름

```
1. Toggle "Chat with Page" (Side Panel)
   ↓
2. chrome.tabs.sendMessage(tabId, { type: 'PARSE_PAGE' })
   ↓
3. Content Script: parsePageContent()
   ↓
4. Return Parsed Content → Side Panel
   ↓
5. User Sends Message
   ↓
6. Service Worker: LLM API Call with Page Context
   ↓
7. Stream Response → Side Panel
```

#### 4.3.3. 컨텍스트 메뉴 흐름

```
1. User Selects Text → Right Click → "Click AI" → "문법 교정"
   ↓
2. chrome.contextMenus.onClicked
   ↓
3. Service Worker: Get Selected Text → LLM API Call
   ↓
4. chrome.tabs.sendMessage(tabId, { type: 'SHOW_RESULT', original, result })
   ↓
5. Content Script: Inject Popover (Shadow DOM)
   ↓
6. Render Diff View
   ↓
7. User Clicks "복사" → navigator.clipboard.writeText(result)
```

---

## 5. 데이터 모델

### 5.1. ChatSession (채팅 세션)

```typescript
interface ChatSession {
  id: string;                    // UUID v4
  title: string;                 // 세션 제목 (첫 메시지 기반 또는 LLM 생성)
  messages: Message[];           // 메시지 배열
  createdAt: number;             // Unix timestamp (ms)
  updatedAt: number;             // Unix timestamp (ms)
  metadata?: {
    pageUrl?: string;            // Chat with Page 사용 시 페이지 URL
    pageTitle?: string;          // 페이지 제목
    pageContent?: string;        // 파싱된 페이지 콘텐츠 (선택적 저장)
  };
}
```

### 5.2. Message (메시지)

```typescript
interface Message {
  id: string;                    // UUID v4
  role: 'user' | 'assistant' | 'system'; // 역할
  content: string;               // 메시지 내용 (마크다운 포함)
  timestamp: number;             // Unix timestamp (ms)
  metadata?: {
    model?: string;              // 사용된 LLM 모델
    tokens?: number;             // 토큰 사용량
    error?: string;              // 오류 발생 시 오류 메시지
  };
}
```

### 5.3. UserSettings (사용자 설정)

```typescript
interface UserSettings {
  theme: 'light' | 'dark' | 'system';  // 테마
  language: 'ko' | 'en' | 'auto';      // 언어
  sidebarWidth: number;                 // 사이드바 너비 (px)
  fontSize: 'small' | 'medium' | 'large'; // 폰트 크기
  streamingEnabled: boolean;            // 스트리밍 활성화 여부
  updateNotifications: boolean;         // 업데이트 알림 활성화
}
```

### 5.4. ContextMenuResult (컨텍스트 메뉴 결과)

```typescript
interface ContextMenuResult {
  type: 'grammar' | 'translation' | 'refinement'; // 기능 유형
  original: string;                    // 원본 텍스트
  result: string;                      // 결과 텍스트
  diff: DiffChunk[];                   // Diff 정보
  timestamp: number;                   // 생성 시간
}

interface DiffChunk {
  type: 'added' | 'removed' | 'unchanged'; // 변경 유형
  value: string;                       // 텍스트 조각
}
```

---

## 6. 인터페이스 요구사항

### 6.1. LLM API 인터페이스

**엔드포인트:** `process.env.VITE_LLM_ENDPOINT`
**인증:** Bearer Token (`process.env.VITE_LLM_API_KEY`)

#### 6.1.1. 채팅 API (스트리밍)

**요청:**
```http
POST /v1/chat/completions
Content-Type: application/json
Authorization: Bearer {API_KEY}

{
  "model": "gpt-4",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"}
  ],
  "stream": true,
  "temperature": 0.7
}
```

**응답 (스트리밍):**
```
data: {"id":"1","object":"chat.completion.chunk","choices":[{"delta":{"role":"assistant","content":"Hello"}}]}

data: {"id":"1","object":"chat.completion.chunk","choices":[{"delta":{"content":"!"}}]}

data: [DONE]
```

#### 6.1.2. 임베딩 API (향후 RAG용)

**요청:**
```http
POST /v1/embeddings
Content-Type: application/json
Authorization: Bearer {API_KEY}

{
  "model": "text-embedding-ada-002",
  "input": "텍스트 내용"
}
```

**응답:**
```json
{
  "data": [
    {
      "embedding": [0.123, -0.456, ...],
      "index": 0
    }
  ]
}
```

### 6.2. GitHub API 인터페이스

**엔드포인트:** `https://api.github.com/repos/{owner}/{repo}/releases/latest`

**요청:**
```http
GET /repos/username/click-ai/releases/latest
Accept: application/vnd.github.v3+json
```

**응답:**
```json
{
  "tag_name": "v1.2.0",
  "name": "Version 1.2.0",
  "body": "## 변경사항\n- 새 기능 추가\n- 버그 수정",
  "published_at": "2025-01-15T10:00:00Z",
  "assets": [
    {
      "name": "click-ai-v1.2.0.zip",
      "browser_download_url": "https://github.com/.../v1.2.0/click-ai-v1.2.0.zip"
    }
  ]
}
```

### 6.3. Chrome Extension API 사용

#### 6.3.1. 메시지 전달

**UI → Service Worker:**
```typescript
chrome.runtime.sendMessage({
  type: 'SEND_CHAT',
  content: '사용자 메시지',
  sessionId: 'uuid-1234'
});
```

**Service Worker → UI:**
```typescript
chrome.runtime.sendMessage({
  type: 'CHAT_CHUNK',
  sessionId: 'uuid-1234',
  chunk: '응답 조각'
});
```

#### 6.3.2. 저장소

**쓰기:**
```typescript
await chrome.storage.local.set({
  [`session_${sessionId}`]: chatSession
});
```

**읽기:**
```typescript
const result = await chrome.storage.local.get(['session_uuid-1234']);
const session = result['session_uuid-1234'];
```

---

## 7. 품질 속성

### 7.1. 성능 목표

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| UI 초기 로딩 시간 | < 500ms | Performance API |
| 사이드바 열기 시간 | < 300ms | Chrome DevTools |
| LLM 첫 토큰 응답 시간 (TTFT) | < 2s | 네트워크 탭 |
| 페이지 파싱 시간 | < 3s | console.time() |
| 메모리 사용량 | < 100MB | chrome://extensions |

### 7.2. 신뢰성 목표

| 지표 | 목표 |
|------|------|
| 정상 가동 시간 (Uptime) | 99.9% (LLM API 의존) |
| 데이터 손실률 | 0% (로컬 저장) |
| 오류 복구율 | 100% (재시도 로직) |

### 7.3. 사용성 목표

| 지표 | 목표 |
|------|------|
| 평균 학습 시간 | < 5분 (직관적 UI) |
| 작업 완료율 | > 95% |
| 사용자 만족도 | > 4.5/5.0 |

---

## 8. 제약사항

### 8.1. 기술적 제약

1. **Manifest V3 제약:**
   - Service Worker는 30초 유휴 시 종료
   - 인라인 스크립트 금지 (CSP)
   - `eval()` 사용 불가

2. **저장소 제한:**
   - `chrome.storage.local`: 10MB
   - `chrome.storage.sync`: 100KB
   - IndexedDB는 사용 가능하나 쿼터 제한 있음

3. **네트워크 제약:**
   - CORS 정책 준수
   - HTTPS만 지원 (HTTP는 Mixed Content 오류)

### 8.2. 비즈니스 제약

1. **배포 방식:**
   - Chrome/Edge 웹 스토어 미사용
   - 자동 업데이트 불가능
   - 사내 배포만 가능

2. **라이선스:**
   - 오픈소스 라이브러리 사용 시 라이선스 준수
   - 사내 전용 프로젝트 (외부 공개 여부는 추후 결정)

### 8.3. 법적 제약

1. **데이터 프라이버시:**
   - 사용자 데이터는 로컬에만 저장 (외부 서버 전송 금지)
   - LLM API로 전송되는 데이터는 사용자 동의 하에만 전송
   - GDPR, CCPA 등 개인정보보호법 준수

2. **LLM 사용 정책:**
   - LLM 제공자의 이용약관 준수
   - 불법적이거나 유해한 콘텐츠 생성 금지

---

## 9. 부록

### 9.1. 권장 기술 스택

| 계층 | 기술 | 이유 |
|------|------|------|
| **UI 프레임워크** | React 18 + TypeScript | 생태계 풍부, 타입 안정성 |
| **상태 관리** | Zustand | 경량, 간단한 API |
| **스타일링** | TailwindCSS | 유틸리티 퍼스트, 빠른 개발 |
| **빌드 도구** | Vite | 빠른 HMR, ESM 기반 |
| **마크다운 렌더링** | react-markdown + remark-gfm | GFM 지원, 커스터마이징 쉬움 |
| **코드 하이라이팅** | prism-react-renderer | 경량, 테마 커스터마이징 |
| **Diff 비교** | diff-match-patch | 정확한 텍스트 비교 |
| **페이지 파싱** | @mozilla/readability | 본문 추출 알고리즘 |
| **토큰 계산** | gpt-3-encoder | 정확한 토큰 수 계산 |
| **UUID 생성** | uuid | 표준 UUID v4 생성 |
| **날짜 처리** | date-fns | 경량, 트리 쉐이킹 지원 |

### 9.2. 프로젝트 구조 예시

```
click-ai/
├── public/
│   ├── manifest.json          # Chrome Extension Manifest
│   ├── icons/                 # 익스텐션 아이콘
│   └── _locales/              # 다국어 파일
│       ├── en/
│       │   └── messages.json
│       └── ko/
│           └── messages.json
├── src/
│   ├── background/            # Service Worker
│   │   ├── index.ts
│   │   ├── llm-client.ts
│   │   ├── storage.ts
│   │   └── update-checker.ts
│   ├── content/               # Content Script
│   │   ├── index.ts
│   │   ├── parser.ts
│   │   ├── popover.tsx
│   │   └── styles.css
│   ├── sidepanel/             # Side Panel UI
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── ChatView.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── HistoryView.tsx
│   │   │   └── SettingsView.tsx
│   │   ├── hooks/
│   │   │   ├── useChat.ts
│   │   │   └── useStorage.ts
│   │   ├── store/
│   │   │   └── chatStore.ts
│   │   └── index.html
│   ├── fullmode/              # Full Mode (새 탭)
│   │   ├── App.tsx
│   │   └── index.html
│   ├── shared/                # 공통 유틸리티
│   │   ├── types.ts
│   │   ├── constants.ts
│   │   ├── utils.ts
│   │   └── i18n.ts
│   └── styles/
│       └── global.css
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
├── BLUEPRINT.md
├── TODO.md
└── CHANGELOG.md
```

### 9.3. 환경 변수 예시 (.env)

```env
# LLM API 설정
VITE_LLM_ENDPOINT=https://api.openai.com/v1
VITE_LLM_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_LLM_MODEL=gpt-4

# GitHub 업데이트 확인
VITE_GITHUB_REPO=username/click-ai

# 개발 모드 설정
VITE_DEV_MODE=true
VITE_LOG_LEVEL=debug
```

### 9.4. 주요 마일스톤

| 마일스톤 | 주요 작업 | 예상 기간 |
|----------|----------|----------|
| **M1: 프로젝트 셋업** | - 프로젝트 구조 설정<br>- Vite + React + TS 환경 구축<br>- Manifest V3 기본 설정 | 1주 |
| **M2: 사이드바 채팅** | - 사이드바 UI 구현<br>- LLM API 연동<br>- 스트리밍 응답 | 2주 |
| **M3: 컨텍스트 메뉴** | - 컨텍스트 메뉴 등록<br>- 3가지 기능 구현<br>- Diff UI | 2주 |
| **M4: Chat with Page** | - 페이지 파싱 구현<br>- 컨텍스트 전송<br>- 토큰 제한 처리 | 1주 |
| **M5: 채팅 기록** | - 저장소 구현<br>- 기록 UI<br>- 세션 관리 | 1주 |
| **M6: 테마 & 다국어** | - 다크/라이트 테마<br>- 한/영 현지화<br>- 설정 UI | 1주 |
| **M7: 테스트 & 최적화** | - 단위/통합 테스트<br>- 성능 최적화<br>- 버그 수정 | 2주 |
| **M8: 배포 준비** | - 빌드 자동화<br>- 문서 작성<br>- 업데이트 알림 | 1주 |

**총 예상 기간:** 11주 (약 3개월)

### 9.5. 참고 자료

1. **디자인 참고:**
   - [Google Gemini](https://gemini.google.com/)
   - [ChatGPT](https://chat.openai.com/)
   - [Grammarly](https://www.grammarly.com/)

2. **기술 문서:**
   - [Chrome Extension Samples](https://github.com/GoogleChrome/chrome-extensions-samples)
   - [Vite Plugin for Chrome Extension](https://github.com/crxjs/chrome-extension-tools)
   - [OpenAI Streaming Guide](https://platform.openai.com/docs/api-reference/streaming)

3. **오픈소스 참고 프로젝트:**
   - [ChatGPT Chrome Extension](https://github.com/gragland/chatgpt-chrome-extension)
   - [Readability.js](https://github.com/mozilla/readability)

---

## 문서 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| 1.0.0 | 2025-11-04 | Claude Code | 초안 작성 |

---

**승인:**
- [ ] 프로젝트 매니저
- [ ] 개발 팀 리더
- [ ] 품질 관리 담당자

**다음 리뷰 일정:** 2025-XX-XX
