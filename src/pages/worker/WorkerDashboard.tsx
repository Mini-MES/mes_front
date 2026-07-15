import React, { useState } from 'react';
import styled from 'styled-components';
import { useApp } from '../../context/AppContext';
import { 
  Play, 
  CheckCircle, 
  ArrowRight, 
  AlertCircle,
  FileText,
  UserCheck
} from 'lucide-react';

const DashboardContent = styled.div`
  flex: 1;
  padding: 2rem;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.03em;
  }
`;

const WorkerLayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const GlassCard = styled.section`
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

const CardTitle = styled.h2`
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

const WorkItemCard = styled.div<{ $isSelected?: boolean }>`
  padding: 1.25rem;
  border-radius: 12px;
  background: ${props => props.$isSelected ? 'rgba(0, 229, 255, 0.03)' : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.$isSelected ? props.theme.colors.primary : props.theme.colors.borderColor};
  box-shadow: ${props => props.$isSelected ? `inset 0 0 10px rgba(0, 229, 255, 0.05)` : 'none'};
  cursor: pointer;
  transition: ${props => props.theme.transitions.smooth};
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: ${props => props.$isSelected ? props.theme.colors.primary : 'rgba(0, 229, 255, 0.3)'};
  }
`;

const WorkItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const WorkItemId = styled.span`
  font-family: ${props => props.theme.fonts.mono};
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textMuted};
`;

const WorkItemTitle = styled.span`
  font-size: 1.05rem;
  font-weight: 600;
`;

const WorkItemQty = styled.span`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ProgressBarContainer = styled.div`
  height: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${props => props.theme.colors.info}, ${props => props.theme.colors.success});
  border-radius: 4px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const StatusBadge = styled.span`
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
`;

const WorkerControlPanel = styled(GlassCard)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const QuantityController = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const BtnQty = styled.button`
  flex: 1;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${props => props.theme.colors.borderColor};
  color: ${props => props.theme.colors.textPrimary};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.transitions.smooth};

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    border-color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    color: ${props => props.theme.colors.textMuted};
    cursor: not-allowed;
  }
`;

const TransitionButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: rgba(0, 229, 255, 0.1);
  color: ${props => props.theme.colors.primary};
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.transitions.smooth};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary};
    color: #0b0f19;
    box-shadow: 0 0 15px rgba(0, 229, 255, 0.3);
  }

  &:disabled {
    border-color: ${props => props.theme.colors.borderColor};
    color: ${props => props.theme.colors.textMuted};
    background: transparent;
    cursor: not-allowed;
  }
