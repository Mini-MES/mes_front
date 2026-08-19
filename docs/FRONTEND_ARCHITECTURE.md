# Mini-MES Frontend Architecture

## 1. 구성

```text
Browser
├─ REST API queries/mutations
├─ TanStack React Query cache
└─ SignalR Hub connection
       ↕
ASP.NET Core mes_server
       ↕
Kepware OPC UA (CNC01~CNC05)
```

프론트엔드는 OPC UA 서버에 직접 연결하지 않습니다. Kepware 데이터는 백엔드가 수신·검증하고 DB에 반영한 뒤 SignalR로 전달합니다.

## 2. 디렉터리 책임

```text
src/
├─ api/                     REST fetch wrapper
├─ components/
│  ├─ admin/                관리자 기능 UI
│  └─ worker/               작업자 기능 UI
├─ context/                 인증, SignalR, 알림 Context
├─ hooks/
│  ├─ useSignalR.ts         HubConnection 생성과 재연결
│  ├─ useSignalRListener.ts 서버 이벤트에 따른 Query 무효화/알림
│  ├─ useSensorStream.ts    LOT별 OPC Counter 표시 버퍼
│  └─ useEquipmentTelemetry.ts 설비별 온도 텔레메트리 병합
├─ pages/
│  ├─ admin/useDashboard.ts 관리자 REST query/mutation
│  └─ worker/useWorkerDashboard.ts 작업자 생산 흐름
└─ types/                   화면 및 API 타입
```

## 3. 서버 상태 동기화

### SignalR 이벤트 기반 갱신

`useSignalRListener`가 다음 이벤트를 받아 관련 React Query 캐시를 무효화합니다.

- `WorkOrderUpdated`
- `LotUpdated`
- `StockUpdated`
- `ReceiveEquipmentStatusChanged`
- `DefectReported`
- `ReceiveSensorCountUpdated`
- `DailyProductionUpdated`
- `OeeUpdated`

`useEquipmentTelemetry`는 `ReceiveEquipmentTelemetryList`를 받아 `equipmentId`별 최신 온도·상태·생산량을 병합합니다.

REST Mutation 성공 시에도 관련 Query를 즉시 무효화합니다. 브라우저 포커스 복귀, 컴포넌트 재마운트 또는 네트워크 재연결 시에는 React Query의 기본 재조회 동작으로 화면 상태를 복구합니다.

## 4. 생산 시작 계약

```http
POST /api/Production/start/{orderId}
Content-Type: application/json

{
  "lotId": "LOT-...",
  "equipmentID": "CNC01"
}
```

첫 공정 설비는 현재 업무 규칙에 따라 CNC01로 고정합니다. 백엔드는 WorkOrder, LOT, Equipment와 `CurrentLotId`를 한 저장 단위로 변경합니다. 프론트는 생산 시작 후 `/Equipment/status`를 다시 호출하지 않고 SignalR과 Query 무효화로 화면을 갱신합니다.

## 5. OPC 실적과 작업자 입력

```text
Kepware Counter 증가
→ 백엔드가 EquipmentID 식별
→ Equipment.CurrentLotId 조회
→ LOT/WorkOrder/현재 공정 검증
→ 양품 Performance 자동 등록
→ 재고/OEE/상태 저장
→ SignalR 전송
→ 프론트 표시
```

- Counter 양품은 백엔드에서 이미 저장되므로 프론트가 `/performance/register`로 재전송하지 않습니다.
- `useSensorStream`의 누적 양품은 화면 표시용입니다.
- 작업자는 불량만 `/Production/performance/register`로 등록합니다.
- 불량 등록에는 `badQty > 0`과 `reasonCode`가 필요합니다.
- 공정 이동은 수량 0을 전달하며, 백엔드는 0수량 Performance 생성을 생략합니다.

## 6. 주요 Query Key

- `['workOrders']`: 작업지시
- `['lots']`: LOT
- `['rawMaterials']`, `['products']`: 제품/재고
- `['equipments']`: 설비 상태
- `['oeeSummary']`, `['oeeStats']`: OEE 요약
- `['dailyEquipmentProductions']`, `['daily-production']`: 일일 설비 생산량
- `['shipments']`: 출하 이력
- `['defectReasons']`: 불량 사유

## 7. 상태의 기준

- WorkOrder/LOT/재고/실적: 백엔드 DB가 기준
- Equipment의 LOT 배정: 생산 시작·완료 흐름이 기준
- Equipment Running/온도/Counter: Kepware 이벤트가 실시간 기준
- `sensorStatus`: 작업자 화면의 표시·수집 제어 상태이며 DB 설비 상태와 동일한 개념이 아님

## 8. 변경 시 확인할 사항

- API DTO가 변경되면 Mutation body와 TypeScript 타입을 함께 변경합니다.
- SignalR payload가 변경되면 이벤트 리스너와 Query Key 무효화를 함께 확인합니다.
- OPC Counter는 이미 저장된 실적이므로 프론트에서 다시 등록하지 않습니다.
- 생산 시작과 설비 상태 변경 API를 중복 호출하지 않습니다.
- 현장 흐름 변경 시 통합 테스트 문서를 함께 수정합니다.
