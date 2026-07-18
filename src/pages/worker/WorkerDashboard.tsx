import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customFetch } from '@/api/fetcher';
import { useApp } from '@/context/AppContext';
import { UserCheck } from 'lucide-react';
import { WorkOrder, LotTracking } from '@/context/AppContext';
import { DashboardContent, TitleSection, WorkerLayoutGrid } from '@/pages/worker/WorkerDashboard.styles';

// 분리한 하위 컴포넌트 임포트
import WorkerOrderList from '@/components/worker/WorkerOrderList';
import WorkerControlPanel from '@/components/worker/WorkerControlPanel';

const WorkerDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const { currentUser, processStages } = useApp();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // 1. 작업지시 및 LOT 목록 서버 조회
  const { data: workOrders = [] } = useQuery<WorkOrder[]>({
    queryKey: ['workOrders'],
    queryFn: () => customFetch('/Production/orders'),
    refetchInterval: 5000,
  });

  const { data: lotTracking = [] } = useQuery<LotTracking[]>({
    queryKey: ['lots'],
    queryFn: () => customFetch('/Production/lots'),
    refetchInterval: 5000,
  });

  // 현재 활성화된 지시 및 LOT 확인
  const activeOrderId = selectedOrderId || workOrders[0]?.orderID || null;
  const activeOrder = workOrders.find(o => o.orderID === activeOrderId);
  const activeLot = lotTracking.find(l => l.orderID === activeOrderId);

  // 2. 생산 시작 Mutation
  const startProductionMutation = useMutation({
    mutationFn: (orderId: number) => 
      customFetch(`/Production/start/${orderId}`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      alert('생산 프로세스를 시작합니다.');
    },
    onError: (err: any) => alert(`시작 실패: ${err.message}`)
  });

  // 3. 실적 등록 Mutation
  const registerPerformanceMutation = useMutation({
    mutationFn: (perf: { workOrderID: number; lotID: string; processID: number; inputQty: number; goodQty: number; badQty: number }) => 
      customFetch('/Production/performance/register', {
        method: 'POST',
        body: JSON.stringify(perf)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      queryClient.invalidateQueries({ queryKey: ['rawMaterials'] });
    },
    onError: (err: any) => alert(`실적 등록 실패: ${err.message}`)
  });

  // 4. 공정 이동 Mutation (실적 등록 + 공정 이동 트랜잭션 호출)
  const moveProcessMutation = useMutation({
    mutationFn: ({ perf, nextProcessId }: { perf: any; nextProcessId: number }) => 
      customFetch(`/Production/performance/move?nextProcessId=${nextProcessId}`, {
        method: 'POST',
        body: JSON.stringify(perf)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      queryClient.invalidateQueries({ queryKey: ['rawMaterials'] });
      alert('공정이 성공적으로 다음 단계로 이동되었습니다.');
    },
    onError: (err: any) => alert(`공정 이동 실패: ${err.message}`)
  });

  // 5. 생산 완료 마감 Mutation
  const completeProductionMutation = useMutation({
    mutationFn: (orderId: number) => 
      customFetch(`/Production/complete/${orderId}`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      alert('생산 마감 처리가 완료되었습니다.');
    },
    onError: (err: any) => alert(`마감 실패: ${err.message}`)
  });

  const handleStart = () => {
    if (!activeOrderId) return;
    startProductionMutation.mutate(activeOrderId);
  };

  const handleIncreaseQty = (amount: number) => {
    if (!activeOrder || !activeLot) return;
    registerPerformanceMutation.mutate({
      workOrderID: activeOrder.orderID,
      lotID: activeLot.lotID,
      processID: activeLot.currentProcessID,
      inputQty: amount,
      goodQty: amount,
      badQty: 0
    });
  };

  const handleNextStage = () => {
    if (!activeOrder || !activeLot) return;
    const nextProcessId = activeLot.currentProcessID + 1;
    moveProcessMutation.mutate({
      perf: {
        workOrderID: activeOrder.orderID,
        lotID: activeLot.lotID,
        processID: activeLot.currentProcessID,
        inputQty: 0,
        goodQty: 0,
        badQty: 0
      },
      nextProcessId
    });
  };

  const handleComplete = () => {
    if (!activeOrderId) return;
    completeProductionMutation.mutate(activeOrderId);
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
        <WorkerOrderList 
          workOrders={workOrders} 
          lotTracking={lotTracking} 
          activeOrderId={activeOrderId} 
          onSelectOrder={setSelectedOrderId} 
          processStages={processStages}
        />

        {/* 우측: 공정 컨트롤러 패널 */}
        <WorkerControlPanel 
          activeOrder={activeOrder}
          activeLot={activeLot}
          processStages={processStages}
          onStart={handleStart}
          onIncreaseQty={handleIncreaseQty}
          onNextStage={handleNextStage}
          onComplete={handleComplete}
          isPending={{
            start: startProductionMutation.isPending,
            qty: registerPerformanceMutation.isPending,
            next: moveProcessMutation.isPending,
            complete: completeProductionMutation.isPending
          }}
        />
      </WorkerLayoutGrid>
    </DashboardContent>
  );
};

export default WorkerDashboard;
