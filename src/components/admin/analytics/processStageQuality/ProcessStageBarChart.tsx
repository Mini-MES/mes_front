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
import { ProcessStageMetrics } from './useProcessStageData';
import * as S from '../ProductionQualityChart.styles';

interface ProcessStageBarChartProps {
  stageMetrics: ProcessStageMetrics[];
}

export const ProcessStageBarChart: React.FC<ProcessStageBarChartProps> = ({ stageMetrics }) => {
  return (
    <S.Card style={{ width: '100%' }}>
      <S.CardTitle>⚙️ 공정 단계별 반제품/완제품 양품 수량 및 불량률 (% Red Line)</S.CardTitle>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={stageMetrics} margin={{ top: 15, right: 25, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="stageName" stroke="#607185" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" stroke="#B0C4DE" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 10]} stroke="#FF0055" unit="%" tick={{ fontSize: 11 }} />
            <Tooltip
              cursor={{ fill: 'rgba(0, 240, 255, 0.06)', radius: 6 }}
              contentStyle={{
                backgroundColor: '#0F172A',
                borderColor: '#1E293B',
                borderRadius: '8px',
                color: '#FFF',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              }}
              formatter={(value: any, name: any) => [
                name.includes('%') ? `${value}%` : `${value} EA`,
                name
              ]}
            />
            <Legend wrapperStyle={{ color: '#B0C4DE', fontSize: '12px' }} />
            <Bar yAxisId="left" dataKey="goodQty" name="공정 양품 수량 (EA)" fill="#00F0FF" radius={[4, 4, 0, 0]} barSize={22} />
            <Bar yAxisId="left" dataKey="badQty" name="공정 불량 수량 (EA)" fill="#FF0055" radius={[4, 4, 0, 0]} barSize={22} />
            <Line yAxisId="right" type="monotone" dataKey="defectRate" name="공정 불량률 (%)" stroke="#FF0055" strokeWidth={3} dot={{ r: 5, fill: '#FF0055' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </S.Card>
  );
};
