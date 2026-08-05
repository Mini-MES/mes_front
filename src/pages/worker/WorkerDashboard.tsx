import React from 'react';
import { useApp } from '@/context/AppContext';
import { UserCheck } from 'lucide-react';
import * as S from '@/pages/worker/WorkerDashboard.styles';

// 하위 컴포넌트 & 커스텀 훅 임포트
import WorkerOrderList from '@/components/worker/orderList/WorkerOrderList';
import WorkerControlPanel from '@/components/worker/controlPanel/WorkerControlPanel';
import { useWorkerDashboard } from '@/pages/worker/useWorkerDashboard';

const WorkerDashboard: React.FC = () => {
  const { currentUser, processStages } = useApp();
  const {
    workOrders,
    lotTracking,
    defectReasons,
    activeOrderId,
    activeOrder,
    activeLot,
    sensorStatus,
    accumulatedGood,
    accumulatedBad,
    lastPulseTime,
    setSelectedOrderId,
    handleStart,
    handleTogglePause,
    handleConfirmPerformance,
    handleRegisterDefect,
    handleNextStage,
    handleComplete,
    isPending
  } = useWorkerDashboard();

  return (
    <S.DashboardContent>
      {/* 작업자 상단 안내 */}
      <S.TitleSection>
        <div>
          <h1>작업자 작업 실행 패널</h1>
          <S.HeaderSubText>실시간 센서 수량 자동 수집 및 실적 마감 승인</S.HeaderSubText>
        </div>
        <S.UserStatus>
          <UserCheck size={18} />
          <S.UserStatusText>{currentUser.name} 작업자 로그인 중</S.UserStatusText>
        </S.UserStatus>
      </S.TitleSection>

      <S.WorkerLayoutGrid>
        {/* 좌측: 작업 지시 목록 */}
        <WorkerOrderList 
          workOrders={workOrders} 
          lotTracking={lotTracking} 
          activeOrderId={activeOrderId} 
          onSelectOrder={setSelectedOrderId} 
          processStages={processStages}
        />

        {/* 우측: 센서 연동 컨트롤러 패널 */}
        <WorkerControlPanel 
          activeOrder={activeOrder}
          activeLot={activeLot}
          processStages={processStages}
          defectReasons={defectReasons}
          sensorStatus={sensorStatus}
          accumulatedGood={accumulatedGood}
          accumulatedBad={accumulatedBad}
          lastPulseTime={lastPulseTime}
          onStart={handleStart}
          onTogglePause={handleTogglePause}
          onConfirmPerformance={handleConfirmPerformance}
          onRegisterDefect={handleRegisterDefect}
          onNextStage={handleNextStage}
          onComplete={handleComplete}
          isPending={{
            start: isPending.start,
            confirm: isPending.qty,
            next: isPending.next,
            complete: isPending.complete,
          }}
        />
      </S.WorkerLayoutGrid>
    </S.DashboardContent>
  );
};

export default WorkerDashboard;
