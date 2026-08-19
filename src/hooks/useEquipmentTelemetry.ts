import { useState, useEffect } from 'react';
import { useSignalRContext } from '@/context/SignalRContext';

export interface EquipmentTelemetry {
  equipmentId: string;
  temperature: number;
  status: string;
  totalCount: number;
  timestamp: string;
}

export const useEquipmentTelemetry = () => {
  const { connection, isConnected } = useSignalRContext();
  const [telemetryMap, setTelemetryMap] = useState<Record<string, EquipmentTelemetry>>({});

  useEffect(() => {
    if (!connection || !isConnected) return;

    const handleTelemetryList = (dataList: EquipmentTelemetry[]) => {
      if (Array.isArray(dataList)) {
        setTelemetryMap(prev => {
          const next = { ...prev };
          dataList.forEach(item => {
            if (item.equipmentId) {
              next[item.equipmentId] = item;
            }
          });
          return next;
        });
      }
    };

    const handleSensorCountUpdated = (data?: any) => {
      const equipmentId = data?.equipmentId ?? data?.EquipmentId ?? data?.equipmentID ?? data?.EquipmentID;
      const goodIncrement = Number(data?.goodIncrement ?? data?.GoodIncrement ?? 0);

      if (!equipmentId || !Number.isFinite(goodIncrement) || goodIncrement <= 0) return;

      setTelemetryMap(prev => {
        const current = prev[equipmentId];

        return {
          ...prev,
          [equipmentId]: {
            equipmentId,
            temperature: current?.temperature ?? 0,
            status: current?.status ?? 'RUNNING',
            totalCount: (current?.totalCount ?? 0) + goodIncrement,
            timestamp: new Date().toISOString(),
          },
        };
      });
    };

    connection.on('ReceiveEquipmentTelemetryList', handleTelemetryList);
    connection.on('receiveEquipmentTelemetryList', handleTelemetryList);
    connection.on('ReceiveSensorCountUpdated', handleSensorCountUpdated);
    connection.on('receiveSensorCountUpdated', handleSensorCountUpdated);

    return () => {
      connection.off('ReceiveEquipmentTelemetryList', handleTelemetryList);
      connection.off('receiveEquipmentTelemetryList', handleTelemetryList);
      connection.off('ReceiveSensorCountUpdated', handleSensorCountUpdated);
      connection.off('receiveSensorCountUpdated', handleSensorCountUpdated);
    };
  }, [connection, isConnected]);

  return { telemetryMap, isConnected };
};
