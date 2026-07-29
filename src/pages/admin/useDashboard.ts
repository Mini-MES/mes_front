import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customFetch } from '@/api/fetcher';
import { useApp } from '@/context/AppContext';
import { RawMaterial, WorkOrder, LotTracking } from '@/context/AppContext';
import { useNotification } from '@/context/NotificationContext';

export const useDashboard = () => {
  const queryClient = useQueryClient();
  const { processStages } = useApp();
  const { addNotification } = useNotification();

  // 1. React Query를 활용한 서버 상태 조회 (폴링 5초 주기로 실시간 연동)
  const { data: rawMaterials = [] } = useQuery<RawMaterial[]>({
    queryKey: ['rawMaterials'],
    queryFn: () => customFetch('/MasterData/products'),
    refetchInterval: 5000,
  });

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

  // 완제품 출하 이력 조회
  const { data: shipmentsResponse, isLoading: isShipmentsLoading } = useQuery<{ data: any[] }>({
    queryKey: ['shipments'],
    queryFn: () => customFetch('/Inventory/shipments'),
    refetchInterval: 5000,
  });

  const shipments = shipmentsResponse?.data || [];

  // 2. 신규 지시 등록 Mutation
  const createOrderMutation = useMutation({
    mutationFn: (newOrder: { productID: string; targetQty: number; startDate: string; dueDate: string }) => 
      customFetch('/Production/order', {
        method: 'POST',
        body: JSON.stringify(newOrder),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      queryClient.invalidateQueries({ queryKey: ['rawMaterials'] });
      addNotification({
        type: 'SUCCESS',
        title: '✅ [지시 등록] 신규 작업 지시 생성',
        message: '작업 지시가 정상 등록되었으며 새로운 LOT가 발행되었습니다.',
      });
    },
    onError: (err: any) => {
      addNotification({
        type: 'WARN',
        title: '⚠️ [지시 등록 실패]',
        message: err.message || '작업 지시 등록 중 오류가 발생했습니다.',
      });
    }
  });

  // 3. 생산 시작 Mutation
  const startOrderMutation = useMutation({
    mutationFn: (orderId: number) => 
      customFetch(`/Production/start/${orderId}`, {
        method: 'POST',
      }),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      queryClient.invalidateQueries({ queryKey: ['rawMaterials'] });
      addNotification({
        type: 'SUCCESS',
        title: '▶️ [생산 시작] 생산 투입 완료',
        message: `작업지시 [ORDER-${orderId}] 생산 프로세스가 시작되었습니다.`,
      });
    },
    onError: (err: any) => {
      const msg = err.message || '원자재 재고가 부족하거나 시작할 수 없는 상태입니다.';
      addNotification({
        type: 'WARN',
        title: '⚠️ [생산 지시 불가] 원자재 재고 부족 경고',
        message: `원자재 부족으로 생산을 시작할 수 없습니다: ${msg}`,
      });
    }
  });

  // 4. 생산 완료 Mutation
  const completeOrderMutation = useMutation({
    mutationFn: (orderId: number) => 
      customFetch(`/Production/complete/${orderId}`, {
        method: 'POST',
      }),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      queryClient.invalidateQueries({ queryKey: ['rawMaterials'] });
      addNotification({
        type: 'SUCCESS',
        title: '✅ [완료] 작업지시 마감 완료',
        message: `작업지시 [ORDER-${orderId}] 생산 마감 처리가 완료되었습니다.`,
      });
    },
    onError: (err: any) => {
      addNotification({
        type: 'WARN',
        title: '⚠️ [생산 완료 실패]',
        message: err.message || '생산 완료 처리 실패',
      });
    }
  });

  // 5. 생산 지시 삭제 Mutation
  const deleteOrderMutation = useMutation({
    mutationFn: (orderId: number) => 
      customFetch(`/Production/order/${orderId}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      queryClient.invalidateQueries({ queryKey: ['rawMaterials'] });
      addNotification({
        type: 'INFO',
        title: '🗑️ [지시 삭제]',
        message: `작업지시 [ORDER-${orderId}]가 삭제되었습니다.`,
      });
    },
    onError: (err: any) => {
      addNotification({
        type: 'WARN',
        title: '⚠️ [지시 삭제 실패]',
        message: err.message || '작업지시 삭제 실패',
      });
    }
  });

  // 6. 완제품 출하 Mutation
  const shipProductMutation = useMutation({
    mutationFn: (shipment: { productID: string; workOrderID: number; quantity: number; destination: string }) => 
      customFetch('/Inventory/ship', {
        method: 'POST',
        body: JSON.stringify(shipment),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rawMaterials'] });
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      addNotification({
        type: 'SUCCESS',
        title: '📦 [완제품 출하]',
        message: '완제품 출하 처리가 완료되었습니다.',
      });
    },
    onError: (err: any) => {
      addNotification({
        type: 'WARN',
        title: '⚠️ [출하 등록 실패]',
        message: err.message || '출하 등록 처리 실패',
      });
    }
  });

  // 7. 자재 신규 등록 Mutation
  const createMaterialMutation = useMutation({
    mutationFn: (newMaterial: { productID: string; productName: string; itemType: number; stockQty: number; safetyQty: number }) => 
      customFetch('/MasterData/product', {
        method: 'POST',
        body: JSON.stringify({
          productID: newMaterial.productID,
          productName: newMaterial.productName,
          itemType: newMaterial.itemType,
          stockQty: newMaterial.stockQty,
          safetyStock: newMaterial.safetyQty
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rawMaterials'] });
      addNotification({
        type: 'SUCCESS',
        title: '🧱 [원자재 등록]',
        message: '신규 원자재 품목이 등록되었습니다.',
      });
    },
    onError: (err: any) => {
      addNotification({
        type: 'WARN',
        title: '⚠️ [자재 등록 실패]',
        message: err.message || '자재 등록 실패',
      });
    }
  });

  // 8. 자재 재고 입고/수정 Mutation
  const updateStockMutation = useMutation({
    mutationFn: ({ materialId, stockQty, materialName, safetyQty }: { materialId: string; stockQty: number; materialName: string; safetyQty: number }) => 
      customFetch(`/Inventory/update-stock/${materialId}`, {
        method: 'POST',
        body: JSON.stringify({ 
          stockQty, 
          materialName, 
          safetyStock: safetyQty
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rawMaterials'] });
      addNotification({
        type: 'SUCCESS',
        title: '📥 [재고 업데이트]',
        message: '자재 재고 수량이 업데이트되었습니다.',
      });
    },
    onError: (err: any) => {
      addNotification({
        type: 'WARN',
        title: '⚠️ [재고 수정 실패]',
        message: err.message || '재고 수정 실패',
      });
    }
  });

  // 9. Lot 보류 해제 Mutation
  const unholdLotMutation = useMutation({
    mutationFn: (lotId: string) => 
      customFetch(`/Production/lot/${lotId}/unhold`, {
        method: 'PUT',
      }),
    onSuccess: (_, lotId) => {
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      addNotification({
        type: 'SUCCESS',
        title: '🔓 [보류 해제 완료]',
        message: `LOT [${lotId}] 보류(HOLD)가 해제되어 공정이 재개됩니다.`,
      });
    },
    onError: (err: any) => {
      addNotification({
        type: 'WARN',
        title: '⚠️ [보류 해제 실패]',
        message: err.message || '보류 해제 처리 실패',
      });
    }
  });

  const handleOrderSubmit = (order: { productID: string; planQty: number }) => {
    createOrderMutation.mutate({
      productID: order.productID,
      targetQty: order.planQty,
      startDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString()
    });
  };

  const handleStartOrder = (orderId: number) => {
    startOrderMutation.mutate(orderId);
  };

  const handleCompleteOrder = (orderId: number) => {
    completeOrderMutation.mutate(orderId);
  };

  const handleDeleteOrder = (orderId: number) => {
    deleteOrderMutation.mutate(orderId);
  };

  const handleShipmentSubmit = (shipment: { productID: string; workOrderID: number; quantity: number; destination: string }) => {
    shipProductMutation.mutate(shipment);
  };

  const handleCreateMaterial = (material: { productID: string; productName: string; stockQty: number; safetyQty: number }) => {
    createMaterialMutation.mutate({
      ...material,
      itemType: 2 // RawMaterial로 고정
    });
  };

  const handleUpdateStock = (materialId: string, stockQty: number, materialName: string, safetyQty: number) => {
    updateStockMutation.mutate({
      materialId,
      stockQty,
      materialName,
      safetyQty
    });
  };

  const handleUnholdLot = (lotId: string) => {
    if (confirm(`LOT ID [${lotId}]의 보류(HOLD) 상태를 해제하시겠습니까?`)) {
      unholdLotMutation.mutate(lotId);
    }
  };

  return {
    rawMaterials,
    workOrders,
    lotTracking,
    processStages,
    shipments,
    isShipmentsLoading,
    handleOrderSubmit,
    handleStartOrder,
    handleCompleteOrder,
    handleDeleteOrder,
    handleShipmentSubmit,
    handleCreateMaterial,
    handleUpdateStock,
    handleUnholdLot,
    isCreatePending: createOrderMutation.isPending,
    isShipPending: shipProductMutation.isPending,
    isMaterialPending: createMaterialMutation.isPending || updateStockMutation.isPending,
    isUnholdPending: unholdLotMutation.isPending,
    unholdingLotId: unholdLotMutation.variables
  };
};
