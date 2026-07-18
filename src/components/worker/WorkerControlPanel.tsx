import React from 'react';
import { Play, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { WorkOrder, LotTracking } from '@/context/AppContext';
import { CardTitle } from '@/pages/worker/WorkerDashboard.styles';
import {
  WorkerControlPanelWrapper,
  ControlGroup,
  QuantityController,
  BtnQty,
  TransitionButton,
  BtnActionPrimary
} from './WorkerControlPanel.styles';

interface WorkerControlPanelProps {
  activeOrder?: WorkOrder;
  activeLot?: LotTracking;
  processStages: string[];
  onStart: () => void;
  onIncreaseQty: (amount: number) => void;
  onNextStage: () => void;
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
  onStart,
  onIncreaseQty,
  onNextStage,
  onComplete,
  isPending
}) => {
  // 공정 ID -> 이름 매핑 헬퍼 (공정 단계 동적 맵핑)
  const getStageName = (id: number) => {
    return processStages[id - 1] || '대기';
  };
  if (!activeOrder) {
    return (
      <WorkerControlPanelWrapper>
        <CardTitle>
          <Play size={18} />
          작업 공정 및 실적 관리
        </CardTitle>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          진행할 작업 지시를 왼쪽 목록에서 선택해 주세요.
        </div>
      </WorkerControlPanelWrapper>
    );
  }

  const getStageIndex = (stageId: number) => {
    return stageId - 1;
  };

  const currentStageID = activeLot ? activeLot.currentProcessID : 1;
  const currentStageIndex = getStageIndex(currentStageID);
  const isLastStage = currentStageIndex === processStages.length - 1;

  const isPlanCompleted = activeOrder.totalGoodQty >= activeOrder.targetQty;
  const isOrderCompleted = activeOrder.status === 'Completed';
  const isOrderCreated = activeOrder.status === 'Created';

  return (
    <WorkerControlPanelWrapper>
      <CardTitle>
        <Play size={18} />
        작업 공정 및 실적 관리
      </CardTitle>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* 현재 상태 정보 */}
        <div style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>WO-{activeOrder.orderID}</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--color-primary)' }}>{activeOrder.productID}</div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>현재 진행 단계</span>
            <span style={{ fontWeight: 600, color: 'var(--color-info)' }}>
              {activeLot ? getStageName(activeLot.currentProcessID) : '생산 대기'}
            </span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>생산 수량</span>
            <span style={{ fontWeight: 600 }}>{activeOrder.totalGoodQty} / {activeOrder.targetQty} EA</span>
          </div>
        </div>

        {/* 생산 시작 버튼 제어 */}
        {isOrderCreated && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <BtnActionPrimary onClick={onStart} disabled={isPending.start}>
              <Play size={16} />
              {isPending.start ? '시작 요청 중...' : '생산 지시 시작 처리'}
            </BtnActionPrimary>
            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              지시를 시작해야 실적 입력 및 공정 전환이 가능합니다.
            </div>
          </div>
        )}

        {/* 공정 스태퍼 및 생산 컨트롤러 */}
        {!isOrderCreated && (
          <>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>전체 공정 현황</span>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {processStages.map((stage, idx) => {
                  const isActive = idx === currentStageIndex;
                  const isCompleted = idx < currentStageIndex || isOrderCompleted;
                  return (
                    <div 
                      key={stage} 
                      style={{ 
                        flex: 1, 
                        height: '6px', 
                        borderRadius: '3px',
                        background: isCompleted ? 'var(--color-success)' : isActive ? 'var(--color-primary)' : 'var(--border-color)',
                        boxShadow: isActive ? '0 0 8px var(--color-primary-glow)' : 'none'
                      }}
                      title={stage}
                    />
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                <span>{processStages[0]}</span>
                <span>{activeLot ? getStageName(activeLot.currentProcessID) : ''}</span>
                <span>{processStages[processStages.length - 1]}</span>
              </div>
            </div>

            {/* 실적 추가 버튼 */}
            <ControlGroup>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>생산 수량 실적 등록 (+EA)</span>
              <QuantityController>
                <BtnQty 
                  onClick={() => onIncreaseQty(1)}
                  disabled={isOrderCompleted || isPlanCompleted || isPending.qty}
                >
                  +1
                </BtnQty>
                <BtnQty 
                  onClick={() => onIncreaseQty(10)}
                  disabled={isOrderCompleted || (activeOrder.totalGoodQty + 10 > activeOrder.targetQty) || isPending.qty}
                >
                  +10
                </BtnQty>
                <BtnQty 
                  onClick={() => onIncreaseQty(activeOrder.targetQty - activeOrder.totalGoodQty)}
                  disabled={isOrderCompleted || isPlanCompleted || isPending.qty}
                >
                  남은 전량 채우기
                </BtnQty>
              </QuantityController>
            </ControlGroup>

            {/* 공정 이동 버튼 */}
            <ControlGroup>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>공정 단계 전환</span>
              <TransitionButton 
                onClick={onNextStage}
                disabled={isLastStage || isOrderCompleted || isPending.next}
              >
                {isPending.next ? '공정 이동 중...' : `다음 공정 단계로 이동 (${getStageName(currentStageID)} ➡️ ${isLastStage ? '종료' : getStageName(currentStageID + 1)})`}
              </TransitionButton>
            </ControlGroup>

            {/* 최종 작업 완료 처리 버튼 */}
            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <BtnActionPrimary 
                onClick={onComplete}
                disabled={isOrderCompleted || !isLastStage || !isPlanCompleted || isPending.complete}
              >
                <CheckCircle size={18} />
                {isOrderCompleted ? '작업 완료됨' : '최종 공정 완료 처리'}
              </BtnActionPrimary>
              
              {!isOrderCompleted && (!isLastStage || !isPlanCompleted) && (
                <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.5rem', justifyContent: 'center' }}>
                  <AlertCircle size={12} />
                  <span>마지막 '{processStages[processStages.length - 1]}' 단계 및 계획수량 도달 시 완료 가능</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </WorkerControlPanelWrapper>
  );
};

export default WorkerControlPanel;
