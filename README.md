# MES (Manufacturing Execution System) Front-End

**스마트 팩토리 실시간 생산 제어 및 공정 추적을 위한 MES 프론트엔드**

본 프로젝트는 제조 공장의 실시간 데이터 제어와 생산 이력 추적(Traceability)을 지원하는 고성능 MES 프론트엔드 애플리케이션입니다. 관리자(Admin) 관점의 전체 공정 통제 및 원자재 모니터링 뷰와 현장 작업자(Worker) 관점의 직관적인 실적 입력 뷰로 역할을 분리하여, 복잡한 제조 비즈니스 시나리오를 효과적으로 소화할 수 있도록 구현되었습니다.

이 시스템은 백엔드 서버인 **`mes_server` (ASP.NET Core 8 Web API)**와 실시간 REST API 및 React Query로 상호 보완적으로 작동하도록 설계되었습니다.

---

## 🛠️ Tech Stack & Design System

* **Core**: React 18 / 19, TypeScript 5+ (Strict Type Checking)
* **State & Data Fetching**: TanStack React Query (v5, 5초 주기 실시간 자동 동기화)
* **Styling**: styled-components (Theme-driven, CSS-in-JS, `import * as S` 표준화)
* **Icons**: lucide-react
* **Routing**: react-router-dom (Version 7+)
* **Build Tool**: Vite (Vite-bundler)
* **Package Manager**: npm / pnpm

### 🎨 Design Aesthetics (Midnight Neon & Glassmorphism)
현장 제어용 모니터의 높은 가독성과 미적 완성도를 위해 미드나잇 블루 & 네온 사이언 계열의 HSL 인더스트리얼 테마를 적용했습니다.

* **글래스모피즘(Glassmorphism)** 효과로 세련된 투명 카드 레이아웃 구성
* 실시간 동작을 직관적으로 유추할 수 있도록 트랜지션 애니메이션 및 상태 경고 **네온 글로우(Neon Glow)** 효과 탑재
* 반응형 웹 그리드를 설계하여 태블릿 및 현장 작업자 모바일 기기에서도 손쉬운 조작 지원
* 모든 컴포넌트의 인라인 스타일을 100% 제거하고 `Styled-Components (* as S)` 디자인 시스템으로 통일

---

## 🔥 핵심 기능 및 사용자 경험 (UX)

### 1. 🔄 역할 기반의 다이내믹 뷰 (Role Switcher)
헤더 우측의 `[화면 전환]` 버튼을 통해 언제든 **관리자 모드**와 **작업자 모드**를 유연하게 오갈 수 있으며, 내부 데이터 상태는 React Query 쿼리 캐시 및 AppContext를 공유하여 실시간으로 완벽하게 동기화됩니다.

---

### 2. 🏢 관리자 대시보드 (Admin View)
* **실시간 원자재 재고 카드 및 관리**:
  * 자재의 안전 재고 수량(`safetyQty`) 미달 시 네온 붉은색 테두리와 함께 즉각 `부족` 경고 표시
  * `+ 신규 원자재 등록` 공통 모달: 자재 코드(ProductID), 품목명, 초기 재고 수량, 안전 재고 수량 신규 등록 (`POST /api/MasterData/product`)
  * `📦 입고 / 재고 수량 수정` 공통 모달: 수량 추가 입고(`+N EA`) 및 재고/안전 재고 수량 직접 수정 (`POST /api/Inventory/update-stock/{materialId}`)
* **작업 지시 & LOT 생성**:
  * 생산할 대상 제품 및 계획 수량을 지정해 지시 등록 시 백엔드 연동을 통한 고유 **LOT-ID 자동 발급**
* **생산 진척도 현황판**:
  * 생산 수량과 계획 수량을 비교하여 실시간 진척율(%)을 수치 및 프로그레스 바(ProgressBar)로 시각화
* **실시간 LOT 추적 & Trace Log (Lot Process Tracker)**:
  * 조회할 LOT를 검색/선택하면 해당 LOT의 공정 단계(자재투입 ➡️ 가공 ➡️ 조립 ➡️ 검사 ➡️ 포장 등) 중 현재 위치와 갱신 이력을 타임라인으로 정밀 모니터링
  * 작업 실적 등록 시 함께 입력된 **사용 공구 ID (`toolID`)** 및 **불량 사유 코드 (`reasonCode`)** 시각화
* **완제품 출하 관리**:
  * 완료된 작업 지시 연계 출하 등록 및 출하처(고객사명) 지정, 완제품 출하 이력 현황판 (Shipment Log) 제공

---

### 3. 👷 작업자 실행 패널 (Worker View)
* **작업 지시 셀렉터**:
  * 현장에 할당된 진행 대기/진행 중인 지시 목록 확인 및 작업 대상 선택
* **사용 공구 ID (Tool ID) 지정**:
  * 실적 등록 및 공정 이동 시 사용된 공구 ID(`toolID`) 지정 (기본값: `TOOL-001`)
* **간편 실적 입력기**:
  * 마우스나 터치 모니터 환경에서도 쉽도록 `+1`, `+10`, `남은 전량 채우기` 실적 입력 패널 지원
