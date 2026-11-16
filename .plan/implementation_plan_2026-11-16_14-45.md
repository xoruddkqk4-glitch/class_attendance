# 학급 출석부 (`class_attendance`) 현황 진단 및 보완 계획서

> **문서 정보**
> - **작성 일시**: 2026년 11월 16일 14:45 (KST, 서울 기준 시각)
> - **점검 대상 프로젝트**: `c:\Users\user\Desktop\codex_cli\.projects\class_attendance`
> - **계획서 저장 경로**: `c:\Users\user\Desktop\codex_cli\.projects\class_attendance\.plan\implementation_plan_2026-11-16_14-45.md`
> - **기준 브랜치 / 최신 커밋**: `main` (`af7c795`, `origin/main`과 동기화 완료)
> - **작성 모드**: `/ask` (코드 변경 없는 정밀 진단 및 구현 계획 수립)

---

## 1. 프로젝트 현재 기능 점검 요약

본 프로젝트는 교사가 PC·태블릿·모바일에서 교실 좌석 배치도와 연동하여 출결, 수업 태도, 진도, 제출물을 실시간 관리하는 **순수 Vanilla HTML/CSS/JS + Firebase 기반 정적 웹 애플리케이션**입니다.

| 영역 | 주요 구현 기능 | 관련 파일 |
| :--- | :--- | :--- |
| **인증 및 권한 관리** | Google 계정 로그인 게이트(`auth-gate`), 교사 UID별 로컬·클라우드 데이터 격리, 관리자 전용(`isAdmin`) 교사 소속·과목·권한 관리 화면(`#admin`) | `app.js`, `auth-admin.css`, `firestore.rules` |
| **교사 대시보드 (`#dashboard`)** | 학급 생성·이름 변경·소프트 삭제, 학생 일괄 붙여넣기(`5자리 학번, 이름`), `6×6` 좌석 배치(모둠·분단·시험 대형), 빈자리 고정, 맞바꾸기·랜덤 배치, 선생님/학생 시점(`180°`) 반전 | `index.html`, `app.js`, `classroom.css` |
| **수업 중 기록 (`#lesson`)** | 원클릭 출결 순환/고정 입력 및 확정 저장, 학습 태도(`+1`/`0`/`-1`점 및 메모) 개별·다중·전원 일괄 기록(결석생 자동 제외), 공통 예시 문장 관리, 구형 iPad 호환 전체 화면 모드 | `app.js`, `attitude-layout.css`, `mobile-responsive.css` |
| **수업 진도 화이트보드** | 날짜·요일·교시·차시·진도 메모, 직전 차시 진도 자동 안내, 수업일 탐색(`« ‹ 오늘 › »`), 달력 이동, **수업 날짜 일괄 변경(기록 이동)** 및 당일 전체 삭제, 대시보드↔수업 화면 실시간 동기화 | `app.js`, `records-detail.css` |
| **누적 기록 (`#records`)** | 기간 단축버튼, 학급·출결·기록 종류 다중 칩 필터, 총 태도 점수 정렬·날짜 정렬, 전체 기간 아코디언 뷰 & 특정일 표준 출석부 테이블 뷰, 개별 기록 수정 모달, `.xlsx` 내보내기 | `app.js`, `records-detail.css`, `server.js`, `excel-export.mjs` |
| **제출·활동 확인 (`#submissions`)** | 과제/외부활동 열 동적 추가·삭제, 학생별 `O/X` 원클릭 토글, 미제출 필터 및 검색, `전체 X` 일괄 초기화 | `app.js`, `records-detail.css` |
| **저장·백업·배포** | `localStorage` 즉시 저장 + `700ms` 디바운스 Firestore 배치 동기화 + `onSnapshot` 기기 간 실시간 반영, `.json.txt` 파일 백업/복원, GitHub Actions OIDC 자동 배포 | `app.js`, `firebase.json`, `.github/workflows/firebase-deploy.yml` |

---

## 2. Git 커밋 및 저장소 상태 점검 결과

### 2.1 현재 상태 (정상 항목)
- **브랜치 및 동기화**: `main` 브랜치가 원격 `origin/main` (`https://github.com/xoruddkqk4-glitch/class_attendance.git`)과 **완벽히 일치(Up-to-date)**합니다.
- **워킹 트리**: 미커밋 수정 파일 0건, 스테이징 파일 0건, Stash 0건으로 **완전 클린(`working tree clean`)** 상태입니다.
- **구문 무결성**: `node -c app.js`, `node -c server.js`, `node -c excel-export.mjs` 모두 구문 오류 0건으로 통과합니다.
- **최신 커밋(`af7c795`, 2026-10-28 14:41 KST)**: 2학기 3개 학급(`세문영A-01`, `세문영D-01`, `세문영E-01`) 모둠 좌석 배치 복원 및 `cloudSaveLayoutOnly` 분리 반영.

