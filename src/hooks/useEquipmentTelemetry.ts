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

    connection.on('ReceiveEquipmentTelemetryList', handleTelemetryList);
    connection.on('receiveEquipmentTelemetryList', handleTelemetryList);

    return () => {
      connection.off('ReceiveEquipmentTelemetryList', handleTelemetryList);
      connection.off('receiveEquipmentTelemetryList', handleTelemetryList);
    };
  }, [connection, isConnected]);

  return { telemetryMap, isConnected };
};
