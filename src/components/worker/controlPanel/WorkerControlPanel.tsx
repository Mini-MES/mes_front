import React, { useState } from 'react';
import { Play, CheckCircle, AlertCircle, Wrench, Radio, Pause, ShieldCheck } from 'lucide-react';
import { WorkOrder, LotTracking } from '@/context/AppContext';
import { CardTitle } from '@/pages/worker/WorkerDashboard.styles';
import * as S from '@/components/worker/controlPanel/WorkerControlPanel.styles';
import WorkerStageStepper from '@/components/worker/controlPanel/WorkerStageStepper';
import WorkerDefectForm from '@/components/worker/controlPanel/WorkerDefectForm';
import { SensorStatus, SENSOR_STATUS_MAP } from '@/types/sensor';

export interface DefectReason {
  reasonCode: string | number;
  reasonDescription: string;
}

interface WorkerControlPanelProps {
  activeOrder?: WorkOrder;
  activeLot?: LotTracking;
  processStages: string[];
  defectReasons?: DefectReason[];
  sensorStatus: SensorStatus;
  accumulatedGood: number;
  accumulatedBad: number;
  lastPulseTime?: string | null;
  onStart: () => void;
  onTogglePause: () => void;
  onConfirmPerformance: (toolId?: string) => void;
  onRegisterDefect: (badQty: number, reasonCode: string, toolId?: string) => void;
  onNextStage: (toolId?: string) => void;
  onComplete: () => void;
  isPending: {
    start: boolean;
    confirm: boolean;
    next: boolean;
    complete: boolean;
  };
}