* **불량 실적 등록 폼**:
  * `GET /api/MasterData/defect-reasons` API 연동을 통한 dynamic 불량 사유 코드 선택
  * 불량 실적 등록 시 해당 LOT의 상태가 백엔드에서 **`HOLD`(보류)**로 자동 전환
* **공정 단계 이동 가이드 & 안전 방어막 (Safety Guards)**:
  * **무단 공정 건너뛰기 차단**: 현재 공정 양품 실적이 0개인 경우 다음 공정 이동 차단 및 경고 팝업 표출
  * **보류(HOLD) 상태 차단**: 불량 발생으로 LOT가 `HOLD` 상태인 경우 공정 이동, 수량 추가, 공구 변경 전면 차단 (`🚫 LOT 보류(HOLD) 상태` 배지 표출)
* **작업 완료 처리**:
  * 최종 공정 단계 도달 및 목표 계획 수량 만족 시 활성화되는 완료 버튼으로, 클릭 시 LOT 상태가 `DONE`으로 갱신되어 관리자 대시보드에 실시간 반영

---

## 📁 디렉토리 구조 (Folder Structure)

```text
mes_front/
├── src/
│   ├── api/                  # Axios / Custom Fetcher 통신 모듈
│   │   ├── fetcher.ts
│   │   └── client.ts
│   ├── components/
│   │   ├── common/           # 🧩 재사용 가능한 공통 컴포넌트
│   │   │   ├── Modal.tsx     # (배경 블러, Esc 닫기, 애니메이션 공통 모달)
│   │   │   └── Modal.styles.ts
│   │   ├── admin/            # 🏢 관리자 대시보드 도메인별 폴더 그룹화
│   │   │   ├── material/     #   ├── RawMaterialStatus, CreateMaterialModal, StockUpdateModal, RawMaterialCard
│   │   │   ├── workOrder/    #   ├── WorkOrderForm, WorkOrderList
│   │   │   ├── shipment/     #   ├── ShipmentForm, ShipmentList, useShipmentForm
│   │   │   └── lotTracker/   #   └── LotProcessTracker, LotSearchPanel, LotDetailsPanel
│   │   └── worker/           # 👷 작업자 패널 도메인별 폴더 그룹화
│   │       ├── controlPanel/ #   ├── WorkerControlPanel, WorkerDefectForm, WorkerStageStepper
│   │       └── orderList/    #   └── WorkerOrderList
│   ├── context/
│   │   └── AppContext.tsx    # MES 실시간 상태 (사용자, 공정단계 모델 규격)
│   ├── layouts/
│   │   └── Layout.tsx        # 네비게이션 헤더 및 역할 전환을 지원하는 통합 레이아웃
│   ├── pages/
│   │   ├── admin/            # 관리자 메인 뷰 및 비즈니스 커스텀 훅
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Dashboard.styles.ts
│   │   │   └── useDashboard.ts
│   │   └── worker/           # 작업자 메인 뷰 및 비즈니스 커스텀 훅
│   │       ├── WorkerDashboard.tsx
│   │       ├── WorkerDashboard.styles.ts
│   │       └── useWorkerDashboard.ts
│   ├── styles/
│   │   ├── theme.ts          # MES 전역 색상 및 폰트 테마 규격
│   │   └── GlobalStyle.ts    # 글로벌 인더스트리얼 스타일 및 폰트 세팅
│   ├── App.tsx               # 라우팅 매핑 및 ThemeProvider 제공
│   └── main.tsx              # 앱 엔트리 포인트
└── index.html                # SEO 메타 데이터 및 타이틀 설정
```

---

## ⚡ 백엔드 연동 및 시뮬레이션 방식

본 프론트엔드는 **ASP.NET Core Web API (`mes_server`)**와의 실시간 REST 통신 및 TanStack React Query 5초 자동 폴링 동기화를 기반으로 동작하며, 개발 환경에서 단독 테스트 또한 가능하도록 유연한 아키텍처로 설계되었습니다.

1. **서버 API 실시간 연동**: `useDashboard.ts` 및 `useWorkerDashboard.ts` 훅에서 백엔드 엔드포인트(`GET /api/MasterData/products`, `POST /api/Production/start`, `POST /api/Inventory/update-stock` 등)를 호출하여 실시간 데이터베이스 상태와 즉각 동기화됩니다.
2. **2중 안전 방어벽**: 프론트엔드 UI 유효성 검증과 백엔드 트랜잭션 서비스 유효성 검증이 상호 작동하여 데이터 무결성을 높입니다.

---

## 🚀 시작 가이드 (Getting Started)

### 1. 패키지 의존성 설치
프로젝트 폴더에서 npm 또는 pnpm을 사용하여 의존성을 설치합니다.

```bash
npm install
# 또는 pnpm install
```

### 2. 개발 서버 실행
```bash
npm run dev
# 또는 pnpm run dev
```
기본적으로 `http://localhost:5173`에서 실행되며, 백엔드 API 서버(`http://localhost:5000`)와 실시간으로 통신합니다.

### 3. 타입 빌드 검증 (Type Check)
```bash
npx tsc --noEmit
```
타입 에러 0건 검증을 완료합니다.

### 4. 배포용 빌드 (Production Build)
```bash
npm run build
# 또는 pnpm run build
```
`/dist` 폴더 내에 정적 최적화 파일로 컴파일이 완료됩니다.