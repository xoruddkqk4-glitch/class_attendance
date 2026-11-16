# Impeccable 25개 전수 검증 리포트 및 UI/UX 구현 계획서 (`impeccable-all`)

> **문서 정보**
> - **작성 일시**: 2026년 11월 16일 14:50 (KST, 서울 기준 시각)
> - **대상 프로젝트**: 학급 출석부 (`c:\Users\user\Desktop\codex_cli\.projects\class_attendance`)
> - **Surface Mode**: `Operate` (교실 현장 초고속 출결·학습 태도·진도 운영 인터페이스)
> - **정적 엔진 버전**: Impeccable `v4.7.0` (`detect` & `doctor` 실행 완료)
> - **상태**: 진단 및 계획 수립 완료 (`/apply` 명령 대기 — 소스 코드 미수정)

---

## 1. 정적 엔진 고속 스캔 결과 (`detect` & `doctor`)

| 실행 명령 | 결과 | 세부 내용 |
| :--- | :--- | :--- |
| `impeccable detect .` | ✅ **0 anti-patterns** | 24개 `.css`/`.js` 정규식 스캔 통과 (`side-tab`, `dark-glow`, `radial-halo` 등 AI 클리셰 0건) |
| `impeccable detect index.html` | ✅ **0 findings** | 정적 초기 마크업 안티패턴 0건 통과 |
| `impeccable doctor` | ✅ **No drift found** | `PRODUCT.md` (`schema 1`) 및 `DESIGN.md` 아티팩트 구조 정합성 100% 일치 |
| **정밀 수치 분석 (WCAG·토큰·크래프트)** | ⚠️ **심층 결함 검출** | 저대비(`1.92:1` 등) **16건**, `11px` 미만 미세 텍스트 **6건**, `:focus-visible` **0건**, `prefers-reduced-motion` **0건**, `app.js` 인라인 스타일 **20건**, CSS `!important` **68건** 검출 |

---

## 2. 6대 도메인 · 25개 전수 검증 스코어카드

> **종합 판정**: `✅ PASS 12개` · `⚠️ WARN 11개` · `❌ FAIL 2개`

