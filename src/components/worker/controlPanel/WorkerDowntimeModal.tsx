import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '@/components/common/Modal';
import { DowntimeReason, EquipmentItem } from '@/types/equipment';
import * as S from '@/components/worker/controlPanel/WorkerControlPanel.styles';

interface WorkerDowntimeModalProps {
  isOpen: boolean;
  equipment?: EquipmentItem;
  reasons: DowntimeReason[];
  isPending: boolean;
  onClose: () => void;
  onSubmit: (reasonCode: string, memo?: string) => void;
}

export default function WorkerDowntimeModal({
  isOpen,
  equipment,
  reasons,
  isPending,
  onClose,
  onSubmit,
}: WorkerDowntimeModalProps) {
  const [reasonCode, setReasonCode] = useState('');
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReasonCode(reasons[0]?.reasonCode ?? '');
      setMemo('');
    }
  }, [isOpen, reasons]);

  const handleSubmit = () => {
    if (!reasonCode) return;
    onSubmit(reasonCode, memo);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${equipment?.equipmentID ?? '설비'} 비가동 사유`}
      icon={<AlertTriangle size={18} />}
      maxWidth="420px"
    >
      <S.ControlGroup>
        <S.FieldLabel>비가동 사유</S.FieldLabel>
        <S.FormSelect value={reasonCode} onChange={(event) => setReasonCode(event.target.value)}>
          {reasons.map((reason) => (
            <option key={reason.reasonCode} value={reason.reasonCode}>
              {reason.reasonName}
            </option>
          ))}
        </S.FormSelect>
      </S.ControlGroup>

      <S.ControlGroup>
        <S.FieldLabel>작업자 메모</S.FieldLabel>
        <S.FormInput
          value={memo}
          onChange={(event) => setMemo(event.target.value)}
          placeholder="간단한 상황을 입력하세요."
        />
      </S.ControlGroup>

      <S.BtnActionPrimary disabled={!reasonCode || isPending} onClick={handleSubmit}>
        {isPending ? '등록 중...' : '비가동 사유 등록'}
      </S.BtnActionPrimary>
    </Modal>
  );
}
