import React, { useState } from 'react';
import { AlertOctagon } from 'lucide-react';
import * as S from '@/components/worker/controlPanel/WorkerControlPanel.styles';
import { DefectReason } from '@/components/worker/controlPanel/WorkerControlPanel';

interface WorkerDefectFormProps {
  defectReasons?: DefectReason[];
  isOrderCompleted: boolean;
  isPendingQty: boolean;
  toolId: string;
  onRegisterDefect: (badQty: number, reasonCode: string, toolId?: string) => void;
}

const WorkerDefectForm: React.FC<WorkerDefectFormProps> = ({
  defectReasons = [],
  isOrderCompleted,
  isPendingQty,
  toolId,
  onRegisterDefect
}) => {
  const [showDefectForm, setShowDefectForm] = useState<boolean>(false);
  const [badQty, setBadQty] = useState<number>(1);
  const [reasonCode, setReasonCode] = useState<string>('SCRATCH');

  return (
    <S.ControlGroup>
      <S.DefectToggleButton
        type="button"
        $isOpen={showDefectForm}
        onClick={() => setShowDefectForm(!showDefectForm)}
        disabled={isOrderCompleted}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <AlertOctagon size={16} />
          {showDefectForm ? '불량 등록 폼 닫기' : '불량 실적 등록 (+Defect)'}
        </span>
        <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
          {showDefectForm ? '▲ 접기' : '▼ 펼치기'}
        </span>
      </S.DefectToggleButton>

      {showDefectForm && (
        <S.DefectFormWrapper>
          <S.DefectNoticeText>
            ⚠️ 불량 발생 수량 및 사유 등록 (등록 시 LOT 상태가 HOLD로 전환됩니다)
          </S.DefectNoticeText>
          
          <S.FormGrid>
            <div>
              <S.FieldLabel>불량 수량(EA)</S.FieldLabel>
              <S.FormInput
                type="number"
                min={1}
                value={badQty}
                onChange={(e) => setBadQty(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>

            <div>
              <S.FieldLabel>불량 사유 Code</S.FieldLabel>
              <S.FormSelect
                value={reasonCode}
                onChange={(e) => setReasonCode(e.target.value)}
              >
                {defectReasons && defectReasons.length > 0 ? (
                  defectReasons.map((reason) => (
                    <option key={String(reason.reasonCode)} value={String(reason.reasonCode)}>
                      {String(reason.reasonCode)} - {reason.reasonDescription}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="SCRATCH">SCRATCH - 긁힘 / 스크래치</option>
                    <option value="DIM_ERR">DIM_ERR - 치수 오차</option>
                    <option value="MATERIAL">MATERIAL - 원자재 결함</option>
                    <option value="OPERATOR">OPERATOR - 작업자 실수</option>
                  </>
                )}
              </S.FormSelect>
            </div>
          </S.FormGrid>

          <S.BtnDanger
            type="button"
            disabled={isPendingQty || isOrderCompleted}
            onClick={() => {
              onRegisterDefect(badQty, reasonCode, toolId);
              setShowDefectForm(false);
            }}
          >
            <AlertOctagon size={16} />
            {isPendingQty ? '등록 중...' : `불량 ${badQty}EA 등록 (${reasonCode})`}
          </S.BtnDanger>
        </S.DefectFormWrapper>
      )}
    </S.ControlGroup>
  );
};

export default WorkerDefectForm;