### 2.2 Git 및 저장소 관리상 발견된 보완점
1. **대용량 실행 파일(`.exe`) 중복 추적 (`약 42MB`)**:
   - `.agents/skills/impeccable/scripts/bin/windows-x64/impeccable.exe` (`19.3MB`)와 `.github/skills/impeccable/scripts/bin/windows-x64/impeccable.exe` (`19.3MB`), `font-index.json` (`1.07MB × 2`) 등 동일한 바이너리·데이터 에셋이 두 경로에 중복 커밋되어 있습니다. (`firebase.json` 배포 제외는 적용되어 있으나 Git 저장소 비대화 유발)
2. **커밋 메시지 BOM 문자 혼입 및 단일 제목 반복**:
   - `0d6d5a3` 커밋 메시지 선두에 UTF-8 BOM(`\uFEFF`)이 혼입되어 로그 출력 시 깨짐이 발생합니다.
   - 모든 커밋 제목이 `docs: update README.md and detailed commit results`로 동일하여 `git log --oneline`에서 기능 단위 이력 식별이 어렵습니다.
3. **`README.md` 누적 이력의 커밋 해시 Off-by-One 오차**:
   - 커밋 생성 전에 `README.md`를 먼저 수정하다 보니 마지막 이력(`[2026-10-28 14:40]`)에 실제 커밋 해시(`af7c795`) 대신 직전 커밋 해시(`0d6d5a3`)가 기록되는 구조적 밀림 현상이 있습니다.
4. **`.gitignore` 최소 구성**:
   - 현재 4개 항목만 등록되어 있어 `.DS_Store`, `Thumbs.db`, `.vscode/`, `*.log`, `.env*`, 로컬 전용 스크래치 폴더 등에 대한 방어 규칙 보강이 필요합니다.

---

## 3. 코드·기능·보안 정밀 진단: 보완이 필요한 핵심 항목

우선순위(`P0` 시급 ~ `P3` 개선) 기준으로 도출한 구체적인 보완 과제입니다.

### [P0] 기능 오류 및 데이터 정합성 결함 (최우선 보완)

1. **KST 타임존 날짜 하루 밀림 버그 (`app.js` L55, L79)**
   - **현상**: 누적 기록 초기 시작일(`매월 1일`) 및 기간 단축버튼(`1학기 초 3월 2일`, `2학기 초 8월 16일`)이 로컬 자정 `Date` 객체에 `.toISOString().slice(0, 10)`(UTC 변환)을 호출하여, 한국 시간(UTC+9) 기준 **전날(`2월 말일`, `3월 1일`, `8월 15일`)로 하루 밀려 입력**됩니다.
   - **해결**: 이미 선언된 로컬 날짜 포매터 `dateKey(d)`를 일관되게 사용하도록 교체합니다.

2. **엑셀 내보내기(`.xlsx`) 출결 중복 집계 버그, 스키마 불일치 및 비공개 패키지 의존 (`excel-export.mjs`, `app.js` L80, `package.json` 부재)**
   - **현상**:
     - `recordRows()`는 동일 날짜에 출결 행(`recordType: 'attendance'`)과 태도 행(`recordType: 'attitude'`)을 별도 원소로 반환하는데, `excel-export.mjs`가 `recordType` 구분 없이 `row.attendance`를 합산하여 **태도 메모가 있는 날마다 출석/지각/조퇴 일수가 중복 카운트**됩니다.
     - 화면 UI는 `총 태도 점수` 체계로 개편되었으나 엑셀 요약 시트는 구버전 `태도 평균`만 출력하며, 다중 학급 조회 시에도 `학급` 열이 누락됩니다.
     - 루트에 `package.json`이 없고 npm 비공개 패키지(`@oai/artifact-tool`)에 의존하여 타 환경 재설치 및 Firebase 정적 웹앱에서의 엑셀 다운로드가 불가능합니다.
   - **해결**: 브라우저에서 바로 동작하는 클라이언트 측 `.xlsx` 생성(또는 표준 오픈소스 패키지 + `package.json` 명시)으로 전환하여 **정적 웹앱(Firebase Hosting)에서도 로컬 서버 없이 즉시 엑셀 다운로드**가 되도록 개선하고, `recordType === 'attendance'` 단일 기준 집계 + `학급` 열 + `총 태도 점수` 컬럼을 반영합니다.

