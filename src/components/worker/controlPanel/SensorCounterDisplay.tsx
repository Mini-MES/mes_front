import React from 'react';
import * as S from '@/components/worker/controlPanel/WorkerControlPanel.styles';

interface SensorCounterDisplayProps {
  totalGoodCount: number;
  targetQty: number;
  accumulatedGood: number;
  totalBadCount: number;
  lastPulseTime?: string | null;
}

export const SensorCounterDisplay: React.FC<SensorCounterDisplayProps> = ({
  totalGoodCount,
  targetQty,
  accumulatedGood,
  totalBadCount,
  lastPulseTime,
}) => {
  return (
    <S.SensorDisplayBox>
      <S.CounterBlock>
        <S.CounterLabel>🟢 실시간 양품 수량 (센서 누적)</S.CounterLabel>
        <S.CounterValue $color="#00e676">
          {totalGoodCount} <span className="unit">/ {targetQty} EA</span>
        </S.CounterValue>
        {accumulatedGood > 0 && (
          <S.PulseAddBadge>+ {accumulatedGood} EA 수집됨</S.PulseAddBadge>
        )}
      </S.CounterBlock>

      <S.CounterBlock>
        <S.CounterLabel>🔴 실시간 불량 수량</S.CounterLabel>
        <S.CounterValue $color="#ff1744">
          {totalBadCount} <span className="unit">EA</span>
        </S.CounterValue>
        {lastPulseTime && (
          <S.PulseTimeText>최근 수신: {lastPulseTime}</S.PulseTimeText>
        )}
      </S.CounterBlock>
    </S.SensorDisplayBox>
  );
};

export default SensorCounterDisplay;
