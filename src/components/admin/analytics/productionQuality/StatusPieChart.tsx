import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import * as S from '../ProductionQualityChart.styles';

interface StatusPieChartProps {
  statusSummary: Array<{ name: string; value: number; color: string }>;
}

export const StatusPieChart: React.FC<StatusPieChartProps> = ({ statusSummary }) => {
  return (
    <S.Card>
      <S.CardTitle>📊 작업지시 상태 비율</S.CardTitle>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusSummary}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={5}
              dataKey="value"
            >
              {statusSummary.map((entry, index) => (
                <Cell key={`pie-cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderColor: '#1E293B',
                borderRadius: '8px',
                color: '#FFF',
              }}
              formatter={(value: any) => [`${value} 건`, '지시 수']}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              wrapperStyle={{ color: '#B0C4DE', fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </S.Card>
  );
};
