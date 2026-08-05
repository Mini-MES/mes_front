import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customFetch } from '@/api/fetcher';
import { WorkOrder, LotTracking } from '@/context/AppContext';
import { useNotification } from '@/context/NotificationContext';
import { DefectReason, SensorStatus } from '@/types';
import { useSensorStream } from '@/hooks/useSensorStream';

export function useWorkerDashboard() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotification();
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

  const { data: processes = [] } = useQuery<any[]>({
    queryKey: ['processes'],
    queryFn: () => customFetch('/MasterData/processes'),
    staleTime: 1000 * 60 * 10,
  });

  // 현재 활성화된 지시 및 LOT 확인
  const activeOrderId = selectedOrderId || workOrders[0]?.orderID || null;
  const activeOrder = workOrders.find((o) => o.orderID === activeOrderId);
  const activeLot = lotTracking.find((l) => l.orderID === activeOrderId);

  // 센서 수량 수신 & 상태 관리
  const [sensorStatus, setSensorStatus] = useState<SensorStatus>('IDLE');

  const {
    accumulatedGood,
    accumulatedBad,
    lastPulseTime,
    isConnected,
    resetAccumulated,
  } = useSensorStream(activeLot?.lotID || null, sensorStatus, activeLot?.currentProcessID);

  // SignalR 연결 상태 및 주문 상태에 따른 센서 상태 자동 업데이트
  useEffect(() => {
    if (!isConnected) {
      setSensorStatus('ERROR');
    } else if (activeOrder && activeOrder.status !== 'Completed') {
      setSensorStatus((prev) => (prev === 'STOPPED' ? 'STOPPED' : 'RUNNING'));
    } else {
      setSensorStatus('IDLE');
    }
  }, [activeOrder, isConnected]);

  // 💡 선택된 activeLot이 변경될 때 백엔드 설비의 CurrentLotID를 해당 LotID(BNOA56 등)로 즉시 바인딩
  useEffect(() => {
    if (activeLot?.lotID && isConnected && activeOrder?.status === 'InProgress') {
      console.log('🔗 [useWorkerDashboard] 백엔드 설비에 CurrentLotID 동기화:', activeLot.lotID);
      customFetch('/Equipment/status', {
        method: 'POST',
        body: JSON.stringify({
          equipmentID: 'EQ-CNC-01',
          newStatus: 'RUNNING',
          currentLotID: activeLot.lotID,
        }),
      })
        .then(() => queryClient.invalidateQueries({ queryKey: ['equipments'] }))
        .catch((err) => console.warn('Equipment lot sync error:', err));
    }
  }, [activeLot?.lotID, activeOrder?.status, isConnected, queryClient]);

  // 2. 생산 시작 Mutation
  const startProductionMutation = useMutation({
    mutationFn: async (orderId: number) => {
      const res = await customFetch(`/Production/start/${orderId}`, { method: 'POST' });
      
      // 설비 상태를 RUNNING으로 전환하고 현재 LotID를 백엔드 설비에 동기화
      const targetLot = lotTracking.find((l) => l.orderID === orderId);
      const lotId = targetLot?.lotID || activeLot?.lotID;
      
      if (lotId) {
        try {
          await customFetch('/Equipment/status', {
            method: 'POST',
            body: JSON.stringify({
              equipmentID: 'EQ-CNC-01',
              newStatus: 'RUNNING',
              currentLotID: lotId,
            }),
          });
        } catch (e) {
          console.warn('Equipment sync skipped:', e);
        }
      }
      return res;
    },
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      queryClient.invalidateQueries({ queryKey: ['equipments'] });
      setSensorStatus('RUNNING');
      addNotification({
        type: 'SUCCESS',
        title: '▶️ [생산 시작] 생산 투입 완료',
        message: `작업지시 [ORDER-${orderId}] 생산 프로세스가 시작되었습니다.`,
      });
    },
    onError: (err: any) => {
      const msg = err?.message || '원자재 재고가 부족하거나 시작할 수 없는 상태입니다.';
      addNotification({
        type: 'WARN',
        title: '⚠️ [생산 지시 불가] 원자재 재고 부족 경고',
        message: `원자재 부족으로 생산을 시작할 수 없습니다: ${msg}`,
      });
    },
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
        body: JSON.stringify(perf),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      queryClient.invalidateQueries({ queryKey: ['rawMaterials'] });

      // 💡 승인 등록된 실적 수량을 누적 버퍼에서 차감하여 중복 등록 방지
      resetAccumulated(variables.goodQty, variables.badQty);

      if (variables.badQty > 0) {
        addNotification({
          type: 'HOLD',
          title: '🚨 LOT 품질 보류(HOLD) 발생',
          message: `LOT [${variables.lotID}] 불량 ${variables.badQty}EA 등록 (${variables.reasonCode || 'SCRATCH'}) - 보류 상태 전환`,
        });
      } else {
        addNotification({
          type: 'SUCCESS',
          title: '✅ [실적 승인 완료]',
          message: '센서 수집 실적이 등록되었습니다.',
        });
      }
    },
    onError: (err: any) => {
      const msg = err?.message || '실적 등록 실패';
      addNotification({
        type: 'WARN',
        title: '⚠️ [실적 등록 실패]',
        message: msg,
      });
    },
  });

  // 4. 공정 이동 Mutation
  const moveProcessMutation = useMutation({
    mutationFn: ({ perf, nextProcessId }: { perf: any; nextProcessId: number }) =>
      customFetch(`/Production/performance/move?nextProcessId=${nextProcessId}`, {
        method: 'POST',
        body: JSON.stringify(perf),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      queryClient.invalidateQueries({ queryKey: ['rawMaterials'] });
      if (variables.perf) {
        resetAccumulated(variables.perf.goodQty || 0, variables.perf.badQty || 0);
      }
      addNotification({
        type: 'SUCCESS',
        title: '🔄 [공정 이동] 성공',
        message: '다음 공정 단계로 성공적으로 이동되었습니다.',
      });
    },
    onError: (err: any) => {
      const msg = err?.message || '공정 이동 실패';
      addNotification({
        type: 'WARN',
        title: '⚠️ [공정 이동 실패] 오류 발생',
        message: msg,
      });
    },
  });

  // 5. 생산 완료 마감 Mutation
  const completeProductionMutation = useMutation({
    mutationFn: (orderId: number) =>
      customFetch(`/Production/complete/${orderId}`, { method: 'POST' }),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      setSensorStatus('IDLE');
      addNotification({
        type: 'SUCCESS',
        title: '✅ [완료] 작업지시 마감 완료',
        message: `작업지시 [ORDER-${orderId}] 생산 작업 마감 완료`,
      });
    },
    onError: (err: any) => {
      const msg = err?.message || '마감 처리 실패';
      addNotification({
        type: 'WARN',
        title: '⚠️ [마감 실패] 오류 발생',
        message: msg,
      });
    },
  });

  const handleStart = () => {
    if (!activeOrderId) return;
    startProductionMutation.mutate(activeOrderId);
  };

  const handleTogglePause = () => {
    setSensorStatus((prev) => (prev === 'RUNNING' ? 'STOPPED' : 'RUNNING'));
  };

  const handleConfirmPerformance = (toolId?: string) => {
    if (!activeOrder || !activeLot) return;
    if (accumulatedGood + accumulatedBad <= 0) return;

    registerPerformanceMutation.mutate({
      workOrderID: activeOrder.orderID,
      lotID: activeLot.lotID,
      processID: activeLot.currentProcessID,
      inputQty: accumulatedGood + accumulatedBad,
      goodQty: accumulatedGood,
      badQty: accumulatedBad,
      toolID: toolId?.trim() || undefined,
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
      toolID: toolId?.trim() || undefined,
    });
  };

  const handleNextStage = (toolId?: string) => {
    if (!activeOrder || !activeLot) return;

    let nextProcessId = activeLot.currentProcessID + 1;
    if (processes.length > 0) {
      const currentProc = processes.find((p: any) => p.processID === activeLot.currentProcessID);
      const sortedProcs = [...processes].sort((a: any, b: any) => (a.sequenceOrder ?? 0) - (b.sequenceOrder ?? 0));
      const nextProc = currentProc
        ? sortedProcs.find((p: any) => (p.sequenceOrder ?? 0) > (currentProc.sequenceOrder ?? 0))
        : sortedProcs.find((p: any) => p.processID > activeLot.currentProcessID);

      if (nextProc) {
        nextProcessId = nextProc.processID;
      }
    }

    const inputQty = accumulatedGood + accumulatedBad;
    moveProcessMutation.mutate({
      perf: {
        workOrderID: activeOrder.orderID,
        lotID: activeLot.lotID,
        processID: activeLot.currentProcessID,
        inputQty: inputQty,
        goodQty: accumulatedGood,
        badQty: accumulatedBad,
        toolID: toolId?.trim() || undefined,
      },
      nextProcessId,
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
    sensorStatus,
    accumulatedGood,
    accumulatedBad,
    lastPulseTime,
    isConnected,
    setSelectedOrderId,
    handleStart,
    handleTogglePause,
    handleConfirmPerformance,
    handleRegisterDefect,
    handleNextStage,
    handleComplete,
    isPending: {
      start: startProductionMutation.isPending,
      confirm: registerPerformanceMutation.isPending,
      next: moveProcessMutation.isPending,
      complete: completeProductionMutation.isPending,
    },
  };
}
