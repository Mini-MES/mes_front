import React from 'react';
import { FileText } from 'lucide-react';
import { WorkOrder, LotTracking } from '@/context/AppContext';
import { GlassCard, CardTitle } from '@/pages/worker/WorkerDashboard.styles';
import * as S from '@/components/worker/orderList/WorkerOrderList.styles';

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
    <GlassCard>
      <S.OrderCardWrapper>
        <CardTitle>
          <FileText size={18} />
          진행 가능한 작업 지시 목록
        </CardTitle>
        
        <S.OrderListContainer>
          {workOrders.map(order => {
            const isSelected = order.orderID === activeOrderId;
            const progress = Math.round((order.totalGoodQty / order.targetQty) * 100) || 0;
            const activeLot = lotTracking.find(l => l.orderID === order.orderID);
            
            return (
              <S.WorkItemCard 
                key={order.orderID} 
                $isSelected={isSelected}
                onClick={() => onSelectOrder(order.orderID)}
              >
                <S.WorkItemInfo>
                  <S.WorkItemId>WO-{order.orderID} | {order.orderDate.slice(0, 10)}</S.WorkItemId>
                  <S.WorkItemTitle>{order.productID}</S.WorkItemTitle>
                  <S.WorkItemQty>
                    계획: {order.targetQty} EA / 현재 생산: {order.totalGoodQty} EA ({progress}%)
                  </S.WorkItemQty>
                  <S.ProgressBarContainer>
                    <S.ProgressBarFill $widthPercent={progress} />
                  </S.ProgressBarContainer>
                </S.WorkItemInfo>
                
                <S.StatusGroup>
                  <S.StatusBadge className={order.status === 'Completed' ? 'completed' : order.status === 'InProgress' ? 'processing' : 'pending'}>
                    {order.status === 'Completed' ? '완료' : order.status === 'InProgress' ? '진행중' : '대기'}
                  </S.StatusBadge>
                  <S.ProcessLabel>
                    공정: {activeLot ? getStageName(activeLot.currentProcessID) : '대기'}
                  </S.ProcessLabel>
                </S.StatusGroup>
              </S.WorkItemCard>
            );
          })}
        </S.OrderListContainer>
      </S.OrderCardWrapper>
    </GlassCard>
  );
};

export default WorkerOrderList;
