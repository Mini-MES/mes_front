import React from 'react';
import { Activity, CheckCircle2, AlertOctagon, Layers } from 'lucide-react';
import { SummaryKPI } from './useProductionQualityData';
import * as S from '../ProductionQualityChart.styles';

interface KPIHeaderCardsProps {
  summaryKPI: SummaryKPI;
}

export const KPIHeaderCards: React.FC<KPIHeaderCardsProps> = ({ summaryKPI }) => {
  return (
    <S.SummaryGrid>
      <S.StatCard>
        <S.StatIcon $bg="rgba(0, 240, 255, 0.1)" $color="#00F0FF">
          <Activity size={20} />
        </S.StatIcon>
        <div>
          <S.StatLabel>전체 목표 달성률</S.StatLabel>
          <S.StatValue $color={summaryKPI.overallAchievement >= 80 ? '#00FF66' : '#FFB800'}>
            {summaryKPI.overallAchievement}%
          </S.StatValue>
        </div>
      </S.StatCard>

      <S.StatCard>
        <S.StatIcon $bg="rgba(0, 255, 102, 0.1)" $color="#00FF66">
          <CheckCircle2 size={20} />
        </S.StatIcon>
        <div>
          <S.StatLabel>완제품 양품 (출하가능)</S.StatLabel>
          <S.StatValue $color="#00FF66">
            {summaryKPI.totalFinishedGood.toLocaleString()} EA
          </S.StatValue>
        </div>
      </S.StatCard>

      <S.StatCard>
        <S.StatIcon $bg="rgba(255, 184, 0, 0.1)" $color="#FFB800">
          <Layers size={20} />
        </S.StatIcon>
        <div>
          <S.StatLabel>반제품 양품 (공정대기)</S.StatLabel>
          <S.StatValue $color="#FFB800">
            {summaryKPI.totalSemiGood.toLocaleString()} EA
          </S.StatValue>
        </div>
      </S.StatCard>

      <S.StatCard>
        <S.StatIcon $bg="rgba(255, 0, 85, 0.1)" $color="#FF0055">
          <AlertOctagon size={20} />
        </S.StatIcon>
        <div>
          <S.StatLabel>누적 불량 수량 (불량률)</S.StatLabel>
          <S.StatValue $color={Number(summaryKPI.overallDefectRate) > 3 ? '#FF0055' : '#8A99AD'}>
            {summaryKPI.totalBad.toLocaleString()} EA ({summaryKPI.overallDefectRate}%)
          </S.StatValue>
        </div>
      </S.StatCard>
    </S.SummaryGrid>
  );
};
