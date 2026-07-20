import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  Cell 
} from 'recharts';
import { Package } from 'lucide-react';
import { RawMaterial } from '@/context/AppContext';
import { useRawMaterialStockData } from './rawMaterialStock/useRawMaterialStockData';
import * as S from './ProductionQualityChart.styles';

interface RawMaterialStockChartProps {
  rawMaterials?: RawMaterial[];
}

export const RawMaterialStockChart: React.FC<RawMaterialStockChartProps> = ({ rawMaterials = [] }) => {
  const { stockChartData, shortageItems } = useRawMaterialStockData(rawMaterials);

  return (
    <S.Container style={{ marginTop: '1rem' }}>
      <S.Header>
        <S.Title>
          <Package size={22} color="#00F0FF" />
          자재별 현재 재고 vs 안전재고 비교 (부족 자재 Red 표시)
        </S.Title>
        {shortageItems.length > 0 ? (
          <S.Badge style={{ color: '#FF0055', borderColor: 'rgba(255, 0, 85, 0.4)', background: 'rgba(255, 0, 85, 0.1)' }}>
            ⚠️ 재고 부족 자재 {shortageItems.length}건 경고
          </S.Badge>
        ) : (
          <S.Badge style={{ color: '#00FF66', borderColor: 'rgba(0, 255, 102, 0.4)', background: 'rgba(0, 255, 102, 0.1)' }}>
            ✅ 전 자재 안전재고 충족
          </S.Badge>
        )}
      </S.Header>

      <S.Card style={{ width: '100%' }}>
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockChartData} margin={{ top: 15, right: 25, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="name" stroke="#607185" tick={{ fontSize: 11 }} />
              <YAxis stroke="#B0C4DE" tick={{ fontSize: 11 }} />
              <Tooltip
                cursor={{ fill: 'rgba(0, 240, 255, 0.06)', radius: 6 }}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#1E293B',
                  borderRadius: '8px',
                  color: '#FFF',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                }}
                formatter={(value: any, name: any) => [`${value} EA`, name]}
              />
              <Legend wrapperStyle={{ color: '#B0C4DE', fontSize: '12px' }} />
              <Bar dataKey="stockQty" name="현재 재고 (EA)" radius={[4, 4, 0, 0]} barSize={22}>
                {stockChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isShortage ? '#FF0055' : '#00F0FF'} />
                ))}
              </Bar>
              <Bar dataKey="safetyQty" name="안전 재고 (EA)" fill="#FFB800" radius={[4, 4, 0, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </S.Card>
    </S.Container>
  );
};

export default RawMaterialStockChart;
