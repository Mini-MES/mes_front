import React from 'react';
import { Truck } from 'lucide-react';
import { GlassCard, CardTitle } from '@/pages/admin/Dashboard.styles';
import * as S from '@/components/admin/ShipmentList.styles';

interface ShipmentListProps {
  shipments: any[];
  isLoading: boolean;
}

export const ShipmentList: React.FC<ShipmentListProps> = ({ shipments, isLoading }) => {
  return (
    <GlassCard>
      <CardTitle style={{ marginBottom: '1rem' }}>
        <Truck size={18} />
        완제품 출하 이력 현황 (Shipment Log)
      </CardTitle>

      <S.TableContainer>
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            출하 이력을 로드하는 중...
          </div>
        ) : shipments.length > 0 ? (
          <S.CustomTable>
            <thead>
              <tr>
                <th>출하 번호</th>
                <th>연계 지시 ID</th>
                <th>품목 코드</th>
                <th>출하 수량</th>
                <th>출하처 (목적지)</th>
                <th>출하 일시</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map(ship => {
                const formattedTime = new Date(ship.shipmentDate).toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                });

                return (
                  <tr key={ship.shipmentID}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                      SH-{ship.shipmentID}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      WO-{ship.workOrderID}
                    </td>
                    <td style={{ color: 'var(--color-primary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      {ship.productID}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {ship.quantity.toLocaleString()} EA
                    </td>
                    <td>
                      <S.DestinationBadge>{ship.destination}</S.DestinationBadge>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                      {formattedTime}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </S.CustomTable>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
            출하 완료된 이력이 없습니다. 완제품 출하 등록 폼에서 출하를 진행해 주세요.
          </div>
        )}
      </S.TableContainer>
    </GlassCard>
  );
};

export default ShipmentList;
