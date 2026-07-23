import React from 'react';
import { Layers, Clock, User } from 'lucide-react';
import { LotTracking, WorkOrder } from '@/context/AppContext';
import * as S from '@/components/admin/lotTracker/LotProcessTracker.styles';

interface LotDetailsPanelProps {
  selectedLot: LotTracking | undefined;
  associatedOrder: WorkOrder | undefined;
  processStages: string[];
  getStageName: (id: number) => string;
  getStatusLabel: (status: string) => string;
  getStatusClass: (status: string) => string;
  performances: any[];
  isHistoryLoading: boolean;
  onUnholdLot?: (lotId: string) => void;
  isUnholdPending?: boolean;
  unholdingLotId?: string;
}

export const LotDetailsPanel: React.FC<LotDetailsPanelProps> = ({
  selectedLot,
  associatedOrder,
  processStages = [],
  getStageName,
  getStatusLabel,
  getStatusClass,
  performances = [],
  isHistoryLoading,
  onUnholdLot,
  isUnholdPending,
  unholdingLotId
}) => {
  const getStageIndex = (stageId: number) => {
    return stageId - 1;
  };

  const safePerformances = Array.isArray(performances) ? performances : [];
  const safeStages = Array.isArray(processStages) ? processStages : [];

  const lotPerformances = selectedLot
    ? safePerformances
        .filter((p: any) => p && p.lotID === selectedLot.lotID)
        .sort((a: any, b: any) => new Date(b.workDate || 0).getTime() - new Date(a.workDate || 0).getTime())
    : [];

  const lotStatusUpper = selectedLot?.status ? String(selectedLot.status).toUpperCase() : '';
  const isThisLotUnholding = Boolean(isUnholdPending && selectedLot && unholdingLotId === selectedLot.lotID);

  return (
    <S.LotDetailsPanel>
      {selectedLot ? (
        <S.FlowContainer>
          {/* LOT 기본 정보 */}
          <S.LotDetailGrid>
            <S.LotDetailInfo>
              <S.LotDetailItem>
                <span>추적 LOT ID</span>
                <S.PrimaryTextSpan>{selectedLot.lotID}</S.PrimaryTextSpan>
              </S.LotDetailItem>
              <S.LotDetailItem>
                <span>현재 공정단계</span>
                <S.StatusBadge className="processing">
                  {getStageName(selectedLot.currentProcessID)}
                </S.StatusBadge>
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
                <S.BadQtySpan $hasBad={selectedLot.totalBadQty > 0}>
                  {selectedLot.totalBadQty} EA
                </S.BadQtySpan>
              </S.LotDetailItem>
              <S.LotDetailItem>
                <span>LOT 상태</span>
                <S.StatusColumnGroup>
                  <S.StatusBadge className={getStatusClass(selectedLot.status || '')}>
                    {getStatusLabel(selectedLot.status || '')}
                  </S.StatusBadge>
                  {lotStatusUpper === 'HOLD' && onUnholdLot && (
                    <S.BtnUnhold
                      type="button"
                      onClick={() => onUnholdLot(selectedLot.lotID)}
                      disabled={isThisLotUnholding}
                    >
                      {isThisLotUnholding ? '해제 중...' : '🔓 보류 해제 (Un-HOLD)'}
                    </S.BtnUnhold>
                  )}
                </S.StatusColumnGroup>
              </S.LotDetailItem>
            </S.LotDetailInfo>
          </S.LotDetailGrid>

          {/* 가로형 스테퍼 흐름도 */}
          <div>
            <S.SectionLabel>공정 진행 상황</S.SectionLabel>
            <S.FlowStepBar>
              {safeStages.map((stage, idx) => {
                const currentIdx = getStageIndex(selectedLot.currentProcessID);
                const isCompleted = idx < currentIdx || lotStatusUpper === 'COMPLETED' || lotStatusUpper === 'DONE';
                const isActive = idx === currentIdx && lotStatusUpper !== 'COMPLETED' && lotStatusUpper !== 'DONE';
                
                return (
                  <S.FlowStep key={stage || idx}>
                    <S.FlowStepCircle $active={isActive} $completed={isCompleted}>
                      {idx + 1}
                    </S.FlowStepCircle>
                    <S.FlowStepLabel $active={isActive} $completed={isCompleted}>
                      {stage}
                    </S.FlowStepLabel>
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
              <S.HistoryLoadingText>이력 조회 중...</S.HistoryLoadingText>
            ) : lotPerformances.length > 0 ? (
              <S.TimelineList>
                {lotPerformances.map((perf: any, index: number) => {
                  const hasBad = (perf?.badQty || 0) > 0;
                  const formattedTime = perf?.workDate 
                    ? new Date(perf.workDate).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })
                    : '-';

                  return (
                    <S.TimelineItem key={perf.perfID ?? `perf-${index}`}>
                      <S.TimelineMarker $hasError={hasBad} />
                      <S.TimelineContent>
                        <S.TimelineDetails>
                          <S.TimelinePerfHeader $hasBad={hasBad}>
                            <span>[{getStageName(perf.processID)}] 공정 실적</span>
                            {hasBad && <S.TimelineBadBadge>불량 발생 (보류)</S.TimelineBadBadge>}
                          </S.TimelinePerfHeader>
                          <S.TimelinePerfBody>
                            양품 등록: <strong className="success">{perf.goodQty ?? 0}</strong> EA / 
                            불량 등록: <strong className="danger">{perf.badQty ?? 0}</strong> EA
                            {perf.reasonCode && <span style={{ color: 'var(--color-danger)', marginLeft: '0.35rem' }}>(사유: <strong>{perf.reasonCode}</strong>)</span>}
                            {perf.toolID && <span> (사용 공구: <strong className="primary">{perf.toolID}</strong>)</span>}
                          </S.TimelinePerfBody>
                        </S.TimelineDetails>
                        <S.TimelineMeta>
                          <S.TimelineUserGroup>
                            <User size={12} />
                            <span>작업자: {perf.userID || 'system'}</span>
                          </S.TimelineUserGroup>
                          <S.TimelineTimeText>{formattedTime}</S.TimelineTimeText>
                        </S.TimelineMeta>
                      </S.TimelineContent>
                    </S.TimelineItem>
                  );
                })}
              </S.TimelineList>
            ) : (
              <S.EmptyTimelineState>
                등록된 공정 실적 이력이 없습니다. 현장 작업자 패널에서 실적을 등록해 주세요.
              </S.EmptyTimelineState>
            )}
          </S.TimelineContainer>
        </S.FlowContainer>
      ) : (
        <S.EmptyLotSelectionState>
          <Layers size={36} />
          추적할 LOT 정보가 없습니다. 좌측 목록에서 로트를 선택하거나 검색해 주세요.
        </S.EmptyLotSelectionState>
      )}
    </S.LotDetailsPanel>
  );
};

export default LotDetailsPanel;
