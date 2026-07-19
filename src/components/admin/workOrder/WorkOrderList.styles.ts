import styled from 'styled-components';

export const TableContainer = styled.div`
  overflow-x: auto;
`;

export const CustomTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th {
    padding: 0.75rem 1rem;
    color: ${props => props.theme.colors.textSecondary};
    font-weight: 600;
    font-size: 0.85rem;
    border-bottom: 1px solid ${props => props.theme.colors.borderColor};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  td {
    padding: 1rem;
    font-size: 0.9rem;
    border-bottom: 1px solid ${props => props.theme.colors.borderColor};
    color: ${props => props.theme.colors.textPrimary};
  }

  tr:hover td {
    background: rgba(255, 255, 255, 0.02);
  }
`;

export const ProgressBarContainer = styled.div`
  height: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
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

export const ActionButton = styled.button`
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid transparent;
  cursor: pointer;
  transition: ${props => props.theme.transitions.smooth};
  outline: none;
  font-family: ${props => props.theme.fonts.sans};

  &.start {
    background: rgba(41, 121, 255, 0.15);
    color: ${props => props.theme.colors.info};
    border-color: rgba(41, 121, 255, 0.3);
    &:hover {
      background: ${props => props.theme.colors.info};
      color: #fff;
      box-shadow: 0 0 8px rgba(41, 121, 255, 0.4);
    }
  }

  &.complete {
    background: rgba(0, 230, 118, 0.15);
    color: ${props => props.theme.colors.success};
    border-color: rgba(0, 230, 118, 0.3);
    &:hover {
      background: ${props => props.theme.colors.success};
      color: #fff;
      box-shadow: 0 0 8px rgba(0, 230, 118, 0.4);
    }
  }

  &.delete {
    background: rgba(255, 23, 68, 0.1);
    color: ${props => props.theme.colors.danger};
    border-color: rgba(255, 23, 68, 0.2);
    &:hover {
      background: ${props => props.theme.colors.danger};
      color: #fff;
      box-shadow: 0 0 8px rgba(255, 23, 68, 0.4);
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;