3. **JSON 파일 백업/복원 시 `제출·외부활동 확인표(submissionTracker)` 데이터 유실 (`app.js` L72, L74)**
   - **현상**: `파일로 저장한 후 내려받기` 직렬화 객체와 `파일에서 불러오기` 파서에 `submissionTracker` 필드가 빠져 있어, 백업본 복원 시 과제·외부활동 항목과 학생별 `O/X` 체크 기록이 모두 사라집니다.
   - **해결**: 백업 JSON 페이로드에 `submissionTracker: cls().submissionTracker`를 포함하고, 복원 시 `{ columns, checks }` 구조 검증 및 복원을 추가합니다. (선택적으로 전체 학급 통합 백업 옵션 지원)

---

### [P1] 아키텍처·성능·클라우드 동기화 안정성 보완

4. **특정 학급(`세문영A/D/E-01`) 하드코딩 좌석 복원 코드 분리 (`app.js` L110, L116)**
   - **현상**: 2026년 10월 좌석 복구용으로 삽입된 3개 학급·80여 명 학번 매핑 객체(`restoredClassSeatingPresets`)가 앱 로드 및 클라우드 동기화 때마다 상시 실행됩니다.
   - **해결**: 이미 클라우드 `layouts/current`에 반영 완료된 일회성 마이그레이션 데이터를 상시 런타임 코드에서 제거하거나 별도 마이그레이션 유틸리티로 분리하여 예기치 않은 좌석 덮어쓰기를 방지합니다.

5. **중복 이벤트 리스너 및 도달 불가능한 데드 코드 정리 (`app.js`)**
   - **현상**:
     - `[data-progress-action]` 클릭 리스너(L60, L93), `[data-progress-date]` 변경 리스너(L61, L94), `[data-progress-save]` 저장 리스너(L60, L153)가 각각 2중 등록되어 함수가 중복 호출됩니다.
     - 생성 직후 `.remove()`로 삭제되는 `#dataButton`(L71→L75), `#attendanceSummary`(L30→L98)와 3회 덮어써져 실행되지 않는 이메일/비밀번호 로그인 모달(`showAuthModal`, `connectFirebase`, L65·L71·L103~105)이 잔존합니다.
     - 네비게이션 전환 로직이 초기 `b.onclick`(L57)과 `showView()`(L120)로 이원화되어 있습니다.
   - **해결**: 중복 리스너를 단일 핸들러로 통합하고, 데드 코드를 제거하며, 모든 탭 전환을 `showView()` 하나로 일원화합니다. (아울러 수업 화면 상단 당일 출결 요약 배지 `#attendanceSummary`는 교사 편의성을 위해 컴팩트 배지로 복원할지 완전 제거할지 정리)

---

### [P2] 보안 규칙(`firestore.rules`) 및 로컬 서버(`server.js`) 하드닝

6. **Firestore 보안 규칙 소유권 불변성 및 비용 최적화 (`firestore.rules` L25~37)**
   - **현상**:
     - `classes/{classId}` `update` 규칙에 `request.resource.data.ownerId == resource.data.ownerId` 조건이 없어 소유자 UID 변경 요청 차단이 명시적이지 않습니다.
     - 하위 컬렉션 `write` 규칙이 `getAfter(...)`만 사용하고 있어 문서 수정 시 불필요한 상위 문서 재조회가 발생합니다.
   - **해결**: `classes/{classId}` 업데이트 시 `ownerId` 불변 조건을 추가하고, 기존 학급 하위 문서 쓰기 시 `exists`/`get` 조건을 명확히 다듬어 보안성과 규칙 평가 효율을 높입니다.

7. **로컬 보조 서버 보안 강화 (`server.js` L7~20)**
   - **현상**: `POST /export.xlsx` 요청 본문 크기 제한이 없고, 경로 검증이 `file.startsWith(root)`(`path.sep` 미포함)로 되어 있으며, 바인딩 호스트가 모든 인터페이스(`0.0.0.0`)로 열려 있습니다.
   - **해결**: `127.0.0.1` 로컬호스트 전용 바인딩, 요청 바디 크기 상한(예: `5MB`) 적용, `path.relative(root, file)` 기반 안전한 경로 검증을 적용합니다.

---

### [P3] UI/UX 마크업 일관성 및 저장소 경량화

8. **`index.html` 정적 마크업 정합성 및 캐시 버스팅 일원화 (`index.html`, CSS 파일군)**
   - **현상**:
     - 교사 대시보드 상단 아이브로우가 `<p class="eyebrow">관리자 대시보드</p>`로 잘못 표기되어 실제 관리자 화면과 명칭이 겹칩니다 (`교사 대시보드`로 수정 필요).
     - `index.html`의 CSS 쿼리스트링(`?v=20261022.8`)과 JS 쿼리스트링(`?v=20261028.1`) 버전이 파편화되어 있으며, `attitude-layout.css`(`#localSaveButton`), `records-detail.css`(`.period-compact-grid` 등)에 미사용 셀렉터가 남아 있습니다.
   - **해결**: 정적 HTML 라벨·네비게이션 구조를 실제 렌더링 결과와 일치시키고, 미사용 CSS 규칙 정리 및 캐시 버스팅 버전을 단일화합니다.

