# 🏭 Smart Factory MES Front-End

**스마트 팩토리 실시간 생산 제어 및 공정 추적을 위한 MES 프론트엔드**

본 프로젝트는 제조 공장의 실시간 데이터 제어와 생산 이력 추적(Traceability)을 지원하는 고성능 MES 프론트엔드 애플리케이션입니다. 관리자(Admin) 관점의 전체 공정 통제 및 원자재 모니터링 뷰와 현장 작업자(Worker) 관점의 직관적인 실적 입력 뷰로 역할을 분리하여, 복잡한 제조 비즈니스 시나리오를 효과적으로 소화할 수 있도록 구현되었습니다.

이 시스템은 백엔드 서버인 **`mes_server` (ASP.NET Core 8 Web API)**와 실시간 REST API 및 React Query로 상호 보완적으로 작동하도록 설계되었습니다.

---

## 📚 관련 상세 문서 (Documentation)

| 문서명 | 설명 | 바로가기 |
| :--- | :--- | :--- |
| **프론트엔드 아키텍처 가이드** | 디렉토리 구조, 데이터 흐름(Mermaid), React Query 캐싱/폴링 정책, 디자인 시스템 컨벤션 | [docs/FRONTEND_ARCHITECTURE.md](./docs/FRONTEND_ARCHITECTURE.md) |
| **현장 검증 & UAT 가이드** | 실제 공정 시나리오별 수용 테스트 절차 및 예외 상황(HOLD 보류) 검증 가이드 | [mes_solution_acceptance_test_guide.md](./mes_solution_acceptance_test_guide.md) |

---

## 🛠️ Tech Stack

* **Core**: React 19, TypeScript 5+ (Strict Type Checking)
* **State & Data Fetching**: TanStack React Query (v5, 5초 주기 실시간 자동 동기화)
* **Styling**: styled-components (Theme-driven, `import * as S` 표준화)
* **Routing**: react-router-dom (v7+)
* **Build Tool**: Vite

---

## 🔥 핵심 기능 요약

### 1. 🔄 역할 기반의 다이내믹 뷰 (Role Switcher)
- 헤더 우측의 `[화면 전환]` 버튼을 통해 관리자 모드 ↔ 작업자 모드를 자유롭게 이동.
- React Query 쿼리 캐시 공유로 실시간 데이터 동기화 유지.

### 2. 🏢 관리자 대시보드 (Admin View)
- **원자재 재고 관리**: 부족 재고 네온 경고 및 신규 원자재 등록 / 입고 수량 수정 모달.
- **작업 지시 & LOT 생성**: 생산 계획 수량 입력 및 고유 LOT-ID 자동 발급.
- **실시간 LOT 추적 (Lot Process Tracker)**: 타임라인 기반 공정 이력, 사용 공구(`toolID`), 불량 사유 모니터링.
- **완제품 출하 관리**: 완제품 출하 이력 현황판 제공.

### 3. 👷 작업자 실행 패널 (Worker View)
- **간편 실적 입력기**: 현장 터미널 대응 `+1`, `+10`, `전량 채우기` 패널 지원.
- **불량 등록 & HOLD 보류**: 불량 발생 시 해당 LOT 상태가 `HOLD`로 자동 전환되어 다음 공정 이송 자동 차단.
- **안전 방어막 (Safety Guards)**: 양품 실적 0개 시 이송 차단 등 이중 안전장치 탑재.

---

## 🚀 시작 가이드 (Getting Started)

### 1. 패키지 의존성 설치
```bash
npm install
# 또는 pnpm install
```

### 2. 개발 서버 실행
```bash
npm run dev
# 또는 pnpm run dev
```
기본 주소: `http://localhost:5173` (백엔드 API 서버 `http://localhost:5000` 연동)

### 3. 타입 검증 & 빌드
```bash
# 타입 검증 (Type Check)
npx tsc --noEmit

# 배포용 빌드
npm run build
```