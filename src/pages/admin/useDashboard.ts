import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customFetch } from '@/api/fetcher';
import { useApp } from '@/context/AppContext';
import { RawMaterial, WorkOrder, LotTracking } from '@/context/AppContext';

export const useDashboard = () => {
  const queryClient = useQueryClient();
  const { processStages } = useApp();

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
      alert('작업 지시가 정상적으로 등록되었으며, 새로운 LOT가 생성되었습니다.');
    },
    onError: (err: any) => {
      alert(`등록 에러: ${err.message}`);
    }
  });

  // 3. 생산 시작 Mutation
  const startOrderMutation = useMutation({
    mutationFn: (orderId: number) => 
      customFetch(`/Production/start/${orderId}`, {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      queryClient.invalidateQueries({ queryKey: ['rawMaterials'] });
      alert('생산이 시작되었습니다. 작업지시 상태가 변경되고 새로운 LOT가 활성화되었습니다.');
    },
    onError: (err: any) => {
      alert(`생산 시작 실패: ${err.message}`);
    }
  });

  // 4. 생산 완료 Mutation
  const completeOrderMutation = useMutation({
    mutationFn: (orderId: number) => 
      customFetch(`/Production/complete/${orderId}`, {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      queryClient.invalidateQueries({ queryKey: ['rawMaterials'] });
      alert('생산이 완료되었습니다.');
    },
    onError: (err: any) => {
      alert(`생산 완료 실패: ${err.message}`);
    }
  });

  // 5. 생산 지시 삭제 Mutation
  const deleteOrderMutation = useMutation({
    mutationFn: (orderId: number) => 
      customFetch(`/Production/order/${orderId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      queryClient.invalidateQueries({ queryKey: ['rawMaterials'] });
      alert('작업 지시가 삭제되었습니다.');
    },
    onError: (err: any) => {
      alert(`지시 삭제 실패: ${err.message}`);
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
      alert('완제품 출하 처리가 정상적으로 완료되었습니다.');
    },
    onError: (err: any) => {
      alert(`출하 등록 실패: ${err.message}`);
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

  return {
    rawMaterials,
    workOrders,
    lotTracking,
    processStages,
    handleOrderSubmit,
    handleStartOrder,
    handleCompleteOrder,
    handleDeleteOrder,
    handleShipmentSubmit,
    isCreatePending: createOrderMutation.isPending,
    isShipPending: shipProductMutation.isPending
  };
};
