import styled from 'styled-components';
import { ThemeType } from '@/styles/theme';

export const MaterialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

export const MaterialCard = styled.div<{ $isWarning?: boolean; theme: ThemeType }>`
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid ${props => props.$isWarning ? 'rgba(255, 23, 68, 0.3)' : props.theme.colors.borderColor};
  background: ${props => props.$isWarning ? 'rgba(255, 23, 68, 0.03)' : 'rgba(255, 255, 255, 0.02)'};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const MaterialName = styled.span`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const MaterialStock = styled.span<{ $isWarning?: boolean; theme: ThemeType }>`
  font-size: 1.5rem;
  font-weight: 600;
  font-family: ${props => props.theme.fonts.mono};
  color: ${props => props.$isWarning ? props.theme.colors.danger : props.theme.colors.textPrimary};
`;

export const StatusBadge = styled.span<{ theme: ThemeType }>`
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
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
