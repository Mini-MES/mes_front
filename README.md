# MES (Manufacturing Execution System) Front-End

**스마트 팩토리 실시간 생산 제어 및 공정 추적을 위한 MES 프론트엔드**

본 프로젝트는 제조 공장의 실시간 데이터 제어와 생산 이력 추적을 지원하는 고성능 MES 프론트엔드 어플리케이션입니다. 
관리자(Admin) 관점의 전체 공정 통제 및 원자재 모니터링 뷰와 현장 작업자(Worker) 관점의 직관적인 실적 입력 뷰로 역할을 분리하여, 복잡한 제조 비즈니스 시나리오를 효과적으로 소화할 수 있도록 구현되었습니다.

이 시스템은 백엔드 서버인 **[mes_server (ASP.NET Core Web API)](file:///C:/Users/User/Desktop/ASP.NET/mes_back/mes_server/README.md)**와 상호 보완적으로 작동할 수 있도록 설계되었습니다.

---

## Tech Stack & Design System
* **Core**: React 19, TypeScript 5+ (Strict Type Checking)
* **Styling**: `styled-components` (Theme-driven, CSS-in-JS)
* **Icons**: `lucide-react`
* **Routing**: `react-router-dom` (Version 7+)
* **Build Tool**: Vite 8+ (Vite-bundler)
* **Package Manager**: `pnpm`

### Design Aesthetics (Midnight Neon)
현장 제어용 모니터의 높은 가독성과 미적 완성도를 위해 **미드나잇 블루 & 네온 사이언** 계열의 HSL 인더스트리얼 테마를 적용했습니다.
* **글래스모피즘(Glassmorphism)** 효과로 세련된 카드 레이아웃 구성
* 실시간 동작을 직관적으로 유추할 수 있도록 트랜지션 애니메이션 및 상태 경고 네온 글로우(Neon Glow) 효과 탑재
* 반응형 웹 그리드를 설계하여 태블릿 및 작업자 모바일 기기에서도 손쉬운 조작 지원

---

##  핵심 기능 및 사용자 경험 (UX)

### 1. 역할 기반의 다이내믹 뷰 (Role Switcher)
* 헤더 우측의 **[화면 전환]** 버튼을 통해 언제든 **관리자 모드**와 **작업자 모드**를 유연하게 오갈 수 있으며, 내부 데이터 상태는 하나의 글로벌 Context를 공유하여 즉각적으로 동기화됩니다.

### 2. 관리자 대시보드 (Admin View)
* **실시간 원자재 재고 카드**: 자재의 안전 재고 기준치 미달 시 네온 붉은색 테두리와 함께 즉각 경고 표시
* **작업 지시 & LOT 생성**: 생산할 제품, 계획수량, 담당자를 지정해 지시 등록 시 고유 `LOT-ID`가 동적으로 발급
* **작업 진척도 현황판**: 생산 수량과 계획 수량을 비교하여 실시간 진척율(%)을 수치 및 그래프바로 시각화
* **실시간 LOT 추적 스테퍼**: 조회할 LOT를 검색/선택하면 해당 LOT의 5단계 공정 단계(자재투입 ➡️ 가공 ➡️ 조립 ➡️ 검사 ➡️ 포장) 중 현재 위치와 갱신 이력을 가로형 타임라인으로 정밀 모니터링

### 3. 작업자 실행 패널 (Worker View)
* **작업 지시 셀렉터**: 현장에 할당된 진행 대기/진행 중인 지시 목록 확인 및 작업 대상 선택
* **간편 실적 입력기**: 마우스나 터치 모니터 환경에서도 쉽도록 `+1`, `+10`, `잔량 전량 채우기` 실적 입력 패널 지원
* **공정 단계 이동 가이드**: 현재 단계의 가공 완료 시 다음 공정 단계로 순차적으로 이송 처리
* **작업 완료 처리**: 최종 포장 공정 도달 및 계획 수량 만족 시 활성화되는 완료 버튼으로, 클릭 시 LOT 상태가 '완료'로 갱신되어 관리자 대시보드에 실시간 반영

---

## 📁 디렉토리 구조 (Folder Structure)

```text
mes_front/
├── .github/                  # GitHub 협업용 설정
│   ├── ISSUE_TEMPLATE/       # 이슈 템플릿 (버그 보고, 기능 제안)
│   ├── labels.json           # 공통 프로젝트 라벨 설정 파일
│   └── pull_request_template.md  # PR 템플릿
├── src/
│   ├── types/
│   │   └── styled.d.ts       # styled-components DefaultTheme 타입 확장 선언
│   ├── styles/
│   │   ├── theme.ts          # MES 전역 색상 및 폰트 테마 규격
│   │   └── GlobalStyle.ts    # 글로벌 인더스트리얼 스타일 및 폰트 세팅
│   ├── context/
│   │   └── AppContext.tsx    # MES 실시간 상태(자재, LOT, 지시) 시뮬레이션 콘텍스트
│   ├── layouts/
│   │   └── Layout.tsx        # 네비게이션 헤더 및 역할 전환을 지원하는 통합 레이아웃
│   ├── pages/
│   │   ├── admin/
│   │   │   └── Dashboard.tsx # 관리자 생산 현황 모니터링 대시보드
│   │   └── worker/
│   │       └── WorkerDashboard.tsx # 현장 작업자 실적 및 공정 제어 패널
│   ├── App.tsx               # 라우팅 매핑 및 ThemeProvider 제공
│   └── main.tsx              # 앱 엔트리 포인트
└── index.html                # SEO 메타 데이터 및 타이틀 설정
```

---

## ⚡ 백엔드 연동 및 시뮬레이션 방식
본 프론트엔드는 **[AppContext.tsx](file:///C:/Users/User/Desktop/ASP.NET/mes_back/mes_front/src/context/AppContext.tsx)** 내부에서 실제 MES 비즈니스 로직(작업 지시 등록에 따른 LOT 자동 발급, 공정에 따른 재고 차감 및 실적 반영 등)을 완벽하게 모의 구현(Mock Simulation)하고 있습니다.
* **로컬 시뮬레이션**: 백엔드 서버 구동 없이도 프론트엔드 단독 실행으로 모든 비즈니스 흐름을 검증할 수 있어 데모 및 사전 검증에 용이합니다.
* **서버 API 연동**: 추후 백엔드 API와의 연동 시, `AppContext.tsx` 내의 각 비즈니스 함수들을 C# ASP.NET Core API로의 `fetch` 또는 `axios` 요청으로 교체해 주면 백엔드 DB와 연동되어 실 서비스 배포가 가능해집니다.

---

## 🚀 시작 가이드 (Getting Started)

### 1. 패키지 의존성 설치
프로젝트 루트 폴더에서 `pnpm`을 사용하여 의존성을 설치합니다.
```bash
pnpm install
```

### 2. 개발 서버 실행
```bash
pnpm run dev
```
기본적으로 `http://localhost:5173`에서 실행되며, 로컬 화면에서 실시간 데이터 전환 시나리오를 직접 조작할 수 있습니다.

### 3. 배포용 빌드
```bash
pnpm run build
```
`/dist` 폴더 내에 정적 파일로 컴파일 완료됩니다.