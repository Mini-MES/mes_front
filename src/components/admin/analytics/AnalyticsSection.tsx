import React, { useState } from 'react';
import { BarChart3, Layers, Package } from 'lucide-react';
import { WorkOrder, RawMaterial, LotTracking } from '@/context/AppContext';
import { ProductionQualityChart } from './ProductionQualityChart';
import { ProcessStageQualityChart } from './ProcessStageQualityChart';
import { RawMaterialStockChart } from './RawMaterialStockChart';
import * as S from './AnalyticsSection.styles';

interface AnalyticsSectionProps {
  workOrders?: WorkOrder[];
  rawMaterials?: RawMaterial[];
  lotTracking?: LotTracking[];
  processStages?: string[];
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  workOrders = [],
  rawMaterials = [],
  lotTracking = [],
  processStages = [],
}) => {
  const [activeTab, setActiveTab] = useState<'PRODUCTION' | 'PROCESS' | 'STOCK'>('PRODUCTION');

  return (
    <S.Container>
      <S.HeaderRow>
        <S.SectionTitle>
          <BarChart3 size={20} color="#00F0FF" />
          실시간 분석 및 시각화 모니터링
        </S.SectionTitle>

        <S.TabGroup>
          <S.TabButton
            $active={activeTab === 'PRODUCTION'}
            onClick={() => setActiveTab('PRODUCTION')}
          >
            <BarChart3 size={15} />
            생산 & 불량률 현황
          </S.TabButton>

          <S.TabButton
            $active={activeTab === 'PROCESS'}
            onClick={() => setActiveTab('PROCESS')}
          >
            <Layers size={15} />
            공정 단계별 수율
          </S.TabButton>

          <S.TabButton
            $active={activeTab === 'STOCK'}
            onClick={() => setActiveTab('STOCK')}
          >
            <Package size={15} />
            자재 재고 현황
          </S.TabButton>
        </S.TabGroup>
      </S.HeaderRow>

      {activeTab === 'PRODUCTION' && (
        <ProductionQualityChart workOrders={workOrders} rawMaterials={rawMaterials} />
      )}

      {activeTab === 'PROCESS' && (
        <ProcessStageQualityChart
          lotTracking={lotTracking}
          workOrders={workOrders}
          processStages={processStages}
        />
      )}

      {activeTab === 'STOCK' && (
        <RawMaterialStockChart rawMaterials={rawMaterials} />
      )}
    </S.Container>
  );
};

export default AnalyticsSection;
