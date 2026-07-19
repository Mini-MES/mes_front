import styled from 'styled-components';

export const MaterialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
`;

export const MaterialCard = styled.div<{ $isWarning?: boolean }>`
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid ${props => props.$isWarning ? 'rgba(255, 23, 68, 0.3)' : props.theme.colors.borderColor};
  background: ${props => props.$isWarning ? 'rgba(255, 23, 68, 0.03)' : 'rgba(255, 255, 255, 0.02)'};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: ${props => props.theme.transitions.smooth};

  &:hover {
    border-color: ${props => props.theme.colors.borderColorGlow};
    background: rgba(255, 255, 255, 0.04);
  }
`;

export const MaterialName = styled.span`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 600;
`;

export const MaterialStock = styled.span<{ $isWarning?: boolean }>`
  font-size: 1.5rem;
  font-weight: 600;
  font-family: ${props => props.theme.fonts.mono};
  color: ${props => props.$isWarning ? props.theme.colors.danger : props.theme.colors.textPrimary};
`;

export const StatusBadge = styled.span`
  padding: 0.15rem 0.4rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;

  &.completed {
    background: rgba(0, 230, 118, 0.15);
    color: ${props => props.theme.colors.success};
  }

  &.alert {
    background: rgba(255, 23, 68, 0.15);
    color: ${props => props.theme.colors.danger};
  }
`;

export const CardHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.colors.borderColor};
  padding-bottom: 0.75rem;
  margin-bottom: 1.25rem;
`;

export const HeaderLeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const HeaderTitleText = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
`;

export const MaterialCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MaterialIdText = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textMuted};
  font-family: ${props => props.theme.fonts.mono};
`;

export const StockDisplayRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin-top: 0.5rem;
`;

export const StockUnit = styled.span`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const MaterialCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 0.5rem;
`;

export const SafetyStockText = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textMuted};
`;

export const BtnAddMaterial = styled.button`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.85rem;
  background: rgba(0, 229, 255, 0.1);
  color: ${props => props.theme.colors.primary};
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.transitions.smooth};

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: #0b0f19;
    box-shadow: 0 0 12px ${props => props.theme.colors.primaryGlow};
  }
`;

export const BtnStockAction = styled.button`
  margin-top: 0.5rem;
  width: 100%;
  padding: 0.45rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid ${props => props.theme.colors.borderColor};
  border-radius: 8px;
  color: ${props => props.theme.colors.textPrimary};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  transition: ${props => props.theme.transitions.smooth};

  &:hover {
    background: rgba(0, 229, 255, 0.12);
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormGridTwoCols = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

export const FormLabel = styled.label`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 0.6rem 0.85rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.theme.colors.borderColor};
  border-radius: 8px;
  color: ${props => props.theme.colors.textPrimary};
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const InputRowGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ModalButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

export const BtnSubmit = styled.button`
  flex: 1;
  padding: 0.65rem;
  background: ${props => props.theme.colors.primary};
  color: #0b0f19;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: ${props => props.theme.transitions.smooth};

  &:hover:not(:disabled) {
    box-shadow: 0 0 15px ${props => props.theme.colors.primaryGlow};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const BtnInlineSubmit = styled(BtnSubmit)`
  white-space: nowrap;
  width: auto;
  padding: 0 1rem;
`;

export const BtnCancel = styled.button`
  flex: 1;
  padding: 0.65rem;
  background: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.textSecondary};
  border: 1px solid ${props => props.theme.colors.borderColor};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.transitions.smooth};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const StockInfoBox = styled.div`
  background: rgba(255, 255, 255, 0.03);
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${props => props.theme.colors.borderColor};
  opacity: 0.5;
  margin: 0.5rem 0;
`;
