import React from 'react';
import { Send } from 'lucide-react';
import { GlassCard, CardTitle } from '@/pages/admin/Dashboard.styles';
import * as S from './ShipmentForm.styles';
import { WorkOrder } from '@/context/AppContext';
import { useShipmentForm } from './useShipmentForm';

interface ShipmentFormProps {
  onSubmit: (shipment: { productID: string; workOrderID: number; quantity: number; destination: string }) => void;
  isPending: boolean;
  products: any[];
  workOrders: WorkOrder[];
}

export function ShipmentForm({ onSubmit, isPending, products, workOrders }: ShipmentFormProps) {
  const {
    completedOrders,
    formData,
    destQuantity,
    selectedProductStock,
    handleQuantityChange,
    handleOrderChange,
    handleInputChange,
    handleSubmit
  } = useShipmentForm({ products, workOrders, onSubmit });

  return (
    <GlassCard>
      <CardTitle>
        <Send size={18} />
        완제품 출하 등록
      </CardTitle>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <S.FormGroup>
          <label>연계 완료 지시 (Work Order)</label>
          <S.FormSelect
            name="workOrderID"
            value={formData.workOrderID}
            onChange={handleOrderChange}
          >
            {completedOrders.length === 0 ? (
              <option value="">출하 가능한 완료 지시가 없습니다</option>
            ) : (
              completedOrders.map(order => (
                <option key={order.orderID} value={order.orderID}>
                  WO-{order.orderID} | {order.productID}
                </option>
              ))
            )}
          </S.FormSelect>
        </S.FormGroup>

        <S.FormGroup>
          <label>출하 품목 코드 (자동 선택)</label>
          <S.FormInput
            type="text"
            name="productID"
            value={formData.productID || '지시를 먼저 선택해주세요'}
            disabled
            style={{ opacity: 0.7, background: 'rgba(255, 255, 255, 0.02)' }}
          />
        </S.FormGroup>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <S.FormGroup>
            <label>창고 재고 수량 (EA)</label>
            <S.FormInput
              type="text"
              value={formData.productID ? `${selectedProductStock} EA` : '-'}
              disabled
              style={{ opacity: 0.7, background: 'rgba(255, 255, 255, 0.02)', fontFamily: 'var(--font-mono)' }}
            />
          </S.FormGroup>

          <S.FormGroup>
            <label>출하 수량 (EA)</label>
            <S.FormInput
              type="number"
              name="quantity"
              value={destQuantity}
              onChange={handleQuantityChange}
              min="1"
              max={selectedProductStock || 9999}
              disabled={completedOrders.length === 0}
            />
          </S.FormGroup>
        </div>

        <S.FormGroup>
          <label>출하 목적지 (고객사명)</label>
          <S.FormInput
            type="text"
            name="destination"
            placeholder="예: 현대자동차 울산공장"
            value={formData.destination}
            onChange={handleInputChange}
            disabled={completedOrders.length === 0}
          />
        </S.FormGroup>

        <S.BtnSubmit 
          type="submit" 
          disabled={isPending || completedOrders.length === 0 || selectedProductStock === 0}
        >
          {isPending ? '출하 등록 중...' : '완제품 출하 실행'}
        </S.BtnSubmit>
      </form>
    </GlassCard>
  );
}

export default ShipmentForm;