| 도메인 | # | 검증 축 (Command) | 판정 | 핵심 근거 및 발견 사항 |
| :--- | :---: | :--- | :---: | :--- |
| **1. 시스템 & 컨텍스트**<br>(System & Context) | 1 | `detect` | ✅ PASS | 정규식 및 정적 HTML 안티패턴 스캔 결함 0건 |
| | 2 | `doctor` | ✅ PASS | `PRODUCT.md`·`DESIGN.md` 스키마 드리프트 0건 |
| | 3 | `init` | ✅ PASS | 교사·태블릿·교실 조명 컨텍스트 및 `Operate` 모드 목표가 `PRODUCT.md`에 명확히 정의됨 |
| | 4 | `document` | ⚠️ WARN | `DESIGN.md`에 알약형 곡률(`--radius-pill`), 저장 완료 상태 토큰(`--status-saved`), 포커스 링 규격 명세 보강 필요 |
| | 5 | `extract` | ❌ FAIL | `app.js` 내 하드코딩 인라인 `style="..."` **20건** 및 `records-detail.css`·`auth-admin.css` 내 미추출 하드코딩 헥스 컬러 다수 존재 |
| **2. 사용성 & 접근성**<br>(Evaluation) | 6 | `critique` | ⚠️ WARN | 닐슨 휴리스틱 **33/40점**. 수업 화면(`#lesson`)에서 `#attendanceSummary`가 런타임 삭제(`L98`)되어 실시간 출결 인원 피드백이 누락됨 |
| | 7 | `audit` | ❌ FAIL | **WCAG AA 대비(<4.5:1) 미달 16건**(`진도 저장` `1.92:1`, `진도 저장됨` `2.54:1`, `출결 저장됨` `2.85:1`, 지각 라벨 `2.81:1` 등), `:focus-visible` 전무, 태블릿 터치 타깃 미달(`24~31px`) |
| | 8 | `clarify` | ⚠️ WARN | `index.html` L5의 일반 교사 대시보드 아이브로우가 `관리자 대시보드`로 오표기되어 `#admin` 화면과 명칭 충돌; 초기 네비게이션 텍스트 불일치 |
| **3. 시각 & 타이포그래피**<br>(Visual & Type) | 9 | `typeset` | ⚠️ WARN | `DESIGN.md` 최소 기준(`11px`) 미만인 `9px`·`10px` 텍스트 **6건**(모바일 좌석 학번 `9px`, 이름 `10px` 등) 및 학번·날짜 `tabular-nums` 미적용 |
| | 10 | `colorize` | ⚠️ WARN | 화이트보드 `진도 저장`(`#eab308` 바탕 흰 글씨) 가독성 붕괴 및 `.progress-calendar` 노란색 스타일(L14)이 파란색 스타일(L35)로 덮어써진 팔레트 충돌 |
| | 11 | `layout` | ✅ PASS | 데스크톱 `1260px` 컨테이너 통일, `0.85fr : 1.25fr` 대시보드 분할, 6×6 좌석 그리드 정렬 리듬 우수 |
| | 12 | `bolder` | ✅ PASS | 교탁 배지, 화이트보드 헤더 배지(`#713f12`), 누적 총점 배지(`+`/`-`) 등 핵심 시각 앵커가 뚜렷함 |
| | 13 | `quieter` | ✅ PASS | 모둠·분단 배경 틴트를 `0.03~0.05` 알파값으로 억제하여 36석 좌석 카드의 시인성을 해치지 않음 |
| **4. 디테일 & 인터랙션**<br>(Craft & Motion) | 14 | `polish` | ⚠️ WARN | 비표준 곡률(`7/9/11/13/14/24px`) 혼재, `.submission-column-delete` 절대 위치 미지정, `.student-record summary` Grid/Flex 중복 선언, `!important` 68건 |
| | 15 | `animate` | ⚠️ WARN | 마이크로 트랜지션(`0.16s~0.28s`)은 매끄러우나 `@media (prefers-reduced-motion: reduce)` 대응이 전 파일에서 누락됨 |
| | 16 | `delight` | ✅ PASS | 태도 기록 직후 좌석 펄스(`attitude-pulse`) + 토스트 알림, `180°` 학생 시점 반전 시 이름 정방향 유지 등 현장감 있는 디테일 우수 |
| | 17 | `overdrive` | ✅ PASS | `Operate` 모드 원칙에 맞게 과도한 장식 효과를 배제하고 신속·정확한 조작감에 집중함 |
| **5. 견고성 & 상태 처리**<br>(Robustness & State) | 18 | `harden` | ⚠️ WARN | 긴 학생명/학급명 오버플로 방어 미비 영역 존재, 예시 문장 추가 시 블로킹 `prompt()` 및 날짜 이동 후 중복 `alert()` 호출 |
| | 19 | `onboard` | ✅ PASS | 로그인 게이트 안내, 학생 0명 좌석표 온보딩 가이드, 제출 확인표 초기 빈 상태 안내가 완비됨 |
| | 20 | `distill` | ⚠️ WARN | 미사용 레거시 CSS(`#localSaveButton`, `.period-compact-grid` 계열 23줄) 및 중복 규칙 정리 필요 |
| | 21 | `adapt` | ⚠️ WARN | 구형 iPad 전체 화면 호환은 우수하나, 태블릿/모바일 터치 타깃(`24~31px` 높이 버튼) 및 모바일 좌석 폰트(`9~10px`) 개선 필요 |
| | 22 | `optimize` | ✅ PASS | 정적 CSS 링크, `ResizeObserver` 레이아웃 계산, `700ms` 디바운스 저장으로 가벼운 렌더링 성능 확보 |
| **6. 구조 & 대안 탐색**<br>(Exploration) | 23 | `shape` | ⚠️ WARN | 수업 화면(`#lesson`) 상단에 공간 절약형 실시간 출결 집계 칩(출석·결석·지각·조퇴 인원수) 복원 필요 |
| | 24 | `live` | ✅ PASS | 빌드 없는 단일 정적 구조와 명확한 `data-*` 셀렉터로 실시간 변형 탐색 준비도 양호 |
| | 25 | `generate` | ✅ PASS | 3종 좌석 대형, 2종 시점, 누적 기록 듀얼 뷰(아코디언/일별 테이블) 등 변형 아키텍처가 유연함 |

---

## 3. 우선순위별 핵심 개선 과제

