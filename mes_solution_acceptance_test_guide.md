# Mini-MES 핵심 생산 시나리오 테스트 가이드

이 문서는 현재 구현된 React 프론트엔드, ASP.NET Core 백엔드, Kepware OPC UA 연동을 함께 검증하는 통합 테스트 절차입니다.

## 1. 준비 사항

- `mes_server`와 SQL Server 실행
- `mes_front` 개발 서버 실행
- Kepware OPC UA Endpoint `opc.tcp://127.0.0.1:49320` 실행
- CNC01~CNC05 Device 활성화
- 설비별 `Counter`, `Running`, `Temperature` Tag 품질이 `Good`인지 확인
- 관리자와 작업자 계정 준비
- 테스트 제품의 BOM, 공정 순서, 원자재 재고 준비

## 2. 핵심 흐름

```text
WorkOrder 생성
→ LOT 자동 생성
→ CNC01 생산 시작
→ OPC Counter 자동 실적
→ 재고/OEE/SignalR 갱신
→ 수동 불량 및 HOLD
→ 공정 이동
→ 마지막 공정 목표 달성
→ WorkOrder/LOT 완료
→ 완제품 출하
```

## 3. WorkOrder와 LOT 생성

1. 관리자 화면에서 제품과 목표 수량을 입력해 WorkOrder를 생성합니다.
2. 작업지시 목록과 LOT 추적 화면을 확인합니다.

통과 기준:

- WorkOrder 상태가 `Created`
- 대상 제품, 목표 수량, 시작일과 납기일이 정확함
- WorkOrder 소속 LOT이 하나 생성됨
- LOT 상태가 `RELEASED`
- LOT의 현재 공정이 제품 공정 순서의 첫 공정

## 4. 생산 시작과 설비 연결

1. 작업자 화면에서 생성한 WorkOrder를 선택합니다.
2. 생산 시작 버튼을 누릅니다.
3. 브라우저 Network에서 요청을 확인합니다.

```http
POST /api/Production/start/{orderId}

{
  "lotId": "LOT-...",
  "equipmentID": "CNC01"
}
```

통과 기준:

- WorkOrder가 `InProgress`
- LOT이 `WIP`
- CNC01이 `Running`
- CNC01의 `CurrentLotId`가 선택한 LOT
- 다른 설비에는 해당 LOT이 연결되지 않음
- 프론트가 `/Equipment/status`를 중복 호출하지 않음

예외 확인:

- 원자재가 부족하면 생산 시작이 거부됨
- 다른 WorkOrder의 LOT을 전달하면 거부됨
- CNC01이 다른 LOT을 점유 중이면 거부됨
- 사용할 수 없는 설비 상태이면 거부됨

## 5. OPC Counter 자동 실적

1. 생산 시작 전에 CNC01 Counter를 증가시킵니다.
2. Counter 수신 로그는 발생하지만 Performance가 생성되지 않는지 확인합니다.
3. 생산 시작 후 CNC01 Counter를 1 증가시킵니다.
4. 다시 Counter를 한 번에 5 증가시킵니다.

통과 기준:

- 시작 전 Counter는 실적에 반영되지 않음
- 시작 후 증가량 1은 현재 LOT·현재 공정에 양품 1개로 등록됨
- 증가량 5는 양품 5개로 등록됨
- `InputQty`와 `GoodQty`가 실제 증가량과 일치함
- 필요한 원자재가 실제 투입량 기준으로 차감됨
- CNC01 일일 생산량과 OEE가 갱신됨
- 작업자 화면의 Counter가 SignalR로 갱신됨
- 프론트가 OPC 양품을 `/performance/register`로 다시 전송하지 않음

설비 분리 확인:

- LOT이 없는 CNC02 Counter 증가 시 수신 로그만 발생하고 실적은 생성되지 않아야 함
- CNC01 증가량이 CNC02~CNC05 실적으로 기록되지 않아야 함
- Counter 감소는 Reset으로 처리되고 음수 실적이 생성되지 않아야 함

