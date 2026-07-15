import styled from 'styled-components';
import { ThemeType } from '@/styles/theme';

export const TableContainer = styled.div`
  overflow-x: auto;
`;

export const CustomTable = styled.table<{ theme: ThemeType }>`
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

export const ProgressBarFill = styled.div<{ theme: ThemeType }>`
  height: 100%;
  background: linear-gradient(90deg, ${props => props.theme.colors.info}, ${props => props.theme.colors.success});
  border-radius: 4px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const StatusBadge = styled.span<{ theme: ThemeType }>`
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
