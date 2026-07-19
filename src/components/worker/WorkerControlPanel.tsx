import React, { useState } from 'react';
import { Play, CheckCircle, AlertCircle, Wrench } from 'lucide-react';
import { WorkOrder, LotTracking } from '@/context/AppContext';
import { CardTitle } from '@/pages/worker/WorkerDashboard.styles';
import * as S from './WorkerControlPanel.styles';
import WorkerStageStepper from './WorkerStageStepper';
import WorkerDefectForm from './WorkerDefectForm';

export interface DefectReason {
  reasonCode: string | number;
  reasonDescription: string;
}

interface WorkerControlPanelProps {
  activeOrder?: WorkOrder;
  activeLot?: LotTracking;
  processStages: string[];
  defectReasons?: DefectReason[];
  onStart: () => void;
  onIncreaseQty: (amount: number, toolId?: string) => void;
  onRegisterDefect: (badQty: number, reasonCode: string, toolId?: string) => void;
  onNextStage: (toolId?: string) => void;
  onComplete: () => void;
  isPending: {
    start: boolean;
    qty: boolean;
    next: boolean;
    complete: boolean;
  };
}

const WorkerControlPanel: React.FC<WorkerControlPanelProps> = ({
  activeOrder,
  activeLot,
  processStages,
  defectReasons = [],
  onStart,
  onIncreaseQty,
  onRegisterDefect,
  onNextStage,
  onComplete,
  isPending
}) => {
  const [toolId, setToolId] = useState<string>('TOOL-001');

  const getStageName = (id: number) => {
    return processStages[id - 1] || '대기';
  };

  if (!activeOrder) {
    return (
      <S.WorkerControlPanelWrapper>
        <CardTitle>
          <Play size={18} />
          작업 공정 및 실적 관리
        </CardTitle>
        <S.EmptyNotice>
          진행할 작업 지시를 왼쪽 목록에서 선택해 주세요.
        </S.EmptyNotice>
      </S.WorkerControlPanelWrapper>
    );
  }

  const getStageIndex = (stageId: number) => stageId - 1;
  const currentStageID = activeLot ? activeLot.currentProcessID : 1;
  const currentStageIndex = getStageIndex(currentStageID);
  const isLastStage = currentStageIndex === processStages.length - 1;

  const isPlanCompleted = activeOrder.totalGoodQty >= activeOrder.targetQty;
  const isOrderCompleted = activeOrder.status === 'Completed';
  const isOrderCreated = activeOrder.status === 'Created';
  const isLotHold = activeLot?.status?.toUpperCase() === 'HOLD';

  return (
    <S.WorkerControlPanelWrapper>
      <CardTitle>
        <Play size={18} />
        작업 공정 및 실적 관리
      </CardTitle>

      <S.ControlContainer>
        {/* 현재 상태 정보 */}
        <S.CardInfoBlock>
          <S.WoBadge>WO-{activeOrder.orderID}</S.WoBadge>
          <S.ProductIdTitle>{activeOrder.productID}</S.ProductIdTitle>
          
          <S.InfoRow $marginTop="1rem">
            <S.InfoLabel>현재 진행 단계</S.InfoLabel>
            <S.InfoValue $color={isLotHold ? 'var(--color-danger)' : 'var(--color-info)'}>
              {activeLot ? `${getStageName(activeLot.currentProcessID)} ${isLotHold ? '(HOLD/보류)' : ''}` : '생산 대기'}
            </S.InfoValue>
          </S.InfoRow>
          
          <S.InfoRow $marginTop="0.5rem">
            <S.InfoLabel>생산 수량</S.InfoLabel>
            <S.InfoValue>{activeOrder.totalGoodQty} / {activeOrder.targetQty} EA</S.InfoValue>
          </S.InfoRow>
        </S.CardInfoBlock>

        {/* 생산 시작 버튼 제어 */}
        {isOrderCreated && (
          <S.StartGroup>
            <S.BtnActionPrimary onClick={onStart} disabled={isPending.start}>
              <Play size={16} />
              {isPending.start ? '시작 요청 중...' : '생산 지시 시작 처리'}
            </S.BtnActionPrimary>
            <S.NoticeText>
              지시를 시작해야 실적 입력 및 공정 전환이 가능합니다.
            </S.NoticeText>
          </S.StartGroup>
        )}

        {/* 공정 스태퍼 및 생산 컨트롤러 */}
        {!isOrderCreated && (
          <>
            <WorkerStageStepper 
              processStages={processStages}
              currentStageIndex={currentStageIndex}
              isOrderCompleted={isOrderCompleted}
              activeLot={activeLot}
              getStageName={getStageName}
            />

            {/* 사용 공구 (Tool ID) 설정 */}
            <S.ControlGroup>
              <S.FormLabelHeader>
                <S.FormLabelText>
                  <Wrench size={14} style={{ color: 'var(--color-primary)' }} />
                  사용 공구 ID (Tool ID)
                </S.FormLabelText>
                {toolId && (
                  <S.ConfiguredBadge>
                    설정됨: {toolId}
                  </S.ConfiguredBadge>
                )}
              </S.FormLabelHeader>
              <S.FormInput 
                type="text"
                placeholder="예: TOOL-001, TOOL-CUTTER-01"
                value={toolId}
                onChange={(e) => setToolId(e.target.value)}
                disabled={isOrderCompleted || isLotHold}
              />
            </S.ControlGroup>

            {/* 실적 추가 버튼 */}
            <S.ControlGroup>
              <S.FormLabelText>생산 수량 실적 등록 (+EA)</S.FormLabelText>
              <S.QuantityController>
                <S.BtnQty 
                  onClick={() => onIncreaseQty(1, toolId)}
                  disabled={isOrderCompleted || isPlanCompleted || isPending.qty || isLotHold}
                >
                  +1
                </S.BtnQty>
                <S.BtnQty 
                  onClick={() => onIncreaseQty(10, toolId)}
                  disabled={isOrderCompleted || (activeOrder.totalGoodQty + 10 > activeOrder.targetQty) || isPending.qty || isLotHold}
                >
                  +10
                </S.BtnQty>
                <S.BtnQty 
                  onClick={() => onIncreaseQty(activeOrder.targetQty - activeOrder.totalGoodQty, toolId)}
                  disabled={isOrderCompleted || isPlanCompleted || isPending.qty || isLotHold}
                >
                  남은 전량 채우기
                </S.BtnQty>
              </S.QuantityController>
            </S.ControlGroup>

            {/* 불량 실적 등록 폼 */}
            <WorkerDefectForm 
              defectReasons={defectReasons}
              isOrderCompleted={isOrderCompleted}
              isPendingQty={isPending.qty}
              toolId={toolId}
              onRegisterDefect={onRegisterDefect}
            />

            {/* 공정 이동 버튼 */}
            <S.ControlGroup>
              <S.FormLabelHeader>
                <S.FormLabelText>공정 단계 전환</S.FormLabelText>
                {isLotHold ? (
                  <S.HoldWarningBadge>🚫 LOT 보류(HOLD) 상태 - 공정 이동 불가</S.HoldWarningBadge>
                ) : activeOrder.totalGoodQty === 0 ? (
                  <S.WarningBadge>⚠️ 실적 등록 후 이동 가능</S.WarningBadge>
                ) : null}
              </S.FormLabelHeader>
              <S.TransitionButton 
                onClick={() => {
                  if (isLotHold) {
                    alert('해당 LOT는 불량 발생으로 인한 보류(HOLD) 상태입니다. 보류 해제 후 이동 가능합니다.');
                    return;
                  }
                  if (activeOrder.totalGoodQty === 0) {
                    alert('현재 공정의 양품 실적을 최소 1개 이상 등록한 후 다음 공정으로 이동할 수 있습니다.');
                    return;
                  }
                  onNextStage(toolId);
                }}
                disabled={isLastStage || isOrderCompleted || isPending.next || activeOrder.totalGoodQty === 0 || isLotHold}
              >
                {isPending.next ? '공정 이동 중...' : `다음 공정 단계로 이동 (${getStageName(currentStageID)} ➡️ ${isLastStage ? '종료' : getStageName(currentStageID + 1)})`}
              </S.TransitionButton>
            </S.ControlGroup>

            {/* 최종 작업 완료 처리 버튼 */}
            <S.ActionFooter>
              <S.BtnActionPrimary 
                onClick={onComplete}
                disabled={isOrderCompleted || !isLastStage || !isPlanCompleted || isPending.complete}
              >
                <CheckCircle size={18} />
                {isOrderCompleted ? '작업 완료됨' : '최종 공정 완료 처리'}
              </S.BtnActionPrimary>
              
              {!isOrderCompleted && (!isLastStage || !isPlanCompleted) && (
                <S.CompleteHint>
                  <AlertCircle size={12} />
                  <span>마지막 '{processStages[processStages.length - 1]}' 단계 및 목표 수량({activeOrder.targetQty} EA) 도달 시 완료 가능</span>
                </S.CompleteHint>
              )}
            </S.ActionFooter>
          </>
        )}
      </S.ControlContainer>
    </S.WorkerControlPanelWrapper>
  );
};

export default WorkerControlPanel;