9. **저장소 중복 스킬 에셋 정리 및 `.gitignore` 보강**
   - **현상**: `.agents/skills/impeccable`과 `.github/skills/impeccable`에 동일한 대용량 바이너리가 중복 배치되어 있습니다.
   - **해결**: `.gitignore`에 OS/에디터/로그/환경변수 패턴을 보강하고, 중복된 에이전트 바이너리 경로 중 불필요한 사본 정리 여부를 결정합니다.

---

## 4. 단계별 구현 로드맵 (`/apply` 실행 시 적용 순서)

향후 사용자가 `/apply`로 구현을 지시할 경우, 아래 4단계 순서로 안전하게 반영합니다.

### Phase 1: 데이터 무결성 및 날짜·백업 버그 수정 (`P0`)
1. `app.js`: 월초 기본값 및 `1학기 초`·`2학기 초` 단축버튼의 `.toISOString().slice(0, 10)`을 `dateKey(d)`로 교체하여 KST 날짜 밀림 해결.
2. `app.js`: JSON 백업(`#downloadButton`) 및 복원(`#fileInput`) 로직에 `submissionTracker` 직렬화·역직렬화 추가.
3. `app.js` & 엑셀 내보내기 모듈: 클라이언트에서도 동작 가능한 표준 `.xlsx` 생성 로직(또는 `excel-export.mjs` 집계 수정 + `package.json` 구성)을 적용하여 출결 중복 집계 버그 수정 및 `학급`·`총 태도 점수` 열 반영.

### Phase 2: `app.js` 코드 클린업 및 이벤트 일원화 (`P1`)
1. `app.js`: 중복 등록된 `click` / `change` 리스너(`progress-action`, `progress-date`, `progress-save`) 통합 및 모든 뷰 전환을 `showView()`로 일원화.
2. `app.js`: 미사용 데드 코드(`#dataButton`, 구 이메일 로그인 모달 `showAuthModal`, `connectFirebase`) 정리 및 하드코딩된 `restoredClassSeatingPresets` 안전 분리/보존 플래그 정리.

### Phase 3: 보안 규칙·서버 하드닝 및 UI 정돈 (`P2` ~ `P3`)
1. `firestore.rules`: `classes/{classId}` 업데이트 시 `ownerId` 변경 방지 조건 추가.
2. `server.js`: `127.0.0.1` 바인딩, `POST` 페이로드 크기 제한(`5MB`), `path.relative` 기반 정적 파일 경로 검증 강화.
3. `index.html`, `attitude-layout.css`, `records-detail.css`, `.gitignore`: 대시보드 아이브로우 텍스트(`교사 대시보드`) 교정, 미사용 CSS 셀렉터 제거, 캐시 버스팅 버전 통일, `.gitignore` 보강.

### Phase 4: 터미널 정적 검증 (Rule 2 준수)
- 브라우저 구동 없이 터미널에서 즉시 검증:
  - `node --check app.js`
  - `node --check server.js`
  - `node --check excel-export.mjs`
  - JSON 유효성 검사 (`firebase.json`, `package.json`)

---

## 5. 사용자 확인이 필요한 의사결정 사항 (선택 사항)

구현(`/apply`) 진행 전 아래 2가지 항목에 대해 선호하시는 방향이 있다면 알려주시면 맞춤 반영하겠습니다 (별도 지정 없이 `/apply` 실행 시 권장안으로 적용):

1. **엑셀 내보내기(`.xlsx`) 동작 방식**:
   - **(권장) 방안 A**: 브라우저 클라이언트에서 직접 `.xlsx`를 생성하도록 개선하여 **배포된 Firebase 웹앱(`class-attendance-98a88.web.app`)에서도 `node server.js` 없이 바로 엑셀 저장** 가능하게 전환 (`server.js` 보조 경로도 호환 유지).
   - **방안 B**: 기존처럼 로컬 `node server.js` 방식만 유지하되, 출결 중복 집계 버그 수정 및 `package.json`(오픈소스 `exceljs` 등) 명시만 수행.
2. **특정 학급(`세문영A-01`, `세문영D-01`, `세문영E-01`) 좌석 복원 프리셋 코드**:
   - **(권장) 방안 A**: 이미 Firebase 클라우드 저장이 완료되었으므로 `app.js` 상시 실행 코드에서 제거하여 코드베이스를 범용화.
   - **방안 B**: 2학기 종료 시점까지 현행 프리셋 코드를 그대로 유지.
