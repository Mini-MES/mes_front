import styled from 'styled-components';
import { ThemeType } from '@/styles/theme';

export const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 0.5rem;
  max-height: 400px;
  overflow-y: auto;
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
    position: sticky;
    top: 0;
    background: #0d121f; // 헤더 고정을 위해 배경 지정
    z-index: 10;
  }

  td {
    padding: 0.85rem 1rem;
    font-size: 0.85rem;
    border-bottom: 1px solid ${props => props.theme.colors.borderColor};
    color: ${props => props.theme.colors.textPrimary};
  }

  tr:hover td {
    background: rgba(255, 255, 255, 0.02);
  }
`;

export const DestinationBadge = styled.span`
  padding: 0.2rem 0.5rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  font-size: 0.75rem;
  color: var(--text-secondary);
`;
