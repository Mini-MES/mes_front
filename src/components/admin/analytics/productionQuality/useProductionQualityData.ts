import { useMemo } from 'react';
import { WorkOrder, RawMaterial } from '@/context/AppContext';

export interface ProcessedOrderData {
  name: string;
  targetQty: number;
  totalGoodQty: number;    
  finishedGoodQty: number; 
  semiGoodQty: number;     
  totalBadQty: number;    
  defectRate: number;     
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
  const productMap = useMemo(() => {
    const map = new Map<string, { name: string; isSemi: boolean }>();
    rawMaterials.forEach((m: any) => {
      const isSemi = m.itemType === 1 || m.productName?.includes('반제품') || m.productID?.startsWith('SF-');
      map.set(m.productID, {
        name: m.productName || m.name || m.productID,
        isSemi,
      });
    });
    return map;
  }, [rawMaterials]);

  const chartData = useMemo<ProcessedOrderData[]>(() => {

    return workOrders.map((order) => {
      const target = order.targetQty || 0;
      const good = order.totalGoodQty || 0;
      const bad = order.totalBadQty || 0;
      // 목표 수량(targetQty) 대비 불량률 계산식 적용 (bad / target * 100)
      const defectRate = target > 0 ? parseFloat(((bad / target) * 100).toFixed(1)) : 0;

      const productInfo = productMap.get(order.productID);
      const isSemi = productInfo ? productInfo.isSemi : order.productID?.startsWith('SF-') || false;

      // 완제품/반제품 구분에 따라 양품 수량 할당
      const finishedGoodQty = isSemi ? 0 : good;
      const semiGoodQty = isSemi ? good : 0;

      const labelName = order.productID ? `${order.productID} (#${order.orderID})` : `지시 #${order.orderID}`;

      return {
        name: labelName,
        targetQty: target,
        totalGoodQty: good,
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

  // 3. KPI 총계 요약 계산 (목표 수량 대비 전체 불량률)
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

    const overallDefectRate = totalTarget > 0 ? ((totalBad / totalTarget) * 100).toFixed(1) : '0';
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
