import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import * as S from './Modal.styles';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
  maxWidth
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalContent $maxWidth={maxWidth} onClick={e => e.stopPropagation()}>
        <S.ModalHeader>
          <S.ModalTitleGroup>
            {icon}
            <S.ModalTitle>{title}</S.ModalTitle>
          </S.ModalTitleGroup>
          <S.CloseButton type="button" onClick={onClose} aria-label="닫기">
            <X size={18} />
          </S.CloseButton>
        </S.ModalHeader>

        <S.ModalBody>
          {children}
        </S.ModalBody>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};

export default Modal;
