import React, { useState, useEffect } from 'react';
import { PackagePlus, Edit2 } from 'lucide-react';
import { RawMaterial } from '@/context/AppContext';
import Modal from '@/components/common/Modal';
import * as S from './RawMaterialStatus.styles';

interface StockUpdateModalProps {
  material: RawMaterial | null;
  onClose: () => void;
  onUpdateStock: (materialId: string, stockQty: number, materialName: string, safetyQty: number) => void;
  isPending?: boolean;
}

export const StockUpdateModal: React.FC<StockUpdateModalProps> = ({
  material,
  onClose,
  onUpdateStock,
  isPending
}) => {
  const [editStockQty, setEditStockQty] = useState(0);
  const [editSafetyQty, setEditSafetyQty] = useState(0);
  const [addQty, setAddQty] = useState(50);

  useEffect(() => {
    if (material) {
      setEditStockQty(material.stockQty);
      setEditSafetyQty(material.safetyQty);
      setAddQty(50);
    }
  }, [material]);

  if (!material) return null;

  const handleStockUpdateSubmit = (e: React.FormEvent, isAddMode: boolean) => {
    e.preventDefault();
    const finalQty = isAddMode ? material.stockQty + addQty : editStockQty;
    onUpdateStock(
      material.productID,
      finalQty,
      material.name,
      editSafetyQty
    );
    onClose();
  };

  return (
    <Modal
      isOpen={!!material}
      onClose={onClose}
      title={`자재 재고 입고 & 수량 관리 (${material.name})`}
      icon={<PackagePlus size={20} />}
    >
      <S.FormContainer>
        <S.StockInfoBox>
          <div>코드: <strong>{material.productID}</strong></div>
          <div>현재 재고: <strong>{material.stockQty}</strong> (안전재고: {material.safetyQty})</div>
        </S.StockInfoBox>

        {/* 1. 빠른 입고 Form */}
        <form onSubmit={e => handleStockUpdateSubmit(e, true)}>
          <S.FormGroup>
            <S.FormLabel>📦 자재 추가 입고 (현재 재고에 +수량 추가)</S.FormLabel>
            <S.InputRowGroup>
              <S.FormInput
                type="number"
                min={1}
                value={addQty}
                onChange={e => setAddQty(parseInt(e.target.value) || 1)}
              />
              <S.BtnInlineSubmit type="submit" disabled={isPending}>
                +{addQty} EA 입고
              </S.BtnInlineSubmit>
            </S.InputRowGroup>
          </S.FormGroup>
        </form>

        <S.Divider />

        {/* 2. 수량 직접 수정 Form */}
        <form onSubmit={e => handleStockUpdateSubmit(e, false)}>
          <S.FormGridTwoCols>
            <S.FormGroup>
              <S.FormLabel><Edit2 size={12} /> 총 재고 수량 직접 변경</S.FormLabel>
              <S.FormInput
                type="number"
                min={0}
                value={editStockQty}
                onChange={e => setEditStockQty(parseInt(e.target.value) || 0)}
              />
            </S.FormGroup>
            <S.FormGroup>
              <S.FormLabel>안전 재고 수량 변경 (SafetyQty)</S.FormLabel>
              <S.FormInput
                type="number"
                min={0}
                value={editSafetyQty}
                onChange={e => setEditSafetyQty(parseInt(e.target.value) || 0)}
              />
            </S.FormGroup>
          </S.FormGridTwoCols>

          <S.ModalButtonGroup>
            <S.BtnCancel type="button" onClick={onClose}>
              닫기
            </S.BtnCancel>
            <S.BtnSubmit type="submit" disabled={isPending}>
              {isPending ? '수정 중...' : '재고 수량 수정 저장'}
            </S.BtnSubmit>
          </S.ModalButtonGroup>
        </form>
      </S.FormContainer>
    </Modal>
  );
};
