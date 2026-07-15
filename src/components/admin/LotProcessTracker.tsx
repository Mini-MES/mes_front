import React, { useState } from 'react';
import { Layers, Search } from 'lucide-react';
import { LotTracking, WorkOrder } from '@/context/AppContext';
import { GlassCard, CardTitle } from '@/pages/admin/Dashboard.styles';
import {
  FormSelect,
  StatusBadge,
  FlowContainer,
  FlowStepBar,
  FlowStep,
  FlowStepCircle,
  FlowStepLabel,
  LotDetailGrid,
  LotDetailInfo,
  LotDetailItem
} from './LotProcessTracker.styles';

interface LotProcessTrackerProps {
  lotTracking: LotTracking[];
  workOrders: WorkOrder[];
  processStages: string[];
}

// 공정 ID -> 이름 매핑 헬퍼
const processMap: Record<number, string> = {
  1: '자재투입',
  2: '가공',
  3: '조립',
  4: '검사',
  5: '포장'
};
const getStageName = (id: number) => processMap[id] || '자재투입';

const LotProcessTracker: React.FC<LotProcessTrackerProps> = ({
  lotTracking,
  workOrders,
  processStages
}) => {
  const [selectedLotId, setSelectedLotId] = useState('');

  const activeLotId = selectedLotId || lotTracking[0]?.lotID || '';
  const selectedLot = lotTracking.find(l => l.lotID === activeLotId);
  const associatedOrder = selectedLot ? workOrders.find(o => o.orderID === selectedLot.orderID) : undefined;

  const getStageIndex = (stageId: number) => {
    return stageId - 1;
  };

  return (
    <GlassCard>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <CardTitle style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
          <Layers size={18} />
          실시간 공정 흐름 및 LOT 추적
        </CardTitle>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <FormSelect 
            style={{ width: '220px', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
            value={activeLotId}
            onChange={(e) => setSelectedLotId(e.target.value)}
          >
            {lotTracking.map(lot => (
              <option key={lot.lotID} value={lot.lotID}>{lot.lotID} (지시: {lot.orderID})</option>
            ))}
          </FormSelect>
        </div>
      </div>

      {selectedLot ? (
        <FlowContainer>
          {/* LOT 기본 정보 */}
          <LotDetailGrid>
            <LotDetailInfo>
              <LotDetailItem>
                <span>추적 LOT ID</span>
                <span style={{ color: 'var(--color-primary)' }}>{selectedLot.lotID}</span>
              </LotDetailItem>
              <LotDetailItem>
                <span>현재 공정단계</span>
                <StatusBadge className="processing">{getStageName(selectedLot.currentProcessID)}</StatusBadge>
              </LotDetailItem>
            </LotDetailInfo>
            <LotDetailInfo>
              <LotDetailItem>
                <span>연계 지시 ID</span>
                <span>WO-{selectedLot.orderID}</span>
              </LotDetailItem>
              <LotDetailItem>
                <span>생산 진척도</span>
                <span>{associatedOrder ? `${associatedOrder.totalGoodQty} / ${associatedOrder.targetQty} EA` : '정보 없음'}</span>
              </LotDetailItem>
            </LotDetailInfo>
            <LotDetailInfo>
              <LotDetailItem>
                <span>불량 수량</span>
                <span style={{ color: selectedLot.totalBadQty > 0 ? 'var(--color-danger)' : 'inherit' }}>{selectedLot.totalBadQty} EA</span>
              </LotDetailItem>
              <LotDetailItem>
                <span>LOT 상태</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{selectedLot.status}</span>
              </LotDetailItem>
            </LotDetailInfo>
          </LotDetailGrid>

          {/* 가로형 스테퍼 흐름도 */}
          <FlowStepBar>
            {processStages.map((stage, idx) => {
              const currentIdx = getStageIndex(selectedLot.currentProcessID);
              const isCompleted = idx < currentIdx || selectedLot.status === 'COMPLETED';
              const isActive = idx === currentIdx && selectedLot.status !== 'COMPLETED';
              
              return (
                <FlowStep key={stage}>
                  <FlowStepCircle $active={isActive} $completed={isCompleted}>
                    {idx + 1}
                  </FlowStepCircle>
                  <FlowStepLabel $active={isActive} $completed={isCompleted}>{stage}</FlowStepLabel>
                </FlowStep>
              );
            })}
          </FlowStepBar>
        </FlowContainer>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          추적할 LOT 정보가 없습니다. 상단에서 작업 지시를 추가해주세요.
        </div>
      )}
    </GlassCard>
  );
};

export default LotProcessTracker;
