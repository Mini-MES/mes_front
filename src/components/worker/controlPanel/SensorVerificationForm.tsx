import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import * as S from '@/components/worker/controlPanel/WorkerControlPanel.styles';

interface SensorVerificationFormProps {
  accumulatedGood: number;
  isOrderCompleted: boolean;
  isLotHold: boolean;
  isPendingConfirm: boolean;
  toolId?: string;
}

export const SensorVerificationForm: React.FC<SensorVerificationFormProps> = ({
  accumulatedGood,
  isOrderCompleted,
  isLotHold,
  isPendingConfirm,
  toolId,
}) => {
  const [isVerified, setIsVerified] = useState<boolean>(false);

  // 센서 수량이 추가 수집되어 변경되면 이전 검증 체크박스를 자동으로 해제하여 재검증 유도
  useEffect(() => {
    setIsVerified(false);
  }, [accumulatedGood]);

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
    </S.VerificationContainer>
  );
};

export default SensorVerificationForm;
