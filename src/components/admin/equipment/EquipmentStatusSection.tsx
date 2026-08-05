import React from 'react';
import { Cpu } from 'lucide-react';
import * as S from '@/components/admin/equipment/EquipmentStatusSection.styles';
import { useEquipmentStatus } from '@/components/admin/equipment/useEquipmentStatus';
import EquipmentCard from '@/components/admin/equipment/EquipmentCard';
import DowntimeReasonModal from '@/components/admin/equipment/DowntimeReasonModal';

export const EquipmentStatusSection: React.FC = () => {
  const {
    equipments,
    downtimeReasons,
    isLoading,
    isDowntimeModalOpen,
    selectedEquipment,
    handleChangeStatus,
    handleOpenDowntimeModal,
    handleCloseDowntimeModal,
    handleSubmitDowntimeReason,
    isPending,
  } = useEquipmentStatus();

  const runningCount = equipments.filter((e) => e.status === 'RUNNING').length;
  const stoppedCount = equipments.filter((e) => e.status === 'STOPPED').length;
  const maintenanceCount = equipments.filter((e) => e.status === 'MAINTENANCE').length;

  return (
    <S.EquipmentSectionWrapper>
      <S.SectionHeader>
        <S.SectionTitle>
          <Cpu size={20} style={{ color: '#00e676' }} />
          공장 전체 설비 실시간 가동 / 비가동 현황판
        </S.SectionTitle>

        <S.SummaryBadgeGroup>
          <S.SummaryItem $color="#00e676">가동 {runningCount}대</S.SummaryItem>
          <S.SummaryItem $color="#ff1744">정지 {stoppedCount}대</S.SummaryItem>
          <S.SummaryItem $color="#00b0ff">점검 {maintenanceCount}대</S.SummaryItem>
        </S.SummaryBadgeGroup>
      </S.SectionHeader>

      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#a0aec0' }}>
          설비 실시간 모니터링 데이터를 불러오는 중...
        </div>
      ) : (
        <S.EquipmentGrid>
          {equipments.map((equipment) => (
            <EquipmentCard
              key={equipment.equipmentID}
              equipment={equipment}
              onChangeStatus={handleChangeStatus}
              onOpenDowntimeModal={handleOpenDowntimeModal}
              isPending={isPending.status}
            />
          ))}
        </S.EquipmentGrid>
      )}

      <DowntimeReasonModal
        isOpen={isDowntimeModalOpen}
        equipment={selectedEquipment}
        downtimeReasons={downtimeReasons}
        onClose={handleCloseDowntimeModal}
        onSubmit={handleSubmitDowntimeReason}
        isPending={isPending.downtime}
      />
    </S.EquipmentSectionWrapper>
  );
};

export default EquipmentStatusSection;
