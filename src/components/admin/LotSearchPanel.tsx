import React from 'react';
import { Search } from 'lucide-react';
import { LotTracking, WorkOrder } from '@/context/AppContext';
import * as S from '@/components/admin/LotProcessTracker.styles';

interface LotSearchPanelProps {
  filteredLots: LotTracking[];
  workOrders: WorkOrder[];
  activeLotId: string;
  onSelectLot: (id: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: 'ALL' | 'RELEASED' | 'WIP' | 'HOLD' | 'COMPLETED' | 'DONE';
  onStatusFilterChange: (status: 'ALL' | 'RELEASED' | 'WIP' | 'HOLD' | 'COMPLETED' | 'DONE') => void;
  getStageName: (id: number) => string;
  getStatusLabel: (status: string) => string;
  getStatusClass: (status: string) => string;
}

export const LotSearchPanel: React.FC<LotSearchPanelProps> = ({
  filteredLots,
  workOrders,
  activeLotId,
  onSelectLot,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  getStageName,
  getStatusLabel,
  getStatusClass
}) => {
  return (
    <S.LotSearchPanel>
      <S.SearchInputWrapper>
        <Search size={16} />
        <S.SearchInput
          type="text"
          placeholder="LOT ID, 지시, 품목 검색..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </S.SearchInputWrapper>

      <div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>상태별 필터</span>
        <S.FilterButtonGroup>
          {(['ALL', 'RELEASED', 'WIP', 'HOLD', 'COMPLETED'] as const).map((status) => (
            <S.FilterButton
              key={status}
              $active={statusFilter === status || (status === 'COMPLETED' && statusFilter === 'DONE')}
              onClick={() => onStatusFilterChange(status)}
            >
              {status === 'ALL' ? '전체' : status === 'RELEASED' ? '대기' : status === 'WIP' ? '진행중' : status === 'HOLD' ? '보류' : '완료'}
            </S.FilterButton>
          ))}
        </S.FilterButtonGroup>
      </div>

      <S.LotListContainer>
        {filteredLots.length > 0 ? (
          filteredLots.map(lot => {
            const isActive = lot.lotID === activeLotId;
            const matchedOrder = workOrders.find(o => o.orderID === lot.orderID);
            const displayProduct = matchedOrder ? matchedOrder.productID : '알 수 없음';
            
            return (
              <S.LotListItem
                key={lot.lotID}
                $active={isActive}
                onClick={() => onSelectLot(lot.lotID)}
              >
                <S.LotListInfo>
                  <S.LotListId>{lot.lotID}</S.LotListId>
                  <S.LotListSub>{displayProduct} (지시: {lot.orderID})</S.LotListSub>
                </S.LotListInfo>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                  <S.StatusBadge className={getStatusClass(lot.status)}>
                    {getStatusLabel(lot.status)}
                  </S.StatusBadge>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {getStageName(lot.currentProcessID)}
                  </span>
                </div>
              </S.LotListItem>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            조건에 일치하는 LOT이 없습니다.
          </div>
        )}
      </S.LotListContainer>
    </S.LotSearchPanel>
  );
};

export default LotSearchPanel;
