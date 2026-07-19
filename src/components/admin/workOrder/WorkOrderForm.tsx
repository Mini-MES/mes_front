import { useState, useEffect, useMemo } from 'react';
import { PlusCircle } from 'lucide-react';
import { GlassCard, CardTitle } from '@/pages/admin/Dashboard.styles';
import * as S from './WorkOrderForm.styles';
import React from 'react';

interface WorkOrderFormProps {
  onSubmit: (order: { productID: string; planQty: number }) => void;
  isPending: boolean;
  products: any[];
}

export const WorkOrderForm: React.FC<WorkOrderFormProps> = ({ onSubmit, isPending, products }) => {
  const producibleProducts = useMemo(() => {
    return products.filter(
      item => item.itemType === 'FinishedProduct' || item.itemType === 'SemiFinishedProduct' || item.itemType === 0 || item.itemType === 1
    );
  }, [products]);

  const [formData, setFormData] = useState({
    productID: '',
    planQty: 100
  });

  useEffect(() => {
    if (producibleProducts.length > 0 && !formData.productID) {
      setFormData(prev => ({
        ...prev,
        productID: producibleProducts[0].productID
      }));
    }
  }, [producibleProducts, formData.productID]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productID || formData.planQty <= 0) {
      alert('올바른 제품과 계획수량을 선택해주세요.');
      return;
    }
    onSubmit({
      productID: formData.productID,
      planQty: Number(formData.planQty)
    });
    setFormData(prev => ({
      ...prev,
      planQty: 100
    }));
  };

  return (
    <GlassCard>
      <CardTitle>
        <PlusCircle size={18} />
        신규 작업 지시 등록
      </CardTitle>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <S.FormGroup>
          <label>생산 대상 제품</label>
          <S.FormSelect 
            name="productID" 
            value={formData.productID} 
            onChange={handleInputChange}
          >
            {producibleProducts.length === 0 ? (
              <option value="">등록 가능한 품목이 없습니다</option>
            ) : (
              producibleProducts.map(prod => (
                <option key={prod.productID} value={prod.productID}>
                  {prod.productName} ({prod.productID})
                </option>
              ))
            )}
          </S.FormSelect>
        </S.FormGroup>

        <S.FormGroup>
          <label>계획 수량 (EA)</label>
          <S.FormInput 
            type="number" 
            name="planQty"
            value={formData.planQty}
            onChange={handleInputChange}
            min="10"
            max="5000"
          />
        </S.FormGroup>

        <S.BtnSubmit type="submit" disabled={isPending || producibleProducts.length === 0}>
          {isPending ? '등록 중...' : '작업 지시 및 LOT 생성'}
        </S.BtnSubmit>
      </form>
    </GlassCard>
  );
};
