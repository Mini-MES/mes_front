import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSignalRContext } from '@/context/SignalRContext';

/**
 * SignalR 백엔드 이벤트를 구독하고 React Query 쿼리 캐시를 실시간 갱신하는 훅
 */
export const useSignalRListener = () => {
  const queryClient = useQueryClient();
  const { connection, isConnected } = useSignalRContext();

  useEffect(() => {
    if (!connection || !isConnected) return;

    // LOT 공정 갱신 이벤트 수신
    const handleLotUpdated = (data?: any) => {
      console.log('⚡ [SignalR] LotUpdated 수신:', data);
      queryClient.invalidateQueries({ queryKey: ['lot-tracking'] });
      queryClient.invalidateQueries({ queryKey: ['work-orders'] });
    };

    // 재고 수량 갱신 이벤트 수신
    const handleStockUpdated = (data?: any) => {
      console.log('⚡ [SignalR] StockUpdated 수신:', data);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    };

    // 작업 지시 상태 갱신 이벤트 수신
    const handleWorkOrderUpdated = (data?: any) => {
      console.log('⚡ [SignalR] WorkOrderUpdated 수신:', data);
      queryClient.invalidateQueries({ queryKey: ['work-orders'] });
    };

    // 불량 보고 및 보류(HOLD) 전환 이벤트 수신
    const handleDefectReported = (data?: any) => {
      console.log('⚡ [SignalR] DefectReported 수신:', data);
      queryClient.invalidateQueries({ queryKey: ['work-orders'] });
      queryClient.invalidateQueries({ queryKey: ['lot-tracking'] });
    };

    // 이벤트 리스너 바인딩
    connection.on('LotUpdated', handleLotUpdated);
    connection.on('StockUpdated', handleStockUpdated);
    connection.on('WorkOrderUpdated', handleWorkOrderUpdated);
    connection.on('DefectReported', handleDefectReported);

    // 언마운트 시 이벤트 오프
    return () => {
      connection.off('LotUpdated', handleLotUpdated);
      connection.off('StockUpdated', handleStockUpdated);
      connection.off('WorkOrderUpdated', handleWorkOrderUpdated);
      connection.off('DefectReported', handleDefectReported);
    };
  }, [connection, isConnected, queryClient]);
};
