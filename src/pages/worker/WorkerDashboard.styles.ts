import styled from 'styled-components';

export const DashboardContent = styled.div`
  flex: 1;
  padding: 2rem;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.03em;
  }
`;

export const WorkerLayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const GlassCard = styled.section`
  background: ${props => props.theme.colors.bgCard};
  backdrop-filter: blur(16px);
  border: 1px solid ${props => props.theme.colors.borderColor};
  border-radius: 16px;
  padding: 1.5rem;
  transition: ${props => props.theme.transitions.smooth};

  &:hover {
    border-color: ${props => props.theme.colors.borderColorGlow};
    background: ${props => props.theme.colors.bgCardHover};
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  }
`;

export const CardTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: ${props => props.theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.borderColor};
  padding-bottom: 0.75rem;
`;

export const WorkItemCard = styled.div<{ $isSelected?: boolean }>`
  padding: 1.25rem;
  border-radius: 12px;
  background: ${props => props.$isSelected ? 'rgba(0, 229, 255, 0.03)' : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.$isSelected ? props.theme.colors.primary : props.theme.colors.borderColor};
  box-shadow: ${props => props.$isSelected ? `inset 0 0 10px rgba(0, 229, 255, 0.05)` : 'none'};
  cursor: pointer;
  transition: ${props => props.theme.transitions.smooth};
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: ${props => props.$isSelected ? props.theme.colors.primary : 'rgba(0, 229, 255, 0.3)'};
  }
`;

export const WorkItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const WorkItemId = styled.span`
  font-family: ${props => props.theme.fonts.mono};
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textMuted};
`;

export const WorkItemTitle = styled.span`
  font-size: 1.05rem;
  font-weight: 600;
`;

export const WorkItemQty = styled.span`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const ProgressBarContainer = styled.div`
  height: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

export const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${props => props.theme.colors.info}, ${props => props.theme.colors.success});
  border-radius: 4px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;

  &.pending {
    background: rgba(255, 179, 0, 0.15);
    color: ${props => props.theme.colors.warning};
  }

  &.processing {
    background: rgba(41, 121, 255, 0.15);
    color: ${props => props.theme.colors.info};
  }

  &.completed {
    background: rgba(0, 230, 118, 0.15);
    color: ${props => props.theme.colors.success};
  }
`;

export const WorkerControlPanel = styled(GlassCard)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
