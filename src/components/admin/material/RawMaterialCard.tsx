import React from 'react';
import { AlertTriangle, PackagePlus } from 'lucide-react';
import { RawMaterial } from '@/context/AppContext';
import * as S from '@/components/admin/material/RawMaterialStatus.styles';

interface RawMaterialCardProps {
  material: RawMaterial;
  onOpenStockModal: (mat: RawMaterial) => void;
}

export const RawMaterialCard: React.FC<RawMaterialCardProps> = ({
  material,
  onOpenStockModal
}) => {
  const isWarning = material.stockQty < material.safetyQty;

  return (
    <S.MaterialCard $isWarning={isWarning}>
      <S.MaterialCardHeader>
        <S.MaterialName>{material.name}</S.MaterialName>
        <S.MaterialIdText>{material.productID}</S.MaterialIdText>
      </S.MaterialCardHeader>

      <S.StockDisplayRow>
        <S.MaterialStock $isWarning={isWarning}>
          {material.stockQty}
        </S.MaterialStock>
        <S.StockUnit>{material.unit || '개'}</S.StockUnit>
      </S.StockDisplayRow>

      <S.MaterialCardFooter>
        <S.SafetyStockText>안전재고: {material.safetyQty}</S.SafetyStockText>
        <S.StatusBadge className={isWarning ? 'alert' : 'completed'}>
          {isWarning ? (
            <>
              <AlertTriangle size={10} /> 부족
            </>
          ) : (
            '충분'
          )}
        </S.StatusBadge>
      </S.MaterialCardFooter>

      <S.BtnStockAction onClick={() => onOpenStockModal(material)}>
        <PackagePlus size={14} />
        입고 / 재고 수정
      </S.BtnStockAction>
    </S.MaterialCard>
  );
};
