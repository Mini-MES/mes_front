import styled, { keyframes } from 'styled-components';

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 15px rgba(0, 240, 255, 0.3); }
  50% { box-shadow: 0 0 30px rgba(0, 240, 255, 0.7), 0 0 50px rgba(139, 92, 246, 0.4); }
  100% { box-shadow: 0 0 15px rgba(0, 240, 255, 0.3); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const ModalHeaderExtra = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
`;

export const AiBadge = styled.span<{ $isFallback?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.$isFallback 
    ? 'rgba(245, 158, 11, 0.15)' 
    : 'rgba(0, 240, 255, 0.15)'};
  color: ${props => props.$isFallback ? '#F59E0B' : '#00F0FF'};
  border: 1px solid ${props => props.$isFallback 
    ? 'rgba(245, 158, 11, 0.4)' 
    : 'rgba(0, 240, 255, 0.4)'};
`;

export const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: rgba(15, 23, 42, 0.8);
  border-bottom: 1px solid rgba(51, 65, 85, 0.5);
  gap: 12px;
`;

export const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${props => props.$variant === 'primary' ? '#00F0FF' : 'rgba(148, 163, 184, 0.3)'};
  background: ${props => props.$variant === 'primary' 
    ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(139, 92, 246, 0.2))' 
    : 'rgba(30, 41, 59, 0.6)'};
  color: ${props => props.$variant === 'primary' ? '#00F0FF' : '#E2E8F0'};

  &:hover {
    background: ${props => props.$variant === 'primary' 
      ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.4), rgba(139, 92, 246, 0.4))' 
      : 'rgba(51, 65, 85, 0.8)'};
    transform: translateY(-1px);
    box-shadow: ${props => props.$variant === 'primary' ? '0 0 15px rgba(0, 240, 255, 0.4)' : 'none'};
  }

  svg.spinning {
    animation: ${spin} 1s linear infinite;
  }
`;

export const ReportContainer = styled.div`
  padding: 24px;
  background: #0B1329;
  color: #F8FAFC;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  line-height: 1.7;
  max-height: 70vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #0F172A;
  }
  &::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #00F0FF;
  }
`;

export const LoadingBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 20px;
  text-align: center;
`;

export const AiPulseIcon = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 240, 255, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00F0FF;
  animation: ${pulseGlow} 2s infinite ease-in-out;
  border: 2px solid rgba(0, 240, 255, 0.6);
`;

export const LoadingText = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #00F0FF;
`;

export const LoadingSubText = styled.div`
  font-size: 0.85rem;
  color: #94A3B8;
`;

export const MarkdownContent = styled.div`
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #00F0FF;
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 2px solid rgba(0, 240, 255, 0.3);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #38BDF8;
    margin-top: 24px;
    margin-bottom: 12px;
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #A78BFA;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  h4 {
    font-size: 0.95rem;
    font-weight: 600;
    color: #F472B6;
    margin-top: 14px;
    margin-bottom: 6px;
  }

  p {
    margin-bottom: 12px;
    color: #CBD5E1;
  }

  blockquote {
    background: rgba(30, 41, 59, 0.7);
    border-left: 4px solid #00F0FF;
    padding: 12px 16px;
    border-radius: 0 8px 8px 0;
    margin: 16px 0;
    color: #E2E8F0;
    font-size: 0.9rem;
  }

  ul, ol {
    margin: 12px 0 16px 20px;
    padding-left: 10px;
  }

  li {
    margin-bottom: 6px;
    color: #E2E8F0;

    strong {
      color: #00F0FF;
    }
  }

  hr {
    border: none;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.4), transparent);
    margin: 20px 0;
  }
`;