const WorkerControlPanel: React.FC<WorkerControlPanelProps> = ({
  activeOrder,
  activeLot,
  processStages,
  defectReasons = [],
  sensorStatus,
  accumulatedGood,
  accumulatedBad,
  lastPulseTime,
  onStart,
  onTogglePause,
  onConfirmPerformance,
  onRegisterDefect,
  onNextStage,
  onComplete,
  isPending
}) => {
  const [toolId, setToolId] = useState<string>('TOOL-001');
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const getStageName = (id: number) => processStages[id - 1] || '대기';

  if (!activeOrder) {
    return (
      <S.WorkerControlPanelWrapper>
        <CardTitle>
          <Radio size={18} />
          실시간 센서 연동 작업 패널
        </CardTitle>
        <S.EmptyNotice>
          진행할 작업 지시를 왼쪽 목록에서 선택해 주세요.
        </S.EmptyNotice>
      </S.WorkerControlPanelWrapper>
    );
  }

  const currentStageID = activeLot ? activeLot.currentProcessID : 1;
  const currentStageIndex = currentStageID - 1;
  const isLastStage = currentStageIndex === processStages.length - 1;

  const totalGoodCount = activeOrder.totalGoodQty + accumulatedGood;
  const totalBadCount = activeOrder.totalBadQty + accumulatedBad;
  const isPlanCompleted = totalGoodCount >= activeOrder.targetQty;
  const isOrderCompleted = activeOrder.status === 'Completed';
  const isOrderCreated = activeOrder.status === 'Created';
  const isLotHold = activeLot?.status?.toUpperCase() === 'HOLD';

  const statusInfo = SENSOR_STATUS_MAP[sensorStatus] || SENSOR_STATUS_MAP.IDLE;

  return (
    <S.WorkerControlPanelWrapper>
      <CardTitle style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio size={18} />
          실시간 센서 연동 작업 패널
        </div>
        <S.SensorBadge $color={statusInfo.color} $bg={statusInfo.bg}>
          <span className="dot" />
          {statusInfo.label}
        </S.SensorBadge>
      </CardTitle>

      <S.ControlContainer>
        <S.CardInfoBlock>
          <S.WoBadge>WO-{activeOrder.orderID}</S.WoBadge>
          <S.ProductIdTitle>{activeOrder.productID}</S.ProductIdTitle>
          
          <S.InfoRow $marginTop="1rem">
            <S.InfoLabel>현재 공정</S.InfoLabel>
            <S.InfoValue $color={isLotHold ? 'var(--color-danger)' : 'var(--color-info)'}>
              {activeLot ? `${getStageName(activeLot.currentProcessID)} ${isLotHold ? '(HOLD/보류)' : ''}` : '생산 대기'}
            </S.InfoValue>
          </S.InfoRow>
        </S.CardInfoBlock>

        {isOrderCreated && (
          <S.StartGroup>
            <S.BtnActionPrimary onClick={onStart} disabled={isPending.start}>
              <Play size={16} />
              {isPending.start ? '시작 요청 중...' : '생산 지시 시작 & 센서 가동'}
            </S.BtnActionPrimary>
            <S.NoticeText>
              생산을 시작하면 백엔드 센서 서비스가 가동되어 실시간 수량이 수집됩니다.
            </S.NoticeText>
          </S.StartGroup>
        )}

        {!isOrderCreated && (
          <>
            <WorkerStageStepper 
              processStages={processStages}
              currentStageIndex={currentStageIndex}
              isOrderCompleted={isOrderCompleted}
              activeLot={activeLot}
              getStageName={getStageName}
            />

            <S.SensorDisplayBox>
              <S.CounterBlock>
                <S.CounterLabel>🟢 실시간 양품 수량 (센서 누적)</S.CounterLabel>
                <S.CounterValue $color="#00e676">
                  {totalGoodCount} <span className="unit">/ {activeOrder.targetQty} EA</span>
                </S.CounterValue>
                {accumulatedGood > 0 && (
                  <S.PulseAddBadge>+ {accumulatedGood} EA 수집됨</S.PulseAddBadge>
                )}
              </S.CounterBlock>

              <S.CounterBlock>
                <S.CounterLabel>🔴 실시간 불량 수량</S.CounterLabel>
                <S.CounterValue $color="#ff1744">
                  {totalBadCount} <span className="unit">EA</span>
                </S.CounterValue>
                {lastPulseTime && (
                  <S.PulseTimeText>최근 수신: {lastPulseTime}</S.PulseTimeText>
                )}
              </S.CounterBlock>
            </S.SensorDisplayBox>

            {!isOrderCompleted && (
              <S.PauseButton 
                onClick={onTogglePause} 
                $isPaused={sensorStatus === 'STOPPED'}
              >
                {sensorStatus === 'STOPPED' ? <Play size={16} /> : <Pause size={16} />}
                {sensorStatus === 'STOPPED' ? '센서 수집 재개' : '생산 일시 중지 (비가동)'}
              </S.PauseButton>
            )}

            <S.ControlGroup>
              <S.FormLabelHeader>
                <S.FormLabelText>
                  <Wrench size={14} style={{ color: 'var(--color-primary)' }} />
                  사용 공구 ID (Tool ID)
                </S.FormLabelText>
                {toolId && (
                  <S.ConfiguredBadge>설정됨: {toolId}</S.ConfiguredBadge>
                )}
              </S.FormLabelHeader>
              <S.FormInput 
                type="text"
                value={toolId}
                onChange={(e) => setToolId(e.target.value)}
                disabled={isOrderCompleted || isLotHold}
              />
            </S.ControlGroup>

            <WorkerDefectForm 
              defectReasons={defectReasons}
              isOrderCompleted={isOrderCompleted}
              isPendingQty={false}
              toolId={toolId}
              onRegisterDefect={onRegisterDefect}
            />

            <S.VerificationContainer>
              <S.VerificationHeader>
                <ShieldCheck size={18} style={{ color: '#00e676' }} />
                센서 수집 수량 검증 및 최종 실적 승인
              </S.VerificationHeader>
              <S.CheckboxLabel>
                <input 
                  type="checkbox" 
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  disabled={isOrderCompleted || isLotHold || accumulatedGood === 0}
                />
                <span>센서 집계 수량({accumulatedGood} EA)이 실제 생산 수량과 일치함을 확인했습니다.</span>
              </S.CheckboxLabel>
              <S.BtnConfirm 
                onClick={() => onConfirmPerformance(toolId)}
                disabled={!isVerified || isOrderCompleted || isPending.confirm || isLotHold || accumulatedGood === 0}
              >
                {isPending.confirm ? '등록 중...' : '최종 실적 등록 승인'}
              </S.BtnConfirm>
            </S.VerificationContainer>

            <S.ControlGroup style={{ marginTop: '1rem' }}>
              <S.TransitionButton 
                onClick={() => onNextStage(toolId)}
                disabled={isLastStage || isOrderCompleted || isPending.next || isLotHold}
              >
                {isPending.next ? '공정 이동 중...' : `다음 공정 단계로 이동 (${getStageName(currentStageID)} ➡️ ${isLastStage ? '종료' : getStageName(currentStageID + 1)})`}
              </S.TransitionButton>
            </S.ControlGroup>

            <S.ActionFooter>
              <S.BtnActionPrimary 
                onClick={onComplete}
                disabled={isOrderCompleted || !isLastStage || !isPlanCompleted || isPending.complete || isLotHold}
              >
                <CheckCircle size={18} />
                {isOrderCompleted ? '작업 완료됨' : '최종 공정 완료 마감'}
              </S.BtnActionPrimary>
            </S.ActionFooter>
          </>
        )}
      </S.ControlContainer>
    </S.WorkerControlPanelWrapper>
  );
};

export default WorkerControlPanel;
