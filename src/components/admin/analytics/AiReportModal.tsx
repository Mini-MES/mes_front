import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { customFetch } from '@/api/fetcher';
import { AiReportResponse } from '@/types/equipment';
import Modal from '@/components/common/Modal';
import { Bot, RefreshCw, Copy, Check, Sparkles, AlertTriangle } from 'lucide-react';
import * as S from './AiReportModal.styles';

interface AiReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiReportModal: React.FC<AiReportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  const { data, isLoading, isError, refetch, isRefetching } = useQuery<AiReportResponse>({
    queryKey: ['aiSmartReport'],
    queryFn: () => customFetch('/analytics/ai-report'),
    enabled: isOpen,
    staleTime: 1000 * 60 * 5, // 5분 캐싱
  });

  const handleCopy = async () => {
    if (data?.reportMarkdown) {
      try {
        await navigator.clipboard.writeText(data.reportMarkdown);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  const renderBoldText = (text: string): React.ReactNode[] => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      if (!trimmed) return <div key={idx} style={{ height: '8px' }} />;

      if (trimmed.startsWith('# ')) {
        return <h1 key={idx}>{renderBoldText(trimmed.replace('# ', ''))}</h1>;
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx}>{renderBoldText(trimmed.replace('### ', ''))}</h3>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx}>{renderBoldText(trimmed.replace('## ', ''))}</h2>;
      }
      if (trimmed.startsWith('#### ')) {
        return <h4 key={idx}>{renderBoldText(trimmed.replace('#### ', ''))}</h4>;
      }
      if (trimmed.startsWith('> ')) {
        return <blockquote key={idx}>{renderBoldText(trimmed.replace('> ', ''))}</blockquote>;
      }
      if (trimmed.startsWith('---')) {
        return <hr key={idx} />;
      }
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const itemText = trimmed.replace(/^[\*\-]\s+/, '');
        return <li key={idx}>{renderBoldText(itemText)}</li>;
      }

      return <p key={idx}>{renderBoldText(trimmed)}</p>;
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gemini AI 스마트 생산 진단 리포트"
      icon={<Bot size={22} color="#00F0FF" />}
      maxWidth="850px"
    >
      <S.ActionBar>
        <S.ModalHeaderExtra>
          <S.AiBadge $isFallback={data?.isFallback}>
            {data?.isFallback ? <AlertTriangle size={13} /> : <Sparkles size={13} />}
            {data?.isFallback ? '시스템 예시 리포트 (API 키 미설정)' : 'Gemini 2.5 Flash 실시간 분석'}
          </S.AiBadge>
          {data?.generatedAt && (
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              분석 시각: {data.generatedAt}
            </span>
          )}
        </S.ModalHeaderExtra>

        <div style={{ display: 'flex', gap: '8px' }}>
          <S.ActionButton onClick={handleCopy} $variant="secondary">
            {copied ? <Check size={15} color="#10B981" /> : <Copy size={15} />}
            {copied ? '복사됨' : '복사하기'}
          </S.ActionButton>

          <S.ActionButton 
            onClick={() => refetch()} 
            $variant="primary"
            disabled={isLoading || isRefetching}
          >
            <RefreshCw size={15} className={isLoading || isRefetching ? 'spinning' : ''} />
            {isLoading || isRefetching ? '분석 중...' : '재분석 실행'}
          </S.ActionButton>
        </div>
      </S.ActionBar>

      <S.ReportContainer>
        {isLoading || isRefetching ? (
          <S.LoadingBox>
            <S.AiPulseIcon>
              <Bot size={36} />
            </S.AiPulseIcon>
            <S.LoadingText>🤖 Google Gemini AI가 전사 OEE 및 비가동 로그를 분석 중입니다...</S.LoadingText>
            <S.LoadingSubText>실시간 가동률, 설비별 병목 원인 및 3단계 개선 대책을 도출하고 있습니다.</S.LoadingSubText>
          </S.LoadingBox>
        ) : isError || !data || !data?.success ? (
          <S.LoadingBox>
            <AlertTriangle size={40} color="#EF4444" />
            <S.LoadingText style={{ color: '#EF4444' }}>AI 스마트 진단 데이터를 불러오지 못했습니다.</S.LoadingText>
            <S.ActionButton onClick={() => refetch()} $variant="primary">
              다시 시도하기
            </S.ActionButton>
          </S.LoadingBox>
        ) : (
          <S.MarkdownContent>
            {renderMarkdown(data.reportMarkdown)}
          </S.MarkdownContent>
        )}
      </S.ReportContainer>
    </Modal>
  );
};

export default AiReportModal;
