import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customFetch } from '@/api/fetcher';
import { WorkOrder, LotTracking } from '@/context/AppContext';
import { DefectReason } from '@/components/worker/WorkerControlPanel';

export function useWorkerDashboard() {
  const queryClient = useQueryClient();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // 1. 작업지시, LOT 목록 및 불량 사유 서버 조회
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

  const { data: defectReasons = [] } = useQuery<DefectReason[]>({
    queryKey: ['defectReasons'],
    queryFn: () => customFetch('/MasterData/defect-reasons'),
    staleTime: 1000 * 60 * 10,
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
    mutationFn: (perf: { 
      workOrderID: number; 
      lotID: string; 
      processID: number; 
      inputQty: number; 
      goodQty: number; 
      badQty: number; 
      toolID?: string; 
      reasonCode?: string;
    }) => 
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

  // 4. 공정 이동 Mutation
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

  const handleIncreaseQty = (amount: number, toolId?: string) => {
    if (!activeOrder || !activeLot) return;
    registerPerformanceMutation.mutate({
      workOrderID: activeOrder.orderID,
      lotID: activeLot.lotID,
      processID: activeLot.currentProcessID,
      inputQty: amount,
      goodQty: amount,
      badQty: 0,
      toolID: toolId?.trim() || undefined
    });
  };

  const handleRegisterDefect = (badQty: number, reasonCode: string, toolId?: string) => {
    if (!activeOrder || !activeLot) return;
    registerPerformanceMutation.mutate({
      workOrderID: activeOrder.orderID,
      lotID: activeLot.lotID,
      processID: activeLot.currentProcessID,
      inputQty: badQty,
      goodQty: 0,
      badQty: badQty,
      reasonCode: reasonCode || undefined,
      toolID: toolId?.trim() || undefined
    });
  };

  const handleNextStage = (toolId?: string) => {
    if (!activeOrder || !activeLot) return;
    const nextProcessId = activeLot.currentProcessID + 1;
    moveProcessMutation.mutate({
      perf: {
        workOrderID: activeOrder.orderID,
        lotID: activeLot.lotID,
        processID: activeLot.currentProcessID,
        inputQty: 0,
        goodQty: 0,
        badQty: 0,
        toolID: toolId?.trim() || undefined
      },
      nextProcessId
    });
  };

  const handleComplete = () => {
    if (!activeOrderId) return;
    completeProductionMutation.mutate(activeOrderId);
  };

  return {
    workOrders,
    lotTracking,
    defectReasons,
    activeOrderId,
    activeOrder,
    activeLot,
    setSelectedOrderId,
    handleStart,
    handleIncreaseQty,
    handleRegisterDefect,
    handleNextStage,
    handleComplete,
    isPending: {
      start: startProductionMutation.isPending,
      qty: registerPerformanceMutation.isPending,
      next: moveProcessMutation.isPending,
      complete: completeProductionMutation.isPending
    }
  };
}