`;

const BtnActionPrimary = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, ${props => props.theme.colors.success} 0%, ${props => props.theme.colors.info} 100%);
  color: #0b0f19;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: ${props => props.theme.transitions.smooth};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 230, 118, 0.3);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.05);
    color: ${props => props.theme.colors.textMuted};
    border: 1px solid ${props => props.theme.colors.borderColor};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const WorkerDashboard: React.FC = () => {
  const { 
    workOrders, 
    processStages, 
    currentUser, 
    updateOrderStage, 
    increaseOutputQty 
  } = useApp();

  const [selectedOrderId, setSelectedOrderId] = useState(workOrders[0]?.id || '');

  const activeOrder = workOrders.find(o => o.id === selectedOrderId);

  const getStageIndex = (stageName: string) => {
    return processStages.indexOf(stageName);
  };

  const currentStageIndex = activeOrder ? getStageIndex(activeOrder.stage) : -1;
  const isLastStage = currentStageIndex === processStages.length - 1;
  const isPlanCompleted = activeOrder && activeOrder.outputQty >= activeOrder.planQty;
  const isOrderCompleted = activeOrder && activeOrder.status === '완료';

  const handleNextStage = () => {
    if (!activeOrder || isLastStage || isOrderCompleted) return;
    const nextStage = processStages[currentStageIndex + 1];
    updateOrderStage(selectedOrderId, nextStage);
  };

  const handleIncreaseQty = (amount: number) => {
    if (!activeOrder || isOrderCompleted) return;
    increaseOutputQty(selectedOrderId, amount);
  };

  const handleCompleteOrder = () => {
    if (!activeOrder || isOrderCompleted) return;
    if (!isLastStage) {
      alert('최종 공정(포장) 단계로 이동한 후 완료 처리를 해주세요.');
      return;
    }
    if (!isPlanCompleted) {
      alert('생산 수량이 계획 수량에 도달해야 완료할 수 있습니다.');
      return;
    }
    updateOrderStage(selectedOrderId, '포장');
    alert(`작업 지시 [${selectedOrderId}]의 모든 공정이 최종 완료되었습니다!`);
  };

  return (
    <DashboardContent>
      {/* 작업자 상단 안내 */}
      <TitleSection>
        <div>
          <h1>작업자 작업 실행 패널</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>할당된 작업 공정 진행 및 실적 입력</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)' }}>
          <UserCheck size={18} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{currentUser.name} 작업자 로그인 중</span>
        </div>
      </TitleSection>

      <WorkerLayoutGrid>
        {/* 좌측: 작업 지시 목록 */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <CardTitle>
            <FileText size={18} />
            진행 가능한 작업 지시 목록
          </CardTitle>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {workOrders.map(order => {
              const isSelected = order.id === selectedOrderId;
              const progress = Math.round((order.outputQty / order.planQty) * 100);
              
              return (
                <WorkItemCard 
                  key={order.id} 
                  $isSelected={isSelected}
                  onClick={() => setSelectedOrderId(order.id)}
                >
                  <WorkItemInfo>
                    <WorkItemId>{order.id} | {order.date}</WorkItemId>
                    <WorkItemTitle>{order.productName}</WorkItemTitle>
                    <WorkItemQty>
                      계획: {order.planQty} EA / 현재 생산: {order.outputQty} EA ({progress}%)
                    </WorkItemQty>
                    <ProgressBarContainer style={{ width: '200px', marginTop: '0.25rem' }}>
                      <ProgressBarFill style={{ width: `${progress}%` }} />
                    </ProgressBarContainer>
                  </WorkItemInfo>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <StatusBadge className={order.status === '완료' ? 'completed' : order.status === '진행중' ? 'processing' : 'pending'}>
                      {order.status}
                    </StatusBadge>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      공정: {order.stage}
                    </span>
                  </div>
                </WorkItemCard>
              );
            })}
          </div>
        </GlassCard>

        {/* 우측: 공정 컨트롤러 패널 */}
        <WorkerControlPanel>
          <CardTitle>
            <Play size={18} />
            작업 공정 및 실적 관리
          </CardTitle>

          {activeOrder ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* 현재 상태 정보 */}
              <div style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{activeOrder.id}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--color-primary)' }}>{activeOrder.productName}</div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>현재 진행 단계</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-info)' }}>{activeOrder.stage}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>생산 수량</span>
                  <span style={{ fontWeight: 600 }}>{activeOrder.outputQty} / {activeOrder.planQty} EA</span>
                </div>
              </div>

              {/* 공정 스태퍼 요약 */}
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>전체 공정 현황</span>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {processStages.map((stage, idx) => {
                    const isActive = idx === currentStageIndex;
                    const isCompleted = idx < currentStageIndex || isOrderCompleted;
                    return (
                      <div 
                        key={stage} 
                        style={{ 
                          flex: 1, 
                          height: '6px', 
                          borderRadius: '3px',
                          background: isCompleted ? 'var(--color-success)' : isActive ? 'var(--color-primary)' : 'var(--border-color)',
                          boxShadow: isActive ? '0 0 8px var(--color-primary-glow)' : 'none'
                        }}
                        title={stage}
                      />
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  <span>{processStages[0]}</span>
                  <span>{activeOrder.stage}</span>
                  <span>{processStages[processStages.length - 1]}</span>
                </div>
              </div>

              {/* 실적 추가 버튼 */}
              <ControlGroup>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>생산 수량 실적 등록 (+EA)</span>
                <QuantityController>
                  <BtnQty 
                    onClick={() => handleIncreaseQty(1)}
                    disabled={isOrderCompleted || isPlanCompleted}
                  >
                    +1
                  </BtnQty>
                  <BtnQty 
                    onClick={() => handleIncreaseQty(10)}
                    disabled={isOrderCompleted || (activeOrder.outputQty + 10 > activeOrder.planQty)}
                  >
                    +10
                  </BtnQty>
                  <BtnQty 
                    onClick={() => handleIncreaseQty(activeOrder.planQty - activeOrder.outputQty)}
                    disabled={isOrderCompleted || isPlanCompleted}
                  >
                    남은 전량 채우기
                  </BtnQty>
                </QuantityController>
              </ControlGroup>

              {/* 공정 이동 버튼 */}
              <ControlGroup>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>공정 단계 전환</span>
                <TransitionButton 
                  onClick={handleNextStage}
                  disabled={isLastStage || isOrderCompleted}
                >
                  다음 공정 단계로 이동 ({activeOrder.stage} <ArrowRight size={14} /> {isLastStage ? '종료' : processStages[currentStageIndex + 1]})
                </TransitionButton>
              </ControlGroup>

              {/* 최종 작업 완료 처리 버튼 */}
              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <BtnActionPrimary 
                  onClick={handleCompleteOrder}
                  disabled={isOrderCompleted || !isLastStage || !isPlanCompleted}
                >
                  <CheckCircle size={18} />
                  {isOrderCompleted ? '작업 완료됨' : '최종 공정 완료 처리'}
                </BtnActionPrimary>
                
                {!isOrderCompleted && (!isLastStage || !isPlanCompleted) && (
                  <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.5rem', justifyContent: 'center' }}>
                    <AlertCircle size={12} />
                    <span>마지막 '포장' 단계 및 계획수량 도달 시 완료 가능</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              진행할 작업 지시를 왼쪽 목록에서 선택해 주세요.
            </div>
          )}
        </WorkerControlPanel>
      </WorkerLayoutGrid>
    </DashboardContent>
  );
};

export default WorkerDashboard;
