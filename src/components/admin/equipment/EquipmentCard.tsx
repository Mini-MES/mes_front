import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { EquipmentItem, SensorStatus, SENSOR_STATUS_MAP } from '@/types';
import * as S from '@/components/admin/equipment/EquipmentStatusSection.styles';
import { formatTime } from '@/utils/formatTime';
import { useEquipmentTelemetry } from '@/hooks/useEquipmentTelemetry';

interface EquipmentCardProps {
  equipment: EquipmentItem;
  onChangeStatus: (equipmentID: string, newStatus: SensorStatus, currentLotID?: string | null) => void;
  onOpenDowntimeModal: (equipment: EquipmentItem) => void;
  isPending: boolean;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  equipment,
  onChangeStatus,
  onOpenDowntimeModal,
  isPending,
}) => {
  const { telemetryMap } = useEquipmentTelemetry();
  const telemetry = telemetryMap[equipment.equipmentID];
  const [runningSec, setRunningSec] = useState(equipment.totalRunningSeconds);
  const [downtimeSec, setDowntimeSec] = useState(equipment.totalDowntimeSeconds);

  useEffect(() => {
    setRunningSec(equipment.totalRunningSeconds);
    setDowntimeSec(equipment.totalDowntimeSeconds);
  }, [equipment.totalRunningSeconds, equipment.totalDowntimeSeconds]);

  useEffect(() => {
    const startTimestamp = Date.now();
    const initialRunning = equipment.totalRunningSeconds;
    const initialDowntime = equipment.totalDowntimeSeconds;

    const timer = setInterval(() => {
      const elapsedSec = Math.floor((Date.now() - startTimestamp) / 1000);
      if (equipment.status === 'RUNNING') {
        setRunningSec(initialRunning + elapsedSec);
      } else if (equipment.status === 'STOPPED' || equipment.status === 'MAINTENANCE' || equipment.status === 'ERROR') {
        setDowntimeSec(initialDowntime + elapsedSec);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [equipment.status, equipment.totalRunningSeconds, equipment.totalDowntimeSeconds]);

  const statusInfo = SENSOR_STATUS_MAP[equipment.status] || SENSOR_STATUS_MAP.IDLE;

  const totalSec = runningSec + downtimeSec;
  const availabilityRate = totalSec > 0
    ? Math.round((runningSec / totalSec) * 100)
    : 100;

  return (
    <S.EquipmentCardWrapper>
      <S.CardHeader>
        <S.EquipmentInfo>
          <S.EquipmentTitle>{equipment.equipmentName}</S.EquipmentTitle>
          <S.EquipmentIdBadge>{equipment.equipmentID} {equipment.currentLotID ? `| LOT: ${equipment.currentLotID}` : ''}</S.EquipmentIdBadge>
        </S.EquipmentInfo>

        <S.StatusBadge $color={statusInfo.color} $bg={statusInfo.bg}>
          <span className="dot" />
          {statusInfo.label}
        </S.StatusBadge>
      </S.CardHeader>

      {telemetry && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.82rem', fontWeight: 600 }}>
          <span style={{ backgroundColor: 'rgba(255,152,0,0.12)', color: '#ff9800', padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(255,152,0,0.25)' }}>
            🌡️ 실시간 온도: {telemetry.temperature}°C
          </span>
          <span style={{ backgroundColor: 'rgba(33,150,243,0.12)', color: '#2196f3', padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(33,150,243,0.25)' }}>
            📦 누적 생산량: {telemetry.totalCount} EA
          </span>
        </div>
      )}

      <S.TimerSection>
        <S.TimerRow>
          <S.TimerLabel>⏱️ 누적 가동시간</S.TimerLabel>
          <S.TimerValue $color="#00e676">{formatTime(runningSec)}</S.TimerValue>
        </S.TimerRow>
        <S.TimerRow>
          <S.TimerLabel>⏳ 누적 비가동시간</S.TimerLabel>
          <S.TimerValue $color="#ff1744">{formatTime(downtimeSec)}</S.TimerValue>
        </S.TimerRow>
      </S.TimerSection>

      <S.OeeProgressContainer>
        <S.OeeHeader>
          <span>설비 가동률 (Availability)</span>
          <span style={{ fontWeight: 700, color: '#ffffff' }}>{availabilityRate}%</span>
        </S.OeeHeader>
        <S.OeeBarTrack>
          <S.OeeBarFill $percent={availabilityRate} />
        </S.OeeBarTrack>
      </S.OeeProgressContainer>

      {equipment.status === 'STOPPED' && (
        <S.BtnDowntimeReason onClick={() => onOpenDowntimeModal(equipment)}>
          <AlertCircle size={14} />
          비가동 사유 / 원인 입력
        </S.BtnDowntimeReason>
      )}

      <S.CardActions>
        <S.StatusChangeBtn
          $active={equipment.status === 'RUNNING'}
          $color="#00e676"
          disabled={isPending || equipment.status === 'RUNNING'}
          onClick={() => onChangeStatus(equipment.equipmentID, 'RUNNING', equipment.currentLotID)}
        >
          가동
        </S.StatusChangeBtn>

        <S.StatusChangeBtn
          $active={equipment.status === 'STOPPED'}
          $color="#ff1744"
          disabled={isPending || equipment.status === 'STOPPED'}
          onClick={() => onChangeStatus(equipment.equipmentID, 'STOPPED', equipment.currentLotID)}
        >
          정지
        </S.StatusChangeBtn>

        <S.StatusChangeBtn
          $active={equipment.status === 'MAINTENANCE'}
          $color="#00b0ff"
          disabled={isPending || equipment.status === 'MAINTENANCE'}
          onClick={() => onChangeStatus(equipment.equipmentID, 'MAINTENANCE', equipment.currentLotID)}
        >
          점검
        </S.StatusChangeBtn>

        <S.StatusChangeBtn
          $active={equipment.status === 'OFF'}
          $color="#64748b"
          disabled={isPending || equipment.status === 'OFF'}
          onClick={() => onChangeStatus(equipment.equipmentID, 'OFF', equipment.currentLotID)}
        >
          전원 끄기
        </S.StatusChangeBtn>
      </S.CardActions>
    </S.EquipmentCardWrapper>
  );
};

export default EquipmentCard;