# Mini-MES Frontend

ASP.NET Core 기반 `mes_server`와 연동하는 Mini-MES 프론트엔드입니다. 관리자 화면에서는 작업지시·LOT·재고·설비·OEE를 관리하고, 작업자 화면에서는 생산 시작, OPC 생산량 확인, 불량 등록과 공정 이동을 수행합니다.

## 문서

| 문서 | 내용 |
| --- | --- |
| [프론트엔드 아키텍처](./docs/FRONTEND_ARCHITECTURE.md) | 실제 디렉터리 구조, REST/SignalR 데이터 흐름, 상태 관리 |
| [솔루션 검수 문서](./docs/mes_solution_acceptance.md) | 기능별 검수 시나리오, 통과 기준 및 시연 자료 |
| [통합 테스트 가이드](./mes_solution_acceptance_test_guide.md) | WorkOrder 생성부터 OPC 실적·완료·출하까지의 검증 절차 |

## 기술 스택

- React 19, TypeScript 7
- TanStack React Query 5
- Microsoft SignalR Client 10
- styled-components 6
- React Router 7
- Vite 8

## 데이터 동기화 방식

SignalR 이벤트를 통해 WorkOrder, LOT, 재고, 설비 상태, OPC 생산량, 온도와 OEE 변경을 전달받습니다. 이벤트 수신 또는 Mutation 성공 시 React Query의 `invalidateQueries`를 호출하여 서버 상태를 다시 조회합니다. 브라우저 포커스 복귀와 네트워크 재연결 시에는 React Query 기본 동작으로 최신 데이터를 확인합니다.

## 핵심 생산 흐름

1. 관리자가 WorkOrder를 생성하면 LOT이 `RELEASED` 상태로 자동 생성됩니다.
2. 작업자가 생산을 시작하면 현재 LOT이 CNC01에 연결됩니다.
3. WorkOrder는 `InProgress`, LOT은 `WIP`, CNC01은 `Running`으로 저장됩니다.
4. Kepware의 CNC01~CNC05 Counter 증가량은 백엔드에서 해당 설비의 `CurrentLotId`를 통해 자동 실적으로 등록됩니다.
5. OPC 양품 실적은 프론트에서 다시 승인하거나 재전송하지 않습니다.
6. 불량만 작업자가 수량과 사유 코드를 입력하여 수동 등록하며, LOT은 `HOLD`로 전환됩니다.
7. 공정 이동 요청은 기존 OPC 실적을 중복 등록하지 않고 LOT의 현재 공정만 이동합니다.
8. 마지막 공정에서 목표 수량을 달성하면 WorkOrder와 LOT이 완료되고 설비 연결이 해제됩니다.

## 주요 화면

### 관리자

- WorkOrder 생성·조회·삭제·완료
- LOT 진행 상태와 HOLD 해제
- 제품/원자재 및 재고 관리
- 설비 상태, 온도, 가동·비가동 시간 확인
- 일일 생산량과 OEE 확인
- 완제품 출하와 출하 이력 조회

### 작업자

- 작업지시와 LOT 선택
- CNC01 기준 생산 시작
- OPC Counter 기반 양품 수량 확인
- 수동 불량 등록 및 HOLD 확인
- 다음 공정 이동과 최종 생산 완료

## 실행

`.env` 예시:

```env
VITE_API_URL=http://localhost:5208/api
VITE_SIGNALR_HUB_URL=http://localhost:5208/hubs/mes
```

```bash
npm install
npm run dev
```

개발 서버 기본 주소는 `http://localhost:5173`입니다.

## 검증

```bash
npm run lint
npm run build
```

실제 생산 흐름은 [통합 테스트 가이드](./mes_solution_acceptance_test_guide.md)를 따릅니다.
