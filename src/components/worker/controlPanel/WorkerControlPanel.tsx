import { useState } from 'react';
import { Play, CheckCircle, Wrench, Radio, Pause } from 'lucide-react';
import { CardTitle } from '@/pages/worker/WorkerDashboard.styles';
import * as S from '@/components/worker/controlPanel/WorkerControlPanel.styles';
import WorkerStageStepper from '@/components/worker/controlPanel/WorkerStageStepper';
import WorkerDefectForm from '@/components/worker/controlPanel/WorkerDefectForm';
import SensorCounterDisplay from '@/components/worker/controlPanel/SensorCounterDisplay';
import WorkerDowntimeModal from '@/components/worker/controlPanel/WorkerDowntimeModal';
import { SENSOR_STATUS_MAP, WorkerControlPanelProps } from '@/types';

export function WorkerControlPanel({
  activeOrder,
  activeLot,
  processStages,
  equipments,
  activeEquipment,
  openDowntimeLog,
  downtimeReasons,
  defectReasons = [],
  sensorStatus,
  accumulatedGood,
  accumulatedBad,
  lastPulseTime,
  onStart,
  onTogglePause,
  onRegisterDefect,
  onNextStage,
  onComplete,
  onRegisterDowntime,
  isPending
}: WorkerControlPanelProps) {
  const [toolId, setToolId] = useState<string>('TOOL-001');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>('CNC01');
  const [isDowntimeModalOpen, setIsDowntimeModalOpen] = useState(false);

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

  const totalGoodCount = Math.max(activeOrder.totalGoodQty, accumulatedGood);
  const totalBadCount = Math.max(activeOrder.totalBadQty, accumulatedBad);
  const isPlanCompleted = totalGoodCount >= activeOrder.targetQty;
  const isOrderCompleted = activeOrder.status === 'Completed';
  const isOrderCreated = activeOrder.status === 'Created';
  const isLotHold = activeLot?.status?.toUpperCase() === 'HOLD';

  const getEquipmentIdsForStage = (stageName: string) => {
    if (stageName.includes('선삭')) return ['CNC01', 'CNC02'];
    if (stageName.includes('밀링')) return ['CNC03', 'CNC04'];
    if (stageName.includes('연삭')) return ['CNC05'];
    return [];
  };

  const nextStageName = isLastStage ? '' : getStageName(currentStageID + 1);
  const eligibleEquipmentIds = getEquipmentIdsForStage(isOrderCreated ? getStageName(currentStageID) : nextStageName);
  const selectableEquipments = equipments.filter((equipment) =>
    eligibleEquipmentIds.includes(equipment.equipmentID) &&
    !['MAINTENANCE', 'ERROR', 'OFF'].includes(equipment.status) &&
    !equipment.currentLotID
  );

  const selectedEquipment = selectableEquipments.some((equipment) => equipment.equipmentID === selectedEquipmentId)
    ? selectedEquipmentId
    : selectableEquipments[0]?.equipmentID ?? '';

  const statusInfo = SENSOR_STATUS_MAP[sensorStatus] || SENSOR_STATUS_MAP.IDLE;
  const canTogglePause = !isOrderCompleted && !isLotHold && (sensorStatus === 'RUNNING' || sensorStatus === 'STOPPED');

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
            <S.FormSelect value={selectedEquipment} onChange={(event) => setSelectedEquipmentId(event.target.value)}>
              {selectableEquipments.map((equipment) => (
                <option key={equipment.equipmentID} value={equipment.equipmentID}>
                  {equipment.equipmentID} - {equipment.equipmentName}
                </option>
              ))}
            </S.FormSelect>
            <S.BtnActionPrimary onClick={() => onStart(selectedEquipment)} disabled={isPending.start || !selectedEquipment}>
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

            {/* 실시간 센서 자동 수량 디스플레이 */}
            <SensorCounterDisplay 
              totalGoodCount={totalGoodCount}
              targetQty={activeOrder.targetQty}
              accumulatedGood={accumulatedGood}
              totalBadCount={totalBadCount}
              accumulatedBad={accumulatedBad}
              lastPulseTime={lastPulseTime}
            />

            {!isOrderCompleted && (
              <S.PauseButton 
                onClick={onTogglePause} 
                $isPaused={sensorStatus === 'STOPPED'}
                disabled={!canTogglePause}
              >
                {sensorStatus === 'STOPPED' ? <Play size={16} /> : <Pause size={16} />}
                {sensorStatus === 'STOPPED' ? '센서 수집 재개' : '생산 일시 중지 (비가동)'}
              </S.PauseButton>
            )}

            {openDowntimeLog && activeEquipment && !openDowntimeLog.reasonCode && (
              <S.BtnDanger onClick={() => setIsDowntimeModalOpen(true)} disabled={isPending.downtime}>
                비가동 사유 입력 ({activeEquipment.equipmentID})
              </S.BtnDanger>
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
              isPendingQty={isPending?.defect ?? false}
              toolId={toolId}
              onRegisterDefect={onRegisterDefect}
            />

            <S.ControlGroup style={{ marginTop: '1rem' }}>
              {eligibleEquipmentIds.length > 0 && (
                <S.FormSelect value={selectedEquipment} onChange={(event) => setSelectedEquipmentId(event.target.value)}>
                  {selectableEquipments.map((equipment) => (
                    <option key={equipment.equipmentID} value={equipment.equipmentID}>
                      다음 설비: {equipment.equipmentID} - {equipment.equipmentName}
                    </option>
                  ))}
                </S.FormSelect>
              )}
              <S.TransitionButton 
                onClick={() => onNextStage(toolId, selectedEquipment || undefined)}
                disabled={isLastStage || isOrderCompleted || Boolean(isPending?.next) || Boolean(isPending?.defect) || isLotHold || (eligibleEquipmentIds.length > 0 && !selectedEquipment)}
              >
                {isPending?.next ? '공정 이동 중...' : `다음 공정 단계로 이동 (${getStageName(currentStageID)} ➡️ ${isLastStage ? '종료' : getStageName(currentStageID + 1)})`}
              </S.TransitionButton>
            </S.ControlGroup>

            <S.ActionFooter>
              <S.BtnActionPrimary 
                onClick={onComplete}
                disabled={isOrderCompleted || !isLastStage || !isPlanCompleted || Boolean(isPending?.complete) || Boolean(isPending?.defect) || isLotHold}
              >
                <CheckCircle size={18} />
                {isOrderCompleted ? '작업 완료됨' : '최종 공정 완료 마감'}
              </S.BtnActionPrimary>
            </S.ActionFooter>
          </>
        )}
      </S.ControlContainer>

      <WorkerDowntimeModal
        isOpen={isDowntimeModalOpen}
        equipment={activeEquipment}
        reasons={downtimeReasons}
        isPending={isPending.downtime}
        onClose={() => setIsDowntimeModalOpen(false)}
        onSubmit={onRegisterDowntime}
      />
    </S.WorkerControlPanelWrapper>
  );
};
