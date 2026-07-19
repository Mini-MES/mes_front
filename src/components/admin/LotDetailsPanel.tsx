import React from 'react';
import { Layers, Clock, User } from 'lucide-react';
import { LotTracking, WorkOrder } from '@/context/AppContext';
import * as S from '@/components/admin/LotProcessTracker.styles';

interface LotDetailsPanelProps {
  selectedLot: LotTracking | undefined;
  associatedOrder: WorkOrder | undefined;
  processStages: string[];
  getStageName: (id: number) => string;
  getStatusLabel: (status: string) => string;
  getStatusClass: (status: string) => string;
  performances: any[];
  isHistoryLoading: boolean;
}

export const LotDetailsPanel: React.FC<LotDetailsPanelProps> = ({
  selectedLot,
  associatedOrder,
  processStages,
  getStageName,
  getStatusLabel,
  getStatusClass,
  performances,
  isHistoryLoading
}) => {
  const getStageIndex = (stageId: number) => {
    return stageId - 1;
  };

  // 현재 LOT ID에 부합하는 이력만 발췌 후 시간 역순(최신순) 정렬
  const lotPerformances = selectedLot
    ? performances
        .filter((p: any) => p.lotID === selectedLot.lotID)
        .sort((a: any, b: any) => new Date(b.workDate).getTime() - new Date(a.workDate).getTime())
    : [];

  return (
    <S.LotDetailsPanel>
      {selectedLot ? (
        <S.FlowContainer>
          {/* LOT 기본 정보 */}
          <S.LotDetailGrid>
            <S.LotDetailInfo>
              <S.LotDetailItem>
                <span>추적 LOT ID</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{selectedLot.lotID}</span>
              </S.LotDetailItem>
              <S.LotDetailItem>
                <span>현재 공정단계</span>
                <S.StatusBadge className="processing">{getStageName(selectedLot.currentProcessID)}</S.StatusBadge>
              </S.LotDetailItem>
            </S.LotDetailInfo>
            <S.LotDetailInfo>
              <S.LotDetailItem>
                <span>연계 지시 ID</span>
                <span>WO-{selectedLot.orderID}</span>
              </S.LotDetailItem>
              <S.LotDetailItem>
                <span>생산 진척도</span>
                <span>
                  {associatedOrder ? `${associatedOrder.totalGoodQty} / ${associatedOrder.targetQty} EA` : '정보 없음'}
                </span>
              </S.LotDetailItem>
            </S.LotDetailInfo>
            <S.LotDetailInfo>
              <S.LotDetailItem>
                <span>불량 수량</span>
                <span style={{ color: selectedLot.totalBadQty > 0 ? 'var(--color-danger)' : 'inherit', fontWeight: selectedLot.totalBadQty > 0 ? 600 : 'normal' }}>
                  {selectedLot.totalBadQty} EA
                </span>
              </S.LotDetailItem>
              <S.LotDetailItem>
                <span>LOT 상태</span>
                <S.StatusBadge className={getStatusClass(selectedLot.status)}>
                  {getStatusLabel(selectedLot.status)}
                </S.StatusBadge>
              </S.LotDetailItem>
            </S.LotDetailInfo>
          </S.LotDetailGrid>

          {/* 가로형 스테퍼 흐름도 */}
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>공정 진행 상황</span>
            <S.FlowStepBar>
              {processStages.map((stage, idx) => {
                const currentIdx = getStageIndex(selectedLot.currentProcessID);
                const isCompleted = idx < currentIdx || selectedLot.status.toUpperCase() === 'COMPLETED' || selectedLot.status.toUpperCase() === 'DONE';
                const isActive = idx === currentIdx && selectedLot.status.toUpperCase() !== 'COMPLETED' && selectedLot.status.toUpperCase() !== 'DONE';
                
                return (
                  <S.FlowStep key={stage}>
                    <S.FlowStepCircle $active={isActive} $completed={isCompleted}>
                      {idx + 1}
                    </S.FlowStepCircle>
                    <S.FlowStepLabel $active={isActive} $completed={isCompleted}>{stage}</S.FlowStepLabel>
                  </S.FlowStep>
                );
              })}
            </S.FlowStepBar>
          </div>

          {/* 하단 세분화 추적: LOT 이송 및 공정 실적 히스토리 타임라인 */}
          <S.TimelineContainer>
            <S.TimelineTitle>
              <Clock size={16} style={{ color: 'var(--color-primary)' }} />
              로트 공정 이송 및 작업 실적 이력 (Trace Log)
            </S.TimelineTitle>
            
            {isHistoryLoading ? (
              <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>이력 조회 중...</div>
            ) : lotPerformances.length > 0 ? (
              <S.TimelineList>
                {lotPerformances.map((perf: any) => {
                  const hasBad = perf.badQty > 0;
                  const formattedTime = new Date(perf.workDate).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  });

                  return (
                    <S.TimelineItem key={perf.perfID}>
                      <S.TimelineMarker $hasError={hasBad} />
                      <S.TimelineContent>
                        <S.TimelineDetails>
                          <div style={{ fontWeight: 600, color: hasBad ? 'var(--color-danger)' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>[{getStageName(perf.processID)}] 공정 실적</span>
                            {hasBad && <span style={{ fontSize: '0.7rem', background: 'rgba(255,23,68,0.15)', color: 'var(--color-danger)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>불량 발생 (보류)</span>}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            양품 등록: <strong style={{ color: 'var(--color-success)' }}>{perf.goodQty}</strong> EA / 
                            불량 등록: <strong style={{ color: 'var(--color-danger)' }}>{perf.badQty}</strong> EA
                            {perf.reasonCode && <span style={{ color: 'var(--color-danger)', marginLeft: '0.35rem' }}>(사유: <strong>{perf.reasonCode}</strong>)</span>}
                            {perf.toolID && <span> (사용 공구: <strong style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>{perf.toolID}</strong>)</span>}
                          </div>
                        </S.TimelineDetails>
                        <S.TimelineMeta>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <User size={12} />
                            <span>작업자: {perf.userID}</span>
                          </div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{formattedTime}</span>
                        </S.TimelineMeta>
                      </S.TimelineContent>
                    </S.TimelineItem>
                  );
                })}
              </S.TimelineList>
            ) : (
              <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border-color)', borderRadius: '8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                등록된 공정 실적 이력이 없습니다. 현장 작업자 패널에서 실적을 등록해 주세요.
              </div>
            )}
          </S.TimelineContainer>
        </S.FlowContainer>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', color: 'var(--text-muted)' }}>
          <Layers size={36} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          추적할 LOT 정보가 없습니다. 좌측 목록에서 로트를 선택하거나 검색해 주세요.
        </div>
      )}
    </S.LotDetailsPanel>
  );
};

export default LotDetailsPanel;
