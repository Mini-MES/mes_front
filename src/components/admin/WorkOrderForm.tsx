import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { GlassCard, CardTitle } from '@/pages/admin/Dashboard.styles';
import {
  FormGroup,
  FormInput,
  FormSelect,
  BtnSubmit
} from './WorkOrderForm.styles';

interface WorkOrderFormProps {
  onSubmit: (order: { productID: string; planQty: number }) => void;
  isPending: boolean;
}

const WorkOrderForm: React.FC<WorkOrderFormProps> = ({ onSubmit, isPending }) => {
  const [formData, setFormData] = useState({
    productID: '스마트 HMI 패널',
    planQty: 100
  });

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
      alert('올바른 제품명과 계획수량을 입력해주세요.');
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
        <FormGroup>
          <label>생산 대상 제품</label>
          <FormSelect 
            name="productID" 
            value={formData.productID} 
            onChange={handleInputChange}
          >
            <option value="스마트 HMI 패널">스마트 HMI 패널 (알루미늄 프레임, 강화유리 필요)</option>
            <option value="임베디드 제어기">임베디드 제어기 (컨트롤러 칩셋 필요)</option>
            <option value="산업용 게이트웨이">산업용 게이트웨이 (연결 케이블 필요)</option>
          </FormSelect>
        </FormGroup>

        <FormGroup>
          <label>계획 수량 (EA)</label>
          <FormInput 
            type="number" 
            name="planQty"
            value={formData.planQty}
            onChange={handleInputChange}
            min="10"
            max="5000"
          />
        </FormGroup>

        <BtnSubmit type="submit" disabled={isPending}>
          {isPending ? '등록 중...' : '작업 지시 및 LOT 생성'}
        </BtnSubmit>
      </form>
    </GlassCard>
  );
};

export default WorkOrderForm;
