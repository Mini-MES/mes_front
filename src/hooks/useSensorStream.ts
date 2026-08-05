import { useEffect, useRef, useState } from 'react';
import { useSignalRContext } from '@/context/SignalRContext';
import { SIGNALR_EVENTS, SENSOR_CONFIG } from '@/constants/signalr';

export function useSensorStream(targetLotId: string | null | undefined) {
  const { connection, isConnected } = useSignalRContext();
  const [accumulatedGood, setAccumulatedGood] = useState(0);
  const [accumulatedBad, setAccumulatedBad] = useState(0);
  const [lastPulseTime, setLastPulseTime] = useState<string | null>(null);

  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    setAccumulatedGood(0);
    setAccumulatedBad(0);
  }, [targetLotId]);

  useEffect(() => {
    if (!connection || !isConnected) return;

    const handleReceiveSensor = (data: any) => {
      if (!data) return;

      const incomingLotId = data.LotID ?? data.lotID;
      const goodInc = data.GoodIncrement ?? data.goodIncrement ?? 0;
      const badInc = data.BadIncrement ?? data.badIncrement ?? 0;

      if (incomingLotId && targetLotId && String(incomingLotId) === String(targetLotId)) {
        const now = Date.now();

        if (now - lastUpdateRef.current > SENSOR_CONFIG.THROTTLE_MS) {
          lastUpdateRef.current = now;
          if (goodInc > 0) setAccumulatedGood((prev) => prev + goodInc);
          if (badInc > 0) setAccumulatedBad((prev) => prev + badInc);
          setLastPulseTime(new Date().toLocaleTimeString());
        }
      }
    };

    connection.on(SIGNALR_EVENTS.RECEIVE_SENSOR_COUNT, handleReceiveSensor);
    connection.on(SIGNALR_EVENTS.RECEIVE_SENSOR_COUNT_LOWER, handleReceiveSensor);

    return () => {
      connection.off(SIGNALR_EVENTS.RECEIVE_SENSOR_COUNT, handleReceiveSensor);
      connection.off(SIGNALR_EVENTS.RECEIVE_SENSOR_COUNT_LOWER, handleReceiveSensor);
    };
  }, [connection, isConnected, targetLotId]);

  return {
    accumulatedGood,
    accumulatedBad,
    lastPulseTime,
    isConnected,
  };
}