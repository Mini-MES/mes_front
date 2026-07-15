import styled from 'styled-components';
import { ThemeType } from '@/styles/theme';

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

export const GlassCard = styled.section<{ theme: ThemeType }>`
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

export const CardTitle = styled.h2<{ theme: ThemeType }>`
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

export const MaterialName = styled.span<{ theme: ThemeType }>`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const MaterialStock = styled.span<{ $isWarning?: boolean; theme: ThemeType }>`
  font-size: 1.5rem;
  font-weight: 600;
  font-family: ${props => props.theme.fonts.mono};
  color: ${props => props.$isWarning ? props.theme.colors.danger : props.theme.colors.textPrimary};
`;

export const AdminGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div<{ theme: ThemeType }>`
  margin-bottom: 1rem;
  
  label {
    display: block;
    font-size: 0.85rem;
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 0.35rem;
    font-weight: 500;
  }
`;

export const FormInput = styled.input<{ theme: ThemeType }>`
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

export const BtnSubmit = styled.button<{ theme: ThemeType }>`
  width: 100%;
  padding: 0.75rem;
  background: rgba(0, 229, 255, 0.1);
  color: ${props => props.theme.colors.primary};
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.transitions.smooth};
  margin-top: 0.5rem;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: #0b0f19;
    box-shadow: 0 0 15px rgba(0, 229, 255, 0.3);
  }
`;

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

  &.alert {
    background: rgba(255, 23, 68, 0.15);
    color: ${props => props.theme.colors.danger};
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
