import React, { useState } from 'react';
import styled from 'styled-components';
import { useApp } from '../../context/AppContext';
import { 
  Layers, 
  PlusCircle, 
  Activity, 
  Database, 
  TrendingUp, 
  Search, 
  AlertTriangle,
  Clock,
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

const MaterialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const MaterialCard = styled.div<{ $isWarning?: boolean }>`
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid ${props => props.$isWarning ? 'rgba(255, 23, 68, 0.3)' : props.theme.colors.borderColor};
  background: ${props => props.$isWarning ? 'rgba(255, 23, 68, 0.03)' : 'rgba(255, 255, 255, 0.02)'};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MaterialName = styled.span`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const MaterialStock = styled.span<{ $isWarning?: boolean }>`
  font-size: 1.5rem;
  font-weight: 600;
  font-family: ${props => props.theme.fonts.mono};
  color: ${props => props.$isWarning ? props.theme.colors.danger : props.theme.colors.textPrimary};
`;

const AdminGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  
  label {
    display: block;
    font-size: 0.85rem;
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 0.35rem;
    font-weight: 500;
  }
`;

const FormInput = styled.input`
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

const FormSelect = styled.select`
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

const BtnSubmit = styled.button`
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

const TableContainer = styled.div`
  overflow-x: auto;
`;

const CustomTable = styled.table`
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

  &.alert {
    background: rgba(255, 23, 68, 0.15);
    color: ${props => props.theme.colors.danger};
  }
`;

const FlowContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FlowStepBar = styled.div`
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

const FlowStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 2;
  flex: 1;
`;

const FlowStepCircle = styled.div<{ $active?: boolean; $completed?: boolean }>`
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

const FlowStepLabel = styled.span<{ $active?: boolean; $completed?: boolean }>`
  font-size: 0.8rem;
  color: ${props => {
    if (props.$completed) return props.theme.colors.success;
    if (props.$active) return props.theme.colors.primary;
    return props.theme.colors.textSecondary;
  }};
  font-weight: ${props => props.$active ? '600' : '500'};
`;

const LotDetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  background: rgba(255, 255, 255, 0.01);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.borderColor};
`;

const LotDetailInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LotDetailItem = styled.div`
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

const Dashboard: React.FC = () => {
  const { rawMaterials, workOrders, lotTracking, processStages, addWorkOrder } = useApp();
  
  const [formData, setFormData] = useState({
    productName: '스마트 HMI 패널',
    planQty: 100,
    worker: '홍길동'
  });

  const [selectedLotId, setSelectedLotId] = useState(lotTracking[0]?.lotId || '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName || formData.planQty <= 0) {
      alert('올바른 제품명과 계획수량을 입력해주세요.');
      return;
    }
    addWorkOrder(formData);
    setFormData(prev => ({
      ...prev,
      planQty: 100
    }));
    alert('작업 지시가 정상적으로 등록되었으며, 새로운 LOT가 생성되었습니다.');
  };

  const selectedLot = lotTracking.find(l => l.lotId === selectedLotId) || lotTracking[0];
  const associatedOrder = workOrders.find(o => o.id === selectedLot?.orderId);

  const getStageIndex = (stageName: string) => {
    return processStages.indexOf(stageName);
  };

  return (
    <DashboardContent>
      {/* 타이틀 영역 */}
      <TitleSection>
        <div>
          <h1>생산 관리 대시보드</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>실시간 공정 흐름 모니터링 및 자재 현황</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
          <Activity size={18} className="logo-icon" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>LIVE MONITORING ACTIVE</span>
        </div>
      </TitleSection>

      {/* 1. 원자재 현황 위젯 */}
      <GlassCard>
        <CardTitle>
          <Database size={18} />
          실시간 원자재 재고 현황
        </CardTitle>
        <MaterialGrid>
          {rawMaterials.map(mat => {
            const isWarning = mat.status === '부족';
            return (
              <MaterialCard key={mat.id} $isWarning={isWarning}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <MaterialName>{mat.name}</MaterialName>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{mat.id}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginTop: '0.5rem' }}>
                  <MaterialStock $isWarning={isWarning}>{mat.stock.toLocaleString()}</MaterialStock>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{mat.unit}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>안전재고: {mat.minStock}</span>
                  <StatusBadge className={isWarning ? 'alert' : 'completed'} style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}>
                    {isWarning ? (
                      <>
                        <AlertTriangle size={10} /> 부족
                      </>
                    ) : '충분'}
                  </StatusBadge>
                </div>
              </MaterialCard>
            );
          })}
        </MaterialGrid>
      </GlassCard>

      {/* 2. 대시보드 레이아웃: 작업지시 등록 / 목록 */}
      <AdminGrid>
        {/* 작업지시 목록 */}
        <GlassCard>
          <CardTitle>
            <TrendingUp size={18} />
            생산 작업 지시 현황
          </CardTitle>
          <TableContainer>
            <CustomTable>
              <thead>
                <tr>
                  <th>지시번호</th>
                  <th>품명</th>
                  <th>계획수량</th>
                  <th>생산수량</th>
                  <th>진척도</th>
                  <th>현재공정</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {workOrders.map(order => {
                  const progress = Math.round((order.outputQty / order.planQty) * 100);
                  const isCompleted = order.status === '완료';
                  const isProcessing = order.status === '진행중';
                  
                  return (
                    <tr key={order.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{order.id}</td>
                      <td style={{ fontWeight: 600 }}>{order.productName}</td>
                      <td>{order.planQty}</td>
                      <td>{order.outputQty}</td>
                      <td style={{ width: '150px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{progress}%</span>
                          <ProgressBarContainer>
                            <ProgressBarFill style={{ width: `${progress}%` }} />
                          </ProgressBarContainer>
                        </div>
                      </td>
                      <td>
                        <StatusBadge className="processing" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}>
                          {order.stage}
                        </StatusBadge>
                      </td>
                      <td>
                        <StatusBadge className={isCompleted ? 'completed' : isProcessing ? 'processing' : 'pending'}>
                          {order.status}
                        </StatusBadge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </CustomTable>
          </TableContainer>
        </GlassCard>

        {/* 작업지시 등록 */}
        <GlassCard>
          <CardTitle>
            <PlusCircle size={18} />
            신규 작업 지시 등록
          </CardTitle>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FormGroup>
              <label>생산 대상 제품</label>
              <FormSelect 
                name="productName" 
                value={formData.productName} 
                onChange={handleInputChange}
              >
                <option value="스마트 HMI 패널">스마트 HMI 패널 (알루미늄 프레임, 강화유리 필요)</option>
                <option value="임베디드 제어기">임베디드 제어기 (컨트롤러 칩셋 필요)</option>
                <option value="산업용 게이트웨이">산업용 게이트웨이 (연결 케이블 필요)</option>
              </FormSelect>
            </FormGroup>

            <FormGroup>
              <label>계획 수량 (EA)</label>
              <FormInput 
                type="number" 
                name="planQty"
                value={formData.planQty}
                onChange={handleInputChange}
                min="10"
                max="5000"
              />
            </FormGroup>

            <FormGroup>
              <label>담당 작업자</label>
              <FormSelect 
                name="worker" 
                value={formData.worker} 
                onChange={handleInputChange}
              >
                <option value="홍길동">홍길동 (조립/검사 숙련공)</option>
                <option value="이순신">이순신 (자재/가공 파트)</option>
                <option value="김유신">김유신 (패키징/출하)</option>
              </FormSelect>
            </FormGroup>

            <BtnSubmit type="submit">작업 지시 및 LOT 생성</BtnSubmit>
          </form>
        </GlassCard>
      </AdminGrid>

      {/* 3. 실시간 LOT 추적 및 공정 흐름도 */}
      <GlassCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <CardTitle style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
            <Layers size={18} />
            실시간 공정 흐름 및 LOT 추적
          </CardTitle>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <FormSelect 
              style={{ width: '220px', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
              value={selectedLotId}
              onChange={(e) => setSelectedLotId(e.target.value)}
            >
              {lotTracking.map(lot => (
                <option key={lot.lotId} value={lot.lotId}>{lot.lotId} ({lot.productName.slice(0, 10)}...)</option>
              ))}
            </FormSelect>
          </div>
        </div>

        {selectedLot ? (
          <FlowContainer>
            {/* LOT 기본 정보 */}
            <LotDetailGrid>
              <LotDetailInfo>
                <LotDetailItem>
                  <span>추적 LOT ID</span>
                  <span style={{ color: 'var(--color-primary)' }}>{selectedLot.lotId}</span>
                </LotDetailItem>
                <LotDetailItem>
                  <span>대상 제품명</span>
                  <span>{selectedLot.productName}</span>
                </LotDetailItem>
              </LotDetailInfo>
              <LotDetailInfo>
                <LotDetailItem>
                  <span>현재 공정단계</span>
                  <StatusBadge className="processing">{selectedLot.currentStage}</StatusBadge>
                </LotDetailItem>
                <LotDetailItem>
                  <span>생산 진척도</span>
                  <span>{associatedOrder ? `${associatedOrder.outputQty} / ${associatedOrder.planQty} EA` : '정보 없음'}</span>
                </LotDetailItem>
              </LotDetailInfo>
              <LotDetailInfo>
                <LotDetailItem>
                  <span>최종 작업자</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <UserCheck size={14} style={{ color: 'var(--color-success)' }} />
                    {selectedLot.updatedBy}
                  </span>
                </LotDetailItem>
                <LotDetailItem>
                  <span>최종 갱신시각</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={14} style={{ color: 'var(--color-info)' }} />
                    {selectedLot.lastUpdated}
                  </span>
                </LotDetailItem>
              </LotDetailInfo>
            </LotDetailGrid>

            {/* 가로형 스테퍼 흐름도 */}
            <FlowStepBar>
              {processStages.map((stage, idx) => {
                const currentIdx = getStageIndex(selectedLot.currentStage);
                const isCompleted = idx < currentIdx || selectedLot.status === '완료';
                const isActive = idx === currentIdx && selectedLot.status !== '완료';
                
                return (
                  <FlowStep key={stage}>
                    <FlowStepCircle $active={isActive} $completed={isCompleted}>
                      {idx + 1}
                    </FlowStepCircle>
                    <FlowStepLabel $active={isActive} $completed={isCompleted}>{stage}</FlowStepLabel>
                  </FlowStep>
                );
              })}
            </FlowStepBar>
          </FlowContainer>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            추적할 LOT 정보가 없습니다. 상단에서 작업 지시를 추가해주세요.
          </div>
        )}
      </GlassCard>
    </DashboardContent>
  );
};

export default Dashboard;
