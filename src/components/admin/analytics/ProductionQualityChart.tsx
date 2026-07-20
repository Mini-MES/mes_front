import React from 'react';
import { Activity } from 'lucide-react';
import { WorkOrder, RawMaterial } from '@/context/AppContext';
import { useProductionQualityData } from './productionQuality/useProductionQualityData';
import { KPIHeaderCards } from './productionQuality/KPIHeaderCards';
import { ProductionBarChart } from './productionQuality/ProductionBarChart';
import { StatusPieChart } from './productionQuality/StatusPieChart';
import * as S from './ProductionQualityChart.styles';

interface ProductionQualityChartProps {
  workOrders?: WorkOrder[];
  rawMaterials?: RawMaterial[];
}

export const ProductionQualityChart: React.FC<ProductionQualityChartProps> = ({ 
  workOrders = [],
  rawMaterials = []
}) => {
  // 데이터 가공 로직 분리 (Custom Hook)
  const { chartData, statusSummary, summaryKPI } = useProductionQualityData(workOrders, rawMaterials);

  return (
    <S.Container>
      {/* 1. 헤더 */}
      <S.Header>
        <S.Title>
          <Activity size={22} color="#00F0FF" />
          생산 실적 (완제품/반제품) & 불량률 모니터링
        </S.Title>
        <S.Badge>LIVE REAL-DATA</S.Badge>
      </S.Header>

      {/* 2. 요약 KPI 위젯 카드 */}
      <KPIHeaderCards summaryKPI={summaryKPI} />

      {/* 3. 차트 영역 (2열 배치) */}
      <S.ChartsGrid>
        <ProductionBarChart data={chartData} />
        <StatusPieChart statusSummary={statusSummary} />
      </S.ChartsGrid>
    </S.Container>
  );
};

export default ProductionQualityChart;
