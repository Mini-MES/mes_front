import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSignalRContext } from '@/context/SignalRContext';
import { useNotification } from '@/context/NotificationContext';

/**
 * SignalR 백엔드 이벤트를 구독하고 React Query 쿼리 캐시 갱신 및 전역 알림 토스트를 트리거하는 훅
 */
export const useSignalRListener = () => {
  const queryClient = useQueryClient();
  const { connection, isConnected } = useSignalRContext();
  const { addNotification } = useNotification();

  useEffect(() => {
    if (!connection || !isConnected) return;

    // 설비 상태 이벤트 수신
    const handleEquipmentStatusUpdated = (data?: any) => {
      console.log('⚡ [SignalR] EquipmentStatusUpdated 수신:', data);
      queryClient.invalidateQueries({ queryKey: ['equipments'] });
      queryClient.invalidateQueries({ queryKey: ['oeeSummary'] });
      queryClient.invalidateQueries({ queryKey: ['oeeStats'] });
    }

    const handleLotUpdated = (data?: any) => {
      console.log('⚡ [SignalR] LotUpdated 수신:', data);
      queryClient.invalidateQueries({ queryKey: ['lot-tracking'] });
      queryClient.invalidateQueries({ queryKey: ['work-orders'] });
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      queryClient.invalidateQueries({ queryKey: ['oeeSummary'] });
      queryClient.invalidateQueries({ queryKey: ['oeeStats'] });

      const lotId = data?.lotID || data?.lotId || data?.lotNumber || (typeof data === 'string' ? data : '');
      const status = (data?.status || data?.state || '').toString().toUpperCase();

      if (status === 'HOLD') {
        addNotification({
          type: 'HOLD',
          title: '🚨 LOT 품질 보류(HOLD) 발생',
          message: `LOT ${lotId ? `[${lotId}]` : ''} 공정 상태가 보류(HOLD)로 전환되었습니다.`,
        });
      }
    };

    const handleStockUpdated = (data?: any) => {
      console.log('⚡ [SignalR] StockUpdated 수신:', data);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['rawMaterials'] });

      const name = data?.productName || data?.materialName || data?.name || '원자재/부품';
      const isWarning =
        data?.isWarning ||
        data?.isLowStock ||
        data?.type === 'WARN' ||
        (data?.currentStock !== undefined &&
          data?.safetyStock !== undefined &&
          data.currentStock < data.safetyStock);

      if (isWarning) {
        addNotification({
          type: 'WARN',
          title: '⚠️ [재고 경고] 원자재 재고 부족',
          message: `${name} 의 재고가 안전 재고 미만입니다.`,
        });
      }
    };

    const handleWorkOrderUpdated = (data?: any) => {
      console.log('⚡ [SignalR] WorkOrderUpdated 수신:', data);
      queryClient.invalidateQueries({ queryKey: ['work-orders'] });
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['oeeSummary'] });
      queryClient.invalidateQueries({ queryKey: ['oeeStats'] });

      const orderNo = data?.workOrderID || data?.workOrderId || data?.orderNo || data?.orderID || (typeof data === 'string' ? data : '');
      const status = (data?.status || data?.state || '').toString().toUpperCase();

      if (status === 'COMPLETE' || status === 'COMPLETED' || data?.isComplete) {
        addNotification({
          type: 'SUCCESS',
          title: '✅ [완료] 작업지시 마감 완료',
          message: `작업지시 ${orderNo ? `[${orderNo}]` : ''} 생산 작업이 마감 완료되었습니다.`,
        });
      }
    };

    const handleDefectReported = (data?: any) => {
      console.log('⚡ [SignalR] DefectReported 수신:', data);
      queryClient.invalidateQueries({ queryKey: ['work-orders'] });
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['lot-tracking'] });
      queryClient.invalidateQueries({ queryKey: ['lots'] });
      queryClient.invalidateQueries({ queryKey: ['oeeSummary'] });
      queryClient.invalidateQueries({ queryKey: ['oeeStats'] });

      const lotId = data?.lotID || data?.lotId || data?.lotNumber || 'LOT';
      const reason = data?.reason || data?.reasonCode || data?.defectType || '불량 발생';
      const badQty = data?.badQty || data?.defectQty || data?.count;

      addNotification({
        type: 'HOLD',
        title: '🚨 LOT 품질 보류(HOLD) 발생',
        message: `LOT [${lotId}] 불량 ${badQty ? `${badQty}EA ` : ''}등록 (${reason}) - 보류 상태 전환`,
      });
    };

    const handleSensorCountUpdated = (data?: any) => {
      queryClient.invalidateQueries({ queryKey: ['equipments'] });
      queryClient.invalidateQueries({ queryKey: ['work-orders'] });
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      queryClient.invalidateQueries({ queryKey: ['oeeSummary'] });
      queryClient.invalidateQueries({ queryKey: ['oeeStats'] });
    };

    connection.on('LotUpdated', handleLotUpdated);
    connection.on('lotUpdated', handleLotUpdated);

    connection.on('StockUpdated', handleStockUpdated);
    connection.on('stockUpdated', handleStockUpdated);
    
    connection.on('ReceiveEquipmentStatusChanged', handleEquipmentStatusUpdated);
    connection.on('receiveEquipmentStatusChanged', handleEquipmentStatusUpdated);
    connection.on('EquipmentStatusUpdated', handleEquipmentStatusUpdated);
    connection.on('equipmentStatusUpdated', handleEquipmentStatusUpdated);

    connection.on('WorkOrderUpdated', handleWorkOrderUpdated);
    connection.on('workOrderUpdated', handleWorkOrderUpdated);

    connection.on('DefectReported', handleDefectReported);
    connection.on('defectReported', handleDefectReported);

    connection.on('ReceiveSensorCountUpdated', handleSensorCountUpdated);
    connection.on('receiveSensorCountUpdated', handleSensorCountUpdated);
    connection.on('SensorCountUpdated', handleSensorCountUpdated);
    connection.on('sensorCountUpdated', handleSensorCountUpdated);

    return () => {
      connection.off('LotUpdated', handleLotUpdated);
      connection.off('lotUpdated', handleLotUpdated);

      connection.off('StockUpdated', handleStockUpdated);
      connection.off('stockUpdated', handleStockUpdated);

      connection.off('ReceiveEquipmentStatusChanged', handleEquipmentStatusUpdated);
      connection.off('receiveEquipmentStatusChanged', handleEquipmentStatusUpdated);
      connection.off('EquipmentStatusUpdated', handleEquipmentStatusUpdated);
      connection.off('equipmentStatusUpdated', handleEquipmentStatusUpdated);

      connection.off('WorkOrderUpdated', handleWorkOrderUpdated);
      connection.off('workOrderUpdated', handleWorkOrderUpdated);

      connection.off('DefectReported', handleDefectReported);
      connection.off('defectReported', handleDefectReported);

      connection.off('ReceiveSensorCountUpdated', handleSensorCountUpdated);
      connection.off('receiveSensorCountUpdated', handleSensorCountUpdated);
      connection.off('SensorCountUpdated', handleSensorCountUpdated);
      connection.off('sensorCountUpdated', handleSensorCountUpdated);
    };
  }, [connection, isConnected, queryClient, addNotification]);
};
