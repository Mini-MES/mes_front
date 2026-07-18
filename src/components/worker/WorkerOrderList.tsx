import React from 'react';
import { FileText } from 'lucide-react';
import { WorkOrder, LotTracking } from '@/context/AppContext';
import { GlassCard, CardTitle } from '@/pages/worker/WorkerDashboard.styles';
import {
  WorkItemCard,
  WorkItemInfo,
  WorkItemId,
  WorkItemTitle,
  WorkItemQty,
  ProgressBarContainer,
  ProgressBarFill,
  StatusBadge
} from './WorkerOrderList.styles';

interface WorkerOrderListProps {
  workOrders: WorkOrder[];
  lotTracking: LotTracking[];
  activeOrderId: number | null;
  onSelectOrder: (id: number) => void;
  processStages: string[];
}

const WorkerOrderList: React.FC<WorkerOrderListProps> = ({
  workOrders,
  lotTracking,
  activeOrderId,
  onSelectOrder,
  processStages
}) => {
  const getStageName = (id: number) => {
    return processStages[id - 1] || '대기';
  };

  return (
    <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <CardTitle>
        <FileText size={18} />
        진행 가능한 작업 지시 목록
      </CardTitle>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {workOrders.map(order => {
          const isSelected = order.orderID === activeOrderId;
          const progress = Math.round((order.totalGoodQty / order.targetQty) * 100) || 0;
          const activeLot = lotTracking.find(l => l.orderID === order.orderID);
          
          return (
            <WorkItemCard 
              key={order.orderID} 
              $isSelected={isSelected}
              onClick={() => onSelectOrder(order.orderID)}
            >
              <WorkItemInfo>
                <WorkItemId>WO-{order.orderID} | {order.orderDate.slice(0, 10)}</WorkItemId>
                <WorkItemTitle>{order.productID}</WorkItemTitle>
                <WorkItemQty>
                  계획: {order.targetQty} EA / 현재 생산: {order.totalGoodQty} EA ({progress}%)
                </WorkItemQty>
                <ProgressBarContainer style={{ width: '200px', marginTop: '0.25rem' }}>
                  <ProgressBarFill style={{ width: `${progress}%` }} />
                </ProgressBarContainer>
              </WorkItemInfo>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <StatusBadge className={order.status === 'Completed' ? 'completed' : order.status === 'InProgress' ? 'processing' : 'pending'}>
                  {order.status === 'Completed' ? '완료' : order.status === 'InProgress' ? '진행중' : '대기'}
                </StatusBadge>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  공정: {activeLot ? getStageName(activeLot.currentProcessID) : '대기'}
                </span>
              </div>
            </WorkItemCard>
          );
        })}
      </div>
    </GlassCard>
  );
};

export default WorkerOrderList;
