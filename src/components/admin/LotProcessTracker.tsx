import { useState } from 'react';
import { Layers } from 'lucide-react';
import { LotTracking, WorkOrder } from '@/context/AppContext';
import { GlassCard, CardTitle } from '@/pages/admin/Dashboard.styles';
import * as S from '@/components/admin/LotProcessTracker.styles';

import LotSearchPanel from '@/components/admin/LotSearchPanel';
import LotDetailsPanel from '@/components/admin/LotDetailsPanel';

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
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'RELEASED' | 'WIP' | 'HOLD' | 'COMPLETED' | 'DONE'>('ALL');

  const getStageName = (id: number) => {
    return processStages[id - 1] || '대기';
  };

  const getStatusLabel = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'RELEASED') return '대기';
    if (s === 'WIP') return '진행중';
    if (s === 'HOLD') return '보류';
    if (s === 'DONE' || s === 'COMPLETED') return '완료';
    return status;
  };

  const getStatusClass = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'RELEASED') return 'released';
    if (s === 'WIP') return 'wip';
    if (s === 'HOLD') return 'hold';
    if (s === 'DONE' || s === 'COMPLETED') return 'completed';
    return s.toLowerCase();
  };

  const filteredLots = lotTracking.filter(lot => {
    if (statusFilter !== 'ALL') {
      const lotStatus = lot.status.toUpperCase();
      const filterStatus = statusFilter.toUpperCase();
      
      if (filterStatus === 'COMPLETED' || filterStatus === 'DONE') {
        if (lotStatus !== 'COMPLETED' && lotStatus !== 'DONE') return false;
      } else {
        if (lotStatus !== filterStatus) return false;
      }
    }

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

  return (
    <GlassCard>
      <CardTitle style={{ marginBottom: '1rem' }}>
        <Layers size={18} />
        실시간 공정 흐름 및 LOT 추적
      </CardTitle>

      <S.TrackerLayout>
        <LotSearchPanel
          filteredLots={filteredLots}
          workOrders={workOrders}
          activeLotId={activeLotId}
          onSelectLot={setSelectedLotId}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          getStageName={getStageName}
          getStatusLabel={getStatusLabel}
          getStatusClass={getStatusClass}
        />

        <LotDetailsPanel
          selectedLot={selectedLot}
          associatedOrder={associatedOrder}
          processStages={processStages}
          getStageName={getStageName}
          getStatusLabel={getStatusLabel}
          getStatusClass={getStatusClass}
        />
      </S.TrackerLayout>
    </GlassCard>
  );
}

export default LotProcessTracker;
