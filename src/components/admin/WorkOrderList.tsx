import React from 'react';
import { TrendingUp } from 'lucide-react';
import { WorkOrder } from '@/context/AppContext';
import { GlassCard, CardTitle } from '@/pages/admin/Dashboard.styles';
import {
  TableContainer,
  CustomTable,
  ProgressBarContainer,
  ProgressBarFill,
  StatusBadge
} from './WorkOrderList.styles';

interface WorkOrderListProps {
  workOrders: WorkOrder[];
}

const WorkOrderList: React.FC<WorkOrderListProps> = ({ workOrders }) => {
  return (
    <GlassCard>
      <CardTitle>
        <TrendingUp size={18} />
        생산 작업 지시 현황
      </CardTitle>
      <TableContainer>
        <CustomTable>
          <thead>
            <tr>
              <th>지시번호</th>
              <th>품명</th>
              <th>계획수량</th>
              <th>생산수량</th>
              <th>진척도</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {workOrders.map(order => {
              const progress = Math.round((order.totalGoodQty / order.targetQty) * 100) || 0;
              const isCompleted = order.status === 'Completed';
              const isProcessing = order.status === 'InProgress';
              
              return (
                <tr key={order.orderID}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{order.orderID}</td>
                  <td style={{ fontWeight: 600 }}>{order.productID}</td>
                  <td>{order.targetQty}</td>
                  <td>{order.totalGoodQty}</td>
                  <td style={{ width: '150px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{progress}%</span>
                      <ProgressBarContainer>
                        <ProgressBarFill style={{ width: `${progress}%` }} />
                      </ProgressBarContainer>
                    </div>
                  </td>
                  <td>
                    <StatusBadge className={isCompleted ? 'completed' : isProcessing ? 'processing' : 'pending'}>
                      {isCompleted ? '완료' : isProcessing ? '진행중' : '대기'}
                    </StatusBadge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </CustomTable>
      </TableContainer>
    </GlassCard>
  );
};

export default WorkOrderList;
