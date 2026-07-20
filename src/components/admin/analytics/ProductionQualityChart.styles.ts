import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.textPrimary};
`;

export const Badge = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  font-family: ${props => props.theme.fonts.mono};
  color: ${props => props.theme.colors.primary};
  background: rgba(0, 240, 255, 0.1);
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  border: 1px solid rgba(0, 240, 255, 0.2);
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
`;

export const StatCard = styled.div`
  background: ${props => props.theme.colors.bgCard};
  backdrop-filter: blur(12px);
  border: 1px solid ${props => props.theme.colors.borderColor};
  border-radius: 12px;
  padding: 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: ${props => props.theme.transitions.smooth};

  &:hover {
    border-color: ${props => props.theme.colors.borderColorGlow};
    transform: translateY(-2px);
  }
`;

export const StatIcon = styled.div<{ $bg: string; $color: string }>`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$bg};
  color: ${props => props.$color};
`;

export const StatLabel = styled.p`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.25rem;
`;

export const StatValue = styled.h3<{ $color?: string }>`
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${props => props.$color || props.theme.colors.textPrimary};
`;

export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: ${props => props.theme.colors.bgCard};
  backdrop-filter: blur(16px);
  border: 1px solid ${props => props.theme.colors.borderColor};
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &:hover {
    border-color: ${props => props.theme.colors.borderColorGlow};
  }
`;

export const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textPrimary};
`;
