import styled from 'styled-components';

export const FormSelect = styled.select`
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

export const StatusBadge = styled.span`
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

export const FlowStepBar = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  margin: 1.5rem 0;

  &::before {
    content: '';
    position: absolute;
    top: 30%;
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

export const FlowStepCircle = styled.div<{ $active?: boolean; $completed?: boolean }>`
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
    if (props.$completed) return 'rgba(0, 230, 118, 0.7)';
    if (props.$active) return 'rgba(0, 229, 255, 0.7)';
    return props.theme.colors.bgMain;
  }};
  box-shadow: ${props => props.$active ? `0 0 10px ${props.theme.colors.primaryGlow}` : 'none'};
  transition: ${props => props.theme.transitions.smooth};
`;

export const FlowStepLabel = styled.span<{ $active?: boolean; $completed?: boolean }>`
  font-size: 0.8rem;
  color: ${props => {
    if (props.$completed) return props.theme.colors.success;
    if (props.$active) return props.theme.colors.primary;
    return props.theme.colors.textSecondary;
  }};
  font-weight: ${props => props.$active ? '600' : '500'};
`;

export const LotDetailGrid = styled.div`
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

export const LotDetailItem = styled.div`
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

export const FilterToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid ${props => props.theme.colors.borderColor};
  padding-bottom: 0.75rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const FilterButtonGroup = styled.div`
  display: flex;
  gap: 0.35rem;
  align-items: center;
  flex-wrap: wrap;
`;

export const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 0.35rem 0.65rem;
  background: ${props => props.$active ? 'rgba(0, 229, 255, 0.12)' : 'rgba(255, 255, 255, 0.02)'};
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.textSecondary};
  border: 1px solid ${props => props.$active ? props.theme.colors.borderColorGlow : props.theme.colors.borderColor};
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: ${props => props.theme.transitions.smooth};

  &:hover {
    background: rgba(0, 229, 255, 0.08);
    border-color: ${props => props.theme.colors.primaryGlow};
    color: ${props => props.theme.colors.textPrimary};
  }
`;

export const SearchInput = styled.input`
  padding: 0.4rem 0.75rem;
  background: rgba(11, 15, 25, 0.6);
  border: 1px solid ${props => props.theme.colors.borderColor};
  border-radius: 8px;
  color: ${props => props.theme.colors.textPrimary};
  font-family: ${props => props.theme.fonts.sans};
  font-size: 0.85rem;
  width: 250px;
  transition: ${props => props.theme.transitions.smooth};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 8px rgba(0, 229, 255, 0.25);
  }
`;

export const TrackerLayout = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1.5rem;
  margin-top: 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const LotSearchPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-right: 1px solid ${props => props.theme.colors.borderColor};
  padding-right: 1.5rem;

  @media (max-width: 1024px) {
    border-right: none;
    padding-right: 0;
    border-bottom: 1px solid ${props => props.theme.colors.borderColor};
    padding-bottom: 1.5rem;
  }
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const LotListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 380px;
  overflow-y: auto;
  padding-right: 0.25rem;
`;

export const LotListItem = styled.div<{ $active?: boolean }>`
  padding: 0.75rem;
  background: ${props => props.$active ? 'rgba(0, 229, 255, 0.05)' : 'rgba(255, 255, 255, 0.01)'};
  border: 1px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.borderColor};
  border-radius: 8px;
  cursor: pointer;
  transition: ${props => props.theme.transitions.smooth};
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: ${props => props.$active ? 'rgba(0, 229, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)'};
    border-color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.borderColorGlow};
    box-shadow: ${props => props.$active ? '0 0 10px rgba(0, 229, 255, 0.15)' : 'none'};
  }
`;

export const LotListInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

export const LotListId = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  font-family: ${props => props.theme.fonts.mono};
  color: ${props => props.theme.colors.textPrimary};
`;

export const LotListSub = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const LotDetailsPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.borderColor};
  padding-top: 1.5rem;
`;

export const TimelineTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

export const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  padding-left: 1.5rem;
  margin-top: 0.5rem;

  &::before {
    content: '';
    position: absolute;
    left: 4px;
    top: 8px;
    bottom: 8px;
    width: 2px;
    background: rgba(255, 255, 255, 0.08);
  }
`;

export const TimelineItem = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  padding-bottom: 1.25rem;

  &:last-child {
    padding-bottom: 0;
  }
`;

export const TimelineMarker = styled.div<{ $hasError?: boolean }>`
  position: absolute;
  left: -23px;
  top: 6px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.$hasError ? props.theme.colors.danger : props.theme.colors.primary};
  border: 2px solid ${props => props.theme.colors.bgMain};
  box-shadow: 0 0 6px ${props => props.$hasError ? props.theme.colors.danger : props.theme.colors.primaryGlow};
  z-index: 2;
`;

export const TimelineContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.03);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  transition: ${props => props.theme.transitions.smooth};

  &:hover {
    background: rgba(255, 255, 255, 0.02);
    border-color: ${props => props.theme.colors.borderColor};
  }
`;

export const TimelineDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const TimelineMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;
