import React from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { ProcessedOrderData } from './useProductionQualityData';
import * as S from '../ProductionQualityChart.styles';

interface ProductionBarChartProps {
  data: ProcessedOrderData[];
}

export const ProductionBarChart: React.FC<ProductionBarChartProps> = ({ data }) => {
  return (
    <S.Card>
      <S.CardTitle>🎯 완제품/반제품 양품 & 불량 실적</S.CardTitle>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="name" stroke="#607185" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" stroke="#B0C4DE" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 20]} stroke="#FF0055" unit="%" tick={{ fontSize: 11 }} />
            <Tooltip
              cursor={{ fill: 'rgba(0, 240, 255, 0.06)', radius: 6 }}
              contentStyle={{
                backgroundColor: '#0F172A',
                borderColor: '#1E293B',
                borderRadius: '8px',
                color: '#FFF',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              }}
            />
            <Legend wrapperStyle={{ color: '#B0C4DE', fontSize: '12px' }} />
            <Bar yAxisId="left" dataKey="targetQty" name="목표량" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={14} />
            <Bar yAxisId="left" dataKey="finishedGoodQty" name="완제품 양품" fill="#00FF66" radius={[4, 4, 0, 0]} barSize={14} />
            <Bar yAxisId="left" dataKey="semiGoodQty" name="반제품 양품" fill="#FFB800" radius={[4, 4, 0, 0]} barSize={14} />
            <Bar yAxisId="left" dataKey="totalBadQty" name="불량 수량" fill="#FF0055" radius={[4, 4, 0, 0]} barSize={14} />
            <Line yAxisId="right" type="monotone" dataKey="defectRate" name="불량률 (%)" stroke="#FF0055" strokeWidth={2.5} dot={{ r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </S.Card>
  );
};
