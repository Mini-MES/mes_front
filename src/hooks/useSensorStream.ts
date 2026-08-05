import { useSignalRContext } from "@/context/SignalRContext";
import { useEffect, useRef, useState } from "react";

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
            console.log("Received sensor data:", data);

            if (!data) return;

            const incomingLotId = data.LotID ?? data.lotID;
            const goodInc = data.GoodIncrement ?? data.goodIncrement ?? 0;
            const badInc = data.BadIncrement ?? data.badIncrement ?? 0;

            if (incomingLotId && targetLotId && String(incomingLotId) === String(targetLotId)) {
                const now = Date.now();

                if (now - lastUpdateRef.current > 100) {
                    lastUpdateRef.current = now;
                    if (goodInc > 0) setAccumulatedGood(prev => prev + goodInc);
                    if (badInc > 0) setAccumulatedBad(prev => prev + badInc);
                    setLastPulseTime(new Date().toLocaleTimeString());
                }
            }
        };

        connection.on("ReceiveSensorCountUpdated", handleReceiveSensor);
        connection.on("receiveSensorCountUpdated", handleReceiveSensor);

        return () => {
            connection.off("ReceiveSensorCountUpdated", handleReceiveSensor);
            connection.off("receiveSensorCountUpdated", handleReceiveSensor);
        };
    }, [connection, isConnected, targetLotId]);

    return {
        accumulatedGood,
        accumulatedBad,
        lastPulseTime,
        isConnected
    };
}