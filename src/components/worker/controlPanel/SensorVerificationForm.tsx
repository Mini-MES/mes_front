import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import * as S from '@/components/worker/controlPanel/WorkerControlPanel.styles';

interface SensorVerificationFormProps {
  accumulatedGood: number;
  isOrderCompleted: boolean;
  isLotHold: boolean;
  isPendingConfirm: boolean;
  onConfirmPerformance: (toolId?: string) => void;
  toolId?: string;
}

export const SensorVerificationForm: React.FC<SensorVerificationFormProps> = ({
  accumulatedGood,
  isOrderCompleted,
  isLotHold,
  isPendingConfirm,
  onConfirmPerformance,
  toolId,
}) => {
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const isDisabled = isOrderCompleted || isLotHold || accumulatedGood === 0;

  return (
    <S.VerificationContainer>
      <S.VerificationHeader>
        <ShieldCheck size={18} style={{ color: '#00e676' }} />
        센서 수집 수량 검증 및 최종 실적 승인
      </S.VerificationHeader>
      <S.CheckboxLabel>
        <input
          type="checkbox"
          checked={isVerified}
          onChange={(e) => setIsVerified(e.target.checked)}
          disabled={isDisabled}
        />
        <span>센서 집계 수량({accumulatedGood} EA)이 실제 생산 수량과 일치함을 확인했습니다.</span>
      </S.CheckboxLabel>
      <S.BtnConfirm
        onClick={() => onConfirmPerformance(toolId)}
        disabled={!isVerified || isDisabled || isPendingConfirm}
      >
        {isPendingConfirm ? '등록 중...' : '최종 실적 등록 승인'}
      </S.BtnConfirm>
    </S.VerificationContainer>
  );
};

export default SensorVerificationForm;
