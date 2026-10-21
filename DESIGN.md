# Design System & Visual Guidelines: 학급 출석부 (Class Attendance)

## 1. 개요 (Design Philosophy)
- **명확성(Clarity)과 신속한 인지(Instant Recognition)**: 교실 조명 및 다양한 디스플레이(모니터, 태블릿)에서도 상태가 직관적으로 전달되어야 합니다.
- **차분함(Calm)과 신뢰감(Trust)**: 교사의 업무 부담을 줄여주는 단정하고 정돈된 톤앤매너를 유지합니다.

---

## 2. 컬러 팔레트 및 토큰 (Color Tokens)

### 베이스 및 배경 (Surface & Neutral)
| 토큰명 | 색상값 | 용도 |
| :--- | :--- | :--- |
| `--navy` | `#17233c` | 사이드바 배경 및 주요 다크 브랜드 영역 |
| `--canvas` | `#f7f8fa` | 기본 페이지 배경 (부드러운 미색 캔버스) |
| `--paper` | `#ffffff` | 콘텐츠 카드, 모달, 학생 좌석 카드 배경 |
| `--line` | `#e7ebf0` | 카드 외곽선, 테이블 구분선, 툴바 하단선 |
| `--ink` | `#1e293b` | 주 텍스트 (Deep Slate) |
| `--muted` | `#526071` | 서브 텍스트, 설명 라벨, 플레이스홀더 (WCAG AA 대비 5.5:1 통과) |

### 브랜드 및 액센트 (Brand & Accents)
| 토큰명 | 색상값 | 용도 |
| :--- | :--- | :--- |
| `--accent` | `#4f46e5` | 주 액션 버튼, 활성 탭 인디케이터, 링크 (WCAG AA 5.2:1) |
| `--accent-bg` | `#eef0ff` | 보조 버튼 배경, 선택된 항목 하이라이트 |

### 상태 컬러 (Attendance & Functional Semantics)
| 상태 | 토큰 및 코드 | 의미 및 배지 배경 |
| :--- | :--- | :--- |
| **출석 (Present)** | `--mint: #3dbca5;` | 정상 출석 (배경: `#e6f8f4`, 텍스트: `#20a58d`) |
| **지각 (Late)** | `--amber: #e8a536;` | 지각 (배경: `#fff4db`, 텍스트: `#d79420`) |
| **결석 (Absent)** | `--coral: #f07c72;` | 결석 (배경: `#ffebe9`, 텍스트: `#e2665b`) |
| **조퇴 (Early)** | `--status-early: #6366f1;` | 조퇴 (배경: `#eef2ff`, 텍스트: `#4352cf`) |
| **미체크 (Unset)** | `#8b95a5` | 미설정 (배경: `#eff1f4`, 외곽선 점선) |

---

## 3. 타이포그래피 (Typography)

- **폰트 패밀리**: `"DM Sans", "Noto Sans KR", -apple-system, BlinkMacSystemFont, sans-serif`
  - 영문 및 숫자: `DM Sans` (단정한 지오메트릭 산세리프)
  - 한글: `Noto Sans KR` (높은 가독성)

### 텍스트 스케일
| 레벨 | 크기 | 자간 / 굵기 | 적용 요소 |
| :--- | :--- | :--- | :--- |
| `Page Title` | 28px (모바일 23px) | 700 / -1.2px | 뷰 메인 헤딩 (`<h1>`) |
| `Section Title` | 18px ~ 21px | 700 / -0.5px | 모달 타이틀, 대형 서브섹션 |
| `Card Heading` | 16px | 600 / normal | 각 콘텐츠 카드 제목 (`<h2>`) |
| `Body & Button` | 14px | 500 ~ 600 | 본문 내용, 네비게이션, 버튼 |
| `Labels & Captions` | 12px ~ 13px | 400 ~ 700 | 입력 라벨, 뱃지, 설명문 (`.subcopy`) |
| `Microcopy` | 11px | 500 ~ 700 | 학생 번호, 작은 태그, 상태 텍스트 |

---

## 4. 컴포넌트 규칙 (Component Standards)

1. **좌석표 그리드 (`.seating-grid`)**:
   - `repeat(var(--cols, 5), minmax(100px, 1fr))` 반응형 CSS Grid 사용
   - 학생 카드: `border-radius: 11px`, `transition: 0.16s`
   - 호버 인터랙션: `transform: translateY(-2px)`, 미세한 엘리베이션 섀도우 (`0 7px 16px #1b295519`)
2. **버튼 스타일링**:
   - Primary: `--accent` 배경, 화이트 텍스트, `box-shadow: 0 3px 9px #5969ea31`
   - Secondary: `#eef0ff` 배경, `#4858d8` 텍스트
   - 공통: `border-radius: 9px`, 패딩 `11px 17px`
3. **모달 (`dialog#modal`)**:
   - `border-radius: 15px`, 백드롭 블러 및 섀도우 `0 15px 50px #0e193855`
   - 반응형 폭: `width: min(480px, calc(100% - 30px))`

---

## 5. 안티패턴 및 금지 사항 (Anti-Patterns)
- ❌ **순수 블랙(`rgb(0,0,0)`) 또는 무채색 회색 남용 금지**: 항상 `--ink` 또는 `--muted`와 같이 블루/네이비 틴트가 들어간 컬러를 사용합니다.
- ❌ **저대비 텍스트 금지**: 상태 배지 배경 위에 회색 텍스트를 얹지 않고, 전용 고대비 상태 컬러를 적용합니다.
- ❌ **과도한 중첩 카드 금지**: 콘텐츠 카드 내부에 또 다른 테두리 카드를 깊게 중첩하지 않습니다.
- ❌ **튀는 애니메이션 금지**: 수업 집중을 방해하는 튕김(bounce) 효과 대신 간결한 페이드/슬라이드(`0.15s ~ 0.2s ease`)를 사용합니다.
