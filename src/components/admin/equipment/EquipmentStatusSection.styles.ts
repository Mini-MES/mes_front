import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
`;

export const EquipmentSectionWrapper = styled.section`
  background: ${props => props.theme.colors.bgCard};
  backdrop-filter: blur(16px);
  border: 1px solid ${props => props.theme.colors.borderColor};
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  transition: ${props => props.theme.transitions.smooth};

  &:hover {
    border-color: ${props => props.theme.colors.borderColorGlow};
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25);
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SectionTitle = styled.h2`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${props => props.theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const SummaryBadgeGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const SummaryItem = styled.span<{ $color: string }>`
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 12px;
  background: ${props => props.$color}18;
  color: ${props => props.$color};
  border: 1px solid ${props => props.$color}40;
`;

export const EquipmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
`;

/* 설비 카드 스타일 */
export const EquipmentCardWrapper = styled.div`
  background: rgba(18, 24, 38, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const EquipmentInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const EquipmentTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
`;

export const EquipmentIdBadge = styled.span`
  font-size: 0.75rem;
  color: #a0aec0;
  font-family: ${props => props.theme.fonts.mono};
`;

export const StatusBadge = styled.div<{ $color: string; $bg: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.78rem;
  font-weight: 600;
  background: ${props => props.$bg};
  color: ${props => props.$color};
  border: 1px solid ${props => props.$color}40;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: currentColor;
    animation: ${pulse} 1.5s infinite;
  }
`;

export const TimerSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  background: rgba(0, 0, 0, 0.25);
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

export const TimerRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
`;

export const TimerLabel = styled.span`
  color: #a0aec0;
`;

export const TimerValue = styled.span<{ $color?: string }>`
  font-weight: 600;
  font-family: ${props => props.theme.fonts.mono};
  color: ${props => props.$color || '#ffffff'};
`;

export const OeeProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const OeeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #a0aec0;
`;

export const OeeBarTrack = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
`;

export const OeeBarFill = styled.div<{ $percent: number }>`
  width: ${props => Math.min(100, Math.max(0, props.$percent))}%;
  height: 100%;
  background: linear-gradient(90deg, #00e676 0%, #00b0ff 100%);
  border-radius: 3px;
  transition: width 0.4s ease;
`;

export const CardActions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-top: auto;
`;

export const StatusChangeBtn = styled.button<{ $active?: boolean; $color: string }>`
  padding: 6px 4px;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  background: ${props => (props.$active ? props.$color : 'rgba(255, 255, 255, 0.05)')};
  color: ${props => (props.$active ? '#000000' : props.$color)};
  border: 1px solid ${props => props.$color}60;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => props.$color};
    color: #000;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const BtnDowntimeReason = styled.button`
  width: 100%;
  padding: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  border-radius: 6px;
  background: rgba(255, 23, 68, 0.12);
  color: #ff1744;
  border: 1px solid rgba(255, 23, 68, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 23, 68, 0.25);
  }
`;
