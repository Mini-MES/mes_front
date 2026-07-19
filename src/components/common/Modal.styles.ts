import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const ModalContent = styled.div<{ $maxWidth?: string }>`
  background: ${props => props.theme.colors.bgCard};
  border: 1px solid ${props => props.theme.colors.borderColorGlow};
  border-radius: 16px;
  padding: 1.75rem;
  width: 100%;
  max-width: ${props => props.$maxWidth || '480px'};
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
  animation: slideUp 0.2s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(16px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.colors.borderColor};
  padding-bottom: 0.85rem;
`;

export const ModalTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ModalTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textMuted};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 6px;
  transition: ${props => props.theme.transitions.smooth};

  &:hover {
    color: ${props => props.theme.colors.textPrimary};
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
