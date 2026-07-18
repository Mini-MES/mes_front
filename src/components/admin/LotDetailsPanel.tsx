import React from 'react';
import { Layers } from 'lucide-react';
import { LotTracking, WorkOrder } from '@/context/AppContext';
import * as S from '@/components/admin/LotProcessTracker.styles';

interface LotDetailsPanelProps {
  selectedLot: LotTracking | undefined;
  associatedOrder: WorkOrder | undefined;
  processStages: string[];
  getStageName: (id: number) => string;
  getStatusLabel: (status: string) => string;
  getStatusClass: (status: string) => string;
}

export const LotDetailsPanel: React.FC<LotDetailsPanelProps> = ({
  selectedLot,
  associatedOrder,
  processStages,
  getStageName,
  getStatusLabel,
  getStatusClass
}) => {
  const getStageIndex = (stageId: number) => {
    return stageId - 1;
  };

  return (
    <S.LotDetailsPanel>
      {selectedLot ? (
        <S.FlowContainer>
          <S.LotDetailGrid>
            <S.LotDetailInfo>
              <S.LotDetailItem>
                <span>추적 LOT ID</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{selectedLot.lotID}</span>
              </S.LotDetailItem>
              <S.LotDetailItem>
                <span>현재 공정단계</span>
                <S.StatusBadge className="processing">{getStageName(selectedLot.currentProcessID)}</S.StatusBadge>
              </S.LotDetailItem>
            </S.LotDetailInfo>
            <S.LotDetailInfo>
              <S.LotDetailItem>
                <span>연계 지시 ID</span>
                <span>WO-{selectedLot.orderID}</span>
              </S.LotDetailItem>
              <S.LotDetailItem>
                <span>생산 진척도</span>
                <span>
                  {associatedOrder ? `${associatedOrder.totalGoodQty} / ${associatedOrder.targetQty} EA` : '정보 없음'}
                </span>
              </S.LotDetailItem>
            </S.LotDetailInfo>
            <S.LotDetailInfo>
              <S.LotDetailItem>
                <span>불량 수량</span>
                <span style={{ color: selectedLot.totalBadQty > 0 ? 'var(--color-danger)' : 'inherit', fontWeight: selectedLot.totalBadQty > 0 ? 600 : 'normal' }}>
                  {selectedLot.totalBadQty} EA
                </span>
              </S.LotDetailItem>
              <S.LotDetailItem>
                <span>LOT 상태</span>
                <S.StatusBadge className={getStatusClass(selectedLot.status)}>
                  {getStatusLabel(selectedLot.status)}
                </S.StatusBadge>
              </S.LotDetailItem>
            </S.LotDetailInfo>
          </S.LotDetailGrid>

          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>공정 진행 상황</span>
            <S.FlowStepBar>
              {processStages.map((stage, idx) => {
                const currentIdx = getStageIndex(selectedLot.currentProcessID);
                const isCompleted = idx < currentIdx || selectedLot.status.toUpperCase() === 'COMPLETED' || selectedLot.status.toUpperCase() === 'DONE';
                const isActive = idx === currentIdx && selectedLot.status.toUpperCase() !== 'COMPLETED' && selectedLot.status.toUpperCase() !== 'DONE';
                
                return (
                  <S.FlowStep key={stage}>
                    <S.FlowStepCircle $active={isActive} $completed={isCompleted}>
                      {idx + 1}
                    </S.FlowStepCircle>
                    <S.FlowStepLabel $active={isActive} $completed={isCompleted}>{stage}</S.FlowStepLabel>
                  </S.FlowStep>
                );
              })}
            </S.FlowStepBar>
          </div>
        </S.FlowContainer>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', color: 'var(--text-muted)' }}>
          <Layers size={36} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          추적할 LOT 정보가 없습니다. 좌측 목록에서 로트를 선택하거나 검색해 주세요.
        </div>
      )}
    </S.LotDetailsPanel>
  );
};

export default LotDetailsPanel;
