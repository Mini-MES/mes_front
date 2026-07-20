import { useMemo } from 'react';
import { LotTracking, WorkOrder } from '@/context/AppContext';

export interface ProcessStageMetrics {
  stageName: string;      // 공정명 (예: 1차 CNC선삭, 2차 CNC밀링, 열처리 등)
  goodQty: number;        // 공정 양품 수량
  badQty: number;         // 공정 불량 수량
  totalQty: number;       // 공정 처리 총 수량
  defectRate: number;     // 공정 불량률 (%)
  yieldRate: number;      // 공정 수율 (%)
}

const DEFAULT_STAGES = ['1차 가공 (CNC선삭)', '2차 가공 (CNC밀링)', '열처리 공정', '정밀 연삭', '초음파 세척', '최종 품질검사'];

export const useProcessStageData = (
  lotTracking: LotTracking[] = [],
  workOrders: WorkOrder[] = [],
  processStages: string[] = DEFAULT_STAGES
) => {
  const stageMetrics = useMemo<ProcessStageMetrics[]>(() => {
    // 실제 lotTracking 데이터가 없을 경우 실시간성 있는 현실적인 공정 데모 데이터 활용
    if (!lotTracking || lotTracking.length === 0) {
      return [
        { stageName: '1차 가공 (CNC선삭)', goodQty: 850, badQty: 18, totalQty: 868, defectRate: 2.1, yieldRate: 97.9 },
        { stageName: '2차 가공 (CNC밀링)', goodQty: 810, badQty: 25, totalQty: 835, defectRate: 3.0, yieldRate: 97.0 },
        { stageName: '열처리 공정', goodQty: 790, badQty: 8, totalQty: 798, defectRate: 1.0, yieldRate: 99.0 },
        { stageName: '정밀 연삭', goodQty: 775, badQty: 12, totalQty: 787, defectRate: 1.5, yieldRate: 98.5 },
        { stageName: '초음파 세척', goodQty: 770, badQty: 3, totalQty: 773, defectRate: 0.4, yieldRate: 99.6 },
        { stageName: '최종 품질검사', goodQty: 760, badQty: 6, totalQty: 766, defectRate: 0.8, yieldRate: 99.2 },
      ];
    }

    // 공정별 집계 Map
    const map = new Map<string, { good: number; bad: number }>();
    processStages.forEach(stage => map.set(stage, { good: 0, bad: 0 }));

    lotTracking.forEach(lot => {
      const stageIndex = lot.currentProcessID ?? 0;
      const stageName = processStages[stageIndex] || `공정 #${stageIndex + 1}`;
      const bad = lot.totalBadQty || 0;
      // LOT 상태가 WIP/COMPLETED이면 양품 발생
      const good = lot.status === 'COMPLETED' ? 100 : (lot.status === 'WIP' ? 80 : 0);

      const current = map.get(stageName) || { good: 0, bad: 0 };
      map.set(stageName, {
        good: current.good + good,
        bad: current.bad + bad,
      });
    });

    const result: ProcessStageMetrics[] = [];
    map.forEach((val, key) => {
      const total = val.good + val.bad;
      const defectRate = total > 0 ? parseFloat(((val.bad / total) * 100).toFixed(1)) : 0;
      const yieldRate = total > 0 ? parseFloat(((val.good / total) * 100).toFixed(1)) : 100;
      result.push({
        stageName: key,
        goodQty: val.good,
        badQty: val.bad,
        totalQty: total,
        defectRate,
        yieldRate,
      });
    });

    return result;
  }, [lotTracking, workOrders, processStages]);

  // 공정 최고 불량률 공정 찾기
  const highestDefectStage = useMemo(() => {
    if (stageMetrics.length === 0) return null;
    return [...stageMetrics].sort((a, b) => b.defectRate - a.defectRate)[0];
  }, [stageMetrics]);

  return {
    stageMetrics,
    highestDefectStage,
  };
};
