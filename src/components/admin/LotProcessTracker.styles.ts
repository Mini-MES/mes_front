import styled from 'styled-components';
import { ThemeType } from '@/styles/theme';

export const FormSelect = styled.select<{ theme: ThemeType }>`
  width: 100%;
  padding: 0.65rem 0.85rem;
  background: rgba(11, 15, 25, 0.6);
  border: 1px solid ${props => props.theme.colors.borderColor};
  border-radius: 8px;
  color: ${props => props.theme.colors.textPrimary};
  font-family: ${props => props.theme.fonts.sans};
  font-size: 0.9rem;
  transition: ${props => props.theme.transitions.smooth};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 8px rgba(0, 229, 255, 0.25);
  }
`;

export const StatusBadge = styled.span<{ theme: ThemeType }>`
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;

  &.processing {
    background: rgba(41, 121, 255, 0.15);
    color: ${props => props.theme.colors.info};
  }
`;

export const FlowContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FlowStepBar = styled.div<{ theme: ThemeType }>`
  display: flex;
  justify-content: space-between;
  position: relative;
  margin: 1.5rem 0;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => props.theme.colors.borderColor};
    z-index: 1;
    transform: translateY(-50%);
  }
`;

export const FlowStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 2;
  flex: 1;
`;

export const FlowStepCircle = styled.div<{ $active?: boolean; $completed?: boolean; theme: ThemeType }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid ${props => {
    if (props.$completed) return props.theme.colors.success;
    if (props.$active) return props.theme.colors.primary;
    return props.theme.colors.borderColor;
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.85rem;
  color: ${props => {
    if (props.$completed) return props.theme.colors.success;
    if (props.$active) return props.theme.colors.primary;
    return props.theme.colors.textSecondary;
  }};
  background: ${props => {
    if (props.$completed) return 'rgba(0, 230, 118, 0.1)';
    if (props.$active) return 'rgba(0, 229, 255, 0.1)';
    return props.theme.colors.bgMain;
  }};
  box-shadow: ${props => props.$active ? `0 0 10px ${props.theme.colors.primaryGlow}` : 'none'};
  transition: ${props => props.theme.transitions.smooth};
`;

export const FlowStepLabel = styled.span<{ $active?: boolean; $completed?: boolean; theme: ThemeType }>`
  font-size: 0.8rem;
  color: ${props => {
    if (props.$completed) return props.theme.colors.success;
    if (props.$active) return props.theme.colors.primary;
    return props.theme.colors.textSecondary;
  }};
  font-weight: ${props => props.$active ? '600' : '500'};
`;

export const LotDetailGrid = styled.div<{ theme: ThemeType }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  background: rgba(255, 255, 255, 0.01);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.borderColor};
`;

export const LotDetailInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const LotDetailItem = styled.div<{ theme: ThemeType }>`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px dashed ${props => props.theme.colors.borderColor};
  font-size: 0.9rem;

  span:first-child {
    color: ${props => props.theme.colors.textSecondary};
  }

  span:last-child {
    font-family: ${props => props.theme.fonts.mono};
    font-weight: 500;
  }
`;
