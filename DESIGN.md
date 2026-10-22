# Design System & Visual Guidelines: 학급 출석부 (Class Attendance)

## 1. 개요 (Design Philosophy)
- **명확성(Clarity)과 신속한 인지(Instant Recognition)**: 교실 조명 및 다양한 디스플레이(빔 프로젝터, 태블릿, 모니터)에서도 상태가 1초 이내에 직관적으로 전달되어야 합니다.
- **차분함(Calm)과 신뢰감(Trust)**: 교사의 인지적 피로를 줄여주는 단정하고 정돈된 톤앤매너를 유지하며, 불필요한 시각적 노이즈를 배제합니다.

---

## 2. colors (Color System & Tokens)

### 베이스 및 배경 토큰 (Surface & Neutral)
| 토큰명 | 색상값 | 용도 | WCAG AA 대비 |
| :--- | :--- | :--- | :--- |
| `--navy` | `#17233c` | 사이드바 배경 및 주요 다크 브랜드 영역 | 화이트 대비 14.5:1 |
| `--canvas` | `#f7f8fa` | 기본 페이지 배경 (부드러운 미색 캔버스) | - |
| `--paper` | `#ffffff` | 콘텐츠 카드, 모달, 학생 좌석 카드 배경 | - |
| `--line` | `#e7ebf0` | 카드 외곽선, 테이블 구분선, 툴바 하단선 | - |
| `--ink` | `#1e293b` | 주 텍스트 (Deep Slate) | 화이트 대비 13.8:1 |
| `--muted` | `#526071` | 서브 텍스트, 설명 라벨, 플레이스홀더 | 화이트 대비 5.5:1 (통과) |

### 브랜드 및 액센트 (Brand & Accents)
| 토큰명 | 색상값 | 용도 |
| :--- | :--- | :--- |
| `--accent` | `#4f46e5` | 주 액션 버튼, 활성 탭 인디케이터, 링크 (대비 5.2:1) |
| `--accent-bg` | `#eef0ff` | 보조 버튼 배경, 선택된 항목 하이라이트 |
| `--accent-hover` | `#4338ca` | 마우스 호버 및 포커스 액센트 |

### 상태 컬러 (Attendance Semantics)
| 상태 | 토큰 및 코드 | 의미 및 배지 스타일 |
| :--- | :--- | :--- |
| **출석 (Present)** | `--mint: #3dbca5;` | 정상 출석 (배경: `#e6f8f4`, 텍스트: `#1e9982`) |
| **지각 (Late)** | `--amber: #e8a536;` | 지각 (배경: `#fff4db`, 텍스트: `#cf8d1d`) |
| **결석 (Absent)** | `--coral: #f07c72;` | 결석 (배경: `#ffebe9`, 텍스트: `#d6584c`) |
| **조퇴 (Early)** | `--status-early: #6366f1;` | 조퇴 (배경: `#eef2ff`, 텍스트: `#5544cf`) |
| **미체크 (Unset)** | `#8b95a5` | 미설정 (배경: `#eff1f4`, 텍스트: `#7b889a`) |

### 화이트보드 웜 샌드 팔레트 (Progress Whiteboard)
| 토큰명 | 색상값 | 용도 |
| :--- | :--- | :--- |
| `--board-bg` | `#fffdf5` | 수업 진도 화이트보드 카드 배경 |
| `--board-border` | `#fde047` | 미니 칠판 테두리 |
| `--board-ink` | `#713f12` | 진도 카드 타이틀 및 헤더 텍스트 |

---

## 3. typography (Typography Scale & Hierarchy)

- **폰트 패밀리**: `"DM Sans", "Noto Sans KR", -apple-system, BlinkMacSystemFont, sans-serif`
  - 영문 및 숫자: `DM Sans` (지오메트릭 산세리프)
  - 한글: `Noto Sans KR` (선명한 한글 고딕)

### 6단계 표준 텍스트 스케일
| 토큰명 | 크기 | 자간 / 굵기 | 주요 적용 대상 |
| :--- | :--- | :--- | :--- |
| `--font-micro` | `11px` | 500 ~ 700 / normal | 학번 배지, 카드 미세 상태, 작은 날짜 |
| `--font-caption` | `12px` | 600 ~ 700 / 0.02em | 입력 라벨, 테이블 헤더, 필터 칩, 학생 이름 |
| `--font-body` | `14px` | 500 ~ 600 / normal | 본문 내용, 네비게이션 아이템, 기본 버튼 |
| `--font-subhead` | `16px` | 600 ~ 700 / -0.2px | 카드 제목(`<h2>`), 모달 서브섹션 |
| `--font-title` | `20px` | 700 / -0.5px | 모달 타이틀, 대형 요약 수치 |
| `--font-display` | `24px` | 700 / -1.2px | 뷰 메인 페이지 헤딩 (`<h1>`) |

---

## 4. components (Component Specifications & Standards)

### 1. 좌석표 그리드 (`.seating-grid`)
- 6열 반응형 CSS Grid: `grid-template-columns: repeat(6, minmax(0, 1fr))`
- 좌석 카드 높이: 표준 `64px` (모바일 `54px`)
- 곡률: `border-radius: var(--radius-sm)` (8px)
- 호버 인터랙션: `transform: translateY(-2px)`, `box-shadow: 0 6px 14px rgba(27, 41, 85, 0.1)`

### 2. 버튼 (Buttons)
- **Primary**: `background: var(--accent)`, 화이트 텍스트, `box-shadow: 0 2px 8px rgba(79, 70, 229, 0.25)`
- **Secondary**: `background: var(--accent-bg)`, `color: #4352cf`, `border: 1px solid #dce2fe`
- **Active State**: `transform: scale(0.98)` 즉각적인 물리 피드백 제공
- **공통**: `border-radius: var(--radius-sm)`, 패딩 `10px 16px`

### 3. 모달 대화상자 (`dialog#modal`)
- 백드롭 블러: `background: rgba(20, 32, 57, 0.65)`, `backdrop-filter: blur(2px)`
- 섀도우: `0 18px 54px rgba(14, 25, 56, 0.35)`
- 폭: `width: min(500px, calc(100% - 32px))`
- 곡률: `border-radius: var(--radius-lg)` (16px)

### 4. 화이트보드 진도 노트 (`.progress-note`)
- 상단 수업 진도 배지: `#713f12` 배경, `#ffffff` 텍스트
- 당일 진도 및 이전 차시 진도 자동 캐싱 표시
- 빠른 날짜 스텝 버튼 (`«`, `‹`, `오늘`, `›`, `»`)

---

## 5. anti-patterns (Anti-Patterns & Quality Floor)
- ❌ **순수 블랙(`rgb(0,0,0)`) 또는 무채색 회색 남용 금지**: 항상 블루/네이비 틴트가 들어간 `--ink`(`#1e293b`) 또는 `--muted`(`#526071`)를 사용합니다.
- ❌ **저대비 텍스트 금지**: 상태 배지 배경 위에 회색 텍스트를 얹지 않고, 전용 고대비 상태 컬러를 적용합니다.
- ❌ **과도한 중첩 카드 금지**: 콘텐츠 카드 내부에 또 다른 테두리 카드를 깊게 중첩하지 않습니다.
- ❌ **튀는 애니메이션 금지**: 수업 집중을 방해하는 튕김(bounce) 효과 대신 간결한 페이드/슬라이드(`0.16s ~ 0.25s ease`)를 사용합니다.