### 🚨 P1 (Critical — 접근성 미달 · 교실 시인성 불량 · 핵심 피드백 누락)
1. **WCAG 2.1 AA 명도 대비(< 4.5:1) 미달 16개 요소 전면 보정 (`audit`, `colorize`)**:
   - `.progress-save`: `#eab308` 배경 + `#ffffff` 글씨(`1.92:1`) ➔ 웜 앰버 다크 텍스트(`#451a03`, 배경 `#facc15`, 대비 **`8.3:1`**) 또는 딥 브라운 버튼(`#854d0e` + `#ffffff`, 대비 **`6.5:1`**)으로 교정.
   - `.progress-save.is-saved` (`2.54:1`) & `.attendance-save.is-saved` (`2.85:1`) ➔ `--status-saved: #047857` + `#ffffff` (**`5.48:1`**)로 통일.
   - `.seat-status` 텍스트 대비 보정: `.present` `#0f766e`(`5.4:1`), `.late` `#b45309`(`5.02:1`), `.absent` `#b91c1c`(`6.47:1`).
   - 저대비 보조 텍스트(`.auth-note`, `.class-delete`, `.modal-close`, `.record-detail-head`, `.admin-teacher-identity span`, `.submission-table small`, `.submission-column-delete`, `.empty-history`, `.attitude-examples > p`, `.record-accordion-arrow`)를 `var(--muted)`(`#526071`, 화이트 대비 `6.37:1`) 또는 `#475569`(`7.58:1`) 이상으로 일괄 보정.
2. **전역 키보드 포커스 링(`:focus-visible`) 및 모션 감속(`prefers-reduced-motion`) 도입 (`audit`, `animate`)**:
   - `styles.css`에 전역 `button:focus-visible, select:focus-visible, input:focus-visible, textarea:focus-visible, summary:focus-visible` 고대비 포커스 링(`2px solid var(--accent)`, `outline-offset: 2px`) 추가.
   - `@media (prefers-reduced-motion: reduce)` 블록을 추가하여 애니메이션·트랜지션 즉시 완료 처리.
3. **모바일/태블릿 `11px` 미만 초소형 폰트 제거 및 터치 타깃 확장 (`typeset`, `adapt`)**:
   - `mobile-responsive.css`, `classroom.css`, `records-detail.css`의 `9px`/`10px` 폰트를 최소 `11px`(`--font-micro`) 이상으로 상향하고 학번·날짜·통계 수치에 `font-variant-numeric: tabular-nums` 적용.
   - 태블릿 오터치 위험이 큰 소형 버튼(`.progress-nav`, `.filter-chip`, `.date-step-btn`, `.record-edit`, `.record-delete`, `.sidebar-collapse-btn`)의 최소 터치 영역을 `36px`(모바일/태블릿 `40~44px`) 수준으로 확보.
4. **수업 화면(`#lesson`) 실시간 출결 인원 요약 바 복원 (`critique`, `shape`)**:
   - `app.js` L98의 무조건적인 `$('#attendanceSummary').remove()`를 제거하고, 수업 화면 툴바와 좌석표 사이에 공간을 적게 차지하는 슬림 인라인 출결 현황 스트립(`출석 N · 결석 N · 지각 N · 조퇴 N`)으로 정돈하여 출석 호명 즉시 인원수를 확인할 수 있도록 개선.

### ⚠️ P2 (Important — 디자인 토큰 추출 · 마크업/카피 일관성 · 레이아웃 충돌 해소)
5. **`app.js` 인라인 `style="..."` 20건의 CSS 클래스 추출 (`extract`)**:
   - `openRecordEditModal`, `openMoveLessonDateModal`, `lessonClick`, `renderReport` 내 인라인 스타일을 `records-detail.css` 및 `attitude-layout.css`의 시맨틱 클래스(`.move-date-summary`, `.edit-field-group`, `.edit-absent-notice`, `.is-disabled-group` 등)로 분리.
6. **UX 라이팅 오표기 교정 및 초기 정적 마크업 동기화 (`clarify`)**:
   - `index.html` L5의 `#dashboard` 아이브로우 `<p class="eyebrow">관리자 대시보드</p>` ➔ `<p class="eyebrow">교사 대시보드</p>`로 수정하여 실제 `#admin`(`관리자 대시보드`)과의 혼선 제거.
   - 사이드바 탭 라벨(`수업 중 학습 태도`)을 초기 HTML과 일치화.
7. **`records-detail.css` 내부 중복·충돌 셀렉터 정리 (`colorize`, `polish`, `distill`)**:
   - `.progress-calendar`의 L35 파란색 덮어쓰기 규칙을 제거하고 화이트보드 웜 샌드 팔레트(L14, 아이콘 `#854d0e` 대비 보강)로 일원화.
   - `.student-record summary`의 구버전 Grid 선언(L1)과 현행 Flex 선언(L147)을 단일 규칙으로 통합.
   - `.submission-table thead th` 내 `.submission-column-delete`의 어긋난 `position: absolute` 배치를 안전한 인라인 플렉스 헤더 레이아웃으로 교정하여 긴 항목명과의 겹침 차단.
   - 미사용 레거시 셀렉터(`#localSaveButton`, `.period-compact-grid` / `.student-compact-card` 23줄) 제거.

