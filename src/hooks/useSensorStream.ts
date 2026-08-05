import { useEffect, useRef, useState, useCallback } from 'react';
import { useSignalRContext } from '@/context/SignalRContext';
import { SIGNALR_EVENTS, SENSOR_CONFIG } from '@/constants/signalr';
import { SensorStatus } from '@/types/sensor';

export function useSensorStream(
  targetLotId: string | null | undefined,
  sensorStatus: SensorStatus = 'RUNNING',
  currentProcessId?: number
) {
  const { connection, isConnected } = useSignalRContext();
  const [accumulatedGood, setAccumulatedGood] = useState(0);
  const [accumulatedBad, setAccumulatedBad] = useState(0);
  const [lastPulseTime, setLastPulseTime] = useState<string | null>(null);

  // 모든 펄스를 누락 없이 저장하기 위한 버퍼 Ref
  const pendingGoodRef = useRef<number>(0);
  const pendingBadRef = useRef<number>(0);
  const sensorStatusRef = useRef<SensorStatus>(sensorStatus);

  // 최신 sensorStatus를 ref에 동기화 (이벤트 클로저 이슈 방지)
  useEffect(() => {
    sensorStatusRef.current = sensorStatus;
  }, [sensorStatus]);

  const prevLotIdRef = useRef<string | null>(targetLotId);
  const prevProcessIdRef = useRef<number | undefined>(currentProcessId);

  // LOT 또는 공정 변경 시 누적 수량 및 버퍼 리셋
  useEffect(() => {
    if (prevLotIdRef.current !== targetLotId || prevProcessIdRef.current !== currentProcessId) {
      console.log('🔄 [useSensorStream] LOT ID 또는 공정 변경됨 - 수량 초기화:', { 
        prevLot: prevLotIdRef.current, nextLot: targetLotId,
        prevProc: prevProcessIdRef.current, nextProc: currentProcessId 
      });
      prevLotIdRef.current = targetLotId;
      prevProcessIdRef.current = currentProcessId;
      setAccumulatedGood(0);
      setAccumulatedBad(0);
      setLastPulseTime(null);
      pendingGoodRef.current = 0;
      pendingBadRef.current = 0;
    }
  }, [targetLotId, currentProcessId]);

  // 주기적으로 버퍼에 쌓인 펄스 수량을 React 상태로 일괄 반영 (이벤트 유실 원천 방지)
  useEffect(() => {
    const timer = setInterval(() => {
      if (pendingGoodRef.current > 0) {
        const addGood = pendingGoodRef.current;
        pendingGoodRef.current = 0;
        console.log('⚡ [useSensorStream] React 상태로 펄스 반영 (+' + addGood + ' EA)');
        setAccumulatedGood((prev) => prev + addGood);
        setLastPulseTime(new Date().toLocaleTimeString());
      }
      if (pendingBadRef.current > 0) {
        const addBad = pendingBadRef.current;
        pendingBadRef.current = 0;
        console.log('⚡ [useSensorStream] 불량 펄스 반영 (+' + addBad + ' EA)');
        setAccumulatedBad((prev) => prev + addBad);
        setLastPulseTime(new Date().toLocaleTimeString());
      }
    }, SENSOR_CONFIG.THROTTLE_MS);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!connection || !isConnected) return;

    const handleReceiveSensor = (data: any) => {
      if (!data) return;

      const incomingLotId = String(data.LotID ?? data.lotID ?? data.LotId ?? '').trim().toUpperCase();
      const targetId = String(targetLotId ?? '').trim().toUpperCase();
      const goodInc = Number(data.GoodIncrement ?? data.goodIncrement ?? data.GoodCount ?? 0);
      const badInc = Number(data.BadIncrement ?? data.badIncrement ?? data.BadCount ?? 0);

      console.log('📡 [Sensor Stream Data]:', { incomingLotId, targetId, goodInc, status: sensorStatusRef.current });

      // 일시 중지(STOPPED), 유휴(IDLE), 에러(ERROR) 등 센서 정지 상태일 때는 수집 차단
      if (sensorStatusRef.current !== 'RUNNING') {
        console.log('⏸️ [Sensor Stream] 센서 정지/일시중지 상태 - 수집 스킵:', sensorStatusRef.current);
        return;
      }

      if (!targetId || incomingLotId === targetId) {
        if (goodInc > 0) pendingGoodRef.current += goodInc;
        if (badInc > 0) pendingBadRef.current += badInc;
      }
    };

    connection.on(SIGNALR_EVENTS.RECEIVE_SENSOR_COUNT, handleReceiveSensor);

    return () => {
      connection.off(SIGNALR_EVENTS.RECEIVE_SENSOR_COUNT, handleReceiveSensor);
    };
  }, [connection, isConnected, targetLotId]);

  // 승인 완료 후 전송된 수량을 차감하는 리셋 핸들러 (승인 처리 중 새로 들어온 펄스 유실 방지)
  const resetAccumulated = useCallback((confirmedGood: number, confirmedBad: number) => {
    setAccumulatedGood((prev) => Math.max(0, prev - confirmedGood));
    setAccumulatedBad((prev) => Math.max(0, prev - confirmedBad));
  }, []);

  return {
    accumulatedGood,
    accumulatedBad,
    lastPulseTime,
    isConnected,
    resetAccumulated,
  };
}