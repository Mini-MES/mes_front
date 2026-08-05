import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Send } from 'lucide-react';
import { EquipmentItem, DowntimeReason } from '@/types';
import * as S from '@/components/admin/equipment/DowntimeReasonModal.styles';

interface DowntimeReasonModalProps {
  isOpen: boolean;
  equipment: EquipmentItem | null;
  downtimeReasons: DowntimeReason[];
  onClose: () => void;
  onSubmit: (reasonCode: string, operatorMemo?: string) => void;
  isPending: boolean;
}

export const DowntimeReasonModal: React.FC<DowntimeReasonModalProps> = ({
  isOpen,
  equipment,
  downtimeReasons = [],
  onClose,
  onSubmit,
  isPending,
}) => {
  const [reasonCode, setReasonCode] = useState<string>('');
  const [operatorMemo, setOperatorMemo] = useState<string>('');

  useEffect(() => {
    if (downtimeReasons.length > 0) {
      setReasonCode(downtimeReasons[0].reasonCode);
    }
  }, [downtimeReasons]);

  if (!isOpen || !equipment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonCode) {
      alert('비가동 사유를 선택해 주세요.');
      return;
    }
    onSubmit(reasonCode, operatorMemo);
  };

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalContainer onClick={(e) => e.stopPropagation()}>
        <S.ModalHeader>
          <S.ModalTitle>
            <AlertTriangle size={20} style={{ color: '#ff1744' }} />
            설비 비가동 원인 등록
          </S.ModalTitle>
          <S.CloseButton onClick={onClose}>
            <X size={18} />
          </S.CloseButton>
        </S.ModalHeader>

        <S.ModalBody onSubmit={handleSubmit}>
          <S.EquipmentNoticeBox>
            <div className="title">대상 설비: {equipment.equipmentName} ({equipment.equipmentID})</div>
            <div className="sub">설비 정지 상태가 감지되었습니다. 발생 원인을 선택 후 등록해 주세요.</div>
          </S.EquipmentNoticeBox>

          <S.FormGroup>
            <S.FormLabel>비가동 사유 선택</S.FormLabel>
            <S.FormSelect
              value={reasonCode}
              onChange={(e) => setReasonCode(e.target.value)}
            >
              {downtimeReasons.map((reason) => (
                <option key={reason.reasonCode} value={reason.reasonCode}>
                  [{reason.category}] {reason.reasonName} ({reason.reasonCode})
                </option>
              ))}
            </S.FormSelect>
          </S.FormGroup>

          <S.FormGroup>
            <S.FormLabel>작업자 조치 메모 (선택)</S.FormLabel>
            <S.FormTextarea
              rows={3}
              placeholder="예: 3번 조작반 메인 툴 교체 작업 진행 중 / 원자재 수급 지연 발생"
              value={operatorMemo}
              onChange={(e) => setOperatorMemo(e.target.value)}
            />
          </S.FormGroup>

          <S.ModalFooter>
            <S.BtnCancel type="button" onClick={onClose} disabled={isPending}>
              취소
            </S.BtnCancel>
            <S.BtnSubmit type="submit" disabled={isPending || !reasonCode}>
              <Send size={16} />
              {isPending ? '등록 중...' : '비가동 사유 등록 승인'}
            </S.BtnSubmit>
          </S.ModalFooter>
        </S.ModalBody>
      </S.ModalContainer>
    </S.ModalOverlay>
  );
};

export default DowntimeReasonModal;