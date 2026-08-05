import React from 'react';
import { AlertCircle } from 'lucide-react';
import { EquipmentItem, SensorStatus, SENSOR_STATUS_MAP } from '@/types';
import * as S from '@/components/admin/equipment/EquipmentStatusSection.styles';

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
  const statusInfo = SENSOR_STATUS_MAP[equipment.status] || SENSOR_STATUS_MAP.IDLE;

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}시간 ${mins}분`;
    if (mins > 0) return `${mins}분 ${secs}초`;
    return `${secs}초`;
  };

  const totalSec = equipment.totalRunningSeconds + equipment.totalDowntimeSeconds;
  const availabilityRate = totalSec > 0
    ? Math.round((equipment.totalRunningSeconds / totalSec) * 100)
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

      <S.TimerSection>
        <S.TimerRow>
          <S.TimerLabel>⏱️ 누적 가동시간</S.TimerLabel>
          <S.TimerValue $color="#00e676">{formatTime(equipment.totalRunningSeconds)}</S.TimerValue>
        </S.TimerRow>
        <S.TimerRow>
          <S.TimerLabel>⏳ 누적 비가동시간</S.TimerLabel>
          <S.TimerValue $color="#ff1744">{formatTime(equipment.totalDowntimeSeconds)}</S.TimerValue>
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
      </S.CardActions>
    </S.EquipmentCardWrapper>
  );
};

export default EquipmentCard;