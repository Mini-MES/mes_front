import { useMemo } from 'react';
import { WorkOrder, RawMaterial } from '@/context/AppContext';

export interface ProcessedOrderData {
  name: string;
  targetQty: number;
  finishedGoodQty: number; // 완제품 양품
  semiGoodQty: number;     // 반제품 양품
  totalBadQty: number;     // 불량 수량
  defectRate: number;      // 불량률 (%)
  isFinishedProduct: boolean;
}

export interface SummaryKPI {
  totalTarget: number;
  totalFinishedGood: number;
  totalSemiGood: number;
  totalBad: number;
  overallDefectRate: string;
  overallAchievement: number;
  totalOrdersCount: number;
}

export const useProductionQualityData = (
  workOrders: WorkOrder[] = [],
  rawMaterials: RawMaterial[] = []
) => {
  // 제품 ID -> itemType / 제품 타입 맵 생성
  const productMap = useMemo(() => {
    const map = new Map<string, { name: string; isSemi: boolean }>();
    rawMaterials.forEach((m: any) => {
      // itemType: 1이 반제품이거나 품목명에 반제품/WIP가 포함되면 반제품으로 판별
      const isSemi = m.itemType === 1 || m.productName?.includes('반제품') || m.productID?.startsWith('SF-');
      map.set(m.productID, {
        name: m.productName || m.name || m.productID,
        isSemi,
      });
    });
    return map;
  }, [rawMaterials]);

  // 1. 지시별 데이터 가공 (완제품 양품 vs 반제품 양품 분리)
  const chartData = useMemo<ProcessedOrderData[]>(() => {
    if (!workOrders || workOrders.length === 0) {
      return [
        { name: '스마트 모터 (#101)', targetQty: 500, finishedGoodQty: 450, semiGoodQty: 0, totalBadQty: 12, defectRate: 2.6, isFinishedProduct: true },
        { name: '하우징 반제품 (#102)', targetQty: 300, finishedGoodQty: 0, semiGoodQty: 280, totalBadQty: 5, defectRate: 1.8, isFinishedProduct: false },
        { name: '센서 모듈 (#103)', targetQty: 200, finishedGoodQty: 150, semiGoodQty: 0, totalBadQty: 8, defectRate: 5.1, isFinishedProduct: true },
        { name: '기어 1차반제품 (#104)', targetQty: 400, finishedGoodQty: 0, semiGoodQty: 380, totalBadQty: 10, defectRate: 2.6, isFinishedProduct: false },
      ];
    }

    return workOrders.map((order) => {
      const target = order.targetQty || 0;
      const good = order.totalGoodQty || 0;
      const bad = order.totalBadQty || 0;
      const totalProduced = good + bad;
      const defectRate = totalProduced > 0 ? parseFloat(((bad / totalProduced) * 100).toFixed(1)) : 0;

      const productInfo = productMap.get(order.productID);
      const isSemi = productInfo ? productInfo.isSemi : order.productID?.startsWith('SF-') || false;

      // 완제품/반제품 구분에 따라 양품 수량 할당
      const finishedGoodQty = isSemi ? 0 : good;
      const semiGoodQty = isSemi ? good : 0;

      const labelName = order.productID ? `${order.productID} (#${order.orderID})` : `지시 #${order.orderID}`;

      return {
        name: labelName,
        targetQty: target,
        finishedGoodQty,
        semiGoodQty,
        totalBadQty: bad,
        defectRate,
        isFinishedProduct: !isSemi,
      };
    });
  }, [workOrders, productMap]);

  // 2. 작업지시 상태 분포 가공
  const statusSummary = useMemo(() => {
    const counts: Record<string, number> = { Created: 0, InProgress: 0, Completed: 0 };
    workOrders.forEach((order) => {
      const st = order.status || 'Created';
      counts[st] = (counts[st] || 0) + 1;
    });

    return [
      { name: '지시 생성/대기', value: counts.Created, color: '#FFB800' },
      { name: '생산 진행 중', value: counts.InProgress, color: '#00F0FF' },
      { name: '생산 완료', value: counts.Completed, color: '#00FF66' },
    ];
  }, [workOrders]);

  // 3. KPI 총계 요약 계산
  const summaryKPI = useMemo<SummaryKPI>(() => {
    let totalTarget = 0;
    let totalFinishedGood = 0;
    let totalSemiGood = 0;
    let totalBad = 0;

    chartData.forEach((d) => {
      totalTarget += d.targetQty;
      totalFinishedGood += d.finishedGoodQty;
      totalSemiGood += d.semiGoodQty;
      totalBad += d.totalBadQty;
    });

    const totalProduced = totalFinishedGood + totalSemiGood + totalBad;
    const overallDefectRate = totalProduced > 0 ? ((totalBad / totalProduced) * 100).toFixed(1) : '0';
    const totalGoodSum = totalFinishedGood + totalSemiGood;
    const overallAchievement = totalTarget > 0 ? Math.min(100, Math.round((totalGoodSum / totalTarget) * 100)) : 0;

    return {
      totalTarget,
      totalFinishedGood,
      totalSemiGood,
      totalBad,
      overallDefectRate,
      overallAchievement,
      totalOrdersCount: workOrders.length,
    };
  }, [chartData, workOrders]);

  return {
    chartData,
    statusSummary,
    summaryKPI,
  };
};
