import styled from 'styled-components';

export const WorkerControlPanelWrapper = styled.section`
  background: ${props => props.theme.colors.bgCard};
  backdrop-filter: blur(16px);
  border: 1px solid ${props => props.theme.colors.borderColor};
  border-radius: 16px;
  padding: 1.5rem;
  transition: ${props => props.theme.transitions.smooth};
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &:hover {
    border-color: ${props => props.theme.colors.borderColorGlow};
    background: ${props => props.theme.colors.bgCardHover};
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  }
`;

export const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const QuantityController = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const BtnQty = styled.button`
  flex: 1;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${props => props.theme.colors.borderColor};
  color: ${props => props.theme.colors.textPrimary};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.transitions.smooth};

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    border-color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    color: ${props => props.theme.colors.textMuted};
    cursor: not-allowed;
  }
`;

export const TransitionButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: rgba(0, 229, 255, 0.1);
  color: ${props => props.theme.colors.primary};
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.transitions.smooth};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary};
    color: #0b0f19;
    box-shadow: 0 0 15px rgba(0, 229, 255, 0.3);
  }

  &:disabled {
    border-color: ${props => props.theme.colors.borderColor};
    color: ${props => props.theme.colors.textMuted};
    background: transparent;
    cursor: not-allowed;
  }
`;

export const BtnActionPrimary = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, ${props => props.theme.colors.success} 0%, ${props => props.theme.colors.info} 100%);
  color: #0b0f19;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: ${props => props.theme.transitions.smooth};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 230, 118, 0.3);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.05);
    color: ${props => props.theme.colors.textMuted};
    border: 1px solid ${props => props.theme.colors.borderColor};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 0.6rem 0.85rem;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid ${props => props.theme.colors.borderColor};
  border-radius: 8px;
  color: ${props => props.theme.colors.textPrimary};
  font-size: 0.875rem;
  font-family: ${props => props.theme.fonts.mono};
  transition: ${props => props.theme.transitions.smooth};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 10px ${props => props.theme.colors.primaryGlow};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textMuted};
  }
`;

export const FormSelect = styled.select`
  width: 100%;
  padding: 0.6rem 0.85rem;
  background: rgba(11, 15, 25, 0.9);
  border: 1px solid ${props => props.theme.colors.borderColor};
  border-radius: 8px;
  color: ${props => props.theme.colors.textPrimary};
  font-size: 0.875rem;
  transition: ${props => props.theme.transitions.smooth};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  option {
    background: #0b0f19;
    color: ${props => props.theme.colors.textPrimary};
  }
`;

export const DefectFormWrapper = styled.div`
  background: rgba(255, 23, 68, 0.05);
  border: 1px solid rgba(255, 23, 68, 0.25);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: ${props => props.theme.transitions.smooth};
`;

export const BtnDanger = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #ff1744 0%, #d50000 100%);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: ${props => props.theme.transitions.smooth};

  &:hover:not(:disabled) {
    box-shadow: 0 0 15px rgba(255, 23, 68, 0.4);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CardInfoBlock = styled.div`
  background: rgba(255, 255, 255, 0.01);
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.borderColor};
  border-radius: 12px;
`;

export const WoBadge = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textMuted};
  font-family: ${props => props.theme.fonts.mono};
`;

export const ProductIdTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  margin-top: 0.25rem;
  color: ${props => props.theme.colors.primary};
`;

export const InfoRow = styled.div<{ $marginTop?: string }>`
  display: flex;
  justify-content: space-between;
  margin-top: ${props => props.$marginTop || '0.5rem'};
  font-size: 0.9rem;
`;

export const InfoLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
`;

export const InfoValue = styled.span<{ $color?: string; $fontWeight?: number }>`
  font-weight: ${props => props.$fontWeight || 600};
  color: ${props => props.$color || 'inherit'};
`;

export const StartGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const NoticeText = styled.div`
  text-align: center;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textMuted};
`;

export const FormLabelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const FormLabelText = styled.span`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

export const ConfiguredBadge = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.fonts.mono};
`;

export const DefectToggleButton = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.65rem 0.85rem;
  background: ${props => props.$isOpen ? 'rgba(255, 23, 68, 0.12)' : 'rgba(255, 23, 68, 0.05)'};
  border: 1px solid rgba(255, 23, 68, 0.3);
  border-radius: 8px;
  color: #ff5252;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 0.5rem;
`;

export const FieldLabel = styled.label`
  display: block;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.25rem;
`;

export const ActionFooter = styled.div`
  margin-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.borderColor};
  padding-top: 1.5rem;
`;

export const CompleteHint = styled.div`
  display: flex;
  gap: 0.35rem;
  align-items: center;
  color: ${props => props.theme.colors.textMuted};
  font-size: 0.75rem;
  margin-top: 0.5rem;
  justify-content: center;
`;

export const StepperTitle = styled.span`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

export const StepperTrack = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const StepperBar = styled.div<{ $isActive: boolean; $isCompleted: boolean }>`
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: ${props => props.$isCompleted ? props.theme.colors.success : props.$isActive ? props.theme.colors.primary : props.theme.colors.borderColor};
  box-shadow: ${props => props.$isActive ? `0 0 8px ${props.theme.colors.primaryGlow}` : 'none'};
`;

export const StepperLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textMuted};
  margin-top: 0.25rem;
`;

export const WarningBadge = styled.span`
  font-size: 0.75rem;
  color: #ffb74d;
`;

export const EmptyNotice = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.textMuted};
`;

export const ControlContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const DefectNoticeText = styled.div`
  font-size: 0.8rem;
  color: #ff8a80;
  font-weight: 600;
`;
