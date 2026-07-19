import React from 'react';
import { TrendingUp } from 'lucide-react';
import { WorkOrder } from '@/context/AppContext';
import { GlassCard, CardTitle } from '@/pages/admin/Dashboard.styles';
import * as S from '@/components/admin/workOrder/WorkOrderList.styles';

interface WorkOrderListProps {
  workOrders: WorkOrder[];
  products?: any[];
  onStartOrder?: (orderID: number) => void;
  onCompleteOrder?: (orderID: number) => void;
  onDeleteOrder?: (orderID: number) => void;
}

export const WorkOrderList: React.FC<WorkOrderListProps> = ({ 
  workOrders, 
  products = [],
  onStartOrder, 
  onCompleteOrder, 
  onDeleteOrder 
}) => {
  return (
    <GlassCard>
      <CardTitle>
        <TrendingUp size={18} />
        생산 작업 지시 현황
      </CardTitle>
      <S.TableContainer>
        <S.CustomTable>
          <thead>
            <tr>
              <th>지시번호</th>
              <th>품명</th>
              <th>계획수량</th>
              <th>생산수량</th>
              <th>진척도</th>
              <th>상태</th>
              <th style={{ textAlign: 'center' }}>제어</th>
            </tr>
          </thead>
          <tbody>
            {workOrders.map(order => {
              const progress = Math.round((order.totalGoodQty / order.targetQty) * 100) || 0;
              const isCompleted = order.status === 'Completed';
              const isProcessing = order.status === 'InProgress';
              
              const matchedProduct = products.find(p => p.productID === order.productID);
              const displayName = matchedProduct ? matchedProduct.productName : order.productID;
              
              return (
                <tr key={order.orderID}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{order.orderID}</td>
                  <td style={{ fontWeight: 600 }}>{displayName}</td>
                  <td>{order.targetQty}</td>
                  <td>{order.totalGoodQty}</td>
                  <td style={{ width: '150px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{progress}%</span>
                      <S.ProgressBarContainer>
                        <S.ProgressBarFill $widthPercent={progress} />
                      </S.ProgressBarContainer>
                    </div>
                  </td>
                  <td>
                    <S.StatusBadge className={isCompleted ? 'completed' : isProcessing ? 'processing' : 'pending'}>
                      {isCompleted ? '완료' : isProcessing ? '진행중' : '대기'}
                    </S.StatusBadge>
                  </td>
                  <td style={{ width: '130px', textAlign: 'center' }}>
                    {order.status === 'Created' && (
                      <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                        <S.ActionButton className="start" onClick={() => onStartOrder?.(order.orderID)}>
                          시작
                        </S.ActionButton>
                        <S.ActionButton className="delete" onClick={() => {
                          if (confirm(`지시번호 [${order.orderID}]를 삭제하시겠습니까?`)) {
                            onDeleteOrder?.(order.orderID);
                          }
                        }}>
                          삭제
                        </S.ActionButton>
                      </div>
                    )}
                    {isProcessing && (
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <S.ActionButton className="complete" onClick={() => onCompleteOrder?.(order.orderID)}>
                          완료
                        </S.ActionButton>
                      </div>
                    )}
                    {isCompleted && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </S.CustomTable>
      </S.TableContainer>
    </GlassCard>
  );
};
