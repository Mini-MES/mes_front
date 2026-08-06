# 📐 MES Front-End Architecture & Developer Guide

본 문서는 **MES (Manufacturing Execution System) 프론트엔드** 애플리케이션의 내부 구조, 설계 원칙, 데이터 흐름, 컴포넌트 구성 요소 및 코딩 컨벤션을 정리한 개발자 아키텍처 가이드입니다.

---

## 1. 아키텍처 개요 (Overview)

본 시스템은 **React 19 + TypeScript + Vite** 환경에서 구축되었으며, 백엔드(`ASP.NET Core Web API`)와 연동하여 제조 현장의 데이터를 실시간으로 모니터링하고 제어합니다.

### 💡 핵심 설계 원칙
1. **도메인 중심의 모듈화 (Domain-Driven Organization)**: 컴포넌트와 훅을 관리자(`admin`), 작업자(`worker`), 공통(`common`) 도메인별로 명확히 분리.
2. **서버 상태 & 클라이언트 상태 분리**:
   - **서버 데이터 (Server State)**: `TanStack React Query v5`를 사용하여 5초 주기의 Auto-Polling 동기화 및 쿼리 캐싱 관리.
   - **전역 UI/인증 상태 (Client State)**: `React Context API (AppContext)`를 통한 역할(Role) 및 인증 상태 관리.
3. **디자인 시스템 표준화**: 인라인 스타일을 배제하고 `styled-components` 기반의 Theme-driven 디자인 가이드 준수 (`import * as S` 형태).

---

## 2. 📂 디렉토리 구조 및 레이어링 규칙

```text
src/
├── api/                    # 백엔드 REST API 통신 클라이언트 및 Fetcher 함수
│   ├── client.ts           # Axios / Custom Fetcher 인스턴스 (BaseURL, Interceptor)
│   └── fetcher.ts          # API Endpoint 연동 함수 모음
├── components/             # React UI 컴포넌트
│   ├── common/             # Modal, Spinner 등 서비스 전반 공통 컴포넌트
│   ├── admin/              # 관리자 대시보드 도메인 컴포넌트
│   │   ├── material/       #   - 원자재 현황, 등록/입고 모달
│   │   ├── workOrder/      #   - 작업지시 발행/목록
│   │   ├── shipment/       #   - 완제품 출하 관리
│   │   ├── lotTracker/     #   - LOT 공정 추적 타임라인 및 검색
│   │   └── analytics/      #   - 공정 단계별 품질/생산 통계
│   └── worker/             # 작업자 실행 패널 도메인 컴포넌트
│       ├── controlPanel/   #   - 수량 입력, 불량 사유, 공정 이동 스태퍼
│       └── orderList/      #   - 작업 지시 목록 선택
├── context/                # 전역 애플리케이션 Context (AppContext)
├── layouts/                # 앱 공통 헤더 및 역할 전환(Role Switcher) 레이아웃
├── pages/                  # 라우트 페이지 컴포넌트 및 비즈니스 훅
│   ├── admin/              #   - Dashboard.tsx, useDashboard.ts
│   ├── worker/             #   - WorkerDashboard.tsx, useWorkerDashboard.ts
│   └── login/              #   - Login.tsx
├── styles/                 # Theme, GlobalStyle (Midnight Neon 테마 규격)
└── types/                  # TypeScript 인터페이스 및 타입 정의
```

---

## 3. 🔄 데이터 흐름 & 상태 관리 (Data Flow)

```mermaid
sequenceDiagram
    autonumber
    actor Worker as 현장 작업자
    participant UI as Worker View (React)
    participant Hook as useWorkerDashboard (Hook)
    participant RQ as React Query (Cache)
    participant API as ASP.NET Core API
    actor Admin as 관리자 (Admin View)

    Worker->>UI: 실적 입력 및 다음 공정 이송 클릭
    UI->>Hook: handleMoveProcess() 실행
    Hook->>API: POST /api/Production/move-stage
    API-->>Hook: 200 OK (공정 이동 완료)
    Hook->>RQ: queryClient.invalidateQueries(['lot-tracking'])
    RQ->>API: 5초 Auto-Polling / Re-fetch
    API-->>Admin: 최신 LOT 추적 타임라인 자동 갱신
```

### 쿼리 캐시 키 구조 (Query Keys)
- `['products']`: 원자재 마스터 목록 및 재고 상태
- `['work-orders']`: 작업지시 목록 및 진척율
- `['lot-tracking', lotId]`: 특정 LOT의 공정 이동 이력 및 타임라인
- `['defect-reasons']`: 불량 사유 코드 마스터 목록

---

## 4. 🎨 디자인 시스템 & 스타일 규격

### 🌌 테마 컨셉: Midnight Neon Glassmorphism
- **배경색**: 다크 인더스트리얼 네이비 (`#0b0f19`)
- **주요 포인트 컬러**:
  - 정상/정상공정: **Neon Cyan** (`#00f2fe`)
  - 경고/부족/보류: **Neon Crimson** (`#ff4b5c`)
  - 완료/승인: **Neon Green** (`#00e676`)
- **유지보수 규칙**:
  - 컴포넌트 파일과 동일한 이름의 `[ComponentName].styles.ts` 생성
  - 컴포넌트 내에서는 `import * as S from '@/[ComponentName].styles'` 로 일관되게 임포트

---

## 5. 🛡️ 예외 처리 & 2중 안전 방어막 (Safety Guards)

1. **무단 공정 건너뛰기 차단**:
   - 현재 공정 양품 수량이 0인 경우 다음 공정 이송 버튼 비활성화 및 토스트/경고 표출.
2. **보류(HOLD) 상태 격리 차단**:
   - 불량 입력으로 LOT 상태가 `HOLD`로 바뀌면 작업자 패널의 모든 제어 버튼 비활성화.
   - 관리자가 승인(`RELEASE`)하기 전까지 추가 실적 입력 차단.

---

## 6. 📝 문서 유지보수 가이드 (Documentation Maintenance)

신규 기능 추가 시 아래 문서를 함께 업데이트합니다.
1. **새로운 API 연동 시**: `src/api/fetcher.ts` 및 `README.md` 기능 설명 갱신
2. **현장 테스트 시나리오 변경 시**: `mes_solution_acceptance_test_guide.md` 갱신
3. **새로운 도메인 추가 시**: 본 `docs/FRONTEND_ARCHITECTURE.md` 디렉토리 및 데이터 흐름 갱신
