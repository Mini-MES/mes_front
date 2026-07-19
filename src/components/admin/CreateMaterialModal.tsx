import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '@/components/common/Modal';
import * as S from './RawMaterialStatus.styles';

interface CreateMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (material: { productID: string; productName: string; stockQty: number; safetyQty: number }) => void;
  isPending?: boolean;
}

export const CreateMaterialModal: React.FC<CreateMaterialModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isPending
}) => {
  const [productID, setProductID] = useState('');
  const [productName, setProductName] = useState('');
  const [stockQty, setStockQty] = useState(100);
  const [safetyQty, setSafetyQty] = useState(20);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productID.trim() || !productName.trim()) {
      alert('자재 코드와 자재명을 입력해 주세요.');
      return;
    }
    onSubmit({
      productID: productID.trim(),
      productName: productName.trim(),
      stockQty,
      safetyQty
    });
    onClose();
    setProductID('');
    setProductName('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="신규 원자재 품목 등록"
      icon={<Plus size={20} />}
    >
      <form onSubmit={handleSubmit}>
        <S.FormContainer>
          <S.FormGroup>
            <S.FormLabel>자재 코드 (ProductID)</S.FormLabel>
            <S.FormInput
              placeholder="예: MAT-RAW-01"
              value={productID}
              onChange={e => setProductID(e.target.value)}
              required
            />
          </S.FormGroup>
          <S.FormGroup>
            <S.FormLabel>자재 품목명 (ProductName)</S.FormLabel>
            <S.FormInput
              placeholder="예: 고강도 알루미늄 철판"
              value={productName}
              onChange={e => setProductName(e.target.value)}
              required
            />
          </S.FormGroup>
          <S.FormGridTwoCols>
            <S.FormGroup>
              <S.FormLabel>초기 재고 수량</S.FormLabel>
              <S.FormInput
                type="number"
                min={0}
                value={stockQty}
                onChange={e => setStockQty(parseInt(e.target.value) || 0)}
              />
            </S.FormGroup>
            <S.FormGroup>
              <S.FormLabel>안전 재고 수량 (SafetyQty)</S.FormLabel>
              <S.FormInput
                type="number"
                min={0}
                value={safetyQty}
                onChange={e => setSafetyQty(parseInt(e.target.value) || 0)}
              />
            </S.FormGroup>
          </S.FormGridTwoCols>

          <S.ModalButtonGroup>
            <S.BtnCancel type="button" onClick={onClose}>
              취소
            </S.BtnCancel>
            <S.BtnSubmit type="submit" disabled={isPending}>
              {isPending ? '등록 중...' : '신규 자재 등록'}
            </S.BtnSubmit>
          </S.ModalButtonGroup>
        </S.FormContainer>
      </form>
    </Modal>
  );
};