## 6. 불량 등록과 HOLD

1. 작업자 화면에서 불량 수량과 사유 코드를 선택합니다.
2. 불량 등록을 실행합니다.

통과 기준:

- `GoodQty = 0`
- `BadQty = 입력 수량`
- `InputQty = 입력 수량`
- ReasonCode가 저장됨
- LOT이 `HOLD`
- HOLD 상태에서는 추가 실적 및 공정 이동이 차단됨
- 관리자 화면에 불량/HOLD 알림이 표시됨
- 재고가 불량 투입량을 포함하여 차감됨

예외 확인:

- 불량 수량이 0보다 큰데 ReasonCode가 없으면 등록이 거부됨
- 음수 수량은 거부됨
- `GoodQty + BadQty > InputQty`이면 거부됨

관리자가 LOT 보류 해제를 실행하면 LOT이 `WIP`으로 돌아오는지 확인합니다.

## 7. 공정 이동

1. 현재 공정의 생산 수량을 확인합니다.
2. 다음 공정 이동을 실행합니다.

통과 기준:

- LOT의 `CurrentProcessID`가 다음 순서 공정으로 변경됨
- 프론트가 기존 OPC 누적 양품을 다시 전송하지 않음
- 0수량 Performance 레코드가 생성되지 않음
- 기존 Performance, 재고와 WorkOrder 수량이 중복 증가하지 않음
- LOT 변경 SignalR 이벤트로 관리자와 작업자 화면이 갱신됨

다음 공정 설비 배정이 필요한 경우 해당 설비에 LOT을 명시적으로 연결한 뒤 Counter 테스트를 반복합니다.

## 8. 목표 수량과 완료

1. 마지막 공정에서 목표 수량까지 Counter를 증가시킵니다.
2. WorkOrder, LOT, 설비, 완제품 재고를 확인합니다.

통과 기준:

- 마지막 공정 양품만 WorkOrder `TotalGoodQty`에 반영됨
- 목표 수량 달성 시 WorkOrder가 `Completed`
- LOT이 `COMPLETED`
- 연결 설비가 `Idle`
- 설비의 `CurrentLotId`가 `null`
- 완제품 재고가 마지막 공정 양품만큼 증가함
- 완료 상태가 SignalR로 화면에 반영됨
- 완료 후 추가 OPC 실적이 등록되지 않음

## 9. 출하

1. 관리자 화면에서 완료된 WorkOrder와 제품을 선택합니다.
2. 출하 수량과 목적지를 입력해 출하합니다.

통과 기준:

- 완제품 재고가 출하 수량만큼 차감됨
- 출하 이력이 생성됨
- 보유 수량을 초과한 출하는 거부됨

## 10. 실시간 화면 갱신

관리자 화면과 작업자 화면을 동시에 열어 다음 이벤트를 발생시킵니다.

- 생산 시작
- OPC Counter 증가
- Temperature 변경
- 불량 등록과 HOLD
- HOLD 해제
- 공정 이동
- WorkOrder 완료

통과 기준:

- SignalR 이벤트 수신 후 관련 React Query 캐시가 무효화됨
- WorkOrder, LOT, 재고, 설비, OEE 화면이 최신 서버 상태로 갱신됨
- CNC01~CNC05 온도가 각각 올바른 설비 카드에 표시됨
- 동일 이벤트로 알림이나 수량이 중복 반영되지 않음

## 11. 최종 합격 기준

- WorkOrder → LOT → Equipment → Performance → Inventory → 완료 흐름이 끊기지 않음
- OPC 이벤트가 올바른 Equipment와 CurrentLot에만 반영됨
- OPC 양품과 작업자 불량 입력이 중복 등록되지 않음
- 상태와 수량이 DB, REST 응답, SignalR 화면에서 일치함
- Critical/High 수준의 실행 오류 없이 전체 시나리오를 완료할 수 있음
