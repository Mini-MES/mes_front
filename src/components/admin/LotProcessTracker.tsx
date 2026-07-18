import { useState } from 'react';
import { Layers, Search } from 'lucide-react';
import { LotTracking, WorkOrder } from '@/context/AppContext';
import { GlassCard, CardTitle } from '@/pages/admin/Dashboard.styles';
import * as S from '@/components/admin/LotProcessTracker.styles';

interface LotProcessTrackerProps {
  lotTracking: LotTracking[];
  workOrders: WorkOrder[];
  processStages: string[];
}

export function LotProcessTracker({
  lotTracking,
  workOrders,
  processStages
}: LotProcessTrackerProps) {
  const [selectedLotId, setSelectedLotId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'RELEASED' | 'WIP' | 'HOLD' | 'COMPLETED'>('ALL');

  const getStageName = (id: number) => {
    return processStages[id - 1] || '대기';
  };

  const filteredLots = lotTracking.filter(lot => {
    if (statusFilter !== 'ALL' && lot.status !== statusFilter) {
      return false;
    }

    // 검색어 필터링 (LOT ID, 지시번호, 품목명 검색)
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const matchedOrder = workOrders.find(o => o.orderID === lot.orderID);
    const productName = matchedOrder ? matchedOrder.productID.toLowerCase() : '';

    return (
      lot.lotID.toLowerCase().includes(term) ||
      String(lot.orderID).includes(term) ||
      productName.includes(term)
    );
  });

  const activeLotId = selectedLotId && filteredLots.some(l => l.lotID === selectedLotId)
    ? selectedLotId
    : filteredLots[0]?.lotID || '';

  const selectedLot = lotTracking.find(l => l.lotID === activeLotId);
  const associatedOrder = selectedLot ? workOrders.find(o => o.orderID === selectedLot.orderID) : undefined;

  const getStageIndex = (stageId: number) => {
    return stageId - 1;
  };

  return (
    <GlassCard>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <CardTitle style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
          <Layers size={18} />
          실시간 공정 흐름 및 LOT 추적
        </CardTitle>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.65rem', color: 'var(--text-muted)' }} />
            <S.SearchInput 
              type="text" 
              placeholder="LOT ID, 지시, 품명 검색..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedLotId('');
              }}
              style={{ paddingLeft: '2rem' }}
            />
          </div>

          <S.FormSelect 
            style={{ width: '220px', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
            value={activeLotId}
            onChange={(e) => setSelectedLotId(e.target.value)}
          >
            {filteredLots.map(lot => (
              <option key={lot.lotID} value={lot.lotID}>
                {lot.lotID} (지시: {lot.orderID})
              </option>
            ))}
            {filteredLots.length === 0 && (
              <option value="">검색 결과 없음</option>
            )}
          </S.FormSelect>
        </div>
      </div>

      <S.FilterToolbar style={{ borderBottom: 'none', marginBottom: '1.5rem', paddingTop: 0, paddingBottom: 0 }}>
        <S.FilterButtonGroup>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginRight: '0.5rem', fontWeight: 500 }}>상태 필터:</span>
          {(['ALL', 'RELEASED', 'WIP', 'HOLD', 'COMPLETED'] as const).map(status => (
            <S.FilterButton 
              key={status} 
              $active={statusFilter === status}
              onClick={() => {
                setStatusFilter(status);
                setSelectedLotId(''); 
              }}
            >
              {status === 'ALL' ? '전체' : status === 'RELEASED' ? '대기' : status === 'WIP' ? '진행중' : status === 'HOLD' ? '보류' : '완료'}
            </S.FilterButton>
          ))}
        </S.FilterButtonGroup>
        {(searchTerm || statusFilter !== 'ALL') && (
          <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
            검색 결과: {filteredLots.length}건
          </span>
        )}
      </S.FilterToolbar>

      {selectedLot ? (
        <S.FlowContainer>
          {/* LOT 기본 정보 */}
          <S.LotDetailGrid>
            <S.LotDetailInfo>
              <S.LotDetailItem>
                <span>추적 LOT ID</span>
                <span style={{ color: 'var(--color-primary)' }}>{selectedLot.lotID}</span>
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
                <span>{associatedOrder ? `${associatedOrder.totalGoodQty} / ${associatedOrder.targetQty} EA` : '정보 없음'}</span>
              </S.LotDetailItem>
            </S.LotDetailInfo>
            <S.LotDetailInfo>
              <S.LotDetailItem>
                <span>불량 수량</span>
                <span style={{ color: selectedLot.totalBadQty > 0 ? 'var(--color-danger)' : 'inherit' }}>{selectedLot.totalBadQty} EA</span>
              </S.LotDetailItem>
              <S.LotDetailItem>
                <span>LOT 상태</span>
                <S.StatusBadge className={selectedLot.status.toLowerCase()}>{selectedLot.status}</S.StatusBadge>
              </S.LotDetailItem>
            </S.LotDetailInfo>
          </S.LotDetailGrid>

          <S.FlowStepBar>
            {processStages.map((stage, idx) => {
              const currentIdx = getStageIndex(selectedLot.currentProcessID);
              const isCompleted = idx < currentIdx || selectedLot.status === 'COMPLETED';
              const isActive = idx === currentIdx && selectedLot.status !== 'COMPLETED';
              
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
        </S.FlowContainer>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--text-muted)' }}>
          추적할 LOT 정보가 없습니다. 검색어 또는 필터 상태를 확인해 주세요.
        </div>
      )}
    </GlassCard>
  );
};

export default LotProcessTracker;