### ✨ P3 (Polish — 곡률 스케일 통일 · 비블로킹 피드백 · 문서 동기화)
8. **3단계 곡률 토큰(`8px / 12px / 16px` + `--radius-pill: 999px`) 정렬 및 불필요한 `!important` 감축 (`polish`, `document`)**:
   - `7px`, `9px`, `11px`, `13px`, `14px` 등 비표준 반경을 `var(--radius-sm)` / `var(--radius-md)` / `var(--radius-lg)` / `var(--radius-pill)`로 매핑하고 `DESIGN.md`에 신규 토큰(`--radius-pill`, `--status-saved`)을 문서화.
9. **긴 텍스트 말줄임 방어 및 토스트 피드백 개선 (`harden`)**:
   - `.student-row b`, `.class-select-wrap select`에 `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` 방어 적용.

---

## 4. 파일별 구체적 코드 리팩토링 지침 (`/apply` 실행 단계)

- **Step 1 — `styles.css` & `DESIGN.md` (토큰 확장 · 전역 접근성 · 포커스/모션 가드)**
  - `:root`에 `--status-saved: #047857;`, `--radius-pill: 999px;` 토큰 추가.
  - `.class-delete`, `.modal-close` 명도 대비를 `var(--muted)`(`#526071`) 이상으로 상향하고, `.summary-row`를 수업 화면용 컴팩트 요약 바로 경량화.
  - 파일 하단에 전역 `:focus-visible` 포커스 링 및 `@media (prefers-reduced-motion: reduce)` 규칙 추가.
  - `DESIGN.md`에 추가된 토큰 및 접근성 기준 동기화.

- **Step 2 — `classroom.css` & `attitude-layout.css` (좌석 상태 대비 · 최소 폰트 · 미사용 규칙 정리)**
  - `classroom.css`: `.seat-status` 폰트를 `11px`(`var(--font-micro)`)로 상향하고 `.present`(`#0f766e`), `.late`(`#b45309`), `.absent`(`#b91c1c`) 고대비 컬러 적용; `.student-number`에 `font-variant-numeric: tabular-nums` 추가; `.attendance-save.is-saved` 배경을 `var(--status-saved)`로 통일.
  - `attitude-layout.css`: 미사용 `#localSaveButton` 제거, `.empty-history`·`.attitude-examples > p` 명도 대비를 `var(--muted)`로 보정, 비표준 곡률(`13px`)을 `var(--radius-md)`로 교체.

- **Step 3 — `records-detail.css`, `auth-admin.css`, `mobile-responsive.css` (화이트보드 대비 · 터치 타깃 · 반응형 가독성)**
  - `records-detail.css`: `.progress-save`(`#854d0e` 배경 + `#ffffff` 또는 `#facc15` 배경 + `#451a03`), `.progress-save.is-saved`(`var(--status-saved)`), `.record-detail-head`·`.attitude-detail-head`·`.submission-table small`·`.submission-column-delete`·`.record-accordion-arrow` 명도 대비 4.5:1 이상 보정; `.progress-calendar` 중복 규칙 통합; `.submission-table thead th` 헤더 레이아웃 정돈; 미사용 `.period-compact-grid` 블록 제거; 터치 버튼 높이·패딩 보강.
  - `auth-admin.css`: `.auth-note` 및 `.admin-teacher-identity span` 컬러를 `var(--muted)`로 교체하고 불필요한 `!important` 정리.
  - `mobile-responsive.css`: `820px` 이하 `#lesson .student-number`·`.student-name`의 `9px`/`10px` 폰트를 `11px`/`12px`로 상향하고 모바일 터치 타깃 최소 높이 확보.

- **Step 4 — `index.html` & `app.js` (UX 카피 교정 · 인라인 스타일 추출 · 출결 요약 바 복원)**
  - `index.html`: `#dashboard` 상단 아이브로우를 `교사 대시보드`로 수정, 네비게이션 초기 텍스트 일치화, 캐시 버스팅 버전 일괄 갱신.
  - `app.js`: L98 `$('#attendanceSummary').remove()` 제거로 실시간 출결 요약 표시 복원, 20개 인라인 `style="..."` 속성을 CSS 클래스로 치환.

- **Step 5 — 터미널 고속 정적 검증 (Rule 2 준수)**
  - `node --check app.js` 및 `node --check server.js`
  - `.agents\skills\impeccable\scripts\impeccable.cmd detect .` 및 `detect index.html`
  - `.agents\skills\impeccable\scripts\impeccable.cmd doctor`
  - Node 명도 대비 검증 스크립트 재실행하여 전 항목 `>= 4.5:1` 통과 확인
