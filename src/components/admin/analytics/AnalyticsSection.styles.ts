import styled from 'styled-components';

export const Container = styled.section`
  background: ${props => props.theme.colors.bgCard};
  backdrop-filter: blur(16px);
  border: 1px solid ${props => props.theme.colors.borderColor};
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: ${props => props.theme.transitions.smooth};

  &:hover {
    border-color: ${props => props.theme.colors.borderColorGlow};
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.borderColor};
  padding-bottom: 0.75rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.15rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.textPrimary};
`;

export const TabGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  background: rgba(15, 23, 42, 0.7);
  padding: 0.25rem;
  border-radius: 10px;
  border: 1px solid ${props => props.theme.colors.borderColor};
`;

export const TabButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background: ${props => (props.$active ? props.theme.colors.primary : 'transparent')};
  color: ${props => (props.$active ? '#090D16' : props.theme.colors.textSecondary)};

  &:hover {
    color: ${props => (props.$active ? '#090D16' : props.theme.colors.textPrimary)};
    background: ${props => (props.$active ? props.theme.colors.primary : 'rgba(255, 255, 255, 0.05)')};
  }
`;
