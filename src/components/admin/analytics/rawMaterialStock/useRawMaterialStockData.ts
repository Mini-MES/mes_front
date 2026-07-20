import { useMemo } from 'react';
import { RawMaterial } from '@/context/AppContext';

export interface ProcessedStockData {
  name: string;
  stockQty: number;
  safetyQty: number;
  isShortage: boolean;
  shortageQty: number;
}

export const useRawMaterialStockData = (rawMaterials: RawMaterial[] = []) => {
  const stockChartData = useMemo<ProcessedStockData[]>(() => {

    return rawMaterials.map((m: any) => {
      const stock = m.stockQty ?? 0;
      const safety = m.safetyStock ?? m.safetyQty ?? 0;
      const isShortage = stock < safety;
      const shortageQty = isShortage ? safety - stock : 0;
      return {
        name: m.productName || m.name || m.productID,
        stockQty: stock,
        safetyQty: safety,
        isShortage,
        shortageQty,
      };
    });
  }, [rawMaterials]);

  const shortageItems = useMemo(() => {
    return stockChartData.filter(d => d.isShortage);
  }, [stockChartData]);

  return {
    stockChartData,
    shortageItems,
  };
};
