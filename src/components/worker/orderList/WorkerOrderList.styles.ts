import styled from 'styled-components';

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
  width: 200px;
  height: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.25rem;
`;

export const ProgressBarFill = styled.div<{ $widthPercent: number }>`
  height: 100%;
  width: ${props => props.$widthPercent}%;
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

export const OrderListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const StatusGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
`;

export const ProcessLabel = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

export const OrderCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;
