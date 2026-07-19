import { useState } from 'react';
import { Database, Plus } from 'lucide-react';
import { RawMaterial } from '@/context/AppContext';
import { GlassCard } from '@/pages/admin/Dashboard.styles';
import * as S from './RawMaterialStatus.styles';

import { CreateMaterialModal } from './CreateMaterialModal';
import { StockUpdateModal } from './StockUpdateModal';
import { RawMaterialCard } from './RawMaterialCard';

interface RawMaterialStatusProps {
  rawMaterials: RawMaterial[];
  onCreateMaterial?: (material: { productID: string; productName: string; stockQty: number; safetyQty: number }) => void;
  onUpdateStock?: (materialId: string, stockQty: number, materialName: string, safetyQty: number) => void;
  isPending?: boolean;
}

export function RawMaterialStatus({ 
  rawMaterials,
  onCreateMaterial,
  onUpdateStock,
  isPending
}: RawMaterialStatusProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | null>(null);

  return (
    <GlassCard>
      <S.CardHeaderRow>
        <S.HeaderLeftGroup>
          <Database size={18} style={{ color: 'var(--color-primary)' }} />
          <S.HeaderTitleText>실시간 원자재 재고 현황</S.HeaderTitleText>
        </S.HeaderLeftGroup>
        <S.BtnAddMaterial onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={16} />
          + 신규 원자재 등록
        </S.BtnAddMaterial>
      </S.CardHeaderRow>

      <S.MaterialGrid>
        {rawMaterials
          .filter(item => (item as any).itemType === 'RawMaterial' || (item as any).itemType === 0)
          .map(mat => (
            <RawMaterialCard
              key={mat.productID}
              material={mat}
              onOpenStockModal={setSelectedMaterial}
            />
          ))}
      </S.MaterialGrid>

      {/* 1. 신규 자재 등록 공통 모달 */}
      {onCreateMaterial && (
        <CreateMaterialModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={onCreateMaterial}
          isPending={isPending}
        />
      )}

      {/* 2. 자재 재고 입고/수정 공통 모달 */}
      {onUpdateStock && (
        <StockUpdateModal
          material={selectedMaterial}
          onClose={() => setSelectedMaterial(null)}
          onUpdateStock={onUpdateStock}
          isPending={isPending}
        />
      )}
    </GlassCard>
  );
};