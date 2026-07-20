import React from 'react';
import { Layers } from 'lucide-react';
import { LotTracking, WorkOrder } from '@/context/AppContext';
import { useProcessStageData } from './processStageQuality/useProcessStageData';
import { ProcessStageBarChart } from './processStageQuality/ProcessStageBarChart';
import * as S from './ProductionQualityChart.styles';

interface ProcessStageQualityChartProps {
  lotTracking?: LotTracking[];
  workOrders?: WorkOrder[];
  processStages?: string[];
}

export const ProcessStageQualityChart: React.FC<ProcessStageQualityChartProps> = ({
  lotTracking = [],
  workOrders = [],
  processStages = [],
}) => {
  const { stageMetrics, highestDefectStage } = useProcessStageData(lotTracking, workOrders, processStages);

  return (
    <S.Container style={{ marginTop: '1.5rem' }}>
      <S.Header>
        <S.Title>
          <Layers size={22} color="#FFB800" />
          공정 단계별 반제품/완제품 실시간 양품 수량 & 불량률
        </S.Title>
        {highestDefectStage && (
          <S.Badge style={{ color: '#FF0055', borderColor: 'rgba(255, 0, 85, 0.4)', background: 'rgba(255, 0, 85, 0.1)' }}>
            ⚠️ 불량 집중 공정: {highestDefectStage.stageName} ({highestDefectStage.defectRate}%)
          </S.Badge>
        )}
      </S.Header>

      <ProcessStageBarChart stageMetrics={stageMetrics} />
    </S.Container>
  );
};

export default ProcessStageQualityChart;
